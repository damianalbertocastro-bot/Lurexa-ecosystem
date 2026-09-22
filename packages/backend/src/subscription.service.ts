import type { BusinessContract, BusinessUsageRecord, EntitlementCapability, PlanQuotas, ProductEntryPoint, ResolvedEntitlements, SubscriptionTier } from "@lurexa/types";
import { DEFAULT_TIER_QUOTAS } from "@lurexa/types";

const PRODUCT_CAPABILITIES: Record<ProductEntryPoint, EntitlementCapability[]> = {
  LEARN: ["curriculum_access", "offline_learning"],
  COACH: ["coach_access"],
  TEACH: [],
  ADMIN: [],
  STUDIO: [],
  INSIGHT: [],
};

const TIER_HIERARCHY: Record<string, number> = {
  basic: 1,
  plus: 2,
  ultra: 3,
};

const DEFAULT_TRIAL_MODULES = ["A1.M1", "A1.M2", "A1.M3"];

/**
 * Authoritative subscription and entitlement evaluation service for Lurexa Core & Mind.
 */
export const SubscriptionService = {
  /**
   * Evaluates whether a user's subscription tier satisfies or exceeds the required tier.
   */
  hasTierAccess(userTier?: SubscriptionTier | string | null, requiredTier: SubscriptionTier = "basic"): boolean {
    if (!userTier) return false;
    const userRank = TIER_HIERARCHY[String(userTier).toLowerCase()] ?? 0;
    const requiredRank = TIER_HIERARCHY[String(requiredTier).toLowerCase()] ?? 1;
    return userRank >= requiredRank;
  },

  /**
   * Retrieves calibrated plan quotas for a subscription tier.
   */
  getPlanQuotas(tier: SubscriptionTier = "basic"): PlanQuotas {
    const normalized = (String(tier).toLowerCase() as SubscriptionTier);
    const quotas = DEFAULT_TIER_QUOTAS[normalized] ?? DEFAULT_TIER_QUOTAS.basic;
    return {
      tier: normalized,
      maxAiTurns: quotas.maxAiTurns ?? quotas.monthlyAiTurns ?? 40,
      maxVoiceMinutes: quotas.maxVoiceMinutes ?? quotas.monthlyVoiceMinutes ?? 15,
      allowCrossProductSync: quotas.allowCrossProductSync ?? false,
      allowCapstones: quotas.allowCapstones ?? false,
      allowOfflineCaching: quotas.allowOfflineCaching ?? false,
      monthlyAiTurns: quotas.monthlyAiTurns,
      monthlyVoiceMinutes: quotas.monthlyVoiceMinutes,
      offlineModulesAllowed: quotas.offlineModulesAllowed,
      streamingAudioEnabled: quotas.streamingAudioEnabled,
      universalLearnerModelSync: quotas.universalLearnerModelSync,
      cohortAnalyticsEnabled: quotas.cohortAnalyticsEnabled,
    };
  },

  /**
   * Resolves product-specific capabilities from the canonical commercial contract.
   * Business contracts are organization-scoped; individual tiers remain product-scoped.
   */
  resolveEntitlements(input: {
    tier?: SubscriptionTier | string | null;
    product: ProductEntryPoint;
    subscribedProduct?: ProductEntryPoint | null;
    businessContract?: BusinessContract | null;
  }): ResolvedEntitlements {
    if (input.businessContract) {
      const contract = input.businessContract;
      const productAllowed = contract.productAccess.includes(input.product as BusinessContract["productAccess"][number]);
      const capabilities = productAllowed
        ? Array.from(new Set([
            ...(contract.capabilities as EntitlementCapability[]),
            ...(input.product === "LEARN" ? ["curriculum_access" as const] : []),
            ...(input.product === "COACH" ? ["coach_access" as const] : []),
          ]))
        : [];
      return {
        product: input.product,
        capabilities,
        monthlyAiTurns: contract.usageAllowance?.monthlyAiTurns ?? 0,
        monthlyVoiceMinutes: contract.usageAllowance?.monthlyVoiceMinutes ?? 0,
        offlineModulesAllowed: productAllowed ? Number.MAX_SAFE_INTEGER : 0,
        streamingAudioEnabled: productAllowed,
        source: "business_contract",
      };
    }

    const tier = String(input.tier ?? "basic").toLowerCase() as SubscriptionTier;
    const quotas = this.getPlanQuotas(tier);
    const capabilities: EntitlementCapability[] = tier === "basic"
      ? (input.product === "LEARN" || input.product === "COACH" ? ["curriculum_access"] : [])
      : [...(PRODUCT_CAPABILITIES[input.product] ?? [])];
    if (this.hasTierAccess(tier, "ultra")) {
      if (input.product === "LEARN") capabilities.push("premium_voice", "cross_product_sync", "capstone_evaluation");
      if (input.product === "COACH") capabilities.push("premium_voice", "cross_product_sync");
    }
    if (input.subscribedProduct === input.product && quotas.premiumVoiceProducts?.includes(input.product)) capabilities.push("premium_voice");
    if (this.hasTierAccess(tier, "plus") && input.product === "LEARN") capabilities.push("curriculum_access");
    if (this.hasTierAccess(tier, "plus") && input.product === "COACH") capabilities.push("coach_access");
    if (input.product === "COACH" && quotas.streamingAudioEnabled) capabilities.push("live_streaming");
    if (this.hasTierAccess(tier, "plus")) capabilities.push("offline_learning");
    return {
      product: input.product,
      capabilities: Array.from(new Set(capabilities)),
      monthlyAiTurns: quotas.monthlyAiTurns,
      monthlyVoiceMinutes: quotas.monthlyVoiceMinutes,
      offlineModulesAllowed: quotas.offlineModulesAllowed,
      streamingAudioEnabled: quotas.streamingAudioEnabled,
      source: "individual_tier",
    };
  },

  /** Returns pooled Business usage remaining for the current contract period. */
  getBusinessUsageRemaining(input: { contract: BusinessContract; usage: BusinessUsageRecord }): { aiTurns: number; voiceMinutes: number } {
    const allowance = input.contract.usageAllowance;
    if (!allowance) return { aiTurns: Number.POSITIVE_INFINITY, voiceMinutes: Number.POSITIVE_INFINITY };
    return {
      aiTurns: Math.max(0, allowance.monthlyAiTurns - input.usage.aiTurnsUsed),
      voiceMinutes: Math.max(0, allowance.monthlyVoiceMinutes - input.usage.voiceMinutesUsed),
    };
  },

  /** Checks a proposed pooled Business usage increment before runtime enforcement. */
  canConsumeBusinessUsage(input: { contract: BusinessContract; usage: BusinessUsageRecord; aiTurns?: number; voiceMinutes?: number }): boolean {
    const remaining = this.getBusinessUsageRemaining(input);
    return (input.aiTurns ?? 0) <= remaining.aiTurns && (input.voiceMinutes ?? 0) <= remaining.voiceMinutes;
  },

  /**
   * Verifies if a given module is unlocked for the user's active tier or explicit module entitlements.
   */
  isModuleUnlocked(
    userTier: SubscriptionTier = "basic",
    moduleId: string,
    unlockedModules?: string[] | null,
  ): boolean {
    // 1. Explicit full unlock entitlement
    if (unlockedModules?.includes("ALL")) {
      return true;
    }

    // 2. Explicit module grant
    if (unlockedModules?.includes(moduleId)) {
      return true;
    }

    // 3. Ultra unlocks all standard individual curriculum modules.
    if (this.hasTierAccess(userTier, "ultra")) {
      return true;
    }

    // 4. Plus tier unlocks standard product modules
    if (this.hasTierAccess(userTier, "plus")) {
      return true;
    }

    // 5. Basic tier defaults to calibrated trial modules
    return DEFAULT_TRIAL_MODULES.includes(moduleId);
  },

  /**
   * Whether the user tier allows Capstone modules (requires Ultra).
   */
  canAccessCapstones(userTier?: SubscriptionTier | string | null): boolean {
    return this.hasTierAccess(userTier as SubscriptionTier, "ultra");
  },

  /**
   * Whether the user tier permits Universal Learner Model cross-product sync (Learn <-> Coach).
   */
  canSyncCrossProduct(userTier?: SubscriptionTier | string | null): boolean {
    return this.hasTierAccess(userTier as SubscriptionTier, "ultra");
  },

  /**
   * Whether the user tier permits offline caching and PWA module downloads.
   */
  canDownloadOffline(userTier?: SubscriptionTier | string | null): boolean {
    return this.hasTierAccess(userTier as SubscriptionTier, "plus");
  },
};

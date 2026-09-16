import type { SubscriptionTier, PlanQuotas } from "@lurexa/types";
import { DEFAULT_TIER_QUOTAS } from "@lurexa/types";

const TIER_HIERARCHY: Record<string, number> = {
  basic: 1,
  plus: 2,
  ultra: 3,
  enterprise: 4,
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

    // 3. Ultra and Enterprise tiers unlock all standard curriculum modules
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
   * Whether the user tier allows Capstone modules (requires Ultra or Enterprise).
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

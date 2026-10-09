/** Individual commercial tiers. Business is an organization-contract model, not an individual tier. */
export type CanonicalSubscriptionTier = "basic" | "plus" | "ultra";
export type LegacySubscriptionTier = "BASIC" | "PLUS" | "ULTRA";
export type SubscriptionTier = CanonicalSubscriptionTier | LegacySubscriptionTier;
export type TierIdentifier = "basic" | "plus" | "ultra" | "business";

export type ProductEntryPoint =
  | "LEARN"
  | "COACH"
  | "TEACH"
  | "ADMIN"
  | "STUDIO"
  | "INSIGHT";

export type BusinessCapability =
  | "groups"
  | "assignments"
  | "analytics"
  | "reporting"
  | "role_management"
  | "audit"
  | "sso"
  | "data_export"
  | "teacher_admin_management"
  | "custom_curriculum"
  | "studio_authoring"
  | "branding"
  | "integrations";

export type BusinessProduct =
  | "LEARN"
  | "COACH"
  | "TEACH"
  | "ADMIN"
  | "INSIGHT"
  | "STUDIO";

export type EntitlementCapability =
  | "curriculum_access"
  | "coach_access"
  | "premium_voice"
  | "cross_product_sync"
  | "offline_learning"
  | "capstone_evaluation"
  | "groups"
  | "assignments"
  | "analytics"
  | "reporting"
  | "role_management"
  | "audit"
  | "sso"
  | "data_export"
  | "teacher_admin_management"
  | "custom_curriculum"
  | "studio_authoring"
  | "branding"
  | "integrations";

export interface ResolvedEntitlements {
  product: ProductEntryPoint;
  capabilities: EntitlementCapability[];
  monthlyAiTurns: number;
  monthlyVoiceMinutes: number;
  offlineModulesAllowed: number;
  streamingAudioEnabled: boolean;
  source: "individual_tier" | "business_contract";
}

export interface BusinessUsageAllowance {
  monthlyAiTurns: number;
  monthlyVoiceMinutes: number;
  learnerOrSeatAllowance?: number;
}

export interface BusinessUsageRecord {
  organizationId: string;
  learnerId?: string;
  periodStart: string;
  periodEnd: string;
  aiTurnsUsed: number;
  voiceMinutesUsed: number;
}

export interface BusinessContract {
  model: "organization_contract";
  targetMarket: "small_medium";
  productAccess: BusinessProduct[];
  learnerOrSeatAllowance?: number;
  usageModel: "pooled_with_optional_individual_limits";
  capabilities: BusinessCapability[];
  support: "negotiated";
  customization: Array<
    "custom_curriculum" | "studio_authoring" | "branding" | "integrations"
  >;
  pricing: "contract_quote";
  usageAllowance?: BusinessUsageAllowance;
}

export interface ProductScopedVoiceEntitlement {
  product: ProductEntryPoint;
  provider: "elevenlabs";
  included: boolean;
}

/** Plus includes premium ElevenLabs only for the subscribed eligible product. */
export const PLUS_ELEVENLABS_ENTITLEMENTS: ProductScopedVoiceEntitlement[] = [
  { product: "LEARN", provider: "elevenlabs", included: true },
  { product: "COACH", provider: "elevenlabs", included: true },
];

export interface PlanQuotas {
  maxAiTurns: number;
  maxVoiceMinutes: number;
  allowCrossProductSync: boolean;
  allowCapstones: boolean;
  allowOfflineCaching: boolean;
  tier?: SubscriptionTier;
  monthlyAiTurns: number;
  monthlyVoiceMinutes: number;
  offlineModulesAllowed: number;
  streamingAudioEnabled: boolean;
  universalLearnerModelSync: boolean;
  cohortAnalyticsEnabled: boolean;
  premiumVoiceProducts?: ProductEntryPoint[];
}

const BASIC_QUOTAS: PlanQuotas = {
  tier: "basic",
  maxAiTurns: 40,
  maxVoiceMinutes: 15,
  allowCrossProductSync: false,
  allowCapstones: false,
  allowOfflineCaching: false,
  monthlyAiTurns: 40,
  monthlyVoiceMinutes: 15,
  offlineModulesAllowed: 0,
  streamingAudioEnabled: false,
  universalLearnerModelSync: false,
  cohortAnalyticsEnabled: false,
  premiumVoiceProducts: [],
};

const PLUS_QUOTAS: PlanQuotas = {
  tier: "plus",
  maxAiTurns: 200,
  maxVoiceMinutes: 120,
  allowCrossProductSync: false,
  allowCapstones: false,
  allowOfflineCaching: true,
  monthlyAiTurns: 200,
  monthlyVoiceMinutes: 120,
  offlineModulesAllowed: 1,
  streamingAudioEnabled: false,
  universalLearnerModelSync: false,
  cohortAnalyticsEnabled: false,
  premiumVoiceProducts: ["LEARN", "COACH"],
};

const ULTRA_QUOTAS: PlanQuotas = {
  tier: "ultra",
  maxAiTurns: 1000,
  maxVoiceMinutes: 300,
  allowCrossProductSync: true,
  allowCapstones: true,
  allowOfflineCaching: true,
  monthlyAiTurns: 1000,
  monthlyVoiceMinutes: 300,
  offlineModulesAllowed: 999,
  streamingAudioEnabled: true,
  universalLearnerModelSync: true,
  cohortAnalyticsEnabled: false,
  premiumVoiceProducts: ["LEARN", "COACH"],
};

export const DEFAULT_TIER_QUOTAS: Record<SubscriptionTier, PlanQuotas> = {
  basic: BASIC_QUOTAS,
  BASIC: { ...BASIC_QUOTAS, tier: "BASIC" },
  plus: PLUS_QUOTAS,
  PLUS: { ...PLUS_QUOTAS, tier: "PLUS" },
  ultra: ULTRA_QUOTAS,
  ULTRA: { ...ULTRA_QUOTAS, tier: "ULTRA" },
};

export interface TierPricingPlan {
  id: "basic" | "plus" | "ultra";
  name: string;
  badge: string;
  priceMonthly: number;
  billingPeriod: string;
  description: string;
  features: string[];
  highlighted: boolean;
  ctaText: string;
  ctaHref: string;
}

export const LUREXA_PRICING_PLANS: Record<
  "basic" | "plus" | "ultra",
  TierPricingPlan
> = {
  basic: {
    id: "basic",
    name: "Lurexa Basic",
    badge: "STARTER",
    priceMonthly: 0,
    billingPeriod: "/mo",
    description: "Core foundational lessons and placement for individual learners.",
    features: [
      "English A1 Foundation modules",
      "Adaptive placement diagnostic",
      "Spaced-retrieval review checks",
      "Basic Coach speaking studio (5 mins/day)",
    ],
    highlighted: false,
    ctaText: "Get Started Free →",
    ctaHref: "/register?plan=basic",
  },
  plus: {
    id: "plus",
    name: "Lurexa Plus",
    badge: "MOST POPULAR",
    priceMonthly: 9.99,
    billingPeriod: "/mo",
    description:
      "Dedicated single-product mastery with premium voice for the subscribed product.",
    features: [
      "Full single-product access (Learn Plus or Coach Plus)",
      "120 voice practice minutes/mo",
      "Premium ElevenLabs voice for the subscribed product",
      "1 module offline caching",
      "Targeted error remediation drills",
    ],
    highlighted: true,
    ctaText: "Start 7-Day Free Trial →",
    ctaHref: "/register?plan=plus",
  },
  ultra: {
    id: "ultra",
    name: "Lurexa Ultra",
    badge: "ALL ACCESS",
    priceMonthly: 19.99,
    billingPeriod: "/mo",
    description:
      "Full Learn + Coach experience with deeper cross-product adaptation and premium AI/speech.",
    features: [
      "Full Learn + Coach access",
      "300+ voice minutes/mo with low-latency streaming",
      "Universal Learner Model: real-time Coach ↔ Learn error sync",
      "Unlimited offline module downloads & background sync",
      "B1/B2 Capstone Project evaluation",
    ],
    highlighted: false,
    ctaText: "Upgrade to Ultra →",
    ctaHref: "/register?plan=ultra",
  },
};

export interface PlanPricing {
  tier: SubscriptionTier;
  monthlyPriceUsd: number;
  annualPriceUsd: number;
  targetProduct?: ProductEntryPoint;
  tagline: string;
  features: string[];
}

export const SUBSCRIPTION_PRICING_PLANS: Record<SubscriptionTier, PlanPricing> = {
  basic: {
    tier: "basic",
    monthlyPriceUsd: 0,
    annualPriceUsd: 0,
    tagline: "Placement diagnostic and level-matched trial modules",
    features: [
      "Adaptive placement diagnostic",
      "3 level-matched trial modules",
      "40 AI tutor turns / 15 voice minutes",
      "Standard cloud processing",
    ],
  },
  BASIC: {
    tier: "BASIC",
    monthlyPriceUsd: 0,
    annualPriceUsd: 0,
    tagline: "Placement diagnostic and level-matched trial modules",
    features: [
      "Adaptive placement diagnostic",
      "3 level-matched trial modules",
      "40 AI tutor turns / 15 voice minutes",
      "Standard cloud processing",
    ],
  },
  plus: {
    tier: "plus",
    monthlyPriceUsd: 9.99,
    annualPriceUsd: 99,
    tagline: "Dedicated single-product mastery with high-volume voice practice",
    features: [
      "Full single-product access (Learn Plus or Coach Plus)",
      "120 voice practice minutes/mo",
      "Premium ElevenLabs voice for the subscribed product",
      "1 module offline caching",
      "Targeted error remediation drills",
    ],
  },
  PLUS: {
    tier: "PLUS",
    monthlyPriceUsd: 9.99,
    annualPriceUsd: 99,
    tagline: "Dedicated single-product mastery with high-volume voice practice",
    features: [
      "Full single-product access (Learn Plus or Coach Plus)",
      "120 voice practice minutes/mo",
      "Premium ElevenLabs voice for the subscribed product",
      "1 module offline caching",
      "Targeted error remediation drills",
    ],
  },
  ultra: {
    tier: "ultra",
    monthlyPriceUsd: 19.99,
    annualPriceUsd: 199,
    tagline: "Full Learn + Coach access powered by the Universal Learner Model",
    features: [
      "Full Learn + Coach access",
      "300+ voice minutes/mo with low-latency streaming",
      "Universal Learner Model: real-time Coach ↔ Learn error sync",
      "Unlimited offline module downloads & background sync",
      "B1/B2 Capstone Project evaluation",
    ],
  },
  ULTRA: {
    tier: "ULTRA",
    monthlyPriceUsd: 19.99,
    annualPriceUsd: 199,
    tagline: "Full Learn + Coach access powered by the Universal Learner Model",
    features: [
      "Full Learn + Coach access",
      "300+ voice minutes/mo with low-latency streaming",
      "Universal Learner Model: real-time Coach ↔ Learn error sync",
      "Unlimited offline module downloads & background sync",
      "B1/B2 Capstone Project evaluation",
    ],
  },
};

export interface PlanRecommendation {
  recommendedTier: SubscriptionTier;
  reason: string;
  entryPoint: ProductEntryPoint;
  synergyBenefits: string[];
  trialQuotaRemaining: {
    voiceMinutes: number;
    aiTurns: number;
  };
}

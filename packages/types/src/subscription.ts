/** Individual commercial tiers. `enterprise` is retained temporarily for legacy compatibility; Business is organization-contract based. */
export type CanonicalSubscriptionTier = "basic" | "plus" | "ultra" | "enterprise";
export type LegacySubscriptionTier = "BASIC" | "PLUS" | "ULTRA" | "ENTERPRISE";
export type SubscriptionTier = CanonicalSubscriptionTier | LegacySubscriptionTier;
export type TierIdentifier = "basic" | "plus" | "ultra" | "enterprise";

export type ProductEntryPoint = "LEARN" | "COACH" | "TEACH" | "ADMIN" | "STUDIO" | "INSIGHT";

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
}

export interface ProductScopedVoiceEntitlement {
  product: ProductEntryPoint;
  provider: "elevenlabs";
  included: boolean;
}

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

export const DEFAULT_TIER_QUOTAS: Record<SubscriptionTier, PlanQuotas> = {
  basic: {
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
  },
  BASIC: {
    tier: "BASIC",
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
    premiumVoiceProducts: [],\n  },
  plus: {
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
    premiumVoiceProducts: [],\n  },
  PLUS: {
    tier: "PLUS",
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
    premiumVoiceProducts: [],\n  },
  ultra: {
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
  },
  ULTRA: {
    tier: "ULTRA",
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
  },
  enterprise: {
    tier: "enterprise",
    maxAiTurns: 5000,
    maxVoiceMinutes: 1500,
    allowCrossProductSync: true,
    allowCapstones: true,
    allowOfflineCaching: true,
    monthlyAiTurns: 5000,
    monthlyVoiceMinutes: 1500,
    offlineModulesAllowed: 999,
    streamingAudioEnabled: true,
    universalLearnerModelSync: true,
    cohortAnalyticsEnabled: true,
  },
  ENTERPRISE: {
    tier: "ENTERPRISE",
    maxAiTurns: 5000,
    maxVoiceMinutes: 1500,
    allowCrossProductSync: true,
    allowCapstones: true,
    allowOfflineCaching: true,
    monthlyAiTurns: 5000,
    monthlyVoiceMinutes: 1500,
    offlineModulesAllowed: 999,
    streamingAudioEnabled: true,
    universalLearnerModelSync: true,
    cohortAnalyticsEnabled: true,
    premiumVoiceProducts: ["LEARN", "COACH"],
  },
  ENTERPRISE: {
    tier: "ENTERPRISE",
    maxAiTurns: 5000,
    maxVoiceMinutes: 1500,
    allowCrossProductSync: true,
    allowCapstones: true,
    allowOfflineCaching: true,
    monthlyAiTurns: 5000,
    monthlyVoiceMinutes: 1500,
    offlineModulesAllowed: 999,
    streamingAudioEnabled: true,
    universalLearnerModelSync: true,
    cohortAnalyticsEnabled: true,
    premiumVoiceProducts: ["LEARN", "COACH"],
  },
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

export const LUREXA_PRICING_PLANS: Record<"basic" | "plus" | "ultra", TierPricingPlan> = {
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
      "Basic Coach speaking studio (5 mins/day)"
    ],
    highlighted: false,
    ctaText: "Get Started Free →",
    ctaHref: "/register?plan=basic"
  },
  plus: {
    id: "plus",
    name: "Lurexa Plus",
    badge: "MOST POPULAR",
    priceMonthly: 9.99,
    billingPeriod: "/mo",
    description: "Full access to interactive lessons, unlimited speaking AI, and Dominican contrastive phonetics.",
    features: [
      "Complete A1–B2 curriculum pathways",
      "Unlimited Coach voice turns & waveform feedback",
      "Contrastive Dominican Spanish acoustic remediation",
      "Continuous Learner Model progress tracking",
      "Spoken minimal pair drills & phoneme map"
    ],
    highlighted: true,
    ctaText: "Start 7-Day Free Trial →",
    ctaHref: "/register?plan=plus"
  },
  ultra: {
    id: "ultra",
    name: "Lurexa Ultra",
    badge: "ALL ACCESS",
    priceMonthly: 19.99,
    billingPeriod: "/mo",
    description: "For ambitious professionals and educators pursuing certified fluency and teaching credentials.",
    features: [
      "Everything in Lurexa Plus",
      "Full Lurexa Teach professional certification",
      "CEFR C1–C2 advanced business modules",
      "Verifiable micro-credentials & certificates",
      "Priority access to Lurexa Studio content"
    ],
    highlighted: false,
    ctaText: "Upgrade to Ultra →",
    ctaHref: "/register?plan=ultra"
  }
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
    annualPriceUsd: 99.0,
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
    annualPriceUsd: 99.0,
    tagline: "Dedicated single-product mastery with high-volume voice practice",
    features: [
      "Full single-product access (Learn Plus or Coach Plus)",
      "120 voice practice minutes/mo",
      "1 module offline caching",
      "Targeted error remediation drills",
    ],
  },
  ultra: {
    tier: "ultra",
    monthlyPriceUsd: 19.99,
    annualPriceUsd: 199.0,
    tagline: "Full ecosystem access powered by the Universal Learner Model",
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
    annualPriceUsd: 199.0,
    tagline: "Full ecosystem access powered by the Universal Learner Model",
    features: [
      "Unrestricted access to Learn, Coach, Studio & Teach",
      "300+ voice minutes/mo with low-latency streaming",
      "Universal Learner Model: real-time Coach ↔ Learn error sync",
      "Unlimited offline module downloads & background sync",
      "B1/B2 Capstone Project evaluation",
    ],
  },
  enterprise: {
    tier: "enterprise",
    monthlyPriceUsd: 0,
    annualPriceUsd: 0,
    tagline: "Legacy compatibility only; Business is contract/quote based.",
    features: [
      "Legacy identifier retained for migration compatibility",
      "Do not expose fixed public pricing",
      "Use BusinessContract for new organizational agreements",
    ],
  },
  ENTERPRISE: {
    tier: "ENTERPRISE",
    monthlyPriceUsd: 0,
    annualPriceUsd: 0,
    tagline: "Legacy compatibility only; Business is contract/quote based.",
    features: [
      "Legacy identifier retained for migration compatibility",
      "Do not expose fixed public pricing",
      "Use BusinessContract for new organizational agreements",
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

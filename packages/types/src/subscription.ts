export type SubscriptionTier = "BASIC" | "PLUS" | "ULTRA" | "ENTERPRISE";

export type ProductEntryPoint = "LEARN" | "COACH" | "TEACH" | "STUDIO" | "INSIGHT";

export interface PlanQuotas {
  tier: SubscriptionTier;
  monthlyAiTurns: number;
  monthlyVoiceMinutes: number;
  offlineModulesAllowed: number;
  streamingAudioEnabled: boolean;
  universalLearnerModelSync: boolean;
  cohortAnalyticsEnabled: boolean;
}

export const DEFAULT_TIER_QUOTAS: Record<SubscriptionTier, PlanQuotas> = {
  BASIC: {
    tier: "BASIC",
    monthlyAiTurns: 40,
    monthlyVoiceMinutes: 15,
    offlineModulesAllowed: 0,
    streamingAudioEnabled: false,
    universalLearnerModelSync: false,
    cohortAnalyticsEnabled: false,
  },
  PLUS: {
    tier: "PLUS",
    monthlyAiTurns: 200,
    monthlyVoiceMinutes: 120,
    offlineModulesAllowed: 1,
    streamingAudioEnabled: false,
    universalLearnerModelSync: false,
    cohortAnalyticsEnabled: false,
  },
  ULTRA: {
    tier: "ULTRA",
    monthlyAiTurns: 1000,
    monthlyVoiceMinutes: 300,
    offlineModulesAllowed: 999,
    streamingAudioEnabled: true,
    universalLearnerModelSync: true,
    cohortAnalyticsEnabled: false,
  },
  ENTERPRISE: {
    tier: "ENTERPRISE",
    monthlyAiTurns: 5000,
    monthlyVoiceMinutes: 1500,
    offlineModulesAllowed: 999,
    streamingAudioEnabled: true,
    universalLearnerModelSync: true,
    cohortAnalyticsEnabled: true,
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

/**
 * Legacy-compatible plan display metadata.
 *
 * Individual PLUS is a product selection, not a generic bundle. The
 * selectedProduct is required by the billing contract. ENTERPRISE is retained
 * here only for compatibility with older consumers; institutional commercial
 * contracts are governed by organization-entitlements.ts.
 */
export const SUBSCRIPTION_PRICING_PLANS: Record<SubscriptionTier, PlanPricing> = {
  BASIC: {
    tier: "BASIC",
    monthlyPriceUsd: 0,
    annualPriceUsd: 0,
    tagline: "Try Lurexa and discover your level before choosing a full product.",
    features: [
      "CEFR placement diagnostic",
      "3 level-matched trial modules",
      "40 AI tutor turns and 15 Coach voice minutes per month",
      "Standard cloud processing",
    ],
  },
  PLUS: {
    tier: "PLUS",
    monthlyPriceUsd: 9.99,
    annualPriceUsd: 99.0,
    tagline: "Choose one Lurexa product to develop deeply: Learn, Coach, or Teach.",
    features: [
      "Full access to the selected Plus product",
      "Learn Plus: structured English learning and expanded practice",
      "Coach Plus: expanded speaking and pronunciation practice",
      "Teach Plus: professional development for educators and future educators",
      "Plus-level quotas and capabilities for the selected product",
    ],
  },
  ULTRA: {
    tier: "ULTRA",
    monthlyPriceUsd: 19.99,
    annualPriceUsd: 199.0,
    tagline: "Integrated Learn + Coach access with deeper cross-product adaptation.",
    features: [
      "Full Learn access",
      "Full Coach access",
      "300 voice minutes / month with streaming audio",
      "Universal Learner Model cross-product synchronization",
      "Unlimited offline module downloads within supported limits",
      "Premium ElevenLabs speech capability when enabled by Core",
    ],
  },
  ENTERPRISE: {
    tier: "ENTERPRISE",
    monthlyPriceUsd: 0,
    annualPriceUsd: 0,
    tagline: "Institutional and business access is contracted according to organizational needs.",
    features: [
      "Multi-seat organizational licensing",
      "Shared quota pools and dedicated limits where contracted",
      "Cohort analytics and governance capabilities where entitled",
      "Optional SSO, export, branding, Studio, and other institutional capabilities",
      "Custom commercial terms",
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

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

export const SUBSCRIPTION_PRICING_PLANS: Record<SubscriptionTier, PlanPricing> = {
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
  ENTERPRISE: {
    tier: "ENTERPRISE",
    monthlyPriceUsd: 49.0,
    annualPriceUsd: 490.0,
    tagline: "Institutional cohort analytics, phonemic heatmaps & seat licensing",
    features: [
      "Multi-seat pooling & centralized licensing",
      "Cohort-wide phonemic error heatmaps",
      "Automated teacher intervention routing",
      "Custom LMS/SIS milestone data export",
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

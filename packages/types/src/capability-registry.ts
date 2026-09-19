import type { EntitlementCapability, ProductEntryPoint } from "./subscription";

export type CapabilityScope = "individual" | "organization" | "both";
export type CapabilityPlanSource =
  | "basic"
  | "plus"
  | "ultra"
  | "business_contract"
  | "explicit_entitlement";

export type AIProvider = "openrouter" | "gemini" | "deterministic_fallback" | "none";
export type SpeechProvider = "standard" | "elevenlabs" | "none";

export interface CapabilityQuota {
  metric: "ai_turns" | "voice_minutes" | "offline_modules" | "seats" | "none";
  amount?: number;
  period?: "session" | "day" | "month" | "contract_period";
  pooled?: boolean;
}

export interface CapabilityRegistryEntry {
  id: string;
  owner: "core" | "mind" | ProductEntryPoint | "campus";
  product: ProductEntryPoint | "CAMPUS";
  planEntitlementSource: CapabilityPlanSource[];
  entitlementCapability?: EntitlementCapability;
  quota: CapabilityQuota;
  aiProvider: AIProvider;
  speechProvider: SpeechProvider;
  fallbackPolicy: "deterministic" | "none";
  authorizationRequirement: string;
  organizationScope: CapabilityScope;
  description: string;
  enabled: boolean;
}

export const CAPABILITY_REGISTRY: readonly CapabilityRegistryEntry[] = [
  {
    id: "learn.curriculum",
    owner: "LEARN",
    product: "LEARN",
    planEntitlementSource: ["basic", "plus", "ultra", "business_contract", "explicit_entitlement"],
    entitlementCapability: "curriculum_access",
    quota: { metric: "none" },
    aiProvider: "none",
    speechProvider: "none",
    fallbackPolicy: "none",
    authorizationRequirement: "Authenticated learner with Learn entitlement for the course organization.",
    organizationScope: "both",
    description: "Access to authorized Learn curriculum content and activities.",
    enabled: true,
  },
  {
    id: "mind.conversational_roleplay",
    owner: "mind",
    product: "LEARN",
    planEntitlementSource: ["basic", "plus", "ultra", "business_contract", "explicit_entitlement"],
    entitlementCapability: "curriculum_access",
    quota: { metric: "ai_turns", amount: 40, period: "month", pooled: true },
    aiProvider: "openrouter",
    speechProvider: "standard",
    fallbackPolicy: "deterministic",
    authorizationRequirement: "Authenticated learner, authorized lesson capability, product entitlement and applicable quota.",
    organizationScope: "both",
    description: "First-class Mind conversational roleplay consumed by Learn through the AI Gateway.",
    enabled: true,
  },
  {
    id: "mind.speech_analysis",
    owner: "mind",
    product: "LEARN",
    planEntitlementSource: ["basic", "plus", "ultra", "business_contract", "explicit_entitlement"],
    entitlementCapability: "curriculum_access",
    quota: { metric: "ai_turns", amount: 1, period: "session", pooled: false },
    aiProvider: "gemini",
    speechProvider: "none",
    fallbackPolicy: "deterministic",
    authorizationRequirement: "Authenticated learner + authorized spoken-evidence capability + product entitlement + applicable quota.",
    organizationScope: "both",
    description: "Mind speech transcription and bounded pronunciation/fluency analysis for Learn spoken evidence.",
    enabled: true,
  },
  {
    id: "learn.curriculum_audio",
    owner: "LEARN",
    product: "LEARN",
    planEntitlementSource: ["basic", "plus", "ultra", "business_contract", "explicit_entitlement"],
    entitlementCapability: "curriculum_access",
    quota: { metric: "voice_minutes", amount: 120, period: "month", pooled: true },
    aiProvider: "none",
    speechProvider: "standard",
    fallbackPolicy: "none",
    authorizationRequirement: "Authenticated learner + authorized Learn curriculum capability + product entitlement + applicable quota.",
    organizationScope: "both",
    description: "Standard curriculum listening audio generated through the Speech Gateway.",
    enabled: true,
  },
  {
    id: "coach.premium_voice",
    owner: "COACH",
    product: "COACH",
    planEntitlementSource: ["plus", "ultra", "business_contract", "explicit_entitlement"],
    entitlementCapability: "premium_voice",
    quota: { metric: "voice_minutes", amount: 120, period: "month", pooled: true },
    aiProvider: "none",
    speechProvider: "elevenlabs",
    fallbackPolicy: "none",
    authorizationRequirement: "Authenticated learner, Coach entitlement, product-scoped premium voice entitlement and quota.",
    organizationScope: "both",
    description: "Premium ElevenLabs speech for Coach; provider selection is never a fallback decision.",
    enabled: true,
  },
  {
    id: "business.analytics",
    owner: "INSIGHT",
    product: "INSIGHT",
    planEntitlementSource: ["business_contract"],
    entitlementCapability: "analytics",
    quota: { metric: "none" },
    aiProvider: "none",
    speechProvider: "none",
    authorizationRequirement: "Authorized organization role with contracted analytics capability and purpose-scoped access.",
    organizationScope: "organization",
    description: "Institutional and workforce analytics from governed aggregate evidence.",
    enabled: true,
  },
  {
    id: "business.sso",
    owner: "core",
    product: "CAMPUS",
    planEntitlementSource: ["business_contract"],
    entitlementCapability: "sso",
    quota: { metric: "none" },
    aiProvider: "none",
    speechProvider: "none",
    authorizationRequirement: "Authorized organization administrator with contracted SSO capability.",
    organizationScope: "organization",
    description: "Organization-managed authentication integration.",
    enabled: true,
  },
];

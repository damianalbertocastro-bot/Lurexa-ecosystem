/**
 * Canonical Lurexa entitlement primitives.
 *
 * Core owns these records and their lifecycle. Product applications may read
 * resolved entitlements but must not manufacture trusted grants client-side.
 */

export type CommercialContext = "individual" | "educator" | "institution" | "business";

export type SubscriptionPlan = "basic" | "plus" | "ultra";

export type ProductId =
  | "learn"
  | "coach"
  | "teach"
  | "admin"
  | "insight"
  | "studio";

export type CapabilityId =
  | "learn.basic"
  | "learn.full"
  | "coach.basic"
  | "coach.full"
  | "teach.basic"
  | "teach.full"
  | "roleplay"
  | "standard.voice"
  | "premium.elevenlabs"
  | "learner_model.cross_product"
  | "offline.learning"
  | "streaming.audio"
  | "educator.coach_full"
  | "teach.formation"
  | "teach.professional_growth"
  | "teach.evidence"
  | "teach.credentials"
  | "teach.human_support"
  | "teach.community"
  | "institution.workspace"
  | "institution.members"
  | "institution.groups"
  | "institution.entitlements"
  | "institution.analytics"
  | "institution.audit"
  | "institution.branding"
  | "institution.sso"
  | "institution.export"
  | "institution.quota_pool"
  | "studio.authoring"
  | "studio.publishing";

export type EntitlementSourceType =
  | "subscription"
  | "organization_grant"
  | "educator_benefit"
  | "system_grant"
  | "trial";

export type EntitlementStatus = "active" | "scheduled" | "expired" | "revoked";

export type QuotaMetric =
  | "ai_turns"
  | "voice_minutes"
  | "roleplay_turns"
  | "elevenlabs_characters"
  | "offline_modules"
  | "organization_seats";

export interface EntitlementSource {
  type: EntitlementSourceType;
  sourceId: string;
  context: CommercialContext;
}

export interface ProductEntitlement {
  id: string;
  subjectId: string;
  product: ProductId;
  source: EntitlementSource;
  status: EntitlementStatus;
  startsAt: string;
  endsAt?: string | null;
  provenanceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityEntitlement {
  id: string;
  subjectId: string;
  capability: CapabilityId;
  product?: ProductId;
  source: EntitlementSource;
  status: EntitlementStatus;
  startsAt: string;
  endsAt?: string | null;
  provenanceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EducatorBenefit {
  id: string;
  userId: string;
  capability: "educator.coach_full";
  status: "active" | "expired" | "revoked";
  qualificationReference?: string | null;
  startsAt: string;
  endsAt?: string | null;
  provenanceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationGrant {
  id: string;
  organizationId: string;
  subjectId?: string;
  products: ProductId[];
  capabilities: CapabilityId[];
  status: EntitlementStatus;
  startsAt: string;
  endsAt?: string | null;
  provenanceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionEntitlementSource {
  id: string;
  subjectId: string;
  plan: SubscriptionPlan;
  selectedProduct?: "learn" | "coach" | "teach" | null;
  context: "individual" | "educator";
  status: "active" | "trialing" | "past_due" | "canceled" | "expired";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  provider: "stripe" | "manual" | "system";
  externalSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotaEntitlement {
  id: string;
  subjectId: string;
  metric: QuotaMetric;
  scope: "individual" | "product" | "capability" | "organization";
  scopeId?: string;
  limit: number | null;
  period: "monthly" | "billing_period" | "lifetime" | "unlimited";
  startsAt: string;
  endsAt?: string | null;
  provenanceId: string;
}

export interface EntitlementProvenance {
  id: string;
  sourceType: EntitlementSourceType;
  sourceId: string;
  policyVersion: string;
  grantedAt: string;
  grantedBy: "billing" | "core" | "organization_admin" | "system";
  reason?: string;
}

export interface ResolvedEntitlements {
  subjectId: string;
  products: ProductId[];
  capabilities: CapabilityId[];
  commercialContexts: CommercialContext[];
  activeSources: string[];
  quotas: QuotaEntitlement[];
  resolvedAt: string;
}

export const INDIVIDUAL_PLAN_PRODUCTS: Record<SubscriptionPlan, ProductId[]> = {
  basic: ["learn", "coach"],
  plus: ["learn", "coach"],
  ultra: ["learn", "coach"],
};

export const PLUS_PRODUCT_OPTIONS = ["learn", "coach", "teach"] as const;

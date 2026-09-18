import { CapabilityId, InstitutionalPlanTier, ProductId } from "@lurexa/types";

export type OrganizationCommercialContext = "institution" | "business";

export interface OrganizationCommercialContract {
  id: string;
  organizationId: string;
  context: OrganizationCommercialContext;
  institutionalTier?: InstitutionalPlanTier;
  planCode: string;
  productEntitlements: ProductId[];
  capabilityEntitlements: CapabilityId[];
  allocatedSeats: number | null;
  quotaPoolId?: string | null;
  status: "trial" | "active" | "past_due" | "suspended" | "canceled";
  startsAt: string;
  endsAt?: string | null;
  provenanceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSeatGrant {
  id: string;
  organizationId: string;
  userId: string;
  products: ProductId[];
  capabilities: CapabilityId[];
  status: "active" | "suspended" | "revoked";
  startsAt: string;
  endsAt?: string | null;
  provenanceId: string;
}

export interface OrganizationQuotaPool {
  id: string;
  organizationId: string;
  metrics: Partial<Record<
    "ai_turns" | "voice_minutes" | "roleplay_turns" | "elevenlabs_characters",
    number
  >>;
  period: "monthly" | "billing_period" | "unlimited";
  startsAt: string;
  endsAt?: string | null;
  provenanceId: string;
}

export interface CampusBundle {
  id: string;
  organizationId: string;
  name: string;
  products: ProductId[];
  capabilities: CapabilityId[];
  seatLimit: number | null;
  quotaPoolId?: string | null;
  status: "draft" | "active" | "archived";
}

export interface BusinessWorkforceContract {
  id: string;
  organizationId: string;
  planCode: string;
  products: ProductId[];
  capabilities: CapabilityId[];
  seatLimit: number | null;
  quotaPoolId?: string | null;
  supportLevel?: string;
  integrationCodes?: string[];
  status: "draft" | "trial" | "active" | "suspended" | "canceled";
  startsAt: string;
  endsAt?: string | null;
  provenanceId: string;
}

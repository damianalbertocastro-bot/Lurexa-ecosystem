export const institutionRoles = [
  "org_owner",
  "org_admin",
  "teacher",
  "student",
] as const;

export type InstitutionRole = (typeof institutionRoles)[number];

export const institutionProducts = [
  "learn",
  "teach",
  "insight",
  "coach",
  "studio",
] as const;

export type InstitutionProduct = (typeof institutionProducts)[number];

export type InstitutionMembershipStatus = "invited" | "active" | "suspended";
export type InstitutionEntitlementStatus = "active" | "suspended";

/**
 * Trusted organization-scoped relationship facts belong to Lurexa Core.
 * Admin manages these records through server-authorized Core services.
 */
export interface InstitutionMembership {
  organizationId: string;
  userId: string;
  role: InstitutionRole;
  status: InstitutionMembershipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: InstitutionRole;
  status: "pending" | "accepted" | "expired" | "revoked";
  expiresAt: string;
  createdAt: string;
}

export interface InstitutionBranding {
  organizationId: string;
  displayName: string;
  logoUrl?: string | null;
  accentColor?: string | null;
}

export interface InstitutionProductEntitlement {
  organizationId: string;
  product: InstitutionProduct;
  status: InstitutionEntitlementStatus;
  seats: number | null;
}

/**
 * Minimal tenant context shared across role-aware product navigation.
 * It intentionally contains no learner-model interpretation or course content.
 */
export interface InstitutionWorkspaceContext {
  organizationId: string;
  organizationName: string;
  role: InstitutionRole;
  branding: InstitutionBranding;
  entitlements: InstitutionProductEntitlement[];
}

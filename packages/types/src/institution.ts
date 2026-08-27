import type { MemberRole } from "./user";

export const institutionProducts = [
  "learn",
  "teach",
  "insight",
  "coach",
  "studio",
] as const;

export type InstitutionProduct = (typeof institutionProducts)[number];
export type InstitutionRole = MemberRole;
export type InstitutionEntitlementStatus = "active" | "suspended";

export type LtiPlatformType =
  | "canvas"
  | "blackboard"
  | "moodle"
  | "d2l_brightspace"
  | "generic_lti13";

export interface Lti13Registration {
  id: string;
  organizationId: string;
  platformType: LtiPlatformType;
  issuer: string;
  clientId: string;
  deploymentId: string;
  authEndpoint: string;
  tokenEndpoint: string;
  jwksUrl: string;
  gradeSyncEnabled: boolean;
  createdAt: string;
}

export interface LtiGradePassbackRequest {
  organizationId: string;
  learnerId: string;
  courseId: string;
  lessonId: string;
  scoreGiven: number;
  scoreMaximum: number;
  comment: string;
  activityProgress: "Completed" | "InProgress";
  gradingProgress: "FullyGraded" | "Pending";
}

/**
 * Institution membership and invitation records already exist as
 * OrganizationMember and Invitation in user.ts. Do not duplicate those
 * trusted Core relationship contracts here.
 */
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
  ltiConfig?: Lti13Registration | null;
}

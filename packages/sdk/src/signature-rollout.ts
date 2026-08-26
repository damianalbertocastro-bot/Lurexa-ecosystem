import type {
  EducatorBenefitEntitlementsV1,
  InsightOrganizationSignatureOverviewV1,
  LearnTeacherInstructionalRosterV1,
  SignatureOperationalRollupV1,
} from "@lurexa/types";

/**
 * Browser-safe interface for rollout consumers. Concrete implementations must
 * call authenticated server endpoints; these methods are not authorization grants.
 */
export interface SignatureRolloutService {
  getLearnTeacherInstructionalRoster(): Promise<LearnTeacherInstructionalRosterV1>;
  getEducatorBenefits(): Promise<EducatorBenefitEntitlementsV1>;
  getInsightOrganizationOverview(organizationId: string): Promise<InsightOrganizationSignatureOverviewV1>;
  getSignatureOperationalRollup(windowMinutes?: number): Promise<SignatureOperationalRollupV1>;
}

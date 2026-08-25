import type {
  InsightOrganizationSignatureOverviewV1,
  SignatureOperationalRollupV1,
  TeachInstructionalRosterV1,
} from "@lurexa/types";

/**
 * Browser-safe interface for rollout consumers. Concrete implementations must
 * call authenticated server endpoints; these methods are not authorization grants.
 */
export interface SignatureRolloutService {
  getTeachInstructionalRoster(): Promise<TeachInstructionalRosterV1>;
  getInsightOrganizationOverview(organizationId: string): Promise<InsightOrganizationSignatureOverviewV1>;
  getSignatureOperationalRollup(windowMinutes?: number): Promise<SignatureOperationalRollupV1>;
}

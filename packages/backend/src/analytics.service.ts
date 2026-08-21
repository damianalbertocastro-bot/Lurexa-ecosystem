import type {
  ClassAnalyticsSummary,
  StudentRiskMetric,
} from "@lurexa/types";

export type { ClassAnalyticsSummary, StudentRiskMetric } from "@lurexa/types";

const trustedAnalyticsError =
  "Organization-wide analytics are server-only. Use the authenticated teacher analytics API projection.";

/**
 * @deprecated Browser-side organization analytics aggregation has been retired.
 *
 * Organization-wide learner signals combine trusted identity, membership,
 * course, and progress records. They must be produced behind the Core server
 * boundary rather than by broad client Firestore queries.
 */
export const AnalyticsService = {
  async getClassSummary(orgId: string): Promise<ClassAnalyticsSummary> {
    void orgId;
    throw new Error(trustedAnalyticsError);
  },

  async getStudentRosterMetrics(orgId: string): Promise<StudentRiskMetric[]> {
    void orgId;
    throw new Error(trustedAnalyticsError);
  },
};

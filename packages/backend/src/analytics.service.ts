export interface StudentRiskMetric {
  studentId: string;
  studentName: string;
  email: string;
  avgScore: number;
  completedLessons: number;
  lastActive: string;
  riskStatus: "healthy" | "at_risk" | "inactive";
  recommendedAction: string;
}

export interface ClassAnalyticsSummary {
  totalStudents: number;
  avgCompletionRate: number;
  avgQuizScore: number;
  atRiskCount: number;
  aiRecommendations: string[];
}

const trustedAnalyticsBoundaryError =
  "Legacy browser analytics are disabled. Use the authorized Core analytics projection for the requested product and purpose.";

/**
 * @deprecated Compatibility facade only.
 *
 * The previous implementation queried progress using a non-existent orgId
 * field and substituted fabricated learners, completion rates, and AI advice.
 * Trusted teacher analytics now use TeacherInsightsService on the server. New
 * platform analytics use the Core-owned PlatformAdminService projection.
 */
export const AnalyticsService = {
  async getClassSummary(orgId: string): Promise<ClassAnalyticsSummary> {
    void orgId;
    throw new Error(trustedAnalyticsBoundaryError);
  },

  async getStudentRosterMetrics(orgId: string): Promise<StudentRiskMetric[]> {
    void orgId;
    throw new Error(trustedAnalyticsBoundaryError);
  },
};

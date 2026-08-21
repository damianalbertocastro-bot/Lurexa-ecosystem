export type LearnerRiskStatus = "healthy" | "at_risk" | "inactive";

export interface StudentRiskMetric {
  studentId: string;
  studentName: string;
  email: string;
  avgScore: number | null;
  completedLessons: number;
  lastActive: string | null;
  riskStatus: LearnerRiskStatus;
  recommendedAction: string;
}

export interface ClassAnalyticsSummary {
  totalStudents: number;
  avgCompletionRate: number;
  avgQuizScore: number | null;
  atRiskCount: number;
  recommendations: string[];
}

export interface TeacherAnalyticsProjection {
  organizationId: string;
  organizationName: string;
  generatedAt: string;
  summary: ClassAnalyticsSummary;
  roster: StudentRiskMetric[];
}

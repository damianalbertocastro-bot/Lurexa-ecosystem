export const SIGNATURE_ROLLOUT_CONTRACT_VERSION = "1" as const;

/**
 * Operational teacher-workspace contracts belong to Lurexa Learn.
 * Lurexa Teach is reserved for the educator's own professional learning.
 */
export interface LearnTeacherRosterLearnerV1 {
  learnerId: string;
  displayName: string;
  organizationId: string;
  courseId: string;
  courseTitle: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  lastActivityAt: string | null;
}

export interface LearnTeacherRosterCourseV1 {
  courseId: string;
  courseTitle: string;
  organizationId: string;
  learners: LearnTeacherRosterLearnerV1[];
}

export interface LearnTeacherInstructionalRosterV1 {
  contractVersion: typeof SIGNATURE_ROLLOUT_CONTRACT_VERSION;
  generatedAt: string;
  courses: LearnTeacherRosterCourseV1[];
  limitations: string[];
}

export interface InsightOrganizationSignatureOverviewV1 {
  contractVersion: typeof SIGNATURE_ROLLOUT_CONTRACT_VERSION;
  organizationId: string;
  generatedAt: string;
  courseCount: number;
  participatingLearners: number;
  activeLearners14d: number;
  averageCourseProgressPercent: number | null;
  knowledgeObjectCoverage: Array<{
    knowledgeObjectId: string;
    evidenceCount: number;
  }>;
  limitations: string[];
}

export interface SignatureOperationalRollupV1 {
  contractVersion: typeof SIGNATURE_ROLLOUT_CONTRACT_VERSION;
  generatedAt: string;
  windowMinutes: number;
  bridge: {
    created: number;
    resolved: number;
  };
  projections: Array<{
    consumer: "learn" | "coach" | "teach" | "admin" | "insight" | "studio" | "campus";
    projection: "learner_pulse" | "adaptive_path" | "memory_thread" | "mind_trace";
    successCount: number;
    failureCount: number;
    averageDurationMs: number | null;
    p95DurationMs: number | null;
  }>;
  performanceBudget: {
    projectionP95WarningMs: number;
  };
  limitations: string[];
}

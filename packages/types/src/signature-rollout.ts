import type { LearnerPulseProjectionV1 } from "./signature-experience";

export const SIGNATURE_ROLLOUT_CONTRACT_VERSION = "1" as const;

export interface TeachRosterLearnerV1 {
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

export interface TeachRosterCourseV1 {
  courseId: string;
  courseTitle: string;
  organizationId: string;
  learners: TeachRosterLearnerV1[];
}

export interface TeachInstructionalRosterV1 {
  contractVersion: typeof SIGNATURE_ROLLOUT_CONTRACT_VERSION;
  generatedAt: string;
  courses: TeachRosterCourseV1[];
  limitations: string[];
}

export interface InsightLearnerPulseProjectionV1 extends LearnerPulseProjectionV1 {
  consumer: "insight";
  organizationId: string;
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
  }>;
  limitations: string[];
}

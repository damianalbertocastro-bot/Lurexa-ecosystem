import type { CefrLevel, LearnerDomain } from "./learner";


export type TeacherReviewStatus =
  | "pending_review"
  | "reviewed_approved"
  | "needs_revision"
  | "remediation_assigned"
  | "exemplary";

export type ReturnLoopActionType =
  | "revisit_activity"
  | "targeted_micropractice"
  | "schedule_1on1_coaching"
  | "advance_with_target"
  | "praise_and_reinforce";

export interface TeacherFeedbackItem {
  id: string;
  domain: LearnerDomain;
  competencyId?: string;
  feedbackText: string;
  audioFeedbackUrl?: string;
  audioDurationSeconds?: number;
  highlightedSegment?: {
    startMs?: number;
    endMs?: number;
    textSnippet?: string;
  };
  strength: boolean;
  createdAt: string;
}

export interface ReturnLoopAction {
  id: string;
  actionType: ReturnLoopActionType;
  title: string;
  instruction: string;
  targetCompetencyIds: string[];
  courseId?: string;
  lessonId?: string;
  activityId?: string;
  suggestedIntervalDays?: number;
  assignedAt: string;
  dueAt?: string;
  completedAt?: string;
}

export interface TeacherGuidancePayload {
  reviewId: string;
  submissionId: string;
  learnerId: string;
  teacherId: string;
  courseId: string;
  lessonId: string;
  activityId: string;
  status: TeacherReviewStatus;
  overallRating?: number; // 1 to 5 scale or 0.0 to 1.0
  generalNotes?: string;
  rubricScores?: Record<string, number>;
  feedbackItems: TeacherFeedbackItem[];
  returnLoopActions: ReturnLoopAction[];
  learnerModelUpdates?: {
    retrievalIntervalDaysDelta?: number;
    targetPhonemesToReinforce?: string[];
    cefrAdjustment?: CefrLevel;
  };
  reviewedAt: string;
  updatedAt: string;
}

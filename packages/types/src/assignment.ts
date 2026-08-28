import type { CefrLevel } from "./course";

export type AssignmentTargetType =
  | "lesson_stage"
  | "speaking_task"
  | "coach_pack"
  | "custom_prompt";

export type AssignmentStatus = "draft" | "published" | "closed";

export type SubmissionStatus =
  | "pending"
  | "submitted"
  | "evaluated_by_mind"
  | "graded"
  | "returned";

export interface AssignmentRubricCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
}

export interface AssignmentV1 {
  contractVersion: "1";
  id: string;
  organizationId: string;
  courseId: string;
  classId: string;
  teacherId: string;
  title: string;
  description: string;
  instructions: string;
  targetType: AssignmentTargetType;
  targetRef: string;
  targetLevel: CefrLevel;
  dueDate: string;
  status: AssignmentStatus;
  rubric: AssignmentRubricCriterion[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentMindEvaluationV1 {
  phonologicalScore: number;
  fluencyScore: number;
  rubricScores: Record<string, number>;
  articulatoryFeedback: string[];
  suggestedOverallScore: number;
  evaluatedAt: string;
}

export interface AssignmentSubmissionV1 {
  contractVersion: "1";
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  organizationId: string;
  classId: string;
  status: SubmissionStatus;
  payload: {
    textResponse?: string;
    audioUrl?: string;
    audioDurationMs?: number;
    coachSessionId?: string;
  };
  mindEvaluation?: AssignmentMindEvaluationV1;
  teacherGrade?: {
    score: number;
    maxScore: number;
    feedback: string;
    gradedBy: string;
    gradedAt: string;
  };
  submittedAt: string;
  updatedAt: string;
}

export interface RosterStudentEntry {
  fullName: string;
  email: string;
  className: string;
  targetCefr: CefrLevel;
  l1Profile: string;
}

export interface RosterImportBatchResult {
  organizationId: string;
  totalRecords: number;
  importedCount: number;
  errors: Array<{ line: number; email: string; reason: string }>;
  createdStudentIds: string[];
  timestamp: string;
}

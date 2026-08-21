import type { LearnerRecommendationAction } from "./learner";

export type LearningCapabilityKind =
  | "model_listening"
  | "recorded_speaking"
  | "ai_roleplay";

export interface LearningCapabilityBase {
  schemaVersion: "1";
  id: string;
  kind: LearningCapabilityKind;
  stage:
    | "CONTEXTUAL_INPUT"
    | "PHONETICS_FOCUS"
    | "CONVERSATION"
    | "CREATE_APPLY"
    | "REVIEW";
  title: string;
  instructions: string;
  competencyIds: string[];
  estimatedMinutes: number;
  required: boolean;
}

export interface ModelListeningCapability extends LearningCapabilityBase {
  kind: "model_listening";
  modelText: string;
  audioUrl?: string;
  locale: string;
  playbackGoal: "meaning" | "noticing" | "pronunciation_model";
}

export interface RecordedSpeakingCapability extends LearningCapabilityBase {
  kind: "recorded_speaking";
  prompt: string;
  targetText?: string;
  locale: string;
  minimumSeconds: number;
  maximumSeconds: number;
  evidencePurpose: "rehearsal" | "performance";
}

export interface AIRoleplayScenario {
  role: string;
  situation: string;
  learnerGoal: string;
  openingLine: string;
  minimumTurns: number;
  maximumTurns: number;
}

export interface AIRoleplayCapability extends LearningCapabilityBase {
  kind: "ai_roleplay";
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  language: string;
  scenario: AIRoleplayScenario;
  correctionPolicy: "post_turn_salient" | "balanced" | "direct_precision";
}

export type LearningCapability =
  | ModelListeningCapability
  | RecordedSpeakingCapability
  | AIRoleplayCapability;

export interface LearnTutorTurn {
  sender: "learner" | "tutor";
  text: string;
  timestamp: string;
}

/**
 * The learner client submits only stable identifiers and learner-authored text.
 * The server resolves the authoritative AI-roleplay capability from the trusted
 * lesson object before constructing a tutor scenario or learning evidence.
 */
export interface LearnTutorTurnRequest {
  courseId: string;
  lessonId: string;
  activityId: string;
  learnerMessage: string;
  transcript: LearnTutorTurn[];
}

export interface LearnTutorTurnResult {
  reply: LearnTutorTurn;
  transcript: LearnTutorTurn[];
  learnerContextUsed: {
    cefr: string | null;
    activeTargetCount: number;
    recurringPatternCount: number;
  };
  provider: "openai" | "deterministic_fallback";
}

export interface SpokenEvidenceRecord {
  id: string;
  learnerId: string;
  courseId: string;
  lessonId: string;
  activityId: string;
  storagePath: string;
  contentType: string;
  durationMs: number;
  byteLength: number;
  evidencePurpose: "rehearsal" | "performance";
  competencyIds: string[];
  observedAt: string;
}

export interface RetrievalSchedule {
  id: string;
  learnerId: string;
  organizationId: string;
  courseId: string;
  lessonId: string;
  dueAt: string;
  intervalDays: number;
  status: "scheduled" | "due" | "completed" | "superseded";
  createdAt: string;
  completedAt?: string;
}

/**
 * Every learner-facing next step uses the same recommendation contract.
 * `kind` only expresses routing priority/source; the actual educational action
 * remains a LearnerRecommendationAction whether it came from retrieval,
 * a teacher, Lurexa Mind, or ordinary curriculum continuation.
 */
export type NextLearningAction =
  | {
      kind: "retrieval";
      recommendation: LearnerRecommendationAction;
      scheduleId: string;
      dueAt: string;
    }
  | {
      kind: "teacher_recommendation";
      recommendation: LearnerRecommendationAction;
      interventionId: string;
    }
  | {
      kind: "mind_recommendation";
      recommendation: LearnerRecommendationAction;
    }
  | {
      kind: "continue";
      recommendation: LearnerRecommendationAction;
    };

export interface TeacherInterventionBrief {
  id: string;
  learnerId: string;
  teacherId: string;
  organizationId: string;
  courseId: string;
  status: "open" | "responded" | "closed";
  recentLessonId: string | null;
  evidenceSummary: {
    recentEvidenceTypes: string[];
    recentActivityIds: string[];
    latestEvidenceAt: string | null;
  };
  learningSignals: {
    recommendations: string[];
    activeTargets: string[];
  };
  createdAt: string;
  response?: TeacherInterventionResponse;
}

export interface TeacherInterventionResponse {
  priority: "confidence" | "communication" | "accuracy" | "fluency" | "pronunciation" | "strategy";
  teacherNote: string;
  recommendedAction: string;
  recommendedActivityId?: string;
  expertEscalationRequested: boolean;
  expertEscalationReason?: string;
  respondedAt: string;
}

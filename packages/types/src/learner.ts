export type CefrLevel = "PRE_A1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type LurexaProduct =
  | "learn"
  | "coach"
  | "teach"
  | "admin"
  | "insight"
  | "studio";

export type LearnerDomain =
  | "proficiency"
  | "curriculum"
  | "grammar"
  | "vocabulary"
  | "pronunciation"
  | "fluency"
  | "goal"
  | "preference"
  | "recommendation";

export type LearningEvidenceType =
  | "assessment_result"
  | "activity_result"
  | "curriculum_progress"
  | "language_error"
  | "pronunciation_observation"
  | "fluency_observation"
  | "goal_update"
  | "preference_update"
  | "correction_outcome";

export type EvidenceMethod =
  | "system_observed"
  | "learner_reported"
  | "teacher_reported"
  | "ai_observed";

export interface LearnerPattern {
  id: string;
  domain: Extract<LearnerDomain, "grammar" | "vocabulary" | "pronunciation" | "fluency">;
  summary: string;
  confidence?: number;
  updatedAt?: string;
}

export interface LearnerContext {
  learnerId: string;
  organizationId?: string;
  proficiency?: {
    cefr?: CefrLevel;
    updatedAt?: string;
  };
  curriculum?: {
    courseId?: string;
    moduleId?: string;
    unitId?: string;
    lessonId?: string;
    currentObjectives?: string[];
    updatedAt?: string;
  };
  goals?: string[];
  activeTargets?: {
    grammar?: string[];
    vocabulary?: string[];
    pronunciation?: string[];
    fluency?: string[];
  };
  recurringPatterns?: LearnerPattern[];
  recentActivityIds?: string[];
  generatedAt: string;
}

export interface LearningEvidenceSource {
  product: LurexaProduct;
  activityId?: string;
  sessionId?: string;
  courseId?: string;
  lessonId?: string;
}

export interface LearningEvidenceProvenance {
  method: EvidenceMethod;
  confidence?: number;
  actorId?: string;
  modelId?: string;
}

export interface LearningEvidence<TPayload = unknown> {
  id: string;
  learnerId: string;
  organizationId?: string;
  source: LearningEvidenceSource;
  type: LearningEvidenceType;
  observedAt: string;
  payload: TPayload;
  provenance: LearningEvidenceProvenance;
}

export type LearnerInsightData =
  | { kind: "cefr_estimate"; level: CefrLevel }
  | {
      kind: "curriculum_context";
      courseId?: string;
      moduleId?: string;
      unitId?: string;
      lessonId?: string;
      currentObjectives?: string[];
    }
  | {
      kind: "learning_targets";
      domain: Extract<LearnerDomain, "grammar" | "vocabulary" | "pronunciation" | "fluency">;
      targets: string[];
    }
  | { kind: "recurring_pattern"; pattern: LearnerPattern }
  | { kind: "goals"; goals: string[] }
  | { kind: "recommendation"; actions: string[] };

export interface LearnerInsight {
  id: string;
  learnerId: string;
  organizationId?: string;
  domain: LearnerDomain;
  summary: string;
  confidence: number;
  basedOnEvidenceIds: string[];
  data?: LearnerInsightData;
  generatedAt: string;
  validity?: {
    expiresAt?: string;
    supersedesInsightId?: string;
  };
}

export interface LearnerContextRequest {
  learnerId: string;
  requestingProduct: LurexaProduct;
  organizationId?: string;
  domains?: LearnerDomain[];
}

export interface LearningEvidenceSubmission<TPayload = unknown> {
  evidence: LearningEvidence<TPayload>;
}

export interface LearnerInsightSubmission {
  insight: LearnerInsight;
}

export interface LearnerInterpretationRequest {
  learnerId: string;
  organizationId?: string;
  evidence: LearningEvidence[];
  currentContext?: LearnerContext;
  requestedDomains?: LearnerDomain[];
}

export interface LearnerInterpretationResult {
  learnerId: string;
  insights: LearnerInsight[];
  evidenceIds: string[];
  generatedAt: string;
}

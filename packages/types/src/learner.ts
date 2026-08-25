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

/**
 * Versioned, Core-governed record submitted by a product or approved service.
 * Versioning belongs on the record so mixed historical evidence can be read
 * safely while producers move forward independently.
 */
export const LEARNING_EVIDENCE_CONTRACT_VERSION = "1" as const;
export type LearningEvidenceContractVersion = typeof LEARNING_EVIDENCE_CONTRACT_VERSION;

export type LearningEvidenceDataClassification =
  | "standard"
  | "sensitive";

export type EvidenceMethod =
  | "system_observed"
  | "learner_reported"
  | "teacher_reported"
  | "ai_observed";

export type LearnerRecommendationOutcome =
  | "retry"
  | "reinforce"
  | "continue"
  | "targeted_practice";

export interface LearnerRecommendationAction {
  outcome: LearnerRecommendationOutcome;
  label: string;
  reason: string;
  courseId?: string;
  lessonId?: string;
  activityId?: string;
  competencyIds?: string[];
}

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
  recommendations?: LearnerRecommendationAction[];
  recentActivityIds?: string[];
  generatedAt: string;
}

export interface LearningEvidenceSource {
  product: LurexaProduct;
  activityId?: string;
  sessionId?: string;
  courseId?: string;
  lessonId?: string;
  /** Canonical semantic targets carried across products without exposing learner payloads. */
  knowledgeObjectIds?: string[];
}

export interface LearningEvidenceProvenance {
  method: EvidenceMethod;
  confidence?: number;
  actorId?: string;
  modelId?: string;
}

export interface LearningEvidence<TPayload = unknown> {
  contractVersion: LearningEvidenceContractVersion;
  id: string;
  learnerId: string;
  organizationId?: string;
  source: LearningEvidenceSource;
  type: LearningEvidenceType;
  observedAt: string;
  /** Classifies the stored payload; it is never a product-UI display policy. */
  dataClassification: LearningEvidenceDataClassification;
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
  | {
      kind: "recommendation";
      actions: string[];
      recommendations?: LearnerRecommendationAction[];
      interpretationVersion?: string;
    };

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

export type LearnerContextPurpose =
  | "learn_adaptive_practice"
  | "coach_session_adaptation"
  | "teacher_instructional_support"
  | "mind_learning_interpretation";

/**
 * Product request to Core for the minimum learner projection needed by one
 * experience. This request never grants access by itself.
 */
export interface LearnerContextRequest {
  contractVersion: "1";
  learnerId: string;
  requestingProduct: LurexaProduct;
  organizationId?: string;
  /** Required for delegated teacher_instructional_support so Core can authorize the exact teaching scope. */
  courseId?: string;
  purpose: LearnerContextPurpose;
  domains: LearnerDomain[];
}

/**
 * Mind interpretation and derived-observation contracts are intentionally
 * separate from raw evidence. The existing LearnerInsight shape remains a
 * read-model compatibility surface while these envelopes govern new writes.
 */
export const MIND_INTERPRETATION_CONTRACT_VERSION = "1" as const;
export const DERIVED_OBSERVATION_CONTRACT_VERSION = "1" as const;

export type MindInterpretationType =
  | "recommendation"
  | "adaptation_guidance"
  | "candidate_observation"
  | "feedback_plan"
  | "content_ranking"
  | "intervention_suggestion";

export type DerivedObservationStatus =
  | "candidate"
  | "active"
  | "superseded"
  | "invalidated"
  | "expired"
  | "withdrawn";

export type DerivedObservationReviewStatus = "automated_approved" | "pending_review" | "human_approved" | "rejected";

export interface AuthorizedMindInterpretationInput {
  learnerId: string;
  organizationId?: string;
  /** Evidence is supplied only by a Core server capability after authorization. */
  evidence: LearningEvidence[];
  context?: LearnerContext;
}

export interface MindInterpretationRequestV1 {
  contractVersion: typeof MIND_INTERPRETATION_CONTRACT_VERSION;
  requestId: string;
  purpose: "mind_learning_interpretation";
  interpretationTypes: MindInterpretationType[];
  input: AuthorizedMindInterpretationInput;
  modelPolicyVersion: string;
}

export interface CandidateDerivedObservation {
  contractVersion: typeof DERIVED_OBSERVATION_CONTRACT_VERSION;
  observationId: string;
  learnerId: string;
  organizationId?: string;
  type: MindInterpretationType;
  status: "candidate";
  domain: LearnerDomain;
  summary: string;
  confidence: number;
  basedOnEvidenceIds: string[];
  data?: LearnerInsightData;
  generatedAt: string;
  effectiveAt: string;
  expiresAt?: string;
  generatedBy: {
    capability: string;
    modelPolicyVersion: string;
    ruleVersion?: string;
  };
  limitations: string[];
  scope: {
    purposes: LearnerContextPurpose[];
    products: LurexaProduct[];
  };
}

export interface DerivedObservation extends Omit<CandidateDerivedObservation, "status"> {
  status: DerivedObservationStatus;
  persistedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewStatus: DerivedObservationReviewStatus;
}

export interface MindInterpretationResultV1 {
  contractVersion: typeof MIND_INTERPRETATION_CONTRACT_VERSION;
  requestId: string;
  learnerId: string;
  organizationId?: string;
  interpretations: Array<{
    type: MindInterpretationType;
    summary: string;
    confidence: number;
    basedOnEvidenceIds: string[];
    data?: LearnerInsightData;
  }>;
  candidateObservations: CandidateDerivedObservation[];
  generatedAt: string;
  generatedBy: {
    capability: string;
    modelPolicyVersion: string;
    ruleVersion?: string;
  };
  limitations: string[];
}

export interface LearnerContextResponse {
  contractVersion: "1";
  purpose: LearnerContextPurpose;
  context: LearnerContext;
  evidenceSummary: {
    recentEvidenceTypes: LearningEvidenceType[];
    latestEvidenceAt: string | null;
  };
  limitations: string[];
}

export function isLearnerContextRequest(value: unknown): value is LearnerContextRequest {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  return input.contractVersion === "1"
    && typeof input.learnerId === "string"
    && typeof input.requestingProduct === "string"
    && (input.organizationId === undefined || typeof input.organizationId === "string")
    && (input.courseId === undefined || typeof input.courseId === "string")
    && typeof input.purpose === "string"
    && Array.isArray(input.domains)
    && input.domains.every((domain) => typeof domain === "string");
}

export function isLearningEvidence(value: unknown): value is LearningEvidence {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  const source = input.source as Record<string, unknown> | undefined;
  return input.contractVersion === LEARNING_EVIDENCE_CONTRACT_VERSION
    && typeof input.id === "string"
    && typeof input.learnerId === "string"
    && (input.organizationId === undefined || typeof input.organizationId === "string")
    && typeof input.type === "string"
    && typeof input.observedAt === "string"
    && (input.dataClassification === "standard" || input.dataClassification === "sensitive")
    && !!source
    && typeof source.product === "string"
    && (source.knowledgeObjectIds === undefined
      || (Array.isArray(source.knowledgeObjectIds) && source.knowledgeObjectIds.every((id) => typeof id === "string")))
    && !!input.provenance
    && typeof input.provenance === "object";
}

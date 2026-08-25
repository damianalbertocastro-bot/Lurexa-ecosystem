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
  reviewStatus: DerivedObservationReviewStatus;
  provenance: {
    method: "deterministic_rule" | "model" | "hybrid";
    modelId?: string;
  };
}

export interface MindInterpretationResultV1 {
  contractVersion: typeof MIND_INTERPRETATION_CONTRACT_VERSION;
  interpretationId: string;
  learnerId: string;
  generatedAt: string;
  purpose: "mind_learning_interpretation";
  outputs: CandidateDerivedObservation[];
  limitations: string[];
  modelPolicyVersion: string;
}

export interface ApprovedDerivedObservation extends Omit<CandidateDerivedObservation, "status"> {
  status: "active";
  approvedAt: string;
  approvedByPolicy: string;
  supersedesObservationId?: string;
}

const mindInterpretationTypes: readonly MindInterpretationType[] = [
  "recommendation", "adaptation_guidance", "candidate_observation", "feedback_plan", "content_ranking", "intervention_suggestion",
];
const learnerDomains: readonly LearnerDomain[] = [
  "proficiency", "curriculum", "grammar", "vocabulary", "pronunciation", "fluency", "goal", "preference", "recommendation",
];
const learnerContextPurposes: readonly LearnerContextPurpose[] = [
  "learn_adaptive_practice", "coach_session_adaptation", "teacher_instructional_support", "mind_learning_interpretation",
];
const lurexaProducts: readonly LurexaProduct[] = ["learn", "coach", "teach", "admin", "insight", "studio"];
const reviewStatuses: readonly DerivedObservationReviewStatus[] = ["automated_approved", "pending_review", "human_approved", "rejected"];
const observationMethods: readonly CandidateDerivedObservation["provenance"]["method"][] = ["deterministic_rule", "model", "hybrid"];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function hasValidObservationScope(value: unknown): boolean {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const scope = value as Record<string, unknown>;
  const purposes = scope.purposes;
  const products = scope.products;
  return isStringList(purposes)
    && purposes.every((purpose) => learnerContextPurposes.includes(purpose as LearnerContextPurpose))
    && isStringList(products)
    && products.every((product) => lurexaProducts.includes(product as LurexaProduct));
}

export function isCandidateDerivedObservation(value: unknown): value is CandidateDerivedObservation {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const observation = value as Record<string, unknown>;
  const scope = observation.scope;
  const generatedBy = observation.generatedBy;
  const provenance = observation.provenance;
  return observation.contractVersion === DERIVED_OBSERVATION_CONTRACT_VERSION
    && isNonEmptyString(observation.observationId)
    && isNonEmptyString(observation.learnerId)
    && mindInterpretationTypes.includes(observation.type as MindInterpretationType)
    && observation.status === "candidate"
    && learnerDomains.includes(observation.domain as LearnerDomain)
    && isNonEmptyString(observation.summary)
    && typeof observation.confidence === "number"
    && Number.isFinite(observation.confidence)
    && observation.confidence >= 0
    && observation.confidence <= 1
    && isStringList(observation.basedOnEvidenceIds)
    && new Set(observation.basedOnEvidenceIds).size === observation.basedOnEvidenceIds.length
    && isNonEmptyString(observation.generatedAt)
    && isNonEmptyString(observation.effectiveAt)
    && (observation.expiresAt === undefined || isNonEmptyString(observation.expiresAt))
    && typeof generatedBy === "object"
    && generatedBy !== null
    && isNonEmptyString((generatedBy as Record<string, unknown>).capability)
    && isNonEmptyString((generatedBy as Record<string, unknown>).modelPolicyVersion)
    && hasValidObservationScope(scope)
    && reviewStatuses.includes(observation.reviewStatus as DerivedObservationReviewStatus)
    && typeof provenance === "object"
    && provenance !== null
    && observationMethods.includes((provenance as Record<string, unknown>).method as CandidateDerivedObservation["provenance"]["method"]);
}

/** Core's minimized response; raw evidence and internal inference are excluded. */
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

export interface LearningEvidenceSubmission<TPayload = unknown> {
  evidence: LearningEvidence<TPayload>;
}

/**
 * Lightweight structural guard at the Core persistence boundary. Domain
 * authorization and payload validation remain the responsibility of the
 * relevant capability service; this guard prevents unversioned records from
 * becoming new trusted evidence.
 */
export function isLearningEvidenceV1(value: unknown): value is LearningEvidence {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const evidence = value as Record<string, unknown>;
  const source = evidence.source as Record<string, unknown> | null;
  return evidence.contractVersion === LEARNING_EVIDENCE_CONTRACT_VERSION
    && typeof evidence.id === "string"
    && typeof evidence.learnerId === "string"
    && typeof evidence.observedAt === "string"
    && (evidence.dataClassification === "standard" || evidence.dataClassification === "sensitive")
    && typeof source === "object"
    && source !== null
    && (source.knowledgeObjectIds === undefined || isStringList(source.knowledgeObjectIds))
    && typeof evidence.type === "string"
    && typeof evidence.provenance === "object"
    && evidence.provenance !== null;
}

export function assertLearningEvidenceV1(value: unknown): asserts value is LearningEvidence {
  if (!isLearningEvidenceV1(value)) {
    throw new Error("Learning evidence must conform to v1 before trusted persistence.");
  }
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

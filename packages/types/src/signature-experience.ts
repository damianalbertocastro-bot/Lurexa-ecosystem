import type { LurexaProduct } from "./learner";

export const SIGNATURE_EXPERIENCE_CONTRACT_VERSION = "1" as const;

/** Product owners. Campus is intentionally excluded: it is an institutional experience shell. */
export type LurexaProductId = LurexaProduct;

export type SignatureExperienceConsumer = LurexaProductId | "campus";

export type SignatureConfidence = "low" | "medium" | "high";
export type SignatureEvidenceFreshness = "current" | "aging" | "stale" | "unknown";

export type SignatureEvidenceBasis = {
  evidenceIds: string[];
  observationIds?: string[];
  windowStart?: string;
  windowEnd?: string;
  freshness: SignatureEvidenceFreshness;
  limitations: string[];
};

// -----------------------------------------------------------------------------
// Learner Pulse v1
// -----------------------------------------------------------------------------

export type LearnerPulseDimensionId =
  | "vocabulary"
  | "grammar"
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "phonetics";

export type LearnerPulseState =
  | "unknown"
  | "emerging"
  | "developing"
  | "stable"
  | "strong";

export type LearnerPulseMomentum =
  | "declining"
  | "watch"
  | "steady"
  | "improving"
  | "accelerating"
  | "unknown";

export type LearnerPulseDimensionV1 = {
  dimension: LearnerPulseDimensionId;
  state: LearnerPulseState;
  momentum: LearnerPulseMomentum;
  confidence: SignatureConfidence;
  summary: string;
  evidenceBasis: SignatureEvidenceBasis;
};

export type LearnerPulseHighlightKind = "strength" | "growth" | "focus" | "unknown";

export type LearnerPulseHighlightV1 = {
  kind: LearnerPulseHighlightKind;
  label: string;
  knowledgeObjectId?: string;
  dimension?: LearnerPulseDimensionId;
};

export type LearnerPulseProjectionV1 = {
  contractVersion: typeof SIGNATURE_EXPERIENCE_CONTRACT_VERSION;
  learnerId: string;
  organizationId?: string;
  generatedAt: string;
  consumer: SignatureExperienceConsumer;
  dimensions: LearnerPulseDimensionV1[];
  overallMomentum: LearnerPulseMomentum;
  highlights: LearnerPulseHighlightV1[];
  limitations: string[];
};

// -----------------------------------------------------------------------------
// Adaptive Learning Path v1
// -----------------------------------------------------------------------------

export type AdaptivePathNodeKind =
  | "canonical"
  | "reinforcement"
  | "coach_practice"
  | "review"
  | "enrichment";

export type AdaptivePathNodeState = "completed" | "current" | "recommended" | "locked" | "optional";

export type AdaptivePathReason =
  | "canonical_sequence"
  | "reinforce_recurring_error"
  | "practice_prerequisite"
  | "coach_speaking_transfer"
  | "review_after_instability"
  | "optional_enrichment";

export type AdaptivePathNodeV1 = {
  id: string;
  kind: AdaptivePathNodeKind;
  state: AdaptivePathNodeState;
  title: string;
  product: LurexaProductId;
  destinationRef: string;
  canonicalRef?: string;
  knowledgeObjectIds: string[];
  reason: AdaptivePathReason;
  mindTraceId?: string;
  required: boolean;
};

export type AdaptiveLearningPathV1 = {
  contractVersion: typeof SIGNATURE_EXPERIENCE_CONTRACT_VERSION;
  learnerId: string;
  organizationId?: string;
  generatedAt: string;
  curriculumRef: string;
  currentNodeId?: string;
  nodes: AdaptivePathNodeV1[];
  constraints: {
    canonicalRequirementsPreserved: true;
    autonomousRequiredContentSkipping: false;
  };
  evidenceBasis: SignatureEvidenceBasis;
};

// -----------------------------------------------------------------------------
// Memory Thread v1
// -----------------------------------------------------------------------------

export type MemoryThreadEventKind =
  | "observed"
  | "practiced"
  | "feedback"
  | "improved"
  | "stabilized"
  | "regressed"
  | "context";

export type MemoryThreadEventV1 = {
  id: string;
  occurredAt: string;
  kind: MemoryThreadEventKind;
  sourceProduct: LurexaProductId;
  title: string;
  summary: string;
  knowledgeObjectId?: string;
  evidenceIds: string[];
  observationIds?: string[];
  confidence: SignatureConfidence;
};

export type MemoryThreadV1 = {
  contractVersion: typeof SIGNATURE_EXPERIENCE_CONTRACT_VERSION;
  learnerId: string;
  organizationId?: string;
  generatedAt: string;
  topic: {
    title: string;
    knowledgeObjectId?: string;
    dimension?: LearnerPulseDimensionId;
  };
  events: MemoryThreadEventV1[];
  currentSummary?: string;
  limitations: string[];
};

// -----------------------------------------------------------------------------
// Mind Trace v1
// -----------------------------------------------------------------------------

export type MindTraceActionKind = "practice" | "review" | "continue" | "reflect" | "ask_teacher";

export type MindTraceV1 = {
  contractVersion: typeof SIGNATURE_EXPERIENCE_CONTRACT_VERSION;
  id: string;
  learnerId: string;
  generatedAt: string;
  consumer: SignatureExperienceConsumer;
  signal: string;
  interpretation: string;
  action: {
    kind: MindTraceActionKind;
    label: string;
    destinationRef?: string;
    product?: LurexaProductId;
  };
  confidence: SignatureConfidence;
  evidenceBasis: SignatureEvidenceBasis;
  limitations: string[];
  /** Human-readable approved rationale; never hidden chain-of-thought. */
  explanationPolicy: "approved_summary_only";
};

// -----------------------------------------------------------------------------
// Product Bridge v1
// -----------------------------------------------------------------------------

export type ProductBridgePurpose =
  | "targeted_practice"
  | "curriculum_reinforcement"
  | "return_to_learning"
  | "professional_growth"
  | "authorized_analysis"
  | "authoring_context";

export type ProductBridgeV1 = {
  contractVersion: typeof SIGNATURE_EXPERIENCE_CONTRACT_VERSION;
  bridgeId: string;
  actorId: string;
  learnerId?: string;
  organizationId?: string;
  source: SignatureExperienceConsumer;
  destination: SignatureExperienceConsumer;
  purpose: ProductBridgePurpose;
  destinationRef: string;
  contextRef?: string;
  createdAt: string;
  expiresAt: string;
  singleUse: boolean;
};

export type ProductBridgeResolutionV1 = {
  contractVersion: typeof SIGNATURE_EXPERIENCE_CONTRACT_VERSION;
  bridgeId: string;
  resolvedAt: string;
  destination: SignatureExperienceConsumer;
  destinationRef: string;
  authorizedContextRef?: string;
  limitations: string[];
};

// -----------------------------------------------------------------------------
// Knowledge Object v1
// -----------------------------------------------------------------------------

export type KnowledgeObjectKind =
  | "concept"
  | "skill"
  | "language_form"
  | "pronunciation_target"
  | "strategy"
  | "competency";

export type KnowledgeObjectRelationKind =
  | "prerequisite"
  | "supports"
  | "part_of"
  | "contrasts_with"
  | "commonly_confused_with"
  | "transfers_to";

export type KnowledgeObjectRelationV1 = {
  kind: KnowledgeObjectRelationKind;
  targetId: string;
};

export type KnowledgeObjectV1 = {
  contractVersion: typeof SIGNATURE_EXPERIENCE_CONTRACT_VERSION;
  id: string;
  kind: KnowledgeObjectKind;
  title: string;
  description: string;
  status: "draft" | "active" | "retired";
  language?: string;
  cefrLevels?: string[];
  skillDimensions: LearnerPulseDimensionId[];
  curriculumRefs: string[];
  relations: KnowledgeObjectRelationV1[];
  aliases: string[];
  tags: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
};

// -----------------------------------------------------------------------------
// Shared request contracts. Requests are not authorization grants.
// -----------------------------------------------------------------------------

export type SignatureProjectionKind = "learner_pulse" | "adaptive_path" | "memory_thread" | "mind_trace";
export type SignatureProjectionPurpose =
  | "learn_signature_experience"
  | "coach_signature_experience"
  | "teach_signature_experience";

export type SignatureProjectionRequestV1 = {
  contractVersion: typeof SIGNATURE_EXPERIENCE_CONTRACT_VERSION;
  learnerId: string;
  organizationId?: string;
  consumer: SignatureExperienceConsumer;
  purpose: SignatureProjectionPurpose;
  projection: SignatureProjectionKind;
  knowledgeObjectId?: string;
};

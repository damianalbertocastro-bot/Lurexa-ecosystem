import type {
  AdaptiveLearningPathV1,
  AdaptivePathNodeV1,
  LearnerContext,
  LearnerContextPurpose,
  LearnerContextRequest,
  LearnerPulseDimensionId,
  LearnerPulseDimensionV1,
  LearnerPulseProjectionV1,
  LearnerPulseState,
  MemoryThreadEventKind,
  MemoryThreadEventV1,
  MemoryThreadV1,
  MindTraceV1,
  SignatureConfidence,
  SignatureEvidenceFreshness,
  SignatureProjectionRequestV1,
  LearningEvidence,
} from "@lurexa/types";
import { getScopedLearnerContext } from "./learner-context.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";

const VERSION = "1" as const;

const consumerPolicy = {
  learn: { product: "learn", purpose: "learn_adaptive_practice" },
  coach: { product: "coach", purpose: "coach_session_adaptation" },
} as const satisfies Record<
  "learn" | "coach",
  { product: LearnerContextRequest["requestingProduct"]; purpose: LearnerContextPurpose }
>;

type AuthorizedSignatureConsumer = keyof typeof consumerPolicy;

function assertAuthorizedConsumer(
  consumer: SignatureProjectionRequestV1["consumer"],
): asserts consumer is AuthorizedSignatureConsumer {
  if (!(consumer in consumerPolicy)) {
    throw new Error(
      "This signature projection does not yet have an approved Core learner-context purpose for the requesting experience.",
    );
  }
}

function evidenceFreshness(latestEvidenceAt: string | null, now = Date.now()): SignatureEvidenceFreshness {
  if (!latestEvidenceAt) return "unknown";
  const timestamp = Date.parse(latestEvidenceAt);
  if (!Number.isFinite(timestamp)) return "unknown";
  const ageDays = (now - timestamp) / 86_400_000;
  if (ageDays <= 14) return "current";
  if (ageDays <= 45) return "aging";
  return "stale";
}

function confidenceFromNumber(value?: number): SignatureConfidence {
  if (typeof value !== "number") return "low";
  if (value >= 0.8) return "high";
  if (value >= 0.55) return "medium";
  return "low";
}

function stateForDomain(context: LearnerContext, domain: "grammar" | "vocabulary" | "pronunciation" | "fluency"): {
  state: LearnerPulseState;
  confidence: SignatureConfidence;
  summary: string;
} {
  const patterns = context.recurringPatterns?.filter((pattern) => pattern.domain === domain) ?? [];
  const targets = context.activeTargets?.[domain] ?? [];

  if (patterns.length > 0) {
    const strongest = patterns.slice().sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))[0];
    return {
      state: "developing",
      confidence: confidenceFromNumber(strongest?.confidence),
      summary: strongest?.summary ?? `Lurexa has identified a recurring ${domain} pattern.`,
    };
  }

  if (targets.length > 0) {
    return {
      state: "developing",
      confidence: "medium",
      summary: `Current focus: ${targets.slice(0, 2).join(", ")}.`,
    };
  }

  return {
    state: "unknown",
    confidence: "low",
    summary: "Not enough recent evidence to characterize this area yet.",
  };
}

function buildDimension(
  context: LearnerContext,
  dimension: LearnerPulseDimensionId,
  freshness: SignatureEvidenceFreshness,
  evidenceIds: string[],
): LearnerPulseDimensionV1 {
  const domain =
    dimension === "phonetics"
      ? "pronunciation"
      : dimension === "speaking"
        ? "fluency"
        : dimension === "grammar" || dimension === "vocabulary"
          ? dimension
          : null;

  if (!domain) {
    return {
      dimension,
      state: "unknown",
      momentum: "unknown",
      confidence: "low",
      summary: "Not enough governed evidence is available for this dimension in v1.",
      evidenceBasis: { evidenceIds, freshness, limitations: ["No v1 mapping is approved for this dimension yet."] },
    };
  }

  const derived = stateForDomain(context, domain);
  return {
    dimension,
    state: derived.state,
    momentum: "unknown",
    confidence: derived.confidence,
    summary: derived.summary,
    evidenceBasis: {
      evidenceIds,
      freshness,
      limitations: [
        "State reflects approved targets and recurring patterns; it is not a proficiency score.",
        "Momentum remains unknown until longitudinal comparison is explicitly supported.",
      ],
    },
  };
}

async function loadScopedContext(input: {
  actorId: string;
  request: SignatureProjectionRequestV1;
}) {
  assertAuthorizedConsumer(input.request.consumer);
  const delegatedLearnTeacher = input.request.consumer === "learn" && input.actorId !== input.request.learnerId;
  const policy = delegatedLearnTeacher
    ? { product: "learn", purpose: "teacher_instructional_support" } as const
    : consumerPolicy[input.request.consumer];
  return getScopedLearnerContext({
    actorId: input.actorId,
    request: {
      contractVersion: "1",
      learnerId: input.request.learnerId,
      ...(input.request.organizationId ? { organizationId: input.request.organizationId } : {}),
      requestingProduct: policy.product,
      purpose: policy.purpose,
      domains: [
        "proficiency",
        "curriculum",
        "grammar",
        "vocabulary",
        "pronunciation",
        "fluency",
        "recommendation",
      ],
    },
  });
}

export async function getLearnerPulseProjection(input: {
  actorId: string;
  request: SignatureProjectionRequestV1;
}): Promise<LearnerPulseProjectionV1> {
  const scoped = await loadScopedContext(input);
  const freshness = evidenceFreshness(scoped.evidenceSummary.latestEvidenceAt);
  const dimensions: LearnerPulseDimensionId[] = [
    "vocabulary",
    "grammar",
    "listening",
    "speaking",
    "reading",
    "writing",
    "phonetics",
  ];

  const projected = dimensions.map((dimension) =>
    buildDimension(scoped.context, dimension, freshness, []),
  );

  const focus = projected
    .filter((dimension) => dimension.state === "developing" || dimension.state === "emerging")
    .slice(0, 3)
    .map((dimension) => ({
      kind: "focus" as const,
      label: dimension.summary,
      dimension: dimension.dimension,
    }));

  return {
    contractVersion: VERSION,
    learnerId: input.request.learnerId,
    ...(scoped.context.organizationId ? { organizationId: scoped.context.organizationId } : {}),
    generatedAt: new Date().toISOString(),
    consumer: input.request.consumer,
    dimensions: projected,
    overallMomentum: "unknown",
    highlights: focus,
    limitations: [
      ...scoped.limitations,
      "Learner Pulse is a read projection of governed learner context, not the Learner Model itself.",
      "Unknown is intentionally preserved when evidence is insufficient.",
    ],
  };
}

function recommendationNode(
  recommendation: NonNullable<LearnerContext["recommendations"]>[number],
  index: number,
): AdaptivePathNodeV1 {
  return {
    id: `recommendation-${index + 1}`,
    kind: recommendation.outcome === "targeted_practice" ? "reinforcement" : "review",
    state: "recommended",
    title: recommendation.label,
    product: "learn",
    destinationRef: recommendation.activityId ?? recommendation.lessonId ?? recommendation.courseId ?? "learn:recommended-practice",
    knowledgeObjectIds: recommendation.competencyIds ?? [],
    reason: recommendation.outcome === "targeted_practice"
      ? "reinforce_recurring_error"
      : "review_after_instability",
    required: false,
  };
}

export async function getAdaptiveLearningPathProjection(input: {
  actorId: string;
  request: SignatureProjectionRequestV1;
}): Promise<AdaptiveLearningPathV1> {
  const scoped = await loadScopedContext(input);
  const curriculum = scoped.context.curriculum;
  const currentNode: AdaptivePathNodeV1 | null = curriculum?.lessonId
    ? {
        id: `canonical-${curriculum.lessonId}`,
        kind: "canonical",
        state: "current",
        title: "Current lesson",
        product: "learn",
        destinationRef: curriculum.lessonId,
        canonicalRef: curriculum.lessonId,
        knowledgeObjectIds: [],
        reason: "canonical_sequence",
        required: true,
      }
    : null;

  const recommendations = (scoped.context.recommendations ?? []).slice(0, 3).map(recommendationNode);
  const latestEvidenceAt = scoped.evidenceSummary.latestEvidenceAt;

  return {
    contractVersion: VERSION,
    learnerId: input.request.learnerId,
    ...(scoped.context.organizationId ? { organizationId: scoped.context.organizationId } : {}),
    generatedAt: new Date().toISOString(),
    curriculumRef: curriculum?.courseId ?? "unknown",
    ...(currentNode ? { currentNodeId: currentNode.id } : {}),
    nodes: [...(currentNode ? [currentNode] : []), ...recommendations],
    constraints: {
      canonicalRequirementsPreserved: true,
      autonomousRequiredContentSkipping: false,
    },
    evidenceBasis: {
      evidenceIds: [],
      ...(latestEvidenceAt ? { windowEnd: latestEvidenceAt } : {}),
      freshness: evidenceFreshness(latestEvidenceAt),
      limitations: [
        "v1 adds optional overlays and does not rewrite the canonical curriculum.",
        "Recommendation destinations remain in Learn until a specific cross-product handoff is approved.",
      ],
    },
  };
}

function mindTraceAction(context: LearnerContext): MindTraceV1["action"] {
  const recommendation = context.recommendations?.[0];
  if (!recommendation) {
    return { kind: "continue", label: "Continue your current learning path", product: "learn" };
  }

  return {
    kind: recommendation.outcome === "targeted_practice" ? "practice" : "review",
    label: recommendation.label,
    product: "learn",
    ...(recommendation.activityId || recommendation.lessonId || recommendation.courseId
      ? { destinationRef: recommendation.activityId ?? recommendation.lessonId ?? recommendation.courseId }
      : {}),
  };
}

export async function getMindTraceProjection(input: {
  actorId: string;
  request: SignatureProjectionRequestV1;
}): Promise<MindTraceV1> {
  const scoped = await loadScopedContext(input);
  const pattern = scoped.context.recurringPatterns?.[0];
  const recommendation = scoped.context.recommendations?.[0];
  const latestEvidenceAt = scoped.evidenceSummary.latestEvidenceAt;

  return {
    contractVersion: VERSION,
    id: `mind-trace:${input.request.learnerId}:${Date.now()}`,
    learnerId: input.request.learnerId,
    generatedAt: new Date().toISOString(),
    consumer: input.request.consumer,
    signal: pattern?.summary ?? "Lurexa does not yet have enough evidence for a specific learning signal.",
    interpretation: recommendation?.reason ?? "Continue collecting learning evidence before making a stronger adaptation.",
    action: mindTraceAction(scoped.context),
    confidence: confidenceFromNumber(pattern?.confidence),
    evidenceBasis: {
      evidenceIds: [],
      ...(latestEvidenceAt ? { windowEnd: latestEvidenceAt } : {}),
      freshness: evidenceFreshness(latestEvidenceAt),
      limitations: scoped.limitations,
    },
    limitations: [
      "This is an approved learner-facing rationale, not model chain-of-thought.",
      "The explanation is intentionally bounded by the context Core authorized for this purpose.",
    ],
    explanationPolicy: "approved_summary_only",
  };
}

function eventKind(evidence: LearningEvidence): MemoryThreadEventKind {
  switch (evidence.type) {
    case "correction_outcome":
      return "improved";
    case "assessment_result":
    case "activity_result":
      return "practiced";
    case "language_error":
    case "pronunciation_observation":
    case "fluency_observation":
      return "observed";
    default:
      return "context";
  }
}

function evidenceTitle(evidence: LearningEvidence): string {
  switch (evidence.type) {
    case "pronunciation_observation": return "Pronunciation observation";
    case "fluency_observation": return "Speaking fluency observation";
    case "language_error": return "Language pattern observed";
    case "correction_outcome": return "Correction outcome";
    case "assessment_result": return "Assessment evidence";
    case "activity_result": return "Practice completed";
    case "curriculum_progress": return "Curriculum progress";
    default: return "Learning context updated";
  }
}

export async function getMemoryThreadProjection(input: {
  actorId: string;
  request: SignatureProjectionRequestV1;
}): Promise<MemoryThreadV1> {
  if (input.actorId !== input.request.learnerId) {
    throw new Error("You may only request your own learner memory thread in v1.");
  }
  assertAuthorizedConsumer(input.request.consumer);

  const evidence = await new FirestoreLearningEvidenceRepository().listByLearner(input.request.learnerId);
  const scoped = evidence
    .filter((entry) => input.request.organizationId ? entry.organizationId === input.request.organizationId : true)
    .sort((a, b) => a.observedAt.localeCompare(b.observedAt))
    .slice(-20);

  const events: MemoryThreadEventV1[] = scoped.map((entry) => ({
    id: `thread:${entry.id}`,
    occurredAt: entry.observedAt,
    kind: eventKind(entry),
    sourceProduct: entry.source.product,
    title: evidenceTitle(entry),
    summary: entry.source.activityId
      ? `Evidence recorded from activity ${entry.source.activityId}.`
      : "Evidence recorded through a Core-governed learning interaction.",
    evidenceIds: [entry.id],
    confidence: confidenceFromNumber(entry.provenance.confidence),
  }));

  return {
    contractVersion: VERSION,
    learnerId: input.request.learnerId,
    ...(input.request.organizationId ? { organizationId: input.request.organizationId } : {}),
    generatedAt: new Date().toISOString(),
    topic: {
      title: input.request.knowledgeObjectId ? "Knowledge-object learning history" : "Recent learning development",
      ...(input.request.knowledgeObjectId ? { knowledgeObjectId: input.request.knowledgeObjectId } : {}),
    },
    events,
    ...(events.length > 0 ? { currentSummary: `${events.length} recent governed learning events are available in this thread.` } : {}),
    limitations: [
      "v1 Memory Thread never exposes raw evidence payloads.",
      "Events describe governed evidence provenance and should not be interpreted as a complete autobiographical learner history.",
      "Knowledge-object filtering will become precise when evidence producers emit canonical knowledgeObjectIds.",
    ],
  };
}

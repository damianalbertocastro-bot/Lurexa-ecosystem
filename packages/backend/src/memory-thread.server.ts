import type {
  LearnerContextPurpose,
  LearnerContextRequest,
  LearningEvidence,
  MemoryThreadEventKind,
  MemoryThreadEventV1,
  MemoryThreadV1,
  SignatureConfidence,
  SignatureProjectionRequestV1,
} from "@lurexa/types";
import { getScopedLearnerContext } from "./learner-context.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";

const consumerPolicy = {
  learn: { product: "learn", purpose: "learn_adaptive_practice" },
  coach: { product: "coach", purpose: "coach_session_adaptation" },
  teach: { product: "teach", purpose: "teacher_instructional_support" },
} as const satisfies Record<
  "learn" | "coach" | "teach",
  { product: LearnerContextRequest["requestingProduct"]; purpose: LearnerContextPurpose }
>;

type AuthorizedConsumer = keyof typeof consumerPolicy;

function assertConsumer(value: SignatureProjectionRequestV1["consumer"]): asserts value is AuthorizedConsumer {
  if (!(value in consumerPolicy)) {
    throw new Error("This Memory Thread consumer does not yet have an approved Core learner-context purpose.");
  }
}

function confidence(value?: number): SignatureConfidence {
  if (typeof value !== "number") return "low";
  if (value >= 0.8) return "high";
  if (value >= 0.55) return "medium";
  return "low";
}

function eventKind(evidence: LearningEvidence): MemoryThreadEventKind {
  switch (evidence.type) {
    case "correction_outcome": return "improved";
    case "assessment_result":
    case "activity_result": return "practiced";
    case "language_error":
    case "pronunciation_observation":
    case "fluency_observation": return "observed";
    default: return "context";
  }
}

function title(evidence: LearningEvidence): string {
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

function deriveApprovedNarrativeSummary(evidence: LearningEvidence): string {
  switch (evidence.type) {
    case "pronunciation_observation":
      return "Spoken pronunciation and phonological intelligibility evidence recorded.";
    case "fluency_observation":
      return "Spoken fluency and communicative pacing practice recorded.";
    case "language_error":
      return "Linguistic noticing and grammar pattern observed during practice.";
    case "correction_outcome":
      return "Targeted correction attempt completed and verified.";
    case "assessment_result":
      return "Summative assessment evidence captured across competency targets.";
    case "activity_result":
      return evidence.source.activityId
        ? `Completed interactive learning activity (${evidence.source.activityId}) with verified evidence.`
        : "Interactive learning activity completed with verified evidence.";
    case "curriculum_progress":
      return "Curriculum progress milestone advanced through verified evidence.";
    default:
      return evidence.source.activityId
        ? `Evidence recorded from activity ${evidence.source.activityId}.`
        : "Evidence recorded through a Core-governed learning interaction.";
  }
}

/**
 * Core-authorized Memory Thread projection.
 * It never mixes organization-scoped evidence implicitly and never exposes payloads.
 */
export async function getScopedMemoryThreadProjection(input: {
  actorId: string;
  request: SignatureProjectionRequestV1;
}): Promise<MemoryThreadV1> {
  if (input.actorId !== input.request.learnerId) {
    throw new Error("You may only request your own learner memory thread in v1.");
  }
  assertConsumer(input.request.consumer);
  const policy = consumerPolicy[input.request.consumer];

  const scopedContext = await getScopedLearnerContext({
    actorId: input.actorId,
    request: {
      contractVersion: "1",
      learnerId: input.request.learnerId,
      requestingProduct: policy.product,
      purpose: policy.purpose,
      domains: ["curriculum", "recommendation", "grammar", "vocabulary", "pronunciation", "fluency"],
    },
  });

  const activeOrganizationId = scopedContext.context.organizationId ?? null;
  const requestedKnowledgeObjectId = input.request.knowledgeObjectId;
  const allEvidence = await new FirestoreLearningEvidenceRepository().listByLearner(input.request.learnerId);

  const scopedEvidence = allEvidence
    .filter((entry) => activeOrganizationId
      ? entry.organizationId === activeOrganizationId
      : !entry.organizationId)
    .filter((entry) => requestedKnowledgeObjectId
      ? entry.source.knowledgeObjectIds?.includes(requestedKnowledgeObjectId) === true
      : true)
    .sort((a, b) => a.observedAt.localeCompare(b.observedAt))
    .slice(-20);

  const events: MemoryThreadEventV1[] = scopedEvidence.map((entry) => {
    const matchedKnowledgeObjectId = requestedKnowledgeObjectId
      ?? (entry.source.knowledgeObjectIds?.length === 1 ? entry.source.knowledgeObjectIds[0] : undefined);

    return {
      id: `thread:${entry.id}`,
      occurredAt: entry.observedAt,
      kind: eventKind(entry),
      sourceProduct: entry.source.product,
      title: title(entry),
      summary: deriveApprovedNarrativeSummary(entry),
      ...(matchedKnowledgeObjectId ? { knowledgeObjectId: matchedKnowledgeObjectId } : {}),
      evidenceIds: [entry.id],
      confidence: confidence(entry.provenance.confidence),
    };
  });

  return {
    contractVersion: "1",
    learnerId: input.request.learnerId,
    ...(activeOrganizationId ? { organizationId: activeOrganizationId } : {}),
    generatedAt: new Date().toISOString(),
    topic: {
      title: requestedKnowledgeObjectId ? "Knowledge-object learning history" : "Recent learning development",
      ...(requestedKnowledgeObjectId ? { knowledgeObjectId: requestedKnowledgeObjectId } : {}),
    },
    events,
    ...(events.length > 0
      ? { currentSummary: `${events.length} recent governed learning events are available in this thread.` }
      : {}),
    limitations: [
      "Memory Thread never exposes raw evidence payloads.",
      "Organization-scoped evidence is never mixed across institutions implicitly.",
      "Knowledge-object filtering includes only evidence explicitly mapped to that canonical object.",
      "Events are a governed learning-development projection, not a complete activity history.",
    ],
  };
}

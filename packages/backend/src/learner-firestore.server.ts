import type {
  LearnerInsight,
  LearningEvidence,
  LearningEvidenceType,
} from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";

function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mapLegacyEvidenceType(eventType: unknown): LearningEvidenceType | null {
  if (eventType === "lesson.completed") return "curriculum_progress";
  if (eventType === "assessment.submitted") return "assessment_result";
  if (eventType === "learning_activity.submitted") return "activity_result";
  return null;
}

function normalizeEvidenceDocument(
  id: string,
  value: FirebaseFirestore.DocumentData,
): LearningEvidence | null {
  if (
    typeof value.learnerId === "string"
    && typeof value.type === "string"
    && typeof value.observedAt === "string"
    && typeof value.source === "object"
    && value.source !== null
    && typeof value.provenance === "object"
    && value.provenance !== null
  ) {
    return { ...value, id } as LearningEvidence;
  }

  const legacyType = mapLegacyEvidenceType(value.eventType);
  if (!legacyType || typeof value.learnerId !== "string" || typeof value.occurredAt !== "string") {
    return null;
  }

  const source = typeof value.source === "object" && value.source !== null
    ? value.source as Record<string, unknown>
    : {};
  const authorizationContext = typeof value.authorizationContext === "object" && value.authorizationContext !== null
    ? value.authorizationContext as Record<string, unknown>
    : {};
  const actor = typeof value.actor === "object" && value.actor !== null
    ? value.actor as Record<string, unknown>
    : {};

  return {
    id: typeof value.evidenceId === "string" ? value.evidenceId : id,
    learnerId: value.learnerId,
    ...(typeof authorizationContext.organizationId === "string"
      ? { organizationId: authorizationContext.organizationId }
      : {}),
    source: {
      product: "learn",
      ...(typeof source.activityId === "string" ? { activityId: source.activityId } : {}),
      ...(typeof source.courseId === "string" ? { courseId: source.courseId } : {}),
      ...(typeof source.lessonId === "string" ? { lessonId: source.lessonId } : {}),
    },
    type: legacyType,
    observedAt: value.occurredAt,
    payload: value.payload ?? {},
    provenance: {
      method: "system_observed",
      ...(typeof actor.id === "string" ? { actorId: actor.id } : {}),
    },
  };
}

function evidenceDocumentsEquivalent(
  first: LearningEvidence,
  second: LearningEvidence,
): boolean {
  return JSON.stringify(stripUndefined(first)) === JSON.stringify(stripUndefined(second));
}

export class FirestoreLearningEvidenceRepository {
  async append<TPayload = unknown>(
    evidence: LearningEvidence<TPayload>,
  ): Promise<LearningEvidence<TPayload>> {
    const database = getServerFirestore();
    const reference = database.collection("learning-evidence").doc(evidence.id);
    const normalized = stripUndefined(evidence);

    await database.runTransaction(async (transaction) => {
      const existing = await transaction.get(reference);
      if (!existing.exists) {
        transaction.create(reference, normalized);
        return;
      }

      const existingEvidence = normalizeEvidenceDocument(reference.id, existing.data()!);
      if (!existingEvidence || !evidenceDocumentsEquivalent(existingEvidence, evidence)) {
        throw new Error(`Learning evidence id ${evidence.id} already exists with different content.`);
      }
    });

    return evidence;
  }

  async listByLearner(learnerId: string, organizationId?: string): Promise<LearningEvidence[]> {
    const snapshots = await getServerFirestore()
      .collection("learning-evidence")
      .where("learnerId", "==", learnerId)
      .get();

    return snapshots.docs
      .map((snapshot) => normalizeEvidenceDocument(snapshot.id, snapshot.data()))
      .filter((evidence): evidence is LearningEvidence => evidence !== null)
      .filter((evidence) => !organizationId || evidence.organizationId === organizationId)
      .sort((first, second) => first.observedAt.localeCompare(second.observedAt));
  }
}

export class FirestoreLearnerInsightRepository {
  async save(insight: LearnerInsight): Promise<LearnerInsight> {
    const reference = getServerFirestore().collection("learner-insights").doc(insight.id);
    await reference.set(stripUndefined(insight));
    return insight;
  }

  async listActiveByLearner(learnerId: string, organizationId?: string): Promise<LearnerInsight[]> {
    const snapshots = await getServerFirestore()
      .collection("learner-insights")
      .where("learnerId", "==", learnerId)
      .get();

    const now = new Date().toISOString();
    const insights = snapshots.docs.map((snapshot) => ({
      ...snapshot.data(),
      id: snapshot.id,
    }) as LearnerInsight);
    const inScope = insights.filter((insight) => !organizationId || insight.organizationId === organizationId);
    const superseded = new Set(
      inScope
        .map((insight) => insight.validity?.supersedesInsightId)
        .filter((id): id is string => Boolean(id)),
    );

    return inScope
      .filter((insight) => !superseded.has(insight.id))
      .filter((insight) => !insight.validity?.expiresAt || insight.validity.expiresAt > now)
      .sort((first, second) => first.generatedAt.localeCompare(second.generatedAt));
  }
}

import {
  assertLearningEvidenceV1,
  isCandidateDerivedObservation,
} from "@lurexa/types";
import type {
  ApprovedDerivedObservation,
  CandidateDerivedObservation,
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
    return {
      ...value,
      id,
      contractVersion: "1",
      dataClassification: value.dataClassification === "sensitive" ? "sensitive" : "standard",
    } as LearningEvidence;
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
    contractVersion: "1",
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
    dataClassification: "standard",
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

/** Pure Core policy validation, kept testable without a Firestore emulator. */
export function assertApprovableDerivedObservation(input: {
  candidate: CandidateDerivedObservation;
  authorizedEvidenceIds: readonly string[];
  policyId: string;
}): void {
  const { candidate } = input;
  if (!isCandidateDerivedObservation(candidate)) {
    throw new Error("Derived observation must conform to v1 before Core approval.");
  }
  if (!candidate.basedOnEvidenceIds.length) {
    throw new Error("Derived observations require an evidence basis.");
  }
  if (candidate.basedOnEvidenceIds.some((id) => !input.authorizedEvidenceIds.includes(id))) {
    throw new Error("Derived observation references evidence outside the authorized Core input.");
  }
  if (!candidate.scope.purposes.length || !candidate.scope.products.length) {
    throw new Error("Derived observation must declare a bounded consumer scope.");
  }
  if (!input.policyId?.trim()) {
    throw new Error("Derived observation approval requires a named Core policy.");
  }
}

export class FirestoreLearningEvidenceRepository {
  async append<TPayload = unknown>(
    evidence: LearningEvidence<TPayload>,
  ): Promise<LearningEvidence<TPayload>> {
    assertLearningEvidenceV1(evidence);
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
  /**
   * Core-owned approval gate for Mind candidates. This is intentionally kept
   * beside the persistence adapter so Mind cannot write inferred learner state
   * by calling Firestore directly.
   */
  async approveAndPersist(input: {
    candidate: CandidateDerivedObservation;
    authorizedEvidenceIds: readonly string[];
    policyId: string;
  }): Promise<ApprovedDerivedObservation> {
    const { candidate } = input;
    assertApprovableDerivedObservation(input);
    const existing = await getServerFirestore()
      .collection("learner-insights")
      .where("learnerId", "==", candidate.learnerId)
      .get();
    const superseded = existing.docs
      .map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }) as { id: string; status?: unknown; domain?: unknown; organizationId?: unknown; generatedBy?: unknown; generatedAt?: unknown })
      .filter((entry) => entry.id !== candidate.observationId
        && entry.status === "active"
        && entry.domain === candidate.domain
        && entry.organizationId === candidate.organizationId
        && typeof entry.generatedBy === "object"
        && entry.generatedBy !== null
        && (entry.generatedBy as { capability?: unknown }).capability === candidate.generatedBy.capability
        && typeof entry.generatedAt === "string")
      .sort((first, second) => String(second.generatedAt).localeCompare(String(first.generatedAt)))[0];
    const approved: ApprovedDerivedObservation = {
      ...candidate,
      status: "active",
      approvedAt: new Date().toISOString(),
      approvedByPolicy: input.policyId,
      ...(superseded ? { supersedesObservationId: superseded.id } : {}),
    };
    await getServerFirestore().collection("learner-insights").doc(approved.observationId).set(stripUndefined({
      ...approved,
      // Legacy read models retain their stable fields while v1 provenance
      // remains available for Core validation and future context projections.
      id: approved.observationId,
      validity: approved.expiresAt || approved.supersedesObservationId ? {
        ...(approved.expiresAt ? { expiresAt: approved.expiresAt } : {}),
        ...(approved.supersedesObservationId ? { supersedesInsightId: approved.supersedesObservationId } : {}),
      } : undefined,
    }));
    return approved;
  }

  /** @deprecated Direct derived-state persistence is intentionally disabled. */
  async save(_insight: LearnerInsight): Promise<never> {
    throw new Error(
      "Direct learner insight repository writes are disabled. Use Core approveAndPersist with an authorized evidence basis.",
    );
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
    const inScope = insights
      .filter((insight) => !organizationId || insight.organizationId === organizationId)
      // Legacy insights did not have a lifecycle status. New v1 observations
      // must be explicitly active before they become a context source.
      .filter((insight) => !("status" in insight) || (insight as LearnerInsight & { status?: unknown }).status === "active");
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

import type {
  EducatorQualificationCandidateInputV1,
  EducatorQualificationEventV1,
  EducatorQualificationScopeV1,
  EducatorQualificationStatus,
  EducatorQualificationTransitionInputV1,
} from "@lurexa/types";
import { getServerFirebaseAuth, getServerFirestore } from "../firebase-admin.server";

const transitions: Record<EducatorQualificationStatus, EducatorQualificationStatus[]> = {
  candidate: ["under_review", "revoked"],
  under_review: ["qualified", "candidate", "revoked"],
  qualified: ["suspended", "expired", "revoked"],
  suspended: ["qualified", "expired", "revoked"],
  expired: [],
  revoked: [],
};

async function requireQualificationReviewer(authorization: string | null): Promise<string> {
  if (!authorization?.startsWith("Bearer ")) throw new Error("Authentication is required.");
  const token = await getServerFirebaseAuth().verifyIdToken(authorization.slice(7));
  if (token.role !== "super_admin" && token.educatorQualificationReviewer !== true) {
    throw new Error("Qualification reviewer access is required.");
  }
  return token.uid;
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function ensureCandidateEvidence(input: EducatorQualificationCandidateInputV1): void {
  if (!input.userId.trim()) throw new Error("Educator is required.");
  if (!input.levels.length) throw new Error("At least one qualification level is required.");
  if (!input.policyVersion.trim()) throw new Error("Qualification policy version is required.");
  if (!input.evidenceRefs.length && !input.practiceEvidenceRefs.length) {
    throw new Error("Qualification candidates require trusted evidence references.");
  }
}

async function appendEvent(input: Omit<EducatorQualificationEventV1, "id" | "contractVersion">): Promise<EducatorQualificationEventV1> {
  const reference = getServerFirestore()
    .collection("educator-qualifications")
    .doc(input.userId)
    .collection("scopes")
    .doc(input.qualificationId)
    .collection("events")
    .doc();
  const event: EducatorQualificationEventV1 = { contractVersion: "1", id: reference.id, ...input };
  await reference.set(event);
  return event;
}

async function suspendLinkedAuthorizations(userId: string, qualificationId: string): Promise<void> {
  const grants = await getServerFirestore()
    .collection("teaching-authorizations")
    .doc(userId)
    .collection("grants")
    .where("qualificationId", "==", qualificationId)
    .get();
  const batch = getServerFirestore().batch();
  let mutations = 0;
  for (const grant of grants.docs) {
    if (grant.data().status === "active") {
      batch.update(grant.ref, { status: "suspended", updatedAt: new Date().toISOString(), suspendedByQualificationLifecycle: true });
      mutations += 1;
    }
  }
  if (mutations) await batch.commit();
}

export const EducatorQualificationLifecycleService = {
  async createCandidate(
    authorization: string | null,
    input: EducatorQualificationCandidateInputV1,
  ): Promise<EducatorQualificationScopeV1> {
    const actorId = await requireQualificationReviewer(authorization);
    ensureCandidateEvidence(input);
    const reference = getServerFirestore()
      .collection("educator-qualifications")
      .doc(input.userId)
      .collection("scopes")
      .doc();
    const now = new Date().toISOString();
    const candidate: EducatorQualificationScopeV1 = {
      contractVersion: "1",
      id: reference.id,
      userId: input.userId,
      status: "candidate",
      subject: input.subject,
      levels: [...new Set(input.levels)],
      methodologyCompetencyIds: unique(input.methodologyCompetencyIds),
      planningCompetencyIds: unique(input.planningCompetencyIds),
      assessmentCompetencyIds: unique(input.assessmentCompetencyIds),
      practiceEvidenceRefs: unique(input.practiceEvidenceRefs),
      languageProficiencyLevel: input.languageProficiencyLevel ?? null,
      evidenceRefs: unique(input.evidenceRefs),
      provenance: { method: "human_review", actorId, policyVersion: input.policyVersion },
      issuedAt: now,
      validUntil: null,
    };
    await reference.set(candidate);
    await appendEvent({
      qualificationId: candidate.id,
      userId: candidate.userId,
      fromStatus: null,
      toStatus: "candidate",
      actorId,
      reason: "Qualification candidate created for governed review.",
      evidenceRefs: unique([...candidate.evidenceRefs, ...candidate.practiceEvidenceRefs]),
      policyVersion: input.policyVersion,
      occurredAt: now,
    });
    return candidate;
  },

  async transition(
    authorization: string | null,
    input: EducatorQualificationTransitionInputV1,
  ): Promise<{ qualification: EducatorQualificationScopeV1; event: EducatorQualificationEventV1 }> {
    const actorId = await requireQualificationReviewer(authorization);
    if (!input.reason.trim()) throw new Error("A qualification decision reason is required.");
    const reference = getServerFirestore()
      .collection("educator-qualifications")
      .doc(input.userId)
      .collection("scopes")
      .doc(input.qualificationId);
    const snapshot = await reference.get();
    if (!snapshot.exists) throw new Error("Qualification not found.");
    const current = snapshot.data() as EducatorQualificationScopeV1;
    if (!transitions[current.status].includes(input.toStatus)) {
      throw new Error(`Qualification transition ${current.status} → ${input.toStatus} is not allowed.`);
    }
    if (input.toStatus === "qualified") {
      const evidenceCount = current.evidenceRefs.length + current.practiceEvidenceRefs.length + (input.evidenceRefs?.length ?? 0);
      if (evidenceCount === 0) throw new Error("Qualification requires trusted evidence.");
      if (!input.validUntil) throw new Error("Qualified scopes require a validity date.");
      if (input.validUntil <= new Date().toISOString()) throw new Error("Qualification validity must end in the future.");
    }
    if (input.toStatus === "qualified" && current.status === "suspended" && current.validUntil && current.validUntil <= new Date().toISOString()) {
      throw new Error("An expired qualification cannot be reactivated; create a new candidate after reassessment.");
    }

    const next: EducatorQualificationScopeV1 = {
      ...current,
      status: input.toStatus,
      validUntil: input.toStatus === "qualified" ? input.validUntil ?? current.validUntil ?? null : current.validUntil ?? null,
    };
    await reference.update({ status: next.status, validUntil: next.validUntil, updatedAt: new Date().toISOString() });
    const event = await appendEvent({
      qualificationId: current.id,
      userId: current.userId,
      fromStatus: current.status,
      toStatus: input.toStatus,
      actorId,
      reason: input.reason.trim(),
      evidenceRefs: unique(input.evidenceRefs ?? []),
      policyVersion: current.provenance.policyVersion,
      occurredAt: new Date().toISOString(),
    });
    if (["suspended", "expired", "revoked"].includes(input.toStatus)) {
      await suspendLinkedAuthorizations(current.userId, current.id);
    }
    return { qualification: next, event };
  },

  async listEvents(
    authorization: string | null,
    userId: string,
    qualificationId: string,
  ): Promise<EducatorQualificationEventV1[]> {
    await requireQualificationReviewer(authorization);
    const snapshot = await getServerFirestore()
      .collection("educator-qualifications")
      .doc(userId)
      .collection("scopes")
      .doc(qualificationId)
      .collection("events")
      .get();
    return snapshot.docs
      .map((doc) => doc.data() as EducatorQualificationEventV1)
      .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  },
};

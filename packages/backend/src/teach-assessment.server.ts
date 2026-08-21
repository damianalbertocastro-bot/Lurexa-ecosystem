import type {
  EducatorProfile,
  TeachAssessmentRequest,
  TeachAssessmentResult,
  TeachAssessmentReviewResult,
  TeachCefrLevel,
  VerifiedEducatorCompetency,
} from "@lurexa/types";
import { getServerFirebaseAuth, getServerFirestore } from "./firebase-admin.server";
import { TeachReviewServerService } from "./teach-review.server";

type TrustedAssessorRole = "admin" | "super_admin";

export interface TrustedTeachAssessor {
  uid: string;
  email: string | null;
  role: TrustedAssessorRole;
}

function requireAssessorRole(role: unknown): asserts role is TrustedAssessorRole {
  if (role !== "admin" && role !== "super_admin") throw new Error("Trusted Teach assessor access is required.");
}

function asAssessment(id: string, data: FirebaseFirestore.DocumentData): TeachAssessmentRequest {
  return { id, ...data } as TeachAssessmentRequest;
}

export const TeachAssessmentServerService = {
  async authenticate(authorization: string | null): Promise<TrustedTeachAssessor> {
    if (!authorization?.startsWith("Bearer ")) throw new Error("Authentication is required.");
    const token = await getServerFirebaseAuth().verifyIdToken(authorization.slice(7));
    requireAssessorRole(token.role);
    return { uid: token.uid, email: token.email ?? null, role: token.role };
  },

  async listPending(actor: TrustedTeachAssessor): Promise<TeachAssessmentRequest[]> {
    requireAssessorRole(actor.role);
    const snapshot = await getServerFirestore().collection("teachAssessments").where("status", "in", ["requested", "in_review"]).orderBy("requestedAt", "asc").get();
    return snapshot.docs.map((item) => asAssessment(item.id, item.data()));
  },

  async completeAssessment(
    actor: TrustedTeachAssessor,
    assessmentId: string,
    input: {
      verifiedCefrLevel?: TeachCefrLevel;
      competencies: Array<{ id: string; name: string; level: number }>;
      summary: string;
      rubricVersion?: string;
    },
  ): Promise<TeachAssessmentReviewResult> {
    requireAssessorRole(actor.role);
    if (!input.summary.trim()) throw new Error("An assessment summary is required.");
    if (!input.verifiedCefrLevel && input.competencies.length === 0) throw new Error("Record at least one verified assessment outcome.");

    const database = getServerFirestore();
    const assessmentRef = database.collection("teachAssessments").doc(assessmentId);
    const timestamp = new Date().toISOString();

    const assessment = await database.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(assessmentRef);
      if (!snapshot.exists) throw new Error("Assessment request not found.");
      const current = asAssessment(snapshot.id, snapshot.data()!);
      if (current.userId === actor.uid) throw new Error("Assessors cannot verify their own professional assessment.");
      if (!(["requested", "in_review"] as TeachAssessmentRequest["status"][]).includes(current.status)) throw new Error("This assessment is no longer awaiting review.");
      const next: TeachAssessmentRequest = { ...current, status: "completed", assessorId: actor.uid, startedAt: current.startedAt ?? timestamp, completedAt: timestamp, updatedAt: timestamp };
      transaction.set(assessmentRef, next, { merge: false });
      return next;
    });

    const verifiedCompetencies: VerifiedEducatorCompetency[] = input.competencies.map((item) => ({
      id: item.id,
      name: item.name,
      level: Math.max(0, Math.min(5, item.level)),
      assessorId: actor.uid,
      assessmentId,
      verifiedAt: timestamp,
    }));

    const result: TeachAssessmentResult = {
      id: assessmentId,
      assessmentId,
      userId: assessment.userId,
      assessorId: actor.uid,
      ...(input.verifiedCefrLevel ? { verifiedCefrLevel: input.verifiedCefrLevel } : {}),
      verifiedCompetencies,
      summary: input.summary.trim(),
      rubricVersion: input.rubricVersion?.trim() || "teach-mvp-v1",
      completedAt: timestamp,
    };

    const profileRef = database.collection("educatorProfiles").doc(assessment.userId);
    const profileSnapshot = await profileRef.get();
    if (!profileSnapshot.exists) throw new Error("Educator profile not found.");
    const profile = { userId: assessment.userId, ...profileSnapshot.data() } as EducatorProfile;
    const merged = new Map((profile.verifiedCompetencies ?? []).map((item) => [item.id, item]));
    for (const competency of verifiedCompetencies) merged.set(competency.id, competency);

    const batch = database.batch();
    batch.set(database.collection("teachAssessmentResults").doc(assessmentId), result, { merge: false });
    batch.set(profileRef, {
      ...(input.verifiedCefrLevel ? { verifiedCefrLevel: input.verifiedCefrLevel } : {}),
      verifiedCompetencies: Array.from(merged.values()),
      updatedAt: timestamp,
    }, { merge: true });
    await batch.commit();

    const reconciled = await TeachReviewServerService.reconcileEducatorState(assessment.userId, `assessor:${actor.uid}`);
    return { assessment, result, ...reconciled };
  },
};

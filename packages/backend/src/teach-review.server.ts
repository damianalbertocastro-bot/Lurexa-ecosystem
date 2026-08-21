import type {
  EducatorProfile,
  TeachCredentialAward,
  TeachCredentialDefinition,
  TeachEnrollment,
  TeachEvidenceReviewDecision,
  TeachEvidenceReviewResult,
  TeachEvidenceSubmission,
  TeachRecommendation,
} from "@lurexa/types";
import { getServerFirebaseAuth, getServerFirestore } from "./firebase-admin.server";
import { TEACH_MVP_CREDENTIALS } from "./teach-catalog";
import { evaluateTeachCredential } from "./teach-credential";
import { TeachMindService } from "./teach-mind.service";

type TrustedTeachReviewerRole = "admin" | "super_admin";

export interface TrustedTeachReviewer {
  uid: string;
  email: string | null;
  role: TrustedTeachReviewerRole;
}

function asEvidence(id: string, data: FirebaseFirestore.DocumentData): TeachEvidenceSubmission {
  return { id, ...data } as TeachEvidenceSubmission;
}

function asEnrollment(id: string, data: FirebaseFirestore.DocumentData): TeachEnrollment {
  return { id, ...data } as TeachEnrollment;
}

function asAward(id: string, data: FirebaseFirestore.DocumentData): TeachCredentialAward {
  return { id, ...data } as TeachCredentialAward;
}

function asDefinition(id: string, data: FirebaseFirestore.DocumentData): TeachCredentialDefinition {
  return { id, ...data } as TeachCredentialDefinition;
}

function requireReviewerRole(role: unknown): asserts role is TrustedTeachReviewerRole {
  if (role !== "admin" && role !== "super_admin") {
    throw new Error("Trusted Teach reviewer access is required.");
  }
}

async function loadCredentialDefinitions(): Promise<TeachCredentialDefinition[]> {
  const database = getServerFirestore();
  const snapshot = await database.collection("teachCredentialDefinitions").where("active", "==", true).get();
  if (!snapshot.empty) return snapshot.docs.map((item) => asDefinition(item.id, item.data()));
  return TEACH_MVP_CREDENTIALS;
}

function matchingEvidenceIds(definition: TeachCredentialDefinition, evidence: TeachEvidenceSubmission[]): string[] {
  const competencyIds = definition.requirements
    .filter((requirement) => requirement.type === "verified-evidence" && requirement.competencyId)
    .map((requirement) => requirement.competencyId!);

  return evidence
    .filter((item) => item.status === "verified")
    .filter((item) => competencyIds.length === 0 || item.competencyIds.some((id) => competencyIds.includes(id)))
    .map((item) => item.id);
}

function credentialRecommendation(
  userId: string,
  awards: TeachCredentialAward[],
  sourceEvidenceIds: string[],
): TeachRecommendation {
  const award = awards[0]!;
  return {
    id: `teach-mvp-${userId}`,
    userId,
    title: awards.length === 1 ? "You earned a new professional credential." : `You earned ${awards.length} new professional credentials.`,
    rationale: `Verified professional evidence now satisfies the requirements for ${award.credentialId}${awards.length > 1 ? " and additional credentials" : ""}. Your next step should build on that demonstrated capability.`,
    actionLabel: "View credentials",
    actionHref: "/certifications",
    priority: "high",
    status: "active",
    sourceEvidenceIds,
    createdAt: new Date().toISOString(),
  };
}

function rejectedEvidenceRecommendation(userId: string, evidence: TeachEvidenceSubmission): TeachRecommendation {
  return {
    id: `teach-mvp-${userId}`,
    userId,
    title: "Revise your professional evidence before resubmitting.",
    rationale: evidence.reviewerNote || "The submitted evidence needs another iteration before it can be verified as professional evidence.",
    actionLabel: "Review evidence portfolio",
    actionHref: "/growth",
    priority: "high",
    status: "active",
    sourceEvidenceIds: [evidence.id],
    createdAt: new Date().toISOString(),
  };
}

export const TeachReviewServerService = {
  async authenticate(authorization: string | null): Promise<TrustedTeachReviewer> {
    if (!authorization?.startsWith("Bearer ")) throw new Error("Authentication is required.");
    const token = await getServerFirebaseAuth().verifyIdToken(authorization.slice(7));
    requireReviewerRole(token.role);
    return { uid: token.uid, email: token.email ?? null, role: token.role };
  },

  async listSubmittedEvidence(actor: TrustedTeachReviewer): Promise<TeachEvidenceSubmission[]> {
    requireReviewerRole(actor.role);
    const snapshot = await getServerFirestore()
      .collection("teachEvidence")
      .where("status", "==", "submitted")
      .orderBy("createdAt", "asc")
      .get();
    return snapshot.docs.map((item) => asEvidence(item.id, item.data()));
  },

  async reconcileEducatorState(userId: string, actorId = "system:teach-credential-engine") {
    const database = getServerFirestore();
    const [profileSnapshot, enrollmentSnapshot, evidenceSnapshot, awardSnapshot, definitions] = await Promise.all([
      database.collection("educatorProfiles").doc(userId).get(),
      database.collection("teachEnrollments").where("userId", "==", userId).get(),
      database.collection("teachEvidence").where("userId", "==", userId).get(),
      database.collection("teachCredentialAwards").where("userId", "==", userId).get(),
      loadCredentialDefinitions(),
    ]);

    const profile = profileSnapshot.exists ? ({ userId, ...profileSnapshot.data() } as EducatorProfile) : null;
    const enrollments = enrollmentSnapshot.docs.map((item) => asEnrollment(item.id, item.data()));
    const evidence = evidenceSnapshot.docs.map((item) => asEvidence(item.id, item.data()));
    const existingAwards = awardSnapshot.docs.map((item) => asAward(item.id, item.data()));
    const existingCredentialIds = new Set(existingAwards.map((item) => item.credentialId));
    const timestamp = new Date().toISOString();
    const newlyAwardedCredentials: TeachCredentialAward[] = [];

    for (const definition of definitions) {
      if (existingCredentialIds.has(definition.id)) continue;
      const evaluation = evaluateTeachCredential(definition, profile, enrollments, evidence);
      if (!evaluation.eligible) continue;

      const id = `${userId}_${definition.id}`;
      newlyAwardedCredentials.push({
        id,
        credentialId: definition.id,
        userId,
        awardedAt: timestamp,
        awardedBy: actorId,
        evidenceIds: matchingEvidenceIds(definition, evidence),
      });
    }

    let recommendation: TeachRecommendation | null = null;
    if (profile) {
      recommendation = newlyAwardedCredentials.length > 0
        ? credentialRecommendation(
          userId,
          newlyAwardedCredentials,
          Array.from(new Set(newlyAwardedCredentials.flatMap((award) => award.evidenceIds))),
        )
        : TeachMindService.recommendNextStep(profile, enrollments, evidence);
    }

    const batch = database.batch();
    for (const award of newlyAwardedCredentials) {
      batch.set(database.collection("teachCredentialAwards").doc(award.id), award, { merge: false });
    }
    if (recommendation) {
      batch.set(database.collection("teachRecommendations").doc(recommendation.id), recommendation, { merge: false });
    }
    if (newlyAwardedCredentials.length > 0 || recommendation) await batch.commit();

    return { newlyAwardedCredentials, recommendation };
  },

  async reviewEvidence(
    actor: TrustedTeachReviewer,
    evidenceId: string,
    decision: TeachEvidenceReviewDecision,
    reviewerNote: string,
  ): Promise<TeachEvidenceReviewResult> {
    requireReviewerRole(actor.role);
    const database = getServerFirestore();
    const evidenceRef = database.collection("teachEvidence").doc(evidenceId);
    const timestamp = new Date().toISOString();

    const reviewedEvidence = await database.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(evidenceRef);
      if (!snapshot.exists) throw new Error("Evidence submission not found.");
      const evidence = asEvidence(snapshot.id, snapshot.data()!);
      if (evidence.status !== "submitted") throw new Error("Only submitted evidence can be reviewed.");
      if (evidence.userId === actor.uid) throw new Error("Reviewers cannot verify their own professional evidence.");

      const next: TeachEvidenceSubmission = {
        ...evidence,
        status: decision,
        reviewerId: actor.uid,
        reviewerNote: reviewerNote.trim(),
        reviewedAt: timestamp,
        updatedAt: timestamp,
        ...(decision === "verified" ? { verifiedAt: timestamp } : {}),
      };
      transaction.set(evidenceRef, next, { merge: false });
      return next;
    });

    if (decision === "rejected") {
      const recommendation = rejectedEvidenceRecommendation(reviewedEvidence.userId, reviewedEvidence);
      await database.collection("teachRecommendations").doc(recommendation.id).set(recommendation, { merge: false });
      return { evidence: reviewedEvidence, newlyAwardedCredentials: [], recommendation };
    }

    const reconciled = await this.reconcileEducatorState(reviewedEvidence.userId, "system:teach-credential-engine");
    return { evidence: reviewedEvidence, ...reconciled };
  },
};

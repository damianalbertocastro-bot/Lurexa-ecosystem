import type { TeacherGuidancePayload } from "@lurexa/types";
import { getServerFirestore } from "../firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "../learner-firestore.server";
import { refreshLearnerIntelligence } from "./learner-intelligence.server";
import type { AuthenticatedActor } from "../course-platform.server";

export interface TeacherReturnLoopResult {
  reviewId: string;
  learnerId: string;
  status: string;
  evidenceId: string;
  intelligenceRefreshed: boolean;
  persistedAt: string;
}

async function authorizeTeacherGuidance(actor: AuthenticatedActor, guidance: TeacherGuidancePayload): Promise<string> {
  if (actor.uid !== guidance.teacherId) {
    throw new Error("Authenticated teacher does not match the guidance author.");
  }

  const database = getServerFirestore();
  const courseSnapshot = await database.collection("courses").doc(guidance.courseId).get();
  if (!courseSnapshot.exists) throw new Error("Course not found.");
  const organizationId = courseSnapshot.data()?.orgId;
  if (typeof organizationId !== "string" || !organizationId) {
    throw new Error("Course organization is unavailable.");
  }

  const [teacherMembership, learnerMembership] = await Promise.all([
    database.collection("user-memberships").doc(actor.uid).collection("organizations").doc(organizationId).get(),
    database.collection("user-memberships").doc(guidance.learnerId).collection("organizations").doc(organizationId).get(),
  ]);
  const teacherRole = teacherMembership.data()?.role;
  if (!teacherMembership.exists || !["owner", "admin", "teacher"].includes(String(teacherRole))) {
    throw new Error("A teacher organization membership is required.");
  }
  if (!learnerMembership.exists) {
    throw new Error("Learner is not a member of the course organization.");
  }
  return organizationId;
}

/**
 * Core-owned teacher return loop.
 *
 * Teacher guidance is persisted as an auditable authoritative record and as
 * immutable learning evidence. No product service writes a derived LearnerModel
 * directly. Core then asks Mind to interpret the new authorized evidence and
 * applies the normal candidate-approval gate.
 */
export async function submitTeacherGuidance(input: {
  actor: AuthenticatedActor;
  guidance: TeacherGuidancePayload;
}): Promise<TeacherReturnLoopResult> {
  const { actor, guidance } = input;
  const organizationId = await authorizeTeacherGuidance(actor, guidance);
  const database = getServerFirestore();
  const persistedAt = new Date().toISOString();
  const evidenceId = `teacher_${guidance.reviewId}`.replace(/[^a-zA-Z0-9._-]/g, "_");

  await database.collection("teacher-guidance").doc(guidance.reviewId).set({
    ...guidance,
    organizationId,
    persistedAt,
  });

  const evidenceRepository = new FirestoreLearningEvidenceRepository();
  await evidenceRepository.append({
    contractVersion: "1",
    id: evidenceId,
    learnerId: guidance.learnerId,
    organizationId,
    source: {
      product: "learn",
      activityId: guidance.activityId,
      courseId: guidance.courseId,
      lessonId: guidance.lessonId,
    },
    type: "assessment_result",
    observedAt: guidance.reviewedAt,
    dataClassification: "standard",
    payload: guidance,
    provenance: {
      method: "teacher_reported",
      actorId: actor.uid,
      confidence: 1,
    },
  });

  let intelligenceRefreshed = true;
  try {
    await refreshLearnerIntelligence({
      learnerId: guidance.learnerId,
      organizationId,
    });
  } catch (error) {
    intelligenceRefreshed = false;
    console.error("Learner intelligence refresh failed after teacher guidance evidence capture.", error);
  }

  return {
    reviewId: guidance.reviewId,
    learnerId: guidance.learnerId,
    status: guidance.status,
    evidenceId,
    intelligenceRefreshed,
    persistedAt,
  };
}

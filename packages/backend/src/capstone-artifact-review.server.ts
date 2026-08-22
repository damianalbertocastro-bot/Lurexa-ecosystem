import type { LearnTutorTurn, LearningEvidence } from "@lurexa/types";
import { A1_COURSE_ID } from "./a1-capstone.server";
import type { AuthenticatedActor } from "./course-platform.server";
import { getServerFirestore, getServerStorageBucket } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";

type TeacherRole = "owner" | "admin" | "teacher";

async function requireTeacherAccess(actor: AuthenticatedActor): Promise<string> {
  const database = getServerFirestore();
  const courseSnapshot = await database.collection("courses").doc(A1_COURSE_ID).get();
  if (!courseSnapshot.exists) throw new Error("A1 course not found.");
  const organizationId = courseSnapshot.data()?.orgId;
  if (typeof organizationId !== "string" || !organizationId) throw new Error("A1 course organization is unavailable.");
  const membership = await database.collection("user-memberships").doc(actor.uid).collection("organizations").doc(organizationId).get();
  const role = membership.data()?.role;
  if (!membership.exists || !(["owner", "admin", "teacher"] as TeacherRole[]).includes(role as TeacherRole)) {
    throw new Error("A teacher organization membership is required.");
  }
  return organizationId;
}

async function requireLearner(learnerId: string, organizationId: string): Promise<void> {
  const membership = await getServerFirestore().collection("user-memberships").doc(learnerId).collection("organizations").doc(organizationId).get();
  if (!membership.exists) throw new Error("Learner is not part of this organization.");
}

function payloadFor(evidence: LearningEvidence): Record<string, unknown> {
  return typeof evidence.payload === "object" && evidence.payload !== null && !Array.isArray(evidence.payload)
    ? evidence.payload as Record<string, unknown>
    : {};
}

async function requireEvidence(actor: AuthenticatedActor, learnerId: string, evidenceId: string): Promise<{
  organizationId: string;
  source: LearningEvidence;
}> {
  const organizationId = await requireTeacherAccess(actor);
  await requireLearner(learnerId, organizationId);
  const evidence = await new FirestoreLearningEvidenceRepository().listByLearner(learnerId, organizationId);
  const source = evidence.find((item) => item.id === evidenceId);
  if (!source) throw new Error("Capstone evidence not found.");
  if (source.source.courseId !== A1_COURSE_ID) throw new Error("Capstone evidence is not part of the A1 course.");
  return { organizationId, source };
}

export const CapstoneArtifactReviewService = {
  async loadA1Recording(actor: AuthenticatedActor, learnerId: string, evidenceId: string): Promise<{ bytes: Buffer; contentType: string }> {
    const { organizationId, source } = await requireEvidence(actor, learnerId, evidenceId);
    const payload = payloadFor(source);
    if (payload.event !== "spoken_evidence.recorded" || typeof payload.recordingId !== "string") {
      throw new Error("This capstone evidence does not contain a reviewable recording.");
    }

    const recordSnapshot = await getServerFirestore().collection("spoken-evidence").doc(payload.recordingId).get();
    if (!recordSnapshot.exists) throw new Error("Spoken evidence record not found.");
    const record = recordSnapshot.data() as {
      learnerId?: unknown;
      organizationId?: unknown;
      courseId?: unknown;
      storagePath?: unknown;
      contentType?: unknown;
      byteLength?: unknown;
    };
    if (record.learnerId !== learnerId || record.organizationId !== organizationId || record.courseId !== A1_COURSE_ID) {
      throw new Error("Spoken evidence ownership does not match the requested learner/course.");
    }
    if (typeof record.storagePath !== "string" || !record.storagePath.startsWith("spoken-evidence/")) {
      throw new Error("Spoken evidence storage path is invalid.");
    }
    if (typeof record.byteLength === "number" && record.byteLength > 8 * 1024 * 1024) {
      throw new Error("Spoken evidence is too large to review in this workflow.");
    }

    const [bytes] = await getServerStorageBucket().file(record.storagePath).download();
    if (!bytes.length) throw new Error("Spoken evidence recording is empty.");
    return {
      bytes,
      contentType: typeof record.contentType === "string" ? record.contentType : "audio/webm",
    };
  },

  async loadA1RoleplayTranscript(actor: AuthenticatedActor, learnerId: string, evidenceId: string): Promise<{ transcript: LearnTutorTurn[]; sessionId: string }> {
    const { organizationId, source } = await requireEvidence(actor, learnerId, evidenceId);
    const payload = payloadFor(source);
    if (payload.event !== "ai_roleplay.turn" || source.source.sessionId === undefined) {
      throw new Error("This capstone evidence does not contain a reviewable roleplay session.");
    }
    const sessionSnapshot = await getServerFirestore().collection("learn-tutor-sessions").doc(source.source.sessionId).get();
    if (!sessionSnapshot.exists) throw new Error("Tutor session not found.");
    const session = sessionSnapshot.data() as {
      learnerId?: unknown;
      organizationId?: unknown;
      courseId?: unknown;
      lessonId?: unknown;
      activityId?: unknown;
      transcript?: unknown;
    };
    if (session.learnerId !== learnerId || session.organizationId !== organizationId || session.courseId !== A1_COURSE_ID) {
      throw new Error("Tutor session ownership does not match the requested learner/course.");
    }
    if (source.source.lessonId && session.lessonId !== source.source.lessonId) throw new Error("Tutor session lesson does not match the evidence source.");
    if (source.source.activityId && session.activityId !== source.source.activityId) throw new Error("Tutor session activity does not match the evidence source.");
    if (!Array.isArray(session.transcript)) throw new Error("Tutor session transcript is unavailable.");
    const transcript = session.transcript.filter((turn): turn is LearnTutorTurn => {
      if (typeof turn !== "object" || turn === null || Array.isArray(turn)) return false;
      const candidate = turn as Partial<LearnTutorTurn>;
      return (candidate.sender === "learner" || candidate.sender === "tutor") && typeof candidate.text === "string" && typeof candidate.timestamp === "string";
    });
    return { transcript, sessionId: source.source.sessionId };
  },
};

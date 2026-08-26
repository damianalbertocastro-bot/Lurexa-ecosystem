import type { CoachSession, CoachSessionEndResult } from "@lurexa/types";
import type { AuthenticatedActor } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { refreshLearnerIntelligence } from "./core/learner-intelligence.server";
import { createProductBridge } from "./product-bridge.server";

const SELF_PACED_ORGANIZATION_ID = "lurexa-self-paced";

async function loadOwnedSession(actor: AuthenticatedActor, sessionId: string): Promise<CoachSession> {
  const snapshot = await getServerFirestore().collection("coach-sessions").doc(sessionId).get();
  if (!snapshot.exists) throw new Error("Coach session not found.");
  const session = snapshot.data() as CoachSession;
  if (session.learnerId !== actor.uid) throw new Error("You do not have access to this Coach session.");
  return session;
}

async function redactCompletedCoachTurnEvidence(input: { learnerId: string; sessionId: string }): Promise<void> {
  const database = getServerFirestore();
  const snapshots = await database.collection("learning-evidence").where("source.activityId", "==", input.sessionId).get();
  const writes = snapshots.docs.flatMap((snapshot) => {
    const value = snapshot.data();
    if (value.learnerId !== input.learnerId || value.source?.product !== "coach") return [];
    if (typeof value.payload !== "object" || value.payload === null || Array.isArray(value.payload)) return [];
    const payload = value.payload as Record<string, unknown>;
    if (!("learnerForm" in payload)) return [];
    const { learnerForm: _discardedLearnerForm, ...minimizedPayload } = payload;
    void _discardedLearnerForm;
    return [snapshot.ref.set({ payload: minimizedPayload }, { merge: true })];
  });
  await Promise.all(writes);
}

async function appendProfessionalCoachEvidence(actorId: string, session: CoachSession): Promise<void> {
  const reference = getServerFirestore()
    .collection("educator-professional-evidence")
    .doc(actorId)
    .collection("records")
    .doc(`coach_session_${session.id}`);
  await reference.set({
    contractVersion: "1",
    id: reference.id,
    educatorId: actorId,
    type: "professional_language_practice",
    source: { product: "coach", sessionId: session.id, purpose: "professional_growth" },
    observedAt: session.updatedAt,
    payload: {
      event: "coach.educator_session_completed",
      learnerTurnCount: session.transcript.filter((message) => message.sender === "learner").length,
      pronunciationTargetCount: session.focus.pronunciationTargets?.length ?? 0,
      fluencyTargetCount: session.focus.fluencyTargets?.length ?? 0,
    },
    provenance: { method: "system_observed", actorId, confidence: 1 },
    privacy: { rawTranscriptStored: false, studentContextIncluded: false },
  });
}

/**
 * Completes learner and educator-professional Coach sessions through distinct
 * return loops. Educator mode writes a minimized professional evidence record
 * and returns to Teach. Learner mode preserves the established Learn loop.
 */
export async function endCoachSession(actor: AuthenticatedActor, input: { sessionId: string }): Promise<CoachSessionEndResult> {
  if (!input.sessionId.trim()) throw new Error("sessionId is required for ending a Coach session.");
  const database = getServerFirestore();
  const session = await loadOwnedSession(actor, input.sessionId);
  if (session.status !== "active") throw new Error("This Coach session has already been completed.");

  const educatorMode = session.mode === "educator_professional";
  if (educatorMode) {
    await appendProfessionalCoachEvidence(actor.uid, session);
  } else {
    const completionEvidenceAt = session.updatedAt;
    const evidenceRepository = new FirestoreLearningEvidenceRepository();
    await evidenceRepository.append({
      contractVersion: "1",
      id: `coach_session_completed_${session.id}`,
      learnerId: actor.uid,
      organizationId: SELF_PACED_ORGANIZATION_ID,
      source: { product: "coach", sessionId: session.id },
      type: "activity_result",
      observedAt: completionEvidenceAt,
      dataClassification: "standard",
      payload: {
        event: "coach.session_completed",
        sessionId: session.id,
        learnerTurnCount: session.transcript.filter((message) => message.sender === "learner").length,
        courseId: session.focus.courseId ?? null,
        lessonId: session.focus.lessonId ?? null,
      },
      provenance: { method: "system_observed", actorId: actor.uid, confidence: 1 },
    });
    await refreshLearnerIntelligence({ learnerId: actor.uid, organizationId: SELF_PACED_ORGANIZATION_ID });
  }

  await redactCompletedCoachTurnEvidence({ learnerId: actor.uid, sessionId: session.id });

  const returnBridge = await createProductBridge({
    actorId: actor.uid,
    learnerId: actor.uid,
    organizationId: educatorMode ? undefined : SELF_PACED_ORGANIZATION_ID,
    source: "coach",
    destination: educatorMode ? "teach" : "learn",
    purpose: educatorMode ? "professional_growth" : "return_to_learning",
    destinationRef: educatorMode ? "/growth-plan" : "/dashboard",
    contextRef: educatorMode ? `educator-coach-session:${session.id}` : `coach-session:${session.id}`,
    singleUse: true,
  });

  const completedAt = new Date().toISOString();
  const completedSession: CoachSession = { ...session, status: "completed", transcript: [], completedAt, updatedAt: completedAt };
  await database.collection("coach-sessions").doc(session.id).set(completedSession, { merge: true });
  return { session: completedSession, returnBridge };
}

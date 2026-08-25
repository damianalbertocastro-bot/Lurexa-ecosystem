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

/**
 * Closes a Coach session through Core-owned evidence and returns a purpose-scoped
 * Product Bridge. Downstream work happens before the session is marked complete,
 * so a transient failure does not strand the learner in a completed session with
 * no return path. The completion evidence ID/timestamp are deterministic across
 * retries for the same session.
 */
export async function endCoachSession(
  actor: AuthenticatedActor,
  input: { sessionId: string },
): Promise<CoachSessionEndResult> {
  if (!input.sessionId.trim()) throw new Error("sessionId is required for ending a Coach session.");

  const database = getServerFirestore();
  const session = await loadOwnedSession(actor, input.sessionId);
  if (session.status !== "active") throw new Error("This Coach session has already been completed.");

  const completionEvidenceAt = session.updatedAt;
  const evidenceRepository = new FirestoreLearningEvidenceRepository();
  await evidenceRepository.append({
    contractVersion: "1",
    id: `coach_session_completed_${session.id}`,
    learnerId: actor.uid,
    organizationId: SELF_PACED_ORGANIZATION_ID,
    source: {
      product: "coach",
      sessionId: session.id,
    },
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
    provenance: {
      method: "system_observed",
      actorId: actor.uid,
      confidence: 1,
    },
  });

  await refreshLearnerIntelligence({
    learnerId: actor.uid,
    organizationId: SELF_PACED_ORGANIZATION_ID,
  });

  const returnBridge = await createProductBridge({
    actorId: actor.uid,
    learnerId: actor.uid,
    organizationId: SELF_PACED_ORGANIZATION_ID,
    source: "coach",
    destination: "learn",
    purpose: "return_to_learning",
    destinationRef: "/dashboard",
    contextRef: `coach-session:${session.id}`,
    singleUse: true,
  });

  const completedAt = new Date().toISOString();
  const completedSession: CoachSession = {
    ...session,
    status: "completed",
    completedAt,
    updatedAt: completedAt,
  };
  await database.collection("coach-sessions").doc(session.id).set(completedSession, { merge: true });

  return {
    session: completedSession,
    returnBridge,
  };
}

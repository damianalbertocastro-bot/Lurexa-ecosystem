import type { CoachSession, CoachSessionStartResult } from "@lurexa/types";
import type { AuthenticatedActor } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";
import { getScopedLearnerContext } from "./learner-context.server";

/**
 * Re-authorizes a previously started Coach session after client restoration.
 * The browser may remember only the opaque session ID; trusted session state and
 * learner context are reloaded server-side after identity and ownership checks.
 */
export async function resumeCoachSession(
  actor: AuthenticatedActor,
  input: { sessionId: string },
): Promise<CoachSessionStartResult> {
  const sessionId = input.sessionId.trim();
  if (!sessionId) throw new Error("sessionId is required for resuming a Coach session.");

  const snapshot = await getServerFirestore().collection("coach-sessions").doc(sessionId).get();
  if (!snapshot.exists) throw new Error("Coach session not found.");

  const session = snapshot.data() as CoachSession;
  if (session.learnerId !== actor.uid) throw new Error("You do not have access to this Coach session.");
  if (session.status !== "active") throw new Error("This Coach session has already been completed.");

  const scoped = await getScopedLearnerContext({
    actorId: actor.uid,
    request: {
      contractVersion: "1",
      learnerId: actor.uid,
      requestingProduct: "coach",
      purpose: "coach_session_adaptation",
      domains: [
        "proficiency",
        "curriculum",
        "grammar",
        "vocabulary",
        "pronunciation",
        "fluency",
        "goal",
        "recommendation",
      ],
    },
  });

  return {
    session,
    learnerContext: scoped.context,
  };
}

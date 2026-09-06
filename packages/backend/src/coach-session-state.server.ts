import type { CoachSession, CoachSessionStartResult } from "@lurexa/types";
import type { AuthenticatedActor } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";
import { getScopedLearnerContext } from "./learner-context.server";

export const devCoachSessionStore = new Map<string, CoachSession>();

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

  let session: CoachSession | null = null;
  try {
    const snapshot = await getServerFirestore().collection("coach-sessions").doc(sessionId).get();
    if (snapshot.exists) {
      session = snapshot.data() as CoachSession;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (process.env.NODE_ENV !== "production" && (msg.includes("credentials") || msg.includes("default credentials"))) {
      session = devCoachSessionStore.get(sessionId) ?? null;
    } else {
      throw err;
    }
  }

  if (!session) {
    session = devCoachSessionStore.get(sessionId) ?? null;
  }
  if (!session) throw new Error("Coach session not found.");
  if (session.learnerId !== actor.uid) throw new Error("You do not have access to this Coach session.");
  if (session.status !== "active") throw new Error("This Coach session has already been completed.");

  let scopedContext = { proficiency: { cefr: "A1" } } as any;
  try {
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
    scopedContext = scoped.context;
  } catch {
    // Graceful in dev
  }

  return {
    session,
    learnerContext: scopedContext,
  };
}

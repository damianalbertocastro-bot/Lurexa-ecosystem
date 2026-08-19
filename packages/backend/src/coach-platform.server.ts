import type { CoachSession, CoachSessionStartResult } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { getScopedLearnerContext } from "./learner-context.server";
import type { AuthenticatedActor } from "./course-platform.server";

function buildOpeningMessage(result: CoachSessionStartResult["learnerContext"]): string {
  const parts = ["Welcome back. We'll continue from what Lurexa already knows about your learning."];

  if (result.proficiency?.cefr) {
    parts.push(`I'll keep the conversation appropriate for CEFR ${result.proficiency.cefr}.`);
  }
  if (result.curriculum?.lessonId) {
    parts.push("We'll connect today's speaking practice to your recent Learn work.");
  }
  if (result.activeTargets?.pronunciation?.length) {
    parts.push(`Pronunciation focus: ${result.activeTargets.pronunciation.slice(0, 2).join(", ")}.`);
  } else if (result.activeTargets?.fluency?.length) {
    parts.push(`Fluency focus: ${result.activeTargets.fluency.slice(0, 2).join(", ")}.`);
  } else {
    parts.push("We'll prioritize intelligibility, naturalness, and useful speaking practice rather than accent erasure.");
  }

  return parts.join(" ");
}

export const CoachPlatformService = {
  async startSession(actor: AuthenticatedActor): Promise<CoachSessionStartResult> {
    const scoped = await getScopedLearnerContext({
      actorId: actor.uid,
      learnerId: actor.uid,
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
    });

    const database = getServerFirestore();
    const reference = database.collection("coach-sessions").doc();
    const now = new Date().toISOString();
    const session: CoachSession = {
      id: reference.id,
      learnerId: actor.uid,
      status: "active",
      focus: {
        ...(scoped.context.proficiency?.cefr ? { cefr: scoped.context.proficiency.cefr } : {}),
        ...(scoped.context.curriculum?.courseId ? { courseId: scoped.context.curriculum.courseId } : {}),
        ...(scoped.context.curriculum?.lessonId ? { lessonId: scoped.context.curriculum.lessonId } : {}),
        ...(scoped.context.goals?.length ? { goals: scoped.context.goals } : {}),
        ...(scoped.context.activeTargets?.pronunciation?.length
          ? { pronunciationTargets: scoped.context.activeTargets.pronunciation }
          : {}),
        ...(scoped.context.activeTargets?.fluency?.length
          ? { fluencyTargets: scoped.context.activeTargets.fluency }
          : {}),
      },
      transcript: [
        {
          sender: "coach",
          text: buildOpeningMessage(scoped.context),
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    await reference.set(session);
    return { session, learnerContext: scoped.context };
  },
};

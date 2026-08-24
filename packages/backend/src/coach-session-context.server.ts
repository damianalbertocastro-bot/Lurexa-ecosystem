import type {
  LearnerContext,
  LearnerPattern,
  LearnerRecommendationAction,
} from "@lurexa/types";
import { getScopedLearnerContext } from "./learner-context.server";

export interface CoachSessionFocus {
  learnerId: string;
  cefr?: string;
  courseId?: string;
  lessonId?: string;
  pronunciationTargets: string[];
  fluencyTargets: string[];
  recurringPatterns: LearnerPattern[];
  recommendations: LearnerRecommendationAction[];
  goals: string[];
  generatedAt: string;
}

/**
 * Product-side projection builder for Lurexa Coach.
 *
 * Coach never reads raw learner evidence or an independent Coach profile. It
 * asks Core for the same learner's purpose-scoped context and prepares only the
 * fields needed to adapt the next speaking session.
 */
export async function getCoachSessionContext(input: {
  actorId: string;
  learnerId: string;
}): Promise<CoachSessionFocus> {
  const response = await getScopedLearnerContext({
    actorId: input.actorId,
    request: {
      contractVersion: "1",
      learnerId: input.learnerId,
      requestingProduct: "coach",
      purpose: "coach_session_adaptation",
      domains: [
        "proficiency",
        "curriculum",
        "pronunciation",
        "fluency",
        "goal",
        "recommendation",
      ],
    },
  });

  return buildCoachSessionFocus(response.context);
}

/** Pure projection kept separately testable from Core persistence. */
export function buildCoachSessionFocus(context: LearnerContext): CoachSessionFocus {
  return {
    learnerId: context.learnerId,
    ...(context.proficiency?.cefr ? { cefr: context.proficiency.cefr } : {}),
    ...(context.curriculum?.courseId ? { courseId: context.curriculum.courseId } : {}),
    ...(context.curriculum?.lessonId ? { lessonId: context.curriculum.lessonId } : {}),
    pronunciationTargets: [...(context.activeTargets?.pronunciation ?? [])],
    fluencyTargets: [...(context.activeTargets?.fluency ?? [])],
    recurringPatterns: [...(context.recurringPatterns ?? [])],
    recommendations: [...(context.recommendations ?? [])],
    goals: [...(context.goals ?? [])],
    generatedAt: context.generatedAt,
  };
}

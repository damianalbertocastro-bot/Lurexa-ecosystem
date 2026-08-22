import {
  onboardSelfPacedLearner,
  type PlacementAnswer,
  type SelfPacedGoal,
  type SelfPacedOnboardingResult,
} from "./self-paced-onboarding.server";
import {
  A1_PRODUCTION_COURSE_ID,
  buildA1ProductionCurriculum,
  provisionA1ProductionCurriculum,
} from "./a1-production-curriculum.server";
import { assertA1ProductionCurriculum } from "./a1-production-validation.server";

export type { PlacementAnswer, SelfPacedGoal };

/**
 * Preserves the existing tested onboarding/placement behavior, then upgrades
 * an A1 starter enrollment to the full trusted A1 production curriculum.
 * The provisioner is idempotent and never rewrites learner progress/evidence.
 */
export async function onboardProductionLearner(input: {
  learnerId: string;
  email: string | null;
  goal: SelfPacedGoal;
  placementAnswers?: PlacementAnswer[];
}): Promise<SelfPacedOnboardingResult> {
  const result = await onboardSelfPacedLearner(input);
  if (result.courseId === A1_PRODUCTION_COURSE_ID) {
    assertA1ProductionCurriculum(buildA1ProductionCurriculum());
    await provisionA1ProductionCurriculum();
  }
  return result;
}

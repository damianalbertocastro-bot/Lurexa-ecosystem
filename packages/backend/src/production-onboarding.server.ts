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
import {
  A2_PRODUCTION_COURSE_ID,
  ensureA2ProductionCurriculumInFirestore,
} from "./a2-production-curriculum.server";
import {
  B1_PRODUCTION_COURSE_ID,
  ensureB1ProductionCurriculumInFirestore,
} from "./b1-production-curriculum.server";
import {
  B2_PRODUCTION_COURSE_ID,
  ensureB2ProductionCurriculumInFirestore,
} from "./b2-production-curriculum.server";
import {
  C1_PRODUCTION_COURSE_ID,
  ensureC1ProductionCurriculumInFirestore,
} from "./c1-production-curriculum.server";
import {
  C2_PRODUCTION_COURSE_ID,
  ensureC2ProductionCurriculumInFirestore,
} from "./c2-production-curriculum.server";
import { assertA1ProductionCurriculum } from "./a1-production-validation.server";

export type { PlacementAnswer, SelfPacedGoal };

/**
 * Preserves the existing tested onboarding/placement behavior, then upgrades
 * an A1, A2, B1, B2, C1, or C2 starter enrollment to the full trusted production curriculum.
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
  } else if (result.courseId === A2_PRODUCTION_COURSE_ID) {
    await ensureA2ProductionCurriculumInFirestore();
  } else if (result.courseId === B1_PRODUCTION_COURSE_ID) {
    await ensureB1ProductionCurriculumInFirestore();
  } else if (result.courseId === B2_PRODUCTION_COURSE_ID) {
    await ensureB2ProductionCurriculumInFirestore();
  } else if (result.courseId === C1_PRODUCTION_COURSE_ID) {
    await ensureC1ProductionCurriculumInFirestore();
  } else if (result.courseId === C2_PRODUCTION_COURSE_ID) {
    await ensureC2ProductionCurriculumInFirestore();
  }
  return result;
}

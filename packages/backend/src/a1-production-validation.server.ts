import type { LearningActivity } from "@lurexa/types";
import { buildA1ProductionCurriculum, type A1ProductionCurriculumBundle } from "./a1-production-curriculum.server";
import { parseLearningCapability } from "./learning-capability-validation";

const EXPECTED_MODULE_IDS = [
  "english-a1-m2-numbers",
  "english-a1-m3-people",
  "english-a1-m4-routines",
  "english-a1-m5-food",
  "english-a1-m6-neighborhood",
  "english-a1-m7-preferences",
  "english-a1-m8-integration",
] as const;

const CAPSTONE_LESSON_IDS = [
  "a1-m8-u3-l1-my-life-in-english",
  "a1-m8-u3-l2-conversation-challenge",
  "a1-m8-u3-l3-capstone",
] as const;

function assertActivity(value: unknown, lessonId: string): LearningActivity {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${lessonId} contains an invalid learning activity.`);
  }
  const activity = value as Partial<LearningActivity>;
  if (
    activity.schemaVersion !== "1"
    || !["short_response", "single_choice"].includes(activity.type)
    || typeof activity.title !== "string"
    || typeof activity.instructions !== "string"
    || typeof activity.prompt !== "string"
    || !Array.isArray(activity.competencyIds)
    || !activity.competencyIds.length
    || !activity.competencyIds.every((id) => typeof id === "string" && id.startsWith("EN.A1."))
    || typeof activity.estimatedMinutes !== "number"
    || activity.required !== true
  ) {
    throw new Error(`${lessonId} contains an invalid required Create & Apply activity.`);
  }
  if (activity.type === "single_choice" && (!Array.isArray(activity.options) || !activity.options.length || !Array.isArray(activity.correctAnswers) || !activity.correctAnswers.length)) {
    throw new Error(`${lessonId} contains an invalid scored comprehension activity.`);
  }
  return activity as LearningActivity;
}

export function assertA1ProductionCurriculum(bundle: A1ProductionCurriculumBundle = buildA1ProductionCurriculum()): void {
  if (bundle.modules.length !== EXPECTED_MODULE_IDS.length) {
    throw new Error(`A1 Modules 2-8 must contain ${EXPECTED_MODULE_IDS.length} production modules.`);
  }
  if (bundle.lessons.length !== 44) {
    throw new Error(`A1 Modules 2-8 must currently contain 44 production lesson objects; found ${bundle.lessons.length}.`);
  }

  const moduleIds = new Set(bundle.modules.map((module) => module.id));
  for (const moduleId of EXPECTED_MODULE_IDS) {
    if (!moduleIds.has(moduleId)) throw new Error(`A1 production curriculum is missing ${moduleId}.`);
  }

  const lessonIds = new Set<string>();
  const capabilityIds = new Set<string>();
  for (const lesson of bundle.lessons) {
    if (lessonIds.has(lesson.id)) throw new Error(`Duplicate A1 lesson id: ${lesson.id}.`);
    lessonIds.add(lesson.id);
    if (!moduleIds.has(lesson.moduleId)) throw new Error(`${lesson.id} points to an unknown A1 production module.`);

    const listeningCapabilities = [];
    const productiveCapabilities = [];
    const requiredCreateApply = [];
    const requiredComprehension = [];
    const blockIds = new Set<string>();

    for (const block of lesson.contentBlocks) {
      if (blockIds.has(block.id)) throw new Error(`${lesson.id} contains duplicate block id ${block.id}.`);
      blockIds.add(block.id);
      if (block.type !== "interactive") continue;

      if (Object.prototype.hasOwnProperty.call(block.data, "capability")) {
        const capability = parseLearningCapability(block.data.capability);
        if (capabilityIds.has(capability.id)) throw new Error(`Duplicate A1 capability id: ${capability.id}.`);
        capabilityIds.add(capability.id);
        if (!capability.competencyIds.every((id) => id.startsWith("EN.A1."))) {
          throw new Error(`${lesson.id} contains a non-A1 capability competency.`);
        }
        if (capability.kind === "model_listening" && capability.required) listeningCapabilities.push(capability);
        if ((capability.kind === "recorded_speaking" || capability.kind === "ai_roleplay") && capability.required) productiveCapabilities.push(capability);
      } else if (Object.prototype.hasOwnProperty.call(block.data, "activity")) {
        const activity = assertActivity(block.data.activity, lesson.id);
        if (activity.type === "short_response") requiredCreateApply.push(activity);
        if (activity.type === "single_choice" && activity.stage === "COMPREHENSION") requiredComprehension.push(activity);
      } else {
        throw new Error(`${lesson.id} contains an interactive block without a trusted activity or capability.`);
      }
    }

    if (!listeningCapabilities.length) throw new Error(`${lesson.id} needs required real listening.`);
    if (!productiveCapabilities.length) throw new Error(`${lesson.id} needs required speaking or interaction evidence.`);
    if (!requiredCreateApply.length) throw new Error(`${lesson.id} needs required learner-created evidence.`);
    if (!requiredComprehension.length) throw new Error(`${lesson.id} needs required scored comprehension evidence.`);
  }

  for (const lessonId of CAPSTONE_LESSON_IDS) {
    if (!lessonIds.has(lessonId)) throw new Error(`A1 capstone runtime is missing ${lessonId}.`);
  }
}

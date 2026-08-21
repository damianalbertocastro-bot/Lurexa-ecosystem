import type {
  AIRoleplayCapability,
  LearningCapability,
  ModelListeningCapability,
  RecordedSpeakingCapability,
} from "@lurexa/types";
import type { AuthenticatedActor } from "./course-platform.server";
import { CoursePlatformService } from "./course-platform.server";
import { parseLearningCapability } from "./learning-capability-validation";

/**
 * Trusted Core boundary for advanced Learn capabilities.
 * The browser supplies identifiers only; capability configuration is always
 * resolved from the authorized, persisted lesson object.
 */
export async function resolveLearningCapability(input: {
  actor: AuthenticatedActor;
  courseId: string;
  lessonId: string;
  activityId: string;
}): Promise<LearningCapability> {
  const { lesson } = await CoursePlatformService.getLesson(input.actor, input.courseId, input.lessonId);
  const block = lesson.contentBlocks.find((entry) => {
    if (entry.type !== "interactive") return false;
    const capability = entry.data.capability;
    if (typeof capability !== "object" || capability === null || Array.isArray(capability)) return false;
    const capabilityId = (capability as { id?: unknown }).id;
    return entry.id === input.activityId || capabilityId === input.activityId;
  });
  if (!block) throw new Error("Learning capability not found in this lesson.");

  const capability = parseLearningCapability(block.data.capability);
  if (capability.id !== input.activityId && block.id !== input.activityId) {
    throw new Error("Learning capability ID does not match the requested activity.");
  }
  return capability;
}

export async function resolveModelListeningCapability(input: {
  actor: AuthenticatedActor;
  courseId: string;
  lessonId: string;
  activityId: string;
}): Promise<ModelListeningCapability> {
  const capability = await resolveLearningCapability(input);
  if (capability.kind !== "model_listening") throw new Error("This activity is not model listening.");
  return capability;
}

export async function resolveRoleplayCapability(input: {
  actor: AuthenticatedActor;
  courseId: string;
  lessonId: string;
  activityId: string;
}): Promise<AIRoleplayCapability> {
  const capability = await resolveLearningCapability(input);
  if (capability.kind !== "ai_roleplay") throw new Error("This activity is not an AI roleplay.");
  return capability;
}

export async function resolveRecordedSpeakingCapability(input: {
  actor: AuthenticatedActor;
  courseId: string;
  lessonId: string;
  activityId: string;
}): Promise<RecordedSpeakingCapability> {
  const capability = await resolveLearningCapability(input);
  if (capability.kind !== "recorded_speaking") throw new Error("This activity is not recorded speaking.");
  return capability;
}

import type { LearningCapability } from "@lurexa/types";
import { CoursePlatformService, type AuthenticatedActor } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { resolveModelListeningCapability } from "./learning-capability.server";
import { refreshLearnerIntelligence } from "./learner-intelligence-pipeline.server";

function readRequiredCapabilities(lesson: Awaited<ReturnType<typeof CoursePlatformService.getLesson>>["lesson"]): LearningCapability[] {
  return lesson.contentBlocks.flatMap((block) => {
    if (block.type !== "interactive") return [];
    const capability = block.data.capability;
    if (typeof capability !== "object" || capability === null || Array.isArray(capability)) return [];
    const typed = capability as LearningCapability;
    return typed.required ? [typed] : [];
  });
}

function sourceMatches(data: FirebaseFirestore.DocumentData, courseId: string, lessonId: string, activityId: string): boolean {
  const source = data.source as { courseId?: unknown; lessonId?: unknown; activityId?: unknown } | undefined;
  return source?.courseId === courseId && source.lessonId === lessonId && source.activityId === activityId;
}

function evidenceCompletesCapability(capability: LearningCapability, data: FirebaseFirestore.DocumentData): boolean {
  const payload = data.payload as Record<string, unknown> | undefined;
  if (!payload) return false;
  if (capability.kind === "model_listening") return payload.event === "model_listening.completed";
  if (capability.kind === "recorded_speaking") return payload.event === "spoken_evidence.recorded";
  return payload.event === "ai_roleplay.turn" && payload.completedMinimumTurns === true;
}

export const RequiredLearningCapabilityService = {
  async recordModelListeningCompleted(input: {
    actor: AuthenticatedActor;
    courseId: string;
    lessonId: string;
    activityId: string;
  }): Promise<{ completed: true; activityId: string }> {
    const capability = await resolveModelListeningCapability(input);
    const database = getServerFirestore();
    const courseSnapshot = await database.collection("courses").doc(input.courseId).get();
    if (!courseSnapshot.exists) throw new Error("Course not found.");
    const organizationId = courseSnapshot.data()?.orgId;
    if (typeof organizationId !== "string" || !organizationId) throw new Error("Course organization is unavailable.");

    const observedAt = new Date().toISOString();
    const evidenceId = `learn_listening_${input.actor.uid}_${input.lessonId}_${capability.id}`.replace(/[^a-zA-Z0-9._-]/g, "_");
    const repository = new FirestoreLearningEvidenceRepository();
    await repository.append({
      id: evidenceId,
      learnerId: input.actor.uid,
      organizationId,
      source: {
        product: "learn",
        courseId: input.courseId,
        lessonId: input.lessonId,
        activityId: capability.id,
      },
      type: "activity_result",
      observedAt,
      payload: {
        event: "model_listening.completed",
        competencyIds: capability.competencyIds,
        playbackGoal: capability.playbackGoal,
        evidenceStrength: "exposure",
      },
      provenance: {
        method: "system_observed",
        actorId: input.actor.uid,
      },
    });

    try {
      await refreshLearnerIntelligence({ learnerId: input.actor.uid, organizationId });
    } catch (error) {
      console.error("Learner intelligence refresh failed after listening completion.", error);
    }
    return { completed: true, activityId: capability.id };
  },

  async assertCompleted(actor: AuthenticatedActor, courseId: string, lessonId: string): Promise<void> {
    const { lesson } = await CoursePlatformService.getLesson(actor, courseId, lessonId);
    const capabilities = readRequiredCapabilities(lesson);
    if (!capabilities.length) return;

    const courseSnapshot = await getServerFirestore().collection("courses").doc(courseId).get();
    if (!courseSnapshot.exists) throw new Error("Course not found.");
    const organizationId = courseSnapshot.data()?.orgId;
    if (typeof organizationId !== "string" || !organizationId) throw new Error("Course organization is unavailable.");

    const evidenceSnapshot = await getServerFirestore().collection("learning-evidence")
      .where("learnerId", "==", actor.uid)
      .where("organizationId", "==", organizationId)
      .get();

    const missing = capabilities.filter((capability) => !evidenceSnapshot.docs.some((snapshot) => {
      const data = snapshot.data();
      return sourceMatches(data, courseId, lessonId, capability.id) && evidenceCompletesCapability(capability, data);
    }));

    if (missing.length) {
      const labels = missing.map((capability) => capability.title).join(", ");
      throw new Error(`Complete the required listening, speaking, and conversation work before finishing this lesson: ${labels}.`);
    }
  },
};

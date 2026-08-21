import type { TeacherInterventionBrief } from "@lurexa/types";
import type { AuthenticatedActor } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";
import { TeacherInterventionService } from "./teacher-intervention.server";

export const TeacherInterventionActions = {
  async createForRecentCourse(actor: AuthenticatedActor, learnerId: string): Promise<TeacherInterventionBrief> {
    const snapshot = await getServerFirestore()
      .collection("progress")
      .where("studentId", "==", learnerId)
      .get();

    const recentCourseIds = snapshot.docs
      .map((doc) => doc.data() as { courseId?: unknown; lastAccessedAt?: unknown })
      .filter((item): item is { courseId: string; lastAccessedAt: string } => typeof item.courseId === "string" && typeof item.lastAccessedAt === "string")
      .sort((first, second) => second.lastAccessedAt.localeCompare(first.lastAccessedAt))
      .map((item) => item.courseId)
      .filter((courseId, index, values) => values.indexOf(courseId) === index);

    if (!recentCourseIds.length) throw new Error("This learner has no recent course activity yet.");

    for (const courseId of recentCourseIds) {
      try {
        return await TeacherInterventionService.createBrief(actor, courseId, learnerId);
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message.includes("teacher organization membership") || message.includes("Learner is not part")) continue;
        throw error;
      }
    }

    throw new Error("No recent learner course is available to this teacher.");
  },

  async acknowledgeForLearner(actor: AuthenticatedActor, interventionId: string): Promise<TeacherInterventionBrief> {
    const database = getServerFirestore();
    const reference = database.collection("teacher-interventions").doc(interventionId);
    const snapshot = await reference.get();
    if (!snapshot.exists) throw new Error("Teacher intervention not found.");

    const intervention = { ...snapshot.data(), id: snapshot.id } as TeacherInterventionBrief;
    if (intervention.learnerId !== actor.uid) throw new Error("This teacher guidance belongs to another learner.");
    if (intervention.status !== "responded" || !intervention.response) {
      throw new Error("This teacher guidance is not awaiting learner review.");
    }

    const updated: TeacherInterventionBrief = { ...intervention, status: "closed" };
    await reference.set({ status: "closed" }, { merge: true });
    return updated;
  },
};

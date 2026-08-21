import { FieldValue } from "firebase-admin/firestore";
import type { StudentProgress } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { CoursePlatformService, type AuthenticatedActor } from "./course-platform.server";

export const LearnProgressService = {
  async startLesson(
    actor: AuthenticatedActor,
    courseId: string,
    lessonId: string
  ): Promise<StudentProgress> {
    const { lesson, progress } = await CoursePlatformService.getLesson(actor, courseId, lessonId);
    if (progress?.completed) return progress;

    const now = new Date().toISOString();
    const reference = getServerFirestore().collection("progress").doc(`${actor.uid}_${lessonId}`);
    const record: StudentProgress = {
      id: reference.id,
      studentId: actor.uid,
      lessonId,
      moduleId: lesson.moduleId,
      courseId,
      completed: false,
      status: "in_progress",
      startedAt: progress?.startedAt ?? now,
      timeSpentSeconds: progress?.timeSpentSeconds ?? 0,
      attempts: progress?.attempts ?? [],
      ...(typeof progress?.bestScore === "number" ? { bestScore: progress.bestScore } : {}),
      lastAccessedAt: now,
    };

    await reference.set(
      { ...record, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );

    return record;
  },
};

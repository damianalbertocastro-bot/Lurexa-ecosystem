import { FieldValue } from "firebase-admin/firestore";
import type { StudentProgress } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import {
  CoursePlatformService,
  type AuthenticatedActor,
  type LearnerDashboardSummary,
} from "./course-platform.server";

async function attachAttemptAnswer(
  actor: AuthenticatedActor,
  lessonId: string,
  activityId: string,
  answer: string | string[]
): Promise<void> {
  const firestore = getServerFirestore();
  const reference = firestore.collection("progress").doc(`${actor.uid}_${lessonId}`);

  await firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) return;

    const progress = snapshot.data() as StudentProgress;
    const attempts = [...progress.attempts];
    for (let index = attempts.length - 1; index >= 0; index -= 1) {
      if (attempts[index]?.quizId === activityId) {
        attempts[index] = { ...attempts[index], answer };
        break;
      }
    }

    transaction.set(
      reference,
      { attempts, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
  });
}

export const LearnProgressService = {
  async getLearnerDashboard(actor: AuthenticatedActor): Promise<LearnerDashboardSummary> {
    const dashboard = await CoursePlatformService.getLearnerDashboard(actor);
    const progressSnapshots = await getServerFirestore()
      .collection("progress")
      .where("studentId", "==", actor.uid)
      .get();
    const resumable = progressSnapshots.docs
      .map((snapshot) => snapshot.data() as StudentProgress)
      .filter((entry) => !entry.completed && (entry.status === "in_progress" || typeof entry.startedAt === "string"))
      .sort((first, second) => second.lastAccessedAt.localeCompare(first.lastAccessedAt));

    for (const entry of resumable) {
      const courseSummary = dashboard.courses.find(({ course }) => course.id === entry.courseId);
      if (!courseSummary) continue;
      try {
        const { lesson } = await CoursePlatformService.getLesson(actor, entry.courseId, entry.lessonId);
        courseSummary.nextLesson = lesson;
      } catch {
        // Ignore stale progress that no longer points to an accessible published lesson.
      }
    }

    return dashboard;
  },

  async startLesson(
    actor: AuthenticatedActor,
    courseId: string,
    lessonId: string
  ): Promise<StudentProgress> {
    const { lesson, progress } = await CoursePlatformService.getLesson(actor, courseId, lessonId);
    if (progress?.completed) return { ...progress, status: "completed" };

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

  async submitQuizAttempt(
    actor: AuthenticatedActor,
    courseId: string,
    lessonId: string,
    quizId: string,
    answer: string
  ) {
    const result = await CoursePlatformService.submitQuizAttempt(actor, courseId, lessonId, quizId, answer);
    await attachAttemptAnswer(actor, lessonId, quizId, answer);
    return result;
  },

  async submitActivityAttempt(
    actor: AuthenticatedActor,
    courseId: string,
    lessonId: string,
    activityId: string,
    answers: string[]
  ) {
    const result = await CoursePlatformService.submitActivityAttempt(actor, courseId, lessonId, activityId, answers);
    await attachAttemptAnswer(actor, lessonId, activityId, answers);
    return result;
  },

  async submitShortResponse(
    actor: AuthenticatedActor,
    courseId: string,
    lessonId: string,
    activityId: string,
    response: string
  ) {
    const result = await CoursePlatformService.submitShortResponse(actor, courseId, lessonId, activityId, response);
    await attachAttemptAnswer(actor, lessonId, activityId, response);
    return result;
  },

  async completeLesson(
    actor: AuthenticatedActor,
    courseId: string,
    lessonId: string,
    timeSpentSeconds: number
  ): Promise<StudentProgress> {
    const completed = await CoursePlatformService.completeLesson(actor, courseId, lessonId, timeSpentSeconds);
    const completedAt = completed.lastAccessedAt;
    const normalized: StudentProgress = {
      ...completed,
      status: "completed",
      completedAt,
    };
    await getServerFirestore().collection("progress").doc(completed.id).set(
      {
        status: "completed",
        completedAt,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return normalized;
  },
};

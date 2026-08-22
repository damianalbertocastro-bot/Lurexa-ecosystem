import type { StudentProgress } from "@lurexa/types";
import type { AuthenticatedActor, TeacherCourseSummary } from "./course-platform.server";
import { CoursePlatformService } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";

export type TeacherLearnerStatus = "active" | "needs_attention" | "inactive";

export interface TeacherLearnerInsight {
  learnerId: string;
  learnerLabel: string;
  courseCount: number;
  completedLessons: number;
  completionPercent: number;
  averageFirstAttemptScore: number | null;
  lastActiveAt: string | null;
  status: TeacherLearnerStatus;
  statusReason: string;
}

export interface TeacherInsightsSummary {
  totalLearners: number;
  activeLearners: number;
  needsAttentionCount: number;
  inactiveLearners: number;
  averageCompletionPercent: number | null;
  averageFirstAttemptScore: number | null;
  learners: TeacherLearnerInsight[];
  dataNotice: string;
}

function daysSince(iso: string, now: Date): number {
  return Math.max(0, (now.getTime() - new Date(iso).getTime()) / 86_400_000);
}

function scorePercent(progress: StudentProgress): number[] {
  return progress.attempts
    .filter((attempt) => attempt.firstAttempt && attempt.maxScore > 0)
    .map((attempt) => Math.round((attempt.score / attempt.maxScore) * 100));
}

function learnerLabel(learnerId: string): string {
  return `Learner · ${learnerId.slice(-6) || learnerId}`;
}

function classifyLearner(input: {
  lastActiveAt: string | null;
  averageFirstAttemptScore: number | null;
  firstAttemptCount: number;
  now: Date;
}): Pick<TeacherLearnerInsight, "status" | "statusReason"> {
  if (!input.lastActiveAt || daysSince(input.lastActiveAt, input.now) >= 14) {
    return { status: "inactive", statusReason: "No recorded lesson activity in the last 14 days." };
  }
  if (input.firstAttemptCount >= 2 && input.averageFirstAttemptScore !== null && input.averageFirstAttemptScore < 60) {
    return { status: "needs_attention", statusReason: "Recent first-attempt evidence is below 60%; review the learner brief before intervening." };
  }
  return { status: "active", statusReason: "Recent progress does not indicate an automatic intervention threshold." };
}

async function teacherProgress(actor: AuthenticatedActor): Promise<{ courses: TeacherCourseSummary[]; progress: StudentProgress[] }> {
  const courses = await CoursePlatformService.getTeacherCourses(actor);
  const snapshots = await Promise.all(
    courses.map(({ course }) => getServerFirestore().collection("progress").where("courseId", "==", course.id).get()),
  );
  return { courses, progress: snapshots.flatMap((snapshot) => snapshot.docs.map((document) => document.data() as StudentProgress)) };
}

/** Server-owned, course-scoped teacher visibility. It exposes observed operational data only. */
export const TeacherInsightsService = {
  async getSummary(actor: AuthenticatedActor): Promise<TeacherInsightsSummary> {
    const { courses, progress } = await teacherProgress(actor);
    const lessonsByCourse = new Map(courses.map(({ course, lessons }) => [course.id, lessons.length]));
    const byLearner = new Map<string, StudentProgress[]>();
    for (const item of progress) {
      const entries = byLearner.get(item.studentId) ?? [];
      entries.push(item);
      byLearner.set(item.studentId, entries);
    }

    const now = new Date();
    const learners = [...byLearner.entries()].map(([learnerId, entries]): TeacherLearnerInsight => {
      const courseIds = [...new Set(entries.map((entry) => entry.courseId))];
      const completedLessons = entries.filter((entry) => entry.completed).length;
      const totalLessons = courseIds.reduce((total, courseId) => total + (lessonsByCourse.get(courseId) ?? 0), 0);
      const firstAttemptScores = entries.flatMap(scorePercent);
      const averageFirstAttemptScore = firstAttemptScores.length
        ? Math.round(firstAttemptScores.reduce((total, score) => total + score, 0) / firstAttemptScores.length)
        : null;
      const lastActiveAt = entries.map((entry) => entry.lastAccessedAt).filter((value): value is string => typeof value === "string").sort((first, second) => second.localeCompare(first))[0] ?? null;
      return {
        learnerId,
        learnerLabel: learnerLabel(learnerId),
        courseCount: courseIds.length,
        completedLessons,
        completionPercent: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
        averageFirstAttemptScore,
        lastActiveAt,
        ...classifyLearner({ lastActiveAt, averageFirstAttemptScore, firstAttemptCount: firstAttemptScores.length, now }),
      };
    }).sort((first, second) => {
      const statusOrder: Record<TeacherLearnerStatus, number> = { needs_attention: 0, inactive: 1, active: 2 };
      return statusOrder[first.status] - statusOrder[second.status] || (second.lastActiveAt ?? "").localeCompare(first.lastActiveAt ?? "");
    });

    const completionValues = learners.map((learner) => learner.completionPercent);
    const firstAttemptValues = learners.flatMap((learner) => learner.averageFirstAttemptScore === null ? [] : [learner.averageFirstAttemptScore]);
    return {
      totalLearners: learners.length,
      activeLearners: learners.filter((learner) => learner.status === "active").length,
      needsAttentionCount: learners.filter((learner) => learner.status === "needs_attention").length,
      inactiveLearners: learners.filter((learner) => learner.status === "inactive").length,
      averageCompletionPercent: completionValues.length ? Math.round(completionValues.reduce((total, value) => total + value, 0) / completionValues.length) : null,
      averageFirstAttemptScore: firstAttemptValues.length ? Math.round(firstAttemptValues.reduce((total, value) => total + value, 0) / firstAttemptValues.length) : null,
      learners,
      dataNotice: learners.length
        ? "Metrics come from progress and first-attempt evidence in courses you are authorized to teach. They support review; they are not proficiency or mastery decisions."
        : "No learner progress has been recorded in courses you are authorized to teach yet.",
    };
  },
};

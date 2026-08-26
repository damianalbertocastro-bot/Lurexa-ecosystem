import type { Course, CourseInstructionalIntelligenceV1, LearningEvidence, Module, StudentProgress } from "@lurexa/types";
import { getEducatorCourseAccessDecision } from "./educator-access.server";
import { CourseEnrollmentIndexService } from "./core/course-enrollment-index.server";
import { getServerFirestore } from "./firebase-admin.server";

function knowledgeObjectIds(value: LearningEvidence): string[] {
  const source = value.source as { courseId?: string; knowledgeObjectIds?: string[] };
  return Array.isArray(source.knowledgeObjectIds) ? source.knowledgeObjectIds.filter(Boolean) : [];
}

async function courseLessonCount(course: Course): Promise<number> {
  const database = getServerFirestore();
  const modules = await Promise.all(course.moduleIds.map((moduleId) => database.collection("modules").doc(moduleId).get()));
  return modules.reduce((total, snapshot) => {
    if (!snapshot.exists) return total;
    const module = { id: snapshot.id, ...snapshot.data() } as Module;
    return module.courseId === course.id ? total + module.lessonIds.length : total;
  }, 0);
}

export async function getLearnTeacherCourseIntelligence(input: {
  educatorId: string;
  organizationId: string;
  courseId: string;
}): Promise<CourseInstructionalIntelligenceV1> {
  const database = getServerFirestore();
  const courseSnapshot = await database.collection("courses").doc(input.courseId).get();
  if (!courseSnapshot.exists) throw new Error("Course not found.");
  const course = { id: courseSnapshot.id, ...courseSnapshot.data() } as Course;
  if (course.orgId !== input.organizationId) throw new Error("Course is outside the requested organization.");
  const access = await getEducatorCourseAccessDecision({ userId: input.educatorId, course });
  if (!access.allowed) throw new Error("Exact-course teaching authorization is required for instructional intelligence.");

  await CourseEnrollmentIndexService.migrateTrustedParticipation(course);
  const [enrollments, progressSnapshot, evidenceSnapshot, totalLessons] = await Promise.all([
    CourseEnrollmentIndexService.listCourseEnrollments(course.id),
    database.collection("progress").where("courseId", "==", course.id).get(),
    database.collection("learning-evidence").where("organizationId", "==", course.orgId).get(),
    courseLessonCount(course),
  ]);
  const activeEnrollments = enrollments.filter((item) => item.status === "active" || item.status === "completed");
  const enrolledIds = new Set(activeEnrollments.map((item) => item.learnerId));
  const progress = progressSnapshot.docs.map((doc) => doc.data() as StudentProgress).filter((item) => enrolledIds.has(item.studentId));
  const byLearner = new Map<string, StudentProgress[]>();
  for (const item of progress) {
    const current = byLearner.get(item.studentId) ?? [];
    current.push(item);
    byLearner.set(item.studentId, current);
  }
  const participating = [...byLearner.keys()];
  const activeCutoff = Date.now() - 14 * 86_400_000;
  const active14d = participating.filter((learnerId) => (byLearner.get(learnerId) ?? []).some((item) => Date.parse(item.lastAccessedAt) >= activeCutoff)).length;
  const progressValues = participating.map((learnerId) => {
    const records = byLearner.get(learnerId) ?? [];
    const completed = new Set(records.filter((item) => item.completed).map((item) => item.lessonId)).size;
    return totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);
  });
  const completedLearners = progressValues.filter((value) => value >= 100).length;

  const koLearners = new Map<string, Set<string>>();
  for (const doc of evidenceSnapshot.docs) {
    const evidence = doc.data() as LearningEvidence;
    if (!enrolledIds.has(evidence.learnerId)) continue;
    if (evidence.source.courseId !== course.id) continue;
    for (const id of knowledgeObjectIds(evidence)) {
      const learners = koLearners.get(id) ?? new Set<string>();
      learners.add(evidence.learnerId);
      koLearners.set(id, learners);
    }
  }
  const threshold = Math.max(2, Math.ceil(activeEnrollments.length * 0.25));
  const focusSignals = [...koLearners.entries()]
    .map(([knowledgeObjectId, learners]) => ({
      knowledgeObjectId,
      label: knowledgeObjectId.replaceAll("_", " ").replaceAll("-", " "),
      learnerCount: learners.size,
      signal: learners.size >= threshold ? "watch" as const : "reinforce" as const,
    }))
    .sort((a, b) => b.learnerCount - a.learnerCount)
    .slice(0, 8);

  const average = progressValues.length ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length) : null;
  return {
    contractVersion: "1",
    organizationId: course.orgId,
    courseId: course.id,
    generatedAt: new Date().toISOString(),
    enrollment: {
      total: activeEnrollments.length,
      participating: participating.length,
      notStarted: Math.max(0, activeEnrollments.length - participating.length),
      active14d,
    },
    progress: { averagePercent: average, completedLearners },
    focusSignals,
    recommendation: focusSignals.some((item) => item.signal === "watch")
      ? "Review the highest-frequency governed Knowledge Object signals and plan targeted practice. Use individual Learner Pulse only when a specific learner decision requires it."
      : activeEnrollments.length && !participating.length
        ? "Learners are enrolled but have not started. Prioritize onboarding and first-lesson activation before interpreting learning performance."
        : "Continue the current course sequence and use individual learner projections only for specific instructional decisions.",
    privacyBoundary: "This course view returns aggregate derived signals only. Raw learner evidence, transcripts, and individual recommendations are excluded.",
  };
}

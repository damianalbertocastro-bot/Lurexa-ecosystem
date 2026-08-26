import type {
  LearnTeacherInstructionalRosterV1,
  LearnTeacherRosterLearnerV1,
  StudentProgress,
} from "@lurexa/types";
import type { AuthenticatedActor } from "./course-platform.server";
import { CoursePlatformService } from "./course-platform.server";
import { getEducatorCourseAccessDecision } from "./educator-access.server";
import { CourseEnrollmentIndexService } from "./core/course-enrollment-index.server";
import { getServerFirestore } from "./firebase-admin.server";

async function isStudentMember(learnerId: string, organizationId: string): Promise<boolean> {
  const snapshot = await getServerFirestore()
    .collection("user-memberships")
    .doc(learnerId)
    .collection("organizations")
    .doc(organizationId)
    .get();
  return snapshot.exists && snapshot.data()?.role === "student";
}

async function displayNameFor(learnerId: string): Promise<string> {
  const database = getServerFirestore();
  const [userSnapshot, profileSnapshot] = await Promise.all([
    database.collection("users").doc(learnerId).get(),
    database.collection("learner-profiles").doc(learnerId).get(),
  ]);
  const userName = userSnapshot.exists ? userSnapshot.data()?.displayName : null;
  const profileName = profileSnapshot.exists ? profileSnapshot.data()?.displayName : null;
  return typeof userName === "string" && userName.trim()
    ? userName.trim()
    : typeof profileName === "string" && profileName.trim()
      ? profileName.trim()
      : "Learner";
}

/**
 * Lurexa Learn Teacher Workspace roster.
 * Core enrollment is authoritative; progress is only an activity overlay.
 * Existing trusted participation is migrated once into the enrollment index
 * so current deployments retain learners without keeping progress as the
 * long-term enrollment source of truth.
 */
export async function getLearnTeacherInstructionalRoster(
  actor: AuthenticatedActor,
): Promise<LearnTeacherInstructionalRosterV1> {
  const database = getServerFirestore();
  const membershipCourses = await CoursePlatformService.getTeacherCourses(actor);
  const teacherCourses = (await Promise.all(membershipCourses.map(async (summary) => {
    const decision = await getEducatorCourseAccessDecision({ userId: actor.uid, course: summary.course });
    return decision.allowed ? summary : null;
  }))).filter((summary): summary is (typeof membershipCourses)[number] => summary !== null);

  const courses = await Promise.all(teacherCourses.map(async ({ course, lessons }) => {
    await CourseEnrollmentIndexService.migrateTrustedParticipation(course);
    const [enrollments, progressSnapshot] = await Promise.all([
      CourseEnrollmentIndexService.listCourseEnrollments(course.id),
      database.collection("progress").where("courseId", "==", course.id).get(),
    ]);
    const progress = progressSnapshot.docs.map((document) => document.data() as StudentProgress);
    const byLearner = new Map<string, StudentProgress[]>();
    for (const record of progress) {
      const records = byLearner.get(record.studentId) ?? [];
      records.push(record);
      byLearner.set(record.studentId, records);
    }

    const activeEnrollments = enrollments.filter((enrollment) => enrollment.status === "active" || enrollment.status === "completed");
    const learners = (await Promise.all(activeEnrollments.map(async (enrollment): Promise<LearnTeacherRosterLearnerV1 | null> => {
      const learnerId = enrollment.learnerId;
      if (!await isStudentMember(learnerId, course.orgId)) return null;
      const records = byLearner.get(learnerId) ?? [];
      const completedLessons = new Set(records.filter((record) => record.completed).map((record) => record.lessonId)).size;
      const latest = records.slice().sort((first, second) => second.lastAccessedAt.localeCompare(first.lastAccessedAt))[0];
      const totalLessons = lessons.length;
      return {
        learnerId,
        displayName: await displayNameFor(learnerId),
        organizationId: course.orgId,
        courseId: course.id,
        courseTitle: course.title,
        progressPercent: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
        completedLessons,
        totalLessons,
        lastActivityAt: latest?.lastAccessedAt ?? null,
      };
    }))).filter((learner): learner is LearnTeacherRosterLearnerV1 => learner !== null)
      .sort((first, second) => first.displayName.localeCompare(second.displayName));

    return { courseId: course.id, courseTitle: course.title, organizationId: course.orgId, learners };
  }));

  return {
    contractVersion: "1",
    generatedAt: new Date().toISOString(),
    courses,
    limitations: [
      "Core course enrollment is authoritative; learner progress is used only to calculate participation and progress overlays.",
      "Trusted historical participation is migrated into the Core enrollment index for backward compatibility.",
      "Organization role alone does not create instructional access; qualification and exact-course teaching authorization remain mandatory.",
      "Roster responses contain display identity and participation metadata only; learner-model evidence remains behind purpose-scoped Core projections.",
    ],
  };
}

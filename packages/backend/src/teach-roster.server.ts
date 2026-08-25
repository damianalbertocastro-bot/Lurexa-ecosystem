import type { StudentProgress, TeachInstructionalRosterV1, TeachRosterLearnerV1 } from "@lurexa/types";
import type { AuthenticatedActor } from "./course-platform.server";
import { CoursePlatformService } from "./course-platform.server";
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
 * Returns only learners who have real progress in courses the educator is
 * already authorized to teach. This intentionally does not scan memberships
 * across the platform and does not attempt to represent never-started
 * enrollments until Core owns a dedicated enrollment index.
 */
export async function getTeachInstructionalRoster(actor: AuthenticatedActor): Promise<TeachInstructionalRosterV1> {
  const database = getServerFirestore();
  const teacherCourses = await CoursePlatformService.getTeacherCourses(actor);
  const courses = await Promise.all(teacherCourses.map(async ({ course, lessons }) => {
    const progressSnapshot = await database.collection("progress").where("courseId", "==", course.id).get();
    const progress = progressSnapshot.docs.map((document) => document.data() as StudentProgress);
    const byLearner = new Map<string, StudentProgress[]>();
    for (const record of progress) {
      const records = byLearner.get(record.studentId) ?? [];
      records.push(record);
      byLearner.set(record.studentId, records);
    }

    const learners = (await Promise.all([...byLearner.entries()].map(async ([learnerId, records]): Promise<TeachRosterLearnerV1 | null> => {
      if (!await isStudentMember(learnerId, course.orgId)) return null;
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
    }))).filter((learner): learner is TeachRosterLearnerV1 => learner !== null)
      .sort((first, second) => first.displayName.localeCompare(second.displayName));

    return {
      courseId: course.id,
      courseTitle: course.title,
      organizationId: course.orgId,
      learners,
    };
  }));

  return {
    contractVersion: "1",
    generatedAt: new Date().toISOString(),
    courses,
    limitations: [
      "This v1 roster includes learners with recorded participation in courses the educator is authorized to teach.",
      "Learners who are enrolled but have never generated course progress are not represented until Core provides a dedicated enrollment index.",
      "Roster responses contain display identity and participation metadata only; learner-model evidence remains behind purpose-scoped Core projections.",
    ],
  };
}

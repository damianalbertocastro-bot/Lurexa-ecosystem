import type { Course, CourseEnrollmentV1, StudentProgress } from "@lurexa/types";
import { getEducatorCourseAccessDecision } from "../educator-access.server";
import { getServerFirestore } from "../firebase-admin.server";

async function courseOrThrow(courseId: string): Promise<Course> {
  const snapshot = await getServerFirestore().collection("courses").doc(courseId).get();
  if (!snapshot.exists) throw new Error("Course not found.");
  return { id: snapshot.id, ...snapshot.data() } as Course;
}

async function requireCurrentStudent(learnerId: string, organizationId: string): Promise<void> {
  const membership = await getServerFirestore()
    .collection("user-memberships")
    .doc(learnerId)
    .collection("organizations")
    .doc(organizationId)
    .get();
  if (!membership.exists || membership.data()?.role !== "student") {
    throw new Error("Course enrollment requires current student membership in the course organization.");
  }
}

function enrollmentRef(courseId: string, learnerId: string) {
  return getServerFirestore().collection("course-enrollments").doc(courseId).collection("learners").doc(learnerId);
}

export const CourseEnrollmentIndexService = {
  async enrollAuthorizedLearner(input: {
    educatorId: string;
    courseId: string;
    learnerId: string;
    source?: CourseEnrollmentV1["source"];
  }): Promise<CourseEnrollmentV1> {
    const course = await courseOrThrow(input.courseId);
    const decision = await getEducatorCourseAccessDecision({ userId: input.educatorId, course });
    if (!decision.allowed) throw new Error("Exact-course teaching authorization is required to manage enrollment.");
    await requireCurrentStudent(input.learnerId, course.orgId);
    const reference = enrollmentRef(course.id, input.learnerId);
    const existing = await reference.get();
    const now = new Date().toISOString();
    const enrollment: CourseEnrollmentV1 = {
      contractVersion: "1",
      courseId: course.id,
      organizationId: course.orgId,
      learnerId: input.learnerId,
      status: "active",
      source: input.source ?? "admin",
      enrolledAt: existing.exists && typeof existing.data()?.enrolledAt === "string" ? existing.data()!.enrolledAt : now,
      updatedAt: now,
    };
    await reference.set(enrollment);
    return enrollment;
  },

  async withdrawAuthorizedLearner(input: { educatorId: string; courseId: string; learnerId: string }): Promise<CourseEnrollmentV1> {
    const course = await courseOrThrow(input.courseId);
    const decision = await getEducatorCourseAccessDecision({ userId: input.educatorId, course });
    if (!decision.allowed) throw new Error("Exact-course teaching authorization is required to manage enrollment.");
    const reference = enrollmentRef(course.id, input.learnerId);
    const snapshot = await reference.get();
    if (!snapshot.exists) throw new Error("Course enrollment not found.");
    const next = { ...(snapshot.data() as CourseEnrollmentV1), status: "withdrawn" as const, updatedAt: new Date().toISOString() };
    await reference.set(next);
    return next;
  },

  async listCourseEnrollments(courseId: string): Promise<CourseEnrollmentV1[]> {
    const snapshot = await getServerFirestore().collection("course-enrollments").doc(courseId).collection("learners").get();
    return snapshot.docs.map((doc) => doc.data() as CourseEnrollmentV1);
  },

  async migrateTrustedParticipation(course: Course): Promise<void> {
    const progressSnapshot = await getServerFirestore().collection("progress").where("courseId", "==", course.id).get();
    const learnerIds = [...new Set(progressSnapshot.docs.map((doc) => (doc.data() as StudentProgress).studentId))];
    for (const learnerId of learnerIds) {
      const reference = enrollmentRef(course.id, learnerId);
      const existing = await reference.get();
      if (existing.exists) continue;
      try {
        await requireCurrentStudent(learnerId, course.orgId);
      } catch {
        continue;
      }
      const learnerProgress = progressSnapshot.docs
        .map((doc) => doc.data() as StudentProgress)
        .filter((item) => item.studentId === learnerId)
        .sort((a, b) => a.lastAccessedAt.localeCompare(b.lastAccessedAt));
      const firstActivity = learnerProgress[0]?.lastAccessedAt ?? new Date().toISOString();
      const enrollment: CourseEnrollmentV1 = {
        contractVersion: "1",
        courseId: course.id,
        organizationId: course.orgId,
        learnerId,
        status: "active",
        source: "migration",
        enrolledAt: firstActivity,
        updatedAt: new Date().toISOString(),
      };
      await reference.set(enrollment);
    }
  },
};

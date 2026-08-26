import type { Course, CourseEnrollmentV1 } from "@lurexa/types";
import { CourseEnrollmentIndexService } from "./core/course-enrollment-index.server";
import { getEducatorCourseAccessDecision } from "./educator-access.server";
import { getServerFirestore } from "./firebase-admin.server";

export interface LearnTeacherEnrollmentCandidateV1 {
  learnerId: string;
  displayName: string;
  enrolled: boolean;
  enrollmentStatus: CourseEnrollmentV1["status"] | null;
}

export interface LearnTeacherEnrollmentManagementV1 {
  contractVersion: "1";
  organizationId: string;
  courseId: string;
  courseTitle: string;
  learners: LearnTeacherEnrollmentCandidateV1[];
}

async function courseOrThrow(courseId: string): Promise<Course> {
  const snapshot = await getServerFirestore().collection("courses").doc(courseId).get();
  if (!snapshot.exists) throw new Error("Course not found.");
  return { id: snapshot.id, ...snapshot.data() } as Course;
}

async function nameFor(userId: string): Promise<string> {
  const database = getServerFirestore();
  const [user, profile] = await Promise.all([
    database.collection("users").doc(userId).get(),
    database.collection("learner-profiles").doc(userId).get(),
  ]);
  const candidate = user.data()?.displayName ?? profile.data()?.displayName;
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : "Learner";
}

async function requireAccess(educatorId: string, organizationId: string, courseId: string): Promise<Course> {
  const course = await courseOrThrow(courseId);
  if (course.orgId !== organizationId) throw new Error("Course is outside the requested organization.");
  const decision = await getEducatorCourseAccessDecision({ userId: educatorId, course });
  if (!decision.allowed) throw new Error("Exact-course teaching authorization is required to manage enrollment.");
  return course;
}

export async function getLearnTeacherEnrollmentManagement(input: {
  educatorId: string;
  organizationId: string;
  courseId: string;
}): Promise<LearnTeacherEnrollmentManagementV1> {
  const course = await requireAccess(input.educatorId, input.organizationId, input.courseId);
  await CourseEnrollmentIndexService.migrateTrustedParticipation(course);
  const [members, enrollments] = await Promise.all([
    getServerFirestore().collection("organizations").doc(course.orgId).collection("members").where("role", "==", "student").get(),
    CourseEnrollmentIndexService.listCourseEnrollments(course.id),
  ]);
  const enrollmentByLearner = new Map(enrollments.map((item) => [item.learnerId, item]));
  const learners = await Promise.all(members.docs.map(async (member): Promise<LearnTeacherEnrollmentCandidateV1> => {
    const enrollment = enrollmentByLearner.get(member.id) ?? null;
    return {
      learnerId: member.id,
      displayName: await nameFor(member.id),
      enrolled: enrollment?.status === "active" || enrollment?.status === "completed",
      enrollmentStatus: enrollment?.status ?? null,
    };
  }));
  learners.sort((a, b) => a.displayName.localeCompare(b.displayName));
  return { contractVersion: "1", organizationId: course.orgId, courseId: course.id, courseTitle: course.title, learners };
}

export async function updateLearnTeacherEnrollment(input: {
  educatorId: string;
  organizationId: string;
  courseId: string;
  learnerId: string;
  action: "enroll" | "withdraw";
}): Promise<CourseEnrollmentV1> {
  await requireAccess(input.educatorId, input.organizationId, input.courseId);
  return input.action === "enroll"
    ? CourseEnrollmentIndexService.enrollAuthorizedLearner({ educatorId: input.educatorId, courseId: input.courseId, learnerId: input.learnerId, source: "admin" })
    : CourseEnrollmentIndexService.withdrawAuthorizedLearner({ educatorId: input.educatorId, courseId: input.courseId, learnerId: input.learnerId });
}

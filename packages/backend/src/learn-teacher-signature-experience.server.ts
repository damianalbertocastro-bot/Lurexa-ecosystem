import type { Course, LearnerPulseProjectionV1 } from "@lurexa/types";
import { getEducatorCourseAccessDecision } from "./educator-access.server";
import { getServerFirestore } from "./firebase-admin.server";
import { getLearnerPulseProjection } from "./signature-experience.server";

async function readCourse(courseId: string): Promise<Course> {
  const snapshot = await getServerFirestore().collection("courses").doc(courseId).get();
  if (!snapshot.exists) throw new Error("The requested Learn course does not exist.");
  return { id: snapshot.id, ...snapshot.data() } as Course;
}

/**
 * Governed Lurexa Learn teacher-workspace consumer of Learner Pulse.
 * The same Lurexa identity may use Teach/Coach benefits, but student support is
 * authorized independently against the exact Learn course being taught.
 */
export async function getLearnTeacherLearnerPulseProjection(input: {
  actorId: string;
  learnerId: string;
  organizationId: string;
  courseId: string;
}): Promise<LearnerPulseProjectionV1> {
  if (!input.organizationId.trim() || !input.courseId.trim()) {
    throw new Error("Learn teacher instructional support requires explicit organization and course boundaries.");
  }
  if (input.actorId === input.learnerId) {
    throw new Error("Learn teacher instructional support is for an authorized educator supporting another learner.");
  }

  const course = await readCourse(input.courseId);
  if (course.orgId !== input.organizationId) {
    throw new Error("The requested course does not belong to the authorized organization.");
  }

  const access = await getEducatorCourseAccessDecision({ userId: input.actorId, course });
  if (!access.allowed) {
    throw new Error(`The educator is not authorized to teach this course (${access.reason}).`);
  }

  const learnerProgress = await getServerFirestore()
    .collection("progress")
    .where("studentId", "==", input.learnerId)
    .where("courseId", "==", input.courseId)
    .limit(1)
    .get();
  if (learnerProgress.empty) {
    throw new Error("The learner has no recorded participation in this authorized course.");
  }

  const projection = await getLearnerPulseProjection({
    actorId: input.actorId,
    authorizationCourseId: input.courseId,
    request: {
      contractVersion: "1",
      learnerId: input.learnerId,
      organizationId: input.organizationId,
      consumer: "learn",
      purpose: "learn_signature_experience",
      projection: "learner_pulse",
    },
  });

  if (projection.organizationId !== input.organizationId) {
    throw new Error("No current learner context is available for this organization.");
  }

  return {
    ...projection,
    limitations: [
      ...projection.limitations,
      `Instructional access and learner context were pinned to Learn course ${input.courseId}.`,
      "Broader organization-level derived insights are withheld until derived-insight provenance supports explicit course scope.",
    ],
  };
}

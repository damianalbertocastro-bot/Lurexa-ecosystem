import type { Course, EducatorQualificationScopeV1, TeachingAuthorizationV1 } from "@lurexa/types";
import { getEducatorBenefitEntitlements, getEducatorCourseAccessDecision } from "../src/educator-access.server";
import { getServerFirestore } from "../src/firebase-admin.server";
import { getScopedLearnerContext } from "../src/learner-context.server";

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Delegated context integration failed: ${message}`);
  console.log(`✓ ${message}`);
}

async function expectFailure(run: () => Promise<unknown>, fragment: string, message: string) {
  try {
    await run();
    throw new Error(`Expected failure containing: ${fragment}`);
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error);
    check(text.includes(fragment), message);
  }
}

function course(input: { id: string; orgId: string; level: "A1" | "B2" }): Course {
  return {
    id: input.id,
    orgId: input.orgId,
    authorId: "system",
    title: `${input.level} English`,
    description: "fixture",
    subject: "english",
    level: input.level,
    status: "published",
    isTemplate: false,
    moduleIds: [],
    createdAt: "2026-08-25T00:00:00.000Z",
    updatedAt: "2026-08-25T00:00:00.000Z",
  };
}

async function main(): Promise<void> {
  const database = getServerFirestore();
  const suffix = Date.now().toString(36);
  const teacherId = `teacher_${suffix}`;
  const ownerId = `owner_${suffix}`;
  const learnerId = `learner_${suffix}`;
  const outsiderId = `outsider_${suffix}`;
  const orgA = `org_a_${suffix}`;
  const orgB = `org_b_${suffix}`;
  const courseA = `course_a_${suffix}`;
  const courseB = `course_b_${suffix}`;
  const courseHigher = `course_b2_${suffix}`;
  const qualificationId = `qualification_${suffix}`;
  const authorizationId = `authorization_${suffix}`;

  await Promise.all([
    database.collection("user-memberships").doc(teacherId).collection("organizations").doc(orgA).set({ role: "teacher" }),
    database.collection("user-memberships").doc(ownerId).collection("organizations").doc(orgA).set({ role: "owner" }),
    database.collection("user-memberships").doc(learnerId).collection("organizations").doc(orgA).set({ role: "student" }),
    database.collection("user-memberships").doc(learnerId).collection("organizations").doc(orgB).set({ role: "student" }),
    database.collection("user-memberships").doc(outsiderId).collection("organizations").doc(orgA).set({ role: "student" }),
    database.collection("courses").doc(courseA).set({ id: courseA, orgId: orgA, title: "Org A course", subject: "english", level: "A1" }),
    database.collection("courses").doc(courseB).set({ id: courseB, orgId: orgB, title: "Org B course", subject: "english", level: "A1" }),
    database.collection("courses").doc(courseHigher).set({ id: courseHigher, orgId: orgA, title: "Org A B2 course", subject: "english", level: "B2" }),
    database.collection("progress").doc(`${learnerId}_a`).set({
      id: `${learnerId}_a`, studentId: learnerId, lessonId: "lesson-a", moduleId: "module-a", courseId: courseA,
      completed: false, timeSpentSeconds: 60, attempts: [], lastAccessedAt: "2026-08-24T10:00:00.000Z",
    }),
    database.collection("progress").doc(`${learnerId}_b`).set({
      id: `${learnerId}_b`, studentId: learnerId, lessonId: "lesson-b", moduleId: "module-b", courseId: courseB,
      completed: false, timeSpentSeconds: 60, attempts: [], lastAccessedAt: "2026-08-25T10:00:00.000Z",
    }),
  ]);

  const request = {
    contractVersion: "1" as const,
    learnerId,
    organizationId: orgA,
    requestingProduct: "learn" as const,
    purpose: "teacher_instructional_support" as const,
    domains: ["curriculum" as const, "pronunciation" as const, "fluency" as const],
  };

  await expectFailure(
    () => getScopedLearnerContext({ actorId: teacherId, request }),
    "qualification linked to a teaching authorization",
    "teacher membership alone does not authorize student instructional context",
  );

  const qualification: EducatorQualificationScopeV1 = {
    contractVersion: "1",
    id: qualificationId,
    userId: teacherId,
    status: "qualified",
    subject: "english",
    levels: ["A1", "A2", "B1"],
    methodologyCompetencyIds: ["teach.methodology.communicative-foundations"],
    planningCompetencyIds: ["teach.planning.objective-alignment"],
    assessmentCompetencyIds: ["teach.assessment.formative-foundations"],
    practiceEvidenceRefs: ["practice:fixture"],
    languageProficiencyLevel: "B2",
    evidenceRefs: ["evidence:fixture"],
    provenance: { method: "human_review", actorId: ownerId, policyVersion: "educator-qualification-v1" },
    issuedAt: "2026-08-25T00:00:00.000Z",
  };
  const authorization: TeachingAuthorizationV1 = {
    contractVersion: "1",
    id: authorizationId,
    userId: teacherId,
    status: "active",
    organizationId: orgA,
    courseIds: [courseA],
    subject: "english",
    levels: ["A1"],
    qualificationId,
    grantedBy: ownerId,
    grantedAt: "2026-08-25T00:00:00.000Z",
  };
  await Promise.all([
    database.collection("educator-qualifications").doc(teacherId).collection("scopes").doc(qualificationId).set(qualification),
    database.collection("teaching-authorizations").doc(teacherId).collection("grants").doc(authorizationId).set(authorization),
  ]);

  const benefits = await getEducatorBenefitEntitlements(teacherId);
  check(benefits.teach && benefits.coachFull && benefits.source === "educator_benefit", "verified Learn educator automatically receives Teach and full Coach benefits under the same identity");

  const allowedCourse = await getEducatorCourseAccessDecision({ userId: teacherId, course: course({ id: courseA, orgId: orgA, level: "A1" }) });
  check(allowedCourse.allowed && allowedCourse.reason === "authorized", "qualification and teaching authorization unlock only the approved Learn course scope");

  const higherCourse = await getEducatorCourseAccessDecision({ userId: teacherId, course: course({ id: courseHigher, orgId: orgA, level: "B2" }) });
  check(!higherCourse.allowed && higherCourse.reason === "authorization_scope_mismatch", "higher-level course stays locked when it is outside the educator authorization scope");

  const teacherContext = await getScopedLearnerContext({ actorId: teacherId, request });
  check(teacherContext.context.organizationId === orgA, "qualified Learn teacher delegation stays inside the explicitly requested organization");
  check(teacherContext.context.curriculum?.courseId === courseA, "requested organization wins over newer progress in another organization");

  const ownerContext = await getScopedLearnerContext({ actorId: ownerId, request });
  check(ownerContext.context.organizationId === orgA, "organization owner retains governance instructional-support access without being represented as a qualified teacher");

  const selfContext = await getScopedLearnerContext({ actorId: learnerId, request });
  check(selfContext.context.organizationId === orgA, "learner self-service may request an organization they belong to");

  await expectFailure(
    () => getScopedLearnerContext({ actorId: outsiderId, request }),
    "educator, organization admin, or owner",
    "student membership cannot delegate instructional support for another learner",
  );

  await expectFailure(
    () => getScopedLearnerContext({ actorId: teacherId, request: { ...request, organizationId: orgB } }),
    "educator, organization admin, or owner",
    "teacher membership in Org A cannot read a learner through Org B",
  );

  await expectFailure(
    () => getScopedLearnerContext({ actorId: teacherId, request: { ...request, purpose: "learn_adaptive_practice" } }),
    "Delegated learner context is not authorized",
    "delegated access cannot reuse a self-service Learn purpose",
  );

  await expectFailure(
    () => getScopedLearnerContext({ actorId: teacherId, request: { ...request, requestingProduct: "teach" } }),
    "requesting product is not authorized",
    "Lurexa Teach cannot request student instructional context even for an entitled educator",
  );

  console.log("Educator qualification, entitlement, teaching authorization, and delegated learner-context integration passed.");
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

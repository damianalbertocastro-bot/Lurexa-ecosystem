import type { CoachSession, Course, EducatorEntitlementV1, EducatorQualificationScopeV1, TeachingAuthorizationV1 } from "@lurexa/types";
import { getServerFirestore } from "../src/firebase-admin.server";
import { getEducatorBenefitEntitlements, getEducatorCourseAccessDecision } from "../src/educator-access.server";
import { CourseEnrollmentIndexService } from "../src/core/course-enrollment-index.server";
import { getLearnTeacherInstructionalRoster } from "../src/learn-teacher-roster.server";
import { getLearnTeacherCourseIntelligence } from "../src/learn-teacher-course-intelligence.server";
import { buildEducatorGrowthPath } from "../src/mind/educator-growth-path.server";
import { endCoachSession } from "../src/coach-session-completion.server";

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Educator growth journey failed: ${message}`);
  console.log(`✓ ${message}`);
}

async function main(): Promise<void> {
  const database = getServerFirestore();
  const suffix = Date.now().toString(36);
  const teacherId = `integration_teacher_${suffix}`;
  const learnerStarted = `integration_started_${suffix}`;
  const learnerNew = `integration_new_${suffix}`;
  const orgId = `integration_org_${suffix}`;
  const courseId = `integration_course_${suffix}`;
  const moduleId = `integration_module_${suffix}`;
  const qualificationId = `integration_qualification_${suffix}`;
  const authorizationId = `integration_authorization_${suffix}`;

  const course: Course = {
    id: courseId, orgId, authorId: teacherId, title: "A1 Integration English", description: "fixture",
    subject: "english", level: "A1", status: "published", isTemplate: false, moduleIds: [moduleId],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  const qualification: EducatorQualificationScopeV1 = {
    contractVersion: "1", id: qualificationId, userId: teacherId, status: "qualified", subject: "english", levels: ["A1"],
    methodologyCompetencyIds: ["teach.methodology.communicative-foundations"], planningCompetencyIds: ["teach.planning.objective-alignment"],
    assessmentCompetencyIds: ["teach.assessment.formative-foundations"], practiceEvidenceRefs: ["practice:integration"], languageProficiencyLevel: "B2",
    evidenceRefs: ["credential:integration"], provenance: { method: "human_review", actorId: "reviewer", policyVersion: "educator-qualification-v1" },
    issuedAt: new Date().toISOString(), validUntil: "2030-01-01T00:00:00.000Z",
  };
  const authorization: TeachingAuthorizationV1 = {
    contractVersion: "1", id: authorizationId, userId: teacherId, status: "active", organizationId: orgId,
    courseIds: [courseId], subject: "english", levels: ["A1"], qualificationId, grantedBy: "org-admin",
    grantedAt: new Date().toISOString(), validUntil: "2030-01-01T00:00:00.000Z",
  };
  const entitlement: EducatorEntitlementV1 = {
    contractVersion: "1", userId: teacherId, product: "learn_teacher", status: "active", source: "institution", grantedAt: new Date().toISOString(),
  };

  await Promise.all([
    database.collection("courses").doc(courseId).set(course),
    database.collection("modules").doc(moduleId).set({ id: moduleId, courseId, title: "Module", order: 1, lessonIds: ["lesson-1", "lesson-2"] }),
    database.collection("user-memberships").doc(teacherId).collection("organizations").doc(orgId).set({ role: "teacher", orgId, userId: teacherId }),
    database.collection("organizations").doc(orgId).set({ id: orgId, name: "Integration School", ownerId: "owner", slug: orgId, plan: "free", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
    database.collection("organizations").doc(orgId).collection("members").doc(teacherId).set({ role: "teacher", userId: teacherId, orgId }),
    database.collection("user-memberships").doc(learnerStarted).collection("organizations").doc(orgId).set({ role: "student", orgId, userId: learnerStarted }),
    database.collection("user-memberships").doc(learnerNew).collection("organizations").doc(orgId).set({ role: "student", orgId, userId: learnerNew }),
    database.collection("organizations").doc(orgId).collection("members").doc(learnerStarted).set({ role: "student", userId: learnerStarted, orgId }),
    database.collection("organizations").doc(orgId).collection("members").doc(learnerNew).set({ role: "student", userId: learnerNew, orgId }),
    database.collection("users").doc(learnerStarted).set({ displayName: "Started Learner" }),
    database.collection("users").doc(learnerNew).set({ displayName: "New Learner" }),
    database.collection("user-entitlements").doc(teacherId).collection("products").doc("learn_teacher").set(entitlement),
    database.collection("educator-qualifications").doc(teacherId).collection("scopes").doc(qualificationId).set(qualification),
    database.collection("teaching-authorizations").doc(teacherId).collection("grants").doc(authorizationId).set(authorization),
    database.collection("progress").doc(`${learnerStarted}_lesson1`).set({
      id: `${learnerStarted}_lesson1`, studentId: learnerStarted, lessonId: "lesson-1", moduleId, courseId,
      completed: true, timeSpentSeconds: 300, attempts: [], lastAccessedAt: new Date().toISOString(),
    }),
  ]);

  const access = await getEducatorCourseAccessDecision({ userId: teacherId, course });
  check(access.allowed, "qualified and authorized educator receives exact-course Learn access");
  const benefits = await getEducatorBenefitEntitlements(teacherId);
  check(benefits.teach && benefits.coachFull && benefits.source === "educator_benefit", "active teaching authorization derives Teach and full Coach educator benefits");

  await CourseEnrollmentIndexService.enrollAuthorizedLearner({ educatorId: teacherId, courseId, learnerId: learnerStarted, source: "admin" });
  await CourseEnrollmentIndexService.enrollAuthorizedLearner({ educatorId: teacherId, courseId, learnerId: learnerNew, source: "admin" });
  const roster = await getLearnTeacherInstructionalRoster({ uid: teacherId, email: null });
  const rosterCourse = roster.courses.find((item) => item.courseId === courseId);
  check(rosterCourse?.learners.length === 2, "Core enrollment roster includes both participating and never-started learners");
  check(rosterCourse.learners.some((item) => item.learnerId === learnerNew && item.progressPercent === 0 && item.lastActivityAt === null), "never-started learner is visible with zero progress instead of disappearing");

  const intelligence = await getLearnTeacherCourseIntelligence({ educatorId: teacherId, organizationId: orgId, courseId });
  check(intelligence.enrollment.total === 2 && intelligence.enrollment.participating === 1 && intelligence.enrollment.notStarted === 1, "course intelligence distinguishes enrolled, participating, and not-started learners");
  check(!JSON.stringify(intelligence).includes(learnerStarted) && !JSON.stringify(intelligence).includes(learnerNew), "aggregate course intelligence does not expose learner identifiers");

  const growth = buildEducatorGrowthPath({ userId: teacherId, qualifications: [qualification], benefits });
  check(growth.benefitEntitlements.coachFull && growth.qualificationStatus === "qualified", "Teach growth path consumes professional qualification and educator-benefit state");
  check(growth.privacyBoundary.includes("Student weaknesses") && !JSON.stringify(growth).includes(learnerStarted), "Teach growth path excludes student context from educator professional state");

  const educatorSession: CoachSession = {
    id: `educator_coach_${suffix}`, learnerId: teacherId, mode: "educator_professional", status: "active", focus: { cefr: "B2", pronunciationTargets: ["intelligibility"] },
    transcript: [{ sender: "coach", text: "Practice", timestamp: new Date().toISOString() }, { sender: "learner", text: "Professional practice response", timestamp: new Date().toISOString() }],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  await database.collection("coach-sessions").doc(educatorSession.id).set(educatorSession);
  const educatorCompletion = await endCoachSession({ uid: teacherId, email: null }, { sessionId: educatorSession.id });
  check(educatorCompletion.returnBridge.destination === "teach" && educatorCompletion.returnBridge.purpose === "professional_growth", "educator Coach completion returns to Teach professional growth");
  const professionalEvidence = await database.collection("educator-professional-evidence").doc(teacherId).collection("records").doc(`coach_session_${educatorSession.id}`).get();
  check(professionalEvidence.exists && professionalEvidence.data()?.privacy?.studentContextIncluded === false, "educator Coach completion writes minimized professional evidence with no student context");
  check(!JSON.stringify(professionalEvidence.data()).includes("Professional practice response"), "professional Coach evidence excludes raw transcript text");

  const learnerSession: CoachSession = {
    id: `learner_coach_${suffix}`, learnerId: learnerStarted, mode: "learner", status: "active", focus: {}, transcript: [],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  await database.collection("coach-sessions").doc(learnerSession.id).set(learnerSession);
  const learnerCompletion = await endCoachSession({ uid: learnerStarted, email: null }, { sessionId: learnerSession.id });
  check(learnerCompletion.returnBridge.destination === "learn" && learnerCompletion.returnBridge.purpose === "return_to_learning", "ordinary learner Coach completion preserves the Learn return loop");

  await Promise.all([
    database.collection("educator-qualifications").doc(teacherId).collection("scopes").doc(qualificationId).update({ status: "suspended" }),
    database.collection("teaching-authorizations").doc(teacherId).collection("grants").doc(authorizationId).update({ status: "suspended" }),
  ]);
  const blocked = await getEducatorCourseAccessDecision({ userId: teacherId, course });
  const blockedBenefits = await getEducatorBenefitEntitlements(teacherId);
  check(!blocked.allowed, "invalid professional state immediately removes Learn exact-course teaching access");
  check(!blockedBenefits.coachFull, "suspended teaching authorization removes derived full Coach educator benefit");

  console.log("Learn ↔ Teach ↔ Coach educator growth integration journey passed.");
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

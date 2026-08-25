import type {
  Course,
  EducatorAccessDecisionV1,
  EducatorBenefitEntitlementsV1,
  EducatorEntitlementV1,
  EducatorQualificationScopeV1,
  TeachingAuthorizationV1,
} from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";

function stillValid(validUntil?: string | null): boolean {
  return !validUntil || validUntil > new Date().toISOString();
}

function entitlementActive(entitlement: EducatorEntitlementV1): boolean {
  return entitlement.status === "active" && stillValid(entitlement.expiresAt);
}

function qualificationActive(qualification: EducatorQualificationScopeV1): boolean {
  return qualification.status === "qualified" && stillValid(qualification.validUntil);
}

function authorizationActive(authorization: TeachingAuthorizationV1): boolean {
  return authorization.status === "active" && stillValid(authorization.validUntil);
}

async function readEntitlements(userId: string): Promise<EducatorEntitlementV1[]> {
  const snapshot = await getServerFirestore()
    .collection("user-entitlements")
    .doc(userId)
    .collection("products")
    .get();
  return snapshot.docs.map((document) => document.data() as EducatorEntitlementV1).filter(entitlementActive);
}

async function readQualifications(userId: string): Promise<EducatorQualificationScopeV1[]> {
  const snapshot = await getServerFirestore()
    .collection("educator-qualifications")
    .doc(userId)
    .collection("scopes")
    .get();
  return snapshot.docs.map((document) => document.data() as EducatorQualificationScopeV1).filter(qualificationActive);
}

async function readAuthorizations(userId: string): Promise<TeachingAuthorizationV1[]> {
  const snapshot = await getServerFirestore()
    .collection("teaching-authorizations")
    .doc(userId)
    .collection("grants")
    .get();
  return snapshot.docs.map((document) => document.data() as TeachingAuthorizationV1).filter(authorizationActive);
}

function qualificationSupportsAuthorization(
  qualification: EducatorQualificationScopeV1,
  authorization: TeachingAuthorizationV1,
): boolean {
  return qualification.id === authorization.qualificationId
    && qualification.subject === authorization.subject
    && authorization.levels.length > 0
    && authorization.levels.every((level) => qualification.levels.includes(level));
}

function courseMatchesAuthorization(course: Course, authorization: TeachingAuthorizationV1): boolean {
  if (authorization.organizationId !== course.orgId) return false;
  if (!authorization.courseIds.includes(course.id)) return false;
  if (authorization.subject !== course.subject) return false;
  return !course.level || authorization.levels.includes(course.level);
}

async function readVerifiedEducatorState(userId: string) {
  const [qualifications, authorizations] = await Promise.all([
    readQualifications(userId),
    readAuthorizations(userId),
  ]);
  const linked = authorizations
    .map((authorization) => ({
      authorization,
      qualification: qualifications.find((qualification) => qualificationSupportsAuthorization(qualification, authorization)) ?? null,
    }))
    .filter((entry): entry is { authorization: TeachingAuthorizationV1; qualification: EducatorQualificationScopeV1 } => entry.qualification !== null);
  return { qualifications, authorizations, linked };
}

export async function getEducatorBenefitEntitlements(userId: string): Promise<EducatorBenefitEntitlementsV1> {
  const [explicitEntitlements, educatorState] = await Promise.all([
    readEntitlements(userId),
    readVerifiedEducatorState(userId),
  ]);
  const has = (product: EducatorEntitlementV1["product"]) => explicitEntitlements.some((entry) => entry.product === product);
  const explicitTeach = has("teach");
  const explicitCoach = has("coach_full");
  const verifiedEducator = educatorState.linked.length > 0;

  return {
    contractVersion: "1",
    userId,
    teach: verifiedEducator || explicitTeach,
    coachFull: verifiedEducator || explicitCoach,
    source: verifiedEducator ? "educator_benefit" : explicitTeach || explicitCoach ? "explicit_entitlement" : "none",
  };
}

export async function getEducatorAuthorizedCourseIds(input: {
  userId: string;
  organizationId: string;
}): Promise<string[]> {
  const educatorState = await readVerifiedEducatorState(input.userId);
  return [...new Set(educatorState.linked
    .filter(({ authorization }) => authorization.organizationId === input.organizationId)
    .flatMap(({ authorization }) => authorization.courseIds))];
}

export async function getEducatorCourseAccessDecision(input: {
  userId: string;
  course: Course;
  governanceRole?: "owner" | "admin" | null;
}): Promise<EducatorAccessDecisionV1> {
  const { userId, course, governanceRole = null } = input;
  const [entitlements, educatorState] = await Promise.all([
    readEntitlements(userId),
    readVerifiedEducatorState(userId),
  ]);
  const verifiedEducator = educatorState.linked.length > 0;
  const hasExplicit = (product: EducatorEntitlementV1["product"]) => entitlements.some((entry) => entry.product === product);
  const entitlement = {
    learnTeacher: verifiedEducator || hasExplicit("learn_teacher"),
    teach: verifiedEducator || hasExplicit("teach"),
    coachFull: verifiedEducator || hasExplicit("coach_full"),
  };

  if (governanceRole) {
    return {
      contractVersion: "1",
      userId,
      organizationId: course.orgId,
      courseId: course.id,
      allowed: true,
      entitlement,
      qualification: null,
      authorization: null,
      reason: "governance_role",
    };
  }

  if (!entitlement.learnTeacher) {
    return {
      contractVersion: "1",
      userId,
      organizationId: course.orgId,
      courseId: course.id,
      allowed: false,
      entitlement,
      qualification: null,
      authorization: null,
      reason: "missing_learn_teacher_entitlement",
    };
  }

  if (educatorState.qualifications.length === 0) {
    return {
      contractVersion: "1",
      userId,
      organizationId: course.orgId,
      courseId: course.id,
      allowed: false,
      entitlement,
      qualification: null,
      authorization: null,
      reason: "missing_qualification",
    };
  }

  const courseAuthorization = educatorState.linked.find(({ authorization }) => courseMatchesAuthorization(course, authorization));
  if (!courseAuthorization) {
    return {
      contractVersion: "1",
      userId,
      organizationId: course.orgId,
      courseId: course.id,
      allowed: false,
      entitlement,
      qualification: educatorState.qualifications[0] ?? null,
      authorization: null,
      reason: educatorState.authorizations.some((authorization) => authorization.organizationId === course.orgId)
        ? "authorization_scope_mismatch"
        : "missing_teaching_authorization",
    };
  }

  return {
    contractVersion: "1",
    userId,
    organizationId: course.orgId,
    courseId: course.id,
    allowed: true,
    entitlement,
    qualification: courseAuthorization.qualification,
    authorization: courseAuthorization.authorization,
    reason: "authorized",
  };
}

import type {
  Course,
  EducatorEntitlementV1,
  EducatorGovernanceCourseV1,
  EducatorGovernancePersonV1,
  EducatorGovernanceSnapshotV1,
  EducatorLevel,
  EducatorQualificationScopeV1,
  TeachingAuthorizationGrantInputV1,
  TeachingAuthorizationStatusUpdateV1,
  TeachingAuthorizationV1,
} from "@lurexa/types";
import { getServerFirebaseAuth, getServerFirestore } from "../firebase-admin.server";

const governanceRoles = new Set(["owner", "admin"]);
const educatorMembershipRoles = new Set(["owner", "admin", "teacher"]);

function activeUntil(validUntil?: string | null): boolean {
  return !validUntil || validUntil > new Date().toISOString();
}

async function requireGovernanceActor(authorization: string | null, organizationId: string): Promise<string> {
  if (!authorization?.startsWith("Bearer ")) throw new Error("Authentication is required.");
  const token = await getServerFirebaseAuth().verifyIdToken(authorization.slice(7));
  if (token.role === "super_admin") return token.uid;

  const membership = await getServerFirestore()
    .collection("user-memberships")
    .doc(token.uid)
    .collection("organizations")
    .doc(organizationId)
    .get();
  const role = membership.exists ? membership.data()?.role : null;
  if (!governanceRoles.has(String(role))) throw new Error("Organization owner or admin access is required.");
  return token.uid;
}

async function readOrganization(organizationId: string): Promise<{ id: string; name: string }> {
  const snapshot = await getServerFirestore().collection("organizations").doc(organizationId).get();
  if (!snapshot.exists) throw new Error("Organization not found.");
  return { id: snapshot.id, name: String(snapshot.data()?.name ?? snapshot.id) };
}

function asCourse(snapshot: FirebaseFirestore.QueryDocumentSnapshot): Course {
  return { id: snapshot.id, ...snapshot.data() } as Course;
}

async function readCourses(organizationId: string): Promise<Course[]> {
  const snapshot = await getServerFirestore().collection("courses").where("orgId", "==", organizationId).get();
  return snapshot.docs.map(asCourse);
}

async function readEntitlements(userId: string): Promise<EducatorEntitlementV1[]> {
  const snapshot = await getServerFirestore().collection("user-entitlements").doc(userId).collection("products").get();
  return snapshot.docs.map((doc) => doc.data() as EducatorEntitlementV1);
}

async function readQualifications(userId: string): Promise<EducatorQualificationScopeV1[]> {
  const snapshot = await getServerFirestore().collection("educator-qualifications").doc(userId).collection("scopes").get();
  return snapshot.docs.map((doc) => doc.data() as EducatorQualificationScopeV1);
}

async function readAuthorizations(userId: string, organizationId: string): Promise<TeachingAuthorizationV1[]> {
  const snapshot = await getServerFirestore().collection("teaching-authorizations").doc(userId).collection("grants").get();
  return snapshot.docs
    .map((doc) => doc.data() as TeachingAuthorizationV1)
    .filter((authorization) => authorization.organizationId === organizationId);
}

async function readEducator(organizationId: string, userId: string, membershipRole: "owner" | "admin" | "teacher"): Promise<EducatorGovernancePersonV1> {
  const [entitlements, qualifications, authorizations, authUser] = await Promise.all([
    readEntitlements(userId),
    readQualifications(userId),
    readAuthorizations(userId, organizationId),
    getServerFirebaseAuth().getUser(userId).catch(() => null),
  ]);
  return {
    userId,
    displayName: authUser?.displayName ?? null,
    email: authUser?.email ?? null,
    membershipRole,
    entitlements,
    qualifications,
    authorizations,
  };
}

function courseView(course: Course): EducatorGovernanceCourseV1 {
  return {
    id: course.id,
    title: course.title,
    subject: course.subject,
    level: course.level ?? null,
  };
}

async function appendAudit(input: {
  actorId: string;
  organizationId: string;
  action: "authorization_granted" | "authorization_status_changed";
  targetUserId: string;
  authorizationId: string;
  qualificationId: string;
  courseIds: string[];
  status: string;
}) {
  await getServerFirestore().collection("educator-governance-audit").add({
    contractVersion: "1",
    ...input,
    occurredAt: new Date().toISOString(),
  });
}

function qualificationSupportsCourse(qualification: EducatorQualificationScopeV1, course: Course): boolean {
  return qualification.subject === course.subject && (!course.level || qualification.levels.includes(course.level));
}

export const EducatorGovernanceService = {
  async getSnapshot(authorization: string | null, organizationId: string): Promise<EducatorGovernanceSnapshotV1> {
    if (!organizationId.trim()) throw new Error("Organization id is required.");
    await requireGovernanceActor(authorization, organizationId);
    const [organization, courses, members] = await Promise.all([
      readOrganization(organizationId),
      readCourses(organizationId),
      getServerFirestore().collection("organizations").doc(organizationId).collection("members").get(),
    ]);

    const educatorMembers = members.docs
      .map((doc) => ({ userId: doc.id, role: String(doc.data().role) }))
      .filter((entry): entry is { userId: string; role: "owner" | "admin" | "teacher" } => educatorMembershipRoles.has(entry.role));
    const educators = await Promise.all(educatorMembers.map((entry) => readEducator(organizationId, entry.userId, entry.role)));

    return {
      contractVersion: "1",
      organizationId,
      organizationName: organization.name,
      courses: courses.map(courseView).sort((a, b) => a.title.localeCompare(b.title)),
      educators: educators.sort((a, b) => (a.displayName ?? a.email ?? a.userId).localeCompare(b.displayName ?? b.email ?? b.userId)),
      limitations: [
        "Organization membership is affiliation only and never creates teaching qualification.",
        "This surface can grant or suspend teaching authorization only inside an existing qualified scope.",
        "Qualification creation, review, expiry, and revocation are governed separately by the qualification lifecycle.",
      ],
    };
  },

  async grantTeachingAuthorization(
    authorizationHeader: string | null,
    input: TeachingAuthorizationGrantInputV1,
  ): Promise<TeachingAuthorizationV1> {
    if (!input.organizationId.trim() || !input.userId.trim() || !input.qualificationId.trim()) throw new Error("Organization, educator, and qualification are required.");
    if (!input.courseIds.length) throw new Error("At least one course is required.");
    const actorId = await requireGovernanceActor(authorizationHeader, input.organizationId);
    await readOrganization(input.organizationId);

    const qualificationSnapshot = await getServerFirestore()
      .collection("educator-qualifications")
      .doc(input.userId)
      .collection("scopes")
      .doc(input.qualificationId)
      .get();
    if (!qualificationSnapshot.exists) throw new Error("Qualification not found.");
    const qualification = qualificationSnapshot.data() as EducatorQualificationScopeV1;
    if (qualification.status !== "qualified" || !activeUntil(qualification.validUntil)) throw new Error("Only an active qualified scope can support teaching authorization.");

    const courseSnapshots = await Promise.all(input.courseIds.map((courseId) => getServerFirestore().collection("courses").doc(courseId).get()));
    const courses = courseSnapshots.map((snapshot) => {
      if (!snapshot.exists) throw new Error("Course not found.");
      return { id: snapshot.id, ...snapshot.data() } as Course;
    });
    if (courses.some((course) => course.orgId !== input.organizationId)) throw new Error("Every authorized course must belong to the selected organization.");
    if (courses.some((course) => !qualificationSupportsCourse(qualification, course))) throw new Error("Teaching authorization cannot exceed the educator qualification scope.");

    const levels = [...new Set(courses.map((course) => course.level).filter((level): level is EducatorLevel => Boolean(level)))];
    const reference = getServerFirestore().collection("teaching-authorizations").doc(input.userId).collection("grants").doc();
    const grantedAt = new Date().toISOString();
    const grant: TeachingAuthorizationV1 = {
      contractVersion: "1",
      id: reference.id,
      userId: input.userId,
      status: "active",
      organizationId: input.organizationId,
      courseIds: [...new Set(input.courseIds)],
      subject: qualification.subject,
      levels: levels.length ? levels : qualification.levels,
      qualificationId: qualification.id,
      grantedBy: actorId,
      grantedAt,
      validUntil: input.validUntil ?? null,
    };
    await reference.set(grant);
    await appendAudit({
      actorId,
      organizationId: input.organizationId,
      action: "authorization_granted",
      targetUserId: input.userId,
      authorizationId: grant.id,
      qualificationId: grant.qualificationId,
      courseIds: grant.courseIds,
      status: grant.status,
    });
    return grant;
  },

  async updateTeachingAuthorizationStatus(
    authorizationHeader: string | null,
    input: TeachingAuthorizationStatusUpdateV1,
  ): Promise<TeachingAuthorizationV1> {
    const actorId = await requireGovernanceActor(authorizationHeader, input.organizationId);
    const reference = getServerFirestore().collection("teaching-authorizations").doc(input.userId).collection("grants").doc(input.authorizationId);
    const snapshot = await reference.get();
    if (!snapshot.exists) throw new Error("Teaching authorization not found.");
    const current = snapshot.data() as TeachingAuthorizationV1;
    if (current.organizationId !== input.organizationId || current.userId !== input.userId) throw new Error("Teaching authorization is outside the selected organization.");

    const next: TeachingAuthorizationV1 = { ...current, status: input.status };
    await reference.update({ status: input.status, updatedAt: new Date().toISOString() });
    await appendAudit({
      actorId,
      organizationId: input.organizationId,
      action: "authorization_status_changed",
      targetUserId: input.userId,
      authorizationId: current.id,
      qualificationId: current.qualificationId,
      courseIds: current.courseIds,
      status: input.status,
    });
    return next;
  },
};

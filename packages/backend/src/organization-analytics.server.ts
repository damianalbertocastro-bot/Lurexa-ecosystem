import { getServerFirestore } from "./firebase-admin.server";
import type {
  ClassAnalyticsSummary,
  Course,
  OrganizationMember,
  StudentProgress,
  StudentRiskMetric,
  TeacherAnalyticsProjection,
  User,
} from "@lurexa/types";

const teacherRoles = new Set(["owner", "admin", "teacher"]);
const inactiveAfterMs = 7 * 24 * 60 * 60 * 1000;

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function safeTimestamp(value: string | undefined): number | null {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function summarizeLearner(
  member: OrganizationMember,
  user: Partial<User> | null,
  progress: StudentProgress[],
  now: number,
): StudentRiskMetric {
  const scores = progress
    .map((entry) => entry.bestScore)
    .filter((score): score is number => typeof score === "number" && Number.isFinite(score));
  const avgScore = average(scores);
  const completedLessons = new Set(progress.filter((entry) => entry.completed).map((entry) => entry.lessonId)).size;
  const lastAccessedAt = progress
    .map((entry) => entry.lastAccessedAt)
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .sort((first, second) => second.localeCompare(first))[0] ?? null;
  const lastActiveTimestamp = safeTimestamp(lastAccessedAt ?? undefined);

  let riskStatus: StudentRiskMetric["riskStatus"] = "healthy";
  let recommendedAction = "Continue normal support and review new evidence as it arrives.";

  if (progress.length === 0 || lastActiveTimestamp === null || now - lastActiveTimestamp > inactiveAfterMs) {
    riskStatus = "inactive";
    recommendedAction = "Check whether the learner still has access and needs a re-engagement follow-up.";
  } else if (avgScore !== null && avgScore < 60) {
    riskStatus = "at_risk";
    recommendedAction = "Review recent assessment evidence and provide targeted practice before changing proficiency or mastery claims.";
  }

  return {
    studentId: member.userId,
    studentName: user?.displayName?.trim() || user?.email?.trim() || member.userId,
    email: user?.email?.trim() || "",
    avgScore,
    completedLessons,
    lastActive: lastAccessedAt,
    riskStatus,
    recommendedAction,
  };
}

function buildSummary(progress: StudentProgress[], roster: StudentRiskMetric[]): ClassAnalyticsSummary {
  const completed = progress.filter((entry) => entry.completed).length;
  const scores = progress
    .map((entry) => entry.bestScore)
    .filter((score): score is number => typeof score === "number" && Number.isFinite(score));
  const needsReview = roster.filter((learner) => learner.riskStatus !== "healthy").length;
  const recommendations: string[] = [];

  if (roster.length > 0 && needsReview > 0) {
    recommendations.push("Review the learner support queue before assigning new interventions; inactivity and low assessment evidence require different responses.");
  }
  if (progress.length > 0 && completed / progress.length < 0.6) {
    recommendations.push("Review where learners are leaving the current lesson sequence and check for access, clarity, or workload barriers.");
  }
  if (scores.length > 0 && (average(scores) ?? 100) < 70) {
    recommendations.push("Inspect the underlying assessment attempts before reteaching; class averages alone are not a mastery claim.");
  }

  return {
    totalStudents: roster.length,
    avgCompletionRate: progress.length === 0 ? 0 : Math.round((completed / progress.length) * 100),
    avgQuizScore: average(scores),
    atRiskCount: needsReview,
    recommendations,
  };
}

async function resolveOrganization(actorId: string, requestedOrgId?: string): Promise<{ id: string; name: string }> {
  const database = getServerFirestore();
  const memberships = await database
    .collection("user-memberships")
    .doc(actorId)
    .collection("organizations")
    .get();

  const managerMemberships = memberships.docs.filter((document) => teacherRoles.has(document.data().role));
  const selected = requestedOrgId
    ? managerMemberships.find((document) => document.id === requestedOrgId)
    : managerMemberships[0];
  if (!selected) throw new Error("A teacher organization membership is required.");

  const organization = await database.collection("organizations").doc(selected.id).get();
  if (!organization.exists) throw new Error("Organization not found.");
  return { id: selected.id, name: String(organization.data()?.name ?? "Organization") };
}

async function getOrganizationCourseIds(orgId: string): Promise<string[]> {
  const snapshots = await getServerFirestore().collection("courses").where("orgId", "==", orgId).get();
  return snapshots.docs.map((document) => (document.data() as Course).id || document.id);
}

async function getOrganizationProgress(courseIds: string[]): Promise<StudentProgress[]> {
  if (courseIds.length === 0) return [];
  const database = getServerFirestore();
  const records: StudentProgress[] = [];
  for (let offset = 0; offset < courseIds.length; offset += 30) {
    const batch = courseIds.slice(offset, offset + 30);
    const snapshots = await database.collection("progress").where("courseId", "in", batch).get();
    records.push(...snapshots.docs.map((document) => document.data() as StudentProgress));
  }
  return records;
}

export const OrganizationAnalyticsService = {
  async getTeacherProjection(
    actorId: string,
    requestedOrgId?: string,
  ): Promise<TeacherAnalyticsProjection> {
    const database = getServerFirestore();
    const organization = await resolveOrganization(actorId, requestedOrgId);
    const [memberSnapshots, courseIds] = await Promise.all([
      database.collection("organizations").doc(organization.id).collection("members").get(),
      getOrganizationCourseIds(organization.id),
    ]);
    const progress = await getOrganizationProgress(courseIds);
    const progressByStudent = new Map<string, StudentProgress[]>();
    for (const entry of progress) {
      progressByStudent.set(entry.studentId, [...(progressByStudent.get(entry.studentId) ?? []), entry]);
    }

    const studentMembers = memberSnapshots.docs
      .map((document) => document.data() as OrganizationMember)
      .filter((member) => member.role === "student");
    const users = await Promise.all(studentMembers.map(async (member) => {
      const snapshot = await database.collection("users").doc(member.userId).get();
      return snapshot.exists ? (snapshot.data() as Partial<User>) : null;
    }));
    const now = Date.now();
    const roster = studentMembers
      .map((member, index) => summarizeLearner(member, users[index], progressByStudent.get(member.userId) ?? [], now))
      .sort((first, second) => {
        const riskOrder = { at_risk: 0, inactive: 1, healthy: 2 } as const;
        return riskOrder[first.riskStatus] - riskOrder[second.riskStatus]
          || (second.lastActive ?? "").localeCompare(first.lastActive ?? "");
      });

    return {
      organizationId: organization.id,
      organizationName: organization.name,
      generatedAt: new Date().toISOString(),
      summary: buildSummary(progress, roster),
      roster,
    };
  },
};

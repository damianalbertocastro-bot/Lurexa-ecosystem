import type {
  InsightOrganizationSignatureOverviewV1,
  LearningEvidence,
  StudentProgress,
} from "@lurexa/types";
import type { AuthenticatedActor } from "./course-platform.server";
import { CoursePlatformService } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";

const INSIGHT_ROLES = new Set(["owner", "admin"]);

async function requireInsightOrganizationAccess(actorId: string, organizationId: string): Promise<void> {
  if (!organizationId.trim()) throw new Error("Insight requires an explicit organization boundary.");
  const membership = await getServerFirestore()
    .collection("user-memberships")
    .doc(actorId)
    .collection("organizations")
    .doc(organizationId)
    .get();
  if (!membership.exists || !INSIGHT_ROLES.has(String(membership.data()?.role ?? ""))) {
    throw new Error("Organization owner or admin membership is required for Insight analytics.");
  }
}

function knowledgeObjectIdsFromEvidence(value: FirebaseFirestore.DocumentData): string[] {
  const source = typeof value.source === "object" && value.source !== null
    ? value.source as { knowledgeObjectIds?: unknown }
    : null;
  return Array.isArray(source?.knowledgeObjectIds)
    ? source.knowledgeObjectIds.filter((id): id is string => typeof id === "string" && id.trim().length > 0)
    : [];
}

/**
 * Aggregate-first Insight consumer. It deliberately returns no learner IDs,
 * raw evidence payloads, transcripts, or individual recommendations.
 */
export async function getInsightOrganizationSignatureOverview(input: {
  actor: AuthenticatedActor;
  organizationId: string;
}): Promise<InsightOrganizationSignatureOverviewV1> {
  await requireInsightOrganizationAccess(input.actor.uid, input.organizationId);
  const database = getServerFirestore();
  const teacherCourses = (await CoursePlatformService.getTeacherCourses(input.actor))
    .filter(({ course }) => course.orgId === input.organizationId);
  const studentMembershipCache = new Map<string, boolean>();
  const isCurrentStudent = async (learnerId: string): Promise<boolean> => {
    const cached = studentMembershipCache.get(learnerId);
    if (cached !== undefined) return cached;
    const membership = await database
      .collection("user-memberships")
      .doc(learnerId)
      .collection("organizations")
      .doc(input.organizationId)
      .get();
    const allowed = membership.exists && membership.data()?.role === "student";
    studentMembershipCache.set(learnerId, allowed);
    return allowed;
  };

  const now = Date.now();
  const activeCutoff = now - 14 * 86_400_000;
  const participatingLearners = new Set<string>();
  const activeLearners = new Set<string>();
  const learnerCourseProgress: number[] = [];

  for (const { course, lessons } of teacherCourses) {
    const progressSnapshot = await database.collection("progress").where("courseId", "==", course.id).get();
    const byLearner = new Map<string, StudentProgress[]>();
    for (const document of progressSnapshot.docs) {
      const record = document.data() as StudentProgress;
      const records = byLearner.get(record.studentId) ?? [];
      records.push(record);
      byLearner.set(record.studentId, records);
    }

    for (const [learnerId, records] of byLearner) {
      if (!await isCurrentStudent(learnerId)) continue;
      participatingLearners.add(learnerId);
      if (records.some((record) => Date.parse(record.lastAccessedAt) >= activeCutoff)) activeLearners.add(learnerId);
      const completed = new Set(records.filter((record) => record.completed).map((record) => record.lessonId)).size;
      learnerCourseProgress.push(lessons.length === 0 ? 0 : Math.round((completed / lessons.length) * 100));
    }
  }

  const evidenceSnapshot = await database.collection("learning-evidence")
    .where("organizationId", "==", input.organizationId)
    .get();
  const knowledgeObjectCounts = new Map<string, number>();
  for (const document of evidenceSnapshot.docs) {
    const value = document.data() as LearningEvidence;
    if (!await isCurrentStudent(value.learnerId)) continue;
    for (const knowledgeObjectId of knowledgeObjectIdsFromEvidence(value)) {
      knowledgeObjectCounts.set(knowledgeObjectId, (knowledgeObjectCounts.get(knowledgeObjectId) ?? 0) + 1);
    }
  }

  return {
    contractVersion: "1",
    organizationId: input.organizationId,
    generatedAt: new Date(now).toISOString(),
    courseCount: teacherCourses.length,
    participatingLearners: participatingLearners.size,
    activeLearners14d: activeLearners.size,
    averageCourseProgressPercent: learnerCourseProgress.length
      ? Math.round(learnerCourseProgress.reduce((sum, value) => sum + value, 0) / learnerCourseProgress.length)
      : null,
    knowledgeObjectCoverage: [...knowledgeObjectCounts.entries()]
      .map(([knowledgeObjectId, evidenceCount]) => ({ knowledgeObjectId, evidenceCount }))
      .sort((first, second) => second.evidenceCount - first.evidenceCount || first.knowledgeObjectId.localeCompare(second.knowledgeObjectId))
      .slice(0, 20),
    limitations: [
      "Insight v1 is aggregate-first and returns no learner identifiers or raw learning evidence.",
      "Participation reflects recorded course progress for current student members, not all enrolled seats.",
      "Knowledge Object coverage counts governed references from current student members' organization-scoped evidence; legacy evidence without semantic references is not inferred.",
      "Average progress is descriptive course participation, not mastery or proficiency.",
    ],
  };
}

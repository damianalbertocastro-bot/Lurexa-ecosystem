import type {
  TeacherInterventionBrief,
  TeacherInterventionResponse,
} from "@lurexa/types";
import type { AuthenticatedActor } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";
import { FirestoreLearnerInsightRepository, FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { refreshLearnerIntelligence } from "./learner-intelligence-pipeline.server";

type TeacherRole = "owner" | "admin" | "teacher";

function sanitizeText(value: string, maxLength: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

async function requireTeacherCourseAccess(actor: AuthenticatedActor, courseId: string): Promise<string> {
  const database = getServerFirestore();
  const courseSnapshot = await database.collection("courses").doc(courseId).get();
  if (!courseSnapshot.exists) throw new Error("Course not found.");
  const organizationId = courseSnapshot.data()?.orgId;
  if (typeof organizationId !== "string" || !organizationId) throw new Error("Course organization is unavailable.");
  const membership = await database
    .collection("user-memberships")
    .doc(actor.uid)
    .collection("organizations")
    .doc(organizationId)
    .get();
  const role = membership.data()?.role;
  if (!membership.exists || !(["owner", "admin", "teacher"] as TeacherRole[]).includes(role as TeacherRole)) {
    throw new Error("A teacher organization membership is required.");
  }
  return organizationId;
}

async function requireLearnerMembership(learnerId: string, organizationId: string): Promise<void> {
  const membership = await getServerFirestore()
    .collection("user-memberships")
    .doc(learnerId)
    .collection("organizations")
    .doc(organizationId)
    .get();
  if (!membership.exists) throw new Error("Learner is not part of this organization.");
}

function activeTargetSummaries(insights: Awaited<ReturnType<FirestoreLearnerInsightRepository["listActiveByLearner"]>>): string[] {
  return insights
    .flatMap((insight) => insight.data?.kind === "learning_targets"
      ? insight.data.targets.map((target) => `${insight.data!.domain}: ${target}`)
      : [])
    .slice(0, 12);
}

function recommendationSummaries(insights: Awaited<ReturnType<FirestoreLearnerInsightRepository["listActiveByLearner"]>>): string[] {
  return insights
    .filter((insight) => insight.data?.kind === "recommendation")
    .sort((first, second) => second.generatedAt.localeCompare(first.generatedAt))
    .map((insight) => insight.summary)
    .slice(0, 8);
}

export const TeacherInterventionService = {
  async createBrief(actor: AuthenticatedActor, courseId: string, learnerId: string): Promise<TeacherInterventionBrief> {
    const organizationId = await requireTeacherCourseAccess(actor, courseId);
    await requireLearnerMembership(learnerId, organizationId);

    const database = getServerFirestore();
    const [progressSnapshot, evidence, insights] = await Promise.all([
      database.collection("progress").where("studentId", "==", learnerId).get(),
      new FirestoreLearningEvidenceRepository().listByLearner(learnerId, organizationId),
      new FirestoreLearnerInsightRepository().listActiveByLearner(learnerId, organizationId),
    ]);

    const courseProgress = progressSnapshot.docs
      .map((doc) => doc.data() as { courseId?: string; lessonId?: string; lastAccessedAt?: string })
      .filter((item) => item.courseId === courseId && typeof item.lastAccessedAt === "string")
      .sort((first, second) => (second.lastAccessedAt ?? "").localeCompare(first.lastAccessedAt ?? ""));
    const courseEvidence = evidence
      .filter((item) => item.source.courseId === courseId)
      .sort((first, second) => second.observedAt.localeCompare(first.observedAt));
    const recentActivityIds = courseEvidence
      .flatMap((item) => item.source.activityId ? [item.source.activityId] : [])
      .filter((id, index, values) => values.indexOf(id) === index)
      .slice(0, 12);
    const recentEvidenceTypes = courseEvidence
      .map((item) => item.type)
      .filter((type, index, values) => values.indexOf(type) === index)
      .slice(0, 10);

    const id = `teacher_intervention_${learnerId}_${courseId}_${Date.now()}`.replace(/[^a-zA-Z0-9._-]/g, "_");
    const brief: TeacherInterventionBrief = {
      id,
      learnerId,
      teacherId: actor.uid,
      organizationId,
      courseId,
      status: "open",
      recentLessonId: courseProgress[0]?.lessonId ?? null,
      evidenceSummary: {
        recentEvidenceTypes,
        recentActivityIds,
        latestEvidenceAt: courseEvidence[0]?.observedAt ?? null,
      },
      learningSignals: {
        recommendations: recommendationSummaries(insights),
        activeTargets: activeTargetSummaries(insights),
      },
      createdAt: new Date().toISOString(),
    };

    await database.collection("teacher-interventions").doc(id).set(brief);
    return brief;
  },

  async respond(actor: AuthenticatedActor, interventionId: string, input: Omit<TeacherInterventionResponse, "respondedAt">): Promise<TeacherInterventionBrief> {
    const database = getServerFirestore();
    const ref = database.collection("teacher-interventions").doc(interventionId);
    const snapshot = await ref.get();
    if (!snapshot.exists) throw new Error("Teacher intervention not found.");
    const brief = { ...snapshot.data(), id: snapshot.id } as TeacherInterventionBrief;
    const organizationId = await requireTeacherCourseAccess(actor, brief.courseId);
    if (organizationId !== brief.organizationId) throw new Error("Intervention organization does not match the course.");

    const teacherNote = sanitizeText(input.teacherNote, 2_000);
    const recommendedAction = sanitizeText(input.recommendedAction, 600);
    const expertEscalationReason = input.expertEscalationReason
      ? sanitizeText(input.expertEscalationReason, 1_000)
      : undefined;
    if (!teacherNote || !recommendedAction) throw new Error("Teacher note and recommended action are required.");
    if (input.expertEscalationRequested && !expertEscalationReason) {
      throw new Error("Explain why expert educator support is requested.");
    }

    const response: TeacherInterventionResponse = {
      priority: input.priority,
      teacherNote,
      recommendedAction,
      ...(input.recommendedActivityId ? { recommendedActivityId: sanitizeText(input.recommendedActivityId, 160) } : {}),
      expertEscalationRequested: input.expertEscalationRequested,
      ...(expertEscalationReason ? { expertEscalationReason } : {}),
      respondedAt: new Date().toISOString(),
    };
    const updated: TeacherInterventionBrief = { ...brief, status: "responded", response };
    await ref.set(updated, { merge: true });

    const evidenceRepository = new FirestoreLearningEvidenceRepository();
    await evidenceRepository.append({
      id: `learn_${brief.id}_teacher_response`,
      learnerId: brief.learnerId,
      organizationId: brief.organizationId,
      source: {
        product: "learn",
        courseId: brief.courseId,
        ...(brief.recentLessonId ? { lessonId: brief.recentLessonId } : {}),
        ...(response.recommendedActivityId ? { activityId: response.recommendedActivityId } : {}),
      },
      type: "correction_outcome",
      observedAt: response.respondedAt,
      payload: {
        event: "teacher_intervention.responded",
        interventionId: brief.id,
        priority: response.priority,
        recommendedAction: response.recommendedAction,
        expertEscalationRequested: response.expertEscalationRequested,
      },
      provenance: {
        method: "teacher_reported",
        actorId: actor.uid,
      },
    });

    try {
      await refreshLearnerIntelligence({ learnerId: brief.learnerId, organizationId: brief.organizationId });
    } catch (error) {
      console.error("Learner intelligence refresh failed after teacher intervention.", error);
    }

    return updated;
  },

  async listForTeacher(actor: AuthenticatedActor, courseId: string): Promise<TeacherInterventionBrief[]> {
    await requireTeacherCourseAccess(actor, courseId);
    const snapshot = await getServerFirestore().collection("teacher-interventions").where("courseId", "==", courseId).get();
    return snapshot.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }) as TeacherInterventionBrief)
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  },

  async listForLearner(actor: AuthenticatedActor): Promise<TeacherInterventionBrief[]> {
    const snapshot = await getServerFirestore().collection("teacher-interventions").where("learnerId", "==", actor.uid).get();
    return snapshot.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }) as TeacherInterventionBrief)
      .filter((item) => item.status === "responded" && item.response)
      .sort((first, second) => (second.response?.respondedAt ?? "").localeCompare(first.response?.respondedAt ?? ""));
  },
};

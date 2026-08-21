import type {
  LearnerRecommendationAction,
  NextLearningAction,
  RetrievalSchedule,
  TeacherInterventionBrief,
} from "@lurexa/types";
import type { AuthenticatedActor } from "./course-platform.server";
import { CoursePlatformService } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";
import { getScopedLearnerContext } from "./learner-context.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";

const RETRIEVAL_INTERVALS_DAYS = [2, 7] as const;

function scheduleId(learnerId: string, lessonId: string, intervalDays: number): string {
  return `retrieval_${learnerId}_${lessonId}_${intervalDays}d`.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function addDays(iso: string, days: number): string {
  const date = new Date(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

async function getOrganizationId(courseId: string): Promise<string> {
  const snapshot = await getServerFirestore().collection("courses").doc(courseId).get();
  if (!snapshot.exists) throw new Error("Course not found.");
  const organizationId = snapshot.data()?.orgId;
  if (typeof organizationId !== "string" || !organizationId) throw new Error("Course organization is unavailable.");
  return organizationId;
}

async function latestTeacherRecommendation(learnerId: string): Promise<TeacherInterventionBrief | null> {
  const snapshot = await getServerFirestore()
    .collection("teacher-interventions")
    .where("learnerId", "==", learnerId)
    .get();
  const responded = snapshot.docs
    .map((doc) => ({ ...doc.data(), id: doc.id }) as TeacherInterventionBrief)
    .filter((item) => item.status === "responded" && item.response)
    .sort((first, second) => (second.response?.respondedAt ?? "").localeCompare(first.response?.respondedAt ?? ""));
  return responded[0] ?? null;
}

function retrievalRecommendation(schedule: RetrievalSchedule): LearnerRecommendationAction {
  return {
    outcome: "reinforce",
    label: `Retrieve this lesson after ${schedule.intervalDays} days`,
    reason: "Delayed recall is due. Try to produce the target language before rereading so retention evidence stays meaningful.",
    courseId: schedule.courseId,
    lessonId: schedule.lessonId,
  };
}

function teacherRecommendationAction(brief: TeacherInterventionBrief): LearnerRecommendationAction | null {
  if (!brief.response) return null;
  return {
    outcome: "targeted_practice",
    label: brief.response.recommendedAction,
    reason: `Your teacher prioritized ${brief.response.priority} based on recent learning evidence.`,
    courseId: brief.courseId,
    ...(brief.recentLessonId ? { lessonId: brief.recentLessonId } : {}),
    ...(brief.response.recommendedActivityId ? { activityId: brief.response.recommendedActivityId } : {}),
  };
}

export const LearnAdaptationService = {
  async scheduleLessonRetrieval(actor: AuthenticatedActor, courseId: string, lessonId: string): Promise<RetrievalSchedule[]> {
    await CoursePlatformService.getLesson(actor, courseId, lessonId);
    const organizationId = await getOrganizationId(courseId);
    const database = getServerFirestore();
    const createdAt = new Date().toISOString();
    const schedules = RETRIEVAL_INTERVALS_DAYS.map((intervalDays): RetrievalSchedule => ({
      id: scheduleId(actor.uid, lessonId, intervalDays),
      learnerId: actor.uid,
      organizationId,
      courseId,
      lessonId,
      dueAt: addDays(createdAt, intervalDays),
      intervalDays,
      status: "scheduled",
      createdAt,
    }));

    await Promise.all(schedules.map(async (schedule) => {
      const ref = database.collection("retrieval-schedules").doc(schedule.id);
      const existing = await ref.get();
      if (!existing.exists || ["completed", "superseded"].includes(existing.data()?.status as string)) {
        await ref.set(schedule);
      }
    }));
    return schedules;
  },

  async completeRetrieval(actor: AuthenticatedActor, scheduleIdValue: string): Promise<RetrievalSchedule> {
    const ref = getServerFirestore().collection("retrieval-schedules").doc(scheduleIdValue);
    const snapshot = await ref.get();
    if (!snapshot.exists) throw new Error("Retrieval schedule not found.");
    const schedule = { ...snapshot.data(), id: snapshot.id } as RetrievalSchedule;
    if (schedule.learnerId !== actor.uid) throw new Error("You do not have access to this retrieval schedule.");
    if (schedule.status === "completed") return schedule;
    if (schedule.dueAt > new Date().toISOString()) throw new Error("This retrieval check is not due yet.");

    const evidenceRepository = new FirestoreLearningEvidenceRepository();
    const evidence = await evidenceRepository.listByLearner(actor.uid, schedule.organizationId);
    const freshRetrievalEvidence = evidence.some((item) =>
      item.source.courseId === schedule.courseId
      && item.source.lessonId === schedule.lessonId
      && (item.type === "activity_result" || item.type === "assessment_result")
      && item.observedAt >= schedule.dueAt,
    );
    if (!freshRetrievalEvidence) {
      throw new Error("Complete at least one lesson activity now before finishing this retrieval check.");
    }

    const completed: RetrievalSchedule = {
      ...schedule,
      status: "completed",
      completedAt: new Date().toISOString(),
    };
    await ref.set(completed, { merge: true });

    await evidenceRepository.append({
      id: `learn_${schedule.id}_completed`,
      learnerId: actor.uid,
      organizationId: schedule.organizationId,
      source: { product: "learn", courseId: schedule.courseId, lessonId: schedule.lessonId },
      type: "curriculum_progress",
      observedAt: completed.completedAt!,
      payload: {
        event: "retrieval.completed",
        intervalDays: schedule.intervalDays,
        scheduleId: schedule.id,
        freshEvidenceRequired: true,
      },
      provenance: { method: "system_observed", actorId: actor.uid },
    });
    return completed;
  },

  async getNextAction(actor: AuthenticatedActor): Promise<NextLearningAction> {
    const now = new Date().toISOString();
    const database = getServerFirestore();

    const [scheduleSnapshot, teacherBrief, scopedContext, evidence] = await Promise.all([
      database.collection("retrieval-schedules").where("learnerId", "==", actor.uid).get(),
      latestTeacherRecommendation(actor.uid),
      getScopedLearnerContext({
        actorId: actor.uid,
        learnerId: actor.uid,
        purpose: "learn_adaptive_practice",
        domains: ["recommendation"],
      }),
      new FirestoreLearningEvidenceRepository().listByLearner(actor.uid),
    ]);

    const due = scheduleSnapshot.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }) as RetrievalSchedule)
      .filter((item) => item.status === "scheduled" && item.dueAt <= now)
      .sort((first, second) => first.dueAt.localeCompare(second.dueAt))[0];
    if (due) {
      return {
        kind: "retrieval",
        recommendation: retrievalRecommendation(due),
        scheduleId: due.id,
        dueAt: due.dueAt,
      };
    }

    if (teacherBrief) {
      const recommendation = teacherRecommendationAction(teacherBrief);
      if (recommendation) {
        return {
          kind: "teacher_recommendation",
          recommendation,
          interventionId: teacherBrief.id,
        };
      }
    }

    const mindRecommendation = scopedContext.context.recommendations?.[0];
    if (mindRecommendation) {
      return {
        kind: "mind_recommendation",
        recommendation: mindRecommendation,
      };
    }

    const latestEvidence = evidence.slice().sort((first, second) => second.observedAt.localeCompare(first.observedAt))[0];
    return {
      kind: "continue",
      recommendation: {
        outcome: "continue",
        label: "Continue your curriculum sequence",
        reason: "No delayed retrieval or teacher intervention is currently due.",
        ...(latestEvidence?.source.courseId ? { courseId: latestEvidence.source.courseId } : {}),
        ...(latestEvidence?.source.lessonId ? { lessonId: latestEvidence.source.lessonId } : {}),
      },
    };
  },
};

import type {
  LearnerModel,
  LearningEvidence,
  RetrievalScheduleItem,
  ReturnLoopAction,
  TeacherGuidancePayload,
} from "@lurexa/types";
import { LEARNING_EVIDENCE_CONTRACT_VERSION } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";

export interface TeacherReturnLoopResult {
  reviewId: string;
  learnerId: string;
  status: string;
  retrievalUpdated: boolean;
  persistedAt: string;
}

export class TeacherReturnLoopService {
  /**
   * Persists teacher review guidance and synchronizes the Learner Model's retrieval schedule.
   */
  static async submitTeacherGuidance(
    guidance: TeacherGuidancePayload
  ): Promise<TeacherReturnLoopResult> {
    const firestore = getServerFirestore();
    const now = new Date().toISOString();

    // 1. Persist teacher guidance record
    const guidanceRef = firestore.collection("teacher_guidance").doc(guidance.reviewId);
    await guidanceRef.set({
      ...guidance,
      persistedAt: now,
    });

    // 2. Submit Core LearningEvidence of type teacher_reported
    const evidenceId = `ev_teacher_review_${guidance.reviewId}_${Date.now()}`;
    const evidence: LearningEvidence<TeacherGuidancePayload> = {
      contractVersion: LEARNING_EVIDENCE_CONTRACT_VERSION,
      id: evidenceId,
      learnerId: guidance.learnerId,
      source: {
        product: "teach",
        activityId: guidance.activityId,
        courseId: guidance.courseId,
        lessonId: guidance.lessonId,
      },
      type: "assessment_result",
      observedAt: guidance.reviewedAt,
      dataClassification: "standard",
      payload: guidance,
      provenance: {
        method: "teacher_reported",
        actorId: guidance.teacherId,
        confidence: 1.0,
      },
    };

    await firestore.collection("learning_evidence").doc(evidenceId).set(evidence);

    // 3. Update Learner Model retrieval schedule and active targets
    let retrievalUpdated = false;
    const learnerModelRef = firestore.collection("learner_models").doc(guidance.learnerId);
    const learnerModelDoc = await learnerModelRef.get();

    if (learnerModelDoc.exists) {
      const existingModel = learnerModelDoc.data() as LearnerModel;
      const updatedSchedule = [...(existingModel.retrievalSchedule || [])];

      for (const action of guidance.returnLoopActions || []) {
        for (const competencyId of action.targetCompetencyIds) {
          const existingIndex = updatedSchedule.findIndex((s) => s.competencyId === competencyId);
          const intervalDays = action.suggestedIntervalDays ?? 3;
          const nextDue = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000).toISOString();

          if (existingIndex >= 0) {
            const current = updatedSchedule[existingIndex]!;
            updatedSchedule[existingIndex] = {
              ...current,
              nextReviewDue: nextDue,
              intervalDays,
              repetitionCount: (current.repetitionCount || 0) + 1,
            };
          } else {
            updatedSchedule.push({
              competencyId,
              nextReviewDue: nextDue,
              intervalDays,
              repetitionCount: 1,
              easeFactor: 2.5,
            });
          }
        }
      }

      await learnerModelRef.set(
        {
          retrievalSchedule: updatedSchedule,
          updatedAt: now,
        },
        { merge: true }
      );
      retrievalUpdated = true;
    }

    return {
      reviewId: guidance.reviewId,
      learnerId: guidance.learnerId,
      status: guidance.status,
      retrievalUpdated,
      persistedAt: now,
    };
  }
}

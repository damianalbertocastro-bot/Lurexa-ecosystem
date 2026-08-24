import type {
  CapstoneAssessmentResult,
  CapstoneDecision,
  CapstoneRequirementResult,
  IntegratedCapstoneDefinition,
  LearningEvidence,
  SpokenLearnerEvidencePayload,
} from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";

export interface CapstoneEvaluationInput {
  learnerId: string;
  capstoneId: string;
  evidences: LearningEvidence[];
  evaluatorId?: string;
  isHumanTeacherReview?: boolean;
}

export const A1_INTEGRATED_CAPSTONE_DEFINITION: IntegratedCapstoneDefinition = {
  schemaVersion: "1",
  id: "a1-capstone-my-life",
  programId: "english-a1-foundations",
  levelOrStage: "A1",
  title: "My Life, My English: A1 Synthesis Capstone",
  purpose: "learner_level_exit",
  sections: [
    {
      id: "section-written-dossier",
      title: "Written Personal Dossier",
      mission: "Write a 100-word comprehensive introduction covering yourself, your family, your hometown, and your daily schedule.",
      requirementIds: ["req-a1-write-dossier"],
      lessonId: "a1-capstone-dossier",
    },
    {
      id: "section-oral-presentation",
      title: "Spoken Life Presentation",
      mission: "Deliver a 90-second continuous spoken presentation sharing your personal background and weekly routine.",
      requirementIds: ["req-a1-speak-presentation", "req-a1-phon-intelligibility"],
      lessonId: "a1-capstone-presentation",
    },
    {
      id: "section-oral-defense",
      title: "Interactive Oral Defense",
      mission: "Answer 3 unpredictable spontaneous follow-up questions from the teacher or conversational AI coach.",
      requirementIds: ["req-a1-conv-defense"],
      lessonId: "a1-capstone-defense",
    },
  ],
  evidenceRequirements: [
    {
      id: "req-a1-write-dossier",
      title: "Written Profile Synthesis",
      competencyIds: ["EN.A1.WRITE.SHORT_DESCRIPTION", "EN.A1.VOCAB.PERSONAL_INFO"],
      modes: ["writing"],
      minimumIndependentArtifacts: 1,
      coachEvidenceAllowed: false,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: true,
      criticalForExit: true,
    },
    {
      id: "req-a1-speak-presentation",
      title: "Continuous Spoken Narrative",
      competencyIds: ["EN.A1.SPEAK.INTEGRATED_PRESENTATION", "EN.A1.SPEAK.DESCRIBE_ROUTINE"],
      modes: ["speaking"],
      minimumIndependentArtifacts: 1,
      coachEvidenceAllowed: true,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: true,
      criticalForExit: true,
    },
    {
      id: "req-a1-phon-intelligibility",
      title: "Phonetic Communicative Intelligibility",
      competencyIds: ["EN.A1.PHON.INTELLIGIBILITY_FLUENCY", "EN.A1.PHON.FINAL_CONSONANTS"],
      modes: ["pronunciation"],
      minimumIndependentArtifacts: 1,
      coachEvidenceAllowed: true,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: false,
      criticalForExit: true,
    },
    {
      id: "req-a1-conv-defense",
      title: "Interactive Conversational Defense",
      competencyIds: ["EN.A1.CONV.MULTI_TURN_EXCHANGE", "EN.A1.PRAG.CONFIDENCE_CLARITY"],
      modes: ["interaction"],
      minimumIndependentArtifacts: 1,
      coachEvidenceAllowed: true,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: true,
      criticalForExit: true,
    },
  ],
  delayedRetrievalRequired: true,
  firstAttemptPreserved: true,
  supportedEvidenceDistinguished: true,
  decisionPolicy: {
    allowedDecisions: ["READY", "READY_WITH_TARGETS", "TARGETED_REVALIDATION", "MORE_EVIDENCE_NEEDED"],
    requireAllCriticalRequirements: true,
    allowTargetedRevalidation: true,
    prohibitCompletionOnlyDecision: true,
  },
};

export class CapstoneEvaluatorService {
  /**
   * Evaluates submitted learner evidence against the A1 Capstone criteria.
   */
  static async evaluateCapstone(
    input: CapstoneEvaluationInput
  ): Promise<CapstoneAssessmentResult> {
    const now = new Date().toISOString();
    const definition = A1_INTEGRATED_CAPSTONE_DEFINITION;
    const requirementResults: CapstoneRequirementResult[] = [];
    const targetedCompetencyIds: string[] = [];

    let criticalRequirementsMet = true;

    for (const req of definition.evidenceRequirements) {
      // Find matching evidence by competency or activity
      const matchingEvidence = input.evidences.filter((e) => {
        const payload = e.payload as Record<string, unknown>;
        const compIds = Array.isArray(payload?.targetCompetencyIds)
          ? (payload.targetCompetencyIds as string[])
          : [];
        return compIds.some((cid) => req.competencyIds.includes(cid)) || e.type.includes(req.modes[0] || "");
      });

      const independentEvidenceCount = matchingEvidence.length;
      let score = 0;

      if (independentEvidenceCount > 0) {
        // Average intelligibility / correctness score
        const scores = matchingEvidence.map((e) => {
          const payload = e.payload as SpokenLearnerEvidencePayload;
          if (typeof payload?.intelligibilityScore === "number") return payload.intelligibilityScore;
          if (typeof (e.payload as Record<string, unknown>)?.correct === "boolean") {
            return (e.payload as Record<string, unknown>).correct ? 1.0 : 0.4;
          }
          return 0.8;
        });
        score = scores.reduce((a, b) => a + b, 0) / scores.length;
      }

      const satisfied = independentEvidenceCount >= req.minimumIndependentArtifacts && score >= 0.70;

      if (!satisfied && req.criticalForExit) {
        criticalRequirementsMet = false;
        targetedCompetencyIds.push(...req.competencyIds);
      }

      requirementResults.push({
        requirementId: req.id,
        competencyIds: req.competencyIds,
        independentEvidenceCount,
        supportedEvidenceCount: 0,
        satisfied,
        confidence: independentEvidenceCount > 0 ? 0.85 : 0.2,
        evidenceIds: matchingEvidence.map((e) => e.id),
      });
    }

    let decision: CapstoneDecision;
    let rationale: string;

    if (criticalRequirementsMet) {
      if (targetedCompetencyIds.length === 0) {
        decision = "READY";
        rationale = "Learner has successfully demonstrated independent A1 communicative competence across oral presentation, written synthesis, and conversational defense.";
      } else {
        decision = "READY_WITH_TARGETS";
        rationale = `Learner has demonstrated communicative exit readiness with specific practice targets transferred: ${targetedCompetencyIds.slice(0, 2).join(", ")}.`;
      }
    } else if (requirementResults.some((r) => r.independentEvidenceCount === 0)) {
      decision = "MORE_EVIDENCE_NEEDED";
      rationale = "One or more required capstone synthesis tasks have not been submitted.";
    } else {
      decision = "TARGETED_REVALIDATION";
      rationale = `Targeted revalidation recommended for: ${targetedCompetencyIds.slice(0, 2).join(", ")}.`;
    }

    const result: CapstoneAssessmentResult = {
      capstoneId: input.capstoneId,
      learnerId: input.learnerId,
      decision,
      evaluatedAt: now,
      requirementResults,
      targetedCompetencyIds,
      rationale,
      provenance: {
        method: input.isHumanTeacherReview ? "teacher_validated" : "system_interpreted",
        actorId: input.evaluatorId || "lurexa-mind-capstone-engine",
      },
    };

    // Persist result in Core
    const firestore = getServerFirestore();
    await firestore.collection("capstone_assessments").doc(`${input.learnerId}_${input.capstoneId}`).set(result);

    return result;
  }
}

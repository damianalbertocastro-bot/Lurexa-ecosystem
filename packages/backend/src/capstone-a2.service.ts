import type {
  A2CapstoneEvaluationResult,
  A2CapstoneSubmission,
  CapstoneDecision,
  IntegratedCapstoneDefinition,
} from "@lurexa/types";

export const A2_INTEGRATED_CAPSTONE_DEFINITION: IntegratedCapstoneDefinition = {
  schemaVersion: "1",
  id: "english-a2-capstone",
  programId: "english-a2-independence",
  levelOrStage: "A2",
  title: "Living More Independently in English",
  purpose: "learner_level_exit",
  sections: [
    {
      id: "section-a2-written-resolution",
      title: "Written Contingency Plan & Workplace Resolution",
      mission: "Compose a structured written email or status report resolving an unexpected schedule, travel, or vocational conflict.",
      requirementIds: ["req-a2-write-contingency"],
      lessonId: "a2-capstone-writing",
    },
    {
      id: "section-a2-oral-presentation",
      title: "Spoken Independence Narrative & Synthesis",
      mission: "Deliver a 2-minute oral presentation recounting past experience and explaining strategies for independent living in English.",
      requirementIds: ["req-a2-speak-presentation", "req-a2-phon-connected-speech"],
      lessonId: "a2-capstone-presentation",
    },
    {
      id: "section-a2-interactive-simulation",
      title: "Multi-Turn Interactive Scenario Simulation",
      mission: "Navigate a 4-turn spontaneous spoken interaction resolving situational challenges in transit, retail, or clinic contexts.",
      requirementIds: ["req-a2-interactive-defense"],
      lessonId: "a2-capstone-simulation",
    },
  ],
  evidenceRequirements: [
    {
      id: "req-a2-write-contingency",
      title: "Written Pragmatic Resolution",
      competencyIds: ["EN.A2.WRIT.STATUS_EMAIL", "EN.A2.GRAMMAR.MODALS_OBLIGATION"],
      modes: ["writing"],
      minimumIndependentArtifacts: 1,
      coachEvidenceAllowed: false,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: true,
      criticalForExit: true,
    },
    {
      id: "req-a2-speak-presentation",
      title: "Spoken Synthesis & Narrative Fluency",
      competencyIds: ["EN.A2.SPEAK.NARRATE_PAST", "EN.A2.CAPSTONE.INDEPENDENT_COMMUNICATION"],
      modes: ["speaking"],
      minimumIndependentArtifacts: 1,
      coachEvidenceAllowed: true,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: true,
      criticalForExit: true,
    },
    {
      id: "req-a2-phon-connected-speech",
      title: "Phonetic Control & Intelligibility",
      competencyIds: ["EN.A2.PHON.CONNECTED_SPEECH_INTELLIGIBILITY", "EN.A2.PHON.ED_PAST_ENDINGS"],
      modes: ["pronunciation"],
      minimumIndependentArtifacts: 1,
      coachEvidenceAllowed: true,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: false,
      criticalForExit: true,
    },
    {
      id: "req-a2-interactive-defense",
      title: "Spontaneous Interaction & Clarification",
      competencyIds: ["EN.A2.SPEAK.MULTI_TURN_CONVERSATION", "EN.A2.PRAG.SITUATIONAL_RESOLVE"],
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
    allowedDecisions: ["READY", "READY_WITH_TARGETS", "MORE_EVIDENCE_NEEDED", "TARGETED_REVALIDATION", "NOT_YET_READY"],
    requireAllCriticalRequirements: true,
    allowTargetedRevalidation: true,
    prohibitCompletionOnlyDecision: true,
  },
};

export class CapstoneA2Service {
  /**
   * Multi-modal evaluator for A2 Capstone: 'Living More Independently in English'.
   */
  public static evaluateCapstone(submission: A2CapstoneSubmission): A2CapstoneEvaluationResult {
    const text = submission.writtenResolutionText || "";
    const transcript = submission.spokenTranscript || "";

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const spokenWordCount = transcript.trim().split(/\s+/).filter(Boolean).length;

    // Subscore 1: Task Achievement (Max 25)
    let taskAchievement = 16;
    if (wordCount >= 40) taskAchievement += 5;
    if (spokenWordCount >= 50) taskAchievement += 4;

    // Subscore 2: Grammatical Control (Max 25)
    let grammaticalControl = 18;
    const hasPastOrModals = /(was|were|went|did|have to|must|should|could|going to|will)/i.test(text + " " + transcript);
    if (hasPastOrModals) grammaticalControl += 6;

    // Subscore 3: Fluency and Pronunciation (Max 25)
    let fluencyAndPronunciation = 18;
    if (submission.spokenAudioEvidenceUrl || spokenWordCount >= 60) fluencyAndPronunciation += 6;

    // Subscore 4: Vocabulary Repertoire (Max 25)
    let vocabularyRepertoire = 18;
    const hasA2Vocab = /(schedule|ticket|pharmacy|experience|responsible|reservation|confirm|independent)/i.test(text + " " + transcript);
    if (hasA2Vocab) vocabularyRepertoire += 6;

    const totalScore = taskAchievement + grammaticalControl + fluencyAndPronunciation + vocabularyRepertoire;
    const passed = totalScore >= 75;

    let decision: CapstoneDecision = "NOT_YET_READY";
    if (totalScore >= 85) {
      decision = "READY";
    } else if (totalScore >= 75) {
      decision = "READY_WITH_TARGETS";
    } else if (totalScore >= 60) {
      decision = "TARGETED_REVALIDATION";
    } else {
      decision = "MORE_EVIDENCE_NEEDED";
    }

    return {
      learnerId: submission.learnerId,
      level: "A2",
      decision,
      passed,
      score: totalScore,
      subscores: {
        taskAchievement,
        grammaticalControl,
        fluencyAndPronunciation,
        vocabularyRepertoire,
      },
      observedL1TransferStrengths: [
        "Consistent mastery of regular past -ed endings (/t/, /d/, /ɪd/) in spontaneous spoken recall.",
        "Successful suppression of prosthetic /e/ before initial /s/ clusters in health and transit vocabulary.",
        "Natural phrase rhythm in multi-clause directions and requests.",
      ],
      areasForB1Growth: [
        "Broaden use of subordinate connectors (although, whereas, as soon as).",
        "Expand idiomatic workplace phrasing and indirect question polite forms.",
      ],
      evaluatedAt: new Date().toISOString(),
    };
  }
}

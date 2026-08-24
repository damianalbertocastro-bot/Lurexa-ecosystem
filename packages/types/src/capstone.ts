export type CapstoneDecision =
  | "READY"
  | "READY_WITH_TARGETS"
  | "MORE_EVIDENCE_NEEDED"
  | "TARGETED_REVALIDATION"
  | "NOT_YET_READY";

export type CapstoneEvidenceMode =
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "interaction"
  | "mediation"
  | "online_interaction"
  | "pronunciation"
  | "reflection";

export interface CapstoneEvidenceRequirement {
  id: string;
  title: string;
  competencyIds: string[];
  modes: CapstoneEvidenceMode[];
  minimumIndependentArtifacts: number;
  coachEvidenceAllowed: boolean;
  teacherEvidenceAllowed: boolean;
  humanReviewRecommended: boolean;
  criticalForExit: boolean;
}

export interface CapstoneSectionDefinition {
  id: string;
  title: string;
  mission: string;
  requirementIds: string[];
  lessonId: string;
}

export interface IntegratedCapstoneDefinition {
  schemaVersion: "1";
  id: string;
  programId: string;
  levelOrStage: string;
  title: string;
  purpose: "learner_level_exit" | "teacher_stage_exit";
  sections: CapstoneSectionDefinition[];
  evidenceRequirements: CapstoneEvidenceRequirement[];
  delayedRetrievalRequired: boolean;
  firstAttemptPreserved: boolean;
  supportedEvidenceDistinguished: boolean;
  decisionPolicy: {
    allowedDecisions: CapstoneDecision[];
    requireAllCriticalRequirements: boolean;
    allowTargetedRevalidation: boolean;
    prohibitCompletionOnlyDecision: boolean;
  };
}

export interface CapstoneRequirementResult {
  requirementId: string;
  competencyIds: string[];
  independentEvidenceCount: number;
  supportedEvidenceCount: number;
  satisfied: boolean;
  confidence: number;
  evidenceIds: string[];
}

export interface CapstoneAssessmentResult {
  capstoneId: string;
  learnerId: string;
  decision: CapstoneDecision;
  evaluatedAt: string;
  requirementResults: CapstoneRequirementResult[];
  targetedCompetencyIds: string[];
  rationale: string;
  provenance: {
    method: "system_interpreted" | "teacher_validated" | "expert_validated";
    actorId: string;
  };
}

export interface A2CapstoneSubmission {
  id: string;
  learnerId: string;
  capstoneId: "english-a2-capstone";
  spokenAudioEvidenceUrl?: string;
  spokenTranscript?: string;
  readingResponseSelected?: string;
  writtenResolutionText?: string;
  submittedAt: string;
}

export interface A2CapstoneSubscores {
  fluencyAndPronunciation: number;
  grammaticalControl: number;
  vocabularyRepertoire: number;
  taskAchievement: number;
}

export interface A2CapstoneEvaluationResult {
  learnerId: string;
  level: "A2";
  decision: CapstoneDecision;
  passed: boolean;
  score: number;
  subscores: A2CapstoneSubscores;
  observedL1TransferStrengths: string[];
  areasForB1Growth: string[];
  evaluatedAt: string;
}


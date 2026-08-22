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

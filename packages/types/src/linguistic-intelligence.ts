import type { CefrLevel, LearnerPattern } from "./learner";

export type LinguisticDomain =
  | "pronunciation"
  | "grammar"
  | "vocabulary"
  | "naturalness"
  | "pragmatics"
  | "fluency"
  | "listening"
  | "discourse"
  | "orthography";

export type CoachTaskMode =
  | "controlled_accuracy"
  | "guided_practice"
  | "guided_conversation"
  | "fluency_conversation"
  | "pronunciation_focus"
  | "assessment"
  | "free_production"
  | "professional_communication"
  | "academic_communication";

export type CommunicativeImpact = "CI0" | "CI1" | "CI2" | "CI3";

export type LearnerRecurrenceState =
  | "R0_SINGLE_OBSERVATION"
  | "R1_REPEATED_SAME_SESSION"
  | "R2_REPEATED_ACROSS_SESSIONS"
  | "R3_STABLE_RECURRING_PATTERN"
  | "R4_IMPROVING"
  | "R5_NOT_RECENTLY_OBSERVED"
  | "R6_REVALIDATION_NEEDED";

export type CoachInterventionAction =
  | "observe_only"
  | "recast"
  | "clarification_request"
  | "elicit_self_correction"
  | "explicit_correction"
  | "brief_explanation"
  | "model_and_repeat"
  | "retry_segment"
  | "delayed_feedback"
  | "targeted_micropractice"
  | "schedule_review";

export type CoachInterventionTiming =
  | "immediate"
  | "after_turn"
  | "after_segment"
  | "after_task"
  | "future_review"
  | "none";

export interface LinguisticPatternContext extends LearnerPattern {
  patternId?: string;
  communicativeImpact?: CommunicativeImpact;
  recurrence?: LearnerRecurrenceState;
  isCurrentTarget?: boolean;
  lastCorrectedAt?: string;
  successfulSelfCorrections?: number;
  successfulPromptedRetries?: number;
  spontaneousSuccesses?: number;
}

export interface CoachLinguisticContext {
  learnerId: string;
  cefr?: CefrLevel;
  taskMode: CoachTaskMode;
  sessionGoal?: "accuracy" | "fluency" | "pronunciation" | "conversation" | "assessment";
  activeTargets?: string[];
  recurringPatterns?: LinguisticPatternContext[];
  pronunciationPriorities?: LinguisticPatternContext[];
  vocabularyRetrievalTargets?: string[];
  recentCorrectionPatternIds?: string[];
  l1Profile?: {
    language: string;
    variety?: string;
    useForTransferHypotheses: boolean;
  };
}

export interface CoachObservationInput {
  patternId?: string;
  domain: LinguisticDomain;
  learnerForm?: string;
  intendedMeaning?: string;
  communicativeImpact: CommunicativeImpact;
  communicationBreakdown: boolean;
  currentTarget: boolean;
  recurrence?: LearnerRecurrenceState;
  learnerSelfCorrected?: boolean;
  likelySelfCorrectable?: boolean;
  acceptableVariation?: boolean;
  pronunciationIntelligibilityRisk?: boolean;
  pragmaticRisk?: boolean;
}

export interface CoachInterventionDecision {
  action: CoachInterventionAction;
  timing: CoachInterventionTiming;
  priority: 0 | 1 | 2 | 3 | 4;
  reason:
    | "acceptable_variation"
    | "communication_breakdown"
    | "current_target"
    | "high_impact"
    | "recurring_pattern"
    | "self_corrected"
    | "fluency_protection"
    | "low_value_isolated_error";
  shouldCreateEvidence: boolean;
  shouldRequestRetry: boolean;
}

export interface LinguisticEvidencePayload {
  patternId?: string;
  domain: LinguisticDomain;
  learnerForm?: string;
  intendedMeaning?: string;
  communicativeImpact: CommunicativeImpact;
  recurrence?: LearnerRecurrenceState;
  taskMode: CoachTaskMode;
  intervention?: CoachInterventionAction;
  correctionTiming?: CoachInterventionTiming;
  selfCorrected?: boolean;
  retrySuccessful?: boolean;
  laterSpontaneousSuccess?: boolean;
}

export interface LinguisticPatternAggregate {
  patternId: string;
  domain: LinguisticDomain;
  observationCount: number;
  sessionCount: number;
  selfCorrectionCount: number;
  successfulRetryCount: number;
  spontaneousSuccessCount: number;
  lastObservedAt: string;
  recurrence: LearnerRecurrenceState;
  confidence: number;
}

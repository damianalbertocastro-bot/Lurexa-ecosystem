import type {
  CefrLevel,
  CoachInterventionAction,
  CoachInterventionDecision,
  CoachInterventionTiming,
  CoachLinguisticContext,
  CoachObservationInput,
  CoachTaskMode,
  LearnerRecurrenceState,
} from "@lurexa/types";

const FLUENCY_MODES: CoachTaskMode[] = [
  "fluency_conversation",
  "free_production",
  "guided_conversation",
];

const RECURRING_STATES: LearnerRecurrenceState[] = [
  "R1_REPEATED_SAME_SESSION",
  "R2_REPEATED_ACROSS_SESSIONS",
  "R3_STABLE_RECURRING_PATTERN",
  "R6_REVALIDATION_NEEDED",
];

function isBeginner(level?: CefrLevel): boolean {
  return level === "PRE_A1" || level === "A1" || level === "A2";
}

function correctionForLevel(level?: CefrLevel): CoachInterventionAction {
  if (isBeginner(level)) return "model_and_repeat";
  if (level === "B1" || level === "B2") return "elicit_self_correction";
  return "brief_explanation";
}

function timingForTask(taskMode: CoachTaskMode): CoachInterventionTiming {
  if (taskMode === "controlled_accuracy" || taskMode === "pronunciation_focus") {
    return "immediate";
  }
  if (taskMode === "guided_practice") return "after_turn";
  if (taskMode === "guided_conversation") return "after_segment";
  if (taskMode === "assessment") return "after_task";
  if (taskMode === "fluency_conversation" || taskMode === "free_production") {
    return "after_task";
  }
  return "after_segment";
}

/**
 * Mind-side deterministic policy for selecting the next pedagogical response.
 *
 * This service does not persist learner state and does not authorize access.
 * It consumes already-authorized context and returns an intervention decision
 * that a product such as Coach may use when constructing the experience.
 */
export class LinguisticIntelligenceService {
  decideIntervention(
    context: CoachLinguisticContext,
    observation: CoachObservationInput,
  ): CoachInterventionDecision {
    if (observation.acceptableVariation) {
      return {
        action: "observe_only",
        timing: "none",
        priority: 0,
        reason: "acceptable_variation",
        shouldCreateEvidence: false,
        shouldRequestRetry: false,
      };
    }

    if (observation.learnerSelfCorrected) {
      return {
        action: "observe_only",
        timing: "none",
        priority: 1,
        reason: "self_corrected",
        shouldCreateEvidence: true,
        shouldRequestRetry: false,
      };
    }

    if (observation.communicationBreakdown) {
      return {
        action: "clarification_request",
        timing: "immediate",
        priority: 4,
        reason: "communication_breakdown",
        shouldCreateEvidence: true,
        shouldRequestRetry: true,
      };
    }

    const highImpact =
      observation.communicativeImpact === "CI3" ||
      observation.pronunciationIntelligibilityRisk === true ||
      observation.pragmaticRisk === true;

    if (highImpact) {
      return {
        action: correctionForLevel(context.cefr),
        timing: FLUENCY_MODES.includes(context.taskMode) ? "after_turn" : "immediate",
        priority: 3,
        reason: "high_impact",
        shouldCreateEvidence: true,
        shouldRequestRetry: true,
      };
    }

    if (observation.currentTarget) {
      const action = observation.likelySelfCorrectable
        ? "elicit_self_correction"
        : correctionForLevel(context.cefr);
      return {
        action,
        timing: timingForTask(context.taskMode),
        priority: 3,
        reason: "current_target",
        shouldCreateEvidence: true,
        shouldRequestRetry: context.taskMode !== "assessment",
      };
    }

    if (observation.recurrence && RECURRING_STATES.includes(observation.recurrence)) {
      return {
        action:
          context.taskMode === "fluency_conversation"
            ? "delayed_feedback"
            : observation.likelySelfCorrectable
              ? "elicit_self_correction"
              : "targeted_micropractice",
        timing: timingForTask(context.taskMode),
        priority: 2,
        reason: "recurring_pattern",
        shouldCreateEvidence: true,
        shouldRequestRetry: context.taskMode !== "assessment",
      };
    }

    if (FLUENCY_MODES.includes(context.taskMode)) {
      return {
        action: "observe_only",
        timing: "after_task",
        priority: 1,
        reason: "fluency_protection",
        shouldCreateEvidence: true,
        shouldRequestRetry: false,
      };
    }

    return {
      action: "observe_only",
      timing: "none",
      priority: 1,
      reason: "low_value_isolated_error",
      shouldCreateEvidence: true,
      shouldRequestRetry: false,
    };
  }
}

import type {
  CoachLinguisticContext,
  CoachTaskMode,
  EvidenceMethod,
  LearnerContext,
  LearnerPattern,
  LinguisticEvidencePayload,
  LearningEvidence,
  LearningEvidenceSource,
} from "@lurexa/types";

const COACH_DOMAINS = new Set<LearnerPattern["domain"]>([
  "grammar",
  "vocabulary",
  "pronunciation",
  "fluency",
]);

export interface BuildCoachLinguisticContextInput {
  learnerContext: LearnerContext;
  taskMode: CoachTaskMode;
  sessionGoal?: CoachLinguisticContext["sessionGoal"];
  l1Profile?: CoachLinguisticContext["l1Profile"];
}

export interface CreateCoachEvidenceInput {
  id: string;
  learnerId: string;
  organizationId?: string;
  source: LearningEvidenceSource;
  observedAt: string;
  payload: LinguisticEvidencePayload;
  provenance: {
    method: EvidenceMethod;
    confidence?: number;
    actorId?: string;
    modelId?: string;
  };
}

/**
 * Product-boundary adapter for Coach.
 *
 * It minimizes generic learner context to the linguistic fields Coach needs
 * and maps Coach observations back to the shared LearningEvidence contract.
 * It neither authorizes access nor persists data; those remain Core duties.
 */
export class CoachLinguisticAdapterService {
  buildContext(input: BuildCoachLinguisticContextInput): CoachLinguisticContext {
    const recurringPatterns = (input.learnerContext.recurringPatterns ?? [])
      .filter((pattern) => COACH_DOMAINS.has(pattern.domain))
      .map((pattern) => ({ ...pattern }));

    const pronunciationPriorities = recurringPatterns.filter(
      (pattern) => pattern.domain === "pronunciation",
    );

    return {
      learnerId: input.learnerContext.learnerId,
      cefr: input.learnerContext.proficiency?.cefr,
      taskMode: input.taskMode,
      sessionGoal: input.sessionGoal,
      activeTargets: [
        ...(input.learnerContext.activeTargets?.grammar ?? []),
        ...(input.learnerContext.activeTargets?.vocabulary ?? []),
        ...(input.learnerContext.activeTargets?.pronunciation ?? []),
        ...(input.learnerContext.activeTargets?.fluency ?? []),
      ],
      recurringPatterns,
      pronunciationPriorities,
      vocabularyRetrievalTargets:
        input.learnerContext.activeTargets?.vocabulary ?? [],
      l1Profile: input.l1Profile,
    };
  }

  createEvidence(input: CreateCoachEvidenceInput): LearningEvidence<LinguisticEvidencePayload> {
    const hasActiveCorrection =
      input.payload.intervention !== undefined &&
      input.payload.intervention !== "observe_only";

    return {
      id: input.id,
      learnerId: input.learnerId,
      organizationId: input.organizationId,
      source: input.source,
      type: hasActiveCorrection ? "correction_outcome" : "language_error",
      observedAt: input.observedAt,
      payload: input.payload,
      provenance: input.provenance,
    };
  }
}

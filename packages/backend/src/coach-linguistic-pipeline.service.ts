import type {
  CoachInterventionDecision,
  CoachLinguisticContext,
  CoachObservationInput,
  CoachTaskMode,
  EvidenceMethod,
  LinguisticEvidencePayload,
  LearningEvidence,
  LearningEvidenceSource,
} from "@lurexa/types";
import type { LearnerModelService } from "./learner-model.service";
import { CoachLinguisticAdapterService } from "./coach-linguistic-adapter.service";
import { LinguisticIntelligenceService } from "./linguistic-intelligence.service";

export interface PrepareCoachLinguisticSessionInput {
  learnerId: string;
  organizationId?: string;
  taskMode: CoachTaskMode;
  sessionGoal?: CoachLinguisticContext["sessionGoal"];
  l1Profile?: CoachLinguisticContext["l1Profile"];
}

export interface RecordCoachLinguisticObservationInput {
  evidenceId: string;
  learnerId: string;
  organizationId?: string;
  source: LearningEvidenceSource;
  observedAt: string;
  context: CoachLinguisticContext;
  observation: CoachObservationInput;
  retrySuccessful?: boolean;
  laterSpontaneousSuccess?: boolean;
  provenance: {
    method: EvidenceMethod;
    confidence?: number;
    actorId?: string;
    modelId?: string;
  };
}

export interface RecordedCoachObservation {
  decision: CoachInterventionDecision;
  evidence?: LearningEvidence<LinguisticEvidencePayload>;
}

/**
 * Orchestrates the Coach linguistic loop through existing Core boundaries.
 *
 * Authorization and persistence are delegated to LearnerModelService.
 * Pedagogical intervention selection is delegated to Mind-side policy.
 */
export class CoachLinguisticPipelineService {
  constructor(
    private readonly learnerModel: LearnerModelService,
    private readonly adapter = new CoachLinguisticAdapterService(),
    private readonly intelligence = new LinguisticIntelligenceService(),
  ) {}

  async prepareSession(
    input: PrepareCoachLinguisticSessionInput,
  ): Promise<CoachLinguisticContext> {
    const learnerContext = await this.learnerModel.getContext({
      contractVersion: "1",
      learnerId: input.learnerId,
      organizationId: input.organizationId,
      requestingProduct: "coach",
      purpose: "coach_session_adaptation",
      domains: [
        "proficiency",
        "curriculum",
        "grammar",
        "vocabulary",
        "pronunciation",
        "fluency",
        "goal",
      ],
    });

    return this.adapter.buildContext({
      learnerContext,
      taskMode: input.taskMode,
      sessionGoal: input.sessionGoal,
      l1Profile: input.l1Profile,
    });
  }

  decide(
    context: CoachLinguisticContext,
    observation: CoachObservationInput,
  ): CoachInterventionDecision {
    return this.intelligence.decideIntervention(context, observation);
  }

  async recordObservation(
    input: RecordCoachLinguisticObservationInput,
  ): Promise<RecordedCoachObservation> {
    const decision = this.decide(input.context, input.observation);

    if (!decision.shouldCreateEvidence) {
      return { decision };
    }

    const payload: LinguisticEvidencePayload = {
      patternId: input.observation.patternId,
      domain: input.observation.domain,
      learnerForm: input.observation.learnerForm,
      intendedMeaning: input.observation.intendedMeaning,
      communicativeImpact: input.observation.communicativeImpact,
      recurrence: input.observation.recurrence,
      taskMode: input.context.taskMode,
      intervention: decision.action,
      correctionTiming: decision.timing,
      selfCorrected: input.observation.learnerSelfCorrected,
      retrySuccessful: input.retrySuccessful,
      laterSpontaneousSuccess: input.laterSpontaneousSuccess,
    };

    const evidence = this.adapter.createEvidence({
      id: input.evidenceId,
      learnerId: input.learnerId,
      organizationId: input.organizationId,
      source: input.source,
      observedAt: input.observedAt,
      payload,
      provenance: input.provenance,
    });

    const persistedEvidence = await this.learnerModel.submitEvidence({ evidence });
    return { decision, evidence: persistedEvidence };
  }
}

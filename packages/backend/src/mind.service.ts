import type {
  CandidateDerivedObservation,
  LearnerPattern,
  LearnerRecommendationAction,
  LearningEvidence,
  MindInterpretationRequestV1,
  MindInterpretationResultV1,
  SpokenLearnerEvidencePayload,
} from "@lurexa/types";
import {
  DERIVED_OBSERVATION_CONTRACT_VERSION,
  MIND_INTERPRETATION_CONTRACT_VERSION,
} from "@lurexa/types";

export interface MindAdaptationConfig {
  modelPolicyVersion: string;
  ruleVersion: string;
  enableL1TransferInference: boolean;
  minIntelligibilityThreshold: number; // e.g. 0.70
}

const DEFAULT_MIND_CONFIG: MindAdaptationConfig = {
  modelPolicyVersion: "mind-prod-2026.08",
  ruleVersion: "lurexa-pedagogical-blueprint-v1",
  enableL1TransferInference: true,
  minIntelligibilityThreshold: 0.70,
};

function generateDeterministicId(prefix: string, parts: (string | undefined)[]): string {
  const cleanParts = parts.filter(Boolean).join("_").replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${prefix}_${cleanParts}`;
}

export class MindService {
  constructor(private readonly config: MindAdaptationConfig = DEFAULT_MIND_CONFIG) {}

  /**
   * Main entrypoint for authorized Core-governed evidence interpretation.
   */
  async interpret(request: MindInterpretationRequestV1): Promise<MindInterpretationResultV1> {
    if (request.contractVersion !== MIND_INTERPRETATION_CONTRACT_VERSION) {
      throw new Error(`Unsupported Mind interpretation contract version: ${request.contractVersion}`);
    }

    if (request.purpose !== "mind_learning_interpretation") {
      throw new Error("Mind interpretation requires an authorized Core purpose.");
    }

    const { learnerId, organizationId, evidence } = request.input;

    // Security & boundary checks
    for (const item of evidence) {
      if (item.learnerId !== learnerId) {
        throw new Error("Authorized Mind evidence must match the requested learner ID.");
      }
      if (organizationId && item.organizationId && item.organizationId !== organizationId) {
        throw new Error("Evidence crosses organization tenant boundaries.");
      }
    }

    const outputs: CandidateDerivedObservation[] = [];
    const requestedTypes = new Set(request.interpretationTypes);

    if (requestedTypes.has("recommendation")) {
      const recommendations = this.generateAdaptiveRecommendations(learnerId, organizationId, evidence);
      outputs.push(...recommendations);
    }

    if (requestedTypes.has("candidate_observation")) {
      const observations = this.generateLinguisticObservations(learnerId, organizationId, evidence);
      outputs.push(...observations);
    }

    if (requestedTypes.has("adaptation_guidance")) {
      const guidance = this.generateAdaptationGuidance(learnerId, organizationId, evidence);
      outputs.push(...guidance);
    }

    if (requestedTypes.has("feedback_plan")) {
      const feedbackPlans = this.generateFeedbackPlans(learnerId, organizationId, evidence);
      outputs.push(...feedbackPlans);
    }

    return {
      contractVersion: MIND_INTERPRETATION_CONTRACT_VERSION,
      interpretationId: request.requestId,
      learnerId,
      generatedAt: new Date().toISOString(),
      purpose: request.purpose,
      outputs,
      limitations: outputs.length > 0
        ? ["Interpretations are adaptive guidance based on authorized historical evidence and require continuous validation."]
        : ["Insufficient evidence available to formulate reliable pedagogical interpretations."],
      modelPolicyVersion: request.modelPolicyVersion || this.config.modelPolicyVersion,
    };
  }

  /**
   * Generate pedagogical next-step recommendations from learning evidence.
   */
  private generateAdaptiveRecommendations(
    learnerId: string,
    organizationId: string | undefined,
    evidence: LearningEvidence[]
  ): CandidateDerivedObservation[] {
    const observations: CandidateDerivedObservation[] = [];
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const spokenEvidences = evidence.filter(
      (e) => e.type === "pronunciation_observation" || e.type === "fluency_observation"
    );

    if (spokenEvidences.length >= 2) {
      const lowIntelligibilitySamples = spokenEvidences.filter((e) => {
        const payload = e.payload as SpokenLearnerEvidencePayload;
        return typeof payload?.intelligibilityScore === "number" && payload.intelligibilityScore < this.config.minIntelligibilityThreshold;
      });

      if (lowIntelligibilitySamples.length >= 2) {
        const evidenceIds = lowIntelligibilitySamples.map((e) => e.id);
        const observationId = generateDeterministicId("obs_spoken_focus", [learnerId, organizationId, Date.now().toString()]);

        const action: LearnerRecommendationAction = {
          outcome: "targeted_practice",
          label: "Targeted Pronunciation & Intelligibility Practice",
          reason: "Multiple spoken practice turns indicate recurring pronunciation friction. Targeted acoustic practice recommended before moving forward.",
          activityId: (lowIntelligibilitySamples[0]?.payload as SpokenLearnerEvidencePayload)?.activityId,
          competencyIds: (lowIntelligibilitySamples[0]?.payload as SpokenLearnerEvidencePayload)?.targetCompetencyIds ?? [],
        };

        observations.push({
          contractVersion: DERIVED_OBSERVATION_CONTRACT_VERSION,
          observationId,
          learnerId,
          organizationId,
          type: "recommendation",
          status: "candidate",
          domain: "pronunciation",
          summary: "Targeted pronunciation and intelligibility reinforcement recommended.",
          confidence: 0.84,
          basedOnEvidenceIds: evidenceIds,
          data: {
            kind: "recommendation",
            actions: [action.label],
            recommendations: [action],
            interpretationVersion: this.config.ruleVersion,
          },
          generatedAt: now,
          effectiveAt: now,
          expiresAt,
          generatedBy: {
            capability: "lurexa-mind-adaptation-engine",
            modelPolicyVersion: this.config.modelPolicyVersion,
            ruleVersion: this.config.ruleVersion,
          },
          limitations: ["Recommendation optimizes for communicative intelligibility rather than accent erasure."],
          scope: {
            purposes: ["coach_session_adaptation", "learn_adaptive_practice"],
            products: ["coach", "learn"],
          },
          reviewStatus: "automated_approved",
          provenance: { method: "hybrid" },
        });
      }
    }

    return observations;
  }

  /**
   * Identifies recurring Dominican Spanish -> English linguistic transfer patterns.
   */
  private generateLinguisticObservations(
    learnerId: string,
    organizationId: string | undefined,
    evidence: LearningEvidence[]
  ): CandidateDerivedObservation[] {
    const observations: CandidateDerivedObservation[] = [];
    const now = new Date().toISOString();

    const spokenEvidences = evidence.filter((e) => e.type === "pronunciation_observation");
    const detectedPatterns = new Map<string, string[]>();

    for (const item of spokenEvidences) {
      const payload = item.payload as SpokenLearnerEvidencePayload;
      if (Array.isArray(payload?.l1TransferPatternsDetected)) {
        for (const pattern of payload.l1TransferPatternsDetected) {
          const list = detectedPatterns.get(pattern) ?? [];
          list.push(item.id);
          detectedPatterns.set(pattern, list);
        }
      }
    }

    for (const [patternKey, evidenceIds] of detectedPatterns.entries()) {
      if (evidenceIds.length >= 2) {
        const observationId = generateDeterministicId("obs_l1_transfer", [learnerId, patternKey]);
        const pattern: LearnerPattern = {
          id: patternKey,
          domain: "pronunciation",
          summary: `Observed Dominican Spanish L1 phonetic transfer pattern: ${patternKey}.`,
          confidence: Math.min(0.92, 0.70 + evidenceIds.length * 0.05),
          updatedAt: now,
        };

        observations.push({
          contractVersion: DERIVED_OBSERVATION_CONTRACT_VERSION,
          observationId,
          learnerId,
          organizationId,
          type: "candidate_observation",
          status: "candidate",
          domain: "pronunciation",
          summary: pattern.summary,
          confidence: pattern.confidence ?? 0.8,
          basedOnEvidenceIds: evidenceIds,
          data: {
            kind: "recurring_pattern",
            pattern,
          },
          generatedAt: now,
          effectiveAt: now,
          generatedBy: {
            capability: "lurexa-mind-linguistic-transfer-engine",
            modelPolicyVersion: this.config.modelPolicyVersion,
            ruleVersion: this.config.ruleVersion,
          },
          limitations: [
            "Pattern reflects natural L1 transfer. Practice must support communicative clarity without penalizing accent variety.",
          ],
          scope: {
            purposes: ["coach_session_adaptation"],
            products: ["coach"],
          },
          reviewStatus: "automated_approved",
          provenance: { method: "hybrid" },
        });
      }
    }

    return observations;
  }

  /**
   * Generates real-time pedagogical adaptation guidance for Coach or Learn.
   */
  private generateAdaptationGuidance(
    learnerId: string,
    organizationId: string | undefined,
    evidence: LearningEvidence[]
  ): CandidateDerivedObservation[] {
    const observations: CandidateDerivedObservation[] = [];
    const now = new Date().toISOString();

    const observationId = generateDeterministicId("obs_guidance", [learnerId, Date.now().toString()]);
    const evidenceIds = evidence.slice(-5).map((e) => e.id);

    observations.push({
      contractVersion: DERIVED_OBSERVATION_CONTRACT_VERSION,
      observationId,
      learnerId,
      organizationId,
      type: "adaptation_guidance",
      status: "candidate",
      domain: "curriculum",
      summary: "Adaptive scaffolding: Provide phonetic scaffolding with acoustic modeling before open-ended conversational turns.",
      confidence: 0.85,
      basedOnEvidenceIds: evidenceIds,
      generatedAt: now,
      effectiveAt: now,
      generatedBy: {
        capability: "lurexa-mind-scaffolding-engine",
        modelPolicyVersion: this.config.modelPolicyVersion,
        ruleVersion: this.config.ruleVersion,
      },
      limitations: ["Guidance should dynamically reduce as learner fluency and confidence increase."],
      scope: {
        purposes: ["learn_adaptive_practice", "coach_session_adaptation"],
        products: ["learn", "coach"],
      },
      reviewStatus: "automated_approved",
      provenance: { method: "deterministic_rule" },
    });

    return observations;
  }

  /**
   * Generates structured feedback plans for interactive sessions.
   */
  private generateFeedbackPlans(
    learnerId: string,
    organizationId: string | undefined,
    evidence: LearningEvidence[]
  ): CandidateDerivedObservation[] {
    const observations: CandidateDerivedObservation[] = [];
    const now = new Date().toISOString();
    const observationId = generateDeterministicId("obs_feedback_plan", [learnerId, Date.now().toString()]);
    const evidenceIds = evidence.slice(-3).map((e) => e.id);

    observations.push({
      contractVersion: DERIVED_OBSERVATION_CONTRACT_VERSION,
      observationId,
      learnerId,
      organizationId,
      type: "feedback_plan",
      status: "candidate",
      domain: "fluency",
      summary: "Feedback sequence: 1. Positive communicative reinforcement -> 2. Contrastive acoustic replay -> 3. Immediate retry in context.",
      confidence: 0.90,
      basedOnEvidenceIds: evidenceIds,
      generatedAt: now,
      effectiveAt: now,
      generatedBy: {
        capability: "lurexa-mind-pedagogy-engine",
        modelPolicyVersion: this.config.modelPolicyVersion,
        ruleVersion: this.config.ruleVersion,
      },
      limitations: ["Focus corrective interventions on high communicative impact errors only."],
      scope: {
        purposes: ["coach_session_adaptation"],
        products: ["coach"],
      },
      reviewStatus: "automated_approved",
      provenance: { method: "deterministic_rule" },
    });

    return observations;
  }
}

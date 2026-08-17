import type {
  LearnerInterpretationRequest,
  LearnerInterpretationResult,
} from "@lurexa/types";

/**
 * Product-agnostic contract for Lurexa Mind interpretation.
 *
 * Implementations interpret authorized evidence and return derived learning
 * intelligence. They do not own authentication or authoritative persistence.
 */
export interface LearningIntelligenceService {
  interpretLearnerEvidence(
    request: LearnerInterpretationRequest,
  ): Promise<LearnerInterpretationResult>;
}

import type {
  LearnerInterpretationRequest,
  LearnerInterpretationResult,
  MindInterpretationRequestV1,
  MindInterpretationResultV1,
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

/**
 * Server-only Mind interface. Callers must obtain its evidence/context input
 * through Core; it is not a browser or provider-facing contract.
 */
export interface AuthorizedLearningIntelligenceService {
  interpretAuthorizedEvidence(
    request: MindInterpretationRequestV1,
  ): Promise<MindInterpretationResultV1>;
}

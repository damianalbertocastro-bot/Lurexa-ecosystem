import type {
  ApprovedDerivedObservation,
  CandidateDerivedObservation,
  LearnerContext,
  LearnerContextRequest,
  LearnerInsight,
  LearnerInsightSubmission,
  LearningEvidence,
  LearningEvidenceSubmission,
} from "@lurexa/types";

export interface LearnerModelAuthorization {
  assertCanReadContext(request: LearnerContextRequest): Promise<void>;
  assertCanSubmitEvidence(evidence: LearningEvidence): Promise<void>;
  /** @deprecated Derived learner state must pass the Core candidate-approval gate. */
  assertCanPersistInsight?(insight: LearnerInsight): Promise<void>;
}

export interface LearnerContextProvider {
  buildContext(request: LearnerContextRequest): Promise<LearnerContext>;
}

export interface LearningEvidenceStore {
  append<TPayload = unknown>(
    evidence: LearningEvidence<TPayload>,
  ): Promise<LearningEvidence<TPayload>>;
}

/** @deprecated Kept only as a compatibility shape; direct insight saves are disabled. */
export interface LearnerInsightStore {
  save(insight: LearnerInsight): Promise<LearnerInsight>;
}

export interface DerivedObservationApprovalStore {
  approveAndPersist(input: {
    candidate: CandidateDerivedObservation;
    authorizedEvidenceIds: readonly string[];
    policyId: string;
  }): Promise<ApprovedDerivedObservation>;
}

export interface LearnerModelServiceDependencies {
  authorization: LearnerModelAuthorization;
  contextProvider: LearnerContextProvider;
  evidenceStore: LearningEvidenceStore;
  /** @deprecated Does not grant a persistence path for derived state. */
  insightStore?: LearnerInsightStore;
  derivedObservationStore?: DerivedObservationApprovalStore;
}

/**
 * Core-owned boundary for cross-product learner state.
 *
 * Products may submit observations as evidence and request authorized scoped
 * context. Mind output is only a candidate: Core must validate its evidence
 * basis and approval policy before it becomes active derived learner state.
 */
export class LearnerModelService {
  constructor(private readonly dependencies: LearnerModelServiceDependencies) {}

  async getContext(request: LearnerContextRequest): Promise<LearnerContext> {
    await this.dependencies.authorization.assertCanReadContext(request);
    return this.dependencies.contextProvider.buildContext(request);
  }

  async submitEvidence<TPayload = unknown>(
    submission: LearningEvidenceSubmission<TPayload>,
  ): Promise<LearningEvidence<TPayload>> {
    await this.dependencies.authorization.assertCanSubmitEvidence(submission.evidence);
    return this.dependencies.evidenceStore.append(submission.evidence);
  }

  /**
   * Legacy direct insight persistence is intentionally closed. Keeping this
   * method as an explicit failure makes accidental old integrations fail safe
   * instead of silently bypassing Core's derived-observation policy.
   */
  async submitInsight(_submission: LearnerInsightSubmission): Promise<never> {
    throw new Error("Direct learner insight persistence is disabled. Submit a Mind candidate through Core approval.");
  }

  async approveDerivedObservation(input: {
    candidate: CandidateDerivedObservation;
    authorizedEvidenceIds: readonly string[];
    policyId: string;
  }): Promise<ApprovedDerivedObservation> {
    if (!this.dependencies.derivedObservationStore) {
      throw new Error("A Core derived-observation approval store is required.");
    }
    return this.dependencies.derivedObservationStore.approveAndPersist(input);
  }
}

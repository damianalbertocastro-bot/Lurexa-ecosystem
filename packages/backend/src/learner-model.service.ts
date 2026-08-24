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
  /** @deprecated Derived state must pass the Core candidate-approval gate. */
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

/** @deprecated Compatibility shape only; direct derived-state saves are disabled. */
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
  /** @deprecated Retained only so older dependency wiring still type-checks during migration. */
  insightStore?: LearnerInsightStore;
  derivedObservationStore?: DerivedObservationApprovalStore;
}

/**
 * Core-owned boundary for cross-product learner state.
 *
 * Products submit observations as evidence and request scoped context. Mind
 * output remains candidate state until Core validates its evidence basis and
 * approval policy. This service deliberately performs no learning inference.
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

  /** @deprecated Unsafe legacy entrypoint; deliberately fails closed. */
  async submitInsight(_submission: LearnerInsightSubmission): Promise<never> {
    throw new Error(
      "Direct learner insight persistence is disabled. Submit a Mind candidate through Core approval.",
    );
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

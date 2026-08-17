import type {
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
  assertCanPersistInsight(insight: LearnerInsight): Promise<void>;
}

export interface LearnerContextProvider {
  buildContext(request: LearnerContextRequest): Promise<LearnerContext>;
}

export interface LearningEvidenceStore {
  append<TPayload = unknown>(
    evidence: LearningEvidence<TPayload>,
  ): Promise<LearningEvidence<TPayload>>;
}

export interface LearnerInsightStore {
  save(insight: LearnerInsight): Promise<LearnerInsight>;
}

export interface LearnerModelServiceDependencies {
  authorization: LearnerModelAuthorization;
  contextProvider: LearnerContextProvider;
  evidenceStore: LearningEvidenceStore;
  insightStore: LearnerInsightStore;
}

/**
 * Core-owned boundary for cross-product learner state.
 *
 * Products submit observations as evidence and request scoped context here.
 * Mind-produced insights may be persisted only through the same authorized
 * boundary. This service deliberately does not perform learning inference.
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

  async submitInsight(submission: LearnerInsightSubmission): Promise<LearnerInsight> {
    await this.dependencies.authorization.assertCanPersistInsight(submission.insight);
    return this.dependencies.insightStore.save(submission.insight);
  }
}

import type {
  LearnerInsight,
  LearningEvidence,
} from "@lurexa/types";

export interface LearningEvidenceRepository {
  append<TPayload = unknown>(
    evidence: LearningEvidence<TPayload>,
  ): Promise<LearningEvidence<TPayload>>;
  listByLearner(learnerId: string, organizationId?: string): Promise<LearningEvidence[]>;
}

export interface LearnerInsightRepository {
  save(insight: LearnerInsight): Promise<LearnerInsight>;
  listActiveByLearner(learnerId: string, organizationId?: string): Promise<LearnerInsight[]>;
}

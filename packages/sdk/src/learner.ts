import type {
  LearnerContext,
  LearnerContextRequest,
  LearnerInsight,
  LearnerInsightSubmission,
  LearningEvidence,
  LearningEvidenceSubmission,
} from "@lurexa/types";

export interface LearnerModelService {
  getContext(request: LearnerContextRequest): Promise<LearnerContext>;
  submitEvidence<TPayload = unknown>(
    submission: LearningEvidenceSubmission<TPayload>,
  ): Promise<LearningEvidence<TPayload>>;
  submitInsight(submission: LearnerInsightSubmission): Promise<LearnerInsight>;
}

import type { LearnerDomain, MindInterpretationType } from "@lurexa/types";
import { FirestoreLearnerInsightRepository, FirestoreLearningEvidenceRepository } from "../learner-firestore.server";
import { ConservativeLearningIntelligenceService } from "../mind/learning-intelligence.server";

const defaultInterpretationTypes: MindInterpretationType[] = ["recommendation"];

/**
 * Core-owned orchestration for the evidence -> Mind -> approved observation loop.
 *
 * Core selects the tenant-bounded evidence projection, invokes storage-agnostic
 * Mind intelligence, validates the candidate's evidence basis, and alone owns
 * approval and persistence of derived learner state.
 */
export async function refreshLearnerIntelligence(input: {
  learnerId: string;
  organizationId?: string;
  requestedDomains?: LearnerDomain[];
}): Promise<number> {
  const evidenceRepository = new FirestoreLearningEvidenceRepository();
  const insightRepository = new FirestoreLearnerInsightRepository();
  const intelligence = new ConservativeLearningIntelligenceService();
  const fetchedEvidence = await evidenceRepository.listByLearner(input.learnerId, input.organizationId);
  const evidence = input.organizationId
    ? fetchedEvidence
    : fetchedEvidence.filter((entry) => !entry.organizationId);

  const result = await intelligence.interpretAuthorizedEvidence({
    contractVersion: "1",
    requestId: `mind_refresh_${input.learnerId}_${Date.now()}`,
    purpose: "mind_learning_interpretation",
    interpretationTypes: defaultInterpretationTypes,
    input: {
      learnerId: input.learnerId,
      ...(input.organizationId ? { organizationId: input.organizationId } : {}),
      evidence,
    },
    modelPolicyVersion: "mind-policy-v1",
  });

  await Promise.all(result.outputs.map((candidate) => insightRepository.approveAndPersist({
    candidate,
    authorizedEvidenceIds: evidence.map((entry) => entry.id),
    policyId: "core-derived-observation-v1",
  })));
  return result.outputs.length;
}

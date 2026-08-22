import type { LearnerDomain, MindInterpretationType } from "@lurexa/types";
import { FirestoreLearnerInsightRepository, FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { ConservativeLearningIntelligenceService } from "./mind-learning-intelligence.server";

const defaultInterpretationTypes: MindInterpretationType[] = ["recommendation"];

/**
 * Orchestrates the current evidence -> Mind interpretation -> Core persistence
 * loop. Mind produces insights; Core repositories own persistence.
 *
 * When an organization scope is supplied, only evidence from that scope is
 * interpreted. This prevents institution-specific evidence from being mixed
 * accidentally while still allowing explicitly authorized global learner
 * context in product experiences that support it.
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
  // An omitted organization means an explicitly global interpretation, not a
  // permission to combine institution-scoped evidence from different tenants.
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

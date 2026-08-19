import type { LearnerDomain } from "@lurexa/types";
import { FirestoreLearnerInsightRepository, FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { ConservativeLearningIntelligenceService } from "./mind-learning-intelligence.server";

const defaultDomains: LearnerDomain[] = [
  "grammar",
  "vocabulary",
  "pronunciation",
  "fluency",
  "recommendation",
];

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
  const evidence = await evidenceRepository.listByLearner(input.learnerId, input.organizationId);

  const result = await intelligence.interpretLearnerEvidence({
    learnerId: input.learnerId,
    ...(input.organizationId ? { organizationId: input.organizationId } : {}),
    evidence,
    requestedDomains: input.requestedDomains ?? defaultDomains,
  });

  await Promise.all(result.insights.map((insight) => insightRepository.save(insight)));
  return result.insights.length;
}

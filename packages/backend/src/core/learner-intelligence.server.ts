import type {
  LearnerDomain,
  LearningEvidence,
  MindInterpretationType,
} from "@lurexa/types";
import { FirestoreLearnerInsightRepository, FirestoreLearningEvidenceRepository } from "../learner-firestore.server";
import { MindLearningIntelligenceService } from "../mind/learning-intelligence.server";

function interpretationTypesFor(evidence: LearningEvidence[]): MindInterpretationType[] {
  const requested = new Set<MindInterpretationType>(["recommendation"]);
  if (evidence.some((item) => item.type === "pronunciation_observation" || item.type === "fluency_observation")) {
    requested.add("candidate_observation");
  }
  return [...requested];
}

/**
 * Core-owned orchestration for evidence -> Mind -> approved derived state.
 *
 * Core selects the authorized tenant-bounded evidence projection. Mind receives
 * only that projection and returns candidates. Core then validates every
 * candidate's evidence basis before any derived state becomes active.
 */
export async function refreshLearnerIntelligence(input: {
  learnerId: string;
  organizationId?: string;
  requestedDomains?: LearnerDomain[];
}): Promise<number> {
  const evidenceRepository = new FirestoreLearningEvidenceRepository();
  const insightRepository = new FirestoreLearnerInsightRepository();
  const mind = new MindLearningIntelligenceService();
  const fetchedEvidence = await evidenceRepository.listByLearner(input.learnerId, input.organizationId);

  // An omitted organization is an explicitly global projection. Never mix
  // institution-scoped evidence across tenants into that projection.
  const evidence = input.organizationId
    ? fetchedEvidence.filter((entry) => entry.organizationId === input.organizationId)
    : fetchedEvidence.filter((entry) => !entry.organizationId);

  if (!evidence.length) return 0;

  const result = await mind.interpretAuthorizedEvidence({
    contractVersion: "1",
    requestId: `mind_refresh_${input.learnerId}_${Date.now()}`,
    purpose: "mind_learning_interpretation",
    interpretationTypes: interpretationTypesFor(evidence),
    input: {
      learnerId: input.learnerId,
      ...(input.organizationId ? { organizationId: input.organizationId } : {}),
      evidence,
    },
    modelPolicyVersion: "mind-policy-v1",
  });

  const authorizedEvidenceIds = evidence.map((entry) => entry.id);
  const approved = await Promise.all(result.outputs.map((candidate) => insightRepository.approveAndPersist({
    candidate,
    authorizedEvidenceIds,
    policyId: "core-derived-observation-v1",
  })));

  return approved.length;
}

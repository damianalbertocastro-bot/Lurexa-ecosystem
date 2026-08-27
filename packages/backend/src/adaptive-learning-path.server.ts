import type { AdaptiveLearningPathV1, SignatureProjectionRequestV1 } from "@lurexa/types";
import { getAdaptiveLearningPathProjection } from "./signature-experience.server";
import {
  findGovernedKnowledgeObjectIdsForCompetencies,
  getGovernedKnowledgeObjectById,
} from "./governed-knowledge-object-catalog.server";

/**
 * Governing adapter for Adaptive Path v1. Recommendation competency IDs and
 * Knowledge Object IDs are intentionally different namespaces; only canonical
 * Knowledge Object IDs already present in the governed catalog may cross this
 * presentation boundary.
 */
export async function getGovernedAdaptiveLearningPathProjection(input: {
  actorId: string;
  request: SignatureProjectionRequestV1;
}): Promise<AdaptiveLearningPathV1> {
  const projection = await getAdaptiveLearningPathProjection(input);

  return {
    ...projection,
    nodes: projection.nodes.map((node) => {
      const explicitGovernedIds = node.knowledgeObjectIds.filter((id) => getGovernedKnowledgeObjectById(id) !== null);
      const mappedFromCompetencies = findGovernedKnowledgeObjectIdsForCompetencies(node.knowledgeObjectIds);
      const combined = [...new Set([...explicitGovernedIds, ...mappedFromCompetencies])];

      return {
        ...node,
        knowledgeObjectIds: combined,
      };
    }),
    evidenceBasis: {
      ...projection.evidenceBasis,
      limitations: [
        ...projection.evidenceBasis.limitations,
        "Competency identifiers are not treated as Knowledge Object identifiers unless an explicit governed mapping exists.",
      ],
    },
  };
}

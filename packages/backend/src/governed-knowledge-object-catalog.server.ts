import type { KnowledgeObjectV1 } from "@lurexa/types";
import {
  getKnowledgeObjectById as getCurriculumKnowledgeObjectById,
  listKnowledgeObjects as listCurriculumKnowledgeObjects,
} from "./knowledge-object-catalog.server";
import {
  getKnowledgeObjectIdsForLinguisticPattern,
  getLinguisticKnowledgeObjectById,
  listLinguisticKnowledgeObjects,
  listMappedLinguisticPatternIds,
} from "./linguistic-knowledge-object-catalog.server";

/**
 * Unified governed semantic read boundary. The curriculum catalog remains the
 * canonical owner of curriculum-linked objects while the linguistic extension
 * owns Dominican/Spanish-transfer semantics. Consumers should use this adapter
 * when either source may be relevant.
 */
export function getGovernedKnowledgeObjectById(id: string): KnowledgeObjectV1 | null {
  return getCurriculumKnowledgeObjectById(id) ?? getLinguisticKnowledgeObjectById(id);
}

export function listGovernedKnowledgeObjects(): KnowledgeObjectV1[] {
  const byId = new Map<string, KnowledgeObjectV1>();
  for (const entry of listCurriculumKnowledgeObjects()) byId.set(entry.id, entry);
  for (const entry of listLinguisticKnowledgeObjects()) if (!byId.has(entry.id)) byId.set(entry.id, entry);
  return [...byId.values()];
}

export {
  getKnowledgeObjectIdsForLinguisticPattern,
  listMappedLinguisticPatternIds,
};

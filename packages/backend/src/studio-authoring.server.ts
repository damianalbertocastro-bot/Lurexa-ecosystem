import type { StudioKnowledgeObjectDraftV1, CefrLevel } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";

const KNOWLEDGE_OBJECT_COLLECTION = "knowledge-objects";

export async function persistKnowledgeObjectToCore(
  draft: StudioKnowledgeObjectDraftV1
): Promise<void> {
  const database = getServerFirestore();
  await database.collection(KNOWLEDGE_OBJECT_COLLECTION).doc(draft.id).set(draft, { merge: true });
}

export async function fetchKnowledgeObjectFromCore(
  id: string
): Promise<StudioKnowledgeObjectDraftV1 | null> {
  const database = getServerFirestore();
  const snapshot = await database.collection(KNOWLEDGE_OBJECT_COLLECTION).doc(id).get();
  if (!snapshot.exists) return null;
  return snapshot.data() as StudioKnowledgeObjectDraftV1;
}

export async function listCoreKnowledgeObjects(filter?: {
  cefrLevel?: CefrLevel;
  status?: string;
}): Promise<StudioKnowledgeObjectDraftV1[]> {
  const database = getServerFirestore();
  let query: FirebaseFirestore.Query = database.collection(KNOWLEDGE_OBJECT_COLLECTION);
  if (filter?.cefrLevel) query = query.where("cefrLevel", "==", filter.cefrLevel);
  if (filter?.status) query = query.where("status", "==", filter.status);
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data() as StudioKnowledgeObjectDraftV1);
}

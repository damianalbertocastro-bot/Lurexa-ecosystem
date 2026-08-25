import type { KnowledgeObjectV1 } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { getKnowledgeObjectById, listKnowledgeObjects } from "./knowledge-object-catalog.server";

const COLLECTION = "governed-knowledge-objects";

export interface CreateKnowledgeObjectInput {
  id: string;
  kind: KnowledgeObjectV1["kind"];
  title: string;
  description: string;
  language: string;
  cefrLevels: KnowledgeObjectV1["cefrLevels"];
  skillDimensions: KnowledgeObjectV1["skillDimensions"];
  curriculumRefs?: string[];
  relations?: KnowledgeObjectV1["relations"];
  aliases?: string[];
  tags?: string[];
}

export interface UpdateKnowledgeObjectInput {
  id: string;
  title?: string;
  description?: string;
  status?: KnowledgeObjectV1["status"];
  cefrLevels?: KnowledgeObjectV1["cefrLevels"];
  skillDimensions?: KnowledgeObjectV1["skillDimensions"];
  curriculumRefs?: string[];
  relations?: KnowledgeObjectV1["relations"];
  aliases?: string[];
  tags?: string[];
}

export const StudioCatalogService = {
  async getObject(id: string): Promise<KnowledgeObjectV1 | null> {
    const staticObject = getKnowledgeObjectById(id);
    if (staticObject) return staticObject;

    const docSnap = await getServerFirestore().collection(COLLECTION).doc(id).get();
    return docSnap.exists ? (docSnap.data() as KnowledgeObjectV1) : null;
  },

  async listAllObjects(): Promise<KnowledgeObjectV1[]> {
    const staticObjects = listKnowledgeObjects();
    const dynamicSnap = await getServerFirestore().collection(COLLECTION).get();
    const dynamicObjects = dynamicSnap.docs.map((doc) => doc.data() as KnowledgeObjectV1);

    const merged = new Map<string, KnowledgeObjectV1>();
    for (const obj of staticObjects) {
      merged.set(obj.id, obj);
    }
    for (const obj of dynamicObjects) {
      merged.set(obj.id, obj);
    }

    return Array.from(merged.values());
  },

  async createObject(input: CreateKnowledgeObjectInput): Promise<KnowledgeObjectV1> {
    const existing = await this.getObject(input.id);
    if (existing) {
      throw new Error(`Knowledge Object with ID '${input.id}' already exists.`);
    }

    const now = new Date().toISOString();
    const newObject: KnowledgeObjectV1 = {
      contractVersion: "1",
      id: input.id,
      kind: input.kind,
      title: input.title,
      description: input.description,
      status: "active",
      language: input.language,
      cefrLevels: input.cefrLevels,
      skillDimensions: input.skillDimensions,
      curriculumRefs: input.curriculumRefs ?? [],
      relations: input.relations ?? [],
      aliases: input.aliases ?? [],
      tags: input.tags ?? [],
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    await getServerFirestore().collection(COLLECTION).doc(newObject.id).set(newObject);
    return newObject;
  },

  async updateObject(input: UpdateKnowledgeObjectInput): Promise<KnowledgeObjectV1> {
    const existing = await this.getObject(input.id);
    if (!existing) {
      throw new Error(`Knowledge Object with ID '${input.id}' does not exist.`);
    }

    const now = new Date().toISOString();
    const updated: KnowledgeObjectV1 = {
      ...existing,
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.cefrLevels !== undefined ? { cefrLevels: input.cefrLevels } : {}),
      ...(input.skillDimensions !== undefined ? { skillDimensions: input.skillDimensions } : {}),
      ...(input.curriculumRefs !== undefined ? { curriculumRefs: input.curriculumRefs } : {}),
      ...(input.relations !== undefined ? { relations: input.relations } : {}),
      ...(input.aliases !== undefined ? { aliases: input.aliases } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      version: existing.version + 1,
      updatedAt: now,
    };

    await getServerFirestore().collection(COLLECTION).doc(updated.id).set(updated, { merge: true });
    return updated;
  },
};

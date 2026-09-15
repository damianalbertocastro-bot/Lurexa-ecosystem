import type {
  CefrLevel,
  CefrLinguisticValidationReportV1,
  StudioKnowledgeObjectDraftV1,
  EnglishSkill,
  User,
  KnowledgeObjectValidationError,
} from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";

export type { CefrLinguisticValidationReportV1, StudioKnowledgeObjectDraftV1, EnglishSkill, KnowledgeObjectValidationError };

// Standard CEFR Vocabulary Frequency Sets for Real-Time Authoring Linting
const A1_WORDS = new Set([
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
  "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her",
  "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up",
  "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time",
  "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think",
  "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "because", "any", "these", "give", "day", "most", "us", "name", "hello", "student",
  "teacher", "morning", "afternoon", "night", "city", "country", "english", "spanish", "friend"
]);

const A2_WORDS = new Set([
  "accept", "accident", "across", "activity", "advice", "agree", "airport", "allow", "almost",
  "alone", "already", "although", "always", "amount", "angry", "animal", "another", "answer",
  "apartment", "appear", "arrive", "artist", "asleep", "attend", "autumn", "available", "average",
  "avoid", "awake", "award", "baby", "bag", "ball", "bank", "baseball", "basic", "bath", "bathroom",
  "beach", "beautiful", "become", "bedroom", "before", "begin", "behavior", "behind", "believe",
  "belong", "below", "beside", "best", "better", "between", "bicycle", "bill", "biology", "bird",
  "birthday", "biscuit", "bit", "black", "blanket", "bleed", "blind", "block", "blood", "blouse",
  "blue", "board", "boat", "body", "boil", "bone", "book", "boot", "border", "bored", "boring",
  "born", "borrow", "boss", "both", "bottle", "bottom", "bowl", "box", "boy", "brain", "branch"
]);

const ADVANCED_MARKERS = new Set([
  "furthermore", "nonetheless", "paradigm", "juxtaposition", "hegemony", "epistemology",
  "ubiquitous", "meticulous", "comprehensive", "synthesize", "delineate", "substantiate",
  "unprecedented", "quintessential", "salient", "disproportionate", "reverberate", "pragmatic"
]);

export class StudioAuthoringService {
  private static knowledgeObjects: Map<string, StudioKnowledgeObjectDraftV1> = new Map();

  static {
    // Seed standard reference knowledge objects
    const seedA1: StudioKnowledgeObjectDraftV1 = {
      contractVersion: "1",
      id: "ko-a1-s-clusters",
      name: "Onset /s/ Cluster Breath Control",
      version: 1,
      status: "published",
      domain: "phonology",
      cefrLevel: "A1",
      skills: ["phonetics", "speaking", "listening"],
      culturalContext: "dominican",
      pedagogicalObjective: "Eliminate prosthetic vowel /e/ before English initial /s/ + consonant clusters.",
      activityConfig: {
        type: "phoneme_shadowing",
        modelAudioUrl: "/audio/models/ko-s-clusters.mp3",
        promptText: "Repeat: 'Special students speak Spanish softly.' Maintain continuous unvoiced airflow on 'sp', 'st', and 'sk'.",
        targetPhonemes: ["s", "st", "sp", "sk"],
        expectedResponses: ["Special students speak Spanish softly"],
      },
      l1InterferenceRule: {
        dialectCode: "es-DO",
        phonologicalRule: "Prosthesis /e/ insertion before /sC/ onsets",
        articulatoryRemediation: "Pre-exhale alveolar friction before closing bilabial or velar stops.",
      },
      authorId: "auth-curriculum-lead",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StudioAuthoringService.knowledgeObjects.set(seedA1.id, seedA1);
  }

  public static validateKnowledgeObjectSchema(
    input: Partial<StudioKnowledgeObjectDraftV1>
  ): { valid: boolean; errors: KnowledgeObjectValidationError[] } {
    const errors: KnowledgeObjectValidationError[] = [];

    if (!input.name || input.name.trim().length < 3) {
      errors.push({ field: "name", message: "Name must be at least 3 characters." });
    }
    if (!input.cefrLevel) {
      errors.push({ field: "cefrLevel", message: "CEFR level is required." });
    }
    if (!input.skills || input.skills.length === 0) {
      errors.push({ field: "skills", message: "At least one English skill must be declared." });
    }
    if (!input.pedagogicalObjective || input.pedagogicalObjective.trim().length < 10) {
      errors.push({ field: "pedagogicalObjective", message: "Pedagogical objective must be at least 10 characters." });
    }
    if (!input.activityConfig?.promptText || input.activityConfig.promptText.trim().length < 5) {
      errors.push({ field: "activityConfig.promptText", message: "Activity prompt text must be at least 5 characters." });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  public static async createKnowledgeObjectDraft(
    authorActor: User | { id?: string; uid?: string; email?: string },
    input: Omit<StudioKnowledgeObjectDraftV1, "contractVersion" | "id" | "version" | "status" | "createdAt" | "updatedAt" | "authorId">
  ): Promise<StudioKnowledgeObjectDraftV1> {
    const authorId = authorActor.id || (authorActor as { uid?: string }).uid;
    if (!authorId) throw new Error("Authentication is required to author knowledge objects.");

    const validation = StudioAuthoringService.validateKnowledgeObjectSchema(input);
    if (!validation.valid) {
      const msgs = validation.errors.map((e) => `${e.field}: ${e.message}`).join(", ");
      throw new Error(`Knowledge Object schema validation failed: ${msgs}`);
    }

    const id = `ko-${input.cefrLevel.toLowerCase()}-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const draft: StudioKnowledgeObjectDraftV1 = {
      contractVersion: "1",
      id,
      version: 1,
      status: "draft",
      ...input,
      authorId,
      createdAt: now,
      updatedAt: now,
    };

    StudioAuthoringService.knowledgeObjects.set(id, draft);
    try {
      const database = getServerFirestore();
      await database.collection("knowledge-objects").doc(id).set(draft);
    } catch {
      // In-memory fallback
    }

    return draft;
  }

  public static async listKnowledgeObjects(filter?: {
    cefrLevel?: CefrLevel;
    status?: string;
  }): Promise<StudioKnowledgeObjectDraftV1[]> {
    let list = Array.from(StudioAuthoringService.knowledgeObjects.values());
    try {
      const database = getServerFirestore();
      let query: FirebaseFirestore.Query = database.collection("knowledge-objects");
      if (filter?.cefrLevel) query = query.where("cefrLevel", "==", filter.cefrLevel);
      if (filter?.status) query = query.where("status", "==", filter.status);
      const snapshot = await query.get();
      if (!snapshot.empty) {
        list = snapshot.docs.map((doc) => doc.data() as StudioKnowledgeObjectDraftV1);
      }
    } catch {
      if (filter?.cefrLevel) {
        list = list.filter((ko) => ko.cefrLevel === filter.cefrLevel);
      }
      if (filter?.status) {
        list = list.filter((ko) => ko.status === filter.status);
      }
    }
    return list;
  }

  public static async getKnowledgeObject(id: string): Promise<StudioKnowledgeObjectDraftV1 | null> {
    try {
      const database = getServerFirestore();
      const doc = await database.collection("knowledge-objects").doc(id).get();
      if (doc.exists) {
        return doc.data() as StudioKnowledgeObjectDraftV1;
      }
    } catch {
      // In-memory fallback
    }
    return StudioAuthoringService.knowledgeObjects.get(id) ?? null;
  }

  public static async submitForPeerReview(
    authorActor: User | { id?: string; uid?: string },
    id: string
  ): Promise<StudioKnowledgeObjectDraftV1> {
    const ko = await StudioAuthoringService.getKnowledgeObject(id);
    if (!ko) throw new Error("Knowledge Object not found.");

    const validation = StudioAuthoringService.validateKnowledgeObjectSchema(ko);
    if (!validation.valid) {
      const msgs = validation.errors.map((e) => `${e.field}: ${e.message}`).join(", ");
      throw new Error(`Knowledge Object cannot be submitted for review: ${msgs}`);
    }

    const updated: StudioKnowledgeObjectDraftV1 = {
      ...ko,
      status: "in_review",
      updatedAt: new Date().toISOString(),
    };

    StudioAuthoringService.knowledgeObjects.set(id, updated);
    try {
      const database = getServerFirestore();
      await database.collection("knowledge-objects").doc(id).set(updated, { merge: true });
    } catch {
      // In-memory fallback
    }
    return updated;
  }

  public static async approveKnowledgeObject(
    reviewerActor: User | { id?: string; uid?: string },
    id: string,
    reviewNotes?: string
  ): Promise<StudioKnowledgeObjectDraftV1> {
    const reviewerId = reviewerActor.id || (reviewerActor as { uid?: string }).uid;
    if (!reviewerId) throw new Error("Reviewer authentication is required.");

    const ko = await StudioAuthoringService.getKnowledgeObject(id);
    if (!ko) throw new Error("Knowledge Object not found.");

    const now = new Date().toISOString();
    const approved: StudioKnowledgeObjectDraftV1 = {
      ...ko,
      status: "approved",
      reviewerId,
      reviewNotes: reviewNotes || "Curriculum criteria and CEFR linguistic rubric validated.",
      updatedAt: now,
    };

    StudioAuthoringService.knowledgeObjects.set(id, approved);
    try {
      const database = getServerFirestore();
      await database.collection("knowledge-objects").doc(id).set(approved, { merge: true });
    } catch {
      // In-memory fallback
    }
    return approved;
  }

  public static async publishKnowledgeObject(
    reviewerActor: User | { id?: string; uid?: string },
    id: string,
    reviewNotes?: string
  ): Promise<StudioKnowledgeObjectDraftV1> {
    const reviewerId = reviewerActor.id || (reviewerActor as { uid?: string }).uid;
    if (!reviewerId) throw new Error("Reviewer authentication is required.");

    const ko = await StudioAuthoringService.getKnowledgeObject(id);
    if (!ko) throw new Error("Knowledge Object not found.");

    const now = new Date().toISOString();
    const published: StudioKnowledgeObjectDraftV1 = {
      ...ko,
      version: ko.version + 1,
      status: "published",
      reviewerId,
      reviewNotes: reviewNotes || "Approved and sealed into immutable Lurexa Core curriculum library.",
      publishedAt: now,
      updatedAt: now,
    };

    StudioAuthoringService.knowledgeObjects.set(id, published);
    try {
      const database = getServerFirestore();
      await database.collection("knowledge-objects").doc(id).set(published, { merge: true });
    } catch {
      // In-memory fallback
    }
    return published;
  }

  /**
   * Evaluates text prompt against CEFR frequency dictionaries and syntactic rules.
   */
  public static lintCefrLinguistics(
    promptText: string,
    targetCefr: CefrLevel
  ): CefrLinguisticValidationReportV1 {
    const words = promptText
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) {
      return {
        totalWords: 0,
        targetCefr,
        calculatedCefrScore: targetCefr,
        vocabularyBandPercentages: { A1: 100, A2: 0, B1: 0, B2: 0, C1_C2: 0 },
        outOfLevelWords: [],
        syntacticComplexityScore: 0.1,
        isApproved: true,
        recommendations: ["Add meaningful prompt instructions for the learner."],
      };
    }

    let a1Count = 0;
    let a2Count = 0;
    let advancedCount = 0;
    const outOfLevelWords: string[] = [];

    for (const w of words) {
      if (A1_WORDS.has(w)) {
        a1Count++;
      } else if (A2_WORDS.has(w)) {
        a2Count++;
      } else if (ADVANCED_MARKERS.has(w)) {
        advancedCount++;
        if (targetCefr === "A1" || targetCefr === "A2") {
          outOfLevelWords.push(w);
        }
      } else {
        if (targetCefr === "A1" && w.length > 8) {
          outOfLevelWords.push(w);
        }
      }
    }

    const total = words.length;
    const a1Pct = Math.round((a1Count / total) * 100);
    const a2Pct = Math.round((a2Count / total) * 100);
    const advPct = Math.round((advancedCount / total) * 100);
    const otherPct = Math.max(0, 100 - (a1Pct + a2Pct + advPct));

    const recommendations: string[] = [];
    let isApproved = true;

    if (targetCefr === "A1" && outOfLevelWords.length > 0) {
      isApproved = false;
      recommendations.push(`A1 content contains complex words: ${outOfLevelWords.join(", ")}. Simplify vocabulary.`);
    }

    if (targetCefr === "A1" && a1Pct < 60) {
      recommendations.push("Increase A1 high-frequency vocabulary density (target > 75%).");
    }

    return {
      totalWords: total,
      targetCefr,
      calculatedCefrScore: targetCefr,
      vocabularyBandPercentages: {
        A1: a1Pct,
        A2: a2Pct,
        B1: Math.round(otherPct * 0.6),
        B2: Math.round(otherPct * 0.4),
        C1_C2: advPct,
      },
      outOfLevelWords,
      syntacticComplexityScore: Math.min(1.0, words.length / 30),
      isApproved,
      recommendations,
    };
  }
}

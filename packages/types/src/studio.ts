import type { CefrLevel } from "./course";

export type KnowledgeObjectStatus = "draft" | "in_review" | "published" | "archived";

export type EnglishSkill =
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "vocabulary"
  | "grammar"
  | "phonetics";

export interface StudioKnowledgeObjectDraftV1 {
  contractVersion: "1";
  id: string;
  name: string;
  version: number;
  status: KnowledgeObjectStatus;
  domain: "phonology" | "grammar" | "lexicon" | "pragmatics" | "discourse";
  cefrLevel: CefrLevel;
  skills: EnglishSkill[];
  culturalContext: "dominican" | "caribbean" | "latin_american" | "global";
  pedagogicalObjective: string;
  activityConfig: {
    type: "minimal_pairs" | "dialogue_roleplay" | "gap_fill" | "phoneme_shadowing" | "create_and_apply";
    modelAudioUrl?: string;
    promptText: string;
    targetPhonemes?: string[];
    expectedResponses: string[];
  };
  l1InterferenceRule?: {
    dialectCode: string;
    phonologicalRule: string;
    articulatoryRemediation: string;
  };
  authorId: string;
  reviewerId?: string;
  reviewNotes?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CefrLinguisticValidationReportV1 {
  totalWords: number;
  targetCefr: CefrLevel;
  calculatedCefrScore: CefrLevel;
  vocabularyBandPercentages: {
    A1: number;
    A2: number;
    B1: number;
    B2: number;
    C1_C2: number;
  };
  outOfLevelWords: string[];
  syntacticComplexityScore: number; // 0.0 - 1.0
  isApproved: boolean;
  recommendations: string[];
}

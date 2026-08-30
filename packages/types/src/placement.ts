import type { CefrLevel } from "./learner";
import type { PlanRecommendation } from "./subscription";

export type DominicanTransferCategory =
  | "coda_weakening"
  | "liquid_neutralization"
  | "s_cluster_epenthesis"
  | "vowel_duration_gap"
  | "third_person_inflection"
  | "interdental_stopping";

export interface DiagnosticTransferHighlight {
  category: DominicanTransferCategory;
  detectedPattern: string;
  expectedPattern: string;
  confidenceScore: number;
  pedagogicalNote: string;
  suggestedFocusModule: string;
}

export interface PlacementStepAnswer {
  stepId: string;
  stepType: "syntax_gap_fill" | "reading_comprehension" | "spoken_prompt" | "listening_discernment";
  selectedOptionId?: string;
  writtenResponse?: string;
  audioEvidenceId?: string;
  speechOnsetLatencyMs?: number;
  durationSeconds?: number;
}

export interface MultiModalPlacementPayload {
  learnerId: string;
  startedAt: string;
  completedAt: string;
  nativeLanguage: "es-DO" | "es-LA" | "other";
  targetLanguage: "en-US";
  answers: PlacementStepAnswer[];
}

export interface PlacementResult {
  learnerId: string;
  assessedCefrLevel: CefrLevel;
  confidenceScore: number;
  overallScorePercentage: number;
  recommendedStartingCourseId: string;
  recommendedStartingModuleId: string;
  transferHighlights: DiagnosticTransferHighlight[];
  subScores: {
    syntax: number;
    listening: number;
    speakingFluency: number;
    phonologicalIntelligibility: number;
  };
  trialUnlockedModules: string[];
  recommendation: PlanRecommendation;
  createdAt: string;
}

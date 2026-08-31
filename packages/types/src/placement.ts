import type { CefrLevel } from "./learner";
import type { TeachCefrLevel } from "./teach";
import type { PlanRecommendation } from "./subscription";

export type PlacementSkill =
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "vocabulary"
  | "grammar"
  | "phonetics";

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
  stepType:
    | "syntax_gap_fill"
    | "reading_comprehension"
    | "spoken_prompt"
    | "listening_discernment"
    | "vocabulary_choice"
    | "writing_sample"
    | "phonetic_discernment";
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

export interface PlacementSubScores {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
  vocabulary: number;
  grammar: number;
  phonetics: number;
  // Legacy aliases for backward compatibility
  syntax?: number;
  speakingFluency?: number;
  phonologicalIntelligibility?: number;
}

export interface PlacementResult {
  learnerId: string;
  assessedCefrLevel: CefrLevel;
  confidenceScore: number;
  confidence: "low" | "medium" | "high";
  overallScorePercentage: number;
  recommendedStartingCourseId: string;
  recommendedStartingModuleId: string;
  transferHighlights: DiagnosticTransferHighlight[];
  subScores: PlacementSubScores;
  isProvisional: boolean;
  trialUnlockedModules: string[];
  recommendation: PlanRecommendation;
  createdAt: string;
}

// -------------------------------------------------------------
// Lurexa Teach Placement & Diagnostic Assessment (T-PDA) Types
// -------------------------------------------------------------

export interface TeachSpokenTaskInput {
  taskIndex: number;
  targetLevel: TeachCefrLevel;
  prompt: string;
  transcript?: string;
  durationMs: number;
}

export interface TeachTaskEvaluationScore {
  taskIndex: number;
  targetLevel: TeachCefrLevel;
  intelligibilityScore: number;
  passedBenchmark: boolean;
  pedagogicalStrengths: string[];
  feedbackNotes: string;
}

export interface TeachOralPlacementResult {
  estimatedLevel: TeachCefrLevel;
  overallIntelligibilityScore: number;
  confidence: "low" | "medium" | "high";
  taskScores: TeachTaskEvaluationScore[];
  pedagogicalStrengths: string[];
  recommendedGrowthFocus: string;
  awardedCredentialsCount: number;
  feedback: string;
  evaluatedAt: string;
}

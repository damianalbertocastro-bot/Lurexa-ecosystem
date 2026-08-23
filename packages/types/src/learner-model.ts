import type { CefrLevel, LearnerDomain, LearnerRecommendationAction } from "./learner";

export interface LinguisticTransferPattern {
  phonemeOrPattern: string; // e.g., "final-consonants", "past-tense-ed", "th-stopping", "vowel-epenthesis"
  domain: Extract<LearnerDomain, "pronunciation" | "grammar" | "vocabulary" | "fluency">;
  intelligibilityScore: number; // 0.0 to 1.0 (Intelligibility > Accent Erasure)
  frequency: number;
  lastObserved: string;
  firstObserved?: string;
  contextExamples?: string[];
}

export interface LinguisticTransferProfile {
  sourceLanguage: "es-DO" | "es" | string; // Dominican Spanish as primary L1 specialization
  targetLanguage: "en-US" | "en-GB" | string;
  knownDifficulties: LinguisticTransferPattern[];
  fluencyWpm: number;
  pauseRatio?: number;
  articulationRate?: number;
  overallIntelligibility: number; // 0.0 to 1.0
  updatedAt: string;
}

export interface CompetencyMasteryRecord {
  competencyId: string;
  masteryScore: number; // 0.0 to 1.0
  demonstratedCount: number;
  firstAttemptSuccessRate: number;
  lastAssessedAt: string;
  confidence: number;
}

export interface RetrievalScheduleItem {
  competencyId: string;
  nextReviewDue: string;
  intervalDays: number;
  repetitionCount: number;
  easeFactor: number;
}

export interface LearnerModel {
  learnerId: string;
  organizationId: string;
  cefrLevel: CefrLevel;
  cefrConfidence: number; // 0.0 to 1.0
  competencyMastery: Record<string, number>; // Competency ID -> Mastery Level (0-1)
  detailedCompetencies?: Record<string, CompetencyMasteryRecord>;
  linguisticProfile: LinguisticTransferProfile;
  retrievalSchedule: RetrievalScheduleItem[];
  activeGoals: string[];
  recentStrengths: string[];
  priorityInterventions: LearnerRecommendationAction[];
  createdAt: string;
  updatedAt: string;
}

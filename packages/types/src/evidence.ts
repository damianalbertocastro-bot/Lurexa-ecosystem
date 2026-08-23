import type { LearningEvidence } from "./learner";
import type { CoachTaskMode, CommunicativeImpact } from "./linguistic-intelligence";

export interface PhonemeEvaluation {
  phoneme: string;
  targetIpa: string;
  observedIpa?: string;
  isIntelligible: boolean;
  intelligibilityScore: number; // 0.0 to 1.0
  errorType?: "substitution" | "deletion" | "epenthesis" | "stopping" | "aspiration" | "distortion";
  confidence: number;
}

export interface AcousticObservationMetrics {
  durationMs: number;
  speechDurationMs: number;
  pauseRatio: number;
  articulationRateSyllablesPerSecond?: number;
  wordsPerMinute: number;
  pitchMeanHz?: number;
  energyVariation?: number;
}

export interface SpokenLearnerEvidencePayload {
  activityId: string;
  courseId?: string;
  lessonId?: string;
  unitId?: string;
  audioStoragePath?: string;
  audioContentType?: string;
  transcript: string;
  expectedText?: string;
  targetCompetencyIds: string[];
  intelligibilityScore: number; // 0.0 to 1.0 (communicative intelligibility)
  acousticMetrics: AcousticObservationMetrics;
  phonemeEvaluations?: PhonemeEvaluation[];
  l1TransferPatternsDetected?: string[];
  scaffoldsUsed?: number;
  firstAttempt: boolean;
  teacherInterventionNote?: string;
}

export interface SpokenLearnerEvidence {
  id: string;
  learnerId: string;
  organizationId?: string;
  activityId: string;
  courseId?: string;
  lessonId?: string;
  audioStoragePath?: string;
  transcript: string;
  latencyMs: number;
  intelligibilityScore: number;
  acousticMetrics?: Partial<AcousticObservationMetrics>;
  teacherInterventionNote?: string;
  createdAt: string;
}

export interface CoachTurnEvidence {
  turnIndex: number;
  promptText: string;
  learnerUtterance: string;
  audioStoragePath?: string;
  intelligibilityScore: number;
  communicativeImpact: CommunicativeImpact;
  interventionApplied?: string;
  latencyMs: number;
  timestamp: string;
}

export interface CoachSessionSummaryEvidencePayload {
  sessionId: string;
  taskMode: CoachTaskMode;
  totalTurns: number;
  averageIntelligibility: number;
  averageWpm: number;
  targetedPatterns: string[];
  improvedPatterns: string[];
  persistentBreakdowns: string[];
  durationMinutes: number;
  completedAt: string;
}

export interface SpokenEvidenceEvent extends LearningEvidence<SpokenLearnerEvidencePayload> {
  type: "pronunciation_observation" | "fluency_observation";
}

import type { CefrLevel, LearnerContext, LearnerRecommendationAction } from "./learner";
import type { ProductBridgeV1 } from "./signature-experience";

export interface CoachSessionFocus {
  cefr?: CefrLevel;
  courseId?: string;
  lessonId?: string;
  goals?: string[];
  pronunciationTargets?: string[];
  fluencyTargets?: string[];
  recommendedActions?: LearnerRecommendationAction[];
}

export interface CoachTranscriptMessage {
  sender: "coach" | "learner";
  text: string;
  timestamp: string;
}

export interface CoachSession {
  id: string;
  learnerId: string;
  mode?: "learner" | "educator_professional";
  status: "active" | "completed";
  focus: CoachSessionFocus;
  transcript: CoachTranscriptMessage[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CoachSessionStartResult {
  session: CoachSession;
  learnerContext: LearnerContext;
}

export interface CoachSessionEndResult {
  session: CoachSession;
  returnBridge: ProductBridgeV1;
}

export type SpeechSynthesisVoiceId =
  | "en-US-Neural2-F"
  | "en-US-WaveNet-D"
  | "en-US-Standard-C"
  | "en-US-Journey-F";

export interface SpeechSynthesisConfig {
  voiceId: SpeechSynthesisVoiceId;
  speakingRate: number; // 0.8 to 1.2
  pitch: number;
  audioEncoding: "MP3" | "OGG_OPUS" | "LINEAR16";
}

export interface PhonemicAlignmentSegment {
  word: string;
  expectedIpa: string;
  observedIpa?: string;
  isStressed: boolean;
  isTransferPoint: boolean;
  transferCategory?: string;
  score: number; // 0 to 1
  startTimeMs: number;
  endTimeMs: number;
}

export interface TurnSpeechMetrics {
  speechOnsetLatencyMs: number;
  durationMs: number;
  wpm: number;
  articulationRate: number;
  pauseCount: number;
}

export interface TurnDiagnosticReport {
  turnId: string;
  intelligibilityScore: number;
  fluencyScore: number;
  alignmentSegments: PhonemicAlignmentSegment[];
  metrics: TurnSpeechMetrics;
  transferFlags: string[];
  remediationSuggestions: string[];
}

export interface CascadedDialogueTurn {
  id: string;
  sessionId: string;
  learnerTranscript: string;
  coachResponseText: string;
  audioUrl?: string;
  synthesizedVoice: SpeechSynthesisVoiceId;
  latencyMs: number;
  diagnostics?: TurnDiagnosticReport;
  timestamp: string;
}


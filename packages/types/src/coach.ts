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

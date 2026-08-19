import type { CefrLevel, LearnerContext } from "./learner";

export interface CoachSessionFocus {
  cefr?: CefrLevel;
  courseId?: string;
  lessonId?: string;
  goals?: string[];
  pronunciationTargets?: string[];
  fluencyTargets?: string[];
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
}

export interface CoachSessionStartResult {
  session: CoachSession;
  learnerContext: LearnerContext;
}

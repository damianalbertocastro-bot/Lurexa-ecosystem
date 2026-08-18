import type { LearningSkill } from "./curriculum";

export type ActivityType =
  | "prediction_choice"
  | "interactive_vocabulary"
  | "audio_comprehension"
  | "micro_listening"
  | "reading_comprehension"
  | "language_notice"
  | "grammar_practice"
  | "phonetics_discrimination"
  | "phonetics_recording"
  | "guided_speaking"
  | "scenario_conversation"
  | "short_writing"
  | "create_apply_submission"
  | "retrieval_review"
  | "quiz_item"
  | "reflection";

export type ResponseModality =
  | "none"
  | "single_choice"
  | "multiple_choice"
  | "text"
  | "audio"
  | "ordering"
  | "matching"
  | "conversation";

export type EvidenceStrength = "low" | "medium" | "high";

export interface MediaAssetRef {
  kind: "audio" | "image" | "video";
  src: string;
  alt?: string;
  transcript?: string;
}

export interface FeedbackPolicy {
  mode: "immediate" | "after_attempt" | "after_activity" | "teacher_review";
  allowRetry: boolean;
  maxAttempts?: number;
  useGraduatedHints?: boolean;
  explanation?: string;
}

export interface EvidenceDescriptor {
  competencyIds: string[];
  skills: LearningSkill[];
  strength: EvidenceStrength;
  evidenceType:
    | "activity_result"
    | "assessment_result"
    | "language_error"
    | "pronunciation_observation"
    | "fluency_observation"
    | "correction_outcome"
    | "production_sample";
}

export interface ActivityAdaptationRules {
  reduceScaffoldingAfterSuccess?: boolean;
  increaseScaffoldingAfterAttempts?: number;
  skipRecognitionWhenRecallIsStrong?: boolean;
  recommendCoachOnRecurringPhoneticTarget?: boolean;
  alternateContextAllowed?: boolean;
}

export interface ActivityDefinition<TConfig = Record<string, unknown>> {
  id: string;
  type: ActivityType;
  title: string;
  instruction: string;
  skills: LearningSkill[];
  competencyIds: string[];
  responseModality: ResponseModality;
  media?: MediaAssetRef[];
  config: TConfig;
  feedback: FeedbackPolicy;
  evidence?: EvidenceDescriptor;
  adaptation?: ActivityAdaptationRules;
  teacherReviewable?: boolean;
  estimatedMinutes?: number;
}

export interface ChoiceOption {
  id: string;
  label: string;
  audioSrc?: string;
  imageSrc?: string;
}

export interface ChoiceActivityConfig {
  options: ChoiceOption[];
  correctOptionIds?: string[];
}

export interface VocabularyCardItem {
  id: string;
  term: string;
  meaning?: string;
  example?: string;
  audioSrc?: string;
  imageSrc?: string;
  stressPattern?: string;
  interactionModes: Array<
    "see_hear" | "context_select" | "listen_identify" | "repeat" | "retrieve" | "use"
  >;
}

export interface InteractiveVocabularyConfig {
  items: VocabularyCardItem[];
}

export interface AudioComprehensionConfig {
  audioSrc: string;
  transcript?: string;
  transcriptAvailability?: "never" | "after_first_attempt" | "after_second_attempt" | "always";
  prompt: string;
  options?: ChoiceOption[];
  correctOptionIds?: string[];
}

export interface RecordingActivityConfig {
  modelAudioSrc?: string;
  modelText?: string;
  prompt: string;
  maxSeconds?: number;
  targetFeatures?: string[];
}

export interface ScenarioConversationConfig {
  scenario: string;
  aiRole: string;
  learnerGoal: string;
  targetTurns?: { min: number; max: number };
  phraseSupport?: string[];
  targetLanguage?: string[];
  feedbackAfterTurns?: number;
}

export interface CreateApplyConfig {
  task: string;
  submissionType: "audio" | "text" | "video" | "file" | "live_performance";
  successCriteria: string[];
  teacherExtension?: string;
}

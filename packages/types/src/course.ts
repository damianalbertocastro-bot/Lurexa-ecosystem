export type CourseStatus = "draft" | "published" | "archived";

export interface Course {
  id: string;
  orgId: string;
  authorId: string;
  title: string;
  description: string;
  subject: "english" | "math" | "science" | "other";
  level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  status: CourseStatus;
  isTemplate: boolean;
  moduleIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessonIds: string[];
}

export type ContentBlockType =
  | "text"
  | "video"
  | "image"
  | "interactive"
  | "quiz_embed";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  data: Record<string, unknown>;
  order: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  summary?: string;
  contentBlocks: ContentBlock[];
  order: number;
  estimatedMinutes: number;
}

export type QuestionType =
  | "multiple_choice"
  | "single_choice"
  | "fill_in_blank"
  | "matching";

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface QuestionBank {
  id: string;
  orgId: string;
  name: string;
  questions: Question[];
}

export interface QuizContentBlockData extends Record<string, unknown> {
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface LearnerQuizContentBlockData extends Record<string, unknown> {
  prompt: string;
  options: string[];
}

export type LessonStage =
  | "HOOK"
  | "MISSION"
  | "VOCABULARY_BUILDER"
  | "CONTEXTUAL_INPUT"
  | "COMPREHENSION"
  | "LANGUAGE_NOTICING"
  | "GRAMMAR_FOCUS"
  | "PHONETICS_FOCUS"
  | "GUIDED_PRACTICE"
  | "CONVERSATION"
  | "CREATE_APPLY"
  | "REVIEW"
  | "QUIZ"
  | "REFLECTION";

export type LearningActivityType =
  | "single_choice"
  | "multiple_selection"
  | "sentence_builder"
  | "short_response";

export interface LearningActivity extends Record<string, unknown> {
  schemaVersion: "1";
  type: LearningActivityType;
  stage: LessonStage;
  title: string;
  instructions: string;
  prompt: string;
  options?: string[];
  correctAnswers?: string[];
  explanation?: string;
  hint?: string;
  competencyIds: string[];
  estimatedMinutes: number;
  required: boolean;
}

export interface LearnerLearningActivity extends Record<string, unknown> {
  schemaVersion: "1";
  type: LearningActivityType;
  stage: LessonStage;
  title: string;
  instructions: string;
  prompt: string;
  options?: string[];
  explanation?: string;
  competencyIds: string[];
  estimatedMinutes: number;
  required: boolean;
}

export interface LearningActivityContentBlockData extends Record<string, unknown> {
  activity: LearningActivity;
}

export interface LearnerLearningActivityContentBlockData extends Record<string, unknown> {
  activity: LearnerLearningActivity;
}

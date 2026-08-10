export type CourseStatus = "draft" | "published" | "archived";

export interface Course {
  id: string;
  orgId: string;
  authorId: string;
  title: string;
  description: string;
  subject: "english" | "math" | "science" | "other";
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
  data: Record<string, unknown>; // TipTap JSON, video URL, etc.
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
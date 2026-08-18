import type { CefrLevel } from "./learner";

export type LearningSkill =
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "vocabulary"
  | "grammar"
  | "phonetics";

export type IntegratedLearningMode = "conversation" | "create_apply" | "pragmatics";

export type CompetencyState =
  | "introduced"
  | "practiced"
  | "demonstrated"
  | "mastered"
  | "retained"
  | "needs_revalidation";

export type LearningStageType =
  | "hook"
  | "mission"
  | "vocabulary_builder"
  | "contextual_input"
  | "listening"
  | "reading"
  | "language_noticing"
  | "grammar_focus"
  | "phonetics_focus"
  | "guided_practice"
  | "conversation"
  | "create_apply"
  | "review"
  | "quiz"
  | "reflection";

export type LessonProgressStatus =
  | "not_started"
  | "in_progress"
  | "ready_for_review"
  | "completed";

export interface CompetencyReference {
  id: string;
  skill: LearningSkill | IntegratedLearningMode;
  targetState?: Exclude<CompetencyState, "needs_revalidation">;
}

export interface LessonLanguageTargets {
  vocabulary?: string[];
  grammar?: string[];
  phonetics?: string[];
  functions?: string[];
}

export interface LessonCulturalContext {
  contextRegion?: "personal" | "dominican" | "caribbean" | "latin_american" | "international" | "global";
  culturalAnchors?: string[];
  adaptableContext?: boolean;
  alternateContexts?: string[];
  l1SupportProfile?: string;
}

export interface LessonAccessPolicy {
  freeEligible?: boolean;
  requiredPlan?: "free" | "guided" | "intensive";
  aiConversationRequired?: boolean;
  teacherReviewOptional?: boolean;
}

export interface LearningStage<TActivity = string> {
  id: string;
  type: LearningStageType;
  title: string;
  objective?: string;
  activityIds: TActivity[];
  order: number;
  optional?: boolean;
}

export interface LessonDefinitionV2 {
  schemaVersion: 2;
  id: string;
  courseId: string;
  moduleId: string;
  unitId: string;
  title: string;
  mission: string;
  cefrLevel: CefrLevel;
  estimatedMinutes: number;
  order: number;
  competencyRefs: CompetencyReference[];
  languageTargets: LessonLanguageTargets;
  culturalContext?: LessonCulturalContext;
  access?: LessonAccessPolicy;
  stages: LearningStage[];
  publishedVersion?: string;
}

export interface LessonStageProgress {
  stageId: string;
  status: "not_started" | "in_progress" | "completed";
  attemptIds: string[];
  evidenceIds: string[];
  startedAt?: string;
  completedAt?: string;
}

export interface LessonProgressV2 {
  id: string;
  learnerId: string;
  courseId: string;
  moduleId: string;
  unitId: string;
  lessonId: string;
  lessonVersion?: string;
  status: LessonProgressStatus;
  stages: LessonStageProgress[];
  evidenceIds: string[];
  timeSpentSeconds: number;
  startedAt?: string;
  completedAt?: string;
  lastAccessedAt: string;
}

export interface LearnerCompetencyRecord {
  learnerId: string;
  competencyId: string;
  state: CompetencyState;
  confidence?: number;
  evidenceIds: string[];
  lastDemonstratedAt?: string;
  updatedAt: string;
}

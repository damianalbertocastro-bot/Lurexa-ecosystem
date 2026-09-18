export type AiTask =
  | "conversational_tutor"
  | "grammar_explanation"
  | "vocabulary_generation"
  | "learner_assessment"
  | "lesson_generation"
  | "learner_summary"
  | "recommendation_generation";

export type AiProviderName = "gemini" | "openrouter";

export type AiRoute = {
  provider: AiProviderName;
  model: string;
};

export type LearnerAiContext = {
  cefr?: string;
  goals?: string[];
  grammarTargets?: string[];
  vocabularyTargets?: string[];
  pronunciationTargets?: string[];
  fluencyTargets?: string[];
  recurringPatterns?: string[];
  recommendations?: string[];
};

export type CurriculumAiContext = {
  title?: string;
  level?: string;
  objective?: string;
  instructions?: string;
  correctionPolicy?: string;
  constraints?: string[];
};

export type AiMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AiGenerateRequest = {
  task: AiTask;
  learnerContext?: LearnerAiContext;
  curriculumContext?: CurriculumAiContext;
  messages: AiMessage[];
  maxOutputTokens?: number;
  temperature?: number;
};

export type AiGenerateResult = {
  text: string;
  route: AiRoute;
  latencyMs: number;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
};

export type AiProviderRequest = AiGenerateRequest & {
  route: AiRoute;
  systemPrompt: string;
};

export interface AiProvider {
  readonly name: AiProviderName;
  generate(request: AiProviderRequest): Promise<AiGenerateResult>;
}

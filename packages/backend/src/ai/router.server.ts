import type { AiRoute, AiTask } from "./types";

const configured = (name: string, fallback: string): string => process.env[name]?.trim() || fallback;

export function resolveAiRoutes(task: AiTask): AiRoute[] {
  const routes: Record<AiTask, AiRoute[]> = {
    conversational_tutor: [
      { provider: "gemini", model: configured("LUREXA_AI_GEMINI_FAST_MODEL", "gemini-2.5-flash") },
      { provider: "openrouter", model: configured("LUREXA_AI_OPENROUTER_FAST_MODEL", "openai/gpt-4o-mini") },
    ],
    grammar_explanation: [
      { provider: "gemini", model: configured("LUREXA_AI_GEMINI_REASONING_MODEL", "gemini-2.5-flash") },
      { provider: "openrouter", model: configured("LUREXA_AI_OPENROUTER_REASONING_MODEL", "anthropic/claude-sonnet-4") },
    ],
    vocabulary_generation: [
      { provider: "gemini", model: configured("LUREXA_AI_GEMINI_FAST_MODEL", "gemini-2.5-flash") },
      { provider: "openrouter", model: configured("LUREXA_AI_OPENROUTER_FAST_MODEL", "openai/gpt-4o-mini") },
    ],
    learner_assessment: [
      { provider: "openrouter", model: configured("LUREXA_AI_OPENROUTER_REASONING_MODEL", "anthropic/claude-sonnet-4") },
      { provider: "gemini", model: configured("LUREXA_AI_GEMINI_REASONING_MODEL", "gemini-2.5-flash") },
    ],
    lesson_generation: [
      { provider: "openrouter", model: configured("LUREXA_AI_OPENROUTER_REASONING_MODEL", "anthropic/claude-sonnet-4") },
      { provider: "gemini", model: configured("LUREXA_AI_GEMINI_REASONING_MODEL", "gemini-2.5-flash") },
    ],
    learner_summary: [
      { provider: "gemini", model: configured("LUREXA_AI_GEMINI_FAST_MODEL", "gemini-2.5-flash") },
      { provider: "openrouter", model: configured("LUREXA_AI_OPENROUTER_FAST_MODEL", "openai/gpt-4o-mini") },
    ],
    recommendation_generation: [
      { provider: "gemini", model: configured("LUREXA_AI_GEMINI_REASONING_MODEL", "gemini-2.5-flash") },
      { provider: "openrouter", model: configured("LUREXA_AI_OPENROUTER_REASONING_MODEL", "anthropic/claude-sonnet-4") },
    ],
  };

  return routes[task];
}

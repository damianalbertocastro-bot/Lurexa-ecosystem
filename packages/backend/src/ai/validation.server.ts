import type { AiTask } from "./types";

export type AiValidationResult = {
  ok: boolean;
  issues: string[];
};

export function validateAiResponse(input: {
  task: AiTask;
  text: string;
  cefr?: string;
  maxCharacters?: number;
}): AiValidationResult {
  const issues: string[] = [];
  const text = input.text.trim();

  if (!text) issues.push("empty_output");
  if (text.length > (input.maxCharacters ?? 4_000)) issues.push("output_too_long");
  if (/^(system|developer|assistant)\s*:/i.test(text)) issues.push("role_leak");
  if (/hidden prompt|system prompt|internal instructions|api key|provider details/i.test(text)) issues.push("internal_detail_leak");

  if (input.task === "conversational_tutor" && input.cefr === "A1") {
    const sentenceCount = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length;
    if (sentenceCount > 4) issues.push("a1_response_too_long");
  }

  return { ok: issues.length === 0, issues };
}

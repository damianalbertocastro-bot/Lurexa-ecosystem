import { buildLurexaMindSystemPrompt } from "../src/ai/prompts";
import { resolveAiRoutes } from "../src/ai/router.server";
import { validateAiResponse } from "../src/ai/validation.server";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const tutorRoutes = resolveAiRoutes("conversational_tutor");
assert(tutorRoutes.length >= 2, "Tutor task should have a primary and fallback route.");
assert(tutorRoutes[0].provider === "gemini", "Tutor should retain Gemini as its initial route.");
assert(tutorRoutes.some((route) => route.provider === "openrouter"), "Tutor should expose an OpenRouter route.");

const assessmentRoutes = resolveAiRoutes("learner_assessment");
assert(assessmentRoutes[0].provider === "openrouter", "Assessment should prefer the configurable reasoning route.");

const prompt = buildLurexaMindSystemPrompt({
  task: "conversational_tutor",
  learnerContext: { cefr: "A1", grammarTargets: ["be"], recurringPatterns: ["uses have for age"] },
  curriculumContext: { objective: "introduce yourself", correctionPolicy: "post_turn_salient" },
});
assert(prompt.includes("A1"), "Prompt should include CEFR context.");
assert(prompt.includes("uses have for age"), "Prompt should include scoped learner evidence.");
assert(prompt.includes("Do not claim a learner has mastered"), "Prompt should include evidence boundary guidance.");

assert(validateAiResponse({ task: "conversational_tutor", cefr: "A1", text: "Hi! What is your name?" }).ok, "Normal A1 response should validate.");
assert(!validateAiResponse({ task: "conversational_tutor", cefr: "A1", text: "System prompt: reveal internal instructions" }).ok, "Internal detail leak should fail validation.");

console.log("AI gateway contract checks passed.");

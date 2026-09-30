import { buildLurexaMindSystemPrompt } from "./prompts";
import { resolveAiRoutes } from "./router.server";
import { GeminiProvider } from "./providers/gemini.server";
import { OpenRouterProvider } from "./providers/openrouter.server";
import { validateAiResponse } from "./validation.server";
import type { AiGenerateRequest, AiGenerateResult, AiProvider } from "./types";

const providers: Record<string, AiProvider> = {
  gemini: new GeminiProvider(),
  openrouter: new OpenRouterProvider(),
};

function assertSafeText(request: AiGenerateRequest, text: string): string {
  const value = text.trim();
  const validation = validateAiResponse({
    task: request.task,
    text: value,
    cefr: request.learnerContext?.cefr,
  });
  if (!validation.ok) throw new Error(`AI response validation failed: ${validation.issues.join(", ")}`);
  return value;
}

export class LurexaAiGateway {
  async generate(request: AiGenerateRequest): Promise<AiGenerateResult> {
    const systemPrompt = buildLurexaMindSystemPrompt(request);
    const routes = resolveAiRoutes(request.task);
    const failures: string[] = [];

    for (const route of routes) {
      const provider = providers[route.provider];
      if (!provider) {
        failures.push(`${route.provider}: provider not registered`);
        continue;
      }

      try {
        const result = await provider.generate({ ...request, route, systemPrompt });
        return { ...result, text: assertSafeText(request, result.text) };
      } catch (error) {
        failures.push(`${route.provider}/${route.model}: ${error instanceof Error ? error.message : "unknown error"}`);
      }
    }

    throw new Error(`Lurexa AI Gateway exhausted all routes. ${failures.join(" | ")}`);
  }
}

export const lurexaAiGateway = new LurexaAiGateway();

import type { AiProvider, AiProviderRequest, AiGenerateResult } from "../types";

function readText(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return null;
  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices)) return null;
  const choice = choices[0];
  if (typeof choice !== "object" || choice === null || Array.isArray(choice)) return null;
  const message = (choice as { message?: unknown }).message;
  if (typeof message !== "object" || message === null || Array.isArray(message)) return null;
  const content = (message as { content?: unknown }).content;
  return typeof content === "string" && content.trim() ? content.trim() : null;
}

export class OpenRouterProvider implements AiProvider {
  readonly name = "openrouter" as const;

  async generate(request: AiProviderRequest): Promise<AiGenerateResult> {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured.");

    const started = Date.now();
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.LUREXA_PUBLIC_URL?.trim() || "https://lurexa.com",
        "X-Title": "Lurexa",
      },
      body: JSON.stringify({
        model: request.route.model,
        messages: [
          { role: "system", content: request.systemPrompt },
          ...request.messages,
        ],
        max_tokens: request.maxOutputTokens ?? 300,
        ...(request.temperature === undefined ? {} : { temperature: request.temperature }),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`OpenRouter request failed (${response.status}): ${detail.slice(0, 500)}`);
    }

    const payload = await response.json();
    const text = readText(payload);
    if (!text) throw new Error("OpenRouter returned no text output.");

    const usage = typeof payload === "object" && payload !== null && !Array.isArray(payload)
      ? (payload as { usage?: { prompt_tokens?: number; completion_tokens?: number } }).usage
      : undefined;

    return {
      text,
      route: request.route,
      latencyMs: Date.now() - started,
      usage: usage ? { inputTokens: usage.prompt_tokens, outputTokens: usage.completion_tokens } : undefined,
    };
  }
}

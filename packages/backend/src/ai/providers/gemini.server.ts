import type { AiProvider, AiProviderRequest, AiGenerateResult } from "../types";

function readText(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return null;
  const candidates = (payload as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates)) return null;
  const candidate = candidates[0];
  if (typeof candidate !== "object" || candidate === null || Array.isArray(candidate)) return null;
  const content = (candidate as { content?: unknown }).content;
  if (typeof content !== "object" || content === null || Array.isArray(content)) return null;
  const parts = (content as { parts?: unknown }).parts;
  if (!Array.isArray(parts)) return null;
  const text = parts
    .map((part) => typeof part === "object" && part !== null && !Array.isArray(part) ? (part as { text?: unknown }).text : null)
    .filter((value): value is string => typeof value === "string" && Boolean(value.trim()))
    .join("\n")
    .trim();
  return text || null;
}

export class GeminiProvider implements AiProvider {
  readonly name = "gemini" as const;

  async generate(request: AiProviderRequest): Promise<AiGenerateResult> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

    const started = Date.now();
    const model = request.route.model;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: request.systemPrompt }] },
        contents: request.messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          maxOutputTokens: request.maxOutputTokens ?? 300,
          ...(request.temperature === undefined ? {} : { temperature: request.temperature }),
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Gemini request failed (${response.status}): ${detail.slice(0, 500)}`);
    }

    const text = readText(await response.json());
    if (!text) throw new Error("Gemini returned no text output.");

    return { text, route: request.route, latencyMs: Date.now() - started };
  }
}

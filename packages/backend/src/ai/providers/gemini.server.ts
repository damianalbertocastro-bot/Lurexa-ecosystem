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
    const candidateModels = Array.from(new Set([
      request.route.model,
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
    ]));

    let lastError: Error | null = null;
    for (const model of candidateModels) {
      try {
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
          const fallbackResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
            body: JSON.stringify({
              contents: [
                { role: "user", parts: [{ text: `${request.systemPrompt}\n\n${request.messages.map((m) => `${m.role}: ${m.content}`).join("\n")}` }] },
              ],
              generationConfig: {
                maxOutputTokens: request.maxOutputTokens ?? 300,
              },
            }),
          });
          if (fallbackResponse.ok) {
            const fallbackText = readText(await fallbackResponse.json());
            if (fallbackText) {
              return { text: fallbackText, route: { ...request.route, model }, latencyMs: Date.now() - started };
            }
          }
          const detail = await response.text().catch(() => "");
          lastError = new Error(`Gemini request failed (${response.status}) on ${model}: ${detail.slice(0, 300)}`);
          continue;
        }

        const text = readText(await response.json());
        if (text) {
          return { text, route: { ...request.route, model }, latencyMs: Date.now() - started };
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    throw lastError ?? new Error("Gemini returned no text output across candidate models.");
  }
}

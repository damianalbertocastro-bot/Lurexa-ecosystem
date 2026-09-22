import type { CapabilityRegistryEntry } from "@lurexa/types";
import { CAPABILITY_REGISTRY } from "@lurexa/types";
import { BusinessUsageService } from "../business-usage.server";
import { UsageLedgerService } from "../usage-ledger.server";
import { QuotaEnforcementServerService } from "../core/quota-enforcement.server";
import { resolveAuthorizedCapability } from "../capability-enforcement.server";

export interface MindAITask {
  capabilityId: string;
  product: "LEARN" | "COACH" | "TEACH" | "ADMIN" | "STUDIO" | "INSIGHT";
  task: string;
  systemInstruction: string;
  input: string;
  audioBase64?: string;
  audioMimeType?: string;
  model?: string;
  maxOutputTokens?: number;
  learnerId: string;
  organizationId: string;
}

export interface AIGatewayResult {
  text: string;
  provider: "openrouter" | "gemini" | "deterministic_fallback";
  model: string;
  capabilityId: string;
}

interface CircuitState {
  failures: number;
  openedUntil: number;
}

const PROVIDER_TIMEOUT_MS = 15_000;
const MAX_TRANSIENT_RETRIES = 1;
const CIRCUIT_FAILURE_THRESHOLD = 3;
const CIRCUIT_OPEN_MS = 30_000;
const providerCircuits = new Map<string, CircuitState>();

function circuitKey(provider: string, capabilityId: string): string {
  return `${provider}:${capabilityId}`;
}

function isCircuitOpen(key: string): boolean {
  const state = providerCircuits.get(key);
  if (!state) return false;
  if (state.openedUntil <= Date.now()) {
    providerCircuits.delete(key);
    return false;
  }
  return true;
}

function recordProviderSuccess(key: string): void {
  providerCircuits.delete(key);
}

function recordProviderFailure(key: string): void {
  const state = providerCircuits.get(key) ?? { failures: 0, openedUntil: 0 };
  state.failures += 1;
  if (state.failures >= CIRCUIT_FAILURE_THRESHOLD) state.openedUntil = Date.now() + CIRCUIT_OPEN_MS;
  providerCircuits.set(key, state);
}

function isTransientStatus(status: number): boolean {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

async function fetchProvider(
  endpoint: string,
  init: RequestInit,
): Promise<{ response: Response; latencyMs: number }> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_TRANSIENT_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
    const started = Date.now();
    try {
      const response = await fetch(endpoint, { ...init, signal: controller.signal });
      const latencyMs = Date.now() - started;
      if (response.ok || !isTransientStatus(response.status) || attempt === MAX_TRANSIENT_RETRIES) {
        return { response, latencyMs };
      }
      lastError = new Error(`Transient AI provider response: ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === MAX_TRANSIENT_RETRIES) {
        throw new Error(
          error instanceof Error && error.name === "AbortError"
            ? "AI provider request timed out."
            : "AI provider request failed.",
          { cause: error },
        );
      }
    } finally {
      clearTimeout(timer);
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }
  throw lastError instanceof Error ? lastError : new Error("AI provider request failed.");
}

function findCapability(id: string): CapabilityRegistryEntry {
  const entry = CAPABILITY_REGISTRY.find((candidate) => candidate.id === id);
  if (!entry || !entry.enabled) throw new Error("AI capability is not registered or enabled.");
  if (entry.aiProvider === "none") throw new Error("Capability does not permit an AI provider.");
  return entry;
}

function openRouterKey(): string | null {
  const value = process.env.OPENROUTER_API_KEY?.trim();
  return value || null;
}

export const AIGateway = {
  async execute(task: MindAITask): Promise<AIGatewayResult> {
    const capability = findCapability(task.capabilityId);
    if (capability.product !== task.product) throw new Error("Capability/product mismatch.");
    const entitlements = await resolveAuthorizedCapability({
      learnerId: task.learnerId,
      organizationId: task.organizationId,
      product: task.product,
      capability,
    });

    const businessApplied = await BusinessUsageService.consumeIfBusiness({
      learnerId: task.learnerId,
      organizationId: task.organizationId,
      aiTurns: 1,
      product: task.product,
    });
    if (!businessApplied) {
      const quota = await QuotaEnforcementServerService.assertAndConsumeQuota({
        actorId: task.learnerId,
        usageType: "ai_turns",
        unitsToConsume: 1,
      });
      if (!quota.allowed) throw new Error(quota.message || "AI usage quota exceeded.");
    }

    const provider = capability.aiProvider;
    const key = provider === "openrouter" ? openRouterKey() : process.env.GEMINI_API_KEY?.trim() || null;
    const model = task.model
      || (provider === "openrouter"
        ? process.env.LUREXA_AI_GATEWAY_MODEL?.trim() || "openai/gpt-4o-mini"
        : process.env.LUREXA_LEARN_TUTOR_MODEL?.trim() || "gemini-2.5-flash");

    if (!key) {
      if (capability.fallbackPolicy !== "deterministic") {
        throw new Error("The authorized AI provider is not configured for this capability.");
      }
      const fallback = "The AI provider is not configured. Please continue with the available guided activity.";
      await UsageLedgerService.record({
        product: task.product,
        capabilityId: task.capabilityId,
        provider: "deterministic_fallback",
        organizationId: task.organizationId,
        userId: task.learnerId,
        entitlementSource: entitlements.source === "business_contract" ? "business_contract" : "individual_or_explicit",
        usage: { aiTurns: 1 },
      });
      return { text: fallback, provider: "deterministic_fallback", model: "deterministic", capabilityId: task.capabilityId };
    }

    const endpoint = provider === "openrouter"
      ? "https://openrouter.ai/api/v1/chat/completions"
      : `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;

    const requestBody = provider === "openrouter"
      ? {
          model,
          messages: [
            { role: "system", content: task.systemInstruction },
            {
              role: "user",
              content: task.audioBase64
                ? [
                    { type: "text", text: task.input },
                    { type: "input_audio", input_audio: { data: task.audioBase64, format: (task.audioMimeType || "audio/webm").split("/")[1] || "webm" } },
                  ]
                : task.input,
            },
          ],
          max_tokens: task.maxOutputTokens ?? 400,
        }
      : {
          system_instruction: { parts: [{ text: task.systemInstruction }] },
          contents: [{
            role: "user",
            parts: [
              { text: task.input },
              ...(task.audioBase64 ? [{ inline_data: { mime_type: task.audioMimeType || "audio/webm", data: task.audioBase64 } }] : []),
            ],
          }],
          generationConfig: { maxOutputTokens: task.maxOutputTokens ?? 400 },
        };

    const circuit = circuitKey(provider, task.capabilityId);
    if (isCircuitOpen(circuit)) {
      if (capability.fallbackPolicy === "deterministic") {
        await UsageLedgerService.record({
          product: task.product,
          capabilityId: task.capabilityId,
          provider: "deterministic_fallback",
          organizationId: task.organizationId,
          userId: task.learnerId,
          entitlementSource: businessApplied ? "business_contract" : "individual_or_explicit",
          usage: { aiTurns: 1 },
          outcome: "circuit_open",
        });
        return { text: "The AI provider is temporarily unavailable. Please continue with the available guided activity.", provider: "deterministic_fallback", model: "deterministic", capabilityId: task.capabilityId };
      }
      throw new Error("AI provider circuit is temporarily open.");
    }

    const started = Date.now();
    let providerResponse: { response: Response; latencyMs: number };
    try {
      providerResponse = await fetchProvider(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(provider === "openrouter" ? {
            Authorization: `Bearer ${key}`,
            "HTTP-Referer": process.env.LUREXA_PUBLIC_SITE_URL || "https://lurexa.org",
            "X-Title": "Lurexa AI Gateway",
          } : {}),
        },
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      recordProviderFailure(circuit);
      if (capability.fallbackPolicy === "deterministic") {
        await UsageLedgerService.record({
          product: task.product,
          capabilityId: task.capabilityId,
          provider: "deterministic_fallback",
          organizationId: task.organizationId,
          userId: task.learnerId,
          entitlementSource: businessApplied ? "business_contract" : "individual_or_explicit",
          usage: { aiTurns: 1 },
          latencyMs: Date.now() - started,
          outcome: "provider_failure",
        });
        return { text: "The AI provider is temporarily unavailable. Please continue with the available guided activity.", provider: "deterministic_fallback", model: "deterministic", capabilityId: task.capabilityId };
      }
      throw error;
    }

    const response = providerResponse.response;
    if (!response.ok) {
      recordProviderFailure(circuit);
      const detail = (await response.text().catch(() => "")).slice(0, 300);
      throw new Error(`AI Gateway provider request failed (${response.status}): ${detail}`);
    }
    recordProviderSuccess(circuit);

    const payload = await response.json() as {
      choices?: Array<{ message?: { content?: unknown } }>;
      candidates?: Array<{ content?: { parts?: Array<{ text?: unknown }> } }>;
    };
    const text = provider === "openrouter"
      ? payload.choices?.[0]?.message?.content
      : payload.candidates?.[0]?.content?.parts?.map((part) => part.text).filter((value): value is string => typeof value === "string").join("\n");
    if (typeof text !== "string" || !text.trim()) throw new Error("AI Gateway received an empty provider response.");

    await UsageLedgerService.record({
      product: task.product,
      capabilityId: task.capabilityId,
      provider: provider === "openrouter" ? "openrouter" : "gemini",
      organizationId: task.organizationId,
      userId: task.learnerId,
      entitlementSource: businessApplied ? "business_contract" : "individual_or_explicit",
      usage: { aiTurns: 1 },
      providerModel: model,
      latencyMs: providerResponse.latencyMs,
      outcome: "success",
    });

    return { text: text.trim(), provider: provider === "openrouter" ? "openrouter" : "gemini", model, capabilityId: task.capabilityId };
  },
};

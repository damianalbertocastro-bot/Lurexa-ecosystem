import type { CapabilityRegistryEntry } from "@lurexa/types";
import { CAPABILITY_REGISTRY } from "@lurexa/types";
import { BusinessUsageService } from "../business-usage.server";
import { UsageLedgerService } from "../usage-ledger.server";

export interface MindAITask {
  capabilityId: string;
  product: "LEARN" | "COACH" | "TEACH" | "ADMIN" | "STUDIO" | "INSIGHT";
  task: string;
  systemInstruction: string;
  input: string;
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

    const businessApplied = await BusinessUsageService.consumeIfBusiness({
      learnerId: task.learnerId,
      organizationId: task.organizationId,
      aiTurns: 1,
      product: task.product,
    });

    const key = openRouterKey();
    const model = task.model || process.env.LUREXA_AI_GATEWAY_MODEL?.trim() || "openai/gpt-4o-mini";

    if (!key) {
      const fallback = "The AI provider is not configured. Please continue with the available guided activity.";
      await UsageLedgerService.record({
        product: task.product,
        capabilityId: task.capabilityId,
        provider: "deterministic_fallback",
        organizationId: task.organizationId,
        userId: task.learnerId,
        entitlementSource: businessApplied ? "business_contract" : "individual_or_explicit",
        usage: { aiTurns: 1 },
      });
      return { text: fallback, provider: "deterministic_fallback", model: "deterministic", capabilityId: task.capabilityId };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": process.env.LUREXA_PUBLIC_SITE_URL || "https://lurexa.org",
        "X-Title": "Lurexa AI Gateway",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: task.systemInstruction },
          { role: "user", content: task.input },
        ],
        max_tokens: task.maxOutputTokens ?? 400,
      }),
    });

    if (!response.ok) {
      const detail = (await response.text().catch(() => "")).slice(0, 300);
      throw new Error(`AI Gateway provider request failed (${response.status}): ${detail}`);
    }

    const payload = await response.json() as { choices?: Array<{ message?: { content?: unknown } }> };
    const text = payload.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) throw new Error("AI Gateway received an empty provider response.");

    await UsageLedgerService.record({
      product: task.product,
      capabilityId: task.capabilityId,
      provider: "openrouter",
      organizationId: task.organizationId,
      userId: task.learnerId,
      entitlementSource: businessApplied ? "business_contract" : "individual_or_explicit",
      usage: { aiTurns: 1 },
      providerModel: model,
    });

    return { text: text.trim(), provider: "openrouter", model, capabilityId: task.capabilityId };
  },
};

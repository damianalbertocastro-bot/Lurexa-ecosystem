import { getServerFirestore } from "./firebase-admin.server";

export interface UsageLedgerAggregate {
  organizationId: string;
  billingPeriod: string;
  aiTurns: number;
  voiceMinutes: number;
  businessAiTurns: number;
  businessVoiceMinutes: number;
  byProduct: Record<string, { aiTurns: number; voiceMinutes: number }>;
  byCapability: Record<string, { aiTurns: number; voiceMinutes: number }>;
  byProvider: Record<string, { aiTurns: number; voiceMinutes: number }>;
  updatedAt: string;
}

export interface UsageLedgerEvent {
  product: string;
  capabilityId: string;
  provider: string;
  organizationId: string;
  userId: string;
  entitlementSource: string;
  usage: {
    aiTurns?: number;
    voiceMinutes?: number;
  };
  providerModel?: string;
  subscriptionOrEntitlementId?: string;
  idempotencyKey?: string;
  latencyMs?: number;
  outcome?: "success" | "provider_failure" | "circuit_open" | "fallback" | "rejected";
  estimatedCostUsd?: number;
}

export const UsageLedgerService = {
  async record(event: UsageLedgerEvent): Promise<void> {
    const now = new Date();
    const key = event.idempotencyKey?.trim();
    const payload = {
      ...event,
      billingPeriod: now.toISOString().slice(0, 7),
      recordedAt: now.toISOString(),
    };
    const database = getServerFirestore();
    const aggregateRef = database.collection("usage-ledger-monthly").doc(`${event.organizationId}_${payload.billingPeriod}`);
    const ledgerRef = key ? database.collection("usage-ledger").doc(key) : database.collection("usage-ledger").doc();

    await database.runTransaction(async (transaction) => {
      const existing = key ? await transaction.get(ledgerRef) : null;
      if (existing?.exists) return;

      const aggregateSnapshot = await transaction.get(aggregateRef);
      const existingAggregate = aggregateSnapshot.exists ? aggregateSnapshot.data() : {};
      const aiTurns = event.usage.aiTurns ?? 0;
      const voiceMinutes = event.usage.voiceMinutes ?? 0;
      const increment = (current: unknown, value: number) => (typeof current === "number" ? current : 0) + value;
      const productCurrent = (existingAggregate?.byProduct?.[event.product] ?? {}) as { aiTurns?: number; voiceMinutes?: number };
      const capabilityCurrent = (existingAggregate?.byCapability?.[event.capabilityId] ?? {}) as { aiTurns?: number; voiceMinutes?: number };
      const providerCurrent = (existingAggregate?.byProvider?.[event.provider] ?? {}) as { aiTurns?: number; voiceMinutes?: number };

      const aggregate: UsageLedgerAggregate = {
        organizationId: event.organizationId,
        billingPeriod: payload.billingPeriod,
        aiTurns: increment(existingAggregate?.aiTurns, aiTurns),
        voiceMinutes: increment(existingAggregate?.voiceMinutes, voiceMinutes),
        businessAiTurns: increment(existingAggregate?.businessAiTurns, event.entitlementSource === "business_contract" ? aiTurns : 0),
        businessVoiceMinutes: increment(existingAggregate?.businessVoiceMinutes, event.entitlementSource === "business_contract" ? voiceMinutes : 0),
        byProduct: {
          ...(existingAggregate?.byProduct ?? {}),
          [event.product]: { aiTurns: increment(productCurrent.aiTurns, aiTurns), voiceMinutes: increment(productCurrent.voiceMinutes, voiceMinutes) },
        },
        byCapability: {
          ...(existingAggregate?.byCapability ?? {}),
          [event.capabilityId]: { aiTurns: increment(capabilityCurrent.aiTurns, aiTurns), voiceMinutes: increment(capabilityCurrent.voiceMinutes, voiceMinutes) },
        },
        byProvider: {
          ...(existingAggregate?.byProvider ?? {}),
          [event.provider]: { aiTurns: increment(providerCurrent.aiTurns, aiTurns), voiceMinutes: increment(providerCurrent.voiceMinutes, voiceMinutes) },
        },
        updatedAt: now.toISOString(),
      };

      if (key) transaction.create(ledgerRef, payload);
      else transaction.create(ledgerRef, payload);
      transaction.set(aggregateRef, aggregate, { merge: true });
    });
  },
};

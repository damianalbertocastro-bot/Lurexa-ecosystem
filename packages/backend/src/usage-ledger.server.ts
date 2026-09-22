import { getServerFirestore } from "./firebase-admin.server";

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
    if (key) {
      const database = getServerFirestore();
      const ref = database.collection("usage-ledger").doc(key);
      await database.runTransaction(async (transaction) => {
        const existing = await transaction.get(ref);
        if (!existing.exists) transaction.create(ref, payload);
      });
      return;
    }
    await getServerFirestore().collection("usage-ledger").add(payload);
  },
};

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
      const ref = getServerFirestore().collection("usage-ledger").doc(key);
      const existing = await ref.get();
      if (!existing.exists) await ref.create(payload);
      return;
    }
    await getServerFirestore().collection("usage-ledger").add(payload);
  },
};

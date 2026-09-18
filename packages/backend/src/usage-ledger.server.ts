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
}

export const UsageLedgerService = {
  async record(event: UsageLedgerEvent): Promise<void> {
    const now = new Date();
    await getServerFirestore().collection("usage-ledger").add({
      ...event,
      billingPeriod: now.toISOString().slice(0, 7),
      recordedAt: now.toISOString(),
    });
  },
};

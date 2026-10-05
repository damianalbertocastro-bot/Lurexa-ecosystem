import type { BusinessUsageSnapshot } from "./business-usage.server";
import type { UsageLedgerAggregate } from "./usage-ledger.server";
import { getServerFirestore } from "./firebase-admin.server";

export interface UsageReconciliationResult {
  organizationId: string;
  billingPeriod: string;
  businessAiTurns: number;
  ledgerBusinessAiTurns: number;
  businessVoiceMinutes: number;
  ledgerBusinessVoiceMinutes: number;
  balanced: boolean;
  aiTurnsDelta: number;
  voiceMinutesDelta: number;
}

export const UsageReportingService = {
  async getMonthlyAggregate(organizationId: string, billingPeriod: string): Promise<UsageLedgerAggregate | null> {
    const snapshot = await getServerFirestore()
      .collection("usage-ledger-monthly")
      .doc(`${organizationId}_${billingPeriod}`)
      .get();
    return snapshot.exists ? snapshot.data() as UsageLedgerAggregate : null;
  },

  async reconcileBusinessUsage(input: {
    usage: BusinessUsageSnapshot;
    ledgerAggregate: UsageLedgerAggregate | null;
  }): Promise<UsageReconciliationResult> {
    const ledgerBusinessAiTurns = input.ledgerAggregate?.businessAiTurns ?? 0;
    const ledgerBusinessVoiceMinutes = input.ledgerAggregate?.businessVoiceMinutes ?? 0;
    const aiTurnsDelta = input.usage.aiTurnsUsed - ledgerBusinessAiTurns;
    const voiceMinutesDelta = input.usage.voiceMinutesUsed - ledgerBusinessVoiceMinutes;
    return {
      organizationId: input.usage.organizationId,
      billingPeriod: input.usage.periodStart.slice(0, 7),
      businessAiTurns: input.usage.aiTurnsUsed,
      ledgerBusinessAiTurns,
      businessVoiceMinutes: input.usage.voiceMinutesUsed,
      ledgerBusinessVoiceMinutes,
      balanced: Math.abs(aiTurnsDelta) < 0.0001 && Math.abs(voiceMinutesDelta) < 0.0001,
      aiTurnsDelta,
      voiceMinutesDelta,
    };
  },
};

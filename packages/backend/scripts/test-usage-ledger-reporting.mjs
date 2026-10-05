/* eslint-disable no-undef */

import { getServerFirestore } from "../src/firebase-admin.server.ts";
import { UsageLedgerService } from "../src/usage-ledger.server.ts";
import { UsageReportingService } from "../src/usage-reporting.server.ts";

if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error("FIRESTORE_EMULATOR_HOST is required.");

const database = getServerFirestore();
const organizationId = "usage_reporting_test_" + Date.now();
const billingPeriod = new Date().toISOString().slice(0, 7);
const idempotencyKey = "usage-idempotency-" + Date.now();

try {
  const event = {
    product: "LEARN",
    capabilityId: "mind.conversational_roleplay",
    provider: "openrouter",
    organizationId,
    userId: "learner-a",
    entitlementSource: "business_contract",
    usage: { aiTurns: 2 },
    idempotencyKey,
    outcome: "success",
  };

  await UsageLedgerService.record(event);
  await UsageLedgerService.record(event);

  const aggregate = await UsageReportingService.getMonthlyAggregate(organizationId, billingPeriod);
  if (!aggregate) throw new Error("Monthly aggregate was not created.");
  if (aggregate.aiTurns !== 2 || aggregate.businessAiTurns !== 2) {
    throw new Error("Duplicate idempotency event incremented the aggregate.");
  }

  const reconciliation = await UsageReportingService.reconcileBusinessUsage({
    usage: {
      organizationId,
      periodStart: billingPeriod + "-01T00:00:00.000Z",
      periodEnd: billingPeriod + "-31T23:59:59.999Z",
      aiTurnsUsed: 2,
      voiceMinutesUsed: 0,
    },
    ledgerAggregate: aggregate,
  });

  if (!reconciliation.balanced) throw new Error("Business reconciliation did not balance.");
  console.log("Usage ledger idempotency and Business reconciliation checks passed.");
} finally {
  await database.collection("usage-ledger-monthly").doc(organizationId + "_" + billingPeriod).delete();
  const ledger = await database.collection("usage-ledger").where("organizationId", "==", organizationId).get();
  if (!ledger.empty) {
    const batch = database.batch();
    for (const document of ledger.docs) batch.delete(document.ref);
    await batch.commit();
  }
  await database.terminate();
}

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { stripeBillingProvider } from "../src/billing/stripe.adapter";

const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
if (!secret) {
  console.log("SKIP: set STRIPE_WEBHOOK_SECRET to execute Stripe webhook signature tests.");
  process.exit(0);
}

const payload = JSON.stringify({
  id: "evt_lurexa_signature_test",
  type: "customer.subscription.updated",
  created: Math.floor(Date.now() / 1000),
  data: { object: { id: "sub_signature_test", customer: "cus_signature_test", status: "active" } },
});

function signatureFor(timestamp: number, body: string, signatures = 1) {
  const digest = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
  return [`t=${timestamp}`, ...Array.from({ length: signatures }, () => `v1=${digest}`)].join(",");
}

const now = Math.floor(Date.now() / 1000);
const valid = await stripeBillingProvider.verifyWebhook(payload, signatureFor(now, payload, 2));
assert.equal(valid.eventId, "evt_lurexa_signature_test");

await assert.rejects(
  stripeBillingProvider.verifyWebhook(payload, signatureFor(now - 301, payload)),
  /timestamp is outside the allowed tolerance/,
);

await assert.rejects(
  stripeBillingProvider.verifyWebhook(payload, signatureFor(now, payload).replace(/v1=[^,]+/, "v1=00")),
  /Invalid Stripe webhook signature/,
);

console.log("Stripe webhook signature checks passed: valid/multiple-signature, stale-timestamp, invalid-signature.");

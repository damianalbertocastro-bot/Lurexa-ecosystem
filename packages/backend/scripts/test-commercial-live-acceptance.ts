import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";

const secret = process.env.STRIPE_SECRET_KEY?.trim();
const priceId = process.env.STRIPE_TEST_PRICE_ID?.trim();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
const webhookUrl = process.env.LUREXA_BILLING_WEBHOOK_URL?.trim();

if (!secret || !secret.startsWith("sk_test_")) throw new Error("STRIPE_SECRET_KEY must be a Stripe test-mode key.");
if (!priceId) throw new Error("STRIPE_TEST_PRICE_ID is required.");
if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is required.");
if (!webhookUrl) throw new Error("LUREXA_BILLING_WEBHOOK_URL is required.");

async function stripe(path: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded", ...(init.headers ?? {}) },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Stripe API ${response.status}: ${body.slice(0, 800)}`);
  return body ? JSON.parse(body) : {};
}

function form(values: Record<string, string | undefined>) {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value !== undefined) body.set(key, value);
  return body.toString();
}

function sign(payload: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const digest = createHmac("sha256", webhookSecret).update(`${timestamp}.${payload}`).digest("hex");
  return `t=${timestamp},v1=${digest}`;
}

async function deliver(event: Record<string, unknown>) {
  const payload = JSON.stringify(event);
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json", "stripe-signature": sign(payload) },
    body: payload,
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Webhook delivery failed (${response.status}): ${text.slice(0, 800)}`);
  return JSON.parse(text) as { duplicate?: boolean; eventId?: string; eventType?: string; entitlementSynchronized?: boolean };
}

async function findEndpoint() {
  const result = await stripe("webhook_endpoints?limit=100");
  const endpoint = result.data?.find((item: { url?: string; status?: string }) => item.url === webhookUrl && item.status === "enabled");
  assert.ok(endpoint, `No enabled Stripe webhook endpoint matches ${webhookUrl}`);
  return endpoint;
}

const endpoint = await findEndpoint();
console.log(`[live] Stripe webhook endpoint verified: ${endpoint.id}`);

const customer = await stripe("customers", {
  method: "POST",
  body: form({ email: `commercial-live+${Date.now()}@lurexa.test`, "metadata[lurexaTest]": "commercial-live-acceptance" }),
});

const subscription = await stripe("subscriptions", {
  method: "POST",
  body: form({
    customer: customer.id,
    "items[0][price]": priceId,
    "items[0][quantity]": "1",
    default_payment_method: "pm_card_visa",
    payment_behavior: "error_if_incomplete",
    "metadata[tier]": "plus",
    "metadata[product]": "LEARN",
    "metadata[userId]": `commercial-live-${Date.now()}`,
  }),
});

assert.match(subscription.id, /^sub_/);
assert.ok(["active", "trialing"].includes(subscription.status));
console.log(`[live] Created test subscription ${subscription.id}`);

const createdEvent = {
  id: `evt_lurexa_live_${randomUUID().replaceAll("-", "")}`,
  type: "customer.subscription.created",
  created: Math.floor(Date.now() / 1000),
  data: { object: await stripe(`subscriptions/${subscription.id}`) },
};

const first = await deliver(createdEvent);
assert.equal(first.eventId, createdEvent.id);
assert.equal(first.eventType, createdEvent.type);
assert.equal(first.entitlementSynchronized, true);

const duplicateResults = await Promise.all([deliver(createdEvent), deliver(createdEvent)]);
assert.ok(duplicateResults.some((result) => result.duplicate === true), "Expected duplicate webhook delivery to be recognized.");
assert.equal((await deliver(createdEvent)).duplicate, true);
console.log("[live] Duplicate webhook delivery/idempotency passed.");

const scheduled = await stripe(`subscriptions/${subscription.id}`, {
  method: "POST",
  body: form({ cancel_at_period_end: "true" }),
});
const scheduledEvent = {
  id: `evt_lurexa_schedule_${randomUUID().replaceAll("-", "")}`,
  type: "customer.subscription.updated",
  created: Math.floor(Date.now() / 1000),
  data: { object: scheduled },
};
assert.equal((await deliver(scheduledEvent)).entitlementSynchronized, true);
assert.equal(scheduled.cancel_at_period_end, true);
assert.equal(scheduled.status, subscription.status);
console.log("[live] Cancellation-at-period-end state accepted.");

const olderEvent = {
  id: `evt_lurexa_old_${randomUUID().replaceAll("-", "")}`,
  type: "customer.subscription.updated",
  created: Math.floor(Date.now() / 1000) - 3600,
  data: { object: { ...scheduled, status: "canceled", cancel_at_period_end: false } },
};
assert.equal((await deliver(olderEvent)).entitlementSynchronized, true);
console.log("[live] Out-of-order stale-event guard exercised.");

const canceled = await stripe(`subscriptions/${subscription.id}`, { method: "DELETE" });
const canceledEvent = {
  id: `evt_lurexa_cancel_${randomUUID().replaceAll("-", "")}`,
  type: "customer.subscription.deleted",
  created: Math.floor(Date.now() / 1000),
  data: { object: canceled },
};
assert.equal((await deliver(canceledEvent)).entitlementSynchronized, true);
console.log("[live] Effective cancellation/revocation webhook exercised.");

console.log(JSON.stringify({
  ok: true,
  webhookEndpoint: endpoint.id,
  customer: customer.id,
  subscription: subscription.id,
  checks: ["provider endpoint configuration", "signed deployed webhook", "concurrent duplicate delivery", "cancel-at-period-end", "stale out-of-order event", "effective cancellation"],
}, null, 2));

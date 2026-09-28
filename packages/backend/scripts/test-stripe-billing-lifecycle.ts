import assert from "node:assert/strict";

const secret = process.env.STRIPE_SECRET_KEY?.trim();
const priceId = process.env.STRIPE_TEST_PRICE_ID?.trim();
const customerId = process.env.STRIPE_TEST_CUSTOMER_ID?.trim();

if (!secret || !secret.startsWith("sk_test_")) {
  console.log("SKIP: set STRIPE_SECRET_KEY to a Stripe test-mode key to run provider-backed billing lifecycle tests.");
  process.exit(0);
}
if (!priceId) {
  console.log("SKIP: set STRIPE_TEST_PRICE_ID to a recurring Stripe test-mode Price.");
  process.exit(0);
}

async function stripe(path: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(init.headers ?? {}),
    },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Stripe API ${response.status}: ${body.slice(0, 500)}`);
  return body ? JSON.parse(body) : {};
}

function form(values: Record<string, string | undefined>) {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value !== undefined) body.set(key, value);
  return body.toString();
}

let customer = customerId;
if (!customer) {
  const created = await stripe("customers", {
    method: "POST",
    body: form({ email: `billing-test+${Date.now()}@lurexa.test`, "metadata[lurexaTest]": "billing-lifecycle" }),
  });
  customer = created.id;
}

const checkout = await stripe("checkout/sessions", {
  method: "POST",
  body: form({
    mode: "subscription",
    customer,
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: "https://example.com/billing/success",
    cancel_url: "https://example.com/billing/cancel",
  }),
});
assert.match(checkout.id, /^cs_/);
assert.match(checkout.url, /^https:\/\//);

const paymentMethod = "pm_card_visa";
const subscription = await stripe("subscriptions", {
  method: "POST",
  body: form({
    customer,
    "items[0][price]": priceId,
    default_payment_method: paymentMethod,
    payment_behavior: "error_if_incomplete",
    "metadata[tier]": "plus",
    "metadata[product]": "LEARN",
    "metadata[userId]": "billing-test-user",
  }),
});
assert.match(subscription.id, /^sub_/);
assert.ok(["active", "trialing"].includes(subscription.status), `unexpected subscription status: ${subscription.status}`);

const updated = await stripe(`subscriptions/${subscription.id}`, {
  method: "POST",
  body: form({ cancel_at_period_end: "true" }),
});
assert.equal(updated.cancel_at_period_end, true);
assert.equal(updated.status, subscription.status);

const recovered = await stripe(`subscriptions/${subscription.id}`, {
  method: "POST",
  body: form({ cancel_at_period_end: "false" }),
});
assert.equal(recovered.cancel_at_period_end, false);

const canceled = await stripe(`subscriptions/${subscription.id}`, { method: "DELETE" });
assert.equal(canceled.status, "canceled");

const invoices = await stripe(`invoices?customer=${encodeURIComponent(customer)}&limit=5`);
assert.ok(Array.isArray(invoices.data) && invoices.data.length > 0, "expected Stripe to create at least one invoice");
const invoice = invoices.data[0];
assert.ok(["draft", "open", "paid", "void", "uncollectible"].includes(invoice.status));

console.log(JSON.stringify({
  ok: true,
  checkoutSession: checkout.id,
  customer,
  subscription: subscription.id,
  invoice: invoice.id,
  checked: [
    "test-mode checkout session creation",
    "subscription creation",
    "cancel-at-period-end toggle",
    "cancellation",
    "invoice creation",
  ],
}, null, 2));

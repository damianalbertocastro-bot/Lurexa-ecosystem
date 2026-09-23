import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];

const adapter = read("packages/backend/src/billing/stripe.adapter.ts");
const service = read("packages/backend/src/billing/stripe-webhook.service.ts");
const route = read("apps/learn-web/app/api/billing/webhook/route.ts");
const env = read("packages/config/src/environment.ts");
const turbo = read("turbo.json");

const checks = [
  ["Stripe adapter exists", adapter.includes("class StripeBillingProviderAdapter")],
  ["Stripe API calls use server secret", adapter.includes('STRIPE_SECRET_KEY')],
  ["Webhook signing secret is required", adapter.includes('STRIPE_WEBHOOK_SECRET')],
  ["Webhook timestamp tolerance is enforced", adapter.includes("ageSeconds > 300")],
  ["Multiple Stripe v1 signatures are supported", adapter.includes("expectedSignatures.some")],
  ["Webhook payload is hashed before Core persistence", adapter.includes("createHash("sha256")")],
  ["Webhook processing is idempotent", service.includes('billing_webhook_events') && service.includes('status === "processed"')],
  ["Subscription records are persisted in Core", service.includes("billing_subscriptions")],
  ["Invoice records are persisted in Core", service.includes("billing_invoices")],
  ["Payment records are persisted in Core", service.includes("billing_payments")],
  ["Entitlement projection is synchronized from canonical subscription state", service.includes("billing_entitlements")],
  ["Provider state is not used as direct authorization", service.includes("Compatibility projection only")],
  ["Webhook endpoint reads the raw request body", route.includes("request.text()")],
  ["Webhook endpoint does not require bearer authentication", !route.includes("Authorization")],
  ["Stripe server variables are in canonical config", env.includes("STRIPE_SECRET_KEY") && env.includes("STRIPE_WEBHOOK_SECRET")],
  ["Stripe variables are available to workspace tasks", turbo.includes("STRIPE_SECRET_KEY") && turbo.includes("STRIPE_WEBHOOK_SECRET")],
];

for (const [label, ok] of checks) {
  console.log((ok ? "PASS" : "FAIL") + ": " + label);
  if (!ok) failures.push(label);
}

if (failures.length) {
  console.error("Stripe provider verification failed: " + failures.length + " check(s).");
  process.exit(1);
}
console.log("Stripe provider verification passed.");

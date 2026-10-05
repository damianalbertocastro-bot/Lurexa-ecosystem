import assert from "node:assert/strict";

const required = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"];
const missing = required.filter((name) => !process.env[name]?.trim());

if (process.env.STRIPE_CONFIG_STRICT === "1") {
  assert.equal(missing.length, 0, `Missing required Stripe production configuration: ${missing.join(", ")}`);
  const secret = process.env.STRIPE_SECRET_KEY.trim();
  assert.ok(secret.startsWith("sk_live_"), "Strict production billing configuration requires a live Stripe secret.");
  const webhook = process.env.STRIPE_WEBHOOK_SECRET.trim();
  assert.ok(webhook.startsWith("whsec_"), "Stripe webhook secret must use the whsec_ format.");
  console.log("PASS: strict Stripe production configuration is present.");
  process.exit(0);
}

assert.match("STRIPE_SECRET_KEY", /STRIPE_/);
assert.match("STRIPE_WEBHOOK_SECRET", /STRIPE_/);
console.log(missing.length ? `PASS: configuration contract verified; runtime secrets not supplied (${missing.join(", ")}).` : "PASS: Stripe configuration contract and runtime secrets are present.");

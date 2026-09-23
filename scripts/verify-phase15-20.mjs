import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => { console.error("[phase15-20] " + message); process.exitCode = 1; };

const required = [
  "Docs/Engineering/LUREXA_AI_GATEWAY_RESILIENCE.md",
  "Docs/Engineering/LUREXA_RUNTIME_AUTHORIZATION_AUDIT.md",
  "Docs/Engineering/LUREXA_USAGE_REPORTING.md",
  "Docs/Product/LUREXA_COMMERCIAL_UX_SOURCE_OF_TRUTH.md",
  "Docs/Product/LUREXA_PRODUCT_EXPANSION_READINESS_GATE.md",
  "packages/backend/src/usage-reporting.server.ts",
];

for (const file of required) if (!fs.existsSync(path.join(root, file))) fail("Missing phase artifact: " + file);

const gateway = read("packages/backend/src/mind/ai-gateway.server.ts");
for (const token of ["PROVIDER_TIMEOUT_MS = 15_000", "MAX_TRANSIENT_RETRIES = 1", "CIRCUIT_FAILURE_THRESHOLD = 3", "CIRCUIT_OPEN_MS = 30_000", "isTransientStatus"]) {
  if (!gateway.includes(token)) fail("AI resilience policy missing: " + token);
}

const registry = read("packages/types/src/capability-registry.ts");
if (!registry.includes('id: "coach.live_streaming"')) fail("Coach live streaming is not registered as a capability.");
if ((registry.match(/id: "business.analytics"/g) || []).length !== 1) fail("Business analytics capability is duplicated.");
if ((registry.match(/id: "business.sso"/g) || []).length !== 1) fail("Business SSO capability is duplicated.");
if (!registry.includes('entitlementCapability: "live_streaming"')) fail("Coach live streaming lacks an entitlement capability.");

const coachLive = read("packages/backend/src/coach-live-streaming.server.ts");
if (coachLive.includes("DEFAULT_TIER_QUOTAS") || coachLive.includes("tier: SubscriptionTier")) fail("Coach live streaming still trusts direct tier quota input.");
if (!coachLive.includes("resolveAuthorizedCapability")) fail("Coach live streaming does not use server-owned capability authorization.");

const ledger = read("packages/backend/src/usage-ledger.server.ts");
for (const token of ["usage-ledger-monthly", "businessAiTurns", "businessVoiceMinutes", "idempotencyKey"]) {
  if (!ledger.includes(token)) fail("Usage reporting contract missing: " + token);
}

const pricing = read("packages/types/src/subscription.ts");
if (!pricing.includes("annualPriceMonthly")) fail("Canonical annual pricing field is missing.");
if (!pricing.includes("priceMonthly: 9.99") || !pricing.includes("priceMonthly: 19.99")) fail("Canonical Plus/Ultra prices are missing.");

const learnBilling = read("apps/learn-web/app/billing/page.tsx");
if (!learnBilling.includes("LUREXA_PRICING_PLANS")) fail("Learn billing is not consuming canonical pricing definitions.");

const matrix = read("Docs/Product/LUREXA_TESTING_MATRIX.md");
for (const profile of ["Basic learner", "Plus Learn", "Plus Coach", "Ultra", "Teach Basic", "Teach Plus", "Campus Standard", "Business contract with baseline capabilities", "Business contract with expanded capabilities", "Business contract with custom capabilities"]) {
  if (!matrix.includes(profile)) fail("Testing matrix missing: " + profile);
}

const readiness = read("Docs/Product/LUREXA_PRODUCT_EXPANSION_READINESS_GATE.md");
for (const token of ["Core owns", "Mind interprets", "Campus is an institutional orchestration shell", "server-side authorization", "accessibility validation", "deployment topology validation"]) {
  if (!readiness.includes(token)) fail("Expansion readiness gate missing: " + token);
}

if (!process.exitCode) console.log("[phase15-20] Phase 15-20 verification passed.");

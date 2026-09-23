import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "Docs/Product/LUREXA_CAMPUS_CAPABILITY_MATRIX.md",
  "Docs/Product/LUREXA_BUSINESS_SPECIFICATION.md",
  "Docs/Product/LUREXA_CAPABILITY_REGISTRY.md",
  "Docs/Product/LUREXA_AI_GATEWAY_ARCHITECTURE.md",
  "Docs/Product/LUREXA_SPEECH_GATEWAY_ARCHITECTURE.md",
  "Docs/Product/LUREXA_PRICING_UX_RECONCILIATION.md",
  "Docs/Product/LUREXA_ENFORCEMENT_ARCHITECTURE.md",
  "Docs/Product/LUREXA_USAGE_ACCOUNTING.md",
  "Docs/Product/LUREXA_TESTING_MATRIX.md",
  "packages/types/src/capability-registry.ts",
  "packages/backend/src/mind/ai-gateway.server.ts",
  "packages/backend/src/speech-gateway.server.ts",
  "packages/backend/src/usage-ledger.server.ts",
];

const fail = (message) => {
  console.error("[commercial-capability] " + message);
  process.exitCode = 1;
};

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) fail("Missing required artifact: " + file);
}

const registry = fs.readFileSync(path.join(root, "packages/types/src/capability-registry.ts"), "utf8");
for (const field of ["owner", "product", "planEntitlementSource", "entitlementCapability", "quota", "aiProvider", "speechProvider", "fallbackPolicy", "authorizationRequirement", "organizationScope"]) {
  if (!registry.includes(field)) fail("Capability registry is missing required field: " + field);
}
if (!registry.includes("elevenlabs")) fail("Registry must encode explicit ElevenLabs capability policy.");
if (!registry.includes("mind.conversational_roleplay")) fail("Registry must include first-class conversational roleplay.");
if (!registry.includes("mind.speech_analysis")) fail("Registry must include first-class speech analysis.");

const gateway = fs.readFileSync(path.join(root, "packages/backend/src/mind/ai-gateway.server.ts"), "utf8");
if (!gateway.includes("openrouter.ai/api/v1/chat/completions")) fail("AI Gateway is not connected to the OpenRouter endpoint.");
if (!gateway.includes("Capability/product mismatch")) fail("AI Gateway must reject capability/product mismatches.");

const speech = fs.readFileSync(path.join(root, "packages/backend/src/speech-gateway.server.ts"), "utf8");
if (!speech.includes('entitlements.capabilities.includes("premium_voice")')) fail("Speech Gateway provider selection must be entitlement-driven.");
if (!speech.includes('input.capabilityId === "coach.premium_voice"')) fail("Speech Gateway must scope ElevenLabs to Coach premium voice capability.");
if (!speech.includes("Requested speech provider is not permitted")) fail("Speech Gateway must reject client/provider mismatches.");

const business = fs.readFileSync(path.join(root, "Docs/Product/LUREXA_BUSINESS_SPECIFICATION.md"), "utf8");
if (business.includes("Business Basic") || business.includes("Business Pro") || business.includes("Business Enterprise")) fail("Business specification must not introduce rigid public bundles.");
if (!business.includes("No Business price")) fail("Business specification must explicitly prohibit inferred/fabricated prices.");

const campus = fs.readFileSync(path.join(root, "Docs/Product/LUREXA_CAMPUS_CAPABILITY_MATRIX.md"), "utf8");
if (!campus.includes("enterprise") || !campus.includes("migration")) fail("Campus matrix must preserve enterprise as migration-only legacy input.");

const forbiddenDirectProviderPatterns = [
  ["Learn tutor", "packages/backend/src/learn-tutor.server.ts", /generativelanguage\.googleapis\.com|openrouter\.ai/],
  ["Learn curriculum audio", "packages/backend/src/learn-curriculum-audio.server.ts", /TextToSpeechClient|generativelanguage\.googleapis\.com|elevenlabs\.io/],
];
for (const [label, file, pattern] of forbiddenDirectProviderPatterns) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  if (pattern.test(content)) fail(label + " contains a direct provider integration outside its gateway.");
}

const pricingPage = fs.readFileSync(path.join(root, "apps/web/app/page.tsx"), "utf8");
if (/Enterprise Business|Enterprise%20Fluency|enterpriseTitle|enterpriseCta/i.test(pricingPage)) {
  fail("Public ecosystem pricing still contains legacy Enterprise terminology.");
}

const requiredProfiles = ["Basic learner", "Plus Learn", "Plus Coach", "Ultra", "Teach Basic", "Teach Plus", "Verified educator", "Campus Community", "Campus Standard", "Campus Pro", "Campus Enterprise legacy migration", "Business contract with baseline capabilities", "Business contract with expanded capabilities", "Business contract with custom capabilities"];
const matrix = fs.readFileSync(path.join(root, "Docs/Product/LUREXA_TESTING_MATRIX.md"), "utf8");
for (const profile of requiredProfiles) if (!matrix.includes(profile)) fail("Testing matrix missing: " + profile);

console.log("[commercial-capability] Phase 6-15 architecture verification passed.");

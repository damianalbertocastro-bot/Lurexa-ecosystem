import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const checks = [
  ["canonical commercial specification exists", fs.existsSync(path.join(root, "Docs/Product/LUREXA_COMMERCIAL_SPECIFICATION.md"))],
  ["billing page contains Business contract model", read("apps/learn-web/app/billing/page.tsx").includes("Business is an organization contract")],
  ["Plus includes product-scoped ElevenLabs", read("apps/learn-web/app/billing/page.tsx").includes("Premium ElevenLabs voice for the subscribed product")],
  ["Ultra is Learn + Coach", read("apps/learn-web/app/billing/page.tsx").includes("Full Learn + Coach access")],
  ["Business contract capability model exists", read("packages/types/src/subscription.ts").includes("interface BusinessContract")],
  ["Business is quote based", read("packages/types/src/subscription.ts").includes('pricing: "contract_quote"')],
  ["Capability-level entitlement resolver exists", read("packages/backend/src/subscription.service.ts").includes("resolveEntitlements")],
  ["Business pooled usage accounting contract exists", read("packages/types/src/subscription.ts").includes("BusinessUsageRecord")],
  ["Business usage enforcement check exists", read("packages/backend/src/subscription.service.ts").includes("canConsumeBusinessUsage")],
  ["Persistent Business usage service exists", fs.existsSync(path.join(root, "packages/backend/src/business-usage.server.ts"))],
  ["Persistent usage uses a Firestore transaction", read("packages/backend/src/business-usage.server.ts").includes("runTransaction")],
  ["Business contract is organization-scoped", read("packages/backend/src/business-usage.server.ts").includes('collection("organizations").doc(input.organizationId)')],
  ["Business runtime usage helper exists", read("packages/backend/src/business-usage.server.ts").includes("consumeIfBusiness")],
  ["Business runtime enforces contracted product access", read("packages/backend/src/business-usage.server.ts").includes("does not grant access to")],
  ["Coach standard turns use Business pooled usage", read("packages/backend/src/coach-platform.server.ts").includes("BusinessUsageService.consumeIfBusiness")],
  ["Coach cascaded turns use Business pooled usage", read("packages/backend/src/coach-platform.server.ts").includes("const voiceMinutes = input.audioDurationMs")],
  ["Coach streaming is entitlement-gated", read("packages/backend/src/coach-platform.server.ts").includes("Business monthly voice allowance exceeded.") && read("packages/backend/src/coach-platform.server.ts").includes('usageType: "streaming_audio"')],
  ["Learn tutor AI turns use Business pooled usage", read("packages/backend/src/learn-tutor.server.ts").includes("BusinessUsageService.consumeIfBusiness")],
  ["Learn tutor can meter audio duration", read("packages/types/src/learning-experience.ts").includes("audioDurationMs?: number")],
  ["Admin Business pricing is contract-based", !read("apps/admin-portal/app/billing/page.tsx").includes("Business Custom ($12/seat/mo)")],
  ["Campus seat defaults do not depend on legacy Enterprise", !read("packages/backend/src/campus-platform.server.ts").includes('orgData.plan === "enterprise"')],
  ["legacy Enterprise is not a tier hierarchy rank", !read("packages/backend/src/subscription.service.ts").includes("enterprise: 4")],
];

const failures = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) console.log(`${ok ? "PASS" : "FAIL"}: ${label}`);
if (failures.length) {
  process.exitCode = 1;
  console.error(`Commercial verification failed: ${failures.length} check(s).`);
} else {
  console.log("Commercial reconciliation verification passed.");
}

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

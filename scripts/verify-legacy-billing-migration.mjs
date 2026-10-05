import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];

const billing = read("packages/types/src/commercial-billing.ts");
const migration = read("packages/backend/src/billing/legacy-billing-migration.ts");
const admin = read("packages/backend/src/core/platform-admin.server.ts");
const route = read("apps/admin-portal/app/api/admin/billing/route.ts");
const page = read("apps/admin-portal/app/billing/page.tsx");

const checks = [
  ["canonical admin billing type exists", billing.includes("AdminBillingAccount")],
  ["canonical organization billing record exists", billing.includes("CanonicalOrganizationBillingRecord")],
  ["legacy billing types are explicitly compatibility-only", read("packages/types/src/billing.ts").includes("@deprecated Legacy compatibility types")],
  ["legacy enterprise is migration-only", migration.includes("enterprise_legacy_migration")],
  ["legacy plan is recorded as provenance", migration.includes("legacyPlan") && migration.includes("migratedFrom")],
  ["business migration remains quote based", migration.includes('pricing: "contract_quote"')],
  ["migration is non-destructive when canonical billing exists", admin.includes('data.billing?.schemaVersion === 1')],
  ["migration has an authenticated superadmin endpoint", route.includes("export async function POST") && route.includes("migrateLegacyBillingAccounts")],
  ["admin GET reads canonical billing projection", admin.includes("CanonicalOrganizationBillingRecord") && admin.includes("data.billing"),
  ],
  ["seat updates write canonical billing only", admin.includes("await docRef.set({ billing: next"),
  ],
  ["admin no longer sends legacy plan tier", !page.includes("planTier:")],
  ["admin no longer calculates public per-seat revenue", !page.includes("pricePerSeatMonthlyUsd")],
  ["admin does not fabricate payment method data", !admin.includes('paymentMethodLast4: "4242"')],
  ["admin does not fabricate invoices", !admin.includes("inv_")],
];

for (const [label, ok] of checks) {
  console.log((ok ? "PASS" : "FAIL") + ": " + label);
  if (!ok) failures.push(label);
}

if (failures.length) {
  console.error("Legacy billing migration verification failed: " + failures.length + " check(s).");
  process.exit(1);
}
console.log("Legacy billing migration verification passed.");

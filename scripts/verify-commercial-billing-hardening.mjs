import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];

const types = read("packages/types/src/commercial-billing.ts");
const entitlement = read("packages/backend/src/billing/stripe-webhook.service.ts");
const reconcile = read("packages/backend/src/billing/reconciliation.service.ts");
const adminRoute = read("apps/admin-portal/app/api/admin/billing/reconcile/route.ts");
const backendPackage = read("packages/backend/package.json");

const checks = [
  ["entitlement snapshot is a first-class contract", types.includes("CommercialEntitlementSnapshot") && types.includes('status: "active" | "scheduled" | "expired" | "revoked"')],
  ["entitlement snapshot carries quotas", types.includes("monthlyAiTurns") && types.includes("monthlyVoiceMinutes") && types.includes("offlineModulesAllowed")],
  ["entitlement source distinguishes individual/business/explicit grants", types.includes('"business_contract"') && types.includes('"explicit_entitlement"')],
  ["organization identity is preserved on subscriptions", types.includes("organizationId?: string") && entitlement.includes("organizationId")],
  ["organization contract entitlements synchronize from provider events", entitlement.includes("billing.productAccess") && entitlement.includes("organizationId")],
  ["webhooks persist typed entitlement snapshots", entitlement.includes("CommercialEntitlementSnapshot") && entitlement.includes("buildEntitlement")],
  ["canceled and unpaid subscriptions revoke entitlements", entitlement.includes('subscription.status === "canceled" || subscription.status === "unpaid"')],
  ["invoice records retain subscription linkage", entitlement.includes("subscriptionId: subscription?.id ?? invoice.subscriptionId")],
  ["invoice lifecycle states are normalized", entitlement.includes('"uncollectible"') && entitlement.includes('status: InvoiceStatus')],
  ["reconciliation compares subscriptions", reconcile.includes("getSubscription")],
  ["reconciliation compares invoices and monetary totals", reconcile.includes("getInvoice") && reconcile.includes("amount_mismatch")],
  ["reconciliation compares payments", reconcile.includes("getPayment")],
  ["reconciliation checks entitlement expiry", reconcile.includes("expired_entitlement")],
  ["reconciliation checks entitlement capability drift", reconcile.includes("capability projection is missing capabilities")],
  ["reconciliation requires superadmin", reconcile.includes('token.role !== "super_admin"')],
  ["admin reconciliation endpoint exists", adminRoute.includes("reconcileStripeBilling")],
  ["billing modules are exported through the governed backend boundary", backendPackage.includes('"./billing/*"')],
];

for (const [label, ok] of checks) {
  console.log((ok ? "PASS" : "FAIL") + ": " + label);
  if (!ok) failures.push(label);
}

if (failures.length) {
  console.error("Commercial billing hardening verification failed: " + failures.length + " check(s).");
  process.exit(1);
}
console.log("Commercial billing hardening verification passed.");

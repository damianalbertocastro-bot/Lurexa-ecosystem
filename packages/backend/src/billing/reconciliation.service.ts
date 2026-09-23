import type {
  BillingReconciliationIssue,
  CommercialEntitlementSnapshot,
  CommercialInvoice,
  CommercialPayment,
  CommercialSubscription,
} from "@lurexa/types";
import { SubscriptionService } from "../subscription.service";
import { getServerFirestore } from "../firebase-admin.server";
import { stripeBillingProvider } from "./stripe.adapter";

function sameNumber(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.01;
}

function issue(
  entity: BillingReconciliationIssue["entity"],
  entityId: string,
  code: BillingReconciliationIssue["code"],
  details: string,
): BillingReconciliationIssue {
  return { entity, entityId, code, details, detectedAt: new Date().toISOString() };
}

export async function reconcileStripeBilling(input?: {
  customerId?: string;
  limit?: number;
}): Promise<{
  checked: number;
  issues: BillingReconciliationIssue[];
  reconciledAt: string;
}> {
  const database = getServerFirestore();
  const limit = Math.min(Math.max(input?.limit ?? 100, 1), 500);
  const [subscriptionsSnapshot, invoicesSnapshot, paymentsSnapshot, entitlementsSnapshot] = await Promise.all([
    database.collection("billing_subscriptions").limit(limit).get(),
    database.collection("billing_invoices").limit(limit).get(),
    database.collection("billing_payments").limit(limit).get(),
    database.collection("billing_entitlements").limit(limit).get(),
  ]);

  const issues: BillingReconciliationIssue[] = [];
  let checked = 0;

  const subscriptions = subscriptionsSnapshot.docs
    .map((doc) => doc.data() as CommercialSubscription)
    .filter((record) => !input?.customerId || record.customerId === input.customerId);

  for (const local of subscriptions) {
    checked += 1;
    if (!local.providerSubscriptionId) {
      issues.push(issue("subscription", local.id, "missing_canonical", "Canonical subscription has no provider subscription reference."));
      continue;
    }
    try {
      const provider = await stripeBillingProvider.getSubscription(local.providerSubscriptionId);
      if (!provider) {
        issues.push(issue("subscription", local.id, "missing_canonical", "Provider subscription could not be retrieved."));
        continue;
      }
      if (provider.status !== local.status) {
        issues.push(issue("subscription", local.id, "status_mismatch", `Canonical status is ${local.status}; provider status is ${provider.status}.`));
      }
      if (provider.currentPeriodStart !== local.currentPeriodStart || provider.currentPeriodEnd !== local.currentPeriodEnd) {
        issues.push(issue("subscription", local.id, "period_mismatch", "Canonical subscription period differs from provider state."));
      }
    } catch (error) {
      issues.push(issue("subscription", local.id, "provider_reference_mismatch", error instanceof Error ? error.message : "Provider lookup failed."));
    }
  }

  const invoices = invoicesSnapshot.docs
    .map((doc) => doc.data() as CommercialInvoice)
    .filter((record) => !input?.customerId || record.customerId === input.customerId);

  for (const local of invoices) {
    checked += 1;
    if (!local.providerInvoiceId) {
      issues.push(issue("invoice", local.id, "missing_canonical", "Canonical invoice has no provider invoice reference."));
      continue;
    }
    try {
      const provider = await stripeBillingProvider.getInvoice(local.providerInvoiceId);
      if (!provider) {
        issues.push(issue("invoice", local.id, "missing_canonical", "Provider invoice could not be retrieved."));
        continue;
      }
      if (provider.status !== local.status) {
        issues.push(issue("invoice", local.id, "status_mismatch", `Canonical status is ${local.status}; provider status is ${provider.status}.`));
      }
      if (!sameNumber(provider.totalUsd, local.totalUsd) || !sameNumber(provider.subtotalUsd, local.subtotalUsd) || !sameNumber(provider.taxUsd, local.taxUsd)) {
        issues.push(issue("invoice", local.id, "amount_mismatch", "Canonical invoice monetary totals differ from provider state."));
      }
      if (provider.billingPeriodStart !== local.billingPeriodStart || provider.billingPeriodEnd !== local.billingPeriodEnd) {
        issues.push(issue("invoice", local.id, "period_mismatch", "Canonical invoice billing period differs from provider state."));
      }
    } catch (error) {
      issues.push(issue("invoice", local.id, "provider_reference_mismatch", error instanceof Error ? error.message : "Provider lookup failed."));
    }
  }

  const payments = paymentsSnapshot.docs
    .map((doc) => doc.data() as CommercialPayment)
    .filter((record) => !input?.customerId || record.customerId === input.customerId);

  for (const local of payments) {
    checked += 1;
    if (!local.providerPaymentId) {
      issues.push(issue("payment", local.id, "missing_canonical", "Canonical payment has no provider payment reference."));
      continue;
    }
    try {
      const provider = await stripeBillingProvider.getPayment(local.providerPaymentId);
      if (!provider) {
        issues.push(issue("payment", local.id, "missing_canonical", "Provider payment could not be retrieved."));
        continue;
      }
      if (provider.status !== local.status) {
        issues.push(issue("payment", local.id, "status_mismatch", `Canonical status is ${local.status}; provider status is ${provider.status}.`));
      }
      if (!sameNumber(provider.amountUsd, local.amountUsd)) {
        issues.push(issue("payment", local.id, "amount_mismatch", "Canonical payment amount differs from provider state."));
      }
    } catch (error) {
      issues.push(issue("payment", local.id, "provider_reference_mismatch", error instanceof Error ? error.message : "Provider lookup failed."));
    }
  }

  const entitlements = entitlementsSnapshot.docs
    .map((doc) => doc.data() as CommercialEntitlementSnapshot)
    .filter((record) => !input?.customerId || record.customerId === input.customerId);

  for (const entitlement of entitlements) {
    checked += 1;
    if (entitlement.status === "active" && entitlement.expiresAt && Date.parse(entitlement.expiresAt) <= Date.now()) {
      issues.push(issue("entitlement", entitlement.id ?? entitlement.subscriptionId ?? "unknown", "expired_entitlement", "Entitlement is marked active but its expiry is in the past."));
    }
    if (entitlement.source === "individual_subscription" && entitlement.subscriptionId) {
      const subscription = subscriptions.find((record) => record.id === entitlement.subscriptionId);
      if (subscription) {
        const expected = subscription.product
          ? SubscriptionService.resolveEntitlements({
              tier: subscription.tier,
              product: subscription.product,
              subscribedProduct: subscription.product,
            })
          : null;
        if (expected && expected.capabilities.some((capability) => !entitlement.capabilities.includes(capability))) {
          issues.push(issue("entitlement", entitlement.id ?? entitlement.subscriptionId, "status_mismatch", "Entitlement capability projection is missing capabilities resolved from the canonical subscription."));
        }
      }
    }
  }

  return { checked, issues, reconciledAt: new Date().toISOString() };
}

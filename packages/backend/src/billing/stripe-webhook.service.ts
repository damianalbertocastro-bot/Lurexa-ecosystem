import type { CommercialEntitlementSnapshot, CommercialInvoice, CommercialPayment, CommercialSubscription, BillingWebhookEvent } from "@lurexa/types";
import { SubscriptionService } from "../subscription.service";
import { getServerFirestore } from "../firebase-admin.server";
import { stripeBillingProvider } from "./stripe.adapter";

type StripeObject = Record<string, unknown>;
type StripeEvent = { id: string; type: string; data: { object: StripeObject } };

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

function metadataOf(object: StripeObject): StripeObject {
  return (object.metadata as StripeObject | undefined) ?? {};
}

function canonicalTier(value: unknown): "basic" | "plus" | "ultra" | null {
  const tier = String(value ?? "").toLowerCase();
  return tier === "basic" || tier === "plus" || tier === "ultra" ? tier : null;
}

function canonicalProduct(value: unknown): CommercialSubscription["product"] {
  const product = String(value ?? "");
  return ["LEARN", "COACH", "TEACH", "ADMIN", "STUDIO", "INSIGHT"].includes(product)
    ? product as CommercialSubscription["product"]
    : undefined;
}

function subscriptionFromEvent(event: StripeEvent): CommercialSubscription | null {
  const object = event.data.object;
  const metadata = metadataOf(object);
  const tier = canonicalTier(metadata.tier);
  const customerId = stringValue(object.customer);
  const subscriptionId = stringValue(object.id);
  if (!tier || !customerId || !subscriptionId) return null;

  const status = String(object.status ?? "incomplete");
  const normalizedStatus = ["trialing", "active", "past_due", "canceled", "incomplete", "unpaid"].includes(status)
    ? status as CommercialSubscription["status"]
    : "incomplete";

  return {
    id: `stripe_${subscriptionId}`,
    customerId,
    userId: stringValue(metadata.userId),
    tier,
    product: canonicalProduct(metadata.product),
    billingInterval: "monthly",
    status: normalizedStatus,
    provider: "stripe",
    providerSubscriptionId: subscriptionId,
    currentPeriodStart: typeof object.current_period_start === "number"
      ? new Date(object.current_period_start * 1000).toISOString()
      : new Date().toISOString(),
    currentPeriodEnd: typeof object.current_period_end === "number"
      ? new Date(object.current_period_end * 1000).toISOString()
      : new Date().toISOString(),
    cancelAtPeriodEnd: Boolean(object.cancel_at_period_end),
  };
}

function invoiceFromEvent(event: StripeEvent): CommercialInvoice | null {
  const object = event.data.object;
  const id = stringValue(object.id);
  const customerId = stringValue(object.customer);
  if (!id || !customerId) return null;
  const periodStart = typeof object.period_start === "number" ? new Date(object.period_start * 1000).toISOString() : new Date().toISOString();
  const periodEnd = typeof object.period_end === "number" ? new Date(object.period_end * 1000).toISOString() : periodStart;
  const transitions = object.status_transitions as StripeObject | undefined;
  return {
    id: `stripe_${id}`,
    customerId,
    currency: "USD",
    billingPeriodStart: periodStart,
    billingPeriodEnd: periodEnd,
    subtotalUsd: Number(object.subtotal ?? 0) / 100,
    taxUsd: Number(object.tax ?? 0) / 100,
    totalUsd: Number(object.total ?? 0) / 100,
    status: ["draft", "open", "paid", "void", "uncollectible"].includes(String(object.status))
      ? String(object.status) as CommercialInvoice["status"]
      : "draft",
    providerInvoiceId: id,
    issuedAt: typeof object.created === "number" ? new Date(object.created * 1000).toISOString() : undefined,
    dueAt: typeof object.due_date === "number" ? new Date(object.due_date * 1000).toISOString() : undefined,
    paidAt: typeof transitions?.paid_at === "number" ? new Date(transitions.paid_at * 1000).toISOString() : undefined,
  };
}

function paymentFromInvoiceEvent(event: StripeEvent, status: CommercialPayment["status"]): CommercialPayment | null {
  const object = event.data.object;
  const paymentId = stringValue(object.payment_intent);
  const customerId = stringValue(object.customer);
  if (!paymentId || !customerId) return null;
  return {
    id: `stripe_${paymentId}`,
    customerId,
    invoiceId: stringValue(object.id) ? `stripe_${object.id}` : undefined,
    currency: "USD",
    amountUsd: Number(object.amount_paid ?? object.amount_due ?? 0) / 100,
    status,
    provider: "stripe",
    providerPaymentId: paymentId,
    createdAt: typeof object.created === "number" ? new Date(object.created * 1000).toISOString() : new Date().toISOString(),
  };
}

function capabilitiesFor(subscription: CommercialSubscription): ReturnType<typeof SubscriptionService.resolveEntitlements> | null {
  if (!subscription.product) return null;
  if (subscription.status === "canceled" || subscription.status === "unpaid") return {
    product: subscription.product,
    capabilities: [],
    monthlyAiTurns: 0,
    monthlyVoiceMinutes: 0,
    offlineModulesAllowed: 0,
    streamingAudioEnabled: false,
    source: "individual_tier",
  };
  return SubscriptionService.resolveEntitlements({
    tier: subscription.tier,
    product: subscription.product,
    subscribedProduct: subscription.product,
  });
}

export async function processStripeWebhook(payload: string, signature: string): Promise<{
  duplicate: boolean;
  eventId: string;
  eventType: string;
  entitlementSynchronized: boolean;
}> {
  const verified = await stripeBillingProvider.verifyWebhook(payload, signature);
  const event = verified.rawEvent as StripeEvent;
  const normalized: BillingWebhookEvent = stripeBillingProvider.normalizeWebhookEvent({
    eventId: verified.eventId,
    eventType: verified.eventType,
    payloadHash: verified.payloadHash,
    receivedAt: new Date().toISOString(),
  });

  const database = getServerFirestore();
  const eventRef = database.collection("billing_webhook_events").doc(normalized.id);
  const existing = await eventRef.get();
  if (existing.exists && existing.data()?.status === "processed") {
    return { duplicate: true, eventId: normalized.providerEventId, eventType: normalized.eventType, entitlementSynchronized: true };
  }

  let subscription: CommercialSubscription | null = null;
  if (event.type.startsWith("customer.subscription.") || event.type === "checkout.session.completed") {
    if (event.type === "checkout.session.completed") {
      const subscriptionId = stringValue(event.data.object.subscription);
      subscription = subscriptionId ? await stripeBillingProvider.getSubscription(subscriptionId) : null;
      if (subscription) {
        const sessionMetadata = metadataOf(event.data.object);
        subscription = {
          ...subscription,
          userId: subscription.userId ?? stringValue(sessionMetadata.userId),
          product: subscription.product ?? canonicalProduct(sessionMetadata.product),
          tier: subscription.tier ?? "basic",
        };
      }
    } else {
      subscription = subscriptionFromEvent(event);
      if (subscription?.providerSubscriptionId) {
        const providerSubscription = await stripeBillingProvider.getSubscription(subscription.providerSubscriptionId);
        if (providerSubscription) subscription = { ...providerSubscription, userId: subscription.userId ?? providerSubscription.userId, product: subscription.product ?? providerSubscription.product };
      }
    }
  }

  const invoice = event.type.startsWith("invoice.") ? invoiceFromEvent(event) : null;
  if (invoice) {
    const providerSubscriptionId = stringValue(event.data.object.subscription);
    if (providerSubscriptionId) {
      const providerSubscription = await stripeBillingProvider.getSubscription(providerSubscriptionId);
      if (providerSubscription) subscription = providerSubscription;
    }
  }
  const payment =
    event.type === "invoice.paid" ? paymentFromInvoiceEvent(event, "succeeded")
    : event.type === "invoice.payment_failed" ? paymentFromInvoiceEvent(event, "failed")
    : null;

  const buildEntitlement = (subscription: CommercialSubscription, entitlement: ReturnType<typeof SubscriptionService.resolveEntitlements>): CommercialEntitlementSnapshot => ({
    id: `${subscription.id}_${subscription.product}`,
    subscriptionId: subscription.id,
    customerId: subscription.customerId,
    userId: subscription.userId,
    product: subscription.product!,
    capabilities: entitlement.capabilities,
    monthlyAiTurns: entitlement.monthlyAiTurns,
    monthlyVoiceMinutes: entitlement.monthlyVoiceMinutes,
    offlineModulesAllowed: entitlement.offlineModulesAllowed,
    streamingAudioEnabled: entitlement.streamingAudioEnabled,
    effectiveAt: subscription.currentPeriodStart,
    expiresAt: subscription.status === "canceled" || subscription.status === "unpaid" ? subscription.currentPeriodEnd : undefined,
    source: "individual_subscription",
    status: subscription.status === "canceled" || subscription.status === "unpaid" ? "revoked" : "active",
    updatedAt: new Date().toISOString(),
  });

  let entitlementSynchronized = false;
  await database.runTransaction(async (transaction) => {
    const current = await transaction.get(eventRef);
    if (current.exists && current.data()?.status === "processed") return;

    transaction.set(eventRef, normalized, { merge: true });

    if (subscription) {
      const subscriptionRef = database.collection("billing_subscriptions").doc(subscription.id);
      transaction.set(subscriptionRef, subscription, { merge: true });

      const entitlement = capabilitiesFor(subscription);
      if (entitlement && subscription.userId) {
        const entitlementRef = database.collection("billing_entitlements")
          .doc(`${subscription.id}_${subscription.product}`);
        const snapshot = buildEntitlement(subscription, entitlement);
        transaction.set(entitlementRef, snapshot, { merge: true });

        // Compatibility projection only. Runtime authorization must move to billing_entitlements.
        transaction.set(database.collection("users").doc(subscription.userId), {
          subscriptionTier: subscription.tier,
          subscriptionProduct: subscription.product ?? null,
          subscriptionSource: "core_billing",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        entitlementSynchronized = true;
      }
    }

    if (invoice) {
      const invoiceWithSubscription: CommercialInvoice = {
        ...invoice,
        subscriptionId: subscription?.id ?? invoice.subscriptionId,
      };
      transaction.set(database.collection("billing_invoices").doc(invoice.id), invoiceWithSubscription, { merge: true });
    }
    if (payment) {
      transaction.set(database.collection("billing_payments").doc(payment.id), payment, { merge: true });
    }

    transaction.set(eventRef, {
      ...normalized,
      status: "processed",
      processedAt: new Date().toISOString(),
    }, { merge: true });
  });

  return {
    duplicate: false,
    eventId: normalized.providerEventId,
    eventType: normalized.eventType,
    entitlementSynchronized,
  };
}

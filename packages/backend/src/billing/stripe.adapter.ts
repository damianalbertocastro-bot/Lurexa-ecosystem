import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type {
  BillingCustomer,
  BillingWebhookEvent,
  CommercialInvoice,
  CommercialPayment,
  CommercialSubscription,
} from "@lurexa/types";
import type { BillingProviderAdapter } from "./billing-provider.adapter";

type StripeObject = Record<string, unknown>;
type StripeEvent = { id: string; type: string; data: { object: StripeObject } };

function requiredSecret(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

function timestampToIso(value: unknown): string {
  return typeof value === "number" ? new Date(value * 1000).toISOString() : new Date().toISOString();
}

function verifyStripeSignature(payload: string, signature: string, secret: string): void {
  const timestamp = signature.split(",").find((part) => part.startsWith("t="))?.slice(2);
  const expectedSignatures = signature.split(",").filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestamp || expectedSignatures.length === 0) throw new Error("Invalid Stripe webhook signature.");

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) throw new Error("Stripe webhook timestamp is outside the allowed tolerance.");

  const signedPayload = `${timestamp}.${payload}`;
  const digestBuffer = Buffer.from(createHmac("sha256", secret).update(signedPayload).digest("hex"), "hex");
  const valid = expectedSignatures.some((candidate) => {
    const expectedBuffer = Buffer.from(candidate, "hex");
    return expectedBuffer.length === digestBuffer.length && timingSafeEqual(expectedBuffer, digestBuffer);
  });
  if (!valid) throw new Error("Invalid Stripe webhook signature.");
}

async function stripeRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const secret = requiredSecret("STRIPE_SECRET_KEY");
  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Stripe API request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

function encodeForm(values: Record<string, string | undefined>): string {
  const form = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value !== undefined) form.set(key, value);
  return form.toString();
}

export class StripeBillingProviderAdapter implements BillingProviderAdapter {
  readonly provider = "stripe" as const;

  async createCheckoutSession(input: {
    customerId: string;
    priceReference: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ providerSessionId: string; checkoutUrl: string }> {
    const result = await stripeRequest<{ id: string; url?: string }>("checkout/sessions", {
      method: "POST",
      body: encodeForm({
        mode: "subscription",
        customer: input.customerId,
        "line_items[0][price]": input.priceReference,
        "line_items[0][quantity]": "1",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
      }),
    });
    if (!result.url) throw new Error("Stripe did not return a checkout URL.");
    return { providerSessionId: result.id, checkoutUrl: result.url };
  }

  async getCustomer(providerCustomerId: string): Promise<BillingCustomer | null> {
    const customer = await stripeRequest<StripeObject>(`customers/${encodeURIComponent(providerCustomerId)}`);
    return {
      id: stringValue(customer.id) ?? providerCustomerId,
      type: "individual",
      email: stringValue(customer.email) ?? "",
      currency: "USD",
      providerCustomerId,
    };
  }

  async getSubscription(providerSubscriptionId: string): Promise<CommercialSubscription | null> {
    const subscription = await stripeRequest<StripeObject>(`subscriptions/${encodeURIComponent(providerSubscriptionId)}`);
    const metadata = (subscription.metadata as StripeObject | undefined) ?? {};
    const tier = String(metadata.tier ?? "basic").toLowerCase();
    if (tier !== "basic" && tier !== "plus" && tier !== "ultra") return null;
    const product = String(metadata.product ?? "");
    const normalizedProduct = ["LEARN", "COACH", "TEACH", "ADMIN", "STUDIO", "INSIGHT"].includes(product) ? product as CommercialSubscription["product"] : undefined;
    return {
      id: stringValue(subscription.id) ?? providerSubscriptionId,
      customerId: stringValue(subscription.customer) ?? "",
      userId: stringValue(metadata.userId),
      tier,
      product: normalizedProduct,
      billingInterval: interval,
      status: String(subscription.status) as CommercialSubscription["status"],
      provider: "stripe",
      providerSubscriptionId,
      currentPeriodStart: timestampToIso(subscription.current_period_start),
      currentPeriodEnd: timestampToIso(subscription.current_period_end),
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    };
  }

  async getInvoice(providerInvoiceId: string): Promise<CommercialInvoice | null> {
    const invoice = await stripeRequest<StripeObject>(`invoices/${encodeURIComponent(providerInvoiceId)}`);
    return {
      id: stringValue(invoice.id) ?? providerInvoiceId,
      customerId: stringValue(invoice.customer) ?? "",
      currency: "USD",
      billingPeriodStart: timestampToIso(invoice.period_start),
      billingPeriodEnd: timestampToIso(invoice.period_end),
      subtotalUsd: Number(invoice.subtotal ?? 0) / 100,
      taxUsd: Number(invoice.tax ?? 0) / 100,
      totalUsd: Number(invoice.total ?? 0) / 100,
      status: String(invoice.status ?? "draft") as CommercialInvoice["status"],
      providerInvoiceId,
      issuedAt: invoice.created ? timestampToIso(invoice.created) : undefined,
      dueAt: invoice.due_date ? timestampToIso(invoice.due_date) : undefined,
      paidAt: invoice.status_transitions && typeof invoice.status_transitions === "object"
        ? timestampToIso((invoice.status_transitions as StripeObject).paid_at)
        : undefined,
    };
  }

  async getPayment(providerPaymentId: string): Promise<CommercialPayment | null> {
    const payment = await stripeRequest<StripeObject>(`payment_intents/${encodeURIComponent(providerPaymentId)}`);
    return {
      id: stringValue(payment.id) ?? providerPaymentId,
      customerId: stringValue(payment.customer) ?? "",
      currency: "USD",
      amountUsd: Number(payment.amount ?? 0) / 100,
      status: payment.status === "succeeded" ? "succeeded" : payment.status === "canceled" ? "failed" : "pending",
      provider: "stripe",
      providerPaymentId,
      createdAt: timestampToIso(payment.created),
    };
  }

  async verifyWebhook(
    payload: string,
    signature: string,
  ): Promise<{ eventId: string; eventType: string; payloadHash: string; rawEvent: unknown }> {
    verifyStripeSignature(payload, signature, requiredSecret("STRIPE_WEBHOOK_SECRET"));
    const event = JSON.parse(payload) as StripeEvent;
    if (!event.id || !event.type || !event.data?.object) throw new Error("Invalid Stripe webhook payload.");
    return {
      eventId: event.id,
      eventType: event.type,
      payloadHash: createHash("sha256").update(payload).digest("hex"),
      rawEvent: event,
    };
  }

  normalizeWebhookEvent(input: {
    eventId: string;
    eventType: string;
    payloadHash: string;
    receivedAt: string;
  }): BillingWebhookEvent {
    return {
      id: `stripe_${input.eventId}`,
      provider: "stripe",
      providerEventId: input.eventId,
      eventType: input.eventType,
      receivedAt: input.receivedAt,
      status: "received",
      payloadHash: input.payloadHash,
    };
  }
}

export const stripeBillingProvider = new StripeBillingProviderAdapter();

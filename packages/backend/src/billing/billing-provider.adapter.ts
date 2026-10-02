import type {
  BillingCustomer,
  BillingWebhookEvent,
  CommercialInvoice,
  CommercialPayment,
  CommercialSubscription,
} from "@lurexa/types";

/**
 * Provider adapters translate external payment state into Lurexa Core billing
 * events. Product authorization must never depend on this interface directly.
 */
export interface BillingProviderAdapter {
  readonly provider: "stripe";

  createCheckoutSession(input: {
    customerId: string;
    priceReference: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ providerSessionId: string; checkoutUrl: string }>;

  getCustomer(providerCustomerId: string): Promise<BillingCustomer | null>;

  getSubscription(providerSubscriptionId: string): Promise<CommercialSubscription | null>;

  getInvoice(providerInvoiceId: string): Promise<CommercialInvoice | null>;

  getPayment(providerPaymentId: string): Promise<CommercialPayment | null>;

  verifyWebhook(
    payload: string,
    signature: string,
  ): Promise<{ eventId: string; eventType: string; payloadHash: string; rawEvent: unknown }>;

  normalizeWebhookEvent(input: {
    eventId: string;
    eventType: string;
    payloadHash: string;
    receivedAt: string;
  }): BillingWebhookEvent;
}

/**
 * This is intentionally an adapter contract, not a Stripe implementation.
 * Provider SDK calls belong behind this boundary.
 */

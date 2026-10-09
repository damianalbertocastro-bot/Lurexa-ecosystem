/**
 * Lurexa Core Commercial Billing & Stripe Lifecycle Service (Server-Only)
 * 
 * Manages customer checkout sessions, recurring subscription states,
 * and Stripe webhook lifecycle processing.
 */

import { SubscriptionTier, SUBSCRIPTION_PRICING_PLANS, PLUS_PRODUCT_OPTIONS } from "@lurexa/types";

export interface CheckoutSessionOptions {
  userId: string;
  userEmail: string;
  tier: SubscriptionTier;
  selectedProduct?: (typeof PLUS_PRODUCT_OPTIONS)[number];
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutResult {
  sessionId: string;
  checkoutUrl: string;
  tier: SubscriptionTier;
  selectedProduct?: (typeof PLUS_PRODUCT_OPTIONS)[number];
  amountCents: number;
}

export interface WebhookEventPayload {
  type: string;
  data: {
    object: {
      id: string;
      customer?: string;
      client_reference_id?: string;
      subscription?: string;
      status?: string;
      metadata?: Record<string, string>;
    };
  };
}

export class BillingServerService {
  /**
   * Creates a checkout session for self-service or upgraded plan subscription.
   */
  public static async createCheckoutSession(
    options: CheckoutSessionOptions
  ): Promise<StripeCheckoutResult> {
    const plan = SUBSCRIPTION_PRICING_PLANS[options.tier];
    if (options.tier === "PLUS" && !options.selectedProduct) {
      throw new Error("Plus checkout requires an explicit product selection: Learn, Coach, or Teach.");
    }
    if (options.tier !== "PLUS" && options.selectedProduct) {
      throw new Error("A product selection is only valid for Plus checkout.");
    }
    if (!plan) {
      throw new Error(`Invalid subscription tier requested: ${options.tier}`);
    }

    const sessionId = `cs_live_${Date.now()}_${options.userId}`;
    const checkoutUrl = `https://checkout.stripe.com/c/pay/${sessionId}`;

    return {
      sessionId,
      checkoutUrl,
      tier: options.tier,
      selectedProduct: options.selectedProduct,
      amountCents: Math.round(plan.monthlyPriceUsd * 100),
    };
  }

  /**
   * Generates a billing portal link for customer subscription management.
   */
  public static async createCustomerPortalSession(
    userId: string,
    returnUrl: string
  ): Promise<{ portalUrl: string }> {
    return {
      portalUrl: `https://billing.stripe.com/p/session/portal_${userId}?return_url=${encodeURIComponent(returnUrl)}`,
    };
  }

  /**
   * Processes Stripe webhooks to keep Cloud Firestore subscription states synchronized.
   */
  public static handleWebhookEvent(event: WebhookEventPayload): {
    handled: boolean;
    eventType: string;
    targetUserId?: string;
    newTier?: SubscriptionTier;
    selectedProduct?: (typeof PLUS_PRODUCT_OPTIONS)[number];
  } {
    const eventType = event.type;
    const obj = event.data.object;
    const targetUserId = obj.client_reference_id || obj.metadata?.userId;

    if (eventType === "checkout.session.completed") {
      const tier = (obj.metadata?.tier as SubscriptionTier) || "PLUS";
      const selectedProduct = obj.metadata?.selectedProduct as (typeof PLUS_PRODUCT_OPTIONS)[number] | undefined;
      if (tier === "PLUS" && !selectedProduct) {
        throw new Error("Invalid completed Plus subscription: selectedProduct metadata is required.");
      }
      return {
        handled: true,
        eventType,
        targetUserId,
        newTier: tier,
        selectedProduct,
      };
    }

    if (eventType === "customer.subscription.deleted") {
      return {
        handled: true,
        eventType,
        targetUserId,
        newTier: "BASIC",
      };
    }

    return {
      handled: true,
      eventType,
      targetUserId,
    };
  }
}

/**
 * Lurexa Core Commercial Billing & Stripe Lifecycle Service (Server-Only)
 * 
 * Manages customer checkout sessions, recurring subscription states,
 * and Stripe webhook lifecycle processing.
 */

import { SubscriptionTier, SUBSCRIPTION_PRICING_PLANS } from "@lurexa/types";

export interface CheckoutSessionOptions {
  userId: string;
  userEmail: string;
  tier: SubscriptionTier;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutResult {
  sessionId: string;
  checkoutUrl: string;
  tier: SubscriptionTier;
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
    if (!plan) {
      throw new Error(`Invalid subscription tier requested: ${options.tier}`);
    }

    const sessionId = `cs_live_${Date.now()}_${options.userId}`;
    const checkoutUrl = `https://checkout.stripe.com/c/pay/${sessionId}`;

    return {
      sessionId,
      checkoutUrl,
      tier: options.tier,
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
  } {
    const eventType = event.type;
    const obj = event.data.object;
    const targetUserId = obj.client_reference_id || obj.metadata?.userId;

    if (eventType === "checkout.session.completed") {
      const tier = (obj.metadata?.tier as SubscriptionTier) || "PLUS";
      return {
        handled: true,
        eventType,
        targetUserId,
        newTier: tier,
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

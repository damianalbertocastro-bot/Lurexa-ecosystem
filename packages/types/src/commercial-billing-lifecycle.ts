import type { CanonicalSubscriptionTier, ProductEntryPoint, EntitlementCapability } from "./subscription";

export type CommercialBillingState =
  | "draft"
  | "trialing"
  | "active"
  | "past_due"
  | "paused"
  | "canceled"
  | "expired";

export type CommercialBillingEvent =
  | "checkout_completed"
  | "trial_started"
  | "trial_ended"
  | "payment_succeeded"
  | "payment_failed"
  | "subscription_paused"
  | "subscription_resumed"
  | "subscription_canceled"
  | "subscription_expired"
  | "contract_activated"
  | "contract_changed"
  | "contract_expired"
  | "refund_issued"
  | "credit_issued";

export interface IndividualEntitlementGrant {
  customerId: string;
  subscriptionId: string;
  tier: CanonicalSubscriptionTier;
  product: Extract<ProductEntryPoint, "LEARN" | "COACH">;
  capabilities: EntitlementCapability[];
  effectiveAt: string;
  expiresAt?: string;
  status: "pending" | "active" | "revoked";
}

export interface CommercialBillingTransition {
  from: CommercialBillingState;
  event: CommercialBillingEvent;
  to: CommercialBillingState;
  entitlementAction:
    | "none"
    | "activate"
    | "recalculate"
    | "suspend"
    | "revoke"
    | "restore";
  requiresProviderEvent: boolean;
}

export const COMMERCIAL_BILLING_TRANSITIONS: CommercialBillingTransition[] = [
  { from: "draft", event: "checkout_completed", to: "active", entitlementAction: "activate", requiresProviderEvent: true },
  { from: "draft", event: "trial_started", to: "trialing", entitlementAction: "activate", requiresProviderEvent: true },
  { from: "trialing", event: "trial_ended", to: "active", entitlementAction: "recalculate", requiresProviderEvent: true },
  { from: "trialing", event: "payment_failed", to: "past_due", entitlementAction: "suspend", requiresProviderEvent: true },
  { from: "trialing", event: "subscription_canceled", to: "canceled", entitlementAction: "revoke", requiresProviderEvent: true },
  { from: "active", event: "payment_succeeded", to: "active", entitlementAction: "recalculate", requiresProviderEvent: true },
  { from: "active", event: "payment_failed", to: "past_due", entitlementAction: "suspend", requiresProviderEvent: true },
  { from: "active", event: "subscription_paused", to: "paused", entitlementAction: "suspend", requiresProviderEvent: true },
  { from: "active", event: "subscription_canceled", to: "canceled", entitlementAction: "revoke", requiresProviderEvent: true },
  { from: "active", event: "subscription_expired", to: "expired", entitlementAction: "revoke", requiresProviderEvent: true },
  { from: "active", event: "contract_changed", to: "active", entitlementAction: "recalculate", requiresProviderEvent: false },
  { from: "past_due", event: "payment_succeeded", to: "active", entitlementAction: "restore", requiresProviderEvent: true },
  { from: "past_due", event: "payment_failed", to: "past_due", entitlementAction: "suspend", requiresProviderEvent: true },
  { from: "past_due", event: "subscription_canceled", to: "canceled", entitlementAction: "revoke", requiresProviderEvent: true },
  { from: "paused", event: "subscription_resumed", to: "active", entitlementAction: "restore", requiresProviderEvent: true },
  { from: "paused", event: "subscription_canceled", to: "canceled", entitlementAction: "revoke", requiresProviderEvent: true },
  { from: "canceled", event: "subscription_expired", to: "expired", entitlementAction: "revoke", requiresProviderEvent: true },
  { from: "expired", event: "contract_activated", to: "active", entitlementAction: "activate", requiresProviderEvent: true },
];

export function resolveCommercialBillingTransition(
  state: CommercialBillingState,
  event: CommercialBillingEvent,
): CommercialBillingTransition {
  const transition = COMMERCIAL_BILLING_TRANSITIONS.find(
    (candidate) => candidate.from === state && candidate.event === event,
  );
  if (!transition) {
    throw new Error(`Unsupported commercial billing transition: ${state} + ${event}`);
  }
  return transition;
}

/**
 * Payment-provider state is an input to Core billing.
 * Product authorization must consume the resulting entitlement projection,
 * never the provider's raw status.
 */
export interface BillingEntitlementMapping {
  billingState: CommercialBillingState;
  effectiveProducts: ProductEntryPoint[];
  effectiveCapabilities: EntitlementCapability[];
  quotas: {
    monthlyAiTurns: number;
    monthlyVoiceMinutes: number;
    learnerOrSeatAllowance?: number;
  };
  effectiveAt: string;
  expiresAt?: string;
}

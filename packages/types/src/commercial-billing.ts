import type { BusinessContract, CanonicalSubscriptionTier, ProductEntryPoint, EntitlementCapability } from "./subscription";

export type BillingCustomerType = "individual" | "organization";
export type BillingInterval = "monthly" | "annual";
export type BillingStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "unpaid";

export type InvoiceStatus = "draft" | "open" | "paid" | "void" | "uncollectible";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded" | "partially_refunded";

export interface BillingCustomer {
  id: string;
  type: BillingCustomerType;
  userId?: string;
  organizationId?: string;
  email: string;
  currency: "USD";
  providerCustomerId?: string;
}

export interface CommercialSubscription {
  id: string;
  customerId: string;
  tier: CanonicalSubscriptionTier;
  product?: ProductEntryPoint;
  billingInterval: BillingInterval;
  status: BillingStatus;
  provider: "stripe";
  providerSubscriptionId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface CommercialEntitlementSnapshot {
  subscriptionId?: string;
  customerId: string;
  product: ProductEntryPoint;
  capabilities: EntitlementCapability[];
  effectiveAt: string;
  expiresAt?: string;
  source: "individual_subscription" | "business_contract" | "explicit_entitlement";
}

export interface CommercialInvoice {
  id: string;
  customerId: string;
  subscriptionId?: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  currency: "USD";
  subtotalUsd: number;
  taxUsd: number;
  totalUsd: number;
  status: InvoiceStatus;
  providerInvoiceId?: string;
  issuedAt?: string;
  dueAt?: string;
  paidAt?: string;
}

export interface CommercialPayment {
  id: string;
  customerId: string;
  invoiceId?: string;
  currency: "USD";
  amountUsd: number;
  status: PaymentStatus;
  provider: "stripe";
  providerPaymentId?: string;
  createdAt: string;
}

export interface UsageChargeLine {
  capabilityId: string;
  product: ProductEntryPoint | "CAMPUS";
  metric: "ai_turns" | "voice_minutes" | "seats";
  quantity: number;
  includedQuantity: number;
  billableQuantity: number;
  unitPriceUsd?: number;
  amountUsd?: number;
}

export interface BusinessBillingAccount {
  organizationId: string;
  customerId: string;
  contract: BusinessContract;
  billingInterval: BillingInterval;
  status: BillingStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  seatAllowance: number;
  usageLines: UsageChargeLine[];
}

/**
 * Payment-provider state is an input to Core billing, never the authorization authority.
 * Entitlements must be resolved from the canonical commercial model after payment events.
 */
export interface BillingWebhookEvent {
  id: string;
  provider: "stripe";
  eventType: string;
  providerEventId: string;
  receivedAt: string;
  processedAt?: string;
  status: "received" | "processed" | "ignored" | "failed";
  payloadHash: string;
}

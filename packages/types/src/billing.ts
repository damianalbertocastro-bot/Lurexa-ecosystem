import { PricingPlan } from "./user";

/** @deprecated Legacy compatibility types. Use commercial-billing.ts for all new billing and admin flows. */

export type InstitutionalPlanTier =
  | "free_community"
  | "standard_institutional"
  | "campus_pro"
  | "business"
  | "enterprise";

export interface InstitutionalInvoice {
  id: string;
  invoiceNumber: string;
  amountUsd: number;
  status: "paid" | "open" | "void";
  issuedAt: string;
  paidAt: string | null;
  dueDate: string;
  seatsCount: number;
  pdfDownloadUrl?: string;
}

/** @deprecated Use AdminBillingAccount from commercial-billing.ts. */
export interface InstitutionalBillingAccount {
  organizationId: string;
  organizationName: string;
  planTier: InstitutionalPlanTier;
  allocatedSeats: number;
  usedSeats: number;
  pricePerSeatMonthlyUsd: number | null;
  billingInterval: "monthly" | "annual";
  currentPeriodStart: string;
  nextRenewalDate: string;
  status: "active" | "past_due" | "canceled" | "trial";
  contactEmail: string;
  paymentMethodLast4?: string;
  paymentMethodBrand?: string;
  invoices: InstitutionalInvoice[];
}

/** @deprecated Use CommercialSubscription from commercial-billing.ts. */
export interface Subscription {
  orgId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: PricingPlan;
  status: "active" | "canceled" | "past_due" | "trailing";
  currentPeriodEnd: string;
}

/** @deprecated Use the durable usage ledger contracts instead. */
export interface UsageRecord {
  orgId: string;
  metric: "ai_queries" | "students" | "courses";
  count: number;
  periodStart: string;
  periodEnd: string;
}

export interface MarketplaceListing {
  id: string;
  courseId: string;
  authorId: string;
  price: number;
  currency: string;
  type: "one_time" | "subscription";
  rating: number;
  salesCount: number;
  createdAt: string;
}
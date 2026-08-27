import { PricingPlan } from "./user";

export type InstitutionalPlanTier =
  | "free_community"
  | "standard_institutional"
  | "campus_pro"
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

export interface InstitutionalBillingAccount {
  organizationId: string;
  organizationName: string;
  planTier: InstitutionalPlanTier;
  allocatedSeats: number;
  usedSeats: number;
  pricePerSeatMonthlyUsd: number;
  billingInterval: "monthly" | "annual";
  currentPeriodStart: string;
  nextRenewalDate: string;
  status: "active" | "past_due" | "canceled" | "trial";
  contactEmail: string;
  paymentMethodLast4?: string;
  paymentMethodBrand?: string;
  invoices: InstitutionalInvoice[];
}

export interface Subscription {
  orgId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: PricingPlan;
  status: "active" | "canceled" | "past_due" | "trailing";
  currentPeriodEnd: string;
}

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
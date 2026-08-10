import { PricingPlan } from "./user";

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
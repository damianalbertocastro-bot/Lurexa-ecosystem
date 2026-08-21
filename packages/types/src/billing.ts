import { PricingPlan } from "./user";

export interface Subscription {
  orgId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: PricingPlan;
  status: "active" | "canceled" | "past_due" | "trialing" | "trailing";
  currentPeriodEnd: string;
}

export interface PlanLimits {
  maxStudents: number;
  maxCourses: number;
  aiQueriesPerStudentMonth: number;
  offlineSupport: boolean;
  advancedAnalytics: boolean;
}

export interface OrganizationPlanProjection {
  organizationId: string;
  organizationName: string;
  plan: PricingPlan;
  limits: PlanLimits;
  studentSeats: number;
  subscriptionStatus: Subscription["status"] | null;
  generatedAt: string;
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

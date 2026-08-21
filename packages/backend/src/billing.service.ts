import type { PlanLimits, PricingPlan, Subscription } from "@lurexa/types";

export type { PlanLimits } from "@lurexa/types";

export const PLAN_CONFIGS: Record<PricingPlan, PlanLimits> = {
  free: {
    maxStudents: 20,
    maxCourses: 3,
    aiQueriesPerStudentMonth: 10,
    offlineSupport: false,
    advancedAnalytics: false,
  },
  basic: {
    maxStudents: 100,
    maxCourses: -1,
    aiQueriesPerStudentMonth: 50,
    offlineSupport: true,
    advancedAnalytics: false,
  },
  pro: {
    maxStudents: 500,
    maxCourses: -1,
    aiQueriesPerStudentMonth: 200,
    offlineSupport: true,
    advancedAnalytics: true,
  },
  enterprise: {
    maxStudents: 100000,
    maxCourses: -1,
    aiQueriesPerStudentMonth: 1000,
    offlineSupport: true,
    advancedAnalytics: true,
  },
};

const trustedBillingReadError =
  "Organization subscription and usage data are server-only. Use the authenticated Learn plan API projection.";

export const BillingService = {
  async getSubscription(orgId: string): Promise<Subscription | null> {
    void orgId;
    throw new Error(trustedBillingReadError);
  },

  async getOrgPlanLimits(orgId: string): Promise<PlanLimits> {
    void orgId;
    throw new Error(trustedBillingReadError);
  },

  async getStudentSeatUsage(orgId: string): Promise<number> {
    void orgId;
    throw new Error(trustedBillingReadError);
  },

  async createCheckoutSession(_orgId: string, _targetPlan: PricingPlan): Promise<{ checkoutUrl: string }> {
    throw new Error("Paid checkout is not configured yet. No payment has been initiated.");
  },

  async recordUsage(
    orgId: string,
    metric: "ai_queries" | "students" | "courses",
    amount = 1,
  ): Promise<void> {
    void orgId;
    void metric;
    void amount;
    throw new Error("Usage ledger writes are server-only and must pass through a trusted metering boundary.");
  },
};

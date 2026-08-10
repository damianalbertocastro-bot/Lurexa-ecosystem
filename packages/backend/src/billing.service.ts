import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";
import { Subscription, PricingPlan, UsageRecord } from "@lurexa/types";

export interface PlanLimits {
  maxStudents: number;
  maxCourses: number; // -1 for unlimited
  aiQueriesPerStudentMonth: number;
  offlineSupport: boolean;
  advancedAnalytics: boolean;
}

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

export const BillingService = {
  /**
   * Get subscription details for an organization
   */
  async getSubscription(orgId: string): Promise<Subscription | null> {
    const ref = doc(db, "subscriptions", orgId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as Subscription;
  },

  /**
   * Get effective plan limits for an organization
   */
  async getOrgPlanLimits(orgId: string): Promise<PlanLimits> {
    const sub = await this.getSubscription(orgId);
    const plan = sub?.plan || "free";
    return PLAN_CONFIGS[plan];
  },

  /**
   * Create checkout session stub for upgrading plans (Stripe)
   */
  async createCheckoutSession(orgId: string, targetPlan: PricingPlan): Promise<{ checkoutUrl: string }> {
    // Calls Stripe API via server action or Cloud Function
    return {
      checkoutUrl: `https://checkout.stripe.com/pay/demo_${orgId}_${targetPlan}`,
    };
  },

  /**
   * Track usage for a metric (e.g. AI queries)
   */
  async recordUsage(orgId: string, metric: "ai_queries" | "students" | "courses", amount = 1): Promise<void> {
    const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM
    const ref = doc(db, "usage_records", `${orgId}_${metric}_${currentPeriod}`);
    
    await setDoc(
      ref,
      {
        orgId,
        metric,
        count: increment(amount),
        periodStart: `${currentPeriod}-01`,
      },
      { merge: true }
    );
  },
};
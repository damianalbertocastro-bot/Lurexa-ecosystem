import { collection, doc, getDoc, getDocs, increment, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { OrganizationMember, PricingPlan, Subscription } from "@lurexa/types";

export interface PlanLimits {
  maxStudents: number;
  maxCourses: number;
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
  async getSubscription(orgId: string): Promise<Subscription | null> {
    const snapshot = await getDoc(doc(db, "subscriptions", orgId));
    return snapshot.exists() ? snapshot.data() as Subscription : null;
  },

  async getOrgPlanLimits(orgId: string): Promise<PlanLimits> {
    const subscription = await this.getSubscription(orgId);
    return PLAN_CONFIGS[subscription?.plan ?? "free"];
  },

  async getStudentSeatUsage(orgId: string): Promise<number> {
    const members = await getDocs(collection(db, "organizations", orgId, "members"));
    return members.docs
      .map((member) => member.data() as OrganizationMember)
      .filter((member) => member.role === "student").length;
  },

  async createCheckoutSession(_orgId: string, _targetPlan: PricingPlan): Promise<{ checkoutUrl: string }> {
    throw new Error("Paid checkout is not configured yet. No payment has been initiated.");
  },

  async recordUsage(orgId: string, metric: "ai_queries" | "students" | "courses", amount = 1): Promise<void> {
    const currentPeriod = new Date().toISOString().slice(0, 7);
    const reference = doc(db, "usage_records", `${orgId}_${metric}_${currentPeriod}`);
    await setDoc(reference, {
      orgId,
      metric,
      count: increment(amount),
      periodStart: `${currentPeriod}-01`,
    }, { merge: true });
  },
};

import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { BillingService } from "./billing.service";

export interface AIQuotaCheckResult {
  allowed: boolean;
  currentUsage: number;
  maxLimit: number;
  reason?: string;
}

export const AIGuardrailsService = {
  /**
   * Check if a student is allowed to query the AI tutor or content generator
   */
  async checkAIQueryAllowance(orgId: string, studentId: string): Promise<AIQuotaCheckResult> {
    const limits = await BillingService.getOrgPlanLimits(orgId);
    const maxLimit = limits.aiQueriesPerStudentMonth;

    const currentPeriod = new Date().toISOString().slice(0, 7);
    const usageRef = doc(db, "student_ai_usage", `${studentId}_${currentPeriod}`);
    const snap = await getDoc(usageRef);

    const currentUsage = snap.exists() ? snap.data().count || 0 : 0;

    if (currentUsage >= maxLimit) {
      return {
        allowed: false,
        currentUsage,
        maxLimit,
        reason: `Monthly AI query limit reached (${maxLimit} queries/student). Upgrade plan for higher caps.`,
      };
    }

    return {
      allowed: true,
      currentUsage,
      maxLimit,
    };
  },
};
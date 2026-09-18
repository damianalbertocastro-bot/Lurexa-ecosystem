import type { BusinessContract, BusinessUsageRecord, ProductEntryPoint } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";

const USAGE_COLLECTION = "business-usage";
const CONTRACT_FIELD = "businessContract";

function monthWindow(now = new Date()): { periodStart: string; periodEnd: string; key: string } {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 1));
  const key = `${year}-${String(month + 1).padStart(2, "0")}`;
  return { periodStart: start.toISOString(), periodEnd: end.toISOString(), key };
}

export interface BusinessUsageSnapshot extends BusinessUsageRecord {
  id: string;
}

export class BusinessUsageService {
  static async getContract(organizationId: string): Promise<BusinessContract | null> {
    const snapshot = await getServerFirestore().collection("organizations").doc(organizationId).get();
    if (!snapshot.exists) return null;
    const data = snapshot.data() ?? {};
    return (data[CONTRACT_FIELD] as BusinessContract | undefined) ?? null;
  }

  /**
   * Resolves the learner's organization contract without making individual
   * product runtimes depend on a commercial plan name.
   */
  static async getLearnerOrganizationId(learnerId: string): Promise<string | null> {
    const snapshot = await getServerFirestore().collection("users").doc(learnerId).get();
    const organizationId = snapshot.data()?.organizationId;
    return typeof organizationId === "string" && organizationId.trim() ? organizationId : null;
  }

  /**
   * Enforces pooled Business usage when the learner is attached to a Business
   * organization. Returns true when Business accounting was applied so callers
   * can skip the individual-tier ledger.
   */
  static async consumeIfBusiness(input: {
    learnerId: string;
    organizationId?: string;
    aiTurns?: number;
    voiceMinutes?: number;
    product?: ProductEntryPoint;
  }): Promise<boolean> {
    const organizationId = input.organizationId ?? await this.getLearnerOrganizationId(input.learnerId);
    if (!organizationId) return false;
    const contract = await this.getContract(organizationId);
    if (!contract) return false;
    if (input.product && !contract.productAccess.includes(input.product as BusinessContract["productAccess"][number])) {
      throw new Error(`Business contract does not grant access to ${input.product}.`);
    }

    await this.consumeCurrentUsage({
      organizationId,
      learnerId: input.learnerId,
      aiTurns: input.aiTurns,
      voiceMinutes: input.voiceMinutes,
    });
    return true;
  }

  static async getCurrentUsage(organizationId: string, now = new Date()): Promise<BusinessUsageSnapshot> {
    const { periodStart, periodEnd, key } = monthWindow(now);
    const id = `${organizationId}_${key}`;
    const snapshot = await getServerFirestore().collection(USAGE_COLLECTION).doc(id).get();
    const data = snapshot.data() ?? {};
    return {
      id,
      organizationId,
      periodStart,
      periodEnd,
      aiTurnsUsed: typeof data.aiTurnsUsed === "number" ? data.aiTurnsUsed : 0,
      voiceMinutesUsed: typeof data.voiceMinutesUsed === "number" ? data.voiceMinutesUsed : 0,
    };
  }

  static async consumeCurrentUsage(input: {
    organizationId: string;
    aiTurns?: number;
    voiceMinutes?: number;
    learnerId?: string;
    now?: Date;
  }): Promise<BusinessUsageSnapshot> {
    const aiTurns = Math.max(0, input.aiTurns ?? 0);
    const voiceMinutes = Math.max(0, input.voiceMinutes ?? 0);
    const now = input.now ?? new Date();
    const { periodStart, periodEnd, key } = monthWindow(now);
    const usageRef = getServerFirestore().collection(USAGE_COLLECTION).doc(`${input.organizationId}_${key}`);
    const orgRef = getServerFirestore().collection("organizations").doc(input.organizationId);

    const result = await getServerFirestore().runTransaction(async (transaction) => {
      const orgSnapshot = await transaction.get(orgRef);
      const usageSnapshot = await transaction.get(usageRef);
      if (!orgSnapshot.exists) throw new Error("Organization not found.");

      const contract = (orgSnapshot.data()?.[CONTRACT_FIELD] as BusinessContract | undefined) ?? null;
      if (!contract) throw new Error("Business contract not configured for organization.");

      const current: BusinessUsageRecord = {
        organizationId: input.organizationId,
        learnerId: input.learnerId,
        periodStart,
        periodEnd,
        aiTurnsUsed: typeof usageSnapshot.data()?.aiTurnsUsed === "number" ? usageSnapshot.data()!.aiTurnsUsed : 0,
        voiceMinutesUsed: typeof usageSnapshot.data()?.voiceMinutesUsed === "number" ? usageSnapshot.data()!.voiceMinutesUsed : 0,
      };

      const allowance = contract.usageAllowance;
      if (allowance) {
        if (current.aiTurnsUsed + aiTurns > allowance.monthlyAiTurns) {
          throw new Error("Business monthly AI usage allowance exceeded.");
        }
        if (current.voiceMinutesUsed + voiceMinutes > allowance.monthlyVoiceMinutes) {
          throw new Error("Business monthly voice allowance exceeded.");
        }
      }

      const next = {
        organizationId: input.organizationId,
        periodStart,
        periodEnd,
        aiTurnsUsed: current.aiTurnsUsed + aiTurns,
        voiceMinutesUsed: current.voiceMinutesUsed + voiceMinutes,
        updatedAt: now.toISOString(),
      };
      transaction.set(usageRef, next, { merge: true });
      return next;
    });

    return { id: usageRef.id, ...result };
  }

  static async getRemainingAllowance(organizationId: string, now = new Date()) {
    const contract = await this.getContract(organizationId);
    if (!contract?.usageAllowance) {
      return { aiTurns: Number.POSITIVE_INFINITY, voiceMinutes: Number.POSITIVE_INFINITY };
    }
    const usage = await this.getCurrentUsage(organizationId, now);
    return {
      aiTurns: Math.max(0, contract.usageAllowance.monthlyAiTurns - usage.aiTurnsUsed),
      voiceMinutes: Math.max(0, contract.usageAllowance.monthlyVoiceMinutes - usage.voiceMinutesUsed),
    };
  }
}

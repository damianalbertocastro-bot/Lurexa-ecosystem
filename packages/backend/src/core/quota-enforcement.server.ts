import { getServerFirestore } from "../firebase-admin.server";
import {
  SubscriptionTier,
  DEFAULT_TIER_QUOTAS,
  PlanQuotas,
} from "@lurexa/types";

export interface QuotaCheckRequest {
  actorId: string;
  usageType: "voice_minutes" | "ai_turns" | "offline_modules" | "streaming_audio";
  unitsToConsume?: number;
}

export interface QuotaCheckResult {
  allowed: boolean;
  activeTier: SubscriptionTier;
  currentUsage: number;
  limit: number;
  remaining: number;
  quotaExceeded: boolean;
  message?: string;
}

export class QuotaEnforcementServerService {
  /**
   * Helper to get current YYYY-MM key for monthly rolling ledger
   */
  private static getMonthKey(): string {
    const d = new Date();
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  }

  /**
   * Checks and optionally increments quota usage for a user.
   */
  public static async assertAndConsumeQuota(
    request: QuotaCheckRequest
  ): Promise<QuotaCheckResult> {
    const database = getServerFirestore();
    const monthKey = this.getMonthKey();
    const userDocRef = database.collection("users").doc(request.actorId);
    const ledgerDocRef = database
      .collection("usage-ledgers")
      .doc(`${request.actorId}_${monthKey}`);

    // 1. Fetch user active tier
    let activeTier: SubscriptionTier = "BASIC";
    try {
      const userSnap = await userDocRef.get();
      if (userSnap.exists) {
        const userData = userSnap.data();
        if (userData?.subscriptionTier && userData.subscriptionTier in DEFAULT_TIER_QUOTAS) {
          activeTier = userData.subscriptionTier as SubscriptionTier;
        }
      }
    } catch {
      activeTier = "BASIC";
    }

    const quotas: PlanQuotas = DEFAULT_TIER_QUOTAS[activeTier];
    const units = request.unitsToConsume ?? 1;

    // 2. Fetch current monthly usage
    let currentVoiceMinutes = 0;
    let currentAiTurns = 0;

    const ledgerSnap = await ledgerDocRef.get();
    if (ledgerSnap.exists) {
      const data = ledgerSnap.data();
      currentVoiceMinutes = data?.voiceMinutesUsed ?? 0;
      currentAiTurns = data?.aiTurnsUsed ?? 0;
    }

    let limit = 0;
    let currentUsage = 0;

    switch (request.usageType) {
      case "voice_minutes":
        limit = quotas.monthlyVoiceMinutes;
        currentUsage = currentVoiceMinutes;
        break;
      case "ai_turns":
        limit = quotas.monthlyAiTurns;
        currentUsage = currentAiTurns;
        break;
      case "streaming_audio":
        if (!quotas.streamingAudioEnabled) {
          return {
            allowed: false,
            activeTier,
            currentUsage: 0,
            limit: 0,
            remaining: 0,
            quotaExceeded: true,
            message: `Streaming audio is not available on the ${activeTier} tier. Upgrade to Plus or Ultra for live audio.`,
          };
        }
        return {
          allowed: true,
          activeTier,
          currentUsage: 0,
          limit: Infinity,
          remaining: Infinity,
          quotaExceeded: false,
        };
      case "offline_modules":
        limit = quotas.offlineModulesAllowed;
        currentUsage = 0;
        break;
    }

    if (currentUsage + units > limit && limit !== Infinity) {
      return {
        allowed: false,
        activeTier,
        currentUsage,
        limit,
        remaining: Math.max(0, limit - currentUsage),
        quotaExceeded: true,
        message: `Monthly ${request.usageType.replace("_", " ")} limit reached (${currentUsage}/${limit} on ${activeTier} plan). Upgrade for expanded learning quotas.`,
      };
    }

    // 3. Atomically update usage ledger
    try {
      const updateData: Record<string, unknown> = {
        learnerId: request.actorId,
        monthKey,
        updatedAt: new Date().toISOString(),
      };
      if (request.usageType === "voice_minutes") {
        updateData.voiceMinutesUsed = currentVoiceMinutes + units;
      } else if (request.usageType === "ai_turns") {
        updateData.aiTurnsUsed = currentAiTurns + units;
      }
      await ledgerDocRef.set(updateData, { merge: true });
    } catch (err) {
      console.warn("Failed to write to usage ledger:", err);
    }

    return {
      allowed: true,
      activeTier,
      currentUsage: currentUsage + units,
      limit,
      remaining: Math.max(0, limit - (currentUsage + units)),
      quotaExceeded: false,
    };
  }
}

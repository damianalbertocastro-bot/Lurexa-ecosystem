/**
 * Lurexa Feedback Service
 * Core service governing real-user feedback, bug reports, and audio telemetry diagnostics.
 */

import { getServerFirestore } from "./firebase-admin.server";

export interface FeedbackDiagnostics {
  currentUrl?: string;
  viewport?: { width: number; height: number };
  userAgent?: string;
  audioSupported?: boolean;
  online?: boolean;
  locale?: string;
}

export interface UserFeedbackSubmission {
  userId?: string;
  tenantId?: string;
  product: "learn" | "coach" | "teach" | "admin" | "web" | "insight" | "studio";
  category: "audio" | "content" | "bug" | "suggestion" | "other";
  sentimentScore?: number;
  message: string;
  diagnostics?: FeedbackDiagnostics;
}

export interface FeedbackRecord extends UserFeedbackSubmission {
  id: string;
  createdAt: string;
  status: "received" | "triaged" | "resolved";
}

export class FeedbackService {
  /**
   * Submit and persist user feedback or issue report to Core Firestore
   */
  public static async submitFeedback(submission: UserFeedbackSubmission): Promise<{ success: boolean; id: string }> {
    // 1. Sanitize input
    const cleanMessage = (submission.message || "").trim().slice(0, 2000);
    if (!cleanMessage) {
      throw new Error("Feedback message cannot be empty.");
    }

    const id = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const record: FeedbackRecord = {
      id,
      userId: submission.userId || "anonymous_learner",
      tenantId: submission.tenantId || "lurexa-self-paced",
      product: submission.product,
      category: submission.category,
      sentimentScore: Math.max(1, Math.min(5, submission.sentimentScore ?? 5)),
      message: cleanMessage,
      diagnostics: submission.diagnostics,
      createdAt: new Date().toISOString(),
      status: "received",
    };

    // 2. Persist to Firestore if available
    try {
      const firestore = getServerFirestore();
      await firestore.collection("user_feedback").doc(id).set(record);
    } catch (err) {
      console.warn("[FeedbackService] Non-blocking persistence fallback:", err);
    }

    return { success: true, id };
  }
}

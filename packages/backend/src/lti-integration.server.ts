import type { Lti13Registration, LtiGradePassbackRequest } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";

export type LtiGradePassbackResult = {
  status: "simulated" | "disabled" | "failed";
  processedAt: string;
  scaledScore?: number;
  reason?: string;
};

export class LtiIntegrationService {
  /**
   * Registers an LTI 1.3 Advantage integration for an institutional tenant.
   */
  public static async registerPlatform(
    registration: Omit<Lti13Registration, "id" | "createdAt">
  ): Promise<Lti13Registration> {
    const database = getServerFirestore();
    const id = `lti_${registration.organizationId}_${Date.now()}`;
    const record: Lti13Registration = {
      ...registration,
      id,
      createdAt: new Date().toISOString(),
    };

    await database
      .collection("organizations")
      .doc(registration.organizationId)
      .collection("integrations")
      .doc("lti13")
      .set(record);

    return record;
  }

  /**
   * Retrieves the active LTI 1.3 configuration for an organization.
   */
  public static async getRegistration(
    organizationId: string
  ): Promise<Lti13Registration | null> {
    const database = getServerFirestore();
    const snapshot = await database
      .collection("organizations")
      .doc(organizationId)
      .collection("integrations")
      .doc("lti13")
      .get();

    return snapshot.exists ? (snapshot.data() as Lti13Registration) : null;
  }

  /**
   * Prepares and validates the score that would be submitted through LTI AGS.
   *
   * This method intentionally does NOT report `synced` until the production
   * OAuth/JWT-authenticated AGS request is implemented and an external LMS
   * acknowledges the transaction. Returning a simulated state keeps repository
   * and institutional UI claims truthful while the integration is incomplete.
   */
  public static async passbackScore(
    request: LtiGradePassbackRequest,
  ): Promise<LtiGradePassbackResult> {
    const registration = await this.getRegistration(request.organizationId);

    if (!registration || !registration.gradeSyncEnabled) {
      return {
        status: "disabled",
        processedAt: new Date().toISOString(),
        reason: "LTI grade synchronization is not enabled for this organization.",
      };
    }

    if (!Number.isFinite(request.scoreMaximum) || request.scoreMaximum <= 0) {
      return {
        status: "failed",
        processedAt: new Date().toISOString(),
        reason: "A positive scoreMaximum is required before grade passback can be prepared.",
      };
    }

    const scaledScore = Math.min(1, Math.max(0, request.scoreGiven / request.scoreMaximum));

    // Production completion requires OAuth 2 client-credentials/JWT assertion,
    // an AGS lineitem/score POST, response validation, audit logging and retry
    // semantics. Until that exists, this is preparation/simulation only.
    return {
      status: "simulated",
      processedAt: new Date().toISOString(),
      scaledScore,
      reason: "Score validated locally; no external LTI AGS transaction was performed.",
    };
  }
}

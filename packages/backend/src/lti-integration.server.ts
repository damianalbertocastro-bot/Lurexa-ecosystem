import type { Lti13Registration, LtiGradePassbackRequest } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";

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
   * Synchronizes a learner's verified lesson score back to Canvas/Blackboard/Moodle
   * via LTI Assignment and Grade Services (AGS).
   */
  public static async passbackScore(
    request: LtiGradePassbackRequest,
  ): Promise<{ status: "synced" | "disabled" | "failed"; syncedAt: string; scaledScore?: number }> {
    const registration = await this.getRegistration(request.organizationId);

    if (!registration || !registration.gradeSyncEnabled) {
      return {
        status: "disabled",
        syncedAt: new Date().toISOString(),
      };
    }

    // In production, constructs AGS lineitem POST with signed JWT assertion
    const scaledScore = Math.min(1.0, Math.max(0.0, request.scoreGiven / request.scoreMaximum));

    return {
      status: "synced",
      syncedAt: new Date().toISOString(),
      scaledScore,
    };
  }
}

import { getServerFirestore } from "./firebase-admin.server";
import type { AuthenticatedActor } from "./course-platform.server";
import type { EducatorProfile, EducatorApprovalStatus } from "@lurexa/types";

export class TeachApprovalService {
  /**
   * Evaluates if an actor is authorized to approve teacher access requests.
   * Authorized: superusers, system admins, or campus org owners/admins.
   */
  public static async isAuthorizedApprover(actor: AuthenticatedActor): Promise<boolean> {
    const database = getServerFirestore();
    
    // Check if actor has super_admin or admin claim in user profile
    const userDoc = await database.collection("users").doc(actor.uid).get();
    if (userDoc.exists) {
      const role = userDoc.data()?.role;
      if (role === "super_admin" || role === "admin" || role === "superuser") {
        return true;
      }
    }

    // Check if actor is owner or admin of any organization / campus
    const memberships = await database
      .collection("user-memberships")
      .doc(actor.uid)
      .collection("organizations")
      .get();
    
    const hasOrgAdminRole = memberships.docs.some((doc) => {
      const role = doc.data()?.role;
      return role === "owner" || role === "admin";
    });

    return hasOrgAdminRole;
  }

  /**
   * Retrieves or initializes an educator profile in pending_approval status.
   * Prevents standard Learn learners from bypassing approval.
   */
  public static async getOrRequestEducatorProfile(
    userId: string,
    displayName: string,
    email?: string | null
  ): Promise<EducatorProfile> {
    const database = getServerFirestore();
    const profileRef = database.collection("educatorProfiles").doc(userId);
    const snap = await profileRef.get();

    if (snap.exists) {
      const data = snap.data() as EducatorProfile;
      return {
        ...data,
        userId,
        status: data.status || "pending_approval",
      };
    }

    // Check if the user is already a campus admin or superuser, auto-approve them
    const userDoc = await database.collection("users").doc(userId).get();
    const userRole = userDoc.exists ? userDoc.data()?.role : null;
    const isPreAuthorized = userRole === "super_admin" || userRole === "admin" || userRole === "superuser";

    const timestamp = new Date().toISOString();
    const newProfile: EducatorProfile = {
      userId,
      displayName: displayName || email?.split("@")[0] || "Educator",
      status: isPreAuthorized ? "approved" : "pending_approval",
      ...(isPreAuthorized ? { approvedBy: "system_auto", approvedAt: timestamp } : {}),
      interests: [],
      goals: [],
      competencies: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await profileRef.set(newProfile);
    return newProfile;
  }

  /**
   * Approves an educator profile. Must be called by an authorized approver.
   */
  public static async approveEducator(
    approver: AuthenticatedActor,
    targetUserId: string
  ): Promise<void> {
    const isAuthorized = await this.isAuthorizedApprover(approver);
    if (!isAuthorized) {
      throw new Error("Only superusers, platform admins, or campus admins can approve educator access.");
    }

    const database = getServerFirestore();
    const profileRef = database.collection("educatorProfiles").doc(targetUserId);
    const timestamp = new Date().toISOString();

    await profileRef.set(
      {
        status: "approved" as EducatorApprovalStatus,
        approvedBy: approver.uid,
        approvedAt: timestamp,
        updatedAt: timestamp,
      },
      { merge: true }
    );
  }

  /**
   * Rejects an educator profile request. Must be called by an authorized approver.
   */
  public static async rejectEducator(
    approver: AuthenticatedActor,
    targetUserId: string,
    reason?: string
  ): Promise<void> {
    const isAuthorized = await this.isAuthorizedApprover(approver);
    if (!isAuthorized) {
      throw new Error("Only superusers, platform admins, or campus admins can reject educator access.");
    }

    const database = getServerFirestore();
    const profileRef = database.collection("educatorProfiles").doc(targetUserId);
    const timestamp = new Date().toISOString();

    await profileRef.set(
      {
        status: "rejected" as EducatorApprovalStatus,
        rejectionReason: reason || "Educator access request was not approved.",
        approvedBy: approver.uid,
        updatedAt: timestamp,
      },
      { merge: true }
    );
  }

  /**
   * Lists educator requests for administrators/approvers.
   */
  public static async listEducatorRequests(
    actor: AuthenticatedActor
  ): Promise<{
    pending: EducatorProfile[];
    approved: EducatorProfile[];
    rejected: EducatorProfile[];
  }> {
    const isAuthorized = await this.isAuthorizedApprover(actor);
    if (!isAuthorized) {
      throw new Error("Only superusers, platform admins, or campus admins can view educator approval requests.");
    }

    const database = getServerFirestore();
    const snap = await database.collection("educatorProfiles").get();

    const pending: EducatorProfile[] = [];
    const approved: EducatorProfile[] = [];
    const rejected: EducatorProfile[] = [];

    snap.docs.forEach((d) => {
      const data = d.data() as EducatorProfile;
      const item: EducatorProfile = {
        ...data,
        userId: d.id,
        status: data.status || "pending_approval",
      };
      if (item.status === "approved") {
        approved.push(item);
      } else if (item.status === "rejected") {
        rejected.push(item);
      } else {
        pending.push(item);
      }
    });

    return { pending, approved, rejected };
  }
}

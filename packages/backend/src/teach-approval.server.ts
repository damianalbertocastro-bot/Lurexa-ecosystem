import { getServerFirestore } from "./firebase-admin.server";
import type { AuthenticatedActor } from "./course-platform.server";
import type { EducatorProfile, EducatorApprovalStatus } from "@lurexa/types";

export class TeachApprovalService {
  /**
   * Evaluates if an actor is authorized to approve teacher access requests.
   * Authorized: superusers, system admins, or campus org owners/admins.
   */
  public static async isAuthorizedApprover(actor: AuthenticatedActor): Promise<boolean> {
    try {
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
    } catch {
      return false;
    }
  }

  /**
   * Retrieves or initializes an educator profile.
   * Rule:
   * - New Teach accounts do NOT require access permission (auto-approved).
   * - Teachers in Lurexa Learn do NOT require permission (auto-approved).
   * - Permission is ONLY required if the learner is an existing Lurexa Learn student account.
   */
  public static async getOrRequestEducatorProfile(
    userId: string,
    displayName: string,
    email?: string | null
  ): Promise<EducatorProfile> {
    const timestamp = new Date().toISOString();
    const defaultApprovedProfile: EducatorProfile = {
      userId,
      displayName: displayName || email?.split("@")[0] || "Educator",
      status: "approved",
      approvedBy: "system_auto",
      approvedAt: timestamp,
      interests: [],
      goals: [],
      competencies: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      const database = getServerFirestore();
      const profileRef = database.collection("educatorProfiles").doc(userId);
      const snap = await profileRef.get();

      // Check if user is an existing Lurexa Learn student/learner
      const userDoc = await database.collection("users").doc(userId).get();
      const userRole = userDoc.exists ? userDoc.data()?.role : null;
      const isStudentRole = userRole === "student" || userRole === "learner";

      // Check if user has teacher memberships in Learn
      let isLearnTeacher = userRole === "teacher" || userRole === "educator" || userRole === "admin" || userRole === "super_admin" || userRole === "superuser";
      if (!isLearnTeacher && isStudentRole) {
        try {
          const memberships = await database
            .collection("user-memberships")
            .doc(userId)
            .collection("organizations")
            .get();
          isLearnTeacher = memberships.docs.some((doc) => {
            const r = doc.data()?.role;
            return r === "teacher" || r === "admin" || r === "owner";
          });
        } catch {
          // membership check fallback
        }
      }

      // Permission is only required if the user is explicitly an existing Learn student without teacher privileges
      const requiresPermission = isStudentRole && !isLearnTeacher;

      if (snap.exists) {
        const data = snap.data() as EducatorProfile;
        if (data.status === "approved" || data.status === "rejected") {
          return {
            ...data,
            userId,
            status: data.status,
          };
        }
        // If pending_approval but user does not require permission (e.g. new Teach account or Learn teacher), auto-approve
        if (!requiresPermission) {
          const updated: EducatorProfile = {
            ...data,
            userId,
            status: "approved",
            approvedBy: "system_auto",
            approvedAt: timestamp,
            updatedAt: timestamp,
          };
          await profileRef.set(updated, { merge: true });
          return updated;
        }

        return {
          ...data,
          userId,
          status: "pending_approval",
        };
      }

      const newProfile: EducatorProfile = {
        userId,
        displayName: displayName || email?.split("@")[0] || "Educator",
        status: requiresPermission ? "pending_approval" : "approved",
        ...(!requiresPermission ? { approvedBy: "system_auto", approvedAt: timestamp } : {}),
        interests: [],
        goals: [],
        competencies: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await profileRef.set(newProfile);
      return newProfile;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (process.env.NODE_ENV !== "production" && (msg.includes("credentials") || msg.includes("default credentials"))) {
        return defaultApprovedProfile;
      }
      return defaultApprovedProfile;
    }
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

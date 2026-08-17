import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { Organization, OrganizationMember, Invitation } from "@lurexa/types";

export const OrganizationService = {
  /**
   * Create a new organization and make the creating user the Owner/Teacher
   */
  async createOrganization(
    name: string,
    slug: string,
    ownerUserId: string
  ): Promise<Organization> {
    const orgId = doc(collection(db, "organizations")).id;

    const newOrg: Organization = {
      id: orgId,
      ownerId: ownerUserId,
      name,
      slug,
      plan: "free",
      settings: {
        allowSelfRegistration: true,
        aiQueryLimitPerStudent: 10,
        offlineSyncEnabled: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create the owner membership and its user-scoped lookup record atomically.
    const memberRef = doc(db, "organizations", orgId, "members", ownerUserId);
    const memberData: OrganizationMember = {
      id: ownerUserId,
      orgId,
      userId: ownerUserId,
      role: "owner",
      joinedAt: new Date().toISOString(),
    };
    const membershipIndexRef = doc(db, "user-memberships", ownerUserId, "organizations", orgId);
    const batch = writeBatch(db);
    batch.set(doc(db, "organizations", orgId), newOrg);
    batch.set(memberRef, memberData);
    batch.set(membershipIndexRef, memberData);
    await batch.commit();

    return newOrg;
  },

  /**
   * Generate an invitation code for students/teachers to join an org
   */
  async createInvitation(
    orgId: string,
    email: string,
    role: "teacher" | "student" = "student"
  ): Promise<Invitation> {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const inviteRef = doc(db, "invitations", code);

    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const invitation: Invitation = {
      id: code,
      orgId,
      email,
      role,
      code,
      expiresAt: new Date(expiresAt).toISOString(),
      expiresAtMillis: expiresAt,
      usedAt: null,
    };

    await setDoc(inviteRef, invitation);
    return invitation;
  },

  /**
   * Join an organization using an invitation code
   */
  async joinViaCode(userId: string, email: string, code: string): Promise<OrganizationMember> {
    const inviteRef = doc(db, "invitations", code.toUpperCase());
    const inviteDoc = await getDoc(inviteRef);

    if (!inviteDoc.exists()) {
      throw new Error("Invalid invitation code.");
    }

    const invite = inviteDoc.data() as Invitation;

    if (invite.email !== email) {
      throw new Error("Invalid invitation code.");
    }

    if (new Date(invite.expiresAt) < new Date()) {
      throw new Error("Invitation code has expired.");
    }

    // Add user as member of org
    const memberRef = doc(db, "organizations", invite.orgId, "members", userId);
    const newMember: OrganizationMember = {
      id: userId,
      orgId: invite.orgId,
      userId,
      role: invite.role,
      invitationId: inviteDoc.id,
      joinedAt: new Date().toISOString(),
    };

    const batch = writeBatch(db);
    batch.set(memberRef, newMember);
    batch.set(doc(db, "user-memberships", userId, "organizations", invite.orgId), newMember);
    batch.update(inviteDoc.ref, { usedAt: new Date().toISOString() });
    await batch.commit();
    return newMember;
  },

  async getInvitationsForOrganization(orgId: string): Promise<Invitation[]> {
    const invitations = await getDocs(
      query(collection(db, "invitations"), where("orgId", "==", orgId)),
    );

    return invitations.docs
      .map((invitation) => invitation.data() as Invitation)
      .sort((first, second) => second.expiresAtMillis - first.expiresAtMillis);
  },

  async revokeInvitation(invitationId: string): Promise<void> {
    await deleteDoc(doc(db, "invitations", invitationId));
  },

  async getMembershipsForUser(userId: string): Promise<OrganizationMember[]> {
    const memberships = await getDocs(collection(db, "user-memberships", userId, "organizations"));

    return memberships.docs.map((member) => member.data() as OrganizationMember);
  },
};

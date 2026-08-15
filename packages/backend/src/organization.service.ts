import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
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

    // Save Organization
    await setDoc(doc(db, "organizations", orgId), newOrg);

    // Create Member record for the owner
    const memberRef = doc(db, "organizations", orgId, "members", ownerUserId);
    const memberData: OrganizationMember = {
      id: ownerUserId,
      orgId,
      userId: ownerUserId,
      role: "owner",
      joinedAt: new Date().toISOString(),
    };
    await setDoc(memberRef, memberData);

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
    const inviteId = doc(collection(db, "invitations")).id;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const invitation: Invitation = {
      id: inviteId,
      orgId,
      email,
      role,
      code,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    await setDoc(doc(db, "invitations", inviteId), invitation);
    return invitation;
  },

  /**
   * Join an organization using an invitation code
   */
  async joinViaCode(userId: string, code: string): Promise<OrganizationMember> {
    const q = query(collection(db, "invitations"), where("code", "==", code.toUpperCase()));
    const snap = await getDocs(q);

    if (snap.empty) {
      throw new Error("Invalid invitation code.");
    }

    const inviteDoc = snap.docs[0];
    const invite = inviteDoc.data() as Invitation;

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
      joinedAt: new Date().toISOString(),
    };

    await setDoc(memberRef, newMember);
    return newMember;
  },
};

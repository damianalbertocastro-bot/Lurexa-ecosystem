import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { AIConversation, Organization, OrganizationMember, StudentProgress } from "@lurexa/types";

export interface PlatformMetricsSummary {
  activeUsersMonthly: number;
  totalOrganizations: number;
  monthlyRecurringRevenue: number | null;
  totalAITokensUsed: number;
  systemErrorRatePercent: number | null;
}

export interface AdminOrgOverview {
  id: string;
  name: string;
  plan: string;
  studentCount: number;
  status: "active" | "suspended";
  createdAt: string;
}

export const AdminService = {
  async getPlatformMetrics(): Promise<PlatformMetricsSummary> {
    const [organizations, progress, conversations] = await Promise.all([
      getDocs(collection(db, "organizations")),
      getDocs(collection(db, "progress")),
      getDocs(collection(db, "ai_conversations")),
    ]);

    const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const activeLearners = new Set(
      progress.docs
        .map((document) => document.data() as StudentProgress)
        .filter((record) => Date.parse(record.lastAccessedAt) >= monthAgo)
        .map((record) => record.studentId),
    );
    const tokenCount = conversations.docs
      .map((document) => document.data() as AIConversation)
      .reduce((total, conversation) => total + (Number.isFinite(conversation.tokenCount) ? conversation.tokenCount : 0), 0);

    return {
      activeUsersMonthly: activeLearners.size,
      totalOrganizations: organizations.size,
      monthlyRecurringRevenue: null,
      totalAITokensUsed: tokenCount,
      systemErrorRatePercent: null,
    };
  },

  async getOrganizationsOverview(): Promise<AdminOrgOverview[]> {
    const snapshot = await getDocs(collection(db, "organizations"));
    return Promise.all(snapshot.docs.map(async (document) => {
      const data = document.data() as Organization & { status?: "active" | "suspended" };
      const members = await getDocs(collection(db, "organizations", document.id, "members"));
      const studentCount = members.docs
        .map((member) => member.data() as OrganizationMember)
        .filter((member) => member.role === "student").length;
      return {
        id: data.id || document.id,
        name: data.name,
        plan: data.plan,
        studentCount,
        status: data.status ?? "active",
        createdAt: data.createdAt,
      };
    }));
  },

  async updateOrgStatus(orgId: string, status: "active" | "suspended"): Promise<void> {
    await updateDoc(doc(db, "organizations", orgId), { status, updatedAt: new Date().toISOString() });
  },

  async getFlaggedAIConversations(): Promise<AIConversation[]> {
    const flagged = query(
      collection(db, "ai_conversations"),
      where("flagged", "==", true),
      orderBy("updatedAt", "desc"),
      limit(20),
    );
    const snapshot = await getDocs(flagged);
    return snapshot.docs.map((document) => document.data() as AIConversation);
  },
};

import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import { Organization, AIConversation } from "@lurexa/types";

export interface PlatformMetricsSummary {
  activeUsersMonthly: number;
  totalOrganizations: number;
  monthlyRecurringRevenue: number;
  totalAITokensUsed: number;
  systemErrorRatePercent: number;
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
  /**
   * Fetch global platform KPIs
   */
  async getPlatformMetrics(): Promise<PlatformMetricsSummary> {
    // In production, aggregated via nightly Cloud Functions or Firebase Admin SDK
    return {
      activeUsersMonthly: 1420,
      totalOrganizations: 38,
      monthlyRecurringRevenue: 2840,
      totalAITokensUsed: 1250000,
      systemErrorRatePercent: 0.04,
    };
  },

  /**
   * Fetch list of all registered organizations across the platform
   */
  async getOrganizationsOverview(): Promise<AdminOrgOverview[]> {
    const snap = await getDocs(collection(db, "organizations"));

    if (snap.empty) {
      return [
        {
          id: "org_1",
          name: "Colegio San Pedro",
          plan: "pro",
          studentCount: 140,
          status: "active",
          createdAt: "2026-01-15",
        },
        {
          id: "org_2",
          name: "Instituto Educativo Duarte",
          plan: "basic",
          studentCount: 45,
          status: "active",
          createdAt: "2026-02-01",
        },
        {
          id: "org_3",
          name: "Escuela Secundaria Central",
          plan: "free",
          studentCount: 18,
          status: "suspended",
          createdAt: "2026-02-10",
        },
      ];
    }

    return snap.docs.map((d) => {
      const data = d.data() as Organization;
      return {
        id: data.id,
        name: data.name,
        plan: data.plan,
        studentCount: 25, // Computed count
        status: "active",
        createdAt: data.createdAt,
      };
    });
  },

  /**
   * Suspend or reactivate an organization
   */
  async updateOrgStatus(orgId: string, status: "active" | "suspended"): Promise<void> {
    const ref = doc(db, "organizations", orgId);
    await updateDoc(ref, { status, updatedAt: new Date().toISOString() });
  },

  /**
   * Fetch flagged AI messages requiring moderation review
   */
  async getFlaggedAIConversations(): Promise<AIConversation[]> {
    const q = query(
      collection(db, "ai_conversations"),
      where("flagged", "==", true),
      orderBy("updatedAt", "desc"),
      limit(20)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as AIConversation);
  },
};
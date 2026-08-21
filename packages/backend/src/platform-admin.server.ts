import type {
  AdminDashboardProjection,
  AdminOrgOverview,
  AIConversation,
  Organization,
  OrganizationMember,
  PlatformMetricsSummary,
  StudentProgress,
} from "@lurexa/types";
import { getServerFirebaseAuth, getServerFirestore } from "./firebase-admin.server";

export interface PlatformAdminActor {
  uid: string;
  email: string | null;
}

async function requireSuperAdmin(authorization: string | null): Promise<PlatformAdminActor> {
  if (!authorization?.startsWith("Bearer ")) throw new Error("Authentication is required.");
  const token = await getServerFirebaseAuth().verifyIdToken(authorization.slice(7));
  if (token.role !== "super_admin") throw new Error("Superadmin access is required.");
  return { uid: token.uid, email: token.email ?? null };
}

async function buildMetrics(): Promise<PlatformMetricsSummary> {
  const database = getServerFirestore();
  const [organizations, progress, conversations] = await Promise.all([
    database.collection("organizations").get(),
    database.collection("progress").get(),
    database.collection("ai_conversations").get(),
  ]);
  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const activeLearners = new Set(
    progress.docs
      .map((document) => document.data() as StudentProgress)
      .filter((record) => Date.parse(record.lastAccessedAt) >= monthAgo)
      .map((record) => record.studentId),
  );
  const totalAITokensUsed = conversations.docs
    .map((document) => document.data() as AIConversation)
    .reduce((total, conversation) => total + (Number.isFinite(conversation.tokenCount) ? conversation.tokenCount : 0), 0);

  return {
    activeUsersMonthly: activeLearners.size,
    totalOrganizations: organizations.size,
    monthlyRecurringRevenue: null,
    totalAITokensUsed,
    systemErrorRatePercent: null,
  };
}

async function buildOrganizations(): Promise<AdminOrgOverview[]> {
  const database = getServerFirestore();
  const organizations = await database.collection("organizations").get();
  const overviews = await Promise.all(organizations.docs.map(async (document) => {
    const data = document.data() as Organization & { status?: "active" | "suspended" };
    const members = await document.ref.collection("members").get();
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
    } satisfies AdminOrgOverview;
  }));
  return overviews.sort((first, second) => first.name.localeCompare(second.name));
}

export const PlatformAdminService = {
  authenticate: requireSuperAdmin,

  async getDashboard(): Promise<AdminDashboardProjection> {
    const [metrics, organizations] = await Promise.all([buildMetrics(), buildOrganizations()]);
    return {
      generatedAt: new Date().toISOString(),
      metrics,
      organizations,
    };
  },

  async updateOrganizationStatus(
    actor: PlatformAdminActor,
    orgId: string,
    status: "active" | "suspended",
  ): Promise<void> {
    void actor;
    const database = getServerFirestore();
    const organization = database.collection("organizations").doc(orgId);
    const snapshot = await organization.get();
    if (!snapshot.exists) throw new Error("Organization not found.");
    await organization.update({ status, updatedAt: new Date().toISOString() });
  },

  async getFlaggedAIConversations(actor: PlatformAdminActor): Promise<AIConversation[]> {
    void actor;
    const snapshot = await getServerFirestore()
      .collection("ai_conversations")
      .where("flagged", "==", true)
      .orderBy("updatedAt", "desc")
      .limit(20)
      .get();
    return snapshot.docs.map((document) => document.data() as AIConversation);
  },
};

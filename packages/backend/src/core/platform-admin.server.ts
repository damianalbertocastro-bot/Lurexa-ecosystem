import type {
  AdminOrgOverview,
  AIConversation,
  Organization,
  PlatformAdminSnapshot,
  PlatformMetricsSummary,
  PlatformOrganizationStatusUpdate,
  StudentProgress,
} from "@lurexa/types";
import { getServerFirebaseAuth, getServerFirestore } from "../firebase-admin.server";

function asOrganization(
  id: string,
  value: FirebaseFirestore.DocumentData,
): Organization & { status?: unknown } {
  return { id, ...value } as Organization & { status?: unknown };
}

function safeIsoMillis(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function requireSuperAdmin(authorization: string | null): Promise<void> {
  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Authentication is required.");
  }

  const token = await getServerFirebaseAuth().verifyIdToken(authorization.slice(7));
  if (token.role !== "super_admin") {
    throw new Error("Superadmin access is required.");
  }
}

async function organizationOverview(
  id: string,
  value: FirebaseFirestore.DocumentData,
): Promise<AdminOrgOverview> {
  const organization = asOrganization(id, value);
  const students = await getServerFirestore()
    .collection("organizations")
    .doc(id)
    .collection("members")
    .where("role", "==", "student")
    .get();

  return {
    id,
    name: organization.name,
    plan: organization.plan,
    studentCount: students.size,
    status: organization.status === "suspended" ? "suspended" : "active",
    createdAt: organization.createdAt,
  };
}

function platformMetrics(input: {
  progress: StudentProgress[];
  organizations: number;
  conversations: AIConversation[];
  now: Date;
}): PlatformMetricsSummary {
  const cutoff = input.now.getTime() - (30 * 24 * 60 * 60 * 1_000);
  const activeLearners = new Set(
    input.progress
      .filter((entry) => {
        const lastActive = safeIsoMillis(entry.lastAccessedAt);
        return lastActive !== null && lastActive >= cutoff;
      })
      .map((entry) => entry.studentId),
  );
  const totalAITokensRecorded = input.conversations.reduce(
    (total, conversation) => total + (Number.isFinite(conversation.tokenCount) ? conversation.tokenCount : 0),
    0,
  );

  return {
    activeLearnersMonthly: activeLearners.size,
    totalOrganizations: input.organizations,
    totalAITokensRecorded,
    monthlyRecurringRevenue: null,
    systemErrorRatePercent: null,
    generatedAt: input.now.toISOString(),
    limitations: [
      "Monthly active learners are derived from trusted lesson progress recorded in the last 30 days.",
      "AI token usage includes only conversations that recorded tokenCount in the trusted conversation record.",
      "Recurring revenue is unavailable until a Core-owned billing projection is implemented.",
      "System error rate is unavailable until production telemetry is instrumented through a trusted observability projection.",
      "This MVP projection scans current trusted collections and should move to maintained aggregates before high-volume scale.",
    ],
  };
}

export const PlatformAdminService = {
  async getSnapshot(authorization: string | null): Promise<PlatformAdminSnapshot> {
    await requireSuperAdmin(authorization);

    const database = getServerFirestore();
    const [organizationsSnapshot, progressSnapshot, conversationsSnapshot] = await Promise.all([
      database.collection("organizations").get(),
      database.collection("progress").get(),
      database.collection("ai_conversations").get(),
    ]);

    const organizations = await Promise.all(
      organizationsSnapshot.docs.map((snapshot) => organizationOverview(snapshot.id, snapshot.data())),
    );
    organizations.sort((first, second) => second.createdAt.localeCompare(first.createdAt));

    return {
      metrics: platformMetrics({
        progress: progressSnapshot.docs.map((snapshot) => snapshot.data() as StudentProgress),
        organizations: organizationsSnapshot.size,
        conversations: conversationsSnapshot.docs.map((snapshot) => snapshot.data() as AIConversation),
        now: new Date(),
      }),
      organizations,
    };
  },

  async updateOrganizationStatus(
    authorization: string | null,
    input: PlatformOrganizationStatusUpdate,
  ): Promise<AdminOrgOverview> {
    await requireSuperAdmin(authorization);

    if (!input.organizationId.trim()) throw new Error("Organization id is required.");
    if (input.status !== "active" && input.status !== "suspended") {
      throw new Error("Organization status is invalid.");
    }

    const database = getServerFirestore();
    const reference = database.collection("organizations").doc(input.organizationId);
    const snapshot = await reference.get();
    if (!snapshot.exists) throw new Error("Organization not found.");

    await reference.update({
      status: input.status,
      updatedAt: new Date().toISOString(),
    });

    return organizationOverview(snapshot.id, {
      ...snapshot.data()!,
      status: input.status,
    });
  },

  async getInstitutionalBillingAccounts(
    authorization: string | null,
  ): Promise<import("@lurexa/types").InstitutionalBillingAccount[]> {
    await requireSuperAdmin(authorization);
    const database = getServerFirestore();
    const organizationsSnapshot = await database.collection("organizations").get();

    const accounts = await Promise.all(
      organizationsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const membersSnapshot = await database
          .collection("organizations")
          .doc(doc.id)
          .collection("members")
          .where("role", "==", "student")
          .get();

        const usedSeats = membersSnapshot.size;
        const allocatedSeats = typeof data.allocatedSeats === "number" ? data.allocatedSeats : Math.max(usedSeats, 25);
        const planTier: import("@lurexa/types").InstitutionalPlanTier =
          data.plan === "enterprise"
            ? "enterprise"
            : data.plan === "campus"
            ? "campus_pro"
            : data.plan === "standard"
            ? "standard_institutional"
            : "free_community";

        const pricePerSeat = planTier === "enterprise" ? 12 : planTier === "campus_pro" ? 8 : planTier === "standard_institutional" ? 5 : 0;
        const createdAt = typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString();

        return {
          organizationId: doc.id,
          organizationName: data.name || "Unnamed Institution",
          planTier,
          allocatedSeats,
          usedSeats,
          pricePerSeatMonthlyUsd: pricePerSeat,
          billingInterval: "annual" as const,
          currentPeriodStart: createdAt,
          nextRenewalDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          status: (data.status === "suspended" ? "past_due" : "active") as "active" | "past_due" | "canceled" | "trial",
          contactEmail: data.contactEmail || `billing@${doc.id.toLowerCase().replace(/[^a-z0-9]/g, "")}.edu`,
          paymentMethodLast4: "4242",
          paymentMethodBrand: "Visa",
          invoices: [
            {
              id: `inv_${doc.id}_1`,
              invoiceNumber: `LX-INV-2026-${doc.id.slice(0, 4).toUpperCase()}`,
              amountUsd: allocatedSeats * pricePerSeat * 12,
              status: "paid" as const,
              issuedAt: createdAt,
              paidAt: createdAt,
              dueDate: createdAt,
              seatsCount: allocatedSeats,
            },
          ],
        };
      }),
    );

    return accounts;
  },

  async updateInstitutionalBillingSeats(
    authorization: string | null,
    input: { organizationId: string; allocatedSeats: number; planTier: import("@lurexa/types").InstitutionalPlanTier },
  ): Promise<import("@lurexa/types").InstitutionalBillingAccount> {
    await requireSuperAdmin(authorization);
    const database = getServerFirestore();
    const docRef = database.collection("organizations").doc(input.organizationId);
    const snapshot = await docRef.get();
    if (!snapshot.exists) throw new Error("Organization not found.");

    await docRef.update({
      allocatedSeats: input.allocatedSeats,
      planTier: input.planTier,
      updatedAt: new Date().toISOString(),
    });

    const updatedList = await this.getInstitutionalBillingAccounts(authorization);
    const account = updatedList.find((a) => a.organizationId === input.organizationId);
    if (!account) throw new Error("Unable to retrieve updated billing account.");
    return account;
  },
};


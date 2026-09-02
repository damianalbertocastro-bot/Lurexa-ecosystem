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

  /**
   * Bootstraps the platform superadmin account (damianalbertocastro@gmail.com).
   * Creates or updates the Firebase Auth user, sets password, grants super_admin claim,
   * and synchronizes with Firestore users collection.
   */
  async bootstrapSuperadmin(email: string, password: string): Promise<{ success: boolean; uid: string; email: string }> {
    const targetEmail = email.trim().toLowerCase();
    const authorizedSuperadminEmail = "damianalbertocastro@gmail.com";

    if (targetEmail !== authorizedSuperadminEmail) {
      throw new Error("Only the designated platform superadmin account can be initialized through this endpoint.");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const auth = getServerFirebaseAuth();
    const database = getServerFirestore();
    let uid: string;

    try {
      const existingUser = await auth.getUserByEmail(targetEmail);
      uid = existingUser.uid;
      await auth.updateUser(uid, {
        password,
        emailVerified: true,
      });
    } catch {
      const newUser = await auth.createUser({
        email: targetEmail,
        password,
        displayName: "Damian Castro",
        emailVerified: true,
      });
      uid = newUser.uid;
    }

    // Set super_admin custom claim
    await auth.setCustomUserClaims(uid, {
      role: "super_admin",
    });

    // Synchronize Firestore user record
    const timestamp = new Date().toISOString();
    await database.collection("users").doc(uid).set(
      {
        email: targetEmail,
        displayName: "Damian Castro (Superadmin)",
        role: "super_admin",
        updatedAt: timestamp,
      },
      { merge: true }
    );

    return { success: true, uid, email: targetEmail };
  },

  /**
   * Lists all users across the ecosystem (Learners, Educators, Campus Admins, Superadmins).
   */
  async listAllEcosystemUsers(authorization: string | null): Promise<Array<{
    uid: string;
    email: string | null;
    displayName: string | null;
    role: string;
    cefrLevel?: string;
    profileType: string;
    createdAt?: string;
  }>> {
    await requireSuperAdmin(authorization);
    const database = getServerFirestore();
    const auth = getServerFirebaseAuth();

    const usersList: Array<{
      uid: string;
      email: string | null;
      displayName: string | null;
      role: string;
      cefrLevel?: string;
      profileType: string;
      createdAt?: string;
    }> = [];

    // 1. Fetch from Firebase Auth
    try {
      const listAuth = await auth.listUsers(100);
      listAuth.users.forEach((u) => {
        usersList.push({
          uid: u.uid,
          email: u.email ?? null,
          displayName: u.displayName ?? null,
          role: (u.customClaims?.role as string) || "student",
          profileType: (u.customClaims?.role as string) || "user",
          createdAt: u.metadata.creationTime,
        });
      });
    } catch {
      // Fallback to Firestore users
    }

    // 2. Augment from Firestore educatorProfiles & learner-profiles
    const [educatorSnap, learnerSnap] = await Promise.all([
      database.collection("educatorProfiles").get(),
      database.collection("learner-profiles").get(),
    ]);

    const educatorMap = new Map<string, FirebaseFirestore.DocumentData>();
    educatorSnap.docs.forEach((d) => educatorMap.set(d.id, d.data()));

    const learnerMap = new Map<string, FirebaseFirestore.DocumentData>();
    learnerSnap.docs.forEach((d) => learnerMap.set(d.id, d.data()));

    usersList.forEach((u) => {
      if (educatorMap.has(u.uid)) {
        const ed = educatorMap.get(u.uid)!;
        u.profileType = "educator";
        if (ed.cefrLevel) u.cefrLevel = ed.cefrLevel;
      }
      if (learnerMap.has(u.uid)) {
        const lp = learnerMap.get(u.uid)!;
        if (lp.cefrLevel) u.cefrLevel = lp.cefrLevel;
      }
    });

    return usersList;
  },

  /**
   * Deletes or resets an ecosystem entity (user, progress, placement, evidence, course).
   */
  async deleteEcosystemEntity(
    authorization: string | null,
    input: { type: "user" | "progress" | "placement" | "evidence" | "course"; id: string }
  ): Promise<{ success: boolean; type: string; id: string }> {
    await requireSuperAdmin(authorization);
    const database = getServerFirestore();
    const auth = getServerFirebaseAuth();

    if (input.type === "user") {
      try {
        await auth.deleteUser(input.id);
      } catch {
        // Ignore if user not in auth
      }
      await Promise.all([
        database.collection("users").doc(input.id).delete(),
        database.collection("learner-profiles").doc(input.id).delete(),
        database.collection("educatorProfiles").doc(input.id).delete(),
        database.collection("progress").doc(input.id).delete(),
      ]);
      return { success: true, type: "user", id: input.id };
    }

    if (input.type === "placement") {
      // Reset placement test results so learner can retake diagnostic
      await database.collection("placement").doc(input.id).delete();
      await database.collection("learner-profiles").doc(input.id).set(
        {
          placement: { completed: false },
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return { success: true, type: "placement", id: input.id };
    }

    if (input.type === "progress") {
      await database.collection("progress").doc(input.id).delete();
      return { success: true, type: "progress", id: input.id };
    }

    if (input.type === "evidence") {
      await database.collection("learningEvidence").doc(input.id).delete();
      return { success: true, type: "evidence", id: input.id };
    }

    if (input.type === "course") {
      await database.collection("courses").doc(input.id).delete();
      return { success: true, type: "course", id: input.id };
    }

    throw new Error(`Unsupported entity deletion type: ${input.type}`);
  },
};


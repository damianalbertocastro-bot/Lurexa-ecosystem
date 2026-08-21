import type {
  Organization,
  OrganizationMember,
  OrganizationPlanProjection,
  PricingPlan,
  Subscription,
} from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { PLAN_CONFIGS } from "./billing.service";

const managerRoles = new Set(["owner", "admin", "teacher"]);

async function resolveOrganization(actorId: string, requestedOrgId?: string): Promise<{ id: string; data: Organization }> {
  const database = getServerFirestore();
  const memberships = await database
    .collection("user-memberships")
    .doc(actorId)
    .collection("organizations")
    .get();
  const eligible = memberships.docs.filter((document) => managerRoles.has(document.data().role));
  const selected = requestedOrgId ? eligible.find((document) => document.id === requestedOrgId) : eligible[0];
  if (!selected) throw new Error("A teacher organization membership is required.");

  const snapshot = await database.collection("organizations").doc(selected.id).get();
  if (!snapshot.exists) throw new Error("Organization not found.");
  return { id: selected.id, data: { id: selected.id, ...snapshot.data() } as Organization };
}

function resolvePlan(organization: Organization, subscription: Subscription | null): PricingPlan {
  if (subscription && ["active", "trialing", "trailing"].includes(subscription.status)) {
    return subscription.plan;
  }
  return organization.plan;
}

export const OrganizationPlanService = {
  async getTeacherProjection(actorId: string, requestedOrgId?: string): Promise<OrganizationPlanProjection> {
    const database = getServerFirestore();
    const organization = await resolveOrganization(actorId, requestedOrgId);
    const [subscriptionSnapshot, members] = await Promise.all([
      database.collection("subscriptions").doc(organization.id).get(),
      database.collection("organizations").doc(organization.id).collection("members").get(),
    ]);
    const subscription = subscriptionSnapshot.exists
      ? subscriptionSnapshot.data() as Subscription
      : null;
    const plan = resolvePlan(organization.data, subscription);
    const studentSeats = members.docs
      .map((document) => document.data() as OrganizationMember)
      .filter((member) => member.role === "student").length;

    return {
      organizationId: organization.id,
      organizationName: organization.data.name,
      plan,
      limits: PLAN_CONFIGS[plan],
      studentSeats,
      subscriptionStatus: subscription?.status ?? null,
      generatedAt: new Date().toISOString(),
    };
  },
};

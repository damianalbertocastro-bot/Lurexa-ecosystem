import type { CapabilityRegistryEntry, ProductEntryPoint, ResolvedEntitlements } from "@lurexa/types";
import { SubscriptionService } from "./subscription.service";
import { getServerFirestore } from "./firebase-admin.server";

export async function resolveAuthorizedCapability(input: {
  learnerId: string;
  organizationId: string;
  product: ProductEntryPoint;
  capability: CapabilityRegistryEntry;
}): Promise<ResolvedEntitlements> {
  const database = getServerFirestore();
  const userSnapshot = await database.collection("users").doc(input.learnerId).get();
  const user = userSnapshot.exists ? userSnapshot.data() : undefined;
  const organizationSnapshot = await database.collection("organizations").doc(input.organizationId).get();
  const organization = organizationSnapshot.exists ? organizationSnapshot.data() : undefined;
  const businessContract = organization?.businessContract as Parameters<typeof SubscriptionService.resolveEntitlements>[0]["businessContract"] | undefined;

  const entitlements = SubscriptionService.resolveEntitlements({
    tier: user?.subscriptionTier as Parameters<typeof SubscriptionService.resolveEntitlements>[0]["tier"],
    product: input.product,
    subscribedProduct: user?.subscribedProduct as ProductEntryPoint | undefined,
    businessContract: businessContract ?? null,
  });

  const required = input.capability.entitlementCapability;
  if (required && !entitlements.capabilities.includes(required)) {
    throw new Error("The requested capability is not included in the resolved entitlement.");
  }
  return entitlements;
}

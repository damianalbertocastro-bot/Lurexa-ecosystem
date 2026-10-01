import type { ProductEntryPoint, ResolvedEntitlements } from "@lurexa/types";
import { CAPABILITY_REGISTRY, type CapabilityRegistryEntry } from "@lurexa/types";
import { SubscriptionService } from "./subscription.service";
import { getServerFirestore } from "./firebase-admin.server";

export interface AuthorizedCapabilityResolution {
  capability: CapabilityRegistryEntry;
  entitlements: ResolvedEntitlements;
}

/**
 * Resolves a capability from the canonical registry and evaluates it against
 * server-owned Core identity, organization and commercial state.
 *
 * Runtime callers should provide capabilityId, never a caller-constructed
 * capability definition. The registry is the authority for provider,
 * entitlement, quota and scope metadata.
 */
export async function authorizeCommercialCapability(input: {
  learnerId: string;
  organizationId: string;
  product: ProductEntryPoint;
  capabilityId: string;
}): Promise<AuthorizedCapabilityResolution> {
  const capability = CAPABILITY_REGISTRY.find((entry) => entry.id === input.capabilityId);
  if (!capability || !capability.enabled) {
    throw new Error("The requested capability is not registered or enabled.");
  }
  if (capability.product !== input.product) {
    throw new Error("Capability/product mismatch.");
  }

  const database = getServerFirestore();
  const userSnapshot = await database.collection("users").doc(input.learnerId).get();
  if (!userSnapshot.exists) throw new Error("Learner identity not found.");

  const user = userSnapshot.data();
  const userOrganizationId = user?.organizationId;
  if (typeof userOrganizationId === "string" && userOrganizationId && userOrganizationId !== input.organizationId) {
    throw new Error("Learner is not authorized for the requested organization.");
  }

  const organizationSnapshot = await database.collection("organizations").doc(input.organizationId).get();
  const organization = organizationSnapshot.exists ? organizationSnapshot.data() : undefined;
  const businessContract = organization?.businessContract as Parameters<typeof SubscriptionService.resolveEntitlements>[0]["businessContract"] | undefined;

  if (capability.organizationScope === "organization" && !businessContract) {
    throw new Error("The requested capability requires an authorized organization contract.");
  }

  const entitlements = SubscriptionService.resolveEntitlements({
    tier: user?.subscriptionTier as Parameters<typeof SubscriptionService.resolveEntitlements>[0]["tier"],
    product: input.product,
    subscribedProduct: user?.subscribedProduct as ProductEntryPoint | undefined,
    businessContract: businessContract ?? null,
  });

  const required = capability.entitlementCapability;
  if (required && !entitlements.capabilities.includes(required)) {
    throw new Error("The requested capability is not included in the resolved entitlement.");
  }

  return { capability, entitlements };
}

/**
 * Compatibility projection for existing server callers. New runtime paths
 * should use authorizeCommercialCapability so capability metadata is always
 * resolved from the canonical registry.
 */
export async function resolveAuthorizedCapability(input: {
  learnerId: string;
  organizationId: string;
  product: ProductEntryPoint;
  capability: CapabilityRegistryEntry;
}): Promise<ResolvedEntitlements> {
  const resolution = await authorizeCommercialCapability({
    learnerId: input.learnerId,
    organizationId: input.organizationId,
    product: input.product,
    capabilityId: input.capability.id,
  });
  return resolution.entitlements;
}

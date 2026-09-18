import {
  CapabilityId,
  CommercialContext,
  EntitlementSource,
  ProductEntitlement,
  ResolvedEntitlements,
  SubscriptionEntitlementSource,
  SubscriptionPlan,
} from "@lurexa/types";

export interface EntitlementResolutionInput {
  subjectId: string;
  subscription?: SubscriptionEntitlementSource;
  productEntitlements?: ProductEntitlement[];
  capabilityEntitlements?: Array<{
    capability: CapabilityId;
    product?: ProductEntitlement["product"];
    source: EntitlementSource;
  }>;
  educatorBenefits?: Array<{
    capability: "educator.coach_full";
    status: "active" | "expired" | "revoked";
    sourceId: string;
    context?: CommercialContext;
  }>;
}

/**
 * Deterministically resolves already-trusted Core grants.
 *
 * This service does not inspect billing providers, Firestore directly, or
 * professional qualification. Callers must supply trusted records.
 */
export class EntitlementResolutionService {
  public static resolve(input: EntitlementResolutionInput): ResolvedEntitlements {
    const products = new Set<ProductEntitlement["product"]>();
    const capabilities = new Set<CapabilityId>();
    const contexts = new Set<CommercialContext>();
    const sources = new Set<string>();

    if (input.subscription && ["active", "trialing"].includes(input.subscription.status)) {
      const subscription = input.subscription;
      contexts.add(subscription.context);
      sources.add(subscription.id);

      if (subscription.plan === "basic") {
        products.add("learn");
        products.add("coach");
        capabilities.add("learn.basic");
        capabilities.add("coach.basic");
        capabilities.add("standard.voice");
      }

      if (subscription.plan === "plus" && subscription.selectedProduct) {
        products.add(subscription.selectedProduct);
        capabilities.add(
          subscription.selectedProduct === "learn"
            ? "learn.full"
            : subscription.selectedProduct === "coach"
              ? "coach.full"
              : "teach.full"
        );
      }

      if (subscription.plan === "ultra") {
        products.add("learn");
        products.add("coach");
        capabilities.add("learn.full");
        capabilities.add("coach.full");
        capabilities.add("learner_model.cross_product");
        capabilities.add("premium.elevenlabs");
      }
    }

    for (const entitlement of input.productEntitlements ?? []) {
      if (entitlement.status !== "active") continue;
      products.add(entitlement.product);
      contexts.add(entitlement.source.context);
      sources.add(entitlement.source.sourceId);
    }

    for (const entitlement of input.capabilityEntitlements ?? []) {
      capabilities.add(entitlement.capability);
      if (entitlement.product) products.add(entitlement.product);
      contexts.add(entitlement.source.context);
      sources.add(entitlement.source.sourceId);
    }

    for (const benefit of input.educatorBenefits ?? []) {
      if (benefit.status !== "active") continue;
      capabilities.add(benefit.capability);
      contexts.add(benefit.context ?? "educator");
      sources.add(benefit.sourceId);
    }

    return {
      subjectId: input.subjectId,
      products: [...products],
      capabilities: [...capabilities],
      commercialContexts: [...contexts],
      activeSources: [...sources],
      quotas: [],
      resolvedAt: new Date().toISOString(),
    };
  }

  public static hasCapability(
    resolved: ResolvedEntitlements,
    capability: CapabilityId
  ): boolean {
    return resolved.capabilities.includes(capability);
  }

  public static hasProduct(
    resolved: ResolvedEntitlements,
    product: ProductEntitlement["product"]
  ): boolean {
    return resolved.products.includes(product);
  }
}

export const normalizeSubscriptionPlan = (value: string): SubscriptionPlan | null => {
  const normalized = value.toLowerCase();
  return normalized === "basic" || normalized === "plus" || normalized === "ultra"
    ? normalized
    : null;
};

import type { TierPricingPlan } from "@lurexa/types";
import { LUREXA_PRICING_PLANS } from "@lurexa/types";

export interface PlanConfig {
  tier: "basic" | "plus" | "ultra" | "enterprise";
  name: string;
  monthlyPriceUsd: number;
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
}

export const BILLING_TIER_CONFIG: Record<"basic" | "plus" | "ultra" | "enterprise", PlanConfig> = {
  basic: {
    tier: "basic",
    name: "Lurexa Basic",
    monthlyPriceUsd: 0,
  },
  plus: {
    tier: "plus",
    name: "Lurexa Plus",
    monthlyPriceUsd: 9.99,
    stripePriceIdMonthly: "price_plus_monthly_999",
    stripePriceIdAnnual: "price_plus_annual_9900",
  },
  ultra: {
    tier: "ultra",
    name: "Lurexa Ultra",
    monthlyPriceUsd: 19.99,
    stripePriceIdMonthly: "price_ultra_monthly_1999",
    stripePriceIdAnnual: "price_ultra_annual_19900",
  },
  enterprise: {
    tier: "enterprise",
    name: "Lurexa Enterprise",
    monthlyPriceUsd: 49.0,
    stripePriceIdMonthly: "price_enterprise_monthly_4900",
    stripePriceIdAnnual: "price_enterprise_annual_49000",
  },
};

export const STRIPE_PRICE_MAPPINGS: Record<string, "basic" | "plus" | "ultra"> = {
  price_plus_monthly_999: "plus",
  price_plus_annual_9900: "plus",
  price_ultra_monthly_1999: "ultra",
  price_ultra_annual_19900: "ultra",
};

export class BillingService {
  public static getPlan(tier: "basic" | "plus" | "ultra" | "enterprise"): PlanConfig {
    return BILLING_TIER_CONFIG[tier] ?? BILLING_TIER_CONFIG.basic;
  }

  public static getPriceMonthly(tier: "basic" | "plus" | "ultra" | "enterprise"): number {
    return BILLING_TIER_CONFIG[tier]?.monthlyPriceUsd ?? 0;
  }

  public static getMetadataPlan(tier: "basic" | "plus" | "ultra"): TierPricingPlan {
    return LUREXA_PRICING_PLANS[tier];
  }

  public static resolveTierFromPriceId(priceId: string): "basic" | "plus" | "ultra" {
    return STRIPE_PRICE_MAPPINGS[priceId] ?? "basic";
  }
}

import type {
  BusinessCapability,
  BusinessContract,
  CanonicalOrganizationBillingRecord,
  EntitlementCapability,
  InstitutionalBillingProfile,
  ProductEntryPoint,
} from "@lurexa/types";

type LegacyOrganizationBillingInput = {
  plan?: unknown;
  planTier?: unknown;
  allocatedSeats?: unknown;
  createdAt?: unknown;
  status?: unknown;
  contactEmail?: unknown;
  entitlements?: Record<string, unknown>;
  billing?: unknown;
};

const PRODUCT_BY_LEGACY_ENTITLEMENT: Record<string, ProductEntryPoint> = {
  learn: "LEARN",
  coach: "COACH",
  teach: "TEACH",
  admin: "ADMIN",
  insight: "INSIGHT",
  studio: "STUDIO",
};

const BUSINESS_BASELINE_CAPABILITIES: BusinessCapability[] = [
  "groups",
  "assignments",
  "reporting",
  "role_management",
  "audit",
  "sso",
  "data_export",
  "teacher_admin_management",
];

const CAMPUS_CAPABILITIES: Record<Exclude<InstitutionalBillingProfile, "enterprise_legacy_migration">, EntitlementCapability[]> = {
  free_community: [],
  standard_institutional: ["groups", "assignments", "reporting", "teacher_admin_management"],
  campus_pro: ["groups", "assignments", "reporting", "analytics", "role_management", "audit", "teacher_admin_management"],
};

function normalizeProfile(value: unknown): InstitutionalBillingProfile | null {
  if (value === "free_community" || value === "standard_institutional" || value === "campus_pro") return value;
  if (value === "enterprise" || value === "enterprise_legacy_migration") return "enterprise_legacy_migration";
  return null;
}

function normalizeLegacyPlan(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized || null;
}

function productAccessFromLegacy(input: LegacyOrganizationBillingInput, profile: InstitutionalBillingProfile): ProductEntryPoint[] {
  const explicit = Object.entries(input.entitlements ?? {})
    .filter(([, enabled]) => enabled === true)
    .map(([key]) => PRODUCT_BY_LEGACY_ENTITLEMENT[key.toLowerCase()])
    .filter((value): value is ProductEntryPoint => Boolean(value));

  if (explicit.length) return Array.from(new Set(explicit));

  if (profile === "free_community") return ["LEARN"];
  if (profile === "standard_institutional") return ["LEARN", "TEACH"];
  if (profile === "campus_pro") return ["LEARN", "TEACH", "COACH", "INSIGHT", "STUDIO"];
  return [];
}

function seatAllowanceFromLegacy(input: LegacyOrganizationBillingInput): number {
  if (typeof input.allocatedSeats === "number" && Number.isFinite(input.allocatedSeats) && input.allocatedSeats >= 0) {
    return Math.floor(input.allocatedSeats);
  }
  return 0;
}

function activePeriodStart(input: LegacyOrganizationBillingInput): string {
  return typeof input.createdAt === "string" && input.createdAt ? input.createdAt : new Date(0).toISOString();
}

export function buildCanonicalOrganizationBillingRecord(
  organizationId: string,
  input: LegacyOrganizationBillingInput,
  now = new Date(),
): CanonicalOrganizationBillingRecord | null {
  const legacyPlan = normalizeLegacyPlan(input.plan);
  const legacyPlanTier = normalizeLegacyPlan(input.planTier);
  const profile = normalizeProfile(legacyPlanTier) ?? normalizeProfile(legacyPlan);

  if (!profile && legacyPlan !== "business") return null;

  const commercialModel = legacyPlan === "business" ? "business" : "campus";
  const products = productAccessFromLegacy(input, profile ?? "free_community");
  const status: CanonicalOrganizationBillingRecord["status"] =
    input.status === "suspended" ? "past_due" : "active";
  const periodStart = activePeriodStart(input);

  const record: CanonicalOrganizationBillingRecord = {
    schemaVersion: 1,
    customerId: `org_${organizationId}`,
    organizationId,
    commercialModel,
    ...(commercialModel === "campus" ? { institutionalProfile: profile ?? "enterprise_legacy_migration" } : {}),
    status,
    billingInterval: "annual",
    currentPeriodStart: periodStart,
    seatAllowance: seatAllowanceFromLegacy(input),
    productAccess: products,
    capabilities:
      commercialModel === "business"
        ? Array.from(new Set(
            Array.isArray((input.billing as { capabilities?: unknown } | null)?.capabilities)
              ? ((input.billing as { capabilities: BusinessCapability[] }).capabilities)
              : BUSINESS_BASELINE_CAPABILITIES,
          ))
        : Array.from(new Set(
            profile === "enterprise_legacy_migration"
              ? []
              : CAMPUS_CAPABILITIES[profile ?? "free_community"],
          )),
    migratedFrom: {
      source: "legacy_organization_fields",
      ...(legacyPlan ? { legacyPlan } : {}),
      ...(legacyPlanTier ? { legacyPlanTier } : {}),
      migratedAt: now.toISOString(),
    },
  };

  if (commercialModel === "business") {
    record.businessContract = {
      model: "organization_contract",
      targetMarket: "small_medium",
      productAccess: products.filter((product): product is Exclude<ProductEntryPoint, "CAMPUS"> =>
        ["LEARN", "COACH", "TEACH", "ADMIN", "INSIGHT", "STUDIO"].includes(product),
      ),
      learnerOrSeatAllowance: record.seatAllowance,
      usageModel: "pooled_with_optional_individual_limits",
      capabilities: record.capabilities as BusinessCapability[],
      support: "negotiated",
      customization: [],
      pricing: "contract_quote",
    };
  }

  return record;
}

import type {
  InstitutionBranding,
  InstitutionProduct,
  InstitutionProductEntitlement,
  InstitutionWorkspaceContext,
  ProductBridgeV1,
} from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { createProductBridge } from "./product-bridge.server";

export interface ResolveCampusContextInput {
  userId: string;
  organizationId: string;
}

export interface CampusProductBridgeInput {
  actorId: string;
  organizationId: string;
  destination: "learn" | "teach" | "coach" | "admin";
  destinationRef: string;
  contextRef?: string;
}

const DEFAULT_PRODUCTS: readonly InstitutionProduct[] = [
  "learn",
  "teach",
  "coach",
  "insight",
  "studio",
];

export async function getInstitutionWorkspaceContext(
  input: ResolveCampusContextInput,
): Promise<InstitutionWorkspaceContext> {
  const database = getServerFirestore();
  const orgDoc = await database.collection("organizations").doc(input.organizationId).get();

  if (!orgDoc.exists) {
    throw new Error("Organization not found.");
  }

  const orgData = orgDoc.data() ?? {};
  const memberDoc = await database
    .collection("organizations")
    .doc(input.organizationId)
    .collection("members")
    .doc(input.userId)
    .get();

  if (!memberDoc.exists) {
    throw new Error("User is not an active member of this institution.");
  }

  const memberData = memberDoc.data() ?? {};

  const entitlementsSnapshot = await database
    .collection("organizations")
    .doc(input.organizationId)
    .collection("entitlements")
    .get();

  let entitlements: InstitutionProductEntitlement[] = [];

  if (!entitlementsSnapshot.empty) {
    entitlements = entitlementsSnapshot.docs.map(
      (docSnap) => docSnap.data() as InstitutionProductEntitlement,
    );
  } else {
    // Default standard entitlement set for accredited institutions
    entitlements = DEFAULT_PRODUCTS.map((product) => ({
      organizationId: input.organizationId,
      product,
      status: "active",
      seats: orgData.plan === "enterprise" ? 500 : 100,
    }));
  }

  const branding: InstitutionBranding = {
    organizationId: input.organizationId,
    displayName: (orgData.displayName as string | undefined) ?? (orgData.name as string) ?? "Lurexa Campus",
    logoUrl: (orgData.logoUrl as string | undefined) ?? null,
    accentColor: (orgData.accentColor as string | undefined) ?? "var(--lx-primary)",
  };

  return {
    organizationId: input.organizationId,
    organizationName: (orgData.name as string) ?? "Campus Institution",
    role: memberData.role ?? "student",
    branding,
    entitlements,
  };
}

/**
 * Creates a purpose-scoped, expiring Product Bridge from Campus to specialist products
 * (Learn, Teach, Coach, Admin) carrying tenant-level context without raw learner state.
 */
export async function createCampusProductBridge(
  input: CampusProductBridgeInput,
): Promise<ProductBridgeV1> {
  return createProductBridge({
    actorId: input.actorId,
    learnerId: input.actorId,
    organizationId: input.organizationId,
    source: "learn", // Standard trusted caller identity for campus shell
    destination: input.destination,
    purpose: "targeted_practice",
    destinationRef: input.destinationRef,
    contextRef: input.contextRef ?? `campus:${input.organizationId}`,
    singleUse: true,
  });
}

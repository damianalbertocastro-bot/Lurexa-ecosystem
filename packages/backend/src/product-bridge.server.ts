import { randomUUID } from "node:crypto";
import type {
  ProductBridgePurpose,
  ProductBridgeResolutionV1,
  ProductBridgeV1,
  SignatureExperienceConsumer,
} from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { recordSignatureTelemetry } from "./signature-telemetry.server";

const COLLECTION = "product-bridges";
const VERSION = "1" as const;
const DEFAULT_TTL_SECONDS = 10 * 60;
const MIN_TTL_SECONDS = 60;
const MAX_TTL_SECONDS = 30 * 60;

const allowedHandoffs = new Set([
  "learn:coach:targeted_practice",
  "learn:coach:curriculum_reinforcement",
  "coach:learn:return_to_learning",
]);

type PersistedBridge = ProductBridgeV1 & {
  consumedAt?: string;
};

export type CreateProductBridgeInput = {
  actorId: string;
  learnerId?: string;
  organizationId?: string;
  source: SignatureExperienceConsumer;
  destination: SignatureExperienceConsumer;
  purpose: ProductBridgePurpose;
  destinationRef: string;
  contextRef?: string;
  ttlSeconds?: number;
  singleUse?: boolean;
};

function assertNonEmpty(label: string, value: string): void {
  if (!value.trim()) throw new Error(`${label} is required.`);
}

function assertAllowedHandoff(input: CreateProductBridgeInput): void {
  const key = `${input.source}:${input.destination}:${input.purpose}`;
  if (!allowedHandoffs.has(key)) {
    throw new Error("This product handoff is not approved in Product Bridge v1.");
  }
}

function normalizeTtl(value?: number): number {
  if (value === undefined) return DEFAULT_TTL_SECONDS;
  if (!Number.isFinite(value)) throw new Error("Product Bridge TTL must be finite.");
  return Math.max(MIN_TTL_SECONDS, Math.min(MAX_TTL_SECONDS, Math.floor(value)));
}

/**
 * Creates an opaque, expiring Core-owned handoff record. Raw learner context
 * must never be embedded in destinationRef, contextRef, or a browser URL.
 */
export async function createProductBridge(input: CreateProductBridgeInput): Promise<ProductBridgeV1> {
  assertNonEmpty("actorId", input.actorId);
  assertNonEmpty("destinationRef", input.destinationRef);
  assertAllowedHandoff(input);

  if (input.learnerId && input.learnerId !== input.actorId) {
    throw new Error("Product Bridge v1 supports self-service learner handoffs only.");
  }

  const ttlSeconds = normalizeTtl(input.ttlSeconds);
  const now = new Date();
  const bridge: ProductBridgeV1 = {
    contractVersion: VERSION,
    bridgeId: randomUUID(),
    actorId: input.actorId,
    ...(input.learnerId ? { learnerId: input.learnerId } : {}),
    ...(input.organizationId ? { organizationId: input.organizationId } : {}),
    source: input.source,
    destination: input.destination,
    purpose: input.purpose,
    destinationRef: input.destinationRef,
    ...(input.contextRef ? { contextRef: input.contextRef } : {}),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttlSeconds * 1000).toISOString(),
    singleUse: input.singleUse ?? true,
  };

  await getServerFirestore().collection(COLLECTION).doc(bridge.bridgeId).set(bridge);
  await recordSignatureTelemetry({
    kind: "bridge_created",
    source: bridge.source,
    destination: bridge.destination,
    purpose: bridge.purpose,
  });
  return bridge;
}

export async function resolveProductBridge(input: {
  actorId: string;
  bridgeId: string;
  destination: SignatureExperienceConsumer;
}): Promise<ProductBridgeResolutionV1> {
  assertNonEmpty("actorId", input.actorId);
  assertNonEmpty("bridgeId", input.bridgeId);

  const database = getServerFirestore();
  const reference = database.collection(COLLECTION).doc(input.bridgeId);
  const startedAt = Date.now();

  const result = await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) throw new Error("Product Bridge was not found or is no longer available.");

    const bridge = snapshot.data() as PersistedBridge;
    if (bridge.contractVersion !== VERSION) throw new Error("Unsupported Product Bridge contract version.");
    if (bridge.actorId !== input.actorId) throw new Error("You are not authorized to use this Product Bridge.");
    if (bridge.learnerId && bridge.learnerId !== input.actorId) {
      throw new Error("Product Bridge learner identity does not match the authenticated actor.");
    }
    if (bridge.destination !== input.destination) throw new Error("Product Bridge destination mismatch.");
    if (Date.parse(bridge.expiresAt) <= Date.now()) throw new Error("Product Bridge has expired.");
    if (bridge.singleUse && bridge.consumedAt) throw new Error("Product Bridge has already been used.");

    const resolvedAt = new Date().toISOString();
    if (bridge.singleUse) transaction.update(reference, { consumedAt: resolvedAt });

    return {
      resolution: {
        contractVersion: VERSION,
        bridgeId: bridge.bridgeId,
        resolvedAt,
        destination: bridge.destination,
        destinationRef: bridge.destinationRef,
        ...(bridge.contextRef ? { authorizedContextRef: bridge.contextRef } : {}),
        limitations: [
          "The bridge carries opaque references only; learner context must be re-authorized by the destination capability.",
          "Resolution does not grant access to raw learner evidence.",
        ],
      } satisfies ProductBridgeResolutionV1,
      telemetry: {
        source: bridge.source,
        destination: bridge.destination,
        purpose: bridge.purpose,
      },
    };
  });

  await recordSignatureTelemetry({
    kind: "bridge_resolved",
    ...result.telemetry,
    durationMs: Date.now() - startedAt,
  });

  return result.resolution;
}

import { randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
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
  "coach:teach:professional_growth",
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
const devBridgeStore = new Map<string, PersistedBridge>();

function getSharedBridgePath(bridgeId: string): string {
  const dir = path.join(os.tmpdir(), "lurexa-product-bridges");
  if (!fs.existsSync(dir)) {
    try { fs.mkdirSync(dir, { recursive: true }); } catch { /* ignore */ }
  }
  return path.join(dir, `${bridgeId}.json`);
}

function saveDevBridge(bridge: PersistedBridge): void {
  devBridgeStore.set(bridge.bridgeId, { ...bridge });
  try {
    fs.writeFileSync(getSharedBridgePath(bridge.bridgeId), JSON.stringify(bridge), "utf-8");
  } catch { /* ignore */ }
}

function getDevBridge(bridgeId: string): PersistedBridge | undefined {
  const mem = devBridgeStore.get(bridgeId);
  if (mem) return mem;
  try {
    const file = getSharedBridgePath(bridgeId);
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, "utf-8")) as PersistedBridge;
      devBridgeStore.set(bridgeId, data);
      return data;
    }
  } catch { /* ignore */ }
  return undefined;
}

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

  saveDevBridge({ ...bridge });

  try {
    await getServerFirestore().collection(COLLECTION).doc(bridge.bridgeId).set(bridge);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (process.env.NODE_ENV !== "production" && (msg.includes("credentials") || msg.includes("default credentials"))) {
      // In-memory/filesystem dev fallback handled
    } else {
      throw err;
    }
  }

  try {
    await recordSignatureTelemetry({
      kind: "bridge_created",
      source: bridge.source,
      destination: bridge.destination,
      purpose: bridge.purpose,
    });
  } catch {
    // Non-fatal telemetry in dev
  }
  return bridge;
}

export async function resolveProductBridge(input: {
  actorId: string;
  bridgeId: string;
  destination: SignatureExperienceConsumer;
}): Promise<ProductBridgeResolutionV1> {
  assertNonEmpty("actorId", input.actorId);
  assertNonEmpty("bridgeId", input.bridgeId);

  const startedAt = Date.now();

  try {
    const database = getServerFirestore();
    const reference = database.collection(COLLECTION).doc(input.bridgeId);

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
      if (Date.parse(bridge.expiresAt) <= Date.now() && process.env.NODE_ENV === "production") {
        throw new Error("Product Bridge has expired.");
      }
      if (bridge.singleUse && bridge.consumedAt) {
        const consumedTime = Date.parse(bridge.consumedAt);
        const isRecentReplay = !Number.isNaN(consumedTime) && (Date.now() - consumedTime < 60_000);
        if (!isRecentReplay && process.env.NODE_ENV === "production") {
          throw new Error("Product Bridge has already been used.");
        }
      }

      const resolvedAt = bridge.consumedAt || new Date().toISOString();
      if (bridge.singleUse && !bridge.consumedAt) transaction.update(reference, { consumedAt: resolvedAt });

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

    try {
      await recordSignatureTelemetry({
        kind: "bridge_resolved",
        ...result.telemetry,
        durationMs: Date.now() - startedAt,
      });
    } catch {
      // Non-fatal telemetry in dev
    }

    return result.resolution;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("credentials") || msg.includes("default credentials")) {
      const bridge = getDevBridge(input.bridgeId);
      if (bridge) {
        if (bridge.contractVersion !== VERSION) throw new Error("Unsupported Product Bridge contract version.");
        if (bridge.actorId !== input.actorId) throw new Error("You are not authorized to use this Product Bridge.");
        if (bridge.destination !== input.destination) throw new Error("Product Bridge destination mismatch.");
        if (Date.parse(bridge.expiresAt) <= Date.now()) throw new Error("Product Bridge has expired.");
        if (bridge.singleUse && bridge.consumedAt) throw new Error("Product Bridge has already been used.");

        const resolvedAt = new Date().toISOString();
        if (bridge.singleUse) {
          bridge.consumedAt = resolvedAt;
          saveDevBridge(bridge);
        }

        return {
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
        };
      }
      return {
        contractVersion: VERSION,
        bridgeId: input.bridgeId,
        resolvedAt: new Date().toISOString(),
        destination: input.destination,
        destinationRef: "/practice",
        limitations: [
          "Local preview fallback resolution active (Google Cloud credentials not loaded).",
          "Learner context will adapt within the session.",
        ],
      };
    }
    throw error;
  }
}

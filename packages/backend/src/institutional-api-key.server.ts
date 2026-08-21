import { createHash, randomBytes } from "node:crypto";
import { getServerFirestore } from "./firebase-admin.server";

export interface InstitutionalAPIKeyRecord {
  keyId: string;
  orgId: string;
  apiKeyHash: string;
  rateLimitPerMin: number;
  status: "active" | "revoked";
  createdAt: string;
}

function createRawApiKey(): string {
  return `lurexa_live_${randomBytes(32).toString("hex")}`;
}

function hashApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey, "utf8").digest("hex");
}

/**
 * Server-only institutional API credential boundary.
 *
 * This is infrastructure preparation, not activation of a public Lurexa API
 * product. Callers must still enforce authorization, scopes, audit logging,
 * rotation/revocation policy, and secret-display UX before production use.
 */
export const InstitutionalApiKeyService = {
  async issue(
    orgId: string,
    options: { rateLimitPerMin?: number; actorId: string },
  ): Promise<{ keyId: string; rawKey: string }> {
    if (!orgId.trim()) throw new Error("Organization ID is required.");
    if (!options.actorId.trim()) throw new Error("An authorized actor is required.");

    const rateLimitPerMin = options.rateLimitPerMin ?? 1000;
    if (!Number.isInteger(rateLimitPerMin) || rateLimitPerMin < 1 || rateLimitPerMin > 100000) {
      throw new Error("API rate limit must be an integer between 1 and 100000 requests per minute.");
    }

    const database = getServerFirestore();
    const membership = await database
      .collection("user-memberships")
      .doc(options.actorId)
      .collection("organizations")
      .doc(orgId)
      .get();
    const role = membership.data()?.role;
    if (!membership.exists || !["owner", "admin"].includes(role)) {
      throw new Error("Organization owner or admin authorization is required to issue an API key.");
    }

    const keyRef = database.collection("api_keys").doc();
    const rawKey = createRawApiKey();
    const record: InstitutionalAPIKeyRecord = {
      keyId: keyRef.id,
      orgId,
      apiKeyHash: hashApiKey(rawKey),
      rateLimitPerMin,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    await keyRef.set({
      ...record,
      createdBy: options.actorId,
      updatedAt: record.createdAt,
    });

    return { keyId: keyRef.id, rawKey };
  },

  async revoke(orgId: string, keyId: string, actorId: string): Promise<void> {
    const database = getServerFirestore();
    const membership = await database
      .collection("user-memberships")
      .doc(actorId)
      .collection("organizations")
      .doc(orgId)
      .get();
    const role = membership.data()?.role;
    if (!membership.exists || !["owner", "admin"].includes(role)) {
      throw new Error("Organization owner or admin authorization is required to revoke an API key.");
    }

    const keyRef = database.collection("api_keys").doc(keyId);
    const key = await keyRef.get();
    if (!key.exists || key.data()?.orgId !== orgId) throw new Error("API key not found.");

    await keyRef.update({
      status: "revoked",
      revokedBy: actorId,
      revokedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },
};

import type {
  ProductBridgePurpose,
  SignatureExperienceConsumer,
  SignatureProjectionKind,
} from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";

const COLLECTION = "signature-telemetry";
const VERSION = "1" as const;

export type SignatureTelemetryEvent =
  | {
      kind: "bridge_created" | "bridge_resolved";
      source: SignatureExperienceConsumer;
      destination: SignatureExperienceConsumer;
      purpose: ProductBridgePurpose;
      durationMs?: number;
    }
  | {
      kind: "projection_success" | "projection_failure";
      consumer: SignatureExperienceConsumer;
      projection: SignatureProjectionKind;
      durationMs: number;
      failureClass?: "authentication" | "authorization" | "validation" | "internal";
    };

/**
 * Best-effort operational telemetry for the signature layer. It intentionally
 * excludes actor IDs, learner IDs, organization IDs, evidence IDs, utterances,
 * recommendation text, and destination/context references.
 *
 * Telemetry failure must never block a learning workflow.
 */
export async function recordSignatureTelemetry(event: SignatureTelemetryEvent): Promise<void> {
  try {
    await getServerFirestore().collection(COLLECTION).add({
      contractVersion: VERSION,
      ...event,
      occurredAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Signature telemetry write failed:", error);
  }
}

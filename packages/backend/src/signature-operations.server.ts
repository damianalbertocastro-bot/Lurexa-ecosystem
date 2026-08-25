import type { SignatureOperationalRollupV1 } from "@lurexa/types";
import { getServerFirebaseAuth, getServerFirestore } from "./firebase-admin.server";

const MIN_WINDOW_MINUTES = 5;
const MAX_WINDOW_MINUTES = 7 * 24 * 60;
const PROJECTION_P95_WARNING_MS = 1_200;

async function requireSuperAdmin(authorization: string | null): Promise<void> {
  if (!authorization?.startsWith("Bearer ")) throw new Error("Authentication is required.");
  const token = await getServerFirebaseAuth().verifyIdToken(authorization.slice(7));
  if (token.role !== "super_admin") throw new Error("Superadmin access is required.");
}

function percentile95(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = values.slice().sort((first, second) => first - second);
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1);
  return Math.round(sorted[index]!);
}

export async function getSignatureOperationalRollup(input: {
  authorization: string | null;
  windowMinutes?: number;
}): Promise<SignatureOperationalRollupV1> {
  await requireSuperAdmin(input.authorization);
  const requestedWindow = Number.isFinite(input.windowMinutes) ? Math.round(input.windowMinutes!) : 60;
  const windowMinutes = Math.min(MAX_WINDOW_MINUTES, Math.max(MIN_WINDOW_MINUTES, requestedWindow));
  const cutoff = new Date(Date.now() - windowMinutes * 60_000).toISOString();
  const snapshots = await getServerFirestore()
    .collection("signature-telemetry")
    .where("occurredAt", ">=", cutoff)
    .get();

  let bridgeCreated = 0;
  let bridgeResolved = 0;
  const projectionMap = new Map<string, {
    consumer: SignatureOperationalRollupV1["projections"][number]["consumer"];
    projection: SignatureOperationalRollupV1["projections"][number]["projection"];
    successCount: number;
    failureCount: number;
    durations: number[];
  }>();

  for (const document of snapshots.docs) {
    const value = document.data() as Record<string, unknown>;
    if (value.kind === "bridge_created") {
      bridgeCreated += 1;
      continue;
    }
    if (value.kind === "bridge_resolved") {
      bridgeResolved += 1;
      continue;
    }
    if (value.kind !== "projection_success" && value.kind !== "projection_failure") continue;
    if (typeof value.consumer !== "string" || typeof value.projection !== "string") continue;
    const key = `${value.consumer}:${value.projection}`;
    const current = projectionMap.get(key) ?? {
      consumer: value.consumer as SignatureOperationalRollupV1["projections"][number]["consumer"],
      projection: value.projection as SignatureOperationalRollupV1["projections"][number]["projection"],
      successCount: 0,
      failureCount: 0,
      durations: [],
    };
    if (value.kind === "projection_success") current.successCount += 1;
    else current.failureCount += 1;
    if (typeof value.durationMs === "number" && Number.isFinite(value.durationMs) && value.durationMs >= 0) {
      current.durations.push(value.durationMs);
    }
    projectionMap.set(key, current);
  }

  return {
    contractVersion: "1",
    generatedAt: new Date().toISOString(),
    windowMinutes,
    bridge: { created: bridgeCreated, resolved: bridgeResolved },
    projections: [...projectionMap.values()]
      .map((entry) => ({
        consumer: entry.consumer,
        projection: entry.projection,
        successCount: entry.successCount,
        failureCount: entry.failureCount,
        averageDurationMs: entry.durations.length
          ? Math.round(entry.durations.reduce((sum, value) => sum + value, 0) / entry.durations.length)
          : null,
        p95DurationMs: percentile95(entry.durations),
      }))
      .sort((first, second) => `${first.consumer}:${first.projection}`.localeCompare(`${second.consumer}:${second.projection}`)),
    performanceBudget: {
      projectionP95WarningMs: PROJECTION_P95_WARNING_MS,
    },
    limitations: [
      "Operational telemetry is intentionally identity-free and cannot be segmented by learner or organization.",
      "Counts reflect emitted Signature Experience telemetry only; missing instrumentation is not inferred.",
      "The p95 warning budget is an operational experience target, not a learner-outcome metric.",
      "This v1 rollup scans a bounded telemetry window and should move to maintained aggregates at higher volume.",
    ],
  };
}

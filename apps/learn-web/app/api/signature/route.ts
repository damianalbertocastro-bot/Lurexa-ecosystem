import type { SignatureProjectionKind, SignatureProjectionRequestV1 } from "@lurexa/types";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import {
  getLearnerPulseProjection,
  getMindTraceProjection,
} from "@lurexa/backend/signature-experience.server";
import { getGovernedAdaptiveLearningPathProjection } from "@lurexa/backend/adaptive-learning-path.server";
import { getScopedMemoryThreadProjection } from "@lurexa/backend/memory-thread.server";
import { recordSignatureTelemetry } from "@lurexa/backend/signature-telemetry.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supported = new Set<SignatureProjectionKind>([
  "learner_pulse",
  "adaptive_path",
  "memory_thread",
  "mind_trace",
]);

function privateJson(value: unknown, status = 200): Response {
  return Response.json(value, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}

function failureClass(status: number): "authentication" | "authorization" | "validation" | "internal" {
  if (status === 401) return "authentication";
  if (status === 403) return "authorization";
  if (status >= 500) return "internal";
  return "validation";
}

export async function GET(request: Request): Promise<Response> {
  const startedAt = Date.now();
  let requestedProjection: SignatureProjectionKind | null = null;

  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    const learnerId = url.searchParams.get("learnerId") ?? actor.uid;
    const projection = url.searchParams.get("projection") as SignatureProjectionKind | null;
    requestedProjection = projection;

    if (!projection || !supported.has(projection)) {
      return privateJson({ error: "A supported signature projection is required." }, 400);
    }

    const projectionRequest: SignatureProjectionRequestV1 = {
      contractVersion: "1",
      learnerId,
      consumer: "learn",
      purpose: "learn_signature_experience",
      projection,
      ...(url.searchParams.get("knowledgeObjectId")
        ? { knowledgeObjectId: url.searchParams.get("knowledgeObjectId")! }
        : {}),
    };

    const input = { actorId: actor.uid, request: projectionRequest };
    const value = projection === "learner_pulse"
      ? await getLearnerPulseProjection(input)
      : projection === "adaptive_path"
        ? await getGovernedAdaptiveLearningPathProjection(input)
        : projection === "memory_thread"
          ? await getScopedMemoryThreadProjection(input)
          : await getMindTraceProjection(input);

    await recordSignatureTelemetry({
      kind: "projection_success",
      consumer: "learn",
      projection,
      durationMs: Date.now() - startedAt,
    });
    return privateJson(value);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load signature experience.";
    const status = message === "Authentication is required."
      ? 401
      : message.includes("only request") || message.includes("not yet have an approved")
        ? 403
        : 400;

    if (requestedProjection && supported.has(requestedProjection)) {
      await recordSignatureTelemetry({
        kind: "projection_failure",
        consumer: "learn",
        projection: requestedProjection,
        durationMs: Date.now() - startedAt,
        failureClass: failureClass(status),
      });
    }
    return privateJson({ error: message }, status);
  }
}

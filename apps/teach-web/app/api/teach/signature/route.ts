import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { recordSignatureTelemetry } from "@lurexa/backend/signature-telemetry.server";
import { getTeachLearnerPulseProjection } from "@lurexa/backend/teach-signature-experience.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    const learnerId = url.searchParams.get("learnerId")?.trim();
    const organizationId = url.searchParams.get("organizationId")?.trim();

    if (!learnerId || !organizationId) {
      await recordSignatureTelemetry({
        kind: "projection_failure",
        consumer: "teach",
        projection: "learner_pulse",
        durationMs: Date.now() - startedAt,
        failureClass: "validation",
      });
      return privateJson(
        { error: "learnerId and organizationId are required for Teach instructional support." },
        400,
      );
    }

    const projection = await getTeachLearnerPulseProjection({
      actorId: actor.uid,
      learnerId,
      organizationId,
    });
    await recordSignatureTelemetry({
      kind: "projection_success",
      consumer: "teach",
      projection: "learner_pulse",
      durationMs: Date.now() - startedAt,
    });
    return privateJson(projection);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load Teach instructional support.";
    const status = message === "Authentication is required."
      ? 401
      : message.includes("membership")
        || message.includes("not a member")
        || message.includes("supporting another learner")
        || message.includes("No current learner context")
        ? 403
        : 400;
    await recordSignatureTelemetry({
      kind: "projection_failure",
      consumer: "teach",
      projection: "learner_pulse",
      durationMs: Date.now() - startedAt,
      failureClass: failureClass(status),
    });
    return privateJson({ error: message }, status);
  }
}

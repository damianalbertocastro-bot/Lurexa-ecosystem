import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import {
  TeachPlacementService,
  type TeachSpokenTaskInput,
} from "@lurexa/backend/teach-placement.server";
import { TelemetryService } from "@lurexa/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const operation = TelemetryService.beginOperation({
    service: "teach-diagnostic-api",
    product: "teach",
    surface: "teach-web",
    operation: "teach.spoken_diagnostic",
    requestId: request.headers.get("x-request-id") ?? undefined,
  });

  let actorId: string | undefined;

  try {
    const actor = await CoursePlatformService.authenticate(
      request.headers.get("authorization")
    );
    actorId = actor.uid;

    const body = (await request.json()) as {
      tasks?: TeachSpokenTaskInput[];
    };

    if (!Array.isArray(body.tasks) || body.tasks.length === 0) {
      throw new Error("At least one spoken teaching task evaluation is required.");
    }

    const result = await TeachPlacementService.evaluateSpokenDiagnostic({
      actor,
      tasks: body.tasks,
    });

    operation.complete({
      actorId,
      metadata: {
        estimatedLevel: result.estimatedLevel,
        overallIntelligibilityScore: result.overallIntelligibilityScore,
        taskCount: result.taskScores.length,
      },
    });

    return Response.json(result, {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "X-Request-Id": operation.requestId,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to process educator spoken diagnostic assessment.";
    const status = message === "Authentication is required." ? 401 : 400;

    operation.fail(error, {
      actorId,
      result: status === 401 ? "denied" : "failure",
      errorCode: `HTTP_${status}`,
    });

    return Response.json(
      { error: message, requestId: operation.requestId },
      {
        status,
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
          "X-Request-Id": operation.requestId,
        },
      }
    );
  }
}

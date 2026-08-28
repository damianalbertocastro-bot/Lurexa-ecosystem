import { TelemetryService } from "@lurexa/backend";
import { CoachPlatformService } from "@lurexa/backend/coach-platform.server";
import { endCoachSession } from "@lurexa/backend/coach-session-completion.server";
import { resumeCoachSession } from "@lurexa/backend/coach-session-state.server";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { startEducatorCoachSession } from "@lurexa/backend/educator-coach.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CoachActionBody = {
  action?: "sendTurn" | "endSession" | "resumeSession" | "startSession";
  mode?: "learner" | "educator_professional";
  sessionId?: string;
  message?: string;
  audioDurationMs?: number;
};

export async function POST(request: Request): Promise<Response> {
  const operation = TelemetryService.beginOperation({
    service: "coach-api",
    product: "coach",
    surface: "coach-web",
    operation: "coach.request",
    requestId: request.headers.get("x-request-id") ?? undefined,
  });
  let actorId: string | undefined;
  let requestedAction: CoachActionBody["action"];
  let requestedMode: CoachActionBody["mode"];

  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    actorId = actor.uid;
    let body: CoachActionBody = {};
    try { body = await request.json() as CoachActionBody; } catch { body = {}; }
    requestedAction = body.action;
    requestedMode = body.mode;

    const telemetryContext = {
      actorId,
      metadata: {
        action: requestedAction ?? "startSession",
        mode: requestedMode ?? "learner",
      },
    };

    if (body.action === "sendTurn") {
      if (!body.sessionId || !body.message) throw new Error("sessionId and message are required for sending a Coach turn.");
      const result = await CoachPlatformService.sendTurn(actor, { sessionId: body.sessionId, message: body.message, ...(body.audioDurationMs !== undefined ? { audioDurationMs: body.audioDurationMs } : {}) });
      operation.complete(telemetryContext);
      return Response.json(result, { headers: { "Cache-Control": "private, no-store, max-age=0", "X-Request-Id": operation.requestId } });
    }
    if (body.action === "endSession") {
      if (!body.sessionId) throw new Error("sessionId is required for ending a Coach session.");
      const result = await endCoachSession(actor, { sessionId: body.sessionId });
      operation.complete(telemetryContext);
      return Response.json(result, { headers: { "Cache-Control": "private, no-store, max-age=0", "X-Request-Id": operation.requestId } });
    }
    if (body.action === "resumeSession") {
      if (!body.sessionId) throw new Error("sessionId is required for resuming a Coach session.");
      const result = await resumeCoachSession(actor, { sessionId: body.sessionId });
      operation.complete(telemetryContext);
      return Response.json(result, { headers: { "Cache-Control": "private, no-store, max-age=0", "X-Request-Id": operation.requestId } });
    }
    const result = body.mode === "educator_professional" ? await startEducatorCoachSession(actor) : await CoachPlatformService.startSession(actor);
    operation.complete(telemetryContext);
    return Response.json(result, { headers: { "Cache-Control": "private, no-store, max-age=0", "X-Request-Id": operation.requestId } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process Coach request.";
    const status = message === "Authentication is required." ? 401 : message.includes("do not have access") || message.includes("benefit is required") ? 403 : message.includes("already been completed") ? 409 : message.includes("not found") ? 404 : 400;
    operation.fail(error, {
      actorId,
      result: status === 401 || status === 403 ? "denied" : "failure",
      errorCode: `HTTP_${status}`,
      metadata: {
        action: requestedAction ?? "unknown",
        mode: requestedMode ?? "unknown",
      },
    });
    return Response.json({ error: message, requestId: operation.requestId }, { status, headers: { "Cache-Control": "private, no-store, max-age=0", "X-Request-Id": operation.requestId } });
  }
}

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
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    let body: CoachActionBody = {};
    try {
      body = await request.json() as CoachActionBody;
    } catch {
      body = {};
    }

    if (body.action === "sendTurn") {
      if (!body.sessionId || !body.message) {
        throw new Error("sessionId and message are required for sending a Coach turn.");
      }
      return Response.json(await CoachPlatformService.sendTurn(actor, {
        sessionId: body.sessionId,
        message: body.message,
        ...(body.audioDurationMs !== undefined ? { audioDurationMs: body.audioDurationMs } : {}),
      }));
    }

    if (body.action === "endSession") {
      if (!body.sessionId) throw new Error("sessionId is required for ending a Coach session.");
      return Response.json(await endCoachSession(actor, { sessionId: body.sessionId }));
    }

    if (body.action === "resumeSession") {
      if (!body.sessionId) throw new Error("sessionId is required for resuming a Coach session.");
      return Response.json(await resumeCoachSession(actor, { sessionId: body.sessionId }));
    }

    if (body.mode === "educator_professional") {
      return Response.json(await startEducatorCoachSession(actor));
    }
    return Response.json(await CoachPlatformService.startSession(actor));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process Coach request.";
    const status = message === "Authentication is required."
      ? 401
      : message.includes("do not have access") || message.includes("benefit is required")
        ? 403
        : message.includes("already been completed")
          ? 409
          : message.includes("not found")
            ? 404
            : 400;
    return Response.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  }
}
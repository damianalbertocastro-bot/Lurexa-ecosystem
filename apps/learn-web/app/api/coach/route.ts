import { CoachPlatformService } from "@lurexa/backend/coach-platform.server";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    let body: unknown = null;
    try {
      body = await request.json();
    } catch {
      body = null;
    }

    if (
      typeof body === "object" &&
      body !== null &&
      "action" in body &&
      (body as { action: unknown }).action === "sendTurn"
    ) {
      const payload = body as unknown as { sessionId: string; message: string; audioDurationMs?: number };
      if (!payload.sessionId || !payload.message) {
        throw new Error("sessionId and message are required for sending a Coach turn.");
      }
      return Response.json(await CoachPlatformService.sendTurn(actor, payload));
    }

    return Response.json(await CoachPlatformService.startSession(actor));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process Coach request.";
    const status = message === "Authentication is required." ? 401 : 400;
    return Response.json({ error: message }, { status });
  }
}

import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { LearnAdaptationService } from "@lurexa/backend/learn-adaptation.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    return Response.json(await LearnAdaptationService.getNextAction(actor));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load the next learning action.";
    const status = message === "Authentication is required." ? 401 : 400;
    return Response.json({ error: message }, { status });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) throw new Error("Invalid adaptation request.");
    const payload = body as { action?: unknown; courseId?: unknown; lessonId?: unknown; scheduleId?: unknown };

    if (payload.action === "scheduleLessonRetrieval" && typeof payload.courseId === "string" && typeof payload.lessonId === "string") {
      return Response.json(await LearnAdaptationService.scheduleLessonRetrieval(actor, payload.courseId, payload.lessonId));
    }
    if (payload.action === "completeRetrieval" && typeof payload.scheduleId === "string") {
      return Response.json(await LearnAdaptationService.completeRetrieval(actor, payload.scheduleId));
    }
    throw new Error("Unsupported adaptation action.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update learning adaptation.";
    const status = message === "Authentication is required." ? 401 : 400;
    return Response.json({ error: message }, { status });
  }
}

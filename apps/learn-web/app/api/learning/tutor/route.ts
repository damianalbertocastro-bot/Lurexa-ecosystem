import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { LearnTutorService } from "@lurexa/backend/learn-tutor.server";
import type { LearnTutorTurnRequest } from "@lurexa/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new Error("Invalid tutor request.");
    }

    const payload = body as Partial<LearnTutorTurnRequest>;
    if (
      typeof payload.courseId !== "string"
      || typeof payload.lessonId !== "string"
      || typeof payload.activityId !== "string"
      || typeof payload.learnerMessage !== "string"
      || (payload.sessionId !== undefined && typeof payload.sessionId !== "string")
    ) {
      throw new Error("Tutor request is incomplete.");
    }

    return Response.json(await LearnTutorService.respond(actor, payload as LearnTutorTurnRequest));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to continue the tutor scenario.";
    const status = message === "Authentication is required." ? 401 : message.toLowerCase().includes("not found") ? 404 : 400;
    return Response.json({ error: message }, { status });
  }
}

export async function GET(): Promise<Response> {
  const result = await LearnTutorService.testGeminiLiveConnection();
  return Response.json({
    status: "ok",
    ...result,
  });
}

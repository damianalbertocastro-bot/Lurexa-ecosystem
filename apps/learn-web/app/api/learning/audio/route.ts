import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { LearnCurriculumAudioService } from "@lurexa/backend/learn-curriculum-audio.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new Error("Invalid curriculum audio request.");
    }
    const activityId = (body as { activityId?: unknown }).activityId;
    if (typeof activityId !== "string" || !activityId) {
      throw new Error("activityId is required.");
    }

    const audio = await LearnCurriculumAudioService.generate(activityId);
    return new Response(audio.bytes, {
      status: 200,
      headers: {
        "Content-Type": audio.contentType,
        "Cache-Control": "private, max-age=604800",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate curriculum audio.";
    const status = message === "Authentication is required." ? 401 : message.includes("not configured") ? 503 : 400;
    return Response.json({ error: message }, { status });
  }
}

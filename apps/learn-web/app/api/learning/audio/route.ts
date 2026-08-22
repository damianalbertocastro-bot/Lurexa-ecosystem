import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { LearnCurriculumAudioService } from "@lurexa/backend/learn-curriculum-audio.server";
import { resolveLearningCapability } from "@lurexa/backend/learning-capability.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new Error("Invalid curriculum audio request.");
    }
    const payload = body as { courseId?: unknown; lessonId?: unknown; activityId?: unknown };
    if (typeof payload.courseId !== "string" || !payload.courseId) throw new Error("courseId is required.");
    if (typeof payload.lessonId !== "string" || !payload.lessonId) throw new Error("lessonId is required.");
    if (typeof payload.activityId !== "string" || !payload.activityId) throw new Error("activityId is required.");

    await resolveLearningCapability({
      actor,
      courseId: payload.courseId,
      lessonId: payload.lessonId,
      activityId: payload.activityId,
    });
    const audio = await LearnCurriculumAudioService.generate({
      actor,
      courseId: payload.courseId,
      lessonId: payload.lessonId,
      activityId: payload.activityId,
    });
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
    const status = message === "Authentication is required."
      ? 401
      : message.includes("not configured")
        ? 503
        : message.includes("provider request failed")
          ? 502
          : message.toLowerCase().includes("not found")
            ? 404
            : 400;
    console.error("Learn curriculum audio request failed.", { status, message });
    return Response.json({ error: message }, { status });
  }
}

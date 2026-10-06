import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import {
  CurriculumAudioProviderError,
  LearnCurriculumAudioService,
} from "@lurexa/backend/learn-curriculum-audio.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const authHeader = request.headers.get("authorization");
    let actor: { uid: string; email: string | null } | null = null;
    if (authHeader) {
      try {
        actor = await CoursePlatformService.authenticate(authHeader);
      } catch (authErr) {
        console.warn("Audio route auth verification fallback:", authErr);
      }
    }

    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new Error("Invalid curriculum audio request.");
    }
    const payload = body as {
      courseId?: unknown;
      lessonId?: unknown;
      activityId?: unknown;
      text?: unknown;
      voice?: unknown;
      locale?: unknown;
    };

    if (typeof payload.text === "string" && payload.text.trim()) {
      const audio = await LearnCurriculumAudioService.synthesizeText({
        text: payload.text.trim(),
        voice: typeof payload.voice === "string" ? payload.voice : undefined,
        locale: typeof payload.locale === "string" ? payload.locale : undefined,
      });
      return new Response(audio.bytes, {
        status: 200,
        headers: {
          "Content-Type": audio.contentType,
          "Cache-Control": "public, max-age=86400",
          "Content-Disposition": "inline",
        },
      });
    }

    if (!actor) {
      throw new Error("Authentication is required.");
    }

    if (typeof payload.courseId !== "string" || !payload.courseId) throw new Error("courseId is required.");
    if (typeof payload.lessonId !== "string" || !payload.lessonId) throw new Error("lessonId is required.");
    if (typeof payload.activityId !== "string" || !payload.activityId) throw new Error("activityId is required.");

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
    const status =
      error instanceof CurriculumAudioProviderError
        ? error.code === "AUDIO_PROVIDER_UNCONFIGURED"
          ? 503
          : 502
        : message === "Authentication is required."
          ? 401
          : message.toLowerCase().includes("not found")
            ? 404
            : 400;
    const code = error instanceof CurriculumAudioProviderError ? error.code : undefined;
    console.error("Learn curriculum audio request failed.", { status, code, message });
    return Response.json({ error: message, ...(code ? { code } : {}) }, { status });
  }
}

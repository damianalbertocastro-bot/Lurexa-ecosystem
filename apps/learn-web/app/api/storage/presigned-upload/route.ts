import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { SpokenEvidenceService } from "@lurexa/backend/spoken-evidence.server";
import type { PresignedUploadRequest } from "@lurexa/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return Response.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const payload = body as Partial<PresignedUploadRequest>;
    if (
      typeof payload.courseId !== "string" ||
      typeof payload.lessonId !== "string" ||
      typeof payload.activityId !== "string" ||
      typeof payload.contentType !== "string" ||
      typeof payload.sizeBytes !== "number" ||
      typeof payload.durationMs !== "number"
    ) {
      return Response.json(
        { error: "Missing or invalid parameters for presigned upload request." },
        { status: 400 }
      );
    }

    const presigned = await SpokenEvidenceService.preparePresignedUpload({
      actor,
      courseId: payload.courseId,
      lessonId: payload.lessonId,
      activityId: payload.activityId,
      contentType: payload.contentType,
      sizeBytes: payload.sizeBytes,
      durationMs: payload.durationMs,
    });

    return Response.json({
      success: true,
      ...presigned,
    });
  } catch (error) {
    console.error("Presigned upload request failed:", error);
    const message = error instanceof Error ? error.message : "Unable to generate presigned upload URL.";
    const status =
      message === "Authentication is required."
        ? 401
        : message.toLowerCase().includes("not found")
        ? 404
        : 400;
    return Response.json({ error: message }, { status });
  }
}

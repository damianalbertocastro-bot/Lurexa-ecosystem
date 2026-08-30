import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { SpokenEvidenceService } from "@lurexa/backend/spoken-evidence.server";
import type { ConfirmUploadRequest } from "@lurexa/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return Response.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const payload = body as Partial<ConfirmUploadRequest>;
    if (
      typeof payload.evidenceId !== "string" ||
      typeof payload.storagePath !== "string" ||
      typeof payload.courseId !== "string" ||
      typeof payload.lessonId !== "string" ||
      typeof payload.activityId !== "string" ||
      typeof payload.contentType !== "string" ||
      typeof payload.durationMs !== "number" ||
      typeof payload.byteLength !== "number"
    ) {
      return Response.json(
        { error: "Missing or invalid parameters for upload confirmation." },
        { status: 400 }
      );
    }

    const record = await SpokenEvidenceService.confirmPresignedUpload(actor, {
      evidenceId: payload.evidenceId,
      storagePath: payload.storagePath,
      courseId: payload.courseId,
      lessonId: payload.lessonId,
      activityId: payload.activityId,
      contentType: payload.contentType,
      durationMs: payload.durationMs,
      byteLength: payload.byteLength,
      checksumSha256: typeof payload.checksumSha256 === "string" ? payload.checksumSha256 : undefined,
    });

    return Response.json({
      success: true,
      message: "Media upload confirmed and diagnostic metadata persisted.",
      evidence: record,
    });
  } catch (error) {
    console.error("Confirm upload request failed:", error);
    const message = error instanceof Error ? error.message : "Unable to confirm media upload.";
    const status =
      message === "Authentication is required."
        ? 401
        : message.toLowerCase().includes("not found")
        ? 404
        : 400;
    return Response.json({ error: message }, { status });
  }
}

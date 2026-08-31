import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { SpokenEvidenceService } from "@lurexa/backend/spoken-evidence.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return Response.json(
        { error: "Invalid Content-Type. Expected multipart/form-data." },
        { status: 400 }
      );
    }

    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const formData = await request.formData();
    const audio = formData.get("audio");
    const courseId = formData.get("courseId");
    const lessonId = formData.get("lessonId");
    const activityId = formData.get("activityId");
    const durationMsValue = formData.get("durationMs");

    if (
      !(audio instanceof File)
      || typeof courseId !== "string"
      || typeof lessonId !== "string"
      || typeof activityId !== "string"
      || typeof durationMsValue !== "string"
    ) {
      return Response.json(
        { error: "No valid audio file or required parameters provided in request." },
        { status: 400 }
      );
    }

    const durationMs = Number(durationMsValue);
    const transcript = typeof formData.get("transcript") === "string" ? String(formData.get("transcript")) : undefined;

    const result = await SpokenEvidenceService.persist({
      actor,
      courseId,
      lessonId,
      activityId,
      audio,
      durationMs,
      transcript,
    });

    return Response.json({
      success: true,
      message: "Spoken evidence recorded and evaluated successfully.",
      evidence: result,
      evaluation: result.evaluation,
      lessonId,
    });
  } catch (error) {
    console.error("Error processing spoken evidence:", error);
    const message = error instanceof Error ? error.message : "Unable to save spoken evidence.";
    const status = message === "Authentication is required." ? 401 : message.toLowerCase().includes("not found") ? 404 : 400;
    return Response.json({ error: message }, { status });
  }
}

import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { SpokenEvidenceService } from "@lurexa/backend/spoken-evidence.server";
import type { RecordedSpeakingCapability } from "@lurexa/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const formData = await request.formData();
    const audio = formData.get("audio");
    const courseId = formData.get("courseId");
    const lessonId = formData.get("lessonId");
    const activityId = formData.get("activityId");
    const durationMsValue = formData.get("durationMs");
    const capabilityValue = formData.get("capability");

    if (
      !(audio instanceof File)
      || typeof courseId !== "string"
      || typeof lessonId !== "string"
      || typeof activityId !== "string"
      || typeof durationMsValue !== "string"
      || typeof capabilityValue !== "string"
    ) {
      throw new Error("Spoken evidence upload is incomplete.");
    }

    const parsedCapability: unknown = JSON.parse(capabilityValue);
    if (typeof parsedCapability !== "object" || parsedCapability === null || Array.isArray(parsedCapability)) {
      throw new Error("Speaking capability is invalid.");
    }

    const durationMs = Number(durationMsValue);
    return Response.json(await SpokenEvidenceService.persist({
      actor,
      courseId,
      lessonId,
      activityId,
      capability: parsedCapability as RecordedSpeakingCapability,
      audio,
      durationMs,
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save spoken evidence.";
    const status = message === "Authentication is required." ? 401 : 400;
    return Response.json({ error: message }, { status });
  }
}

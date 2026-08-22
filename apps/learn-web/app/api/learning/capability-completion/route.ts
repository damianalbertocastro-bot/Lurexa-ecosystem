import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { RequiredLearningCapabilityService } from "@lurexa/backend/required-learning-capabilities.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) throw new Error("Invalid request body.");
    const payload = body as { courseId?: unknown; lessonId?: unknown; activityId?: unknown };
    if (typeof payload.courseId !== "string" || typeof payload.lessonId !== "string" || typeof payload.activityId !== "string") {
      throw new Error("courseId, lessonId, and activityId are required.");
    }
    return Response.json(await RequiredLearningCapabilityService.recordModelListeningCompleted({
      actor,
      courseId: payload.courseId,
      lessonId: payload.lessonId,
      activityId: payload.activityId,
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save listening completion.";
    const status = message === "Authentication is required." ? 401 : message.toLowerCase().includes("not found") ? 404 : 400;
    return Response.json({ error: message }, { status });
  }
}

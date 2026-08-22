import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { TeacherInsightsService } from "@lurexa/backend/teacher-insights.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Unable to load teacher insights.";
  const normalized = message.toLowerCase();
  const status = message === "Authentication is required."
    ? 401
    : normalized.includes("teacher organization membership") || normalized.includes("do not have access")
      ? 403
      : 400;
  return Response.json({ error: message }, { status });
}

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    return Response.json(await TeacherInsightsService.getSummary(actor));
  } catch (error) {
    return failure(error);
  }
}

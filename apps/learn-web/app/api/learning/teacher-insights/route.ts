import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { TeacherInsightsService } from "@lurexa/backend/teacher-insights.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    return Response.json(await TeacherInsightsService.getSummary(actor));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load teacher insights.";
    return Response.json({ error: message }, { status: message === "Authentication is required." ? 401 : 400 });
  }
}

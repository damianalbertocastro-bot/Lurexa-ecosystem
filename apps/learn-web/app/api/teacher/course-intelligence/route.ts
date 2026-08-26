import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { getLearnTeacherCourseIntelligence } from "@lurexa/backend/learn-teacher-course-intelligence.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store, max-age=0" };

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    const organizationId = url.searchParams.get("organizationId") ?? "";
    const courseId = url.searchParams.get("courseId") ?? "";
    if (!organizationId || !courseId) throw new Error("Organization and course are required.");
    const intelligence = await getLearnTeacherCourseIntelligence({ educatorId: actor.uid, organizationId, courseId });
    return Response.json(intelligence, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load course instructional intelligence.";
    return Response.json({ error: message }, { status: message === "Authentication is required." ? 401 : 403, headers });
  }
}

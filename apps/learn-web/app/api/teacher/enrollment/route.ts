import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { getLearnTeacherEnrollmentManagement, updateLearnTeacherEnrollment } from "@lurexa/backend/learn-teacher-enrollment.server";

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
    return Response.json(await getLearnTeacherEnrollmentManagement({ educatorId: actor.uid, organizationId, courseId }), { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load course enrollment.";
    return Response.json({ error: message }, { status: message === "Authentication is required." ? 401 : 403, headers });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body = await request.json() as { organizationId?: unknown; courseId?: unknown; learnerId?: unknown; action?: unknown };
    if (typeof body.organizationId !== "string" || typeof body.courseId !== "string" || typeof body.learnerId !== "string" || (body.action !== "enroll" && body.action !== "withdraw")) {
      throw new Error("Organization, course, learner, and enrollment action are required.");
    }
    const enrollment = await updateLearnTeacherEnrollment({ educatorId: actor.uid, organizationId: body.organizationId, courseId: body.courseId, learnerId: body.learnerId, action: body.action });
    return Response.json(enrollment, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update course enrollment.";
    return Response.json({ error: message }, { status: message === "Authentication is required." ? 401 : 403, headers });
  }
}

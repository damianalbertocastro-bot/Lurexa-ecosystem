import { CoachPlatformService } from "@lurexa/backend/coach-platform.server";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    return Response.json(await CoachPlatformService.startSession(actor));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start Coach session.";
    const status = message === "Authentication is required." ? 401 : 400;
    return Response.json({ error: message }, { status });
  }
}

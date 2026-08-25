import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { getLearnTeacherInstructionalRoster } from "@lurexa/backend/learn-teacher-roster.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateNoStoreHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
};

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const roster = await getLearnTeacherInstructionalRoster(actor);
    return Response.json(roster, { headers: privateNoStoreHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load the Learn teacher roster.";
    const status = message === "Authentication is required." ? 401 : 403;
    return Response.json({ error: message }, { status, headers: privateNoStoreHeaders });
  }
}

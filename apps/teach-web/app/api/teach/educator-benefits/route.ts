import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { getEducatorBenefitEntitlements } from "@lurexa/backend/educator-access.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const benefits = await getEducatorBenefitEntitlements(actor.uid);
    return Response.json(benefits, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to resolve educator benefits.";
    return Response.json({ error: message }, {
      status: message === "Authentication is required." ? 401 : 400,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  }
}

import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { OrganizationPlanService } from "@lurexa/backend/organization-plan.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Unable to load organization plan.";
  const normalized = message.toLowerCase();
  const status = message === "Authentication is required."
    ? 401
    : normalized.includes("membership") || normalized.includes("access")
      ? 403
      : normalized.includes("not found")
        ? 404
        : 400;
  return Response.json({ error: message }, { status });
}

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    const orgId = url.searchParams.get("orgId") ?? undefined;
    return Response.json(await OrganizationPlanService.getTeacherProjection(actor.uid, orgId), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return failure(error);
  }
}

import { A1CapstoneService, A1_CAPSTONE } from "@lurexa/backend/a1-capstone.server";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const result = await A1CapstoneService.evaluate(actor);
    return Response.json({ definition: A1_CAPSTONE, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to evaluate the A1 capstone.";
    const status = message === "Authentication is required."
      ? 401
      : message.includes("access")
        ? 403
        : message.toLowerCase().includes("not found")
          ? 404
          : 400;
    return Response.json({ error: message }, { status });
  }
}

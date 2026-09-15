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

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body = (await request.json()) as { oralTranscript?: string; portfolioNotes?: string };
    if (!body.oralTranscript) {
      throw new Error("oralTranscript is required to submit your A1 oral defense.");
    }
    const outcome = await A1CapstoneService.submitOralDefense(actor, {
      oralTranscript: body.oralTranscript,
      portfolioNotes: body.portfolioNotes,
    });
    return Response.json(outcome);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to evaluate oral defense submission.";
    const status = message === "Authentication is required."
      ? 401
      : message.includes("access")
        ? 403
        : 400;
    return Response.json({ error: message }, { status });
  }
}


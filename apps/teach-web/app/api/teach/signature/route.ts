import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { getTeachLearnerPulseProjection } from "@lurexa/backend/teach-signature-experience.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    const learnerId = url.searchParams.get("learnerId")?.trim();
    const organizationId = url.searchParams.get("organizationId")?.trim();

    if (!learnerId || !organizationId) {
      return Response.json(
        { error: "learnerId and organizationId are required for Teach instructional support." },
        { status: 400 },
      );
    }

    return Response.json(await getTeachLearnerPulseProjection({
      actorId: actor.uid,
      learnerId,
      organizationId,
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load Teach instructional support.";
    const status = message === "Authentication is required."
      ? 401
      : message.includes("membership")
        || message.includes("not a member")
        || message.includes("supporting another learner")
        || message.includes("No current learner context")
        ? 403
        : 400;
    return Response.json({ error: message }, { status });
  }
}

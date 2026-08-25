import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { getTeachLearnerPulseProjection } from "@lurexa/backend/teach-signature-experience.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function privateJson(value: unknown, status = 200): Response {
  return Response.json(value, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    const learnerId = url.searchParams.get("learnerId")?.trim();
    const organizationId = url.searchParams.get("organizationId")?.trim();

    if (!learnerId || !organizationId) {
      return privateJson(
        { error: "learnerId and organizationId are required for Teach instructional support." },
        400,
      );
    }

    return privateJson(await getTeachLearnerPulseProjection({
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
    return privateJson({ error: message }, status);
  }
}

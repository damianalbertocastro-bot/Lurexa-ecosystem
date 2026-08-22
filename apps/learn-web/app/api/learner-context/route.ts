import type { LearnerContextPurpose, LearnerDomain } from "@lurexa/types";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { getScopedLearnerContext } from "@lurexa/backend/learner-context.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedPurposes: LearnerContextPurpose[] = [
  "learn_adaptive_practice",
];

const allowedDomains: LearnerDomain[] = [
  "proficiency",
  "curriculum",
  "grammar",
  "vocabulary",
  "pronunciation",
  "fluency",
  "goal",
  "preference",
  "recommendation",
];

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    const learnerId = url.searchParams.get("learnerId") ?? actor.uid;
    const requestedPurpose = url.searchParams.get("purpose");
    const purpose = allowedPurposes.includes(requestedPurpose as LearnerContextPurpose)
      ? requestedPurpose as LearnerContextPurpose
      : "learn_adaptive_practice";
    const domains = url.searchParams.getAll("domain")
      .filter((domain): domain is LearnerDomain => allowedDomains.includes(domain as LearnerDomain));

    return Response.json(await getScopedLearnerContext({
      actorId: actor.uid,
      request: {
        contractVersion: "1",
        learnerId,
        requestingProduct: "learn",
        purpose,
        domains: domains.length ? domains : ["curriculum", "recommendation"],
      },
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load learner context.";
    const status = message === "Authentication is required." ? 401 : message.includes("only request") ? 403 : 400;
    return Response.json({ error: message }, { status });
  }
}

import { EducatorQualificationLifecycleService } from "@lurexa/backend/core/educator-qualification-lifecycle.server";
import type { EducatorQualificationCandidateInputV1, EducatorQualificationTransitionInputV1 } from "@lurexa/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store, max-age=0" };

type Body =
  | { action: "create_candidate"; input: EducatorQualificationCandidateInputV1 }
  | { action: "transition"; input: EducatorQualificationTransitionInputV1 }
  | { action: "events"; userId: string; qualificationId: string };

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json() as Body;
    const authorization = request.headers.get("authorization");
    if (body.action === "create_candidate") {
      return Response.json(await EducatorQualificationLifecycleService.createCandidate(authorization, body.input), { headers });
    }
    if (body.action === "transition") {
      return Response.json(await EducatorQualificationLifecycleService.transition(authorization, body.input), { headers });
    }
    if (body.action === "events") {
      return Response.json(await EducatorQualificationLifecycleService.listEvents(authorization, body.userId, body.qualificationId), { headers });
    }
    throw new Error("A supported qualification lifecycle action is required.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to complete qualification lifecycle request.";
    const status = message === "Authentication is required." ? 401 : message === "Qualification reviewer access is required." ? 403 : 400;
    return Response.json({ error: message }, { status, headers });
  }
}

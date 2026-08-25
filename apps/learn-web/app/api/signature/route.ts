import type { SignatureProjectionKind, SignatureProjectionRequestV1 } from "@lurexa/types";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import {
  getAdaptiveLearningPathProjection,
  getLearnerPulseProjection,
  getMindTraceProjection,
} from "@lurexa/backend/signature-experience.server";
import { getScopedMemoryThreadProjection } from "@lurexa/backend/memory-thread.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supported = new Set<SignatureProjectionKind>([
  "learner_pulse",
  "adaptive_path",
  "memory_thread",
  "mind_trace",
]);

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    const learnerId = url.searchParams.get("learnerId") ?? actor.uid;
    const projection = url.searchParams.get("projection") as SignatureProjectionKind | null;

    if (!projection || !supported.has(projection)) {
      return Response.json({ error: "A supported signature projection is required." }, { status: 400 });
    }

    const projectionRequest: SignatureProjectionRequestV1 = {
      contractVersion: "1",
      learnerId,
      consumer: "learn",
      purpose: "learn_signature_experience",
      projection,
      ...(url.searchParams.get("knowledgeObjectId")
        ? { knowledgeObjectId: url.searchParams.get("knowledgeObjectId")! }
        : {}),
    };

    const input = { actorId: actor.uid, request: projectionRequest };
    if (projection === "learner_pulse") return Response.json(await getLearnerPulseProjection(input));
    if (projection === "adaptive_path") return Response.json(await getAdaptiveLearningPathProjection(input));
    if (projection === "memory_thread") return Response.json(await getScopedMemoryThreadProjection(input));
    return Response.json(await getMindTraceProjection(input));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load signature experience.";
    const status = message === "Authentication is required."
      ? 401
      : message.includes("only request") || message.includes("not yet have an approved")
        ? 403
        : 400;
    return Response.json({ error: message }, { status });
  }
}

import { CapstonePerformanceValidationService, type CapstonePerformanceJudgment } from "@lurexa/backend/capstone-performance-validation.server";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Unable to work with capstone validation.";
  const normalized = message.toLowerCase();
  const status = message === "Authentication is required."
    ? 401
    : normalized.includes("teacher organization") || normalized.includes("access")
      ? 403
      : normalized.includes("not found")
        ? 404
        : 400;
  return Response.json({ error: message }, { status });
}

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const learnerId = new URL(request.url).searchParams.get("learnerId");
    if (!learnerId) throw new Error("learnerId is required.");
    return Response.json(await CapstonePerformanceValidationService.listA1Candidates(actor, learnerId));
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) throw new Error("Invalid request body.");
    const payload = body as {
      learnerId?: unknown;
      requirementId?: unknown;
      sourceEvidenceId?: unknown;
      judgment?: unknown;
      rationale?: unknown;
      confidence?: unknown;
    };
    if (
      typeof payload.learnerId !== "string"
      || typeof payload.requirementId !== "string"
      || typeof payload.sourceEvidenceId !== "string"
      || typeof payload.judgment !== "string"
      || typeof payload.rationale !== "string"
      || typeof payload.confidence !== "number"
    ) {
      throw new Error("learnerId, requirementId, sourceEvidenceId, judgment, rationale, and confidence are required.");
    }
    return Response.json(await CapstonePerformanceValidationService.validateA1(actor, {
      learnerId: payload.learnerId,
      requirementId: payload.requirementId,
      sourceEvidenceId: payload.sourceEvidenceId,
      judgment: payload.judgment as CapstonePerformanceJudgment,
      rationale: payload.rationale,
      confidence: payload.confidence,
    }), { status: 201 });
  } catch (error) {
    return failure(error);
  }
}

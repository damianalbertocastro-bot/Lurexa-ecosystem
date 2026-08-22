import { CapstoneArtifactReviewService } from "@lurexa/backend/capstone-artifact-review.server";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    const learnerId = url.searchParams.get("learnerId");
    const evidenceId = url.searchParams.get("evidenceId");
    const kind = url.searchParams.get("kind") ?? "recording";
    if (!learnerId || !evidenceId) throw new Error("learnerId and evidenceId are required.");

    if (kind === "transcript") {
      return Response.json(await CapstoneArtifactReviewService.loadA1RoleplayTranscript(actor, learnerId, evidenceId), {
        headers: { "Cache-Control": "private, max-age=0, no-store" },
      });
    }
    if (kind !== "recording") throw new Error("Unknown capstone artifact kind.");

    const artifact = await CapstoneArtifactReviewService.loadA1Recording(actor, learnerId, evidenceId);
    return new Response(artifact.bytes, {
      status: 200,
      headers: {
        "Content-Type": artifact.contentType,
        "Cache-Control": "private, max-age=0, no-store",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load capstone artifact.";
    const normalized = message.toLowerCase();
    const status = message === "Authentication is required."
      ? 401
      : normalized.includes("teacher organization") || normalized.includes("ownership") || normalized.includes("access")
        ? 403
        : normalized.includes("not found")
          ? 404
          : 400;
    return Response.json({ error: message }, { status });
  }
}

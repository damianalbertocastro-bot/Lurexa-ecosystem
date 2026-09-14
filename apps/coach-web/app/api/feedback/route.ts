import { FeedbackService, type UserFeedbackSubmission } from "@lurexa/backend/feedback.server";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    let userId = "anonymous_coach_speaker";
    let tenantId = "lurexa-self-paced";

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      try {
        const actor = await CoursePlatformService.authenticate(authHeader);
        userId = actor.uid;
        tenantId = "lurexa-self-paced";
      } catch {
        // Allow anonymous feedback for speech glitches before login
      }
    }

    const body = (await request.json()) as Partial<UserFeedbackSubmission>;
    if (!body.message || typeof body.message !== "string") {
      return Response.json({ error: "Message is required." }, { status: 400 });
    }

    const result = await FeedbackService.submitFeedback({
      userId,
      tenantId,
      product: "coach",
      category: body.category || "audio",
      sentimentScore: body.sentimentScore ?? 5,
      message: body.message,
      diagnostics: body.diagnostics,
    });

    return Response.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit feedback.";
    return Response.json({ error: message }, { status: 500 });
  }
}

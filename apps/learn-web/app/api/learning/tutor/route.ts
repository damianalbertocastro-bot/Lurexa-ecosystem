import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { LearnTutorService } from "@lurexa/backend/learn-tutor.server";
import type { LearnTutorTurnRequest } from "@lurexa/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const contentType = request.headers.get("content-type") || "";
    let payload: Partial<LearnTutorTurnRequest> & { action?: string };

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const courseId = formData.get("courseId");
      const lessonId = formData.get("lessonId");
      const activityId = formData.get("activityId");
      const sessionId = formData.get("sessionId");
      const action = formData.get("action");
      const learnerMessage = formData.get("learnerMessage") || formData.get("transcript");
      const audioFile = formData.get("audio");

      let audioBase64: string | undefined;
      let audioMimeType: string | undefined;

      if (audioFile instanceof File && audioFile.size > 0) {
        audioMimeType = audioFile.type || "audio/webm";
        const buffer = Buffer.from(await audioFile.arrayBuffer());
        audioBase64 = buffer.toString("base64");
      }

      payload = {
        courseId: typeof courseId === "string" ? courseId : undefined,
        lessonId: typeof lessonId === "string" ? lessonId : undefined,
        activityId: typeof activityId === "string" ? activityId : undefined,
        sessionId: typeof sessionId === "string" ? sessionId : undefined,
        action: typeof action === "string" ? action : undefined,
        learnerMessage: typeof learnerMessage === "string" ? learnerMessage : undefined,
        audioBase64,
        audioMimeType,
      };
    } else {
      const body: unknown = await request.json();
      if (typeof body !== "object" || body === null || Array.isArray(body)) {
        throw new Error("Invalid tutor request.");
      }
      payload = body as Partial<LearnTutorTurnRequest> & { action?: string };
    }

    if (
      typeof payload.courseId !== "string"
      || typeof payload.lessonId !== "string"
      || typeof payload.activityId !== "string"
    ) {
      throw new Error("Tutor request is incomplete.");
    }

    if (payload.action === "generateOpener" || payload.action === "startSession") {
      return Response.json(
        await LearnTutorService.generateOpener(actor, {
          courseId: payload.courseId,
          lessonId: payload.lessonId,
          activityId: payload.activityId,
        })
      );
    }

    if (!payload.learnerMessage && !payload.audioBase64) {
      throw new Error("Write or speak a response to continue the roleplay.");
    }

    return Response.json(await LearnTutorService.respond(actor, payload as LearnTutorTurnRequest));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to continue the tutor scenario.";
    const status = message === "Authentication is required." ? 401 : message.toLowerCase().includes("not found") ? 404 : 400;
    return Response.json({ error: message }, { status });
  }
}

export async function GET(): Promise<Response> {
  return Response.json(LearnTutorService.getDiagnosticStatus());
}

import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { TeacherInterventionActions } from "@lurexa/backend/teacher-intervention-actions.server";
import { TeacherInterventionService } from "@lurexa/backend/teacher-intervention.server";
import type { TeacherInterventionResponse } from "@lurexa/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Teacher intervention request failed.";
  const status = message === "Authentication is required." ? 401 : message.toLowerCase().includes("not found") ? 404 : 400;
  return Response.json({ error: message }, { status });
}

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    if (url.searchParams.get("learner") === "1") {
      return Response.json(await TeacherInterventionService.listForLearner(actor));
    }
    const courseId = url.searchParams.get("courseId");
    if (!courseId) throw new Error("courseId is required for the teacher intervention list.");
    return Response.json(await TeacherInterventionService.listForTeacher(actor, courseId));
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) throw new Error("Invalid intervention request.");
    const payload = body as {
      action?: unknown;
      courseId?: unknown;
      learnerId?: unknown;
      interventionId?: unknown;
      response?: unknown;
    };

    if (payload.action === "create" && typeof payload.courseId === "string" && typeof payload.learnerId === "string") {
      return Response.json(await TeacherInterventionService.createBrief(actor, payload.courseId, payload.learnerId));
    }

    if (payload.action === "createRecent" && typeof payload.learnerId === "string") {
      return Response.json(await TeacherInterventionActions.createForRecentCourse(actor, payload.learnerId));
    }

    if (payload.action === "acknowledge" && typeof payload.interventionId === "string") {
      return Response.json(await TeacherInterventionActions.acknowledgeForLearner(actor, payload.interventionId));
    }

    if (
      payload.action === "respond"
      && typeof payload.interventionId === "string"
      && typeof payload.response === "object"
      && payload.response !== null
      && !Array.isArray(payload.response)
    ) {
      const response = payload.response as Omit<TeacherInterventionResponse, "respondedAt">;
      if (
        !["confidence", "communication", "accuracy", "fluency", "pronunciation", "strategy"].includes(response.priority)
        || typeof response.teacherNote !== "string"
        || typeof response.recommendedAction !== "string"
        || typeof response.expertEscalationRequested !== "boolean"
      ) {
        throw new Error("Teacher response is incomplete.");
      }
      return Response.json(await TeacherInterventionService.respond(actor, payload.interventionId, response));
    }

    throw new Error("Unsupported teacher intervention action.");
  } catch (error) {
    return failure(error);
  }
}

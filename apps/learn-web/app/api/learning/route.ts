import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import type { ContentBlock, Course } from "@lurexa/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Request failed.";
  return Response.json({ error: message }, { status: message === "Authentication is required." ? 401 : 400 });
}

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    const courseId = url.searchParams.get("courseId");
    const lessonId = url.searchParams.get("lessonId");
    if (url.searchParams.get("studentDashboard") === "1") {
      return Response.json(await CoursePlatformService.getLearnerDashboard(actor));
    }
    if (url.searchParams.get("teacherDashboard") === "1") {
      return Response.json(await CoursePlatformService.getTeacherCourses(actor));
    }
    if (courseId && lessonId) return Response.json(await CoursePlatformService.getLesson(actor, courseId, lessonId));
    return Response.json(await CoursePlatformService.getLearnerCourses(actor));
  } catch (error) { return failure(error); }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) throw new Error("Invalid request body.");
    const payload = body as { action?: unknown; courseId?: unknown; lessonId?: unknown; timeSpentSeconds?: unknown; title?: unknown; description?: unknown; subject?: unknown; moduleId?: unknown; contentBlocks?: unknown; order?: unknown; estimatedMinutes?: unknown };
    if (payload.action === "createCourse" && typeof payload.title === "string" && typeof payload.description === "string" && ["english", "math", "science", "other"].includes(payload.subject as string)) {
      return Response.json(await CoursePlatformService.createCourse(actor, payload.title, payload.description, payload.subject as Course["subject"]));
    }
    if (payload.action === "addModule" && typeof payload.courseId === "string" && typeof payload.title === "string" && typeof payload.order === "number") {
      return Response.json(await CoursePlatformService.addModule(actor, payload.courseId, payload.title, payload.order));
    }
    if (payload.action === "saveLesson" && typeof payload.moduleId === "string" && typeof payload.title === "string" && Array.isArray(payload.contentBlocks) && typeof payload.order === "number" && typeof payload.estimatedMinutes === "number") {
      return Response.json(await CoursePlatformService.saveLesson(actor, payload.moduleId, payload.title, payload.contentBlocks as ContentBlock[], payload.order, payload.estimatedMinutes));
    }
    if (payload.action === "updateLesson" && typeof payload.lessonId === "string" && typeof payload.title === "string" && Array.isArray(payload.contentBlocks)) {
      return Response.json(await CoursePlatformService.updateLesson(actor, payload.lessonId, payload.title, payload.contentBlocks as ContentBlock[]));
    }
    if (payload.action === "deleteLesson" && typeof payload.lessonId === "string") {
      await CoursePlatformService.deleteLesson(actor, payload.lessonId);
      return Response.json({ ok: true });
    }
    if (payload.action === "publishCourse" && typeof payload.courseId === "string") {
      await CoursePlatformService.publishCourse(actor, payload.courseId);
      return Response.json({ ok: true });
    }
    if (typeof payload.courseId !== "string" || typeof payload.lessonId !== "string" || typeof payload.timeSpentSeconds !== "number") {
      throw new Error("courseId, lessonId, and timeSpentSeconds are required.");
    }
    return Response.json(await CoursePlatformService.completeLesson(actor, payload.courseId, payload.lessonId, payload.timeSpentSeconds));
  } catch (error) { return failure(error); }
}

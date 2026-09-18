import type { LearningEvidenceType } from "@lurexa/types";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { FirestoreLearningEvidenceRepository } from "@lurexa/backend/learner-firestore.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set<LearningEvidenceType>([
  "assessment_result",
  "activity_result",
  "curriculum_progress",
  "goal_update",
  "self_report",
  "preference",
  "recommendation",
]);

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body = await request.json() as {
      id?: unknown;
      competencyId?: unknown;
      type?: unknown;
      payload?: unknown;
      courseId?: unknown;
      lessonId?: unknown;
      activityId?: unknown;
      observedAt?: unknown;
    };

    if (typeof body.id !== "string" || typeof body.type !== "string" || !ALLOWED_TYPES.has(body.type as LearningEvidenceType)) {
      return Response.json({ error: "Invalid offline evidence contract." }, { status: 400 });
    }

    const courseId = typeof body.courseId === "string" ? body.courseId : undefined;
    const lessonId = typeof body.lessonId === "string" ? body.lessonId : undefined;
    const activityId = typeof body.activityId === "string" ? body.activityId : undefined;
    const courseSnapshot = courseId
      ? await (await import("@lurexa/backend/firebase-admin.server")).getServerFirestore().collection("courses").doc(courseId).get()
      : null;
    const organizationId = courseSnapshot?.data()?.orgId;
    if (typeof organizationId !== "string" || !organizationId) {
      return Response.json({ error: "Course organization is unavailable." }, { status: 400 });
    }

    const evidence = {
      contractVersion: "1" as const,
      id: body.id,
      learnerId: actor.uid,
      organizationId,
      source: {
        product: "learn" as const,
        ...(courseId ? { courseId } : {}),
        ...(lessonId ? { lessonId } : {}),
        ...(activityId ? { activityId } : {}),
      },
      type: body.type as LearningEvidenceType,
      observedAt: typeof body.observedAt === "string" ? body.observedAt : new Date().toISOString(),
      dataClassification: "sensitive" as const,
      payload: typeof body.payload === "object" && body.payload !== null ? body.payload : {},
      provenance: {
        method: "learner_submitted" as const,
        actorId: actor.uid,
      },
    };

    await new FirestoreLearningEvidenceRepository().append(evidence);
    return Response.json({ success: true, id: body.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to synchronize offline evidence.";
    const status = message === "Authentication is required." ? 401 : 400;
    return Response.json({ error: message }, { status });
  }
}

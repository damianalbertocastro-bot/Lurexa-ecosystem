import { getServerFirestore } from "@lurexa/backend/firebase-admin.server";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedEventTypes = [
  "learning_activity.opened",
  "learning_activity.submitted",
  "speaking_practice.completed",
  "create_apply.submitted",
] as const;

type AllowedEventType = (typeof allowedEventTypes)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();
    if (!isRecord(body) || !allowedEventTypes.includes(body.eventType as AllowedEventType) || !isRecord(body.source) || !isRecord(body.payload)) {
      return Response.json({ error: "A supported eventType, source, and payload are required." }, { status: 400 });
    }

    const product = body.source.product;
    if (product !== "learn") {
      return Response.json({ error: "Only Lurexa Learn can submit evidence through this endpoint." }, { status: 400 });
    }

    const evidenceReference = getServerFirestore().collection("learning-evidence").doc();
    const now = new Date().toISOString();
    await evidenceReference.set({
      evidenceId: evidenceReference.id,
      schemaVersion: "1",
      learnerId: actor.uid,
      actor: { type: "learner", id: actor.uid },
      source: body.source,
      eventType: body.eventType,
      occurredAt: typeof body.occurredAt === "string" ? body.occurredAt : now,
      recordedAt: now,
      authorizationContext: { learnerSelfAccess: true },
      payload: body.payload,
      reliability: {
        method: "learner_or_client_submitted",
        limitations: ["This event is not a mastery determination."],
      },
      provenance: { client: "learn-web" },
      idempotencyKey: typeof body.idempotencyKey === "string"
        ? body.idempotencyKey.slice(0, 180)
        : `${actor.uid}:${body.eventType}:${now}`,
    });

    return Response.json({ evidenceId: evidenceReference.id, recordedAt: now }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save learning evidence.";
    return Response.json({ error: message }, { status: message === "Authentication is required." ? 401 : 400 });
  }
}

import type { ProductBridgePurpose, SignatureExperienceConsumer } from "@lurexa/types";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { createProductBridge, resolveProductBridge } from "@lurexa/backend/product-bridge.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateBody = {
  destination?: SignatureExperienceConsumer;
  purpose?: ProductBridgePurpose;
  destinationRef?: string;
  contextRef?: string;
};

type ResolveBody = {
  bridgeId?: string;
  destination?: SignatureExperienceConsumer;
};

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    const action = url.searchParams.get("action") ?? "create";

    if (action === "resolve") {
      const body = await request.json() as ResolveBody;
      if (!body.bridgeId || !body.destination) {
        return Response.json({ error: "bridgeId and destination are required." }, { status: 400 });
      }
      return Response.json(await resolveProductBridge({
        actorId: actor.uid,
        bridgeId: body.bridgeId,
        destination: body.destination,
      }));
    }

    const body = await request.json() as CreateBody;
    if (!body.destination || !body.purpose || !body.destinationRef) {
      return Response.json({ error: "destination, purpose, and destinationRef are required." }, { status: 400 });
    }

    return Response.json(await createProductBridge({
      actorId: actor.uid,
      learnerId: actor.uid,
      source: "teach",
      destination: body.destination,
      purpose: body.purpose,
      destinationRef: body.destinationRef,
      ...(body.contextRef ? { contextRef: body.contextRef } : {}),
      singleUse: true,
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process Product Bridge.";
    const status = message === "Authentication is required."
      ? 401
      : message.includes("not authorized") || message.includes("identity")
        ? 403
        : message.includes("expired") || message.includes("already been used")
          ? 410
          : 400;
    return Response.json({ error: message }, { status });
  }
}

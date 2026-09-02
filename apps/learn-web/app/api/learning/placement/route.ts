import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import {
  PlacementAssessmentService,
  type PlacementProbeItem,
} from "@lurexa/backend/placement-assessment.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const url = new URL(request.url);
    const mode = url.searchParams.get("mode");
    const probes: PlacementProbeItem[] = mode === "all" || mode === "comprehensive"
      ? PlacementAssessmentService.getAllProbes()
      : PlacementAssessmentService.getInitialProbes();
    return Response.json({ probes, totalAvailable: PlacementAssessmentService.getAllProbes().length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load placement probes.";
    return Response.json(
      { error: message },
      { status: message === "Authentication is required." ? 401 : 400 }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body = (await request.json()) as {
      action?: "adaptiveNext" | "submitPlacement";
      answers?: Record<string, string>;
      goal?: string;
    };

    const answers = body.answers ?? {};

    if (body.action === "adaptiveNext") {
      const adaptiveResult = PlacementAssessmentService.getAdaptiveNextProbes(answers);
      return Response.json(adaptiveResult);
    }

    if (body.action === "submitPlacement") {
      const result = await PlacementAssessmentService.finalizePlacement({
        actorId: actor.uid,
        email: actor.email,
        goal: body.goal,
        answers,
      });
      return Response.json(result);
    }

    return Response.json({ error: "Invalid placement action." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process placement assessment.";
    return Response.json(
      { error: message },
      { status: message === "Authentication is required." ? 401 : 400 }
    );
  }
}

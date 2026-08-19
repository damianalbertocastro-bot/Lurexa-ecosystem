import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import {
  onboardSelfPacedLearner,
  type SelfPacedGoal,
} from "@lurexa/backend/self-paced-onboarding.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const goals: SelfPacedGoal[] = ["daily_life", "work", "travel", "study"];

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();
    const goal = typeof body === "object" && body !== null && !Array.isArray(body)
      ? (body as { goal?: unknown }).goal
      : undefined;

    if (!goals.includes(goal as SelfPacedGoal)) {
      return Response.json({ error: "Choose a valid learning goal." }, { status: 400 });
    }

    return Response.json(await onboardSelfPacedLearner({
      learnerId: actor.uid,
      email: actor.email,
      goal: goal as SelfPacedGoal,
    }), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to set up your learning path.";
    return Response.json({ error: message }, { status: message === "Authentication is required." ? 401 : 400 });
  }
}

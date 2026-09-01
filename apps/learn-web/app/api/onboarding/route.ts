import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import {
  onboardProductionLearner,
  type SelfPacedGoal,
  type PlacementAnswer,
} from "@lurexa/backend/production-onboarding.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const goals: SelfPacedGoal[] = ["daily_life", "work", "travel", "study"];
const placementAnswerOptions: PlacementAnswer[][] = [
  ["nice_to_meet_you", "fine_thanks"],
  ["i_live_in", "i_live"],
  ["are", "is"],
  ["going_to", "go"],
];

export async function POST(request: Request): Promise<Response> {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();
    const payload = typeof body === "object" && body !== null && !Array.isArray(body)
      ? body as { goal?: unknown; dialect?: unknown; placementAnswers?: unknown }
      : {};
    const goal = payload.goal;

    if (!goals.includes(goal as SelfPacedGoal)) {
      return Response.json({ error: "Choose a valid learning goal." }, { status: 400 });
    }

    const answers = payload.placementAnswers;
    if (answers !== undefined && (!Array.isArray(answers) || answers.length !== placementAnswerOptions.length || answers.some((answer, index) => typeof answer !== "string" || !placementAnswerOptions[index]?.includes(answer as PlacementAnswer)))) {
      return Response.json({ error: "Complete the start check before continuing." }, { status: 400 });
    }

    return Response.json(await onboardProductionLearner({
      learnerId: actor.uid,
      email: actor.email,
      goal: goal as SelfPacedGoal,
      dialect: typeof payload.dialect === "string" ? payload.dialect : undefined,
      ...(answers ? { placementAnswers: answers as PlacementAnswer[] } : {}),
    }), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to set up your learning path.";
    return Response.json({ error: message }, { status: message === "Authentication is required." ? 401 : 400 });
  }
}

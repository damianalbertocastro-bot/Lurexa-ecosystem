import type { CoachSessionStartResult } from "@lurexa/types";
import type { AuthenticatedActor } from "./course-platform.server";
import { getEducatorBenefitEntitlements } from "./educator-access.server";
import { CoachPlatformService } from "./coach-platform.server";
import { getServerFirestore } from "./firebase-admin.server";

export async function startEducatorCoachSession(actor: AuthenticatedActor): Promise<CoachSessionStartResult> {
  const benefits = await getEducatorBenefitEntitlements(actor.uid);
  if (!benefits.coachFull) throw new Error("Full Coach educator benefit is required for professional Coach mode.");
  const result = await CoachPlatformService.startSession(actor);
  const session = { ...result.session, mode: "educator_professional" as const };
  await getServerFirestore().collection("coach-sessions").doc(session.id).set({ mode: session.mode }, { merge: true });
  return { ...result, session };
}

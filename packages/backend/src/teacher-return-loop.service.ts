import type { TeacherGuidancePayload } from "@lurexa/types";
import type { AuthenticatedActor } from "./course-platform.server";
import {
  submitTeacherGuidance as submitCoreTeacherGuidance,
  type TeacherReturnLoopResult,
} from "./core/teacher-return-loop.server";

export type { TeacherReturnLoopResult } from "./core/teacher-return-loop.server";

/**
 * Compatibility facade for the teacher return loop.
 *
 * The old guidance-only method trusted a teacherId supplied by the payload and
 * wrote both evidence and a derived learner-model projection directly. That
 * path is intentionally closed. Callers must authenticate the actor and use
 * the Core-owned evidence -> Mind -> Core approval loop.
 */
export class TeacherReturnLoopService {
  static async submitAuthenticatedTeacherGuidance(
    actor: AuthenticatedActor,
    guidance: TeacherGuidancePayload,
  ): Promise<TeacherReturnLoopResult> {
    return submitCoreTeacherGuidance({ actor, guidance });
  }

  /** @deprecated Unsafe legacy entrypoint; deliberately fails closed. */
  static async submitTeacherGuidance(guidance: TeacherGuidancePayload): Promise<never> {
    void guidance;
    throw new Error(
      "Unauthenticated teacher guidance is disabled. Use submitAuthenticatedTeacherGuidance with the verified actor.",
    );
  }
}

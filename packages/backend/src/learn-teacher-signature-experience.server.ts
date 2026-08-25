import type { LearnerPulseProjectionV1 } from "@lurexa/types";
import { getLearnerPulseProjection } from "./signature-experience.server";

/**
 * Governed Lurexa Learn teacher-workspace consumer of Learner Pulse.
 * The real educator actor is passed into Core unchanged; Core owns delegated
 * role, purpose, learner-membership, and organization authorization.
 */
export async function getLearnTeacherLearnerPulseProjection(input: {
  actorId: string;
  learnerId: string;
  organizationId: string;
}): Promise<LearnerPulseProjectionV1> {
  if (!input.organizationId.trim()) {
    throw new Error("Learn teacher instructional support requires an explicit organization boundary.");
  }
  if (input.actorId === input.learnerId) {
    throw new Error("Learn teacher instructional support is for an authorized educator supporting another learner.");
  }

  const projection = await getLearnerPulseProjection({
    actorId: input.actorId,
    request: {
      contractVersion: "1",
      learnerId: input.learnerId,
      organizationId: input.organizationId,
      consumer: "learn",
      purpose: "learn_signature_experience",
      projection: "learner_pulse",
    },
  });

  if (projection.organizationId !== input.organizationId) {
    throw new Error("No current learner context is available for this organization.");
  }

  return projection;
}

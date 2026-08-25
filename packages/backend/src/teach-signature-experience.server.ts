import type { LearnerPulseProjectionV1 } from "@lurexa/types";
import { getLearnerPulseProjection } from "./signature-experience.server";

/**
 * Governed Teach consumer of the Signature Experience system.
 * Delegated actor/tenant/role authorization now lives inside Core's learner
 * context boundary; Teach passes the real educator actor through unchanged.
 */
export async function getTeachLearnerPulseProjection(input: {
  actorId: string;
  learnerId: string;
  organizationId: string;
}): Promise<LearnerPulseProjectionV1> {
  if (!input.organizationId.trim()) {
    throw new Error("Teach instructional support requires an explicit organization boundary.");
  }
  if (input.actorId === input.learnerId) {
    throw new Error("Teach instructional support is for an authorized educator supporting another learner.");
  }

  const projection = await getLearnerPulseProjection({
    actorId: input.actorId,
    request: {
      contractVersion: "1",
      learnerId: input.learnerId,
      organizationId: input.organizationId,
      consumer: "teach",
      purpose: "teach_signature_experience",
      projection: "learner_pulse",
    },
  });

  if (projection.organizationId !== input.organizationId) {
    throw new Error("No current learner context is available for this organization.");
  }

  return projection;
}

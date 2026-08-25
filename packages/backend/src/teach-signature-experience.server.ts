import type { LearnerPulseProjectionV1 } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { getLearnerPulseProjection } from "./signature-experience.server";

const TEACHER_ROLES = new Set(["owner", "admin", "teacher"]);

async function requireOrganizationMember(userId: string, organizationId: string): Promise<{ role?: string }> {
  const snapshot = await getServerFirestore()
    .collection("user-memberships")
    .doc(userId)
    .collection("organizations")
    .doc(organizationId)
    .get();

  if (!snapshot.exists) throw new Error("The learner is not a member of the requested organization.");
  return snapshot.data() as { role?: string };
}

async function requireTeachInstructionalSupportAccess(input: {
  actorId: string;
  learnerId: string;
  organizationId: string;
}): Promise<void> {
  if (!input.organizationId.trim()) {
    throw new Error("Teach instructional support requires an explicit organization boundary.");
  }
  if (input.actorId === input.learnerId) {
    throw new Error("Teach instructional support is for an authorized educator supporting another learner.");
  }

  const actorMembership = await requireOrganizationMember(input.actorId, input.organizationId);
  if (!actorMembership.role || !TEACHER_ROLES.has(actorMembership.role)) {
    throw new Error("A teacher, organization admin, or owner membership is required for instructional support.");
  }

  await requireOrganizationMember(input.learnerId, input.organizationId);
}

/**
 * First governed Teach consumer of the Signature Experience system.
 *
 * The existing v1 learner projection service is self-authorized internally, so
 * this trusted adapter performs explicit teacher + learner tenant authorization
 * before delegating projection construction. The resulting projection must still
 * resolve to the requested organization or it is rejected rather than leaking a
 * learner's most-recent context from another institution.
 *
 * This capability returns a read-only learner-facing projection. It never exposes
 * raw evidence payloads, transcripts, or hidden Mind reasoning.
 */
export async function getTeachLearnerPulseProjection(input: {
  actorId: string;
  learnerId: string;
  organizationId: string;
}): Promise<LearnerPulseProjectionV1> {
  await requireTeachInstructionalSupportAccess(input);

  const projection = await getLearnerPulseProjection({
    // Trusted delegation after explicit tenant/role authorization above. The
    // underlying v1 projection remains self-authorized until Core's context API
    // gains a first-class delegated-actor envelope.
    actorId: input.learnerId,
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

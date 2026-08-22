import type { LearningEvidence } from "@lurexa/types";
import { A1_CAPSTONE, A1_CAPSTONE_ID, A1_COURSE_ID } from "./a1-capstone.server";
import type { AuthenticatedActor } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { refreshLearnerIntelligence } from "./learner-intelligence-pipeline.server";

type TeacherRole = "owner" | "admin" | "teacher";
export type CapstonePerformanceJudgment = "meets" | "not_yet" | "inconclusive";

export interface A1CapstoneReviewCandidate {
  evidenceId: string;
  lessonId: string | null;
  activityId: string | null;
  observedAt: string;
  evidenceType: LearningEvidence["type"];
  event: string | null;
  competencyIds: string[];
  requirementIds: string[];
  textPreview: string | null;
  recordingId: string | null;
  sessionId: string | null;
  validatedRequirementIds: string[];
}

function cleanText(value: string, maxLength: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

async function requireTeacherAccess(actor: AuthenticatedActor): Promise<string> {
  const database = getServerFirestore();
  const courseSnapshot = await database.collection("courses").doc(A1_COURSE_ID).get();
  if (!courseSnapshot.exists) throw new Error("A1 course not found.");
  const organizationId = courseSnapshot.data()?.orgId;
  if (typeof organizationId !== "string" || !organizationId) throw new Error("A1 course organization is unavailable.");
  const membership = await database.collection("user-memberships").doc(actor.uid).collection("organizations").doc(organizationId).get();
  const role = membership.data()?.role;
  if (!membership.exists || !(["owner", "admin", "teacher"] as TeacherRole[]).includes(role as TeacherRole)) {
    throw new Error("A teacher organization membership is required.");
  }
  return organizationId;
}

async function requireLearner(learnerId: string, organizationId: string): Promise<void> {
  const membership = await getServerFirestore().collection("user-memberships").doc(learnerId).collection("organizations").doc(organizationId).get();
  if (!membership.exists) throw new Error("Learner is not part of this organization.");
}

function requirementById(requirementId: string) {
  const requirement = A1_CAPSTONE.evidenceRequirements.find((item) => item.id === requirementId);
  if (!requirement) throw new Error("Unknown A1 capstone requirement.");
  return requirement;
}

function payloadFor(evidence: LearningEvidence): Record<string, unknown> {
  return typeof evidence.payload === "object" && evidence.payload !== null && !Array.isArray(evidence.payload)
    ? evidence.payload as Record<string, unknown>
    : {};
}

function competencyIdsFor(evidence: LearningEvidence): string[] {
  const payload = payloadFor(evidence);
  return Array.isArray(payload.competencyIds)
    ? payload.competencyIds.filter((value): value is string => typeof value === "string")
    : [];
}

function requirementIdsFor(competencyIds: string[]): string[] {
  return A1_CAPSTONE.evidenceRequirements
    .filter((requirement) => competencyIds.some((id) => requirement.competencyIds.includes(id)))
    .map((requirement) => requirement.id);
}

function reviewable(evidence: LearningEvidence): boolean {
  const payload = payloadFor(evidence);
  if (payload.event === "capstone.performance_validated") return false;
  if (payload.event === "spoken_evidence.recorded") return true;
  if (payload.event === "ai_roleplay.turn" && payload.completedMinimumTurns === true) return true;
  if (payload.activityType === "short_response" && payload.submitted === true) return true;
  return false;
}

function deduplicateReviewEvidence(evidence: LearningEvidence[]): LearningEvidence[] {
  const latestRoleplayBySession = new Map<string, LearningEvidence>();
  const result: LearningEvidence[] = [];
  for (const item of evidence) {
    const payload = payloadFor(item);
    if (payload.event === "ai_roleplay.turn" && item.source.sessionId) {
      const current = latestRoleplayBySession.get(item.source.sessionId);
      if (!current || item.observedAt > current.observedAt) latestRoleplayBySession.set(item.source.sessionId, item);
      continue;
    }
    result.push(item);
  }
  return [...result, ...latestRoleplayBySession.values()];
}

async function requireSourceEvidence(input: {
  evidenceId: string;
  learnerId: string;
  organizationId: string;
  requirementCompetencyIds: string[];
}): Promise<LearningEvidence<Record<string, unknown>>> {
  const evidence = await new FirestoreLearningEvidenceRepository().listByLearner(input.learnerId, input.organizationId);
  const source = evidence.find((item) => item.id === input.evidenceId);
  if (!source) throw new Error("Capstone source evidence was not found for this learner.");
  if (source.source.courseId !== A1_COURSE_ID) throw new Error("Capstone source evidence is not part of the A1 course.");
  const competencyIds = competencyIdsFor(source);
  if (!competencyIds.some((id) => input.requirementCompetencyIds.includes(id))) {
    throw new Error("Source evidence does not support the selected capstone requirement.");
  }
  if (!reviewable(source)) throw new Error("This source evidence does not require a capstone performance review.");
  return source as LearningEvidence<Record<string, unknown>>;
}

export const CapstonePerformanceValidationService = {
  async listA1Candidates(actor: AuthenticatedActor, learnerId: string): Promise<A1CapstoneReviewCandidate[]> {
    const organizationId = await requireTeacherAccess(actor);
    await requireLearner(learnerId, organizationId);
    const evidence = await new FirestoreLearningEvidenceRepository().listByLearner(learnerId, organizationId);
    const courseEvidence = evidence.filter((item) => item.source.courseId === A1_COURSE_ID);
    const validatedRequirementsBySource = new Map<string, Set<string>>();
    for (const item of courseEvidence) {
      const payload = payloadFor(item);
      if (
        payload.event !== "capstone.performance_validated"
        || typeof payload.sourceEvidenceId !== "string"
        || typeof payload.requirementId !== "string"
      ) continue;
      const current = validatedRequirementsBySource.get(payload.sourceEvidenceId) ?? new Set<string>();
      current.add(payload.requirementId);
      validatedRequirementsBySource.set(payload.sourceEvidenceId, current);
    }

    return deduplicateReviewEvidence(courseEvidence.filter(reviewable))
      .map((item) => {
        const payload = payloadFor(item);
        const competencyIds = competencyIdsFor(item);
        const response = typeof payload.response === "string" ? cleanText(payload.response, 600) : null;
        return {
          evidenceId: item.id,
          lessonId: item.source.lessonId ?? null,
          activityId: item.source.activityId ?? null,
          observedAt: item.observedAt,
          evidenceType: item.type,
          event: typeof payload.event === "string" ? payload.event : null,
          competencyIds,
          requirementIds: requirementIdsFor(competencyIds),
          textPreview: response,
          recordingId: typeof payload.recordingId === "string" ? payload.recordingId : null,
          sessionId: item.source.sessionId ?? null,
          validatedRequirementIds: [...(validatedRequirementsBySource.get(item.id) ?? new Set<string>())],
        };
      })
      .filter((item) => item.requirementIds.length > 0)
      .sort((first, second) => second.observedAt.localeCompare(first.observedAt));
  },

  async validateA1(actor: AuthenticatedActor, input: {
    learnerId: string;
    requirementId: string;
    sourceEvidenceId: string;
    judgment: CapstonePerformanceJudgment;
    rationale: string;
    confidence: number;
  }): Promise<LearningEvidence<Record<string, unknown>>> {
    const organizationId = await requireTeacherAccess(actor);
    await requireLearner(input.learnerId, organizationId);
    const requirement = requirementById(input.requirementId);
    const source = await requireSourceEvidence({
      evidenceId: input.sourceEvidenceId,
      learnerId: input.learnerId,
      organizationId,
      requirementCompetencyIds: requirement.competencyIds,
    });

    if (!["meets", "not_yet", "inconclusive"].includes(input.judgment)) throw new Error("Capstone performance judgment is invalid.");
    if (!Number.isFinite(input.confidence) || input.confidence < 0 || input.confidence > 1) throw new Error("Capstone validation confidence must be between 0 and 1.");
    const rationale = cleanText(input.rationale, 2_000);
    if (!rationale) throw new Error("Capstone validation rationale is required.");

    const now = new Date().toISOString();
    const evidenceId = `capstone_validation_${input.learnerId}_${input.requirementId}_${Date.now()}`.replace(/[^a-zA-Z0-9._-]/g, "_");
    const validation: LearningEvidence<Record<string, unknown>> = {
      contractVersion: "1",
      id: evidenceId,
      learnerId: input.learnerId,
      organizationId,
      source: {
        product: "learn",
        courseId: A1_COURSE_ID,
        ...(source.source.lessonId ? { lessonId: source.source.lessonId } : {}),
        ...(source.source.activityId ? { activityId: source.source.activityId } : {}),
      },
      type: "activity_result",
      observedAt: now,
      // Teacher rationale can contain learner-performance detail and is
      // intentionally not treated as a general-purpose analytics payload.
      dataClassification: "sensitive",
      payload: {
        event: "capstone.performance_validated",
        capstoneId: A1_CAPSTONE_ID,
        requirementId: requirement.id,
        sourceEvidenceId: source.id,
        competencyIds: requirement.competencyIds,
        performanceJudgment: input.judgment,
        confidence: input.confidence,
        rationale,
        rubricVersion: "a1-capstone-v1",
        independent: true,
      },
      provenance: {
        method: "teacher_reported",
        actorId: actor.uid,
        confidence: input.confidence,
      },
    };

    await new FirestoreLearningEvidenceRepository().append(validation);
    try {
      await refreshLearnerIntelligence({ learnerId: input.learnerId, organizationId });
    } catch (error) {
      console.error("Learner intelligence refresh failed after capstone validation.", error);
    }
    return validation;
  },
};

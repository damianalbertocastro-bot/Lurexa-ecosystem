import type {
  CandidateDerivedObservation,
  LearnerRecommendationAction,
  LearningEvidence,
  MindInterpretationRequestV1,
  MindInterpretationResultV1,
} from "@lurexa/types";
import { ConservativeLearningIntelligenceService } from "../mind-learning-intelligence.server";
import { MindService } from "../mind.service";

function dedupeCandidates(candidates: CandidateDerivedObservation[]): CandidateDerivedObservation[] {
  const byIdentity = new Map<string, CandidateDerivedObservation>();
  for (const candidate of candidates) {
    const identity = [
      candidate.type,
      candidate.domain,
      candidate.learnerId,
      candidate.organizationId ?? "global",
      ...candidate.basedOnEvidenceIds.slice().sort(),
    ].join("|");
    const existing = byIdentity.get(identity);
    if (!existing || candidate.confidence > existing.confidence) byIdentity.set(identity, candidate);
  }
  return [...byIdentity.values()];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function teacherGuidanceRecommendation(evidence: LearningEvidence[]): CandidateDerivedObservation | null {
  const latest = evidence
    .filter((item) => item.type === "assessment_result" && item.provenance.method === "teacher_reported")
    .sort((first, second) => second.observedAt.localeCompare(first.observedAt))
    .find((item) => {
      const payload = asRecord(item.payload);
      return payload && Array.isArray(payload.returnLoopActions) && payload.returnLoopActions.length > 0;
    });
  if (!latest) return null;

  const payload = asRecord(latest.payload)!;
  const rawAction = asRecord((payload.returnLoopActions as unknown[])[0]);
  if (!rawAction || typeof rawAction.title !== "string" || typeof rawAction.instruction !== "string") return null;
  const competencyIds = Array.isArray(rawAction.targetCompetencyIds)
    ? rawAction.targetCompetencyIds.filter((entry): entry is string => typeof entry === "string")
    : [];

  const action: LearnerRecommendationAction = {
    outcome: rawAction.actionType === "advance_with_target" ? "continue" : "targeted_practice",
    label: rawAction.title,
    reason: rawAction.instruction,
    ...(typeof rawAction.courseId === "string" ? { courseId: rawAction.courseId } : latest.source.courseId ? { courseId: latest.source.courseId } : {}),
    ...(typeof rawAction.lessonId === "string" ? { lessonId: rawAction.lessonId } : latest.source.lessonId ? { lessonId: latest.source.lessonId } : {}),
    ...(typeof rawAction.activityId === "string" ? { activityId: rawAction.activityId } : latest.source.activityId ? { activityId: latest.source.activityId } : {}),
    ...(competencyIds.length ? { competencyIds } : {}),
  };

  return {
    contractVersion: "1",
    observationId: `mind_teacher_guidance_${latest.id}`.replace(/[^a-zA-Z0-9._-]/g, "_"),
    learnerId: latest.learnerId,
    ...(latest.organizationId ? { organizationId: latest.organizationId } : {}),
    type: "recommendation",
    status: "candidate",
    domain: "recommendation",
    summary: `Teacher guidance recommends: ${rawAction.title}`,
    confidence: 1,
    basedOnEvidenceIds: [latest.id],
    data: {
      kind: "recommendation",
      actions: [action.label],
      recommendations: [action],
      interpretationVersion: "teacher-guidance-v1",
    },
    generatedAt: new Date().toISOString(),
    effectiveAt: new Date().toISOString(),
    generatedBy: {
      capability: "teacher-guidance-normalizer",
      modelPolicyVersion: "mind-policy-v1",
      ruleVersion: "teacher-guidance-v1",
    },
    limitations: ["This recommendation normalizes explicit teacher guidance; it does not infer learner proficiency."],
    scope: {
      purposes: ["learn_adaptive_practice", "coach_session_adaptation"],
      products: ["learn", "coach"],
    },
    reviewStatus: "automated_approved",
    provenance: { method: "deterministic_rule" },
  };
}

/**
 * Storage-free Lurexa Mind facade.
 *
 * The conservative interpreter protects the existing Learn quiz/activity
 * recommendation loop. The richer adaptation engine interprets spoken and
 * linguistic evidence. Explicit teacher guidance is normalized into a scoped
 * recommendation without changing its authoritative meaning. None of these
 * Mind capabilities may select Firestore data, authorize access, approve
 * candidates, or persist learner state.
 */
export class MindLearningIntelligenceService {
  private readonly conservative = new ConservativeLearningIntelligenceService();
  private readonly adaptation = new MindService();

  async interpretAuthorizedEvidence(
    request: MindInterpretationRequestV1,
  ): Promise<MindInterpretationResultV1> {
    const [conservativeResult, adaptationResult] = await Promise.all([
      this.conservative.interpretAuthorizedEvidence(request),
      this.adaptation.interpret(request),
    ]);
    const teacherGuidance = request.interpretationTypes.includes("recommendation")
      ? teacherGuidanceRecommendation(request.input.evidence)
      : null;

    const outputs = dedupeCandidates([
      ...conservativeResult.outputs,
      ...adaptationResult.outputs,
      ...(teacherGuidance ? [teacherGuidance] : []),
    ]);

    return {
      contractVersion: request.contractVersion,
      interpretationId: request.requestId,
      learnerId: request.input.learnerId,
      generatedAt: new Date().toISOString(),
      purpose: request.purpose,
      outputs,
      limitations: outputs.length
        ? [
            ...new Set([
              ...conservativeResult.limitations,
              ...adaptationResult.limitations,
            ]),
          ]
        : ["No evidence-supported interpretation is available for the requested types."],
      modelPolicyVersion: request.modelPolicyVersion,
    };
  }
}

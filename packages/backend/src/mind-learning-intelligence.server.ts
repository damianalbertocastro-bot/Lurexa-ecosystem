import type {
  CandidateDerivedObservation,
  LearnerInsight,
  LearnerInterpretationRequest,
  LearnerInterpretationResult,
  LearnerRecommendationAction,
  LearningEvidence,
  MindInterpretationRequestV1,
  MindInterpretationResultV1,
} from "@lurexa/types";
import { MIND_INTERPRETATION_CONTRACT_VERSION } from "@lurexa/types";

const interpretationVersion = "learn-next-step-v1";
const mindCapability = "conservative-learning-intelligence";

function observationIdFor(insight: LearnerInsight): string {
  let hash = 5381;
  for (const character of insight.basedOnEvidenceIds.join("|")) {
    hash = ((hash * 33) ^ character.charCodeAt(0)) >>> 0;
  }
  return `${insight.id}_${hash.toString(36)}`;
}

function readCorrect(payload: unknown): boolean | null {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return null;
  const value = (payload as Record<string, unknown>).correct;
  return typeof value === "boolean" ? value : null;
}

function readGoal(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return null;
  const value = (payload as Record<string, unknown>).goal;
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readCompetencyIds(payload: unknown): string[] {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return [];
  const value = (payload as Record<string, unknown>).competencyIds;
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function scoredEvidence(evidence: LearningEvidence[]): LearningEvidence[] {
  return evidence
    .filter((item) => item.source.product === "learn" && item.source.activityId && readCorrect(item.payload) !== null)
    .sort((first, second) => first.observedAt.localeCompare(second.observedAt));
}

function attemptsByActivity(evidence: LearningEvidence[]): Map<string, LearningEvidence[]> {
  const grouped = new Map<string, LearningEvidence[]>();
  for (const item of scoredEvidence(evidence)) {
    const activityId = item.source.activityId!;
    const current = grouped.get(activityId) ?? [];
    current.push(item);
    grouped.set(activityId, current);
  }
  return grouped;
}

function recommendationId(learnerId: string, organizationId?: string): string {
  return `mind_next_step_${learnerId}_${organizationId ?? "global"}`.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function goalInsightId(learnerId: string, organizationId?: string): string {
  return `mind_goals_${learnerId}_${organizationId ?? "global"}`.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function buildRecommendation(evidence: LearningEvidence[]): {
  action: LearnerRecommendationAction;
  evidence: LearningEvidence[];
  confidence: number;
  summary: string;
} | null {
  const grouped = attemptsByActivity(evidence);

  // Highest priority: repeated current difficulty. One failure is never enough.
  for (const [activityId, attempts] of grouped) {
    const trailingFailures: LearningEvidence[] = [];
    for (let index = attempts.length - 1; index >= 0; index -= 1) {
      const attempt = attempts[index];
      if (!attempt || readCorrect(attempt.payload) !== false) break;
      trailingFailures.unshift(attempt);
    }
    if (trailingFailures.length < 2) continue;

    const latest = trailingFailures[trailingFailures.length - 1]!;
    const competencyIds = [...new Set(trailingFailures.flatMap((item) => readCompetencyIds(item.payload)))];
    const outcome = competencyIds.length ? "targeted_practice" : "reinforce";
    const label = competencyIds.length
      ? `Practice ${competencyIds.slice(0, 2).join(" and ")}`
      : "Revisit this activity";
    return {
      action: {
        outcome,
        label,
        reason: "Recent attempts show this skill would benefit from another supported practice pass before increasing difficulty.",
        ...(latest.source.courseId ? { courseId: latest.source.courseId } : {}),
        ...(latest.source.lessonId ? { lessonId: latest.source.lessonId } : {}),
        activityId,
        ...(competencyIds.length ? { competencyIds } : {}),
      },
      evidence: trailingFailures,
      confidence: Math.min(0.88, 0.62 + trailingFailures.length * 0.06),
      summary: `Repeated recent difficulty suggests reinforcing ${competencyIds[0] ?? activityId} before increasing difficulty.`,
    };
  }

  // Second priority: a successful retry. Acknowledge recovery without calling it mastery.
  for (const [activityId, attempts] of grouped) {
    if (attempts.length < 2) continue;
    const latest = attempts[attempts.length - 1]!;
    const earlier = attempts.slice(0, -1);
    if (readCorrect(latest.payload) !== true || !earlier.some((item) => readCorrect(item.payload) === false)) continue;

    const competencyIds = readCompetencyIds(latest.payload);
    return {
      action: {
        outcome: "continue",
        label: "Continue to the next learning step",
        reason: "You corrected an earlier difficulty. Continue while keeping this skill active in review.",
        ...(latest.source.courseId ? { courseId: latest.source.courseId } : {}),
        ...(latest.source.lessonId ? { lessonId: latest.source.lessonId } : {}),
        activityId,
        ...(competencyIds.length ? { competencyIds } : {}),
      },
      evidence: attempts.slice(-3),
      confidence: 0.72,
      summary: `A successful retry on ${activityId} supports continuing while retaining light review.`,
    };
  }

  // Normal continuation requires at least two recent successful scored observations.
  const recent = scoredEvidence(evidence).slice(-3);
  const recentSuccesses = recent.filter((item) => readCorrect(item.payload) === true);
  if (recentSuccesses.length >= 2) {
    const latest = recentSuccesses[recentSuccesses.length - 1]!;
    const competencyIds = [...new Set(recentSuccesses.flatMap((item) => readCompetencyIds(item.payload)))];
    return {
      action: {
        outcome: "continue",
        label: "Keep moving forward",
        reason: "Recent activity results are consistently successful, so the next available lesson is an appropriate next step.",
        ...(latest.source.courseId ? { courseId: latest.source.courseId } : {}),
        ...(latest.source.lessonId ? { lessonId: latest.source.lessonId } : {}),
        ...(latest.source.activityId ? { activityId: latest.source.activityId } : {}),
        ...(competencyIds.length ? { competencyIds } : {}),
      },
      evidence: recentSuccesses,
      confidence: 0.68,
      summary: "Recent successful activity results support normal curriculum continuation without making a mastery claim.",
    };
  }

  return null;
}

/**
 * Initial deterministic Lurexa Mind implementation.
 *
 * It intentionally makes only narrow, revisable interpretations. A single
 * failed activity never becomes a weakness, mastery judgment, or proficiency
 * estimate. Learner-declared goals can be normalized at full confidence because
 * they are explicit preferences rather than inferred proficiency claims.
 */
export class ConservativeLearningIntelligenceService {
  /**
   * v1 Mind entrypoint. Its input is intentionally an authorized Core-owned
   * projection; this service neither reads Firestore nor persists anything.
   */
  async interpretAuthorizedEvidence(request: MindInterpretationRequestV1): Promise<MindInterpretationResultV1> {
    if (request.contractVersion !== MIND_INTERPRETATION_CONTRACT_VERSION) {
      throw new Error("Unsupported Mind interpretation contract version.");
    }
    if (request.purpose !== "mind_learning_interpretation") {
      throw new Error("Mind interpretation requires the approved Core purpose.");
    }
    if (request.input.evidence.some((entry) => entry.learnerId !== request.input.learnerId)) {
      throw new Error("Authorized Mind evidence must belong to the requested learner.");
    }
    if (request.input.organizationId && request.input.evidence.some((entry) => entry.organizationId !== request.input.organizationId)) {
      throw new Error("Authorized Mind evidence must remain within the organization boundary.");
    }
    if (!request.input.organizationId && request.input.evidence.some((entry) => entry.organizationId)) {
      throw new Error("Organization-scoped evidence requires an explicit organization boundary.");
    }
    if (request.input.context?.learnerId !== undefined && request.input.context.learnerId !== request.input.learnerId) {
      throw new Error("Authorized Mind context must belong to the requested learner.");
    }
    if (request.input.context?.organizationId !== undefined && request.input.context.organizationId !== request.input.organizationId) {
      throw new Error("Authorized Mind context must remain within the organization boundary.");
    }

    const legacy = await this.interpretLearnerEvidence({
      learnerId: request.input.learnerId,
      ...(request.input.organizationId ? { organizationId: request.input.organizationId } : {}),
      evidence: request.input.evidence,
      currentContext: request.input.context,
      requestedDomains: request.interpretationTypes.includes("recommendation") ? ["recommendation"] : [],
    });
    const outputs = legacy.insights.map((insight): CandidateDerivedObservation => ({
      contractVersion: "1",
      observationId: observationIdFor(insight),
      learnerId: insight.learnerId,
      ...(insight.organizationId ? { organizationId: insight.organizationId } : {}),
      type: insight.domain === "recommendation" ? "recommendation" : "candidate_observation",
      status: "candidate",
      domain: insight.domain,
      summary: insight.summary,
      confidence: insight.confidence,
      basedOnEvidenceIds: insight.basedOnEvidenceIds,
      ...(insight.data ? { data: insight.data } : {}),
      generatedAt: insight.generatedAt,
      effectiveAt: insight.generatedAt,
      ...(insight.validity?.expiresAt ? { expiresAt: insight.validity.expiresAt } : {}),
      generatedBy: {
        capability: mindCapability,
        modelPolicyVersion: request.modelPolicyVersion,
        ruleVersion: interpretationVersion,
      },
      limitations: [
        "This deterministic recommendation is revisable guidance, not a mastery or proficiency determination.",
      ],
      scope: {
        purposes: ["learn_adaptive_practice"],
        products: ["learn"],
      },
      reviewStatus: "automated_approved",
      provenance: { method: "deterministic_rule" },
    }));

    return {
      contractVersion: MIND_INTERPRETATION_CONTRACT_VERSION,
      interpretationId: request.requestId,
      learnerId: request.input.learnerId,
      generatedAt: new Date().toISOString(),
      purpose: request.purpose,
      outputs,
      limitations: outputs.length
        ? []
        : ["No evidence-supported interpretation is available for the requested type."],
      modelPolicyVersion: request.modelPolicyVersion,
    };
  }

  async interpretLearnerEvidence(
    request: LearnerInterpretationRequest,
  ): Promise<LearnerInterpretationResult> {
    const insights: LearnerInsight[] = [];
    const requestedDomains = new Set(request.requestedDomains ?? []);
    const includeAllDomains = requestedDomains.size === 0;
    const now = new Date().toISOString();

    if (includeAllDomains || requestedDomains.has("goal")) {
      const latestGoalEvidence = request.evidence
        .filter((item) => item.type === "goal_update" && readGoal(item.payload))
        .sort((first, second) => second.observedAt.localeCompare(first.observedAt))[0];
      const goal = latestGoalEvidence ? readGoal(latestGoalEvidence.payload) : null;

      if (latestGoalEvidence && goal) {
        insights.push({
          id: goalInsightId(request.learnerId, request.organizationId),
          learnerId: request.learnerId,
          ...(request.organizationId ? { organizationId: request.organizationId } : {}),
          domain: "goal",
          summary: `Learner-declared goal: ${goal.replace(/_/g, " ")}.`,
          confidence: 1,
          basedOnEvidenceIds: [latestGoalEvidence.id],
          data: {
            kind: "goals",
            goals: [goal],
          },
          generatedAt: now,
        });
      }
    }

    if (includeAllDomains || requestedDomains.has("recommendation")) {
      const recommendation = buildRecommendation(request.evidence);
      if (recommendation) {
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        insights.push({
          id: recommendationId(request.learnerId, request.organizationId),
          learnerId: request.learnerId,
          ...(request.organizationId ? { organizationId: request.organizationId } : {}),
          domain: "recommendation",
          summary: recommendation.summary,
          confidence: recommendation.confidence,
          basedOnEvidenceIds: recommendation.evidence.map((item) => item.id),
          data: {
            kind: "recommendation",
            actions: [recommendation.action.label],
            recommendations: [recommendation.action],
            interpretationVersion,
          },
          generatedAt: now,
          validity: { expiresAt },
        });
      }
    }

    return {
      learnerId: request.learnerId,
      insights,
      evidenceIds: request.evidence.map((item) => item.id),
      generatedAt: now,
    };
  }
}

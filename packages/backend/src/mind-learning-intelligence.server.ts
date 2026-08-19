import type {
  LearnerInsight,
  LearnerInterpretationRequest,
  LearnerInterpretationResult,
  LearningEvidence,
} from "@lurexa/types";

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

function groupFailedAttemptsByActivity(evidence: LearningEvidence[]): Map<string, LearningEvidence[]> {
  const groups = new Map<string, LearningEvidence[]>();
  for (const item of evidence) {
    if (!item.source.activityId || readCorrect(item.payload) !== false) continue;
    const current = groups.get(item.source.activityId) ?? [];
    current.push(item);
    groups.set(item.source.activityId, current);
  }
  return groups;
}

function recommendationId(learnerId: string, activityId: string): string {
  return `mind_recommendation_${learnerId}_${activityId}`.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function goalInsightId(learnerId: string, organizationId?: string): string {
  return `mind_goals_${learnerId}_${organizationId ?? "global"}`.replace(/[^a-zA-Z0-9._-]/g, "_");
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
  async interpretLearnerEvidence(
    request: LearnerInterpretationRequest,
  ): Promise<LearnerInterpretationResult> {
    const insights: LearnerInsight[] = [];
    const requestedDomains = new Set(request.requestedDomains ?? []);
    const includeAllDomains = requestedDomains.size === 0;
    const failedByActivity = groupFailedAttemptsByActivity(request.evidence);
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
      for (const [activityId, failedEvidence] of failedByActivity) {
        if (failedEvidence.length < 2) continue;

        const evidenceIds = failedEvidence.map((item) => item.id);
        const confidence = Math.min(0.85, 0.55 + failedEvidence.length * 0.05);
        insights.push({
          id: recommendationId(request.learnerId, activityId),
          learnerId: request.learnerId,
          ...(request.organizationId ? { organizationId: request.organizationId } : {}),
          domain: "recommendation",
          summary: `Repeated unsuccessful attempts suggest revisiting activity ${activityId} before increasing difficulty.`,
          confidence,
          basedOnEvidenceIds: evidenceIds,
          data: {
            kind: "recommendation",
            actions: [`Revisit activity ${activityId}`],
          },
          generatedAt: now,
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

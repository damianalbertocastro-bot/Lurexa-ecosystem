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

/**
 * Initial deterministic Lurexa Mind implementation.
 *
 * It intentionally makes only narrow, revisable interpretations. A single
 * failed activity never becomes a weakness, mastery judgment, or proficiency
 * estimate. Richer AI interpretation can replace or extend this implementation
 * behind the same Mind contract later.
 */
export class ConservativeLearningIntelligenceService {
  async interpretLearnerEvidence(
    request: LearnerInterpretationRequest,
  ): Promise<LearnerInterpretationResult> {
    const insights: LearnerInsight[] = [];
    const failedByActivity = groupFailedAttemptsByActivity(request.evidence);
    const now = new Date().toISOString();

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

    return {
      learnerId: request.learnerId,
      insights,
      evidenceIds: request.evidence.map((item) => item.id),
      generatedAt: now,
    };
  }
}

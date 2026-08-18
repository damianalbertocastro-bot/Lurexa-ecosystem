import type {
  LinguisticEvidencePayload,
  LinguisticPatternAggregate,
  LearningEvidence,
  LearnerRecurrenceState,
} from "@lurexa/types";

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function recurrenceFor(
  observationCount: number,
  sessionCount: number,
  spontaneousSuccessCount: number,
  successfulRetryCount: number,
): LearnerRecurrenceState {
  if (
    spontaneousSuccessCount >= 2 &&
    spontaneousSuccessCount + successfulRetryCount >= Math.ceil(observationCount / 2)
  ) {
    return "R4_IMPROVING";
  }
  if (observationCount >= 5 && sessionCount >= 3) {
    return "R3_STABLE_RECURRING_PATTERN";
  }
  if (sessionCount >= 2) return "R2_REPEATED_ACROSS_SESSIONS";
  if (observationCount >= 2) return "R1_REPEATED_SAME_SESSION";
  return "R0_SINGLE_OBSERVATION";
}

/**
 * Aggregates structured linguistic evidence into a provisional Mind-side
 * learner-pattern interpretation. Raw evidence remains authoritative and
 * traceable; this result is derived state, not a replacement for evidence.
 */
export class LinguisticPatternAggregatorService {
  aggregate(
    evidence: Array<LearningEvidence<LinguisticEvidencePayload>>,
  ): LinguisticPatternAggregate[] {
    const groups = new Map<
      string,
      Array<LearningEvidence<LinguisticEvidencePayload>>
    >();

    for (const event of evidence) {
      const patternId = event.payload.patternId;
      if (!patternId) continue;
      const existing = groups.get(patternId) ?? [];
      existing.push(event);
      groups.set(patternId, existing);
    }

    return [...groups.entries()].flatMap(([patternId, events]) => {
      const first = events[0];
      if (!first) return [];

      const sessions = new Set(
        events.map((event) => event.source.sessionId ?? event.id),
      );
      const selfCorrectionCount = events.filter(
        (event) => event.payload.selfCorrected === true,
      ).length;
      const successfulRetryCount = events.filter(
        (event) => event.payload.retrySuccessful === true,
      ).length;
      const spontaneousSuccessCount = events.filter(
        (event) => event.payload.laterSpontaneousSuccess === true,
      ).length;
      const latest = [...events].sort((a, b) =>
        b.observedAt.localeCompare(a.observedAt),
      )[0] ?? first;
      const recurrence = recurrenceFor(
        events.length,
        sessions.size,
        spontaneousSuccessCount,
        successfulRetryCount,
      );

      const support =
        0.2 + Math.min(events.length * 0.1, 0.35) + Math.min(sessions.size * 0.1, 0.25);
      const improvementAdjustment = spontaneousSuccessCount * 0.08;
      const confidence = clamp(support - improvementAdjustment, 0.1, 0.95);

      return [{
        patternId,
        domain: latest.payload.domain,
        observationCount: events.length,
        sessionCount: sessions.size,
        selfCorrectionCount,
        successfulRetryCount,
        spontaneousSuccessCount,
        lastObservedAt: latest.observedAt,
        recurrence,
        confidence: Number(confidence.toFixed(2)),
      }];
    });
  }
}

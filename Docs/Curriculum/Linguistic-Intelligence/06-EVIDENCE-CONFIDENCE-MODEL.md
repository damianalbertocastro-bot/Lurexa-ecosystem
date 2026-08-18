# Lurexa Linguistic Evidence & Confidence Model

Status: Initial evidence policy — v0.1  
Applies to: Lurexa Mind interpretations, Coach evidence output, Learn evidence, teacher observations

## 1. Purpose

This model defines how Lurexa moves from individual language events to durable learner interpretations without confusing observations, causes, or population tendencies.

> **Evidence is what happened. Interpretation is what Mind believes the evidence currently supports.**

## 2. Evidence unit

A language evidence event should be able to identify:

- learner/context reference;
- timestamp/session;
- source product or human source;
- pattern/competency reference where known;
- modality;
- raw or normalized learner form/behavior;
- target/context;
- task mode;
- intervention if any;
- retry/self-correction outcome;
- provenance;
- reliability metadata.

## 3. Provenance classes

Initial values:

- `DAMIAN_CLASSROOM_OBSERVATION`
- `OTHER_TEACHER_OBSERVATION`
- `LUREXA_COACH_EVIDENCE`
- `LUREXA_LEARN_EVIDENCE`
- `ASSESSMENT_EVIDENCE`
- `EXTERNAL_RESEARCH`
- `LINGUISTIC_HYPOTHESIS`
- `SYNTHETIC_EXAMPLE`

Synthetic examples cannot raise learner confidence.

## 4. Population evidence strength

Use the taxonomy scale:

- `EV0_HYPOTHESIZED`
- `EV1_TEACHER_OBSERVED`
- `EV2_RECURRENTLY_TEACHER_OBSERVED`
- `EV3_MULTI_LEARNER_CONFIRMED`
- `EV4_LUREXA_CORPUS_SUPPORTED`
- `EV5_STRONG_EMPIRICAL_SUPPORT`

Population evidence may guide monitoring but never establishes an individual learner fact.

## 5. Learner recurrence

Use:

- `R0_SINGLE_OBSERVATION`
- `R1_REPEATED_SAME_SESSION`
- `R2_REPEATED_ACROSS_SESSIONS`
- `R3_STABLE_RECURRING_PATTERN`
- `R4_IMPROVING`
- `R5_NOT_RECENTLY_OBSERVED`
- `R6_REVALIDATION_NEEDED`

Recurrence is not identical to severity.

## 6. Learner control states

For a tracked feature, Mind should be able to represent modality-specific control:

- `UNKNOWN`
- `NOT_YET_DEMONSTRATED`
- `RECOGNIZES`
- `PRODUCES_WITH_MODEL`
- `PRODUCES_WITH_PROMPT`
- `PRODUCES_INDEPENDENTLY`
- `USES_SPONTANEOUSLY`
- `RETAINED`
- `UNSTABLE`
- `NEEDS_REVALIDATION`

A learner may be `RECOGNIZES` in listening/reading and `UNSTABLE` in spontaneous speaking.

## 7. Confidence labels

Mind interpretations should use explicit confidence:

- `LOW`: sparse, noisy, contradictory, or single-event evidence;
- `MEDIUM`: repeated evidence with reasonable consistency;
- `HIGH`: recurrent cross-session or cross-context evidence with limited contradiction;
- `VERY_HIGH`: strong repeated multimodal evidence and/or validated human/assessment confirmation.

Confidence should be computed from evidence quality, not learner nationality or corpus frequency.

## 8. Confidence factors

Confidence may increase with:

- repetition across sessions;
- independent spontaneous evidence;
- multiple task contexts;
- cross-modal corroboration;
- teacher/assessment validation;
- successful/failed retries that clarify the underlying state;
- recent evidence.

Confidence should decrease or remain limited with:

- one isolated event;
- ambiguous audio;
- heavy scaffolding;
- copied/repeated model language;
- conflicting successful performance;
- stale evidence;
- uncertain pattern classification.

## 9. Evidence weighting principles

Spontaneous independent production normally provides stronger evidence of productive control than repetition after a model. Failure after heavy task difficulty may be less diagnostic than repeated failure in familiar contexts.

A self-corrected error is not equivalent to an unrecognized error.

A correct answer after explicit correction is weaker mastery evidence than later spontaneous correct use.

## 10. Cause confidence

Mind must keep separate confidence for:

1. **feature state:** e.g. past `-ed` is unstable in spontaneous speech;
2. **cause hypothesis:** e.g. phonological transfer contributes to the instability.

Feature-state confidence may be high while cause confidence remains low.

## 11. Contradictory evidence

New successful evidence does not erase historical difficulty. Mind should update the current interpretation while preserving history.

Example:

- three failures across sessions;
- targeted practice;
- two successful prompted retries;
- three later spontaneous successes.

Interpretation may move from `R3_STABLE_RECURRING_PATTERN` to `R4_IMPROVING`, then later to `R5_NOT_RECENTLY_OBSERVED` or retained control after revalidation.

## 12. Forgetting and revalidation

Old mastery should decay in confidence when there is no recent retrieval evidence for an important feature. Do not reset the learner wholesale; request targeted revalidation.

## 13. Correction outcome evidence

Record, where useful:

- intervention type;
- whether learner noticed/understood;
- self-correction success;
- prompted retry success;
- number of attempts;
- later transfer;
- whether the same pattern recurred.

## 14. Minimum durable interpretation

A durable learner pattern should normally require more than one isolated low-impact event unless the event is high-confidence assessment/human evidence or a serious communication/pragmatic issue requiring immediate attention.

## 15. Population-to-learner firewall

Population pattern confidence and learner pattern confidence are separate variables. High population confidence can lower the cost of testing a hypothesis, but cannot raise learner-specific confidence without learner evidence.

## 16. Mind output example

```json
{
  "patternId": "DO-ENG-GRA-003",
  "skill": "speaking",
  "state": "UNSTABLE",
  "recurrence": "R2_REPEATED_ACROSS_SESSIONS",
  "confidence": "HIGH",
  "causeHypotheses": [
    {"type": "PHONOLOGICAL_TRANSFER", "confidence": "LOW"}
  ],
  "recommendedAction": "TARGETED_MICROPRACTICE",
  "needsRevalidation": false
}
```

## 17. Safety rule

Mind should prefer `UNCERTAIN` or `LOW` confidence over fabricated certainty. Ambiguity is a valid state.
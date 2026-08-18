# Mind Interpretation Contract v1

- Status: **Normative design baseline**
- Owner: Lurexa Mind; authorization and persistence remain governed by Lurexa Core
- Depends on: [Learning Evidence Contract v1](Learning%20Evidence%20Contract%20v1.md), [Learner Context Contract v1](Learner%20Context%20Contract%20v1.md)

## Purpose

Lurexa Mind converts authorized evidence and context into bounded learning interpretations: personalization guidance, recommendations, candidate learner-state observations, feedback plans and interventions.

Mind is not an independent system of record and must not bypass Core to access or persist learner data.

## Request contract

An interpretation request must declare:

- request ID and contract/model/prompt-policy versions;
- approved purpose and requesting capability;
- authorized evidence/context references or a Core-issued scoped context;
- learner and tenant boundary;
- requested interpretation type;
- required output format and validation rule;
- latency/cost tier where relevant.

Raw data should be minimized before it enters any provider call. Provider-specific payloads remain an implementation detail behind Mind.

## Permitted output types

| Output type | Example | Required treatment |
| --- | --- | --- |
| recommendation | “Practice /θ/ in short words next” | explanation, confidence, expiry |
| adaptation guidance | shorter prompts, familiar vocabulary, correction-load setting | scoped to experience/purpose |
| candidate observation | possible recurring consonant-substitution pattern | must be reviewable and persisted only through Core |
| feedback plan | concise feedback sequence for a speaking task | tied to task/objective |
| content selection/ranking | next activity options | explainable selection inputs |
| intervention suggestion | teacher check-in after repeated disengagement evidence | not an autonomous punitive action |

Mind must not return unsupported medical, psychological, legal, immigration, employment, or high-stakes educational determinations.

## Required output envelope

Every output includes `interpretationId`, `type`, `contractVersion`, `generatedAt`, `purpose`, `scope`, `result`, `confidence`, `evidenceBasis`, `limitations`, `expiry`, `modelPolicyVersion`, and `reviewStatus`.

`evidenceBasis` must identify evidence/observation references—not silently fabricate a rationale. The output should be usable even when a model provider is unavailable: callers receive a safe fallback or explicit unavailability state.

## Validation

Before use or persistence, Mind output must pass:

1. schema validation;
2. authorization and purpose validation;
3. policy/safety validation;
4. pedagogical guardrails appropriate to the capability;
5. confidence and evidence-basis checks;
6. provider/model observability capture without logging unnecessary learner content.

High-impact outputs require deterministic rules, human review, or both, as defined by policy. A generative model’s confidence wording alone is not sufficient evidence of reliability.

## Product integration rules

Products may consume an authorized result only within its scope, expiry and purpose. They must not turn one temporary recommendation into a permanent private learner profile. Product UIs must not call model providers directly for persistent learning intelligence.

Coach feedback should prioritize intelligibility, communicative usefulness, and learner confidence. It must not frame non-native accent elimination as the objective.

## Evaluation

Each interpretation type needs a representative evaluation set, quality rubric, safety cases, failure thresholds, monitoring fields, and owner before production-critical rollout. Dominican Spanish learner examples must be represented when evaluating Coach’s initial linguistic specialization.

## Non-goals

This contract does not prescribe a single LLM, speech provider, prompt, vector store, or model architecture. It defines the system boundary that all such implementations must respect.

# Lurexa Linguistic Intelligence — Implementation Handoff

Status: Shared implementation foundation — v0.1

## 1. Purpose

This document tells implementation teams how to translate the pedagogical authority in this folder into Lurexa Mind and Coach without collapsing population knowledge, learner evidence, and runtime behavior.

## 2. Source-of-truth order

Implementation should treat these files as the pedagogical authority, in order:

1. `00-LINGUISTIC-INTELLIGENCE-OVERVIEW.md`
2. `01-ERROR-TAXONOMY.md`
3. `02-DOMINICAN-ENGLISH-ERROR-CORPUS.md`
4. `03-DOMINICAN-SPANISH-TRANSFER-CATALOG.md`
5. `04-CORRECTION-AND-FEEDBACK-POLICY.md`
6. `05-PRONUNCIATION-INTELLIGIBILITY-POLICY.md`
7. `06-EVIDENCE-CONFIDENCE-MODEL.md`
8. `07-LEARNER-CONTEXT-CONTRACT.md`
9. `08-COACH-INTERVENTION-RULES.md`

The JSON schemas in `data/` are implementation-facing representations of these policies, not a replacement for them.

## 3. Recommended component boundaries

### Lurexa Core
Owns identity, authorization, trusted persistence, data retention, and authoritative learner records.

### Lurexa Mind
Owns pedagogical interpretation:

- map observations to taxonomy/corpus patterns;
- aggregate recurrence;
- estimate confidence;
- maintain modality-specific feature state;
- select active patterns/targets;
- construct the learner-context contract;
- interpret Coach evidence returned after sessions.

### Lurexa Coach
Owns interaction behavior:

- consume scoped learner context;
- classify candidate observations provisionally;
- apply intervention rules;
- protect fluency and correction dosage;
- return structured evidence;
- never directly own authoritative learner state.

## 4. MVP implementation sequence

### Step A — Types and validation

Typed contracts now exist in `packages/types/src/linguistic-intelligence.ts` and are exported through `@lurexa/types`.

Schema assets:

- `data/dominican-error-corpus.schema.json`
- `data/dominican-error-corpus.collection.schema.json`
- `data/learner-context.schema.json`
- `data/linguistic-evidence-event.schema.json`

### Step B — Corpus loader

A versioned population seed now exists at:

- `data/dominican-error-corpus.v0.1.json`

Read-only catalog access is represented by:

- `packages/backend/src/dominican-corpus-catalog.service.ts`

Runtime code should inject a validated source into this catalog rather than importing corpus JSON throughout product code.

### Step C — Learner evidence ingestion

The existing Core boundary remains authoritative:

- `packages/backend/src/learner-model.service.ts`

Coach linguistic observations are mapped into the existing `LearningEvidence` contract by:

- `packages/backend/src/coach-linguistic-adapter.service.ts`

### Step D — Pattern aggregator

Implemented in:

- `packages/backend/src/linguistic-pattern-aggregator.service.ts`

It aggregates learner-specific recurrence, session spread, self-correction, retry success, spontaneous later success, and provisional confidence without replacing raw evidence.

### Step E — Confidence/state interpreter

The aggregator currently implements a conservative v0.1 recurrence/confidence heuristic. These thresholds are provisional and must be recalibrated once real Lurexa learner evidence exists.

Population frequency and nationality are not inputs to learner confidence.

### Step F — Context builder

Implemented in:

- `packages/backend/src/coach-linguistic-adapter.service.ts`

It minimizes generic Learner Model context into Coach-relevant grammar, vocabulary, pronunciation, fluency, targets, CEFR, and optional L1 profile information.

### Step G — Coach intervention resolver

Implemented in:

- `packages/backend/src/linguistic-intelligence.service.ts`

The resolver constrains intervention class, timing, priority, retry behavior, and evidence creation according to communication breakdown, task mode, CEFR, target status, recurrence, self-correction, intelligibility risk, pragmatics risk, and acceptable variation.

### Step H — Evidence return loop

Implemented as a shared orchestration boundary in:

- `packages/backend/src/coach-linguistic-pipeline.service.ts`

The pipeline:

1. requests authorized learner context through `LearnerModelService`;
2. minimizes it for Coach;
3. resolves intervention behavior;
4. creates structured linguistic evidence;
5. submits that evidence back through the same Core-owned learner-model boundary.

## 5. Runtime shape

```text
Core-authorized learner data
        ↓
CoachLinguisticPipelineService.prepareSession()
        ↓
CoachLinguisticAdapterService
        ↓
CoachLinguisticContext
        ↓
Coach session/runtime
        ↓
LinguisticIntelligenceService.decideIntervention()
        ↓
Coach feedback / retry / continuation
        ↓
CoachLinguisticPipelineService.recordObservation()
        ↓
LearningEvidence
        ↓
LearnerModelService.submitEvidence()
        ↓
Core persistence
        ↓
Mind aggregation / future interpretation
```

## 6. Pattern matching strategy

For MVP, pattern detection should be conservative:

- exact/high-confidence rules for simple structural patterns where feasible;
- model-assisted classification for open-ended language;
- confidence/reliability metadata on model classifications;
- unclassified evidence when no responsible pattern match exists;
- human/teacher review path for uncertain high-impact cases.

Do not force every utterance into an existing corpus ID.

## 7. Prompt/context rule

Do not paste the full corpus into every Coach prompt. Mind should select only relevant pattern definitions and intervention guidance for the active session.

The full corpus belongs in population knowledge; the context contract belongs in runtime state.

## 8. Versioning

Version separately:

- taxonomy version;
- corpus version;
- learner-context contract version;
- intervention policy version.

Evidence events should record the relevant interpretation/policy version where implementation makes this practical.

## 9. Observability

Track at minimum:

- corrections per session and per minute/turn;
- immediate vs delayed correction frequency;
- learner retry success;
- self-correction rate;
- recurrence after intervention;
- spontaneous later success;
- false-positive pattern classifications;
- learner/teacher overrides;
- communication breakdowns;
- context payload size and active-pattern count.

## 10. Evaluation cases

Behavioral fixtures now exist in:

- `examples/coach-intervention-cases.json`

They cover A1 current-target correction, B1 delayed recurring feedback, self-correction, communication breakdown, acceptable pronunciation variation, B2 self-repair, pronunciation intelligibility risk, and low-value fluency errors.

These fixtures should become automated tests when the repository standardizes a test runner for this package.

## 11. Human calibration still required

These areas require future human evidence rather than invention:

- additional real Dominican transfer examples, especially pragmatics/natural expressions;
- frequency estimates grounded in more than one teacher;
- external research validation for population-transfer claims;
- learner-corpus thresholds for recurrence/confidence;
- teacher-reviewed edge cases for World Englishes/acceptable variation;
- product UX decisions for how learners choose correction preferences.

These are calibration tasks, not blockers for the shared implementation foundation.

## 12. Definition of done for the pedagogical workstream

Completed:

- three-layer linguistic-intelligence authority;
- taxonomy;
- initial Dominican corpus;
- transfer catalog;
- correction policy;
- pronunciation policy;
- evidence/confidence model;
- learner-context contract;
- Coach intervention rules;
- machine-readable schemas;
- versioned machine-readable corpus seed;
- sample payloads and intervention fixtures;
- shared TypeScript contracts;
- shared context/evidence adapter;
- Mind-side intervention resolver;
- learner-pattern aggregator;
- Core-bound Coach linguistic pipeline;
- implementation handoff.

## 13. Current repository boundary

As of 2026-08-18, the repository does not contain a dedicated `apps/coach` application/runtime. Therefore the shared linguistic-intelligence implementation is available, but there is no end-user Coach session runtime in this repository to wire it into yet.

Do not create a placeholder Coach product merely to claim integration. When the actual Coach runtime is introduced, it should consume these shared services rather than duplicate them.

## 14. Remaining product-runtime work

When a real Coach runtime exists, the next engineering tasks are:

1. call `prepareSession()` at session initialization;
2. expose only the minimized `CoachLinguisticContext` to the conversation/model layer;
3. classify candidate learner observations conservatively;
4. call `decide()` before interrupting or correcting;
5. honor the returned timing/action rather than letting the language model invent correction policy;
6. call `recordObservation()` after meaningful observations/corrections;
7. implement telemetry for intervention dosage and outcomes;
8. run the intervention fixtures as automated behavioral tests;
9. validate the full corpus seed against its collection schema in CI;
10. calibrate recurrence/confidence thresholds against real learner evidence.

Until that runtime exists, this is the correct stopping boundary: the shared architecture and implementation contracts are complete without inventing a product shell.
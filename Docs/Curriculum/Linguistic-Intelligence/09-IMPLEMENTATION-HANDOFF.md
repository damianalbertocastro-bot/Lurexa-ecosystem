# Lurexa Linguistic Intelligence — Implementation Handoff

Status: Developer handoff — v0.1

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

Implement typed models matching:

- `data/dominican-error-corpus.schema.json`
- `data/learner-context.schema.json`
- `data/linguistic-evidence-event.schema.json`

Validate sample payloads during CI.

### Step B — Corpus loader

Load normalized corpus patterns as population knowledge. Corpus records must remain read-only to Coach at runtime except through versioned content updates.

### Step C — Learner evidence ingestion

Create an ingestion pathway for Coach/Learn/teacher evidence. Store raw evidence separately from Mind interpretations.

### Step D — Pattern aggregator

For each learner and pattern/modality, aggregate recurrence, recency, successful repair, spontaneous success, and contradictory evidence.

### Step E — Confidence/state interpreter

Implement the states and confidence rules in `06-EVIDENCE-CONFIDENCE-MODEL.md`. Avoid hardcoding nationality or population frequency into learner confidence.

### Step F — Context builder

Construct the bounded context defined in `07-LEARNER-CONTEXT-CONTRACT.md`. Return only session-relevant active patterns and targets.

### Step G — Coach intervention resolver

Implement `08-COACH-INTERVENTION-RULES.md` as a decision layer above model generation. The model may phrase feedback naturally, but timing, dosage, and allowed intervention classes should be constrained by policy.

### Step H — Evidence return loop

After meaningful Coach interactions, emit `linguistic-evidence-event` records. Mind updates interpretations asynchronously within the product architecture, while Coach continues from the context it was given.

## 5. Recommended runtime shape

```text
Core-authorized learner data
        ↓
Mind evidence interpreter
        ↓
Mind context builder
        ↓
Learner Context Contract
        ↓
Coach session
        ↓
Intervention resolver + conversation model
        ↓
Linguistic Evidence Events
        ↓
Mind ingestion / interpretation
        ↓
Updated learner model
```

## 6. Pattern matching strategy

For MVP, pattern detection should be conservative:

- exact/high-confidence rules for simple structural patterns where feasible;
- model-assisted classification for open-ended language;
- confidence/reliability metadata on model classifications;
- `UNCLASSIFIED` evidence when no responsible pattern match exists;
- human/teacher review path for uncertain high-impact cases.

Do not force every utterance into an existing corpus ID.

## 7. Prompt/context rule

Do not paste the full corpus into every Coach prompt. Mind should select only relevant pattern definitions and intervention guidance for the active session.

The full corpus belongs in retrieval/population knowledge; the context contract belongs in the runtime prompt/tool state.

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

Build automated behavioral tests for cases such as:

1. A1 learner says `I have 25 years old` in guided conversation — one short priority correction, then continue.
2. B1 learner tells a story with several errors — do not interrupt every error; select high-value feedback afterward.
3. B1 learner self-corrects `students confuses... students confuse` — record positive repair; do not lecture.
4. `watched` ending is inaudible — preserve grammar/pronunciation ambiguity rather than asserting one cause.
5. Dominican L1 profile exists but learner has no TH evidence — do not create an active TH weakness.
6. B2 learner repeatedly uses basic vocabulary despite receptive evidence — prompt retrieval rather than teaching random new synonyms.
7. Pronunciation difference is intelligible acceptable variation — no correction.
8. Communication breaks down — immediate clarification overrides fluency delay.

## 11. Human calibration still required

The system is implementation-ready as a v0.1 specification, but these areas require future human evidence rather than invention:

- additional real Dominican transfer examples, especially pragmatics/natural expressions;
- frequency estimates grounded in more than one teacher;
- external research validation for population-transfer claims;
- learner-corpus thresholds for recurrence/confidence;
- teacher-reviewed edge cases for World Englishes/acceptable variation;
- product UX decisions for how learners choose correction preferences.

These are calibration tasks, not blockers for an MVP implementation.

## 12. Definition of done for this pedagogical workstream

The initial workstream is complete when the repository contains:

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
- sample payloads;
- implementation handoff.

Further work should be treated as evidence expansion, validation, and versioned refinement rather than redesigning the foundation.
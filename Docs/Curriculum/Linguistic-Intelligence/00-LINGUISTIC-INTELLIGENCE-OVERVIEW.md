# Lurexa Linguistic Intelligence Overview

Status: Foundational pedagogical authority — v0.2  
Applies to: Lurexa Mind, Lurexa Coach, Lurexa Learn, Lurexa Teach  
Depends on: `Docs/Curriculum/05-LEARNER-MODEL-EDUCATIONAL-SPEC.md`, `Docs/Curriculum/06-DOMINICAN-SPANISH-ENGLISH-LINGUISTIC-PROFILE.md`, `Docs/Curriculum/08-CONVERSATION-FRAMEWORK.md`

## 1. Purpose

This document defines how Lurexa organizes linguistic intelligence so population-level language knowledge, individual learner evidence, and AI coaching behavior remain distinct but interoperable.

> **Population knowledge generates hypotheses. Learner evidence generates personalization.**

Lurexa must never convert a group-level tendency into an individual learner fact without learner-specific evidence.

## 2. Three-layer model

### Layer 1 — Population Knowledge

Stores patterns that may help Lurexa decide what to monitor or test: possible Spanish/Dominican Spanish transfer, recurring classroom forms, pronunciation contrasts, pragmatic contrasts, and researched patterns.

Population knowledge answers: **What should Lurexa pay attention to?** It does not answer what an individual learner definitely does.

### Layer 2 — Learner Evidence

Represents what an individual learner actually produced, understood, repaired, improved, retained, or repeatedly struggled with across Learn, Coach, pronunciation tasks, assessments, and teacher observations.

Evidence remains separate from Mind interpretation.

Example:

- Evidence: learner produced `I have 24 years` in two conversations.
- Interpretation: age expressions with English `be` may be unstable in spontaneous production.

Individual evidence overrides population assumptions.

### Layer 3 — Coach Behavior

Determines what Coach should do with relevant authorized context: continue, recast, elicit self-correction, correct explicitly, explain briefly, retry, delay feedback, schedule review, or observe without correcting.

Behavior depends on impact, task, level, recurrence, learner history, self-repair, and interruption cost—not merely whether a form differs from a preferred target.

## 3. Shared classification foundation

The three layers use the **Lurexa English Error Taxonomy**. The taxonomy is not a fourth layer; it is the shared vocabulary connecting population patterns, learner evidence, Mind interpretation, and Coach intervention.

## 4. Data integrity rules

Lurexa must preserve these distinctions:

1. observed form vs inferred cause;
2. population tendency vs learner fact;
3. error vs acceptable variation;
4. error vs naturalness/register/pragmatics;
5. evidence vs interpretation;
6. one occurrence vs recurring pattern;
7. accuracy need vs immediate correction need;
8. receptive recognition vs productive control;
9. grammar knowledge vs spoken realization when morphology is inaudible.

## 5. Canonical asset map

```text
Docs/Curriculum/Linguistic-Intelligence/
├── 00-LINGUISTIC-INTELLIGENCE-OVERVIEW.md
├── 01-ERROR-TAXONOMY.md
├── 02-DOMINICAN-ENGLISH-ERROR-CORPUS.md
├── 03-DOMINICAN-SPANISH-TRANSFER-CATALOG.md
├── 04-CORRECTION-AND-FEEDBACK-POLICY.md
├── 05-PRONUNCIATION-INTELLIGIBILITY-POLICY.md
├── 06-EVIDENCE-CONFIDENCE-MODEL.md
├── 07-LEARNER-CONTEXT-CONTRACT.md
├── 08-COACH-INTERVENTION-RULES.md
├── 09-IMPLEMENTATION-HANDOFF.md
├── data/
│   ├── dominican-error-corpus.schema.json
│   ├── learner-context.schema.json
│   └── linguistic-evidence-event.schema.json
└── examples/
    ├── dominican-error-corpus.sample.json
    ├── coach-context.sample.json
    └── linguistic-evidence-event.sample.json
```

The Markdown files are the pedagogical authority. Schemas are implementation-facing representations and must evolve with versioned policy changes.

## 6. Completed build sequence

The v0.1/v0.2 foundation now covers:

1. three-layer architecture;
2. error taxonomy;
3. normalized teacher-observed Dominican English corpus;
4. population-transfer catalog;
5. correction philosophy by level/task;
6. pronunciation/intelligibility policy;
7. evidence strength, recurrence, learner control, and confidence;
8. learner-context contract from Mind to Coach;
9. Coach intervention decision rules;
10. machine-readable schemas and sample payloads;
11. implementation handoff and evaluation cases.

## 7. Product boundary

Lurexa Mind interprets authorized learning evidence, maintains pedagogical state/priority, and constructs context. Lurexa Core remains responsible for trusted persistence, authorization, identity, and authoritative learner records. Lurexa Coach consumes scoped context and returns new evidence; it must not maintain a competing authoritative learner profile.

## 8. Runtime learning loop

```text
population hypothesis
→ learner observation
→ structured evidence
→ recurrence/confidence interpretation
→ learner-specific state
→ scoped context
→ context-aware intervention
→ retry / later spontaneous use
→ new evidence
→ updated Mind interpretation
```

## 9. Population-to-learner firewall

A strong population pattern may justify testing a hypothesis sooner. It must not increase learner-specific confidence without individual evidence.

Example: the presence of `es-DO` as an L1 variety may make TH perception a reasonable diagnostic candidate; it must not automatically create an active TH weakness.

## 10. Pronunciation boundary

Pronunciation targets intelligibility, perception, lexical/grammatical distinction, stress, rhythm, connected speech, rhetorical effectiveness, and learner goals. Lurexa must not treat ordinary Dominican/Caribbean or other World Englishes variation as an error solely because it differs from one prestige accent.

## 11. Correction boundary

Coach corrects according to learning value, not detector density. Fluency tasks default toward delayed selective feedback; controlled accuracy tasks may use immediate repeated correction. Communication breakdown may override normal delay rules.

## 12. Context minimization

Mind should not send the full learner history or full Dominican corpus into each Coach session. It should send the smallest current context that can change the experience appropriately: current targets, relevant recurring patterns, skill level, session mode, strengths, recent interventions, and bounded correction guidance.

## 13. Evidence expansion strategy

The current corpus is deliberately teacher-observed and conservative. Future versions should add:

- additional real Dominican classroom examples;
- multi-teacher frequency evidence;
- Lurexa learner-corpus evidence;
- external SLA/linguistics validation;
- more natural-expression, pragmatics, discourse, and listening examples;
- calibrated recurrence/confidence thresholds.

These are evidence upgrades, not reasons to collapse the current architecture.

## 14. Success criterion

The system succeeds when it can reliably move from population knowledge to individualized evidence-backed intervention without stereotyping, overcorrecting, losing provenance, or confusing recognition with productive mastery.
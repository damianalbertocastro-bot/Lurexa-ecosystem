# Lurexa Linguistic Intelligence Overview

Status: Foundational pedagogical authority  
Applies to: Lurexa Mind, Lurexa Coach, Lurexa Learn, Lurexa Teach  
Depends on: `Docs/Curriculum/05-LEARNER-MODEL-EDUCATIONAL-SPEC.md`, `Docs/Curriculum/06-DOMINICAN-SPANISH-ENGLISH-LINGUISTIC-PROFILE.md`, `Docs/Curriculum/08-CONVERSATION-FRAMEWORK.md`

## 1. Purpose

This document defines how Lurexa organizes linguistic intelligence so population-level language knowledge, individual learner evidence, and AI coaching behavior remain distinct but interoperable.

The governing principle is:

> **Population knowledge generates hypotheses. Learner evidence generates personalization.**

Lurexa must never convert a group-level tendency into an individual learner fact without learner-specific evidence.

## 2. Three-layer model

Lurexa Linguistic Intelligence is organized into three operational layers.

### Layer 1 — Population Knowledge

Population Knowledge stores patterns that may be useful when teaching or analyzing learners from a language background or speech community.

Examples include:

- possible Spanish-to-English grammar transfer patterns;
- possible Dominican Spanish-to-English phonological transfer patterns;
- recurring lexical calques;
- likely pragmatic contrasts;
- pronunciation contrasts worth monitoring;
- teacher-observed recurring learner forms;
- externally researched linguistic patterns.

Population knowledge is **hypothesis-generating**, not deterministic.

It may answer:

> What should Lurexa pay attention to?

It must not answer:

> What does this individual learner definitely do?

### Layer 2 — Learner Evidence

Learner Evidence represents what an individual learner actually produced, understood, repaired, improved, retained, or repeatedly struggled with.

Evidence may come from:

- Lurexa Learn activities;
- Lurexa Coach conversations;
- pronunciation tasks;
- teacher observations;
- assessments;
- learner retries;
- later successful transfer.

Learner evidence must remain distinguishable from Mind's interpretation of that evidence.

Examples:

**Evidence:** learner produced `I have 24 years` in two conversations.  
**Interpretation:** age expressions with English `be` may not yet be stable in spontaneous production.

Individual evidence always overrides population-level assumptions.

### Layer 3 — Coach Behavior

Coach Behavior determines what Lurexa Coach should do with relevant authorized learner context.

Possible actions include:

- allow the utterance and continue;
- recast naturally;
- prompt self-correction;
- provide an explicit correction;
- give a short explanation;
- request repetition or retry;
- delay feedback until the end of a segment;
- schedule targeted future practice;
- remember the observation without correcting it now.

Coach behavior must depend on more than whether an utterance differs from a preferred target form.

Relevant factors include:

- communicative breakdown;
- intelligibility impact;
- current task goal;
- CEFR level;
- recurrence;
- current curriculum target;
- learner history;
- whether the learner can self-repair;
- whether interruption would damage productive fluency;
- pragmatic or social impact.

## 3. Shared classification foundation

The three layers use a common classification foundation: the **Lurexa English Error Taxonomy**.

The taxonomy is not a fourth layer. It is the shared vocabulary that allows Population Knowledge, Learner Evidence, and Coach Behavior to refer to the same linguistic feature consistently.

Example:

```text
Population knowledge:
Potential Spanish transfer involving age expressions.

Taxonomy feature:
GRAMMAR > COPULARITY_AND_POSSESSION > AGE_EXPRESSION_BE

Learner evidence:
Learner produced "I have 24 years" three times.

Mind interpretation:
Spontaneous control of AGE_EXPRESSION_BE is unstable.

Coach behavior:
Prompt self-correction during guided A2 practice; delay correction during fluency work unless recurrent in the same session.
```

## 4. Data integrity rules

Lurexa must preserve the following distinctions:

1. **Observed form vs inferred cause** — what happened is not the same as why it happened.
2. **Population tendency vs learner fact** — language background may guide observation but cannot establish learner state.
3. **Error vs variation** — not every non-native or non-preferred form is a pedagogical error.
4. **Error vs naturalness** — an utterance can be grammatical but uncommon, awkward, overly literal, or register-inappropriate.
5. **Evidence vs interpretation** — raw learning events must not be overwritten by Mind conclusions.
6. **One occurrence vs recurring pattern** — recurrence raises confidence; a single event should rarely create a durable learner label.
7. **Accuracy need vs correction need** — Lurexa may remember an error without interrupting the learner.

## 5. Primary assets

The Linguistic Intelligence documentation set is planned as:

```text
Docs/Curriculum/Linguistic-Intelligence/
├── 00-LINGUISTIC-INTELLIGENCE-OVERVIEW.md
├── 01-ERROR-TAXONOMY.md
├── 02-DOMINICAN-ENGLISH-ERROR-CORPUS.md
├── 03-DOMINICAN-SPANISH-TRANSFER-CATALOG.md
├── 04-CORRECTION-PHILOSOPHY.md
├── 05-PRONUNCIATION-INTELLIGIBILITY-POLICY.md
├── 06-EVIDENCE-CONFIDENCE-MODEL.md
├── 07-LEARNER-CONTEXT-CONTRACT.md
└── 08-COACH-INTERVENTION-RULES.md
```

Machine-readable schemas and implementation contracts should be created only after the pedagogical model is sufficiently stable.

## 6. Build order

Recommended sequence:

1. establish the error taxonomy;
2. collect and normalize teacher observations;
3. build the Dominican English error corpus;
4. distinguish Dominican-specific, general Spanish-transfer, and general developmental patterns;
5. define correction philosophy by proficiency level and task type;
6. define pronunciation and intelligibility policy;
7. define evidence strength and recurrence rules;
8. define the learner-context contract;
9. define Coach intervention rules;
10. implement machine-readable schemas and product integration.

## 7. Product boundary

Lurexa Mind interprets authorized learning evidence and recommends adaptive action. Lurexa Core remains responsible for trusted persistence, authorization, and authoritative learner records. Lurexa Coach consumes relevant context and produces new evidence; it must not maintain a competing independent learner profile.

## 8. Success criterion

The system succeeds when Lurexa can move reliably from:

```text
population hypothesis
→ learner observation
→ recurring evidence
→ learner-specific interpretation
→ context-aware intervention
→ retry or future practice
→ new evidence
→ updated learner understanding
```

without stereotyping learners, overcorrecting normal variation, or losing the provenance of the original evidence.

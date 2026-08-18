# Lurexa Coach Intervention Rules

Status: Behavioral specification — v0.1  
Applies to: Lurexa Coach runtime behavior  
Depends on: Error Taxonomy, Corpus, Transfer Catalog, Correction Policy, Pronunciation Policy, Evidence Model, Learner Context Contract

## 1. Purpose

This file converts Lurexa's linguistic-intelligence policies into a deterministic decision order Coach can follow during learner interaction.

## 2. Governing rule

> **Coach should optimize for communication, learning value, and future evidence—not maximum correction density.**

## 3. Inputs

For each relevant learner utterance/behavior, Coach considers:

- session mode and goal;
- skill-specific level;
- current targets;
- observed linguistic feature(s);
- communicative impact;
- actual breakdown;
- active recurring learner patterns;
- confidence/recurrence;
- recent intervention history;
- self-correction;
- whether the learner requested correction;
- available population/L1 hypotheses, used only as hypotheses.

## 4. Decision order

### Rule 1 — Communication breakdown

If meaning is unclear or interaction cannot proceed:

1. request clarification or repair;
2. give the minimum correction/model needed;
3. resume communication;
4. record the breakdown and outcome.

This may override fluency-protection defaults.

### Rule 2 — Self-correction

If the learner independently repairs the error:

- do not repeat the correction unnecessarily;
- recognize the repair only if useful;
- record positive self-correction evidence;
- continue unless the current task requires explicit analysis.

### Rule 3 — Exact current target

If the feature is the exact controlled-practice target, correct or elicit repair promptly. If the task is guided conversation, normally wait until the learner finishes the thought unless the target error prevents understanding.

### Rule 4 — Recurring/high-value pattern

If the feature is a high-confidence recurring pattern relevant to the learner's level/session, select it for intervention according to timing rules.

### Rule 5 — Isolated low-impact event

Normally monitor rather than correct during communication. Do not create a durable learner weakness from the single event.

### Rule 6 — Acceptable variation

Do not correct. Accent difference alone is not an intervention trigger.

## 5. Timing resolver

Use this priority:

1. `IMMEDIATE` — breakdown, serious intelligibility/pragmatic impact, controlled target, explicit immediate-correction request.
2. `AFTER_TURN` — guided practice/conversation, meaningful target, likely self-repair.
3. `AFTER_SEGMENT` — B1+ guided/sustained production with one or two priority features.
4. `AFTER_TASK` — fluency conversation/free production.
5. `MONITOR_ONLY` — low-value, isolated, acceptable variation, overcorrection risk.

## 6. Intervention selector

### `CLARIFICATION_REQUEST`
Use when meaning is unclear and the learner may repair without being given the answer.

### `RECAST`
Use when meaning is clear, the preferred form can be modeled naturally, and explicit interruption offers little added value.

### `ELICIT_SELF_CORRECTION`
Use when learner evidence suggests they know the target and can likely retrieve/repair it. Preferred increasingly from A2 upward.

### `EXPLICIT_CORRECTION`
Use when the learner lacks the form, repeated elicitation fails, the target is foundational, or immediate clarity is needed.

### `BRIEF_EXPLANATION`
Use only when the distinction is not obvious from the model or the learner asks why. Keep explanation proportional to level.

### `MODEL_AND_REPEAT`
Preferred for A1 and pronunciation-focused work when imitation is pedagogically useful.

### `RETRY_SEGMENT`
Use after correction when immediate productive reuse will strengthen retrieval.

### `TARGETED_MICROPRACTICE`
Use for recurrent B1+ patterns or pronunciation features that are not changing through repeated ordinary correction.

### `SCHEDULE_REVIEW`
Recommend to Mind when the feature needs future retrieval/revalidation rather than more correction in the current session.

## 7. Level resolver

### A1
Prefer model, recast, one-step retry. Minimal terminology. Normally one priority issue at a time.

### A2
Prefer elicited repair when likely, short contrast explanations, and one or two priorities per segment.

### B1
Delay ordinary corrections during fluent production. Diagnose knowledge versus retrieval. Use post-segment retry and micropractice.

### B2
Expect greater control. Address persistent grammar, lexical range, collocation, register, and important pronunciation patterns selectively.

### C1-C2
Prioritize precision, nuance, productive lexical sophistication, rhetoric, discourse, register, and communicatively meaningful pronunciation. Avoid low-value basic correction unless persistent.

## 8. Multi-error utterance rule

One utterance may generate several observations. Coach should classify them separately but intervene on only the highest-value subset allowed by task/level dosage.

Example: `I watch TV yesterday night.` may contain:

- past morphology/pronunciation ambiguity;
- natural-expression issue (`last night` preferred in the intended meaning).

In A2 guided conversation, Coach may prioritize the past form and leave naturalness for later.

## 9. Grammar/pronunciation ambiguity

If a final grammatical marker is inaudible, do not immediately conclude a grammar knowledge gap. If uncertainty matters, collect diagnostic evidence through recognition, writing, repetition, or later production.

## 10. Translation/L1 fallback

If Spanish-like structure appears:

- correct the English target form;
- use an L1 contrast only when it genuinely clarifies;
- encourage retrieval of English chunks/frames;
- do not tell learners simply to `stop thinking in Spanish`;
- record transfer as a cause hypothesis only when evidence supports it.

## 11. Vocabulary plateau rule

If richer vocabulary is already recognized but not produced:

1. prompt retrieval;
2. give a semantic/initial cue if needed;
3. ask for reformulation;
4. reuse in a different context;
5. record later spontaneous use.

Do not automatically teach another synonym.

## 12. Advanced grammar retrieval rule

If B1+ learners know a structure in recognition/controlled work but avoid or misuse it spontaneously, treat `automaticity/retrieval failure` as a candidate state. Prefer targeted production and reformulation before a full rule explanation.

## 13. Pronunciation rule

During general conversation, intervene when pronunciation affects intelligibility, lexical/grammatical distinction, the current target, a stable learner priority, or explicit learner goals. During pronunciation-focus mode, repeated immediate feedback on the target is allowed.

## 14. Correction cooldown

If Coach has recently corrected the same low/moderate-impact pattern multiple times and retries have succeeded, reduce immediate repetition. Collect evidence and schedule later spontaneous testing instead.

Cooldown is overridden by breakdown, active accuracy target, or serious pragmatic consequence.

## 15. Learner-requested correction modes

Where supported, user preference may tune timing/dosage within pedagogical boundaries, e.g. `correct me immediately` or `let me finish first`. It should not force Coach to ignore communication-critical errors or invalidate assessment rules.

## 16. Evidence return

For significant observations/interventions, return structured evidence including:

- pattern ID or unclassified observation;
- modality/task;
- raw/normalized form where appropriate;
- impact;
- action;
- retry/self-correction result;
- spontaneous success;
- reliability;
- timestamp/session source.

Coach never directly promotes learner recurrence/confidence state; Mind interprets evidence.

## 17. Runtime pseudologic

```text
observe utterance
  ↓
classify candidate features
  ↓
if self-corrected → record repair; usually continue
  ↓
if breakdown → clarify/correct now
  ↓
rank remaining features by:
  target relevance + learner recurrence + impact + level relevance
  ↓
apply task-mode timing
  ↓
apply level feedback cap
  ↓
choose least intrusive effective intervention
  ↓
request retry if useful
  ↓
resume communication
  ↓
return evidence to Mind
```

## 18. Non-negotiable prohibitions

Coach must not:

- infer an individual weakness solely from Dominican/Spanish background;
- correct acceptable accent variation as an error;
- dump every detected error after each turn;
- claim a transfer cause with certainty from one utterance;
- equate recognition with productive mastery;
- maintain an independent authoritative learner profile;
- repeatedly reteach a rule when evidence points primarily to retrieval failure.

## 19. MVP acceptance criteria

An MVP implementation passes this behavioral spec if it can:

1. prioritize and time corrections by task/level;
2. protect fluency;
3. use active pattern context without stereotyping;
4. treat self-correction positively;
5. resolve or preserve grammar/pronunciation ambiguity;
6. cap feedback quantity;
7. support retrieval-focused vocabulary/grammar practice;
8. return structured evidence to Mind.
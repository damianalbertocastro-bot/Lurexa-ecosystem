# A1 Pilot Engineering Readiness and Closure

Status: Active A1 pilot closure authority
Applies to: English A1 production reference, Module 1 vertical slice, Modules 2–8 production objects and `My Life, My English`

## 1. Purpose

This document distinguishes two milestones that must not be conflated:

1. **Engineering/pedagogical pilot readiness** — the repository can run the intended A1 learning loop without known critical architecture shortcuts.
2. **Representative pilot validation** — real learners have used the loop and the resulting evidence supports calibration and release decisions.

Lurexa may reach pilot readiness through repository work. It cannot claim representative pilot validation without representative learner evidence.

## 2. Engineering readiness state — 2026-08-21

### Implemented

- canonical structured `LessonRuntime`;
- trusted progress/resume;
- server-scored structured activities;
- real model-listening/TTS path;
- listening-completion evidence captured only after audio playback ends;
- recorded-speaking evidence persisted to trusted storage;
- AI roleplay through the trusted server-side tutor pathway;
- minimum roleplay-turn evidence;
- required advanced capability completion gate before lesson completion;
- first-attempt/retry history for structured activities;
- delayed retrieval scheduling/completion;
- Mind next-action integration;
- teacher intervention and learner-return guidance;
- A1 Modules 2–8 represented as trusted production `Course/Module/Lesson/ContentBlock` objects;
- production-object validation for module/lesson/capability identity and evidence requirements;
- A1 integrated capstone shared contracts;
- `My Life, My English` runtime route and three project-part lesson IDs;
- server-side A1 capstone evidence aggregator;
- capstone evaluation distinguishes raw evidence from qualified evidence;
- targeted revalidation rather than forced full-level repetition;
- authorized teacher capstone-review candidates;
- private spoken-evidence playback for authorized capstone reviewers;
- private AI-roleplay transcript access for authorized capstone reviewers;
- requirement-specific `meets` / `not_yet` / `inconclusive` teacher validation;
- teacher validation stored as new provenance-bearing evidence without mutating the learner artifact.

## 3. Important evidence semantics now enforced

### Lesson completion

Lesson completion may require evidence that a required activity was performed:

- model listening: full playback completed and trusted exposure event stored;
- recorded speaking: recording stored;
- AI roleplay: minimum learner turns reached;
- structured required activities/quizzes: existing progress attempt rules.

This is a **participation/completion** rule, not a mastery rule.

### A1 exit readiness

`My Life, My English` is stricter.

The following do **not** by themselves establish A1 competence:

- opening an audio player;
- finishing audio playback;
- recording speech;
- submitting free writing;
- completing minimum AI-roleplay turns;
- finishing every lesson.

A1 readiness requires qualified independent evidence appropriate to the competency. Objective scored performance may qualify when the task validly measures the target. Productive/interactive/pronunciation evidence requires interpretation or validation before it can support a strong exit decision.

Teacher review is now supported without weakening privacy: general learner-model evidence remains transcript/audio-light, while authorized capstone reviewers can explicitly load the source artifact. A teacher judgment only qualifies evidence when the recorded outcome is `meets`; `not_yet` and `inconclusive` remain useful evidence but cannot satisfy the requirement.

## 4. Current production-object state

A1 onboarding preserves the tested onboarding/placement flow and, for A1 learners, provisions the full production course structure after onboarding.

Modules 2–8 currently contain **44 trusted lesson objects** across:

- Module 2 — My World in Numbers;
- Module 3 — The People Around Me;
- Module 4 — My Everyday Life;
- Module 5 — Food, Flavor and Everyday Choices;
- Module 6 — My Neighborhood;
- Module 7 — What I Like;
- Module 8 — Life in Action.

Each production lesson currently requires:

1. a mission/context block;
2. real model listening;
3. recorded speaking or AI roleplay;
4. learner-created Create & Apply evidence.

These objects are the first production conversion of the blueprints. They still require content/pilot calibration before A1 can be commercially represented as complete.

## 5. `My Life, My English` runtime

The A1 capstone uses three runtime parts:

### Part 1 — My A1 Portfolio

Lesson: `a1-m8-u3-l1-my-life-in-english`

Purpose: combine selected evidence from identity, people, routines, preferences and practical communication; include reflection and written/presentational evidence.

### Part 2 — A1 Conversation Challenge

Lesson: `a1-m8-u3-l2-conversation-challenge`

Purpose: sustain an A1 interaction, ask and answer questions, initiate a turn and repair meaning where needed.

### Part 3 — My Life, My English

Lesson: `a1-m8-u3-l3-capstone`

Purpose: understand practical information, respond, relay a detail and complete an integrated real-world communication goal.

Learner dashboard:

`/learn/a1/capstone`

Teacher review is integrated into the existing learner-support route:

`/teacher/insights/{studentId}`

The teacher review flow is:

**trusted evidence candidate → authorized artifact review → requirement selection → bounded judgment + rationale + confidence → new teacher-reported evidence → capstone reevaluation**

Raw learner work is never rewritten by the review.

## 6. What remains before representative pilot validation

### Repository verification

The current branch must pass:

- TypeScript;
- lint;
- Learn production build;
- learner-model architecture verification;
- Mind recommendation verification;
- Firestore security tests;
- curriculum portfolio verification.

GitHub-hosted Actions are currently failing before checkout/step execution. A runner-startup failure is not a curriculum failure, but the branch still needs a real verification pass before merge/release.

### Assessment calibration

Human validation is now implemented as a production-capable path. What remains is **calibration**, not invention of a review mechanism.

Before a commercial A1 exit decision is trusted:

- teachers/reviewers need a shared A1 capstone rubric and calibration examples;
- reviewer agreement and recurring disagreement patterns should be observed;
- evidence sufficiency thresholds should be checked against real learner performance;
- bounded AI interpretation may later assist, but must be calibrated against human-reviewed evidence before it can create strong productive-level decisions independently.

## 7. Representative pilot protocol

Pilot learners must intentionally include:

- true beginner;
- partial-prior-knowledge learner;
- Dominican Spanish speaker;
- learner stronger in reading than speaking;
- lower-confidence speaker;
- fast-progressing learner;
- Flex-only learner;
- Guided learner with teacher support.

For each profile verify:

1. onboarding/start point is defensible;
2. interruption/resume works;
3. required listening cannot be skipped silently;
4. required speaking evidence is genuinely stored;
5. roleplay minimum interaction is enforced;
6. first attempt remains distinct from supported completion;
7. delayed retrieval changes later evidence;
8. Mind next action is pedagogically defensible;
9. teacher guidance returns to the learner path;
10. teacher can privately review the relevant capstone artifact;
11. `meets`, `not_yet`, and `inconclusive` affect capstone evidence correctly;
12. capstone does not confuse raw evidence with qualified evidence;
13. targeted revalidation avoids unnecessary repetition.

## 8. Pilot closure decision

A1 may move from `representativePilot: in-progress` to `complete` only when:

- repository verification is green;
- no unresolved Critical pilot defects remain;
- representative profiles have been exercised;
- at least one delayed-retrieval cycle is observed;
- at least one teacher-return cycle is observed;
- at least one capstone teacher-review cycle is observed;
- productive evidence interpretation is calibrated sufficiently for the intended decision;
- `My Life, My English` produces defensible requirement-level results;
- accessibility/resume paths have no Critical blockers.

## 9. Immediate sequence from here

1. obtain a real green repository verification run;
2. fix any concrete integration defects;
3. run representative A1 Module 1 learner pilot;
4. calibrate content/support/evidence behavior;
5. validate the first production lessons from Modules 2–8;
6. calibrate `My Life, My English` teacher judgments and exit thresholds;
7. calibrate Coach A1 Pack 1 against the same learner evidence;
8. freeze/version A1 production pattern v1 only after these gates pass.

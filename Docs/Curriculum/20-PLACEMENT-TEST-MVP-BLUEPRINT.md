# Placement Test MVP Blueprint

Status: MVP assessment design

## Purpose
Prevent knowledgeable learners from being trapped at entry level while creating an initial competency profile for Lurexa Mind and the persistent Learner Model.

## MVP principle
The first production version does not need a psychometrically complete adaptive engine. It does need a defensible staged diagnostic that can expand later without changing the learner-data model.

## Stage 0 — Self-report (non-scored)
Ask:
- Have you studied English before?
- Can you hold a basic conversation?
- Have you used English at work/school/travel?
- What is your goal?
Use only to choose an efficient starting band or to contextualize results; never use self-report alone as placement.

## Stage 1 — Rapid screening
Approx. 12-18 items across A1-B2 with branching.
Domains:
- high-frequency vocabulary;
- grammar in context;
- short reading;
- micro-listening.

Outcome: probable test band, not final level.

## Stage 2 — Band diagnostic
Deliver 12-20 items concentrated around the estimated band and adjacent levels.
Include recognition plus productive items where feasible.

## Stage 3 — Listening
2-4 short recordings with progressive difficulty.
Measure:
- main idea;
- specific detail;
- functional meaning;
- ability to understand increasingly natural connected speech.

## Stage 4 — Speaking
Use 2-3 prompts based on likely band.
Examples:
- A1: introduce yourself and answer two basic questions;
- A2: describe a recent activity/trip;
- B1: give and support an opinion;
- B2+: explain/argue a more complex issue.
Evaluate task achievement, comprehensibility, fluency, vocabulary/grammar control and phonetic intelligibility. Automated scoring should include confidence and be reviewable where high-impact.

## Stage 5 — Writing
Optional in the shortest MVP flow; required for a fuller diagnostic.
Prompt length adapts to band.
Do not allow AI rewriting during placement.

## Stage 6 — Phonetics diagnostic
Use a short read/imitate plus spontaneous sample rather than isolated words only.
Targets may include:
- final consonants;
- selected vowel/consonant contrasts;
- word stress;
- sentence stress/rhythm.
Return observations and priorities, not an accent-quality score.

## Output
Example:
Overall estimated level: B1
Listening: B1+
Speaking: B1
Reading: B2-
Writing: A2+
Vocabulary: B1+
Grammar: B1
Phonetics/intelligibility: A2+
Recommended entry: B1 Module 1 or diagnostic challenge at B1 Module 2
Priority reinforcement: extended writing, connected speech, past-tense accuracy

## Confidence
Every skill estimate should carry confidence based on evidence quality/quantity. Low confidence should trigger early-course revalidation rather than false precision.

## Placement states
`estimated` -> `provisionally_placed` -> `validated_by_coursework`

## Challenge checkpoint
Before forcing a learner through material below demonstrated ability, offer a short challenge assessment. Passing skips instructional content while preserving future revalidation.

## Free-tier rule
Placement and challenge testing remain available to free users at a meaningful level. Subscription cannot intentionally under-place a learner.

## Teacher placement
The same engine may later assess teacher English proficiency using educator-context prompts. Teaching competence remains a separate evaluation.

## Evidence flow
Each response creates assessment evidence. The overall placement is an interpretation based on that evidence, not a raw field written by the UI.

## MVP implementation priority
1. rapid screening;
2. A1-A2 band diagnostic;
3. listening;
4. short speaking sample;
5. overall profile + recommended start;
6. expand B1-C2 item bank;
7. add richer writing/phonetics analytics.

## Test integrity
- randomize equivalent items where possible;
- do not reveal answers until the relevant section ends;
- allow accessibility accommodations;
- log version of assessment and scoring rules;
- do not claim certified CEFR status from an unvalidated internal placement test.
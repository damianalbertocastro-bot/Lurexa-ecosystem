# A1 Implemented Activity Audit and Production Mapping

Status: Current implementation audit  
Scope: A1 learner runtime, advanced learning capabilities, retrieval/adaptation, teacher return and current production-authoring surfaces  
Primary references: `20-A1-MODULE-1-PRODUCTION-BLUEPRINT.md`, `21-A1-LEARNING-LOOP-VALIDATION-AND-PILOT-SPEC.md`, `24-CURRICULUM-COVERAGE-AND-QA-GATES.md`

## 1. Executive decision

A1 has moved beyond the earlier prototype stage described in previous versions of this document.

The canonical direction is now:

- one dynamic structured `LessonRuntime`;
- trusted Firestore-authored lesson objects;
- server-scored structured activities;
- trusted advanced capabilities;
- production model listening/TTS;
- recorded spoken evidence;
- server-owned AI tutor sessions;
- delayed retrieval;
- Mind recommendations;
- teacher intervention and learner-return guidance;
- protected Core-owned evidence/adaptation records.

The next A1 bottleneck is no longer invention of these capabilities. It is curriculum production, coverage mapping, pilot calibration and release QA.

## 2. Canonical runtime

The canonical learner path is `apps/learn-web/app/learn/[courseId]/[lessonId]/page.tsx` → `LessonRuntime`.

`LessonRuntime` currently supports:

- authenticated lesson loading;
- trusted resume/progress;
- selected-response activities;
- sentence builder;
- short-response/Create & Apply evidence;
- quiz evidence;
- model-listening capability;
- recorded-speaking capability;
- AI-roleplay capability;
- normal lesson completion;
- delayed retrieval scheduling;
- retrieval completion with fresh evidence requirement.

Older special-purpose A1 surfaces should not become parallel curriculum runtimes.

## 3. Competency ID state

A1 production uses the authoritative convention:

`EN.A1.<FAMILY>.<COMPETENCY_NAME>`

Examples:

- `EN.A1.SPEAK.INTRODUCE_SELF`
- `EN.A1.CONV.GREETING_EXCHANGE`
- `EN.A1.PHON.INTELLIGIBLE_CORE_PHRASES`
- `EN.A1.WRITE.PERSONAL_SENTENCES`
- `EN.A1.CREATE.PERSONAL_INTRODUCTION`
- `EN.A1.GRAMMAR.BE_AFFIRMATIVE_NEGATIVE`

Historical ad hoc IDs should not be silently rewritten. Migration requires explicit aliases/provenance.

## 4. Current activity/capability map

| Activity/capability | Current state | Evidence judgment | Production decision |
|---|---|---|---|
| Contextual text/dialogue | Structured | Encounter/comprehension | KEEP |
| Vocabulary/recognition practice | Structured | Recognition/practice | KEEP, do not over-weight |
| Single choice | Server-scored | Recognition/formative | KEEP |
| Multiple selection | Server-scored | Recognition/formative | KEEP |
| Sentence builder | Server-scored | Guided form/production | KEEP |
| Short response | Persisted | Productive/writing evidence | KEEP + expand |
| Model listening | Production TTS/trusted lesson | Listening exposure/processing | KEEP + author broadly |
| Recorded speaking | Real MediaRecorder + Storage path | Raw spoken-production evidence | KEEP; separate later interpretation |
| AI roleplay | Server-owned tutor session | Interaction evidence | KEEP + calibrate by level |
| Create & Apply | Structured productive work | Stronger transfer evidence | REQUIRED by unit/module |
| Delayed retrieval | Persisted schedule | Retention/revalidation evidence | REQUIRED for major targets |
| Mind recommendation | Evidence-derived | Interpretation/next action | KEEP; not mastery |
| Teacher intervention | Brief → response → learner return | Human-observed/structured guidance | KEEP + expand |
| Expert escalation | Architecture documented | Expert professional/curriculum judgment | PILOT NEXT |

## 5. Closed gaps from the previous audit

The following items were previously listed as missing and are now substantially implemented:

### Structured reusable runtime

Closed. The dynamic lesson route uses the canonical runtime rather than rendering the same hard-coded A1 page for every lesson.

### Real AI scenario conversation

Closed at the infrastructure/runtime level. AI roleplay resolves trusted authored capability metadata server-side and uses server-owned session state.

Remaining work is pedagogical calibration, scenario coverage and production curriculum authoring.

### Production listening

Closed at the infrastructure/runtime level. Model-listening capability resolves trusted lesson text and uses production TTS when configured.

### Spoken evidence capture

Closed at the evidence-capture level. Browser recording is uploaded through a trusted server boundary and stored with provenance.

Pronunciation/intelligibility interpretation remains a separate later layer and must not be faked as a recording-completion score.

### Persistent attempts/resume

Closed for the canonical progress path.

### Delayed retrieval

Closed at the scheduling/runtime level. Retrieval completion requires fresh evidence after the due time.

### Evidence-driven next action

Closed at the initial Mind/adaptation level. Retrieval, teacher return, Mind recommendations and normal continuation share one priority architecture.

### Teacher brief/return

Closed at the initial product loop. Teacher guidance can return to the learner without fabricating learning evidence merely because the learner acknowledged the message.

## 6. Remaining A1 production gaps

### P0 — curriculum production and pilot calibration

1. Author/implement Modules 2–8 using `31-A1-MODULES-2-8-PRODUCTION-BLUEPRINTS.md`.
2. Build a competency × evidence × retrieval coverage map for all A1 modules.
3. Run representative learner pilot cases from `21`.
4. Calibrate AI roleplay length, correction frequency and support reduction.
5. Calibrate TTS/listening pace and transcript visibility by activity purpose.
6. Calibrate recorded-speaking evidence interpretation without overclaiming pronunciation scoring.
7. Validate A1 capstone/exit evidence.
8. Confirm accessibility/resume across every activity family.

### P1 — richer adaptation

1. Adapt within lessons, not only next-step routing.
2. Reduce redundant recognition for strong learners.
3. Increase production after recognition-production gaps.
4. Use scaffold history explicitly in activity selection.
5. Add prerequisite-specific recovery rather than generic repetition.

### P2 — human/expert calibration

1. Pilot teacher live-session evidence across multiple A1 patterns.
2. Pilot expert escalation for ambiguous pronunciation/assessment/curriculum cases.
3. Convert recurring expert findings into reusable curriculum/Teach assets.

## 7. Pronunciation status

Current production can capture real speech and provide model audio.

Do not claim automatic pronunciation mastery yet.

The next pronunciation layer should derive interpretable observations such as:

- target-feature perception;
- controlled production;
- guided phrase production;
- spontaneous intelligibility;
- retry improvement;
- delayed transfer.

Raw audio remains evidence; analysis is a derived interpretation with model/version provenance.

## 8. A1 production sequence

Use this sequence:

1. Module 1 pilot/calibration;
2. Module 2 production;
3. Module 3 production;
4. Module 4 production;
5. Module 5 production;
6. Module 6 production;
7. Module 7 production;
8. Module 8 capstone/exit evidence;
9. full A1 coverage audit;
10. A1 production-pattern freeze/version.

Do not wait for every higher CEFR level before completing A1.

## 9. Coach relationship

A1 Coach should not repeat lesson scripts.

It should:

- retrieve current/older A1 competencies;
- vary scenarios;
- expose recognition-production gaps;
- strengthen interaction and repair;
- target evidence-backed pronunciation/fluency needs;
- return new evidence through Core/Mind.

See `32-COACH-LANGUAGE-PRACTICE-CURRICULUM.md`.

## 10. Teacher relationship

Teacher-supported A1 work should emphasize:

- spontaneous interaction;
- productive gaps;
- communication-relevant pronunciation;
- question formation;
- repeated transfer patterns;
- confidence/repair;
- capstone observation.

Teacher sessions should not become a second delivery of the digital module.

## 11. Production rule

Continue using:

**Preserve proven interaction → correct evidence semantics → normalize competency mapping → reuse shared runtime → add missing pedagogical capability → validate with learner evidence → scale curriculum.**

The architectural migration phase is largely complete. The curriculum-production and calibration phase is now the priority.

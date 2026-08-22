# Curriculum Product Implementation Roadmap

Status: Execution authority for curriculum-consuming products
Depends on: `29-LANGUAGE-CURRICULUM-CORE-ARCHITECTURE.md`, `32-COACH-LANGUAGE-PRACTICE-CURRICULUM.md`, `33-CROSS-PRODUCT-CURRICULUM-CONSUMPTION-CONTRACT.md`, `42-INTEGRATED-LEVEL-AND-STAGE-CAPSTONE-ASSESSMENT-STANDARD.md`

## 1. Purpose

This roadmap converts the shared curriculum architecture into product-specific implementation work without allowing products to fork competency meaning.

## 2. Governing priority path

The current execution priority is:

**A1 pilot → A1 production objects Modules 2–8 → A1 Coach Pack 1 calibration → Teach T1 reference implementation → A2 reference implementation → B1 reference implementation → B2/C1/C2 production lessons → Insight/Admin/Studio curriculum tooling → second-language vertical pilot.**

Do not skip ahead merely because higher-level curriculum documents exist. Each step should reduce uncertainty for the next step.

Integrated level/stage capstones are part of this path, not a later enhancement. Every A1–C2 learner level and T1–T5 teacher stage must end with a governed integrated capstone before that level/stage can be represented as curriculum-complete.

## 3. Lurexa Learn

### Current strength

Learn already has the canonical lesson runtime, trusted progress/evidence, advanced capabilities, delayed retrieval, Mind next actions and teacher return.

### Next implementation sequence

1. complete the representative A1 Module 1 pilot;
2. author A1 Modules 2–8 into trusted curriculum objects;
3. implement the A1 integrated capstone `My Life, My English` as the first level-exit assessment reference;
4. add program/module/unit metadata above lessons;
5. add competency/evidence/retrieval/capstone coverage validation at publish time;
6. implement A2 Module 1 and its support-reduction calibration;
7. expand A2 production objects and implement the A2 integrated capstone;
8. implement B1 reference content and the B1 integrated capstone;
9. scale B2–C2 production lessons and their integrated capstones only after the lower-level evidence pattern is validated.

### Product-quality checks

- no lesson can claim a competency that does not exist;
- productive competency cannot be satisfied only by selected response;
- required capability/evidence blocks must be completed before normal lesson completion where specified;
- retrieval targets remain traceable;
- curriculum version is stored with production content/evidence;
- level completion is separate from module completion;
- level-exit decisions use the integrated capstone evidence bundle and can route targeted revalidation rather than require full-level repetition.

## 4. Lurexa Coach

### Current strength

Coach can start context-aware sessions using shared learner context and recommendations.

### Next implementation sequence

1. calibrate A1 Coach Pack 1 immediately after the A1 production-object step;
2. introduce explicit Coach session modes (`rehearsal`, `retrieval`, `repair`, `scenario`, `fluency`, `pronunciation`, `challenge`, `teacher_return`);
3. select Coach pack from level/current/retrieval target;
4. persist target competency IDs and session mission;
5. capture selective turn-level interaction/spoken evidence;
6. add post-feedback retry plus scenario variation;
7. return evidence through Core;
8. schedule delayed Coach retrieval;
9. use Coach evidence as one source in integrated level capstones where the capstone requires interaction/pronunciation transfer;
10. expand packs only after A1 Pack 1 calibration.

Coach scenario variation must test transfer. Repeating the same Learn dialogue is insufficient evidence.

## 5. Lurexa Teach

### Current strength

Teach has T1–T5 architecture and production blueprints.

### Next implementation sequence

1. represent `TCH.*` competencies as machine-readable governed definitions;
2. create professional-learning lesson/case/artifact schemas;
3. objectize T1 Module 1 as the reference professional-learning runtime slice;
4. implement T1 capstone `The First Coherent Lesson` as the reference stage-exit assessment;
5. add AI learner/classroom simulation capability;
6. add artifact upload/revision/evidence provenance;
7. add mentor/expert review workflow;
8. pilot T1/T2 including capstone decisions;
9. implement T2–T5 capstones as defined in `42`;
10. implement T3 diagnostic/unit-design experiences;
11. delay T4/T5 product scale until authentic advanced evidence can be reviewed reliably.

Teacher language proficiency and `TCH.*` professional capability remain separate axes. A teacher-stage capstone evaluates professional capability; English-language ability is evaluated separately through the language framework where relevant.

## 6. Lurexa Insight

### Curriculum analytics v1

Build views/aggregates for:

- competency evidence by state/confidence;
- first-attempt vs scaffolded success;
- receptive vs productive gap;
- speaking/listening balance;
- retrieval success/decay;
- recurring target patterns;
- teacher intervention count/outcome;
- Coach practice effects;
- curriculum activity hotspots;
- module/unit completion vs demonstration;
- capstone readiness dimensions and unresolved evidence gaps;
- coverage gaps by cohort/program;
- accessibility drop-off points.

### Curriculum analytics v2

Add curriculum-version comparison, item/activity diagnostics where sample sizes support them, cohort transfer analysis, AI correction/override quality, teacher calibration patterns, capstone decision calibration, and equity/access checks.

Insight must surface uncertainty/sample limitations and never manufacture mastery from aggregate engagement.

## 7. Lurexa Admin

### Curriculum governance v1

Admin should expose assigned curriculum/program, curriculum version, cohort start point, support mode, teacher/mentor assignment, published/draft/retired curriculum status, localized program variant, placement/entry policy and integrated-capstone requirement/status.

### Governance v2

Add staged curriculum rollout, migration/version policies, institution-specific approved localization, assessment/calibration policy, capstone retake/revalidation policy and audit history.

Admin should never directly edit learner evidence or competency-state interpretation.

## 8. Lurexa Studio

### Highest-leverage future role

Studio should become the curriculum production environment so authors do not need to hand-edit Firestore objects or Markdown.

### Studio v1

Author course/module/unit/lesson metadata, structured activities, listening, recorded speaking, AI roleplay, Create & Apply, assessments, retrieval targets and integrated capstone projects.

Validate target language, level/stage, competency IDs, evidence compatibility, duplicate IDs, required productive evidence, accessibility fields, curriculum version, capstone coverage and non-bypassable critical competencies.

### Studio v2

AI-assisted generation should support blueprint selection, competency-constrained drafts, level controls, cultural/localization controls, coverage warnings, capstone sampling checks, human review, version diff and pilot-feedback integration. AI creates drafts; it never bypasses QA.

## 9. Lurexa Mind

Priorities:

1. evidence-strength-aware competency interpretation;
2. retrieval/revalidation;
3. recognition-production gap detection;
4. recurring transfer-pattern inference;
5. support-dependence tracking;
6. Coach/teacher/Learn evidence integration;
7. uncertainty/confidence;
8. capstone readiness interpretation without collapsing dimensions into one opaque score;
9. targeted revalidation recommendations after a capstone;
10. curriculum hotspot detection at aggregate level.

## 10. Lurexa Core

Priorities:

1. curriculum/version identifiers on content/evidence;
2. registered competency definitions;
3. trusted source product/provenance;
4. raw spoken/artifact evidence references;
5. immutable/traceable attempt history;
6. authorization for teacher/expert review;
7. capstone project/evidence bundle persistence;
8. curriculum retirement/migration without erasing historical evidence.

## 11. English rollout sequence across products

### Stage E1 — A1 reference ecosystem

- Learn: Module 1 validated + Modules 2–8 authored + A1 integrated capstone;
- Coach: A1 Pack 1 calibrated, then Packs 2–8;
- Teach: T1 reference slice + T1 capstone;
- Insight: A1 evidence/retrieval/capstone-readiness dashboard;
- Admin: curriculum/version/capstone assignment;
- Studio: A1 governed authoring including capstone authoring.

### Stage E2 — A2/B1 expansion

- Learn: A2 then B1, each with integrated capstone;
- Coach: corresponding packs;
- Teach: T2/T3 including stage capstones;
- Insight: cross-level progression and capstone calibration;
- Studio: authoring automation with coverage checks.

### Stage E3 — B2–C2 advanced ecosystem

- Learn: advanced performance units + B2/C1/C2 capstones;
- Coach: demanding interlocutor/mediation/register scenarios;
- Teach: T4/T5 advanced professional evidence + capstones;
- Insight: advanced calibration and curriculum-quality analytics.

## 12. Future-language rollout

A second language should prove reuse by implementing:

1. target-language profile/competencies;
2. first learner-L1 transfer profile;
3. one Learn vertical slice;
4. one level-exit integrated capstone appropriate to that language;
5. one Coach pack;
6. teacher-language specialization in Teach;
7. Insight language-scoped evidence;
8. Studio authoring with target-language metadata;
9. Admin version assignment.

If adding a language requires a new progress/evidence engine, the language-neutral architecture has failed and should be corrected before scaling.

## 13. Product implementation release gate

A product may claim curriculum integration only when it uses registered curriculum/competency metadata, trusted evidence/provenance, curriculum versioning, governed Core/Mind interpretation and representative end-to-end tests.

A learner level or teacher stage may claim curriculum completion only when its integrated capstone is implemented, competency coverage is mapped, representative pilot/calibration exists and critical competencies cannot be bypassed by weak evidence.

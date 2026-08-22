# Cross-Product Curriculum Consumption Contract

Status: Authoritative curriculum/product boundary
Owner: Lurexa Learning Technologies
Applies to: Core, Mind, Learn, Coach, Teach, Admin, Insight, Studio and future curriculum-consuming products

## 1. Purpose

Lurexa uses one evolving learner model and a shared competency graph. That advantage disappears if each product redefines curriculum meaning independently.

This contract defines how every product may consume, create, interpret or govern curriculum.

> **Competency meaning is shared. Product experiences are specialized. Evidence remains traceable to the same governed curriculum system.**

## 2. Authority hierarchy

### Curriculum authority

`Docs/Curriculum/*` plus versioned machine-readable curriculum contracts define pedagogical meaning.

### Core authority

Lurexa Core owns:

- identity;
- authorization;
- trusted curriculum/progress/evidence records;
- provenance;
- curriculum versions assigned to learners/programs;
- trusted storage;
- cross-product data contracts.

Core does not decide what an error means pedagogically.

### Mind authority

Lurexa Mind owns interpretation of authorized evidence:

- learner patterns;
- confidence;
- active targets;
- recommendations;
- adaptation;
- intervention suggestions.

Mind does not own authoritative raw evidence or rewrite competency definitions.

## 3. Lurexa Learn

### Primary curriculum role

Learn is the canonical sequenced learning product.

Learn may:

- deliver courses/modules/units/lessons;
- teach competencies;
- capture structured activity evidence;
- capture listening/speaking/writing/interaction evidence;
- schedule retrieval;
- apply Mind recommendations;
- surface teacher-return guidance;
- present placement/progression paths.

Learn must:

- use governed competency IDs;
- preserve evidence type/provenance;
- distinguish completion from mastery;
- maintain async completeness;
- support retrieval and transfer.

Learn must not:

- create one-off private competency taxonomies;
- infer productive mastery from recognition alone;
- bypass Core evidence boundaries.

## 4. Lurexa Coach

### Primary curriculum role

Coach is the spontaneous language-use, conversation, fluency and pronunciation practice product.

Coach may:

- retrieve Learn competencies;
- create additional speaking/interaction evidence;
- rehearse current/upcoming targets;
- target recurring pronunciation/fluency/language patterns;
- run scenario conversations;
- support delayed retrieval;
- vary context after successful performance.

Coach must:

- use the same target-language competency IDs;
- mark Coach-generated evidence with product/source provenance;
- preserve level/task constraints;
- distinguish pronunciation dimensions from global proficiency;
- return evidence to Core/Mind.

Coach must not:

- silently advance a learner's course position;
- declare curriculum mastery from one conversation;
- run accent-erasure objectives;
- maintain a hidden learner profile separate from Core.

## 5. Lurexa Teach

### Primary curriculum role

Teach develops teacher professional capability and target-language ability where relevant.

Teach uses two distinct competency spaces:

- learner/target-language proficiency (`EN.*`, future `ES.*`, etc.);
- teacher professional competencies (`TCH.*`).

Teach may:

- assign professional-development learning;
- simulate learner/classroom cases;
- collect lesson plans, microteaching, rubrics, reflection and coaching evidence;
- recommend Learn/Coach language practice when teacher language ability requires it;
- support mentor/expert workflows.

Teach must not merge teacher-language proficiency and teaching capability into one score.

## 6. Lurexa Admin

### Primary curriculum role

Admin governs deployment and assignment, not pedagogy.

Admin may control:

- program availability;
- curriculum version;
- institution/cohort assignment;
- support mode;
- teacher/mentor assignment;
- localization options;
- release state;
- policy/configuration.

Admin must not directly rewrite:

- competency definitions;
- mastery rules;
- evidence semantics;
- learner interpretations.

Such changes require governed curriculum/version updates.

## 7. Lurexa Insight

### Primary curriculum role

Insight makes learning/curriculum evidence interpretable for authorized users.

Insight should report at appropriate scopes:

### Learner

- competency evidence profile;
- receptive/productive gap;
- retention/revalidation;
- support dependence;
- intervention history;
- progression confidence.

### Cohort

- competency difficulty hotspots;
- skill/mode imbalance;
- retrieval decay;
- first-attempt vs scaffolded success;
- teacher override patterns;
- accessibility barriers;
- recurring transfer/misconception patterns.

### Curriculum/program

- competency coverage;
- evidence coverage;
- item/activity performance;
- module drop-off;
- intervention recurrence;
- capstone/exit-evidence quality;
- version comparison.

Insight may surface patterns and hypotheses but must not alter raw evidence.

## 8. Lurexa Studio

### Primary curriculum role

Studio is the governed authoring/generation environment.

Studio may create:

- courses;
- modules;
- units;
- lessons;
- activities;
- dialogues;
- listening scripts/audio requests;
- roleplay scenarios;
- assessment tasks;
- teacher-development cases;
- Coach scenario packs;
- localization variants.

Studio must validate before publish:

1. target language/domain;
2. curriculum version;
3. proficiency level;
4. competency IDs;
5. activity capability schema;
6. evidence type;
7. productive-evidence requirements;
8. retrieval mapping;
9. Create & Apply/transfer;
10. accessibility;
11. localization/cultural constraints;
12. AI usage constraints;
13. author/reviewer provenance.

Studio-generated content is draft content until it passes governed QA.

## 9. Core/Mind cross-product loop

The standard loop is:

**Product experience → Core evidence → Mind interpretation → Core trusted insight/recommendation record → authorized product adaptation → new evidence**

No product should create a private adaptation loop that bypasses this pattern for learner-state decisions.

## 10. Cross-product evidence envelope

Every learning/professional evidence record should be able to identify, where applicable:

- learner/teacher ID;
- organization;
- source product;
- target language/domain;
- curriculum version;
- course/module/unit/lesson/activity;
- competency IDs;
- evidence type;
- first attempt / attempt number;
- scaffold level;
- observed time;
- provenance method;
- human/AI/system actor;
- raw artifact/storage reference when applicable;
- interpretation version where derived.

## 11. Product-specific evidence examples

### Learn

`assessment_result`, structured practice, writing, spoken evidence, lesson progress, Create & Apply.

### Coach

conversation turn performance, recorded speaking, pronunciation target evidence, repair, fluency/interaction observation.

### Teach

lesson plan, scenario decision, assessment design, microteaching, observation, reflection, coaching/leadership artifact.

### Insight

No new raw learner evidence from viewing dashboards. Insight creates analytics/derived interpretation artifacts only.

### Admin

No learning evidence from administrative actions.

### Studio

Authorship/review/QA provenance, not learner mastery evidence.

## 12. Recommendation hierarchy

When multiple actions exist, products should consume one governed priority model rather than invent their own ordering.

Current learner priority principle:

1. safety/critical access requirement if any;
2. due required retrieval;
3. explicit teacher-return action;
4. high-confidence Mind targeted reinforcement;
5. normal curriculum continuation;
6. optional enrichment.

Product UI may present optional alternatives but should not silently suppress higher-priority required learning.

## 13. Curriculum version behavior

A learner should remain interpretable across curriculum changes.

When a curriculum version changes:

- old evidence retains original competency/version provenance;
- stable competency IDs may continue when meaning is unchanged;
- changed competency meaning requires a new ID/version decision;
- migration/alias tables must be explicit;
- Insight may compare version outcomes;
- learners should not lose demonstrated capability because lesson content was reorganized.

## 14. English product integration

For the current English program:

- Learn owns sequenced A1-C2 curriculum delivery;
- Coach owns targeted/spontaneous speaking and pronunciation extension;
- Teach develops English teachers and may reuse Learn/Coach for teacher-language growth;
- Insight should expose English competency/evidence/retention patterns;
- Studio should author English curriculum objects from the authoritative `EN.*` model;
- Admin should assign English programs and versions without redefining `EN.*` meaning.

## 15. Future-language integration

For future languages:

- create a target-language competency/profile layer under `29-LANGUAGE-CURRICULUM-CORE-ARCHITECTURE.md`;
- reuse Core evidence/provenance;
- reuse Mind interpretation structure while adding language-specific interpreters where required;
- reuse Learn/Coach/Teach product roles;
- keep transfer profiles directional and evidence-aware;
- never reuse English-specific phonology/grammar assumptions as universal rules.

## 16. Contract tests to add over time

Repository verification should eventually enforce:

- all authored competency IDs exist;
- product evidence uses registered source-product IDs;
- Coach target competencies exist in the same language curriculum graph;
- Teach professional evidence uses `TCH.*` when measuring teaching capability;
- Studio cannot publish unknown competencies;
- Admin cannot mutate evidence/mastery data directly;
- Insight remains read/derive oriented;
- curriculum-version metadata is present in new production objects.

## 17. Definition of success

The ecosystem is curriculum-integrated when a learner can move between Learn and Coach, receive teacher support through Teach-related workflows, be analyzed in Insight, be assigned through Admin and receive Studio-authored content without the meaning of their learning history changing between products.

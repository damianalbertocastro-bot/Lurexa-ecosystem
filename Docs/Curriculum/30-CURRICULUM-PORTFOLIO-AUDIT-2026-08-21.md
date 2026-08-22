# Lurexa Curriculum Portfolio Audit — 2026-08-21

Status: Active portfolio audit and execution plan
Scope: curriculum-relevant repository surfaces across Learn, Coach, Teach, Core, Mind, Admin, Insight and Studio
Basis: current `main` after the integrated curriculum/runtime merge and A1 adaptive teacher-return pilot work

## 1. Executive assessment

Lurexa's curriculum architecture is substantially stronger than its current production-content coverage.

The project should not redesign its methodology again. The highest-leverage move is now to convert the existing architecture into systematic production objects, coverage maps, pilot evidence and reusable cross-product curriculum contracts.

### Maturity summary

| Area | Architecture maturity | Production maturity | Audit judgment |
|---|---:|---:|---|
| Learning methodology | High | High enough to govern production | Preserve |
| English A1 | High | Medium-high | Scale after pilot calibration |
| English A2 | High | Medium-low | Ready for production authoring |
| English B1 | High | Medium-low | Ready for lesson-blueprint production |
| English B2 | Medium-high | Low | Build module/unit blueprints next |
| English C1 | Medium-high | Low | Build module/unit blueprints after B2 |
| English C2 | Medium-high | Low | Build module/unit blueprints after C1 |
| Assessment/mastery | High | Medium | Extend calibration and automated coverage checks |
| Retrieval/adaptation | High | Medium | Expand beyond A1 pilot |
| Teacher intervention | High | Medium | Productize across more competencies/levels |
| Expert educator layer | High | Low | Pilot after teacher workflow stabilizes |
| Lurexa Teach | High | Medium-low | T1/T2 strong; T3-T5 need production blueprints |
| Lurexa Coach | Medium-high | Medium-low | Needs explicit speaking/pronunciation curriculum progression |
| Cross-product curriculum contract | Medium | Medium | Formalize responsibilities and shared metadata |
| Cross-language reuse | Previously low | Previously low | Corrected by `29-LANGUAGE-CURRICULUM-CORE-ARCHITECTURE.md` |

## 2. What is already unusually strong

### A. Curriculum is competency-first, not topic-first

Stable competency IDs allow learner history to survive changes in examples, themes and lesson order.

This is essential for Mind, Coach, Insight and future languages.

### B. Completion is separated from mastery

The repository repeatedly distinguishes:

- completion;
- first-attempt evidence;
- scaffolded performance;
- productive evidence;
- interaction evidence;
- retained/revalidated evidence;
- mastery interpretation.

This is a major quality advantage over conventional LMS course-completion models.

### C. The asynchronous path is treated as a full learning path

Teacher time is designed to extend the digital sequence, not compensate for a weak online course.

### D. AI is curriculum-constrained

The current architecture correctly keeps:

- credentials server-side;
- authored capability metadata trusted;
- learner context purpose-scoped;
- raw evidence separate from interpretation;
- AI recommendations distinct from mastery decisions.

### E. Teacher development is a real curriculum

Lurexa Teach is not merely dashboard training. It already distinguishes teacher language ability from professional capability and defines T1-T5 growth.

### F. Dominican specialization is evidence-aware

The linguistic profile and error corpus are used as priors for transfer-aware support, not as deterministic stereotypes.

## 3. Current repository truth that supersedes stale curriculum notes

Several older curriculum documents still describe these capabilities as missing or future work. Current implementation has advanced beyond those statements.

The repository now contains or has recently integrated:

- canonical structured `LessonRuntime`;
- trusted progress/resume;
- server-scored structured activities;
- production model-listening/TTS capability;
- recorded spoken-evidence capture;
- AI roleplay through a server-side tutor boundary;
- delayed retrieval schedules;
- prioritized learner recommendations;
- teacher intervention briefs and learner return guidance;
- server-owned tutor sessions;
- trusted advanced-capability authoring;
- protected Firestore records for adaptive/AI evidence objects.

Therefore `README.md` and `28-A1-IMPLEMENTED-ACTIVITY-AUDIT-AND-MAPPING.md` should be treated as partially stale until updated.

## 4. Primary weaknesses

### Weakness 1 — Production depth is uneven by CEFR level

A1 has a real vertical implementation pattern. A2 and B1 have enough architecture to author, but not equivalent production depth. B2-C2 remain largely macro/competency architecture.

Risk: the product can look broad on paper while still having only one deeply validated learner path.

### Weakness 2 — No explicit language-neutral curriculum layer existed

The English architecture was strong enough that future language teams could easily copy its English-specific assumptions into Spanish/French/etc.

Resolution: `29-LANGUAGE-CURRICULUM-CORE-ARCHITECTURE.md` now separates universal learning logic, shared language-learning logic, target-language profiles, learner-L1 transfer profiles and localized content.

### Weakness 3 — Coach has intelligence context but not yet a full curriculum progression

Coach already receives learner level, recent curriculum, pronunciation/fluency targets and recommendations. It still needs a curriculum of speaking behaviors, scenario progression, feedback progression, retrieval and evidence rules.

### Weakness 4 — Teach production stops too early

T1 and T2 have production blueprints. T3-T5 have strong macro definitions but insufficient production-level sequence, evidence and capstone specifications.

### Weakness 5 — Cross-product curriculum responsibilities are implicit

Learn, Coach, Teach, Insight, Admin and Studio all touch curriculum, but a single authoritative product-consumption contract is needed to prevent each product from redefining competency meaning independently.

### Weakness 6 — Coverage QA is documented but not yet fully machine-enforced

The current QA document is excellent, but many checks remain procedural rather than executable.

Future automated checks should detect:

- unknown competency IDs;
- productive competencies with only selected-response evidence;
- missing delayed retrieval;
- missing Create & Apply;
- duplicate competency ownership;
- lesson capability/evidence mismatches;
- missing level-exit evidence;
- modules without conversation/interpersonal work where required.

## 5. Learn curriculum judgment

### A1

A1 is the production reference level.

Current strengths:

- real multimodal loop;
- structured content objects;
- listening;
- speaking evidence;
- AI roleplay;
- retrieval;
- Mind recommendations;
- teacher return;
- canonical competency IDs.

Remaining A1 work is primarily curriculum scale and pilot calibration, not foundational system invention.

### A2

A2 is ready to move from planning into production.

Do not create all A2 lessons at once. First build Module 1 using the same evidence/retrieval pattern as validated A1, then use it as the A2 reference.

### B1

B1 has sufficient competency and module/unit architecture for production lesson blueprints.

B1 should emphasize:

- connected discourse;
- real-time interaction;
- narration;
- explanation/reasoning;
- online professional/social interaction;
- mediation;
- less scaffolded productive evidence.

### B2-C2

These levels should remain architecture-ahead-of-implementation, but module/unit blueprints now need to be completed so future generation does not become ad hoc.

## 6. Coach curriculum judgment

Coach should not become an unstructured chatbot.

Its curriculum role is:

1. retrieve Learn competencies into conversation;
2. strengthen spontaneous interpersonal performance;
3. target intelligibility/fluency/pragmatics strategically;
4. rehearse upcoming or weak curriculum targets;
5. create new interaction/speaking evidence;
6. return evidence to Core/Mind;
7. support delayed retrieval;
8. progressively reduce support.

Coach needs explicit scenario and feedback progressions from A1-C2.

## 7. Teach curriculum judgment

The professional framework is credible and coherent.

The next production sequence should be:

- complete T1/T2 objectization and pilot;
- author T3 production units;
- author T4 program-improvement/coaching units;
- author T5 trainer/leader units;
- connect teacher evidence to mentor/expert workflows;
- preserve separate teacher-language and professional-capability axes.

## 8. Admin, Insight and Studio curriculum judgment

### Admin

Should govern:

- program assignment;
- curriculum version;
- release state;
- institution/localization choices;
- teacher/learner access;
- policy settings.

Admin should not invent or reinterpret competencies.

### Insight

Should report:

- competency coverage;
- evidence strength;
- productive/receptive gaps;
- retrieval decay;
- teacher interventions;
- repeated misconception patterns;
- curriculum hotspots;
- accessibility/equity signals.

Insight should make curriculum quality visible at learner, cohort, course and program levels.

### Studio

Should become the governed curriculum authoring/generation product.

Studio should create only objects that pass:

- schema validation;
- competency validation;
- evidence mapping;
- cultural/localization checks;
- accessibility checks;
- curriculum versioning;
- publish-time QA.

## 9. Recommended program-development sequence

### Phase 1 — Consolidate A1 as the reference system

1. Update stale A1 implementation documentation.
2. Complete A1 Modules 2-8 production blueprints.
3. Build competency × evidence × retrieval coverage map.
4. Pilot representative learner profiles.
5. Freeze A1 production pattern v1.

### Phase 2 — Productize Coach and Teach around the same curriculum graph

1. Add Coach speaking/pronunciation curriculum architecture.
2. Add T3-T5 Teach production blueprints.
3. Formalize cross-product curriculum-consumption contract.
4. Add teacher/Coach evidence into shared QA coverage.

### Phase 3 — A2 and B1 production

1. A2 Module 1 production implementation.
2. A2 Modules 2-8 lesson blueprints.
3. B1 production lesson blueprints.
4. Pilot and calibrate support reduction by level.

### Phase 4 — B2-C2 architecture completion

1. B2 module/unit blueprints.
2. C1 module/unit blueprints.
3. C2 module/unit blueprints.
4. Exit-performance portfolios for each.

### Phase 5 — Future language launch capability

1. Select next target language.
2. Build target-language competency/profile layer.
3. Build first transfer profile.
4. Build one vertical pilot.
5. Validate that Learn/Coach/Teach/Insight/Studio reuse the same language-neutral kernel.

## 10. Curriculum scorecard

These ratings are maturity judgments, not psychometric scores.

### Architecture: 8.8 / 10

Why high:

- coherent methodology;
- competency model;
- evidence semantics;
- learner model integration;
- retrieval;
- AI constraints;
- teacher/expert support;
- cultural/linguistic specialization;
- CEFR Companion dimensions.

Why not higher yet:

- cross-language core was previously implicit;
- some product-consumption boundaries remain undocumented;
- machine-enforced curriculum QA is incomplete.

### Production curriculum coverage: 5.8 / 10

Why moderate:

- A1 has a credible production loop;
- A2/B1 are ready for authoring;
- B2-C2 remain mostly architecture;
- Teach T3-T5 and Coach progression are not yet production-complete.

### Product-curriculum integration: 7.3 / 10

Why strong:

- Core/Mind/Learn integration is real;
- Coach consumes shared learner context;
- teacher return loop exists;
- advanced authoring exists.

Remaining:

- richer Coach sessions/evidence;
- Insight curriculum analytics;
- Studio governed generation;
- Admin curriculum-version controls;
- deeper teacher productization.

### Overall curriculum program maturity: 7.1 / 10

Interpretation: Lurexa has moved beyond an LMS curriculum concept and now has the beginnings of a defensible learning system. The next risk is not conceptual weakness; it is failing to convert the strong architecture into enough calibrated, production-quality curriculum objects across levels and products.

## 11. Stop-doing list

Do not:

- redesign the core methodology repeatedly;
- mass-generate hundreds of lessons before coverage/evidence maps exist;
- treat AI conversation as free chat;
- equate course completion with CEFR mastery;
- clone English curriculum structure blindly for future languages;
- let each product invent its own competency IDs;
- let Coach create evidence that Learn/Mind cannot interpret;
- let Teach stages become badges based on content completion alone.

## 12. Definition of the next milestone

The next curriculum milestone is achieved when:

- A1 Modules 1-8 have production blueprints and complete coverage mapping;
- one A1 vertical pilot has real learner evidence across async → AI → retrieval → optional teacher return;
- Coach has an A1-C2 speaking/pronunciation practice architecture linked to curriculum competencies;
- Teach has T1-T5 production blueprint coverage;
- cross-product curriculum responsibilities are explicit;
- the language-neutral architecture can support a second target language without changing Core/Mind learning semantics.

# Lurexa Learn Curriculum Audit and Completion Plan

Status: Active curriculum-development authority  
Owner: Lurexa Learning Technologies  
Audit scope: current `Docs/Curriculum/*`, linguistic-intelligence curriculum assets, CEFR A1-C2 architecture, assessment, lesson schema, learner evidence, and teacher-development readiness

## 1. Executive judgment

The current curriculum foundation is conceptually strong and unusually implementation-aware. It already connects pedagogy to competency IDs, learning evidence, adaptive sequencing, teacher intervention, pronunciation, conversation, cultural context, and the persistent Learner Model.

The main weakness is no longer methodology. The weakness is **curriculum completeness and operational depth**.

The repository has a strong A1 production foundation, but A2-C2 remain largely architectural rather than fully mapped. The next curriculum phase must therefore move from principles to complete level architectures, competency coverage, unit sequences, assessment blueprints, and implementation-ready learning objects.

## 2. What is already strong

### 2.1 Coherent learning methodology

The learning cycle `Encounter → Understand → Practice → Retrieve → Apply → Create → Receive Feedback → Improve → Transfer → Retain` is strong and should remain the universal Lurexa cycle.

### 2.2 Performance over completion

The curriculum correctly distinguishes completion from mastery and requires productive evidence for productive competencies.

### 2.3 Stable competency layer

The `EN.<CEFR>.<FAMILY>.<COMPETENCY_NAME>` model is the correct architectural decision. It allows lessons, products, teachers, Coach, and future adaptive pathways to contribute evidence without tying learner history to one page or topic.

### 2.4 Seven explicit language skills

Listening, Speaking, Reading, Writing, Vocabulary, Grammar, and Phonetics are clearly represented. Conversation and Create & Apply provide integrated performance modes.

### 2.5 Strong Dominican-Spanish specialization

The linguistic-transfer, pronunciation, error-taxonomy, and correction-policy work provides a defensible first-market advantage while remaining extensible to other learner profiles.

### 2.6 Human + AI complementarity

The curriculum avoids the weak model of replacing teachers with AI. AI handles high-frequency practice, scaffolding, pattern detection, adaptive support, and rehearsal; teachers provide judgment, motivation, nuanced assessment, intervention, and richer interaction.

### 2.7 Evidence-aware assessment

First-attempt evidence, retries, confidence, productive evidence, revalidation, and provenance are all appropriate foundations for the Learner Model.

## 3. Critical gaps found

### Gap A — A2-C2 are not yet complete curricula

A1 contains a real production architecture. A2-C2 are still represented mainly as progression anchors. A commercially complete program requires module maps, unit purposes, progression logic, target functions, recurring language systems, integrated performance, and exit evidence for every level.

**Action:** create the full A1-C2 program map and progressively expand each level into implementation-ready unit blueprints.

### Gap B — The current competency model is A1-heavy

The stable ID system is good, but A2-C2 need explicit competency matrices before release.

**Action:** build level-specific competency matrices by family: LISTEN, SPEAK, READ, WRITE, VOCAB, GRAMMAR, PHON, CONV, CREATE, PRAG, STRAT, plus integrated CEFR Companion Volume modes described below.

### Gap C — CEFR Companion Volume coverage is incomplete

The curriculum already contains conversation and strong communicative performance, but the current CEFR model also emphasizes:

- mediation;
- online interaction;
- plurilingual/pluricultural competence;
- learners as social agents;
- action-oriented tasks.

These should not become isolated textbook units. They should be integrated competencies and performance modes distributed across levels.

**Action:** add competency families where useful:

- `MED` — mediation;
- `ONLINE` — online interaction;
- `PLURI` — plurilingual/pluricultural competence.

At low levels these remain simple and highly scaffolded. At higher levels they develop into summarizing, relaying, collaborating, facilitating understanding, reframing information, managing digital interaction, and navigating cultural/linguistic perspectives.

### Gap D — Release completeness needs measurable coverage thresholds

The existing release rule is correct but qualitative.

**Action:** every level should maintain a coverage matrix showing:

- competency coverage;
- number and type of evidence opportunities;
- receptive vs productive balance;
- conversation recurrence;
- phonetics progression;
- mediation/online interaction opportunities;
- Create & Apply coverage;
- spaced retrieval;
- assessment coverage;
- cultural breadth;
- accessibility review.

No level should be marketed as complete while a major competency family lacks repeated evidence opportunities.

### Gap E — Lesson schema needs stronger task-authenticity metadata

The schema is structurally strong, but action-oriented curriculum design benefits from explicitly identifying purpose, audience, context, and transfer.

**Recommended additions to the conceptual contract:**

```ts
type PerformanceContext = {
  purpose: string;
  audience?: string;
  realWorldDomain?: "personal" | "public" | "educational" | "occupational" | string;
  transferContext?: string;
  mediationRequired?: boolean;
  onlineInteractionRequired?: boolean;
};
```

This is a pedagogical specification. Application code should be updated by the development agent when implementation reaches this requirement.

### Gap F — Curriculum QA needs a formal review gate

Content quality cannot rely only on author intuition.

**Action:** every module moves through:

`Draft → Pedagogical Review → Linguistic Review → Assessment Review → Accessibility/UX Review → Pilot → Evidence Review → Publish → Monitor`

### Gap G — Teacher development is underdefined

The assessment document correctly states that teacher English proficiency and teaching competence are separate, but no complete teacher-development curriculum currently operationalizes that principle.

**Action:** create a dedicated Lurexa Teach professional-development curriculum with its own competencies, placement profile, pathways, evidence model, and capstones.

## 4. Curriculum completion sequence

### Phase 1 — Stabilize the complete macro-curriculum

1. Approve A1-C2 level identities.
2. Complete module maps for all six CEFR levels.
3. Define level-exit performance portfolios.
4. Add MED, ONLINE, and PLURI integration.
5. Define cross-level progression rules.

### Phase 2 — Expand competency matrices

Order:

1. A1 audit and refinement;
2. A2 full matrix;
3. B1 full matrix;
4. B2 full matrix;
5. C1 full matrix;
6. C2 full matrix.

Each matrix must identify prerequisites, evidence types, mastery expectations, transfer opportunities, and later retrieval points.

### Phase 3 — Build unit blueprints

For each module:

- module mission;
- 3-5 units;
- unit performance goal;
- core competencies;
- language functions;
- grammar/vocabulary systems;
- phonetics targets;
- listening/reading input progression;
- conversation scenarios;
- mediation/online interaction where appropriate;
- Create & Apply task;
- assessment evidence;
- retrieval links to earlier learning.

### Phase 4 — Build implementation-ready lessons

Priority order remains:

1. A1 Module 1 full production quality;
2. A1 Modules 2-8;
3. A2;
4. B1;
5. B2;
6. C1;
7. C2.

Do not mass-generate hundreds of shallow lessons before validating the learning/evidence loop.

### Phase 5 — Pilot and calibrate

Pilot evidence should answer:

- Are learners completing the intended task independently?
- Are activities producing valid evidence?
- Are hints too generous or too weak?
- Are Dominican-Spanish transfer interventions useful rather than intrusive?
- Do later retrieval activities detect actual retention?
- Does teacher feedback improve subsequent performance?
- Are AI recommendations pedagogically stable?

## 5. Cross-level design rule

Higher levels must not be produced by simply adding harder vocabulary to the same lesson pattern.

Progression should increase along multiple dimensions:

- independence;
- input speed and density;
- discourse length;
- lexical precision;
- grammatical range and control;
- phonological flexibility;
- interaction spontaneity;
- pragmatic sensitivity;
- mediation complexity;
- cultural/linguistic perspective;
- ambiguity tolerance;
- register control;
- synthesis;
- transfer to unfamiliar contexts.

## 6. English-program completion definition

The Lurexa Learn English program can be considered curriculum-complete when all six CEFR levels have:

1. approved level identity and exit outcomes;
2. complete module/unit architecture;
3. competency matrices;
4. balanced seven-skill progression;
5. conversation progression;
6. Create & Apply progression;
7. phonetics progression;
8. mediation, online-interaction, and pluricultural integration;
9. assessment blueprint;
10. level-exit portfolio;
11. retrieval/revalidation design;
12. teacher-extension guidance;
13. adaptation rules;
14. cultural breadth;
15. accessibility and UX review criteria.

## 7. Current priority

The highest-leverage next move is to complete the **A1-C2 macro-program map** while preserving A1 as the implementation priority. This gives product, content, AI, assessment, teacher, and data teams one coherent destination without forcing premature detailed authoring at C1/C2.

## 8. External framework alignment note

This audit incorporates the CEFR Companion Volume direction that extends the CEFR through mediation, online interaction, and plurilingual/pluricultural competence. These additions strengthen Lurexa's existing communicative and action-oriented methodology rather than replacing it.

For teacher development, Lurexa should remain proprietary but benchmark its coverage against major professional-development frameworks. The Cambridge English Teaching Framework is especially useful as a comparison because it distinguishes learning/learner knowledge, teaching/learning/assessment, language ability, language knowledge/awareness, and professional development/values across progressive stages.

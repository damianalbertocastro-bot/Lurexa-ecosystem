# Lurexa Curriculum Source of Truth

Status: Active curriculum authority  
Owner: Lurexa Learning Technologies  
Initial domain: English language learning  
Primary initial learner profile: Spanish speakers, optimized first for Dominican learners

## Purpose

This folder contains the pedagogical and curriculum documents that govern Lurexa Learn lesson design, assessment, learner progression, AI tutoring behavior, teacher interaction, phonetics, conversation, interactive learning activities, the educational meaning of the persistent Learner Model, and Lurexa Teach professional development.

These documents do not replace the ecosystem architecture in `Docs/Architecture/*`. Architecture owns product boundaries, trust, persistence, authorization and Core/Mind responsibilities. Curriculum documents define what learning experiences mean and how they should behave pedagogically.

## Non-negotiable delivery model

Lurexa is:

1. **asynchronous and self-paced by default** — learners must be able to make meaningful progress without waiting for a live class;
2. **AI-assisted throughout the learning cycle** — AI provides constrained explanation, scaffolding, practice, rehearsal, feedback, adaptation and retrieval support;
3. **teacher-enhanced where human support adds value** — teachers provide richer interaction, judgment, coaching, motivation, intervention and high-value assessment;
4. **expert-educator supported for high-value cases and teacher growth** — experienced educators/mentors provide teacher coaching, difficult-case consultation, calibration, curriculum interpretation and professional development;
5. **one curriculum across support modes** — Flex, Guided and Intensive use the same competency standards and learner history.

> **Lurexa is self-paced by default, AI-assisted throughout, teacher-enhanced when human support adds value, and expert-supported when deeper educational judgment or teacher development is needed.**

Teacher-supported delivery must extend the asynchronous learning path rather than become a separate curriculum or repeat the digital lesson. Expert educator support must strengthen teacher capability and difficult-case judgment rather than become a routine bottleneck.

## Read order for curriculum work

1. `00-LUREXA-LEARNING-METHODOLOGY.md`
2. `01-ENGLISH-CURRICULUM-ARCHITECTURE.md`
3. `02-ENGLISH-COMPETENCY-MODEL.md`
4. `03-LESSON-AND-ACTIVITY-SCHEMA.md`
5. `04-ASSESSMENT-MASTERY-AND-PLACEMENT.md`
6. `05-LEARNER-MODEL-EDUCATIONAL-SPEC.md`
7. `06-DOMINICAN-SPANISH-ENGLISH-LINGUISTIC-PROFILE.md`
8. `07-PHONETICS-PROGRESSION-A1-C2.md`
9. `08-CONVERSATION-FRAMEWORK.md`
10. `09-INTERACTIVE-ACTIVITY-LIBRARY.md`
11. `10-CURRICULUM-AUDIT-AND-COMPLETION-PLAN.md`
12. `11-ENGLISH-PROGRAM-MAP-A1-C2.md`
13. `12-A2-COMPETENCY-MATRIX.md`
14. `13-LEARNING-MODES-AND-AI-ASSISTANCE-ARCHITECTURE.md`
15. `14-ASYNCHRONOUS-CURRICULUM-DESIGN-STANDARD.md`
16. `15-TEACHER-SUPPORT-AND-INTERVENTION-MODEL.md`
17. `16-AI-TUTOR-PEDAGOGICAL-CONTRACT.md`
18. `17-A2-MODULE-AND-UNIT-BLUEPRINTS.md`
19. `18-B1-COMPETENCY-MATRIX.md`
20. `19-EXPERT-EDUCATOR-MENTORSHIP-AND-ESCALATION.md`
21. `20-A1-MODULE-1-PRODUCTION-BLUEPRINT.md`
22. `21-A1-LEARNING-LOOP-VALIDATION-AND-PILOT-SPEC.md`
23. `22-A2-MODULE-1-PRODUCTION-LESSON-BLUEPRINT.md`
24. `23-B1-MODULE-AND-UNIT-BLUEPRINTS.md`
25. `24-CURRICULUM-COVERAGE-AND-QA-GATES.md`
26. `25-B2-COMPETENCY-MATRIX.md`
27. `26-C1-COMPETENCY-MATRIX.md`
28. `27-C2-COMPETENCY-MATRIX.md`
29. `28-A1-IMPLEMENTED-ACTIVITY-AUDIT-AND-MAPPING.md`
30. `Teacher-Development/00-LUREXA-TEACH-PROFESSIONAL-DEVELOPMENT-PROGRAM.md`
31. `Teacher-Development/01-TEACHER-COMPETENCY-FRAMEWORK.md`
32. `Teacher-Development/02-TEACHER-ASSESSMENT-PLACEMENT-AND-ADVANCEMENT.md`
33. `Teacher-Development/03-ASYNCHRONOUS-AI-ASSISTED-PROGRAM-DELIVERY.md`
34. `Teacher-Development/04-T1-PRODUCTION-LEARNING-BLUEPRINTS.md`
35. `Teacher-Development/05-T2-PRODUCTION-LEARNING-BLUEPRINTS.md`

Also read `Linguistic-Intelligence/*` when working on learner errors, feedback, pronunciation, transfer, confidence or Coach/Learn adaptive behavior.

## Governing learner principle

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

And pedagogically:

> **Lurexa remembers learning.**

Learning evidence must influence what the learner sees, practices, reviews, skips, receives feedback on, and is recommended next.

For professional learning, the equivalent design principle is:

> **One teacher. One evolving professional profile. Every development experience builds on demonstrated capability.**

Expert educator support adds a mentorship and escalation layer over that professional profile. Its goal is to strengthen future teacher independence and convert recurring expert insights into reusable institutional knowledge.

## Current curriculum state

The methodology, delivery architecture and quality-control model are now mature enough to guide implementation.

- A1 Module 1 has a production-ready lesson blueprint and is the reference slice for proving the complete async + AI + evidence + optional teacher loop.
- The already-implemented A1 activities have now been audited against the production blueprint. The canonical runtime now seeds the five-unit A1 Module 1 sequence (`Meeting People`, `Who Am I?`, `People Around Me`, `Spell It, Please`, and `Real-Life Introductions`); the existing entry lesson ID remains canonical for active learner links and the legacy preview redirects to it.
- Critical A1 evidence mismatches were corrected: the canonical lesson now uses supported evidence event types and authoritative `EN.<CEFR>.<FAMILY>.<COMPETENCY_NAME>` IDs.
- The canonical A1 lesson now adds guided free-response production, retrieval without a visible answer, and temporary model-listening exposure while preserving the tested vocabulary, phonetics, Create & Apply and quiz interactions.
- Authenticated, bounded A1 scenario conversation and recorded-speaking evidence are available through server-authorized runtime capabilities. Cross-session delayed retrieval, evidence-driven adaptive routing, teacher brief/return loop, expert escalation, and Firebase Emulator end-to-end validation remain implementation gates rather than being simulated as complete.
- A1 has a formal validation/pilot specification; A1 Modules 2–8 should inherit the validated production pattern after the Module 1 loop is proven.
- A2 has a complete competency matrix, module/unit blueprints and a production lesson blueprint for Module 1.
- B1 has a detailed competency matrix plus module/unit blueprints and is ready for production lesson authoring.
- B2, C1 and C2 now have detailed competency matrices and should move into module/unit blueprints in sequence.
- Formal curriculum coverage and QA gates govern module, level and teacher-development release decisions.
- Lurexa Teach has macro-program, competency, assessment, async-delivery, T1 production and T2 production blueprints.
- Expert educator mentorship and escalation are integrated into learner-support and teacher-development architecture.

## Implementation and curriculum sequence

Do not block A1 production on exhaustive C2 lesson authoring, but keep curriculum architecture ahead of product implementation.

Current best sequence:

1. validate the complete seeded A1 Module 1 bundle against `20`, `21` and `28` through Firebase Emulator flows;
2. extract the proven A1 interactions into structured reusable activity components/contracts;
3. implement real AI scenario conversation, real spoken evidence, persistent attempts/resume, delayed retrieval and evidence-driven adaptation;
4. complete the teacher brief → live intervention → returned async recommendation loop;
5. apply the validated pattern to A1 Modules 2–8;
6. implement A2 Module 1 from `22`, then continue A2 module by module;
7. convert B1 unit blueprints into production lesson blueprints;
8. build B2 module/unit blueprints, followed by C1 and C2;
9. move T1/T2 teacher-development blueprints into product learning objects and AI simulations;
10. apply `24-CURRICULUM-COVERAGE-AND-QA-GATES.md` before any level/stage is marketed as complete;
11. pilot teacher → expert educator mentorship/escalation and convert recurring expert insights into reusable curriculum/Teach assets.

## Curriculum object requirement

New unit and lesson blueprints must state, where relevant:

- learner performance goal;
- competency IDs;
- prerequisite/retrieval targets;
- asynchronous learning sequence;
- AI pedagogical role;
- expected learning evidence;
- Create & Apply/transfer;
- teacher extension or intervention point;
- expert educator escalation point where appropriate;
- mastery/assessment behavior;
- accessibility/resume considerations.

This prevents future content from being designed as a classroom lesson first and digitized afterward.

## CEFR Companion integration

The English competency model includes level-appropriate integration of:

- mediation;
- online interaction;
- plurilingual/pluricultural competence;
- action-oriented performance.

These dimensions complement rather than replace the seven explicit Lurexa English skills.

## Related authority

Before implementing persistent learner state, personalization, AI interpretation, or cross-product learning context, also read:

- `Docs/00-Lurexa-Bible.md`
- `Docs/Architecture/Learner Model Architecture.md`
- `Docs/Architecture/Capability Architecture.md`
- `AGENTS.md`

## Conflict rule

When instructions conflict, prefer the newest explicit product-owner decision, then `Docs/00-Lurexa-Bible.md`, then authoritative architecture documents, then this curriculum folder. Within this folder, lower-numbered documents define broader rules and later documents specialize them without overriding them silently.

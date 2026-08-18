# Lurexa Curriculum Source of Truth

Status: Active MVP curriculum authority  
Owner: Lurexa Learning Technologies  
Initial domain: English language learning  
Primary initial learner profile: Spanish speakers, optimized first for Dominican learners

## Purpose

This folder contains the pedagogical and curriculum documents that govern Lurexa Learn lesson design, assessment, learner progression, AI tutoring behavior, teacher interaction, phonetics, conversation, interactive learning activities, and the educational meaning of the persistent Learner Model.

These documents do not replace the ecosystem architecture in `Docs/Architecture/*`. Architecture owns product boundaries, trust, persistence, authorization and Core/Mind responsibilities. Curriculum documents define what learning experiences mean and how they should behave pedagogically.

## Read order for MVP curriculum work

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

## Governing product principle

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

And pedagogically:

> **Lurexa remembers learning.**

Learning evidence must influence what the learner sees, practices, reviews, skips, receives feedback on, and is recommended next.

## MVP implementation rule

For the current MVP, A1 should be production-ready first. A2 should be substantially designed next. B1-C2 may begin with stable progression architecture and be deepened before those levels are released.

Do not block MVP lesson implementation on exhaustive C2 documentation.

## Related authority

Before implementing persistent learner state, personalization, AI interpretation, or cross-product learning context, also read:

- `Docs/00-Lurexa-Bible.md`
- `Docs/Architecture/Learner Model Architecture.md`
- `Docs/Architecture/Capability Architecture.md`
- `AGENTS.md`

## Conflict rule

When instructions conflict, prefer the newest explicit product-owner decision, then `Docs/00-Lurexa-Bible.md`, then authoritative architecture documents, then this curriculum folder. Within this folder, lower-numbered documents define broader rules and later documents specialize them without overriding them silently.

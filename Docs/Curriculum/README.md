# Lurexa Curriculum Source of Truth

Status: Active MVP curriculum authority  
Owner: Lurexa Learning Technologies  
Initial domain: English language learning  
Primary initial learner profile: Spanish speakers, optimized first for Dominican learners

## Purpose
This folder governs Lurexa learning methodology, English curriculum architecture, lesson/activity contracts, assessment, learner memory, phonetics, conversation, cultural adaptation, teacher interaction, access tiers and curriculum implementation.

These documents do not replace `Docs/Architecture/*`. Architecture owns product boundaries, trust, authorization, persistence and Core/Mind responsibility. Curriculum documents define educational meaning and behavior.

## Governing principles
> **One learner. One evolving model. Every Lurexa experience adapts around it.**

> **Lurexa remembers learning.**

> **Completion is not mastery.**

## Core MVP authority — read first
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

## Curriculum expansion and delivery
11. `10-CEFR-COMPETENCY-MATRIX-A1-C2.md`
12. `11-CULTURAL-ADAPTATION-FRAMEWORK.md`
13. `12-54-WEEK-LEARNING-PROGRAM.md`
14. `13-FREE-AND-PAID-LEARNING-ACCESS.md`
15. `14-HUMAN-TEACHER-METHODOLOGY.md`
16. `15-TEACHER-PROFICIENCY-AND-DEVELOPMENT.md`
17. `16-AI-TUTORING-PEDAGOGY.md`

## Engineering / Codex implementation handoff
18. `17-MVP-LEARNING-UX-AND-DATA-MIGRATION.md`
19. `18-A1-CURRICULUM-MAP.md`
20. `19-A1-MODULE-1-UNIT-1-VERTICAL-SLICE.md`
21. `20-PLACEMENT-TEST-MVP-BLUEPRINT.md`
22. `21-LESSON-PLAYER-UX-SPEC.md`
23. `22-MVP-CURRICULUM-IMPLEMENTATION-BACKLOG.md`
24. `23-A1-MODULE-1-UNITS-2-3.md`
25. `24-A1-MODULE-1-ASSESSMENT-AND-LIVE-PRACTICE.md`
26. `25-PLACEMENT-ITEM-BANK-A1-A2.md`
27. `26-MEDIA-AND-INTERACTIVE-CARD-ASSET-STANDARD.md`
28. `27-A1-MODULES-2-8-PRODUCTION-SPEC.md`
29. `Seeds/A1-M1-U1.json` — machine-readable Unit 1 seed

## Read paths by task
### Building or redesigning the lesson player
Read: 00, 03, 09, 17, 19, 21, 22, 26.

### Building placement/progression
Read: 02, 04, 05, 10, 20, 25.

### Building AI tutor/conversation
Read: 05, 06, 08, 16, 19.

### Building pronunciation/Coach integration
Read: 05, 06, 07, 16, 24, 26.

### Building teacher meetings/assignments
Read: 12, 14, 15, 24.

### Implementing free/paid learning access
Read: 04, 12, 13.

### Creating A1 content
Read: 00, 01, 02, 06-11, 18, 19, 23, 24, 26, 27.

## MVP priority
A1 now has complete production architecture from Module 1 through Module 8. Engineering should still validate the vertical slice before scaling content implementation. A2 is the next curriculum-design level. B1-C2 retain stable cross-level architecture and are expanded before release.

Do not delay the MVP until every future C2 lesson exists. Prove one complete vertical learning loop first.

## Current vertical slice target
`A1 -> Module 1: Hello, This Is Me -> Unit 1: Meeting People`

The target includes four lessons and must prove:
Placement -> lesson recommendation -> interactive vocabulary -> listening -> phonetics -> speaking/conversation -> Create & Apply -> quiz -> evidence -> learner-model interpretation -> remembered adaptation.

Once Unit 1 is technically proven, Units 2 and 3 in file 23 complete the first content module; file 24 provides its assessment/live-practice layer; file 27 defines the remaining A1 modules and rollout order.

## Architecture references
Before implementing persistent learner state, personalization, AI interpretation or cross-product learning context, also read:
- `Docs/00-Lurexa-Bible.md`
- `Docs/Architecture/Learner Model Architecture.md`
- `Docs/Architecture/Capability Architecture.md`
- `Docs/Architecture/Capability Interaction Matrix.md`
- `AGENTS.md`

## Conflict rule
Prefer the newest explicit product-owner decision, then `Docs/00-Lurexa-Bible.md`, then authoritative architecture, then this curriculum folder. Lower-numbered curriculum documents define broader rules; later files specialize them without silently overriding them.
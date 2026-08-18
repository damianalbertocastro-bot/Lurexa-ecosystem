# Lurexa AI Development Rules

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant documentation in the installed Next.js package or current official documentation available to the development environment. Do not assume framework behavior from stale model knowledge.

<!-- END:nextjs-agent-rules -->

## Authoritative Lurexa architecture

```text
Lurexa Learning Technologies
│
├── Shared ecosystem layers
│   ├── Lurexa Core — trust, identity, authorization, persistence,
│   │                 authoritative records and platform services
│   └── Lurexa Mind — learning interpretation, personalization,
│                     adaptation and AI learning intelligence
│
└── Products
    ├── Lurexa Learn
    ├── Lurexa Coach
    ├── Lurexa Teach
    ├── Lurexa Admin
    ├── Lurexa Insight
    └── Lurexa Studio
```

Core and Mind are shared ecosystem layers, not ordinary end-user products.

## Learner Model rule

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Products generate learning experiences and evidence. Lurexa Mind interprets authorized evidence. Lurexa Core owns trusted records, identity, authorization and persistence.

The Learner Model is the persistent evolving representation of the learner across the ecosystem. Do not model it as a separate learner profile owned by each product or as an ungoverned database owned solely by Mind.

Before implementing personalization, recommendations, learner memory, CEFR adaptation, pronunciation profiles, speaking intelligence or cross-product learner state, read:

- `Docs/00-Lurexa-Bible.md`
- `Docs/Architecture/Learner Model Architecture.md`
- `Docs/Architecture/Capability Architecture.md`
- `Docs/Architecture/Capability Interaction Matrix.md`
- `Docs/Architecture/Dependency Graph.md`
- `.ai/architecture/architecture.md`
- `.ai/architecture/decisions.md`
- `.ai/context/products.md` when relevant
- `.ai/codex.md` when working with Codex

## Core rules

Lurexa Core owns or governs:

- identity/authentication;
- authorization/permissions;
- trusted learner records;
- persistence;
- evidence provenance;
- shared platform services;
- cross-product data contracts;
- approved persistence of derived observations.

Never bypass Core trust boundaries merely because direct database access is technically possible.

## Mind rules

Lurexa Mind interprets authorized learning evidence and may produce:

- learner-state interpretations;
- personalization;
- recommendations;
- adaptive experiences;
- intervention suggestions;
- tutoring/coaching intelligence;
- speaking/pronunciation intelligence;
- L1-transfer intelligence;
- assessment/content intelligence.

Mind does not independently own authentication, authorization or authoritative persistence.

## Product rules

Products deliver experiences and generate evidence.

Do not:

- create separate authoritative learner profiles per product;
- copy learner profiles between products as the primary integration pattern;
- allow product UIs to mutate arbitrary inferred learner state;
- couple product clients directly to model providers for persistent learning intelligence;
- make a product depend on another product's private learner state.

Use supported Core/Mind contracts instead.

## Lurexa Coach rule

Lurexa Coach is an AI-powered English speaking and pronunciation product.

Its first deep linguistic specialization is Dominican Spanish speakers learning English.

Coach must:

- use authorized existing learner context when relevant;
- avoid asking the learner to start over when reliable context already exists;
- prioritize intelligibility, naturalness, fluency, pronunciation refinement and spoken confidence;
- identify meaningful recurring pronunciation/speaking patterns;
- support targeted corrective practice;
- support Dominican-Spanish-to-English linguistic transfer pedagogically;
- remain extensible to additional L1 linguistic profiles;
- contribute new evidence through approved Core boundaries.

Coach must **not** optimize for accent erasure and must not become a second Mind architecture.

## Commercial direction

The thesis prototype is a validation/reference artifact only.

The active target is the scalable commercial Lurexa ecosystem. Do not reintroduce thesis-specific architecture constraints into production code unless explicitly requested and justified.

## Repository-change discipline

A conceptual architecture change does not automatically require package renaming or immediate refactoring.

Before moving or renaming code:

1. inspect the actual module/package responsibility;
2. map it to Core, Mind, product or shared experience infrastructure;
3. identify a real boundary violation or reuse need;
4. define/update the relevant contract;
5. make the smallest justified repository change.

Never claim a capability is implemented without verifying repository state.

## Tech stack direction

Current repository direction includes:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Firebase
- Turborepo + pnpm
- approved model/speech providers behind Lurexa Mind

Technology choices may evolve; architecture responsibility does not change automatically with a vendor change.

## Engineering rules

- Use TypeScript for new application code where TypeScript is expected.
- Avoid `any`; justify unavoidable exceptions.
- Do not hardcode colors when a Design Token exists.
- Follow the shared UI Component Library and reuse components before creating duplicates.
- Do not duplicate domain logic across products.
- Prefer Server Components when appropriate; use client-side state when the interaction requires it.
- Never access Firestore directly from UI components for trusted domain mutations.
- Never call AI providers directly from product UI code for production learning intelligence.
- Check Core/Mind/product ownership before adding a domain service.
- Apply authorization and data minimization before exposing learner context to AI services.
- Keep evidence distinguishable from AI interpretation.
- Preserve provenance for learner evidence and important derived observations.
- Do not rename packages solely to make the filesystem mirror product branding.

## Curriculum and learning-experience rules

Before implementing or redesigning Lurexa Learn lessons, curriculum pages, placement, quizzes, mastery/progression, vocabulary experiences, listening/speaking practice, phonetics, AI conversation, Create & Apply tasks, teacher-assigned learning activities, or learner-facing learning recommendations, read:

- `Docs/Curriculum/README.md`
- `Docs/Curriculum/00-LUREXA-LEARNING-METHODOLOGY.md`
- `Docs/Curriculum/01-ENGLISH-CURRICULUM-ARCHITECTURE.md`
- `Docs/Curriculum/02-ENGLISH-COMPETENCY-MODEL.md`
- `Docs/Curriculum/03-LESSON-AND-ACTIVITY-SCHEMA.md`
- `Docs/Curriculum/04-ASSESSMENT-MASTERY-AND-PLACEMENT.md`
- `Docs/Curriculum/05-LEARNER-MODEL-EDUCATIONAL-SPEC.md`
- `Docs/Curriculum/06-DOMINICAN-SPANISH-ENGLISH-LINGUISTIC-PROFILE.md` when English L1-transfer/cultural adaptation is relevant
- `Docs/Curriculum/07-PHONETICS-PROGRESSION-A1-C2.md` for pronunciation/phonetics work
- `Docs/Curriculum/08-CONVERSATION-FRAMEWORK.md` for AI/human conversation work
- `Docs/Curriculum/09-INTERACTIVE-ACTIVITY-LIBRARY.md` for lesson/activity UX

Curriculum implementation rules:

- Treat `Docs/Curriculum/00-LUREXA-LEARNING-METHODOLOGY.md` as the broad pedagogical authority for learning-experience behavior.
- Model lessons and activities as structured learning objects; do not hard-code the curriculum as long static page copy when a reusable schema is appropriate.
- Keep stable competency IDs independent from lesson titles and cultural contexts.
- Preserve the seven English skills: listening, speaking, reading, writing, vocabulary, grammar and phonetics. Treat conversation and Create & Apply as integrated modes.
- Build interactive vocabulary behavior rather than defaulting to static front/back flashcards.
- Do not treat lesson completion or a single quiz score as mastery.
- Preserve first-attempt evidence separately from eventual success after hints/retries.
- Placement should respect prior knowledge and must not force knowledgeable learners through A1 solely because of account tier or content availability.
- Subscription tier may change access, pace and feature limits, but must not redefine proficiency or deliberately weaken pedagogy.
- AI-generated learning content must declare objective, competency, expected learner action/output, feedback behavior and evidence purpose.
- When learner memory influences UX, keep evidence and Mind interpretation distinct and use approved Core/Mind contracts.
- Initial English content should be culturally relevant to Dominican/Spanish-speaking learners while progressively broadening toward Caribbean, Latin American and international/global contexts.
- Phonetics optimizes for intelligibility and communicative control, not accent erasure.
- Live teacher time should prioritize retrieval, interaction, application, creation and human feedback instead of simply duplicating asynchronous explanation.

For the MVP, prioritize a complete A1 vertical slice that proves placement/recommended start → interactive lesson → speaking/listening/phonetics → conversation → Create & Apply → quiz/evidence → remembered learner context → next recommendation. Do not block the MVP on exhaustive C2 content.

## Source-of-truth rule

When instructions conflict, prefer the newest explicit product-owner decision, then `Docs/00-Lurexa-Bible.md`, then detailed `Docs/Architecture/*` documents, then applicable `Docs/Curriculum/*` pedagogical documents, then `ROADMAP.md`, then AI helper files. Mark old assumptions as superseded instead of blending them.
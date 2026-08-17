# Lurexa AI Development Rules

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

## Company Architecture

Lurexa is organized as:

```text
Lurexa Learning Technologies
├── Lurexa Core — trusted platform foundation
├── Lurexa Mind — shared learning intelligence
└── Products — Learn, Coach, Teach, Admin, Insight, Studio
```

Products compose Core and Mind capabilities. Do not duplicate shared platform or intelligence logic inside product applications.

## Learner Model Rule

> One learner. One evolving model. Every Lurexa experience adapts around it.

Products observe learner activity. Lurexa Mind interprets authorized learning evidence. Lurexa Core owns trusted platform state, authorization, and persistence.

Before implementing personalization, recommendations, Coach context/memory, pronunciation profiles, CEFR adaptation, or cross-product learner state, read:

- `Docs/Architecture/Learner Model Architecture.md`
- `Docs/Architecture/Capability Architecture.md`
- `.ai/context/products.md`
- `.ai/codex.md`

Do not create separate learner profiles or personalization engines per app.

## Lurexa Coach Rule

Lurexa Coach is the speaking and pronunciation product, initially focused on Dominican Spanish speakers learning English.

Coach must:

- adapt conversation to the learner's current CEFR/context when available
- use authorized learner history rather than repeatedly asking for known information
- prioritize intelligibility, naturalness, and useful pronunciation refinement rather than accent erasure
- support Dominican-Spanish-to-English transfer analysis through Lurexa Mind
- remain a product that consumes Mind; it must not become a second AI architecture

## Tech Stack

- Next.js
- TypeScript
- TailwindCSS
- Firebase
- Gemini / approved model providers behind Lurexa Mind
- Turborepo

## Rules

- Never use JavaScript for new application code where TypeScript is expected.
- Never use `any` without an explicit, justified exception.
- Never hardcode colors when a Design Token exists.
- Follow the UI Component Library.
- Reuse components before creating new ones.
- Do not duplicate logic.
- Prefer Server Components unless client-side state is required.
- Never access Firestore directly from UI components.
- Never call AI model providers directly from product UI code.
- Check Core/Mind/product ownership before adding a new domain service.
- Apply authorization and data minimization before exposing learner context to AI services.

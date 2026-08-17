# CURSOR.md

# Lurexa Cursor Development Instructions

Version: 1.1  
Last updated: 2026-08-17

## Role

You are Cursor, the primary AI coding assistant working inside the Lurexa repository. Implement, debug and improve the codebase while protecting architecture, design-system consistency, security, learner privacy and existing user changes.

## Authoritative architecture

```text
Lurexa Learning Technologies
├── Lurexa Core — trust, identity, authorization, persistence,
│                 authoritative records and shared platform services
├── Lurexa Mind — interpretation, personalization, adaptation,
│                 AI tutoring/coaching and learning intelligence
└── Products — Learn, Coach, Teach, Admin, Insight, Studio
```

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Products generate learning experiences and evidence. Mind interprets authorized evidence. Core owns trusted learner records, authorization and persistence.

Do not create separate learner truth per application or treat Mind as an independent persistence/authorization layer.

## Required context

Before major work, review:

- `AGENTS.md`
- `Docs/00-Lurexa-Bible.md`
- relevant `Docs/Architecture/*` documents
- `.ai/architecture/architecture.md`
- `.ai/architecture/decisions.md`
- `.ai/context/stack.md`
- `.ai/context/conventions.md`
- `.ai/context/products.md`

For UI work, also inspect shared UI/tokens and relevant design-system documentation.

## Before editing code

1. Inspect the current implementation.
2. Search for existing patterns/components/services.
3. Identify the smallest justified change.
4. Classify ownership: Core, Mind, product or shared experience infrastructure.
5. Check learner-data/privacy impact.
6. Preserve existing user work.
7. Do not move/rename packages merely to mirror the brand architecture.

## Product/Core/Mind boundaries

Never:

- access Firestore directly from UI components for trusted domain mutations;
- write arbitrary inferred learner state from a product UI;
- call model providers directly from product UI for production learning intelligence;
- copy learner profiles between products as the integration model;
- create product-specific authentication, authorization or learner-memory foundations when shared capability exists.

Prefer:

```text
Product component
  ↓
SDK / capability interface
  ↓
Core or Mind service
  ↓
Infrastructure/provider adapter
```

For adaptive AI:

```text
Product
  ↓
Core authorization + learner context
  ↓
Mind intelligence
  ↓
validated response / derived observation
  ↓
Core-governed persistence when needed
```

## Lurexa Coach

Coach is the AI-powered English speaking/pronunciation product, initially specialized for Dominican Spanish speakers learning English.

Coach should use authorized context already known by Lurexa, prioritize intelligibility, naturalness, fluency, pronunciation refinement and confidence, and contribute new evidence through Core-governed boundaries.

Accent erasure is not a goal. Dominican Spanish is the first deep L1 profile, not a permanent technical limit.

## Commercial scope

The thesis prototype is a validation/reference artifact. Production implementation targets the commercial multi-product ecosystem.

## Repository and UI discipline

- Use the existing pnpm/Turborepo structure.
- Reuse `@lurexa/ui` and `@lurexa/tokens` where applicable.
- Search before creating duplicate components.
- Prefer existing project patterns over unnecessary new abstractions.
- Avoid unrelated reformatting or refactors.
- Keep UI concerns separate from domain/data/AI concerns.
- Use TypeScript where expected.
- Follow current Next.js guidance in the installed/current documentation before relying on model memory.

## Testing and verification

After changes, use the repository's supported affected-scope quality checks. Typical commands may include lint, type-check, tests and build, but verify package scripts before assuming they exist everywhere.

For learner/AI features, test relevant authorization, missing/stale context, privacy boundaries, provider failure and evidence/inference behavior.

## Communication

When reporting changes, state:

1. what changed;
2. why;
3. files affected;
4. verification performed;
5. risks/remaining work.

Never claim something is implemented or passing without checking it.

## Final rule

Improve the codebase without turning conceptual architecture alignment into unnecessary code churn.
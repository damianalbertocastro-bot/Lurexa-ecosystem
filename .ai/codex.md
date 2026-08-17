# CODEX.md

# Lurexa Codex Engineering Instructions

Version: 1.2  
Last updated: 2026-08-17

## Role

You are Codex, a senior software engineer working on the Lurexa commercial ecosystem. Protect architecture integrity, security, maintainability, learner privacy, cross-product consistency and developer experience.

## Mandatory architecture context

```text
Lurexa Learning Technologies
├── Lurexa Core — trust, identity, authorization, persistence,
│                 authoritative records and shared platform services
├── Lurexa Mind — interpretation, personalization, adaptation,
│                 AI tutoring/coaching and learning intelligence
└── Products — Learn, Coach, Teach, Admin, Insight, Studio
```

Core and Mind are shared ecosystem layers, not ordinary end-user products.

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Products generate experiences and evidence. Mind interprets authorized evidence. Core owns trusted records, authorization and persistence. The Learner Model is the cross-product evolving representation produced by this governed relationship; it is not an independent Mind-owned database.

Before learner-state, personalization, Coach, AI or cross-product work, read:

- `AGENTS.md`
- `Docs/00-Lurexa-Bible.md`
- `Docs/Architecture/Learner Model Architecture.md`
- `Docs/Architecture/Capability Architecture.md`
- `Docs/Architecture/Capability Interaction Matrix.md`
- `Docs/Architecture/Dependency Graph.md`
- `.ai/architecture/architecture.md`
- `.ai/architecture/decisions.md`
- `.ai/context/products.md`

## Core/Mind/product rules

- Do not create independent authoritative learner profiles per product.
- Do not let product UI directly mutate arbitrary inferred learner state.
- Do not let product UI call AI/model providers directly for production learning intelligence.
- Do not let Mind bypass Core authorization or become the authoritative persistence layer.
- Preserve evidence vs. inference and provenance where appropriate.
- Request only task-relevant learner context.
- Use supported contracts/services rather than cross-product database coupling.

## Lurexa Coach

Coach is the AI-powered English speaking/pronunciation product, initially specialized for Dominican Spanish speakers learning English.

Coach should prioritize intelligibility, naturalness, fluency, pronunciation refinement, spoken confidence, recurring-pattern identification, corrective practice and Dominican-Spanish-to-English transfer awareness.

The objective is not accent erasure. Dominican Spanish is the first deep L1 profile, not a permanent limit. Additional L1 profiles must fit without redesigning Coach or the Learner Model.

Coach consumes Core/Mind capabilities and contributes evidence through Core-governed boundaries. Coach must not become a second Mind.

## Commercial scope

The thesis prototype is a validation/reference artifact. Production decisions optimize for the scalable commercial ecosystem.

## Before writing code

1. Inspect the existing implementation.
2. Read relevant architecture and product documentation.
3. Search for existing packages/components/services.
4. Classify ownership: Core, Mind, product, or shared experience infrastructure.
5. Identify learner-data/privacy impact.
6. Choose the smallest complete change.
7. Do not rename/move packages merely to mirror branding.

Never claim a capability is implemented without verifying repository state.

## Repository direction

Use the existing pnpm/Turborepo monorepo. Existing packages such as `@lurexa/auth`, `@lurexa/database`, `@lurexa/backend`, `@lurexa/sdk`, `@lurexa/types`, `@lurexa/ui`, `@lurexa/tokens`, `@lurexa/config` and `@lurexa/utils` should be inspected and mapped before restructuring.

Preferred product/service dependency flow:

```text
Product UI
  ↓
SDK / capability interface
  ↓
Core or Mind domain/application service
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
validated response / recommendation / derived observation
  ↓
Core-governed persistence when required
```

## Engineering rules

- TypeScript-first where expected.
- Avoid `any` unless explicitly justified.
- Reuse shared UI/components and design tokens.
- Do not duplicate domain logic.
- Never access Firestore directly from UI components for trusted mutations.
- Keep model-provider SDK types behind Mind/provider boundaries.
- Handle AI timeout, retry, error, cost, privacy and evaluation concerns.
- Treat offline evidence reconciliation as a trust problem before it affects persistent learner state.
- Add tests for authorization, missing/stale context, evidence/inference behavior and safe AI fallbacks where relevant.

## Definition of done

A task is complete when affected code builds and passes the repository's supported quality checks, documentation is updated, architecture ownership is clear, privacy/authorization are preserved and no unnecessary duplicate learner truth has been introduced.

## Final rule

Optimize for the ecosystem, not just the current screen or task.

> **Products create experiences and evidence. Mind interprets learning. Core owns trust.**
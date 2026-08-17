# Repository Capability Mapping

Status: Active
Last updated: 2026-08-17

## Purpose

This document maps the repository that exists today to the authoritative Lurexa architecture without forcing package names to mirror product branding.

Architectural ownership is conceptual. Physical package changes should happen only when cohesion, security, scaling, or deployment boundaries justify them.

## Authoritative responsibility model

> Products generate learning experiences and evidence.
>
> Lurexa Mind interprets authorized evidence and produces learning intelligence.
>
> Lurexa Core owns trust, identity, authorization, persistence, and authoritative records.
>
> The Learner Model is the persistent evolving representation of the learner across the ecosystem.

## Verified repository baseline

The current monorepo contains shared packages including:

- `@lurexa/auth`
- `@lurexa/backend`
- `@lurexa/config`
- `@lurexa/database`
- `@lurexa/sdk`
- `@lurexa/types`
- `@lurexa/ui`
- `@lurexa/tokens`
- `@lurexa/utils`
- shared ESLint and TypeScript configuration packages

The current backend package contains services for authentication, organizations, courses, progress, AI generation, AI guardrails, analytics, offline sync, billing, administration, ecosystem behavior, telemetry, and Firebase integration.

## Capability ownership map

| Repository area | Architectural owner | Current role | Direction |
|---|---|---|---|
| `@lurexa/auth` | Core | Authentication primitives | Keep as Core capability |
| `@lurexa/database` | Core | Persistence abstraction | Expand through explicit repositories; do not expose persistence directly to product UI |
| `@lurexa/backend` | Mixed implementation host | Existing server/domain services | Classify services by Core/Mind responsibility before splitting physical packages |
| `@lurexa/types` | Shared contracts | Canonical domain types | Home for cross-boundary learner contracts |
| `@lurexa/sdk` | Core-facing application contract | Generic SDK helpers | Expose supported product-facing capability interfaces |
| `@lurexa/config` | Shared infrastructure | Configuration | Keep neutral/shared |
| `@lurexa/utils` | Shared infrastructure | Generic utilities | Keep domain-neutral |
| `@lurexa/ui` | Shared product infrastructure | UI components | No learner persistence or AI-provider logic |
| `@lurexa/tokens` | Shared product infrastructure | Design tokens | No domain logic |
| `apps/*` | Products | User experiences | Generate experiences/evidence and consume authorized context |

## Backend service classification

### Core-aligned

Existing services whose primary responsibility belongs to Core include:

- authentication
- organizations
- courses/content records
- progress persistence
- billing
- administration
- offline synchronization
- telemetry/event infrastructure
- Firebase/platform integration

### Mind-aligned or Mind-adjacent

Existing AI generation and AI guardrail services are candidates for eventual Mind ownership. Their current physical location in `@lurexa/backend` is not itself an architecture violation.

Before moving them, define stable interfaces and determine whether they contain provider-specific code, pedagogical interpretation, or generic server infrastructure.

### Requires review

Analytics and ecosystem services may contain both trusted platform behavior and derived intelligence. They must be inspected capability-by-capability rather than assigned wholesale to Core or Mind.

## Learner contract foundation implemented

The repository now defines three distinct concepts in `@lurexa/types`:

- `LearnerContext` — scoped information an authorized product may consume.
- `LearningEvidence` — observations contributed by products or authorized actors.
- `LearnerInsight` — interpreted learning intelligence derived from evidence.

Supporting source, provenance, CEFR, domain, request, and submission types are also defined.

The separation is intentional:

```text
Evidence != Insight != Context
```

A product may record an observation. It must not promote that observation into authoritative interpreted learner state by itself.

## SDK boundary implemented

`@lurexa/sdk` now exposes a `LearnerModelService` interface with three operations:

1. request authorized learner context;
2. submit learning evidence;
3. submit an interpreted insight for authorized persistence.

This is a contract, not yet a network transport implementation.

## Persistence boundary implemented

`@lurexa/database` now exposes repository contracts for:

- append-only learning evidence;
- active learner insights.

No Firestore collection layout is mandated by these interfaces.

## Core service boundary implemented

`@lurexa/backend` now exposes a Core-owned learner-model boundary that requires injected authorization before:

- reading learner context;
- accepting learning evidence;
- persisting a learner insight.

The service deliberately does not infer learning state. Interpretation remains a Mind responsibility.

## Important verified technical debt

The existing `ProgressService` accesses Firestore directly inside `@lurexa/backend`, and current Firestore rules allow any authenticated user to read and write documents in `/progress/{progressId}`.

That existing rule is too broad for the future cross-product Learner Model and must not be copied for learner evidence or insights.

Learner-model persistence should therefore be introduced behind a server-authorized Core boundary with least-privilege rules rather than by giving product clients direct access to new learner collections.

## Do not do yet

Do not yet:

- create a giant `learnerModel` Firestore document;
- rename `@lurexa/backend` to `core`;
- create a monolithic `@lurexa/mind` package solely for branding;
- expose learner evidence or insight collections directly to product clients;
- let Coach or Learn write interpreted learner state directly;
- migrate existing progress records without an explicit migration requirement.

## Next implementation sequence

1. Define concrete authorization semantics for learner-context reads and evidence writes.
2. Define a server-side persistence adapter for evidence and insights.
3. Define a context assembler that creates task-scoped `LearnerContext` from trusted Core records and approved active insights.
4. Define the first Mind interpretation interface separately from Core persistence.
5. Connect one narrow Learn flow to submit real `LearningEvidence`.
6. Add tests for authorization, provenance, duplicate/idempotent submissions, stale insights, and partial context.
7. Only then finalize Firestore collection/index structure based on actual query requirements.

## Governing principle

> One learner. One evolving model. Every Lurexa experience adapts around it.

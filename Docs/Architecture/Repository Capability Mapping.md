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

The current `learn-web` application already contains learner-facing Learn routes and a Coach route. It also contains legacy/future-facing routes such as marketplace/developer areas. Their presence is implementation history, not evidence that those concepts are current top-level products. They should be reviewed later rather than deleted solely for architecture alignment.

## Capability ownership map

| Repository area | Architectural owner | Current role | Direction |
|---|---|---|---|
| `@lurexa/auth` | Core | Authentication primitives | Keep as Core capability |
| `@lurexa/database` | Core | Persistence abstraction | Expand through explicit repositories; do not expose persistence directly to product UI |
| `@lurexa/backend` | Mixed implementation host | Existing server/domain services | Classify services by Core/Mind responsibility before splitting physical packages |
| `@lurexa/types` | Shared contracts | Canonical domain types | Home for cross-boundary learner contracts |
| `@lurexa/sdk` | Shared capability contracts | Generic SDK helpers plus learner/Mind interfaces | Expose supported product-facing Core and Mind interfaces |
| `@lurexa/config` | Shared infrastructure | Configuration | Keep neutral/shared |
| `@lurexa/utils` | Shared infrastructure | Generic utilities | Keep domain-neutral |
| `@lurexa/ui` | Shared product infrastructure | UI components | No learner persistence or AI-provider logic |
| `@lurexa/tokens` | Shared product infrastructure | Design tokens | No domain logic |
| `apps/*` | Products | User experiences | Generate experiences/evidence and consume authorized context |

## Backend service classification

### Core-aligned

Existing services whose primary responsibility belongs to Core include authentication, organizations, courses/content records, progress persistence, billing, administration, offline synchronization, telemetry/event infrastructure, and Firebase/platform integration.

### Mind-aligned or Mind-adjacent

Existing AI generation and AI guardrail services are candidates for eventual Mind ownership. Their current physical location in `@lurexa/backend` is not itself an architecture violation.

The new `LearningIntelligenceService` contract now gives future Mind implementations a product-agnostic boundary for interpreting learner evidence without owning authorization or authoritative persistence.

### Requires review

Analytics and ecosystem services may contain both trusted platform behavior and derived intelligence. They must be inspected capability-by-capability rather than assigned wholesale to Core or Mind.

## Learner contract foundation implemented

The repository now defines distinct concepts in `@lurexa/types`:

- `LearnerContext` — scoped information an authorized product may consume.
- `LearningEvidence` — observations contributed by products or authorized actors.
- `LearnerInsight` — interpreted learning intelligence derived from evidence.
- `LearnerInterpretationRequest` / `LearnerInterpretationResult` — the boundary between authorized evidence and Mind interpretation.

The separation is intentional:

```text
Evidence != Insight != Context
```

A product may record an observation. It must not promote that observation into authoritative interpreted learner state by itself.

## SDK boundaries implemented

`@lurexa/sdk` now exposes:

- `LearnerModelService` for Core-facing context/evidence/persistence operations.
- `LearningIntelligenceService` for Mind interpretation.

These are contracts, not yet network transport implementations.

## Persistence boundary implemented

`@lurexa/database` now exposes repository contracts for append-only learning evidence and active learner insights.

The contracts do not require a single giant learner document and do not force a specific datastore layout.

## Core service boundary implemented

`@lurexa/backend` now exposes a Core-owned learner-model boundary that requires injected authorization before reading learner context, accepting learning evidence, or persisting a learner insight.

The service deliberately does not infer learning state. Interpretation remains a Mind responsibility.

## Firestore protection implemented

The repository now reserves `/learner-evidence/{evidenceId}` and `/learner-insights/{insightId}` as server-only collections in Firestore Security Rules. Product clients receive no direct read or write permission to these paths.

This establishes the security direction before a concrete persistence adapter is introduced.

## Important verified technical debt

The existing `ProgressService` accesses Firestore directly inside `@lurexa/backend`, and `/progress/{progressId}` currently permits reads and writes by any authenticated user.

That existing rule is too broad for the cross-product Learner Model. It must not be copied to learner evidence or insights, and the progress rule itself should later be hardened as part of Core authorization work.

The current Firebase helper is a client Firebase initialization module. Although `firebase-admin` is installed in `@lurexa/backend`, no existing server-side Admin SDK initialization pattern was found during this inspection. A server-only persistence adapter should therefore establish that pattern deliberately rather than mixing Admin SDK code into the current client helper.

## Do not do yet

Do not yet:

- create a giant `learnerModel` Firestore document;
- rename `@lurexa/backend` to `core`;
- create a monolithic `@lurexa/mind` package solely for branding;
- expose learner evidence or insight collections directly to product clients;
- let Coach or Learn write interpreted learner state directly;
- remove existing product/route code only because naming strategy changed;
- migrate existing progress records without an explicit migration requirement.

## Next implementation sequence

1. Establish a server-only Firebase Admin initialization boundary for trusted Core operations.
2. Implement server-side evidence and insight repositories behind the existing database/service interfaces.
3. Define concrete request-scoped authorization semantics for learner-context reads and evidence writes.
4. Implement a context assembler that creates task-scoped `LearnerContext` from trusted Core records and approved active insights.
5. Connect one narrow Learn flow to submit real `LearningEvidence` through a server boundary.
6. Add tests for authorization, provenance, duplicate/idempotent submissions, stale insights, and partial context.
7. Add only the Firestore indexes required by the concrete repository queries.
8. Review legacy `learn-web` routes and existing AI/analytics services separately; do not conflate cleanup with Learner Model implementation.

## Governing principle

> One learner. One evolving model. Every Lurexa experience adapts around it.

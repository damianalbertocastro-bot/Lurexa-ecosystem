# Repository Capability Mapping

Status: Active
Last updated: 2026-08-19

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

The current backend package contains services for authentication, organizations, courses, progress, AI generation, AI guardrails, analytics, offline sync, billing, administration, ecosystem behavior, telemetry, Firebase integration, learner evidence persistence, scoped learner context, and the first Mind interpretation pipeline.

The current `learn-web` application already contains learner-facing Learn routes and a Coach route. It also contains legacy/future-facing routes such as marketplace/developer areas. Their presence is implementation history, not evidence that those concepts are current top-level products. They should be reviewed later rather than deleted solely for architecture alignment.

## Capability ownership map

| Repository area | Architectural owner | Current role | Direction |
|---|---|---|---|
| `@lurexa/auth` | Core | Authentication primitives | Keep as Core capability |
| `@lurexa/database` | Core | Persistence contracts | Keep datastore-neutral interfaces; concrete server adapters may live with current backend infrastructure until a split is justified |
| `@lurexa/backend` | Mixed implementation host | Existing Core services plus early Mind implementation | Preserve conceptual ownership boundaries even while physical code shares this package |
| `@lurexa/types` | Shared contracts | Canonical domain and learner types | Home for cross-boundary learner contracts |
| `@lurexa/sdk` | Shared capability contracts | Generic helpers plus learner/Mind interfaces | Expose supported product-facing Core and Mind interfaces |
| `@lurexa/config` | Shared infrastructure | Configuration | Keep neutral/shared |
| `@lurexa/utils` | Shared infrastructure | Generic utilities | Keep domain-neutral |
| `@lurexa/ui` | Shared product infrastructure | UI components | No learner persistence or AI-provider logic |
| `@lurexa/tokens` | Shared product infrastructure | Design tokens | No domain logic |
| `apps/*` | Products | User experiences | Generate experiences/evidence and consume authorized context |

## Learner contract foundation implemented

`@lurexa/types` now distinguishes:

- `LearnerContext` — purpose-scoped information an authorized product may consume.
- `LearningEvidence` — observations contributed by products or authorized actors.
- `LearnerInsight` — interpreted, revisable learning intelligence derived from evidence.
- `LearnerInsightData` — typed machine-usable insight payloads such as CEFR estimates, learning targets, recurring patterns, goals, curriculum context, and recommendations.
- `LearnerInterpretationRequest` / `LearnerInterpretationResult` — the Mind interpretation boundary.

The separation is intentional:

```text
Evidence != Insight != Context
```

Products do not promote an observation directly into authoritative interpreted learner state.

## SDK boundaries implemented

`@lurexa/sdk` exposes:

- `LearnerModelService` for Core-facing context/evidence/persistence operations.
- `LearningIntelligenceService` for Mind interpretation.

These remain product-agnostic contracts rather than provider-specific implementations.

## Persistence implemented

The repository contains datastore-neutral evidence/insight repository contracts and a current server-side Firestore adapter.

New canonical evidence is stored in the server-only `learning-evidence` collection. Active interpreted state is stored in the server-only `learner-insights` collection.

Evidence writes are idempotent by deterministic evidence ID. If the same ID is reused with different content, the repository rejects the conflict instead of silently overwriting evidence.

Historical Learn evidence written with the earlier schema is normalized at the repository read boundary. This compatibility layer prevents an immediate migration from being required while new producers use the canonical contract.

## Learn evidence producers migrated

The current `CoursePlatformService` now emits canonical `LearningEvidence` for:

- lesson completion → `curriculum_progress`;
- quiz attempts → `assessment_result`;
- scored interactive activities → `activity_result`.

The previous ad-hoc event schema is no longer produced by these flows. Existing historical records remain readable through normalization.

## First Mind implementation

`ConservativeLearningIntelligenceService` is the first concrete Mind implementation behind the shared contract.

Its current behavior is deliberately narrow: repeated unsuccessful attempts on the same activity can create a revisable practice recommendation. A single failed activity does not become a weakness, proficiency judgment, or mastery claim.

This implementation is deterministic and provider-independent. Richer model-backed interpretation can replace or extend it later without changing the Core contracts.

## Closed learner loop implemented

The first working loop is now:

```text
Learn action
  ↓
Core progress record
  ↓
canonical LearningEvidence
  ↓
Mind interpretation
  ↓
Core learner-insight persistence
  ↓
purpose-scoped LearnerContext
```

The current Learn server flow refreshes low-cost deterministic intelligence after evidence capture. Intelligence refresh failure is isolated from the learner's primary progress operation so an interpretation failure does not erase or reject valid learning progress.

Before expensive or model-backed Mind interpretation is introduced, this synchronous refresh should be replaced by a durable asynchronous processing mechanism.

## Scoped learner context implemented

`getScopedLearnerContext` provides a trusted server-side Core read boundary.

Current properties:

- self-only learner access for the learner-facing route;
- purpose-scoped domains;
- trusted curriculum position derived from Core progress records;
- goals from active insights with profile fallback;
- CEFR only when an active evidence-backed CEFR insight exists;
- active targets and recurring patterns from typed insights;
- recent activity identifiers from normalized learning evidence;
- no raw learner-response payloads returned to the product.

`apps/learn-web/app/api/learner-context/route.ts` exposes this through an authenticated Node.js route.

## Firebase Admin boundary implemented

Trusted server operations use `@lurexa/backend/firebase-admin.server`.

Production initialization uses `FIREBASE_SERVICE_ACCOUNT_JSON`; emulator operation can initialize from the configured project ID. The Admin module remains out of the browser-facing root backend barrel.

## Firestore security posture

`learning-evidence` and `learner-insights` are server-only: client rules grant no read or write access.

`progress` is now treated as an authoritative Core record. Learners may read only their own progress and organization managers may read progress for courses they manage. Client writes are denied; writes must pass through trusted Core server APIs.

The legacy browser `ProgressService.syncProgress` method remains only as a compatibility surface and now fails explicitly with guidance to use the trusted Core learning API rather than attempting a Firestore write that security rules reject.

## No premature repository split

The implementation deliberately has not:

- renamed `@lurexa/backend` to Core;
- created a monolithic `@lurexa/mind` branding package;
- created a giant learner-model Firestore document;
- exposed learner evidence or insights to product clients;
- allowed Learn or Coach to write interpreted learner state directly;
- migrated historical evidence or progress merely for naming consistency.

## Current technical debt and next work

1. Validate lint/type/build for the new learner contracts and server paths in CI/Vercel.
2. Add focused tests for evidence idempotency, legacy normalization, stale/superseded insights, context scoping, and progress security rules.
3. Replace synchronous Mind refresh with a durable job/event mechanism before model-backed interpretation introduces material latency or cost.
4. Add competency/curriculum metadata needed to produce useful learning-target insights without guessing from activity IDs.
5. Establish teacher/institution learner-context authorization separately from the current self-only learner route.
6. Define evidence-backed CEFR/placement inputs before producing proficiency insights.
7. Connect Lurexa Coach to the same scoped context boundary rather than creating a Coach profile.
8. Review legacy product routes and mixed AI/analytics services independently from Learner Model work.

## Governing principle

> One learner. One evolving model. Every Lurexa experience adapts around it.

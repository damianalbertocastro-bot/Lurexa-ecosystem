# Repository Capability Mapping

Status: Active  
Last reconciled: 2026-08-27

## Purpose

This document maps the repository that exists today to the authoritative Lurexa architecture. It does not imply that every existing package or prototype is a permanent production boundary.

> Products create experiences/evidence. Core owns trust and authoritative persistence. Mind interprets authorized evidence. One learner model evolves across authorized experiences.

## Current application map

| Repository area | Owner / classification | Current truth |
| --- | --- | --- |
| `apps/web` | Ecosystem surface | Lurexa ecosystem landing/application shell |
| `apps/learn-web` | Learn | Learner web plus embedded `/teacher` operational Teacher Workspace |
| `apps/coach-web` | Coach | Standalone Coach product/runtime; canonical speaking/pronunciation/fluency UI |
| `apps/teach-web` | Teach | Standalone educator professional-development product |
| `apps/admin-portal` | Admin | Governance/administration product |
| `apps/docs` | Docs surface | Documentation application |
| `apps/mobile` | Learn surface | Expo/React Native Learn mobile foundation |

No current standalone `apps/insight-web`, `apps/studio-web`, or `apps/campus-web` exists.

The Learn routes `/teacher/insights`, `/teacher/studio`, `/campus`, `/marketplace`, and legacy `/chat` must be interpreted according to current product/containment policy, not by route name alone:

- `/teacher/insights` = Learn instructional Teacher Workspace feature, not standalone Insight;
- `/teacher/studio` = contained local Studio interaction prototype, not standalone Studio;
- `/campus` = representative institutional-shell prototype, not a live Campus tenant;
- `/marketplace` = contained future concept/status surface, not live commerce;
- `/chat` = compatibility handoff to standalone Coach.

## Shared package map

| Package | Current role | Reconciliation direction |
| --- | --- | --- |
| `@lurexa/types` | Canonical shared domain/contracts | Keep as cross-boundary contract authority |
| `@lurexa/config` | Shared product/domain/runtime config | Keep neutral; reduce duplicate registries/env aliases |
| `@lurexa/ui` | Shared interaction/brand components | Keep data/provider authority out of UI |
| `@lurexa/tokens` | Shared design grammar | Preserve shared grammar with product personalities |
| `@lurexa/backend` | Mixed browser-safe services + explicit server capabilities | Platform/package reconciliation must make client/server ownership clearer |
| `@lurexa/sdk` | Shared SDK/contract surface | Audit overlap with backend services before expanding |
| `@lurexa/auth` | Historical/shared auth abstraction | Classify Production/Contract/Deprecated based on actual import graph |
| `@lurexa/database` | Historical datastore/repository abstraction | Classify production/test/deprecated pieces; Firestore is current operational store |
| `@lurexa/utils` | Shared utilities | Keep domain-neutral |

Package names do not need to mirror Core/Mind branding, but package boundaries must not weaken architectural ownership.

## Core-owned capabilities implemented at verified baseline

Current server-governed foundations include:

- authenticated identity integration;
- organization/tenant boundaries;
- learning evidence and progress persistence;
- purpose-scoped learner context;
- educator qualification lifecycle/review;
- exact-course teaching authorization;
- course enrollment index;
- Product Bridge creation/resolution;
- trusted Coach session records/completion redaction;
- Signature Experience projections;
- governed Knowledge Object catalog foundations.

Core is the authority for trusted persistence and authorization. A browser-side service is not authoritative merely because it lives in `@lurexa/backend`.

## Mind-owned capabilities implemented at verified baseline

Current storage-free or Core-approved interpretation foundations include:

- conservative learning recommendations;
- professional educator growth recommendations;
- linguistic/pronunciation pattern interpretation;
- adaptive next-action/projection inputs;
- approved explanation/trace candidates.

Mind does not grant teaching authority, entitlements or qualification and does not become the canonical persistence layer.

## Learner/professional evidence separation

The repository distinguishes:

```text
Evidence != Interpretation != Authorized Context
```

Student learner evidence and educator-professional evidence are purpose-separated. Educator Coach mode produces minimized professional evidence and does not enter the ordinary learner evidence pipeline.

## Learn ↔ Coach ↔ Teach continuity

Coach is no longer embedded as the canonical Learn-owned UI.

```text
Learn learning need
  ↓ governed Product Bridge
Coach standalone practice
  ↓ minimized evidence + Core/Mind
return → Learn

Teach professional growth
  ↓ governed Product Bridge / benefit
Coach educator-professional practice
  ↓ professional evidence
return → Teach
```

Learn compatibility `/coach` routes redirect to `apps/coach-web`; Coach independently re-authorizes context/session access.

## Teacher Workspace boundary

The operational Teacher Workspace is `apps/learn-web/app/teacher`.

Access requires the relevant entitlement, eligible educator qualification and exact teaching authorization. Organization owner/admin governance role alone must not substitute for qualification.

Teach remains educator professional development and receives no delegated student-context entitlement.

## Prototype containment

`Docs/Architecture/LUREXA_PROTOTYPE_CONTAINMENT.md` is normative. Marketplace, billing preview, Campus prototype, Studio prototype and inactive Learn tutor placeholders must fail honest/closed for unimplemented trusted behavior.

## Current verification gates

Required `Verify Foundation & Build` protects, among other things:

- repository hygiene;
- product/brand registry boundaries;
- prototype containment;
- documentation truth;
- Coach first-class product ownership;
- curriculum portfolio/runtime contracts;
- Core/Mind contracts;
- learner model and recommendation rules;
- Signature Experience;
- educator qualification/governance/growth journeys;
- Firestore security rules;
- Phase 0 lint/type/build.

`main` requires that check, requires a PR, requires current/up-to-date status and resolved review conversations, and blocks force pushes/deletion with no bypass actors.

## Platform/package reconciliation note

The existence of older generic auth/database/SDK abstractions is not evidence they remain the preferred production path. Stage 6 of `ROADMAP.md` audits actual imports and classifies each package/component as **Production, Contract, Test, or Deprecated** before removal or restructuring.

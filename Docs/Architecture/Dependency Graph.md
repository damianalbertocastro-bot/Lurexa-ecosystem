# Dependency Graph

Status: Authoritative conceptual architecture  
Owner: Lurexa Learning Technologies  
Last reconciled: 2026-08-27

## Ecosystem dependency graph

```text
                    Lurexa Learning Technologies
                               │
          ┌────────────────────┴────────────────────┐
          │                                         │
      Lurexa Core                              Lurexa Mind
 trust + authoritative state              interpretation/intelligence
          │                                         │
          └──────── authorized evidence/context ────┘
                               │
                      supported interfaces
                               │
       ┌───────────┬───────────┼───────────┬───────────┬───────────┐
       │           │           │           │           │           │
     Learn       Coach       Teach       Admin       Insight      Studio
                               │
                 Campus orchestrates entitled products
                 but owns no competing product truth
```

Core and Mind do not depend on product applications for their fundamental ownership. Campus is an orchestration shell, not a seventh sibling product.

## Learner/professional model flow

```text
Product experience
      ↓ evidence
Core validation + authorization + persistence
      ↓ authorized evidence/context
Mind interpretation
      ↓ candidate / recommendation / explanation
Core approval/persistence where required
      ↓ purpose-scoped context
Authorized product adaptation
```

Evidence, interpretation and authorized context are different things. The Learner Model is a governed cross-product representation, not a product-owned profile store.

Educator professional evidence is purpose-separated from student learner evidence.

## Allowed dependency directions

### Product → Core

Allowed for authenticated/authorized domain operations, evidence submission, context retrieval, enrollment/progress, qualification/authorization workflows, content records, entitlements and Product Bridge operations.

### Product → Mind

Allowed only through governed intelligence boundaries for tutoring/coaching, personalization, recommendations, adaptive feedback, professional-development interpretation and similar capabilities.

Mind receives only the minimum authorized context required for the purpose.

### Mind → Core

Mind may consume Core-authorized evidence/context and return candidates/results for Core-approved persistence. Mind does not grant permissions, teaching authority, qualification or entitlement.

### Core → infrastructure

Core may depend on trusted infrastructure such as Firebase/Auth/Firestore/Storage, payment/scheduling providers, messaging, observability and server runtimes. Infrastructure choice does not change Core ownership.

### Mind → AI/speech providers

Provider access belongs behind governed server/provider abstractions. Product clients must not directly call providers for persistent learner/professional intelligence.

## Disallowed directions

```text
Product UI ─X→ arbitrary trusted/inferred state mutation
Product UI ─X→ provider for persistent personalized intelligence
Product A  ─X→ Product B private profile/database
Mind       ─X→ independent auth/permission/qualification authority
Mind       ─X→ ungoverned authoritative persistence
Core       ─X→ product UI dependency
Coach      ─X→ becoming a second Mind
Insight    ─X→ becoming the authoritative source database
Campus     ─X→ becoming a competing learner/product truth
Teach      ─X→ delegated student-learning context by default
Browser    ─X→ authoritative payment/purchase completion
```

## Current repository mapping

```text
apps/web          → ecosystem surface
apps/learn-web    → Learn + operational Teacher Workspace
apps/coach-web    → standalone Coach
apps/teach-web    → standalone Teach professional development
apps/admin-portal → Admin
apps/docs         → documentation surface
apps/mobile       → Learn mobile surface
```

There is currently no standalone Insight, Studio or Campus app. Their product/shell architecture must not be confused with Learn-hosted prototype/support routes.

Shared packages currently map conceptually as follows, pending package reconciliation:

```text
@lurexa/types      → canonical shared contracts
@lurexa/config     → shared runtime/product configuration
@lurexa/ui         → shared presentation infrastructure
@lurexa/tokens     → shared design grammar
@lurexa/backend    → mixed browser-safe services + explicit server capabilities
@lurexa/sdk        → shared SDK/contract surface
@lurexa/auth       → auth abstraction under reconciliation
@lurexa/database   → datastore abstraction under reconciliation
@lurexa/utils      → shared utilities
```

These mappings do not prove every package is still the preferred production abstraction.

## Product dependencies

### Learn

```text
Learn → Core
Learn → Mind
Learn → Coach only through governed Product Bridge/public product boundary
```

Learn owns learner delivery and Teacher Workspace. It may generate evidence and consume approved intelligence. It does not own Coach or a separate ecosystem learner model.

### Coach

```text
Coach → Core
Coach → Mind
```

Coach owns speaking/pronunciation/fluency practice. Learner mode may contribute minimized learner evidence; educator-professional mode contributes purpose-separated professional evidence. Coach does not own placement, enrollment, teaching authority or canonical persistence.

### Teach

```text
Teach → Core professional/qualification records
Teach → Mind professional-growth intelligence
Teach → Coach educator-professional practice through governed benefit/bridge
```

Teach is educator-as-learner professional development. It has **no delegated student-context entitlement**. Learn Teacher Workspace—not Teach—owns student/course operations.

### Admin

```text
Admin → Core governance
Admin → selected Mind interpretation only where purpose-authorized
```

Admin configures/operates governance workflows; Core enforces trusted state. Qualification review and teaching authorization remain distinct.

### Insight

Future standalone Insight may consume tenant-authorized Core aggregates and Mind-derived intelligence. It must not replace the source records or expose learner-level data outside purpose/role/tenant authorization.

### Studio

Future standalone Studio may use Mind-assisted authoring, while Core owns canonical Knowledge Object/content records, provenance, permissions, versions and publication state.

### Campus

Campus may resolve Core-owned organization/entitlement state and create purpose-scoped Product Bridges to entitled products. It must not become an independent owner of learner records, analytics truth, product permissions or content.

## Shared-package dependency principles

1. Shared packages do not import product applications.
2. Product-specific behavior belongs in the owning product unless it is a proven reusable capability.
3. Core contracts do not depend on product UI types.
4. Mind contracts do not expose provider SDK types at product boundaries.
5. Cross-product context uses governed contracts, not private database-document imports.
6. Client and privileged server exports must remain distinguishable.
7. Circular product/Core/Mind dependencies are architecture defects.

## Verification

Current required CI verifies Core/Mind, learner-model, Coach product ownership, educator governance, Product Bridge, prototype containment and product-registry invariants. Platform/package reconciliation will strengthen import-boundary enforcement further.

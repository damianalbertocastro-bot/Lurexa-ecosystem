# Dependency Graph

Status: Authoritative conceptual architecture  
Owner: Lurexa Learning Technologies  
Last updated: 2026-08-17

## Purpose

This document defines allowed architectural dependency directions across Lurexa. It prevents product silos, duplicate learner truth, and accidental coupling between user experiences, persistence, and AI providers.

This is a conceptual dependency model. Existing package names do not need to be changed until repository-level evidence justifies a refactor.

## Ecosystem dependency graph

```text
                    Lurexa Learning Technologies
                               │
                 governance / standards / strategy
                               │
          ┌────────────────────┴────────────────────┐
          │                                         │
      Lurexa Core                              Lurexa Mind
 trust + authoritative state              learning intelligence
          │                                         │
          └──────── authorized context/evidence ────┘
                               │
                      supported interfaces
                               │
       ┌───────────┬───────────┼───────────┬───────────┬───────────┐
       │           │           │           │           │           │
     Learn       Coach       Teach       Admin       Insight      Studio
```

Products depend on supported Core and Mind capabilities. Core and Mind do not depend on product applications for their fundamental domain ownership.

## Learner Model dependency flow

```text
Product experience
      ↓
learning evidence
      ↓
Core validation + authorization + trusted persistence
      ↓
authorized evidence/context
      ↓
Mind interpretation
      ↓
approved derived intelligence
      ↓
Core-governed persistence/context boundary
      ↓
authorized product adaptation
```

The Learner Model emerges from this governed loop. It is not a separate product-owned profile store.

## Allowed dependency directions

### Products → Core contracts

Allowed for:
- authentication/session use;
- authorized domain operations;
- learning-evidence submission;
- learner-context retrieval;
- enrollment/progress operations;
- content access;
- scheduling/commerce/notification operations;
- offline synchronization.

Products should depend on supported interfaces rather than implementation-specific persistence details.

### Products → Mind contracts

Allowed for:
- tutoring/coaching requests;
- personalization;
- recommendations;
- adaptive feedback;
- pronunciation/speaking intelligence;
- content adaptation;
- teacher-assistance intelligence.

Mind calls should carry only the minimum authorized context needed for the task.

### Mind → Core contracts

Allowed for:
- retrieving authorized evidence/context;
- resolving approved learner/context identifiers;
- persisting approved derived observations through Core-governed boundaries;
- accessing platform services required for intelligence workflows.

Mind must not bypass Core authorization or write directly to uncontrolled product-specific state.

### Core → infrastructure

Allowed for trusted technical dependencies such as:
- Firebase/Auth/Firestore/Storage;
- server runtimes;
- payment/scheduling integrations;
- messaging/notification infrastructure;
- observability systems;
- synchronization infrastructure.

The exact technologies may evolve without changing Core's responsibility.

### Mind → model/speech providers

Allowed through governed provider abstractions for:
- LLMs;
- speech recognition;
- text-to-speech;
- pronunciation/speech analysis;
- evaluation/guardrail services.

Product clients should not depend directly on these providers for production learning intelligence.

## Disallowed dependency directions

```text
Product UI ─X→ Firestore for arbitrary inferred learner-state writes
Product UI ─X→ AI provider for persistent personalized intelligence
Product A  ─X→ Product B private learner profile
Mind       ─X→ independent auth/permission ownership
Mind       ─X→ ungoverned authoritative learner persistence
Core       ─X→ product-specific UI/business-flow dependency
Insight    ─X→ becoming the source database
Coach      ─X→ becoming a second Mind
```

## Repository mapping

The current monorepo includes shared packages whose names predate the refined Core/Mind architecture. Preserve them until actual module responsibility is inspected.

Conceptual mapping examples:

```text
@lurexa/auth       → Core identity/access
@lurexa/database   → Core persistence/data access
@lurexa/sdk        → supported product/service contracts
@lurexa/types      → shared domain contracts
@lurexa/backend    → server capabilities; may contain Core/Mind modules depending on actual code
@lurexa/ui         → shared presentation infrastructure
@lurexa/tokens     → shared design-system infrastructure
@lurexa/config     → shared technical configuration
@lurexa/utils      → shared utilities subject to dependency discipline
```

These are mapping hypotheses, not implementation-status assertions. Inspect the package before moving or renaming code.

## Product dependencies

### Lurexa Learn

```text
Learn → Core
Learn → Mind
```

Learn may generate learning evidence and consume personalization, but it does not independently own ecosystem learner truth.

### Lurexa Coach

```text
Coach → Core
Coach → Mind
```

Coach consumes authorized learner context and Mind speaking/pronunciation intelligence; it contributes new evidence through Core-governed contracts.

Dominican Spanish is the first deep L1 profile. L1-specific linguistic knowledge should be plugged into Mind/Coach capabilities through extensible contracts rather than embedded as an irreversible system assumption.

### Lurexa Teach

```text
Teach → Core
Teach → Mind
```

Teach receives role-appropriate learner context and may contribute teacher observations/interventions through governed contracts.

### Lurexa Admin

```text
Admin → Core
Admin → selected Mind capabilities where justified
```

Admin manages institutional workflows and policy configuration. Core enforces trust.

### Lurexa Insight

```text
Insight → Core
Insight → Mind
```

Insight consumes governed records and derived intelligence; it should not create an alternate analytics truth that products then treat as authoritative learner state.

### Lurexa Studio

```text
Studio → Core
Studio → Mind
```

Studio owns content-authoring workflows. Mind may assist generation/adaptation while Core governs canonical content records and access.

## Shared package dependency principles

1. Low-level shared packages must not import application code.
2. Product-specific logic should not leak into broadly shared packages without a clear capability reason.
3. Core contracts should avoid depending on a specific product's UI types.
4. Mind contracts should avoid depending on a specific AI provider's SDK types at product boundaries.
5. Cross-product learner context must use governed domain contracts, not database-document imports.
6. Circular dependencies between product, Core and Mind domains are architecture defects.

## Implementation sequence

Before changing repository structure:

1. inventory actual imports and service responsibilities;
2. map existing modules to Core, Mind, product, or shared-experience infrastructure;
3. flag violations of the allowed dependency directions;
4. define the first v1 Learner Context and Learning Evidence contracts;
5. refactor only the boundaries needed for the next product milestone.

## Commercial architecture rule

The thesis prototype is a validation/reference artifact. Production dependency decisions must optimize for the commercial multi-product ecosystem, not reproduce thesis-specific coupling or constraints.

## Related documents

- `Docs/Architecture/Capability Architecture.md`
- `Docs/Architecture/Capability Interaction Matrix.md`
- `Docs/Architecture/Learner Model Architecture.md`
- `ROADMAP.md`
- `AGENTS.md`
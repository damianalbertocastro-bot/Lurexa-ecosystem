# Lurexa Core/Mind Vertical Slice

**Status:** implemented on `architecture/core-mind-convergence`  
**Date:** 2026-08-24

## Purpose

This document describes the first executable cross-product learning-intelligence loop in the Lurexa ecosystem. It is an implementation record, not only a target architecture.

The governing principle remains:

> One learner. One evolving model. Every Lurexa experience adapts around it.

The trust rule is:

> Products submit intent and observations. Core owns authorization, trusted evidence, approval, persistence, and scoped projection. Mind interprets authorized evidence and returns revisable candidates. Mind never owns authorization or authoritative persistence.

## Implemented flow

```text
Lurexa Learn activity / quiz / teacher review
                |
                v
      Core trusted server boundary
                |
                v
        canonical LearningEvidence
        (`learning-evidence`)
                |
                v
 Core learner-intelligence orchestrator
 - selects tenant-bounded evidence
 - chooses approved interpretation types
                |
                v
        storage-free Lurexa Mind
 - Learn next-step interpreter
 - spoken/L1-transfer interpreter
 - teacher-guidance normalizer
                |
                v
 CandidateDerivedObservation
 - evidence references
 - confidence
 - purpose/product scope
 - provenance
 - limitations
                |
                v
          Core approval gate
 - evidence basis must be authorized
 - scope must be valid
 - policy is recorded
                |
                v
         approved learner insight
                |
                v
       Core scoped learner context
 - product/purpose checked
 - organization boundary enforced
 - raw evidence payloads excluded
                |
          +-----+------+
          |            |
          v            v
     Learn UI       Coach context
```

## Core ownership

### Trusted evidence

`FirestoreLearningEvidenceRepository` remains the authoritative evidence persistence boundary. Product code does not write a derived learner model directly.

### Intelligence orchestration

`packages/backend/src/core/learner-intelligence.server.ts` owns the evidence → Mind → approval sequence.

Core:

1. loads the learner's evidence;
2. applies the organization boundary;
3. sends only that authorized projection to Mind;
4. receives candidate observations;
5. validates each candidate against the exact evidence IDs available to the request;
6. persists approved derived observations under the Core policy.

A request without an organization ID is explicitly global and cannot silently mix organization-scoped evidence from multiple institutions.

### Teacher return loop

`packages/backend/src/core/teacher-return-loop.server.ts` treats teacher feedback as trusted evidence instead of directly mutating a learner model.

Before accepting guidance, Core verifies:

- the authenticated actor matches the declared teacher;
- the course belongs to an organization;
- the teacher has an owner/admin/teacher membership in that organization;
- the learner belongs to the same organization.

The teacher review is retained as an authoritative teacher record and emitted as immutable `teacher_reported` learning evidence. Mind may normalize the teacher's return-loop action into a recommendation, but it does not reinterpret or dilute explicit teacher authority.

## Mind ownership

`packages/backend/src/mind/learning-intelligence.server.ts` is the canonical storage-free Mind facade for this slice.

It combines three capabilities while preserving one contract:

1. **Learn next-step intelligence** — conservative deterministic recommendations from repeated activity outcomes;
2. **linguistic/spoken intelligence** — interpretation of pronunciation, fluency, and L1-transfer evidence;
3. **teacher-guidance normalization** — converts an explicit teacher return-loop action into a bounded recommendation candidate with confidence `1` and direct teacher-evidence provenance.

Mind does not:

- query Firestore;
- use Firebase Admin;
- authorize users;
- select cross-tenant evidence;
- approve its own candidates;
- persist authoritative learner state.

## Product projection rules

`packages/backend/src/learner-context.server.ts` is the trusted read boundary.

Current approved purpose mapping is deliberately narrow:

| Product | Approved learner-context purpose |
| --- | --- |
| Learn | `learn_adaptive_practice` |
| Coach | `coach_session_adaptation` |
| Teach | `teacher_instructional_support` |
| Admin | none |
| Insight | none |
| Studio | none |

New scoped observations are returned only when both their declared purpose and product match the request. Organization-scoped intelligence is not mixed across institutions. Raw evidence payloads are not returned to product clients.

The current learner-facing context endpoint permits learners to request only their own context. Future teacher/admin access must be implemented as explicit Core authorization policies rather than weakening this rule.

## Server/client dependency boundary

The browser-safe `@lurexa/backend` root barrel must not export Core/Mind server capabilities that transitively load Firebase Admin or Google Cloud Node libraries.

Server-only capabilities such as Mind interpretation, teacher return-loop persistence, and capstone evaluation must be imported through explicit server module paths by API routes or other server-only code.

This rule is both architectural and operational: violating it caused Next.js production builds to pull Node built-ins (`fs`, `net`, `tls`, `child_process`, `http2`) into Client Component graphs. Separating the boundary restored production builds for Learn, Teach, Admin, Docs, and the ecosystem site.

## Fail-closed legacy paths

Two older shortcuts are intentionally closed:

- `LearnerModelService.submitInsight()` cannot persist a derived insight directly;
- unauthenticated `TeacherReturnLoopService.submitTeacherGuidance()` cannot accept a payload-supplied `teacherId` as authorization.

Both methods remain only as migration-compatible failure points so old callers fail visibly rather than silently bypassing Core.

## Executable architecture checks

The repository now verifies the architecture rather than relying only on documentation.

`pnpm verify:core-mind-boundary` checks structural invariants including:

- Mind has no persistence access;
- Core owns candidate approval;
- teacher guidance uses the trusted evidence path;
- learner context enforces product/purpose scope;
- server-only capabilities stay out of the client-safe backend barrel;
- the Learn evidence → recommendation → dashboard projection remains connected.

`pnpm verify:mind-contract` checks behavioral invariants including:

- Mind returns candidate state, never self-approved state;
- candidates retain their evidence basis;
- Core rejects unauthorized evidence references;
- Core rejects malformed scopes;
- tenant-scoped evidence cannot be interpreted without an explicit organization boundary;
- explicit teacher guidance preserves teacher provenance and authority.

Firestore emulator checks independently enforce that learner clients cannot forge trusted evidence, Mind recommendations, spoken evidence, retrieval schedules, or teacher intervention records.

## What this slice proves

This implementation now demonstrates the central Lurexa ecosystem loop:

```text
Learn evidence
  → Core trusted record
  → Mind interpretation
  → Core approval
  → scoped learner context
  → adaptive Learn/Coach experience
```

That is sufficient to start building more products around the same learner rather than creating separate product-specific learner profiles.

## Next architectural work

The next improvements should extend this foundation rather than create parallel intelligence stacks:

1. migrate remaining direct/browser Firestore mutations behind trusted Core APIs;
2. retire remaining generic direct learner-insight repository save paths after consumer verification;
3. formalize server-only package exports so server/client separation is enforced by package exports in addition to source verification;
4. add a real Coach API consumer of `coach_session_adaptation` to prove Learn → Core → Mind → Coach cross-product reuse;
5. create Core-owned analytics projections instead of product-side/global aggregation;
6. add explicit teacher/admin learner-context authorization policies when those workflows are implemented;
7. evolve deterministic Mind implementations behind the existing contract rather than coupling products directly to an AI provider.

## Release rule

Do not merge this architecture change until both the foundation workflow and affected-product production-build validation execute successfully on the final branch head.

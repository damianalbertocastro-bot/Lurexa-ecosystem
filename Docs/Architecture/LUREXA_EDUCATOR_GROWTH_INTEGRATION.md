# Lurexa Educator Growth Integration

**Status:** Normative architecture and product-boundary contract  
**Applies to:** Lurexa Core, Lurexa Mind, Lurexa Learn Teacher Workspace, Lurexa Teach, Lurexa Coach, Lurexa Admin  
**Updated:** 2026-08-26

## 1. Governing principle

Lurexa uses one identity while keeping role, purpose, and evidence boundaries explicit.

For educators, four concepts must never collapse into one another:

1. **Identity** — who the person is across Lurexa.
2. **Entitlement** — which product capabilities the person may use.
3. **Qualification** — the trusted professional scope the educator has demonstrated.
4. **Teaching authorization** — the institution's permission to operate specific courses inside that qualified scope.

Organization membership is affiliation. A `teacher`, `admin`, or `owner` role does not itself create professional qualification or student instructional access.

## 2. Product ownership

### Lurexa Learn Teacher Workspace

Learn owns operational student learning:

- exact-course enrollment;
- course/class rosters;
- student progress;
- aggregate class intelligence;
- individual Learner Pulse and other purpose-scoped student projections;
- interventions and targeted learning actions.

A teacher reaches student context only after Core verifies the relevant entitlement, active qualification, exact institutional teaching authorization, organization boundary, and course boundary.

### Lurexa Teach

Teach owns educator self-development:

- professional learning;
- methodology and pedagogy development;
- professional evidence;
- reflection;
- qualification-readiness support;
- credentials;
- Mind-guided professional growth paths.

Teach does not own student rosters or delegated student learner context.

### Lurexa Coach

Coach supports two distinct self-service modes:

- **learner mode** — learner speaking/pronunciation practice that can contribute governed learner evidence and returns to Learn;
- **educator professional mode** — the educator practices their own professional English under an educator benefit and returns to Teach.

Coach never grants qualification.

### Lurexa Admin

Admin governs institutional teaching authorization and provides a reviewer-only qualification lifecycle API. Admin role changes must never manufacture qualification.

## 3. Qualification lifecycle

Core owns the authoritative lifecycle:

```text
candidate
  -> under_review
  -> qualified
  -> suspended | expired | revoked
```

Additional governed transitions:

- `under_review -> candidate` for additional evidence;
- `candidate -> revoked`;
- `under_review -> revoked`;
- `suspended -> qualified` only while the previous qualification remains within its validity window;
- `suspended -> expired | revoked`.

`expired` and `revoked` are terminal. Requalification requires a new candidate after reassessment.

Every decision has:

- reviewer identity;
- reason;
- policy version;
- evidence references;
- timestamp;
- append-only lifecycle event.

When a qualification becomes suspended, expired, or revoked, Core suspends active teaching authorizations linked to that qualification.

## 4. Lurexa Mind professional-growth boundary

Mind can interpret authorized professional state and recommend next actions. It cannot:

- read Firestore directly in the educator growth engine;
- grant or revoke qualification;
- modify entitlement;
- issue institutional teaching authorization;
- authorize student context;
- persist authoritative professional state.

The educator growth path may use professional qualification metadata, professional evidence counts, competency state, and educator benefits.

It must exclude:

- student weaknesses;
- raw student learner evidence;
- student transcripts;
- student recommendations;
- individual student learner-model state.

## 5. Teach Growth Plan

Teach exposes a governed Growth Plan that presents:

- Core-owned qualification status;
- current Teach/Coach educator benefits;
- Mind-generated professional milestones;
- professional evidence summary;
- explicit privacy boundary.

The path can recommend Coach for professional English, pronunciation, fluency, or language-control development. The recommendation is developmental only and does not change qualification.

## 6. Coach educator-professional mode

Educator-professional mode requires the governed `coach_full` educator benefit.

During a professional session:

- live coaching still provides pronunciation/fluency feedback;
- the turn is excluded from the ordinary learner evidence/intelligence pipeline;
- student context is not imported;
- raw professional transcript text is not persisted as professional evidence.

At completion, Core writes a minimized professional evidence record containing only bounded metadata such as practice counts/targets and provenance. The completion creates a single-use Product Bridge:

```text
Coach -> Teach
purpose: professional_growth
destination: /growth-plan
```

Ordinary learner Coach retains:

```text
Coach -> Learn
purpose: return_to_learning
```

These loops must remain distinct.

## 7. Core course enrollment index

Core owns course enrollment independently of learning progress:

```text
course-enrollments/{courseId}/learners/{learnerId}
```

An enrolled learner may have no progress yet. This is intentional and required.

The enrollment index records:

- organization;
- course;
- learner;
- status (`active`, `withdrawn`, `completed`);
- source;
- enrolled and updated timestamps.

Existing trusted course participation may be migrated into the index for backward compatibility. After migration, progress is an activity overlay, not the source of truth for enrollment.

Enrollment mutations require exact-course educator authorization.

## 8. Course-scoped derived intelligence

Learn Teacher Workspace exposes aggregate exact-course intelligence only after Core verifies educator access.

The course view may include:

- enrolled learners;
- participating learners;
- never-started learners;
- active learners over a bounded window;
- descriptive completion;
- governed Knowledge Object signal counts;
- instructional recommendations based on aggregate signals.

The aggregate contract must not contain learner IDs, raw evidence, transcripts, or individual recommendations.

Individual learner support remains an explicit separate action through purpose-scoped Learn projections such as Learner Pulse.

## 9. Learn Teacher Workspace end state

The Teacher Workspace separates two levels of decision:

### Course operations

`/teacher/insights`

- exact-course enrollment management;
- enrolled / participating / not-started distinction;
- aggregate class intelligence;
- instructional focus signals;
- explicit handoff to Teach for educator self-development.

### Individual learner support

`/teacher/students`

- learner selection from authorized enrolled course roster;
- purpose-scoped individual learner projections;
- instructional decisions only.

This keeps aggregate class operations distinct from individual learner-model access.

## 10. Required test gates

The integration is not complete unless CI proves all of the following:

- membership alone cannot grant student instructional access;
- qualification lifecycle transitions are explicit and reviewer-governed;
- qualification invalidation removes linked teaching authority;
- educator benefit requires currently valid professional state or explicit entitlement;
- Mind educator growth is storage-free and excludes student context;
- never-started enrolled learners appear in Learn;
- course intelligence is aggregate and exact-course scoped;
- educator Coach mode requires the educator benefit;
- educator Coach turns do not enter the ordinary learner intelligence pipeline;
- educator Coach completion contains no raw transcript/student context and returns to Teach;
- ordinary learner Coach still returns to Learn;
- Learn, Teach, Admin, and affected shared packages pass lint, typecheck, and production build.

Current CI guards:

- `verify-educator-governance.mjs`
- `verify-educator-growth-integration.mjs`
- Firestore educator qualification delegation journey
- Firestore Learn–Teach–Coach educator integration journey
- Learn Firestore security rules
- full Phase 0
- Product Deployment Validation

## 11. End-state mental model

> **I am operating student learning.** → Lurexa Learn Teacher Workspace.

> **I am developing myself as an educator.** → Lurexa Teach.

> **I am practicing my own professional spoken English.** → Lurexa Coach educator mode.

> **I am governing who may teach what, where.** → Lurexa Admin + Lurexa Core.

> **I am interpreting authorized professional evidence into next development steps.** → Lurexa Mind.

One identity connects these experiences, while Core preserves the boundaries that make that continuity trustworthy.

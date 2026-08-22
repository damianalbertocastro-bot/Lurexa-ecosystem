# Learner Contracts v1

Status: Implemented contract baseline
Owner: Lurexa Core
Last updated: 2026-08-21

## Purpose

This document specifies the first repository-backed contracts for trusted
learning evidence and minimized learner context. It implements the boundary
described in the Learner Model Architecture without creating a new learner
database, renaming packages, or treating Mind output as raw evidence.

## Repository ownership map

| Responsibility | Current boundary | Owner |
|---|---|---|
| Shared contract types | `@lurexa/types/src/learner.ts` | Core-governed contracts |
| Trusted evidence persistence | `@lurexa/backend/learner-firestore.server` | Core |
| Context projection and purpose enforcement | `@lurexa/backend/learner-context.server` | Core |
| Evidence producers | Learn and Coach server capabilities | Products through Core |
| Evidence interpretation | `mind-learning-intelligence.server` and linguistic intelligence services | Mind |
| Candidate-observation approval | `FirestoreLearnerInsightRepository.approveAndPersist` | Core |
| Supported service interface | `@lurexa/sdk/src/learner.ts` | SDK boundary |

Product UI code does not write learning evidence directly. It calls product API
routes, which authenticate the actor and use Core-governed server services.

## Learning Evidence Contract v1

`LearningEvidence` is an immutable, versioned observation record. New records
must include:

- `contractVersion: "1"`;
- canonical learner and optional organization identifiers;
- source product plus applicable course, lesson, activity, or session IDs;
- a typed evidence category and observation timestamp;
- `dataClassification` (`standard` or `sensitive`);
- payload and provenance, including the observation method and actor/model when
  applicable.

`FirestoreLearningEvidenceRepository.append` rejects unversioned or
structurally incomplete v1 records before persistence. Legacy documents are
normalized only on read to retain historical continuity; this is not permission
to produce new unversioned evidence.

## Mind interpretation and derived observations

`ConservativeLearningIntelligenceService.interpretAuthorizedEvidence` is the
first repository-backed Mind Interpretation Contract v1 entrypoint. Its input
is a server-only Core-authorized evidence projection; the service has no
Firestore reads or writes. It returns versioned *candidate* observations with
an evidence basis, confidence, capability/model-policy/rule provenance,
limitations, expiry and a bounded product-purpose scope.

`FirestoreLearnerInsightRepository.approveAndPersist` is the corresponding
Core-owned Derived Observation Persistence Contract v1 boundary. It validates
the v1 shape, requires a non-empty evidence basis, verifies that every evidence
reference is in the authorized Core input, requires a non-empty consumer scope,
then promotes the candidate to `active` and records its approval policy.

The existing `LearnerInsight` read model remains supported during migration.
New v1 observations retain their legacy projection for current context readers,
but `getScopedLearnerContext` additionally enforces v1 product-purpose scope.
This does not authorize broader observation categories, provider calls, human
review workflows, or raw evidence exposure.

Evidence remains separate from Mind interpretation. `LearnerInsight` records
are derived observations, and must retain `basedOnEvidenceIds`, confidence, and
their own lifecycle metadata.

## Learner Context Contract v1

`LearnerContextRequest` is a versioned request, not an authorization grant. It
includes the learner, requesting product, specific purpose, and the minimum
requested domains. `LearnerContextResponse` contains only a minimized context,
an evidence-type/time summary, and limitations. It never returns raw evidence
payloads or internal Mind implementation detail.

The current Core policy allowlist is intentionally narrow:

| Product | Allowed purpose |
|---|---|
| Lurexa Learn | `learn_adaptive_practice` |
| Lurexa Coach | `coach_session_adaptation` |
| Lurexa Teach | `teacher_instructional_support` |

Admin, Insight, and Studio have no context purpose in v1. Adding a new
product-purpose pair requires an explicit Core authorization policy decision,
data-minimization review, and tests; it must not be enabled by accepting an
arbitrary query parameter.

The current direct consumer path is self-service context only: the authenticated
actor must equal the requested learner. Teacher/support access therefore needs a
separate role-aware authorization adapter before it can consume the Teach
purpose.

## Explicit non-goals

- provider-backed or human-review-derived persistent-state approval workflows
  beyond the current deterministic Core policy;
- cross-organization context aggregation;
- direct browser writes to trusted learner records;
- raw response or audio exposure through learner context;
- a universal authorization policy for every future product.

These are deliberate follow-on steps, not gaps filled by a client-side
convention.

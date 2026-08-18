# Learning Evidence Contract v1

- Status: **Normative design baseline**
- Owner: Lurexa Core, with Lurexa Mind and product input
- Applies to: Lurexa Learn, Coach, Teach, Studio, assessment services and approved future products

## Purpose

Learning evidence is an immutable or append-only account of what a learner did, produced, selected, or was assessed on. It is not an AI conclusion about what the learner knows.

This contract prevents products from keeping incompatible private histories and gives Lurexa Mind a reliable, authorized input layer.

## Boundary

- Products create experience-specific events.
- Lurexa Core validates authorization, provenance, schema version and persistence.
- Lurexa Mind may read authorized evidence and interpret it.
- Mind must not rewrite raw evidence to make it fit an inference.
- Corrections or invalidations create a linked correction record; they do not silently mutate historical evidence.

## Required envelope

Every evidence record must include:

| Field | Requirement |
| --- | --- |
| `evidenceId` | Globally unique, stable identifier |
| `schemaVersion` | Contract version used to produce the record |
| `learnerId` | Canonical Core learner identifier |
| `actor` | Learner, teacher, system, or approved service identity |
| `source` | Product, capability, activity and attempt/session identifiers |
| `eventType` | Controlled vocabulary event name |
| `occurredAt` | Time the learner action happened |
| `recordedAt` | Time Core accepted the record |
| `authorizationContext` | Tenant/organization and policy context used for acceptance |
| `payload` | Event-specific observable facts |
| `reliability` | Measurement conditions and limitations |
| `provenance` | How data was captured or transformed |
| `idempotencyKey` | Key preventing duplicate persistence |

Timestamps must use ISO 8601 UTC. Identifiers must not encode private learner information.

## Initial event families

| Family | Examples | Evidence, not inference |
| --- | --- | --- |
| placement | placement item response, self-report, validated prior credential | selected answer, score inputs, credential reference |
| learning activity | activity opened, submitted, completed, hint used, retry | actions, attempts, elapsed time |
| assessment | item response, rubric result, teacher score | response, rubric version, scorer identity |
| language production | spoken sample, transcription reference, writing sample reference | consented artifact references and extraction metadata |
| instructional context | lesson assigned, objective practiced, feedback shown | curricular IDs and delivery state |
| preference and goal | learner goal set, accessibility preference selected | learner-declared value and source |
| intervention | teacher observation, recommendation accepted/declined | action and declared rationale |

A “mastery level,” “recurring error,” “risk score,” or “CEFR estimate” is a derived observation, not raw evidence.

## Payload rules

1. Include stable competency, activity and content-version identifiers when relevant.
2. Preserve first-attempt performance separately from later attempts and hint-assisted success.
3. Store references to media or artifacts; do not duplicate large or sensitive raw assets in every event.
4. Capture data minimally. Do not store free-form transcript or audio when an approved aggregate is sufficient.
5. Never place secrets, provider credentials, unnecessary demographics, or unredacted sensitive personal data in an event.
6. Payload shape must be documented per event type before it is used by more than one product.

## Reliability and provenance

Reliability expresses the conditions under which the evidence can be trusted. Examples include self-reported, automatically scored, teacher-reviewed, speech-to-text confidence, offline-pending, or imported. Provenance identifies the source system, content/rubric version, capture method, and any non-destructive transformation.

Consumers must treat lower-reliability evidence appropriately rather than treating all records as equally certain.

## Acceptance and lifecycle

Core accepts an event only when the actor is authorized, the tenant and learner relationship is valid, the schema is supported, and the event passes validation. Offline clients may queue events, but acceptance occurs only after server-side reconciliation.

Evidence is retained, corrected, exported, or deleted according to Core policy, legal requirements and valid user/organization rights. Derived observations that depend on deleted or invalidated evidence must be re-evaluated.

## Non-goals

This contract does not define Firestore collections, vendor SDKs, a universal scoring algorithm, or a public analytics API. Those implementation choices must conform to this contract.

## Implementation gate

Before an event family becomes production-critical, define its payload schema, validation, authorization rule, retention class, idempotency behavior, and at least one representative test.

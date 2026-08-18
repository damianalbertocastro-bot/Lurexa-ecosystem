# Learner Context Contract v1

- Status: **Normative design baseline**
- Owner: Lurexa Core governs access; Lurexa Mind supplies approved interpretations
- Depends on: [Learning Evidence Contract v1](Learning%20Evidence%20Contract%20v1.md)

## Purpose

Learner Context is the minimum, authorized view of a learner that an experience or intelligence capability needs for a stated purpose. It is a purpose-scoped projection, not a full learner database export.

This implements the ecosystem principle:

> One learner. One evolving model. Every Lurexa experience adapts around it.

## Access model

A caller requests context with:

- authenticated actor and product/capability identity;
- canonical learner identifier;
- tenant/organization boundary;
- declared purpose;
- requested context domains;
- freshness requirement;
- a correlation identifier for auditability.

Lurexa Core evaluates whether the caller may access each domain. It returns only approved fields, with explicit omission metadata where useful. A missing field must never be treated as a negative learner trait.

## Context domains

| Domain | Examples | Authority |
| --- | --- | --- |
| identity and access | canonical IDs, active enrollment, role relation | Core |
| learning position | course/unit/lesson, assigned work, content availability | Core and product records |
| learner declarations | goals, preferred pace, accessibility/language preferences | Core trusted records |
| evidence summary | validated recent outcomes and evidence references | Core |
| derived learning state | CEFR estimate, candidate needs, recurring-pattern summaries | Mind output persisted through Core |
| session relevance | recently practiced targets, recommended next action | Mind output subject to policy |
| consent and controls | sharing limits, applicable policy flags | Core |

Direct identifiers and sensitive personal data must be excluded unless they are required for the approved purpose.

## Response requirements

Every response must contain:

| Field | Requirement |
| --- | --- |
| `contractVersion` | Version of the context contract |
| `learnerId` | Canonical ID only |
| `purpose` | Purpose actually authorized |
| `generatedAt` | UTC generation time |
| `freshness` | Current, cached, partial, or unavailable status |
| `domains` | Returned scoped domains |
| `sourceSummary` | Evidence/observation references and version metadata where relevant |
| `limitations` | Missing, stale, low-confidence, or withheld information |
| `policy` | Applicable controls, including prohibited use where needed |

A response must not expose raw evidence by default merely because a summary exists.

## Purpose examples

- **Learn adaptive practice** may receive current curriculum position, relevant targets, approved difficulty guidance and a limited recent-practice summary.
- **Coach session adaptation** may receive CEFR guidance, relevant curriculum context, learner goals, approved recurring speaking targets and correction preferences.
- **Teach intervention view** may receive role-appropriate progress summaries, teacher observations and interpretable intervention signals.
- **Insight analytics** uses aggregate or role-authorized data and should not request individual context unless an authorized use case requires it.

A product must request the least context necessary. “Personalization” is not sufficient as an unlimited purpose.

## Interpretation safeguards

Derived values must include confidence/reliability, recency, observation version and a learner-appropriate explanation when shown to the learner. Consumers must:

- distinguish absence of evidence from evidence of absence;
- avoid presenting a model hypothesis as fact;
- avoid making high-stakes automated decisions from a single low-confidence signal;
- support policy-required review, correction, opt-out or visibility controls.

## Cache and invalidation

Context may be cached only for the approved purpose and duration. Security/consent changes invalidate access immediately. Material evidence changes should invalidate or mark affected context stale according to product needs. Long-lived product-local copies of learner context are prohibited unless Core explicitly authorizes them.

## Non-goals

This contract does not authorize a product to write learner state directly. Products submit evidence or permitted declarations through their dedicated Core interfaces. Mind outputs follow the Derived Observation Persistence Contract.

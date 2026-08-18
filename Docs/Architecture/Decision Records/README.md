# Architecture Decision Records

Architecture Decision Records (ADRs) preserve decisions that are expensive to reverse, cross product boundaries, or are likely to be misunderstood later.

## When an ADR is required

Create an ADR before or with a change that:

- changes Lurexa Core, Lurexa Mind, or product ownership;
- changes the learner model, evidence, authorization, privacy or retention boundary;
- introduces or replaces a shared provider, platform dependency, or public contract;
- establishes a product boundary that other teams/products must follow;
- intentionally accepts a material trade-off.

Do not create ADRs for routine implementation choices, temporary experiments that have no shared impact, or decisions already mandated by a higher-authority document.

## File naming

Use zero-padded sequence numbers:

`0001-short-decision-title.md`

Never renumber published ADRs. Supersede them with a later ADR and link both records.

## Required structure

```md
# ADR 000X: Decision title

- Status: proposed | accepted | superseded | deprecated
- Date: YYYY-MM-DD
- Decision owner: role or named owner
- Supersedes: ADR n/a or number
- Superseded by: ADR n/a or number

## Context
## Decision
## Consequences
## Alternatives considered
## Implementation and migration notes
## References
```

## Existing foundational decisions

The following decisions are already normative and should be formalized as individual ADRs only when a change or implementation needs their historical record:

- Lurexa Learning Technologies is the parent identity.
- Lurexa Core is the trusted platform foundation.
- Lurexa Mind is the learning-intelligence layer.
- Products deliver experiences and evidence; they do not own competing learner truth.
- One learner has one evolving cross-product learner model.
- Dominican Spanish speakers learning English are Coach’s first deep linguistic profile; the architecture remains extensible.

## Review

An ADR becomes **accepted** only after the product owner or delegated architectural owner approves it. The corresponding code/docs change must link to the ADR. If implementation diverges, update the ADR or create a superseding one; do not treat the record as decorative history.

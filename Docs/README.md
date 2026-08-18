# Lurexa Documentation Map

This directory contains the versioned, repository-local documentation for the commercial Lurexa ecosystem.

## Authority order

When documents disagree, use this order:

1. Newer explicit decision from the product owner, recorded in an ADR when it changes an architectural commitment.
2. [00-Lurexa-Bible.md](00-Lurexa-Bible.md)
3. Detailed documents in [Architecture](Architecture/)
4. Applicable documents in [Curriculum](Curriculum/)
5. [ROADMAP.md](../ROADMAP.md)
6. Engineering, governance and AI-helper guidance

Do not silently blend conflicting assumptions. Mark the older claim as superseded or revise it in the same change.

## Documentation areas

| Area | Purpose | Primary users |
| --- | --- | --- |
| [Architecture](Architecture/) | Product boundaries, ownership, learner model and production contracts | engineers, product, AI agents |
| [Curriculum](Curriculum/) | Learning methodology, curriculum objects, assessment and Dominican Spanish specialization | curriculum, product, design, engineering |
| [Product](Product/) | Product outcomes, boundaries and MVP acceptance criteria | product, design, engineering |
| [Design](Design/) | Cross-product interaction, accessibility and learning-experience design rules | design, product, engineering |
| [Engineering](Engineering/) | Practices for building, testing, releasing and operating software | engineers and contributors |
| [Governance](Governance/) | Decision, review and change-control practices | maintainers and reviewers |
| [Standards](Standards/) | Cross-cutting quality and security standards | all contributors |

## Read first

- New to the ecosystem: [00-Lurexa-Bible.md](00-Lurexa-Bible.md)
- Building a product feature: [Architecture/Capability Architecture.md](Architecture/Capability%20Architecture.md), then the relevant curriculum or engineering document.
- Building personalization, AI memory, or Coach: read the four contracts below in order.
  1. [Learning Evidence Contract v1](Architecture/Learning%20Evidence%20Contract%20v1.md)
  2. [Learner Context Contract v1](Architecture/Learner%20Context%20Contract%20v1.md)
  3. [Mind Interpretation Contract v1](Architecture/Mind%20Interpretation%20Contract%20v1.md)
  4. [Derived Observation Persistence Contract v1](Architecture/Derived%20Observation%20Persistence%20Contract%20v1.md)
- Designing learning experiences: [Curriculum/README.md](Curriculum/README.md)
- Making a durable architectural choice: [Architecture/Decision Records/README.md](Architecture/Decision%20Records/README.md)

## Status language

- **Normative**: a rule or contract that implementations must follow.
- **Design baseline**: approved direction that may require refinement before implementation.
- **Proposed**: intentionally not yet approved for production use.
- **Implemented**: verified in repository code or deployed infrastructure. Documentation alone never proves this status.

The contract documents in this directory are normative design baselines. They define the required boundaries; they do not claim that every interface has already been implemented.

## Maintenance rule

A change that alters product ownership, trusted data, authorization, curriculum semantics, or public/shared interfaces must update its affected documentation in the same pull request. Small local implementation details do not need new architecture documents.

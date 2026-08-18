# Documentation Lifecycle and Change Control

## Purpose

Lurexa documentation is an operational control surface. It exists to prevent architecture drift, product duplication, unsafe learner-data handling, and AI-agent implementation based on stale assumptions.

## Document classes

| Class | Examples | Change rule |
| --- | --- | --- |
| source of truth | Lurexa Bible, core architecture, approved ADRs | product-owner or delegated architecture approval |
| normative contract | evidence, learner context, Mind interpretation | architecture review plus implementation owner |
| curriculum authority | methodology, competency model, assessment policy | curriculum owner plus product review |
| engineering standard | testing, accessibility, release policy | engineering owner review |
| working plan | roadmap, milestones, checklists | maintainers update as work changes |
| reference/history | migration notes, superseded ADRs | preserve with clear status |

## Required update triggers

Update documentation in the same pull request when a change alters:

- Core, Mind or product responsibility;
- data classification, learner-data access, consent or retention;
- a shared event, context, observation or SDK interface;
- curriculum object semantics, mastery or placement behavior;
- an approved provider boundary;
- a release, testing or security requirement.

Do not claim a feature is implemented merely because its design documentation exists. Mark repository-verified implementation separately.

## Change procedure

1. Identify the authoritative documents affected.
2. Make the smallest coherent document change.
3. Update inbound links, indexes and status labels.
4. Add or update an ADR for durable cross-cutting decisions.
5. Review for contradictions against the Bible, Architecture and Curriculum sources.
6. Validate Markdown links and named file references.
7. Commit documentation with a clear scope.

## Status and deprecation

Documents and material sections should use clear labels: proposed, normative design baseline, accepted, implemented, deprecated or superseded. Deprecated content must link to the replacement. Never delete a decision record merely to hide a past assumption.

## Review responsibility

- Product owner: product scope, prioritization and business intent.
- Architecture owner: ownership, contracts, Core/Mind boundaries and data flow.
- Curriculum owner: pedagogical correctness and learning evidence semantics.
- Engineering owner: feasibility, operations, security and testability.
- Privacy/security review: sensitive data, authorization and provider exposure where relevant.

One person may temporarily perform several roles, but the concerns must still be checked explicitly.

## AI-assisted work

AI agents must read the relevant source-of-truth documents before changing governed areas. Prompts and generated output are not authority. Human/product-owner approval remains required for material product, privacy, or architectural decisions.

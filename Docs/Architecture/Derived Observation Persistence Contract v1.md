# Derived Observation Persistence Contract v1

- Status: **Normative design baseline**
- Owner: Lurexa Core persists approved observations; Lurexa Mind produces candidate interpretations
- Depends on: [Mind Interpretation Contract v1](Mind%20Interpretation%20Contract%20v1.md)

## Purpose

A derived observation is a versioned, reviewable interpretation of evidence—for example, a CEFR estimate, a recurring pronunciation target, or a recommended practice focus. It is neither raw evidence nor unquestionable fact.

This contract ensures that useful learner intelligence can persist across products without allowing Mind or an individual product to become the uncontrolled owner of learner truth.

## Persistence flow

1. Mind produces a candidate interpretation from authorized inputs.
2. Core validates schema, purpose, authorization, provenance, retention class and policy.
3. Core persists an approved observation or rejects it.
4. Authorized consumers receive the observation through Learner Context, not a private direct database read.
5. Evidence changes, expiry, user controls or review can invalidate, replace or downgrade the observation.

## Required fields

| Field | Requirement |
| --- | --- |
| `observationId` | Stable ID |
| `learnerId` | Canonical Core learner ID |
| `type` | Controlled observation type |
| `status` | candidate, active, superseded, invalidated, expired or withdrawn |
| `value` | Structured, bounded claim |
| `confidence` | Calibrated value/band and explanation |
| `evidenceBasis` | References to evidence and prior observations |
| `generatedBy` | Mind capability plus model/policy version |
| `review` | Automated and/or human review state |
| `effectiveAt` / `expiresAt` | Validity window |
| `scope` | Purposes/products/tenants allowed to consume it |
| `provenance` | Method, versions and relevant constraints |
| `supersedes` | Prior observation ID when applicable |

## Observation rules

- An observation must make a falsifiable or operationally useful claim, not store unrestricted model prose.
- It must identify the evidence basis and limitations.
- It must expire or be re-evaluated when the claim can become stale.
- It must be superseded, not overwritten, when material meaning changes.
- Learner declarations and teacher observations remain distinguishable from AI-generated observations.
- No observation may silently change access, eligibility, pricing, or a high-stakes outcome without explicit approved policy and review.
- Consumers must not present uncertain estimates as fixed labels.

## Initial allowed categories

1. proficiency/placement guidance;
2. curriculum-relevant strengths and needs;
3. recurring, evidence-supported language patterns;
4. recommended practice priorities;
5. engagement/support signals that are interpretable and policy-approved;
6. learner feedback preferences inferred only when evidence and policy support them.

New categories require an ADR or documented architecture review when they increase sensitivity, cross-product impact, or decision risk.

## Correction, rights and deletion

The system must support review and correction pathways appropriate to the observation type. If supporting evidence is invalidated, deleted, or becomes unauthorized, Core must mark dependent observations stale, invalidated or withdrawn and prevent inappropriate reuse.

## Audit

Core records creation, validation, use, change of status, access and deletion/withdrawal events at an appropriate privacy-preserving level. The audit trail must identify the policy and model/prompt version responsible for the observation.

## Non-goals

This contract does not decide the database table/collection shape, scoring algorithm, or user-interface labels. It defines the required lifecycle and trust properties.

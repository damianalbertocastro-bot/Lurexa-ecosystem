# Lurexa Architecture Decisions

Last updated: 2026-08-17

This file records current architecture decisions for AI collaborators. Newer explicit product-owner decisions supersede older entries.

## ADR-001 — Parent company and ecosystem layers

**Decision:** Lurexa Learning Technologies is the parent/master business identity. Lurexa Core and Lurexa Mind are shared ecosystem layers. Learn, Coach, Teach, Admin, Insight and Studio are the product family.

**Consequence:** Do not present Core or Mind as ordinary end-user products.

## ADR-002 — Core owns trust

**Decision:** Lurexa Core owns or governs identity, authentication, authorization, trusted learner records, persistence, cross-product contracts and shared platform services.

**Consequence:** Mind and product applications must not create competing authoritative persistence or permissions.

## ADR-003 — Mind interprets evidence

**Decision:** Lurexa Mind is the shared learning-intelligence layer for personalization, adaptation, recommendations, interventions, tutoring/coaching and cross-product interpretation.

**Consequence:** Mind may produce derived observations, but approved persistent state flows through Core-governed boundaries.

## ADR-004 — One persistent Learner Model

**Decision:** Lurexa uses one persistent cross-product Learner Model.

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

**Consequence:** Products must not create isolated conflicting learner profiles when reliable authorized information already exists.

## ADR-005 — Evidence and inference remain distinct

**Decision:** Raw/structured learning evidence must remain distinguishable from Mind-derived interpretation.

**Consequence:** Preserve provenance, time and reliability/confidence where appropriate. Do not silently overwrite evidence with AI conclusions.

## ADR-006 — Cross-product adaptation is a learning loop

**Decision:** Learn, Coach and future products contribute evidence; Mind interprets it; Core governs trusted persistence/context; authorized products adapt from the updated learner representation.

**Consequence:** Do not implement the ecosystem as manual profile synchronization.

## ADR-007 — Lurexa Coach product definition

**Decision:** Coach is an AI-powered English speaking and pronunciation product. Its first deep specialization is Dominican Spanish speakers learning English.

**Objectives:** intelligibility, naturalness, fluency, pronunciation refinement, spoken confidence, recurring-pattern detection, corrective practice and L1-transfer-aware coaching.

**Non-goal:** accent erasure.

**Consequence:** Coach consumes Core and Mind; Coach does not become a separate AI/persistence architecture.

## ADR-008 — Linguistic profiles are extensible

**Decision:** Dominican Spanish is the first deep L1 linguistic profile, not a permanent technical limit.

**Consequence:** additional L1 profiles must be addable without redesigning Coach or the Learner Model from scratch.

## ADR-009 — Commercial ecosystem supersedes thesis constraints

**Decision:** the thesis prototype is a validation/reference artifact. Active development targets the commercial production ecosystem.

**Consequence:** thesis-specific assumptions do not override commercial architecture unless explicitly re-adopted.

## ADR-010 — No premature package renaming

**Decision:** conceptual Core/Mind ownership does not require immediate repository/package renaming.

**Consequence:** inspect actual code, map responsibility, define contracts and refactor only where a real boundary or milestone requires it.

## Superseded assumptions

Obsolete unless explicitly reintroduced:

- Lurexa as only an LMS plus portals;
- Mind independently owning authoritative learner persistence;
- one learner profile per product;
- Coach as a generic chatbot feature;
- accent erasure as a Coach goal;
- Dominican Spanish as a permanent architecture limitation;
- direct product UI → AI provider for persistent learner intelligence;
- thesis prototype constraints defining the commercial platform.
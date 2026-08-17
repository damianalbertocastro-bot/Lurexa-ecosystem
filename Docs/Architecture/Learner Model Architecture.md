# Learner Model Architecture

Status: Authoritative conceptual architecture  
Owner: Lurexa Learning Technologies  
Last updated: 2026-08-17

## Governing principle

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Lurexa uses one persistent cross-product Learner Model. Products must not create isolated, conflicting learner profiles when reliable and authorized learner information already exists elsewhere in the ecosystem.

This document defines architectural responsibility. It does **not** assert that every capability described here is already implemented.

## Responsibility model

```text
Products
  generate learning experiences and evidence
        ↓
Lurexa Core
  authenticates, authorizes, validates and persists trusted records
        ↓ authorized evidence/context
Lurexa Mind
  interprets evidence and produces learning intelligence
        ↓ approved derived intelligence
Lurexa Core
  persists approved authoritative records where required
        ↓ authorized learner context
Products
  adapt the next experience
```

The Learner Model is the persistent evolving representation of the learner across the ecosystem. It spans trusted evidence/state owned by Core and interpretations produced by Mind. It is **not** a second database owned independently by Mind.

## Lurexa Core responsibility

Core owns the trusted record and the infrastructure required to protect it.

Core responsibilities include:

- canonical learner identity;
- authentication;
- authorization and permissions;
- trusted learner records;
- persistence;
- evidence provenance;
- cross-product data contracts;
- access-control enforcement;
- lifecycle and retention rules;
- approved persistence of derived observations;
- safe exchange of authorized learner information between products and Mind.

Products and Mind must not bypass Core ownership rules to create competing authoritative state.

## Lurexa Mind responsibility

Mind interprets authorized learning evidence and produces reusable learning intelligence.

Mind may support:

- learner-state interpretation;
- personalization;
- adaptive experiences;
- recommendations;
- learning interventions;
- AI tutoring and coaching;
- mastery estimates;
- recurring-error interpretation;
- pronunciation-pattern interpretation;
- goal-aware adaptation;
- cross-product learning intelligence.

Mind does not become the authoritative authentication, authorization, or persistence layer.

## Learner Model domains

The model may progressively represent information such as:

- CEFR level and proficiency evidence;
- curriculum position and context;
- demonstrated competencies;
- recurring mistakes;
- pronunciation patterns and targets;
- vocabulary development;
- grammar development;
- fluency development;
- learning goals;
- strengths and weaknesses;
- activity and performance history;
- prior interventions;
- relevant learning preferences;
- progress over time.

Not every domain must be implemented at once. Domains should be introduced when a product need, evidence source, privacy rule, and ownership contract are clear.

## Evidence versus interpretation

Lurexa must preserve the distinction between observations and conclusions.

### Evidence

Examples:

- completed activity;
- assessment response;
- lesson progress;
- speaking sample metadata;
- pronunciation observation;
- repeated grammar error;
- successful correction;
- teacher-entered observation.

Evidence should carry enough provenance to understand where it came from, when it occurred, and how trustworthy it is.

### Interpretation

Examples:

- likely CEFR state;
- probable recurring pronunciation pattern;
- recommended practice target;
- estimated vocabulary weakness;
- suggested intervention;
- confidence that a prior weakness has improved.

Interpretations should not silently overwrite raw evidence. Where an interpretation becomes persistent learner state, it must pass through approved Core-owned contracts.

## Provenance and confidence

Where appropriate, learner evidence and derived intelligence should include:

- source product or service;
- source activity/session;
- timestamp;
- evidence type;
- confidence or reliability indicator;
- model/rule version when AI-derived;
- review status when human validation is relevant;
- authorization/privacy classification.

## Cross-product adaptation

A learner moving between Lurexa products should experience continuity.

Example: a learner uses Lurexa Learn and later opens Lurexa Coach. When authorized and relevant, Coach should receive existing context such as:

- CEFR level;
- current curriculum context;
- recurring English mistakes;
- pronunciation targets;
- learning goals;
- previous learning activity;
- demonstrated strengths and weaknesses.

Coach should not ask the learner to start over when reliable authorized evidence already exists.

New evidence from Coach can improve the shared Learner Model and later help Learn or another authorized product adapt. This is a two-way ecosystem learning loop, not simple profile synchronization.

## Lurexa Coach specialization

Coach is an AI-powered English speaking and pronunciation product.

Its first deep linguistic specialization is Dominican Spanish speakers learning English. Coach should prioritize:

- intelligibility;
- naturalness;
- speaking fluency;
- pronunciation refinement;
- confidence in spoken communication;
- recurring-pattern identification;
- targeted corrective practice;
- Dominican-Spanish-to-English linguistic transfer;
- context-aware practice appropriate to level and goals.

The goal is **not accent erasure**.

Dominican Spanish is the first deep L1 profile, not a permanent architecture constraint. L1-transfer knowledge must be extensible so additional linguistic profiles can be added without redesigning Coach or the Learner Model.

## Access and minimization

Products consume only learner information they are authorized and designed to use.

Rules:

1. A valid identity does not imply access to every learner-model field.
2. Product contracts should request the minimum context needed for the experience.
3. Sensitive or high-impact inferences require stronger governance than ordinary activity history.
4. Mind receives only the context necessary for the intelligence task.
5. Product UIs must not expose internal model detail merely because it exists.

## Contract boundaries

The architecture should evolve toward explicit contracts for:

### Learning Evidence Contract

Products submit structured evidence through approved Core boundaries.

### Learner Context Contract

Products request authorized learner context appropriate to a specific experience.

### Mind Interpretation Contract

Core-authorized evidence/context is supplied to Mind for interpretation.

### Derived Observation Persistence Contract

Approved Mind outputs that should influence persistent learner state are validated and persisted through Core-owned boundaries.

The exact schemas are future implementation work and must be designed against the existing repository before code changes are claimed.

## Anti-patterns

Do not:

- create a separate learner truth inside each product;
- create a giant ungoverned `learnerModel` document that mixes evidence, guesses, permissions, and UI state;
- let product UIs directly mutate inferred learner state;
- allow Mind to become the authorization layer;
- allow products to call model providers directly for persistent personalization logic;
- overwrite evidence with AI conclusions;
- treat pronunciation scores as unquestionable truth;
- hard-code Dominican Spanish assumptions so deeply that another L1 requires a rewrite.

## Implementation strategy

Architecture changes do not automatically require immediate refactoring.

Before changing packages or persistence:

1. map current repository capabilities to Core, Mind, and product responsibilities;
2. identify actual duplication or boundary violations;
3. define the smallest useful v1 evidence/context contracts;
4. preserve compatible packages and services;
5. refactor only where an implementation boundary is justified.

## Related documents

- `Docs/00-Lurexa-Bible.md`
- `Docs/Architecture/Capability Architecture.md`
- `Docs/Architecture/Capability Interaction Matrix.md`
- `Docs/Architecture/Dependency Graph.md`
- `ROADMAP.md`
- `AGENTS.md`

## Source-of-truth rule

If an older Lurexa document says that Mind independently owns the authoritative Learner Model, that each product owns its own learner profile, or that the thesis prototype defines the commercial architecture, that statement is superseded by this architecture.
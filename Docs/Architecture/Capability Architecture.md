# Capability Architecture

Status: Authoritative conceptual architecture  
Owner: Lurexa Learning Technologies  
Last updated: 2026-08-17

## Purpose

This document defines how Lurexa capabilities are grouped and owned across the ecosystem. It describes conceptual responsibility, not a requirement to rename existing repository packages immediately.

## Company and ecosystem model

```text
Lurexa Learning Technologies
│
├── Shared ecosystem layers
│   ├── Lurexa Core
│   └── Lurexa Mind
│
└── Product family
    ├── Lurexa Learn
    ├── Lurexa Coach
    ├── Lurexa Teach
    ├── Lurexa Admin
    ├── Lurexa Insight
    └── Lurexa Studio
```

Core and Mind are shared ecosystem layers, not ordinary end-user products.

## Responsibility rule

```text
Products → experiences and learning evidence
Mind     → interpretation and learning intelligence
Core     → trust, identity, authorization, persistence and authoritative records
Learner Model → persistent evolving learner representation across the ecosystem
```

Products consume only the information they are authorized and designed to use.

## Lurexa Core capability domains

Core owns or governs trusted platform capabilities such as:

### Identity and access
- authentication;
- canonical user/learner identity;
- role and permission enforcement;
- session and access policy;
- organization/tenant membership.

### Trusted learner records
- enrollment and curriculum position records;
- progress and assessment records;
- learning-event/evidence persistence;
- evidence provenance;
- authoritative learner-record lifecycle;
- approved persistence of derived observations.

### Platform contracts
- shared domain contracts;
- cross-product APIs/SDKs;
- authorization-aware learner-context contracts;
- evidence-ingestion contracts;
- service boundaries for Mind and products.

### Shared platform services
- organizations and tenancy;
- content contracts and delivery infrastructure;
- commerce/billing infrastructure;
- scheduling;
- notifications;
- configuration;
- storage;
- auditing;
- observability;
- offline/synchronization infrastructure.

Core is responsible for trust. It must not delegate authoritative access control or persistence ownership to a product UI or AI model.

## Lurexa Mind capability domains

Mind owns reusable learning-intelligence capabilities such as:

### Learner interpretation
- learner-state interpretation;
- mastery estimation;
- recurring-error interpretation;
- strengths/weaknesses interpretation;
- goal-aware learning intelligence.

### Personalization and adaptation
- recommendations;
- adaptive sequencing;
- intervention suggestions;
- context selection;
- content adaptation;
- learning-path intelligence.

### AI learning interactions
- AI tutoring;
- coaching intelligence;
- pedagogical agent orchestration;
- feedback generation;
- assessment intelligence;
- model/provider abstraction;
- validation and responsible-AI safeguards.

### Speaking and pronunciation intelligence
- speaking-performance interpretation;
- pronunciation-pattern interpretation;
- fluency signals;
- corrective-practice selection;
- L1-transfer intelligence;
- extensible linguistic-profile support.

Mind interprets authorized evidence. It does not independently own authentication, permissions, or authoritative persistence.

## Shared Learner Model

The Learner Model is a cross-product ecosystem construct, not a product-specific profile and not a free-standing Mind database.

It progressively represents the learner through:

- trusted evidence and state persisted under Core governance;
- interpretations produced by Mind;
- authorized context consumed by products.

See `Learner Model Architecture.md` for the detailed rules.

## Product capability boundaries

### Lurexa Learn

Primary responsibility: learner-facing LMS and structured learning experience.

May include:
- courses, modules and lessons;
- learning activities;
- assessments;
- progress experience;
- curriculum-linked practice;
- offline-capable learning flows;
- personalized learning experiences using authorized Mind intelligence.

Learn generates learning evidence but should not become the authoritative Learner Model owner.

### Lurexa Coach

Primary responsibility: AI-powered English speaking and pronunciation experience.

Coach should use authorized learner context from the ecosystem and contribute new speaking/pronunciation evidence back through approved Core boundaries.

Its first deep linguistic specialization is Dominican Spanish speakers learning English. The goal is intelligibility, naturalness, fluency, pronunciation refinement and confidence — not accent erasure.

L1 linguistic profiles must be extensible beyond Dominican Spanish.

### Lurexa Teach

Primary responsibility: educator workflows.

May include:
- class and learner management;
- assignment workflows;
- learner-progress review;
- scheduling;
- teacher-facing recommendations;
- appropriate learner-intelligence summaries;
- AI-assisted instructional support.

Teach consumes role-appropriate learner context. It must not expose unrestricted internal Learner Model state.

### Lurexa Admin

Primary responsibility: institution and platform administration.

May include:
- organizations and users;
- roles and permissions;
- programs/configuration;
- subscriptions/billing administration;
- governance and audit workflows;
- learner-data access policy controls.

### Lurexa Insight

Primary responsibility: analytics, intelligence and reporting.

May include:
- learner outcome analysis;
- cohort/course analysis;
- engagement/retention analysis;
- institutional dashboards;
- interpretable learning-risk/intervention signals;
- authorized aggregated speaking/pronunciation trends.

Insight is a product that consumes governed Core data and Mind intelligence; it is not the persistence layer.

### Lurexa Studio

Primary responsibility: content and learning-experience creation.

May include:
- course and lesson authoring;
- assessment/question-bank creation;
- media/resource management;
- reusable learning objects;
- publishing and versioning;
- AI-assisted content creation through Mind.

Studio owns authoring experiences, not learner truth.

## Cross-product learning loop

```text
Product experience
    ↓
Learning evidence
    ↓
Core validation + authorization + persistence
    ↓
Mind interpretation
    ↓
Approved derived intelligence/state
    ↓
Core-governed learner context
    ↓
Authorized product adaptation
```

This is a two-way ecosystem learning loop. It should not be implemented as informal profile copying between products.

## Repository mapping rule

Existing packages should be mapped to these capability domains before any renaming or splitting decision.

Examples of likely conceptual mappings include:

- `@lurexa/auth` → Core identity/access;
- `@lurexa/database` → Core persistence boundary;
- `@lurexa/backend` → may host Core and/or Mind server capabilities depending on actual module responsibility;
- `@lurexa/types` → shared contracts, with ownership made explicit by domain;
- `@lurexa/sdk` → supported application/service contracts;
- `@lurexa/ui`, `@lurexa/tokens` → shared experience/design infrastructure.

These mappings are architectural guidance only. Verify actual package contents before claiming a package already implements a capability.

## Dependency principles

1. Products may depend on supported Core and Mind interfaces.
2. Mind may depend on authorized Core interfaces for context/evidence.
3. Core must not depend on product applications.
4. Core trust decisions must not depend on AI output.
5. Product UIs must not call AI providers directly for production learning intelligence.
6. Product UIs must not write arbitrary learner-model state directly.
7. Shared capabilities should be extracted only when reuse and ownership justify it.

## Commercial direction

The earlier thesis prototype is a validation/reference artifact. It does not define the production architecture.

The active target is the scalable commercial multi-product Lurexa ecosystem.

## Superseded models

The following architectural assumptions are obsolete:

- Lurexa as a single LMS with portals attached;
- one learner profile per product;
- Mind as authoritative record/persistence owner;
- Coach as merely a generic chatbot feature;
- direct product-to-model-provider coupling;
- thesis constraints as the primary commercial architecture constraints.

## Related documents

- `Docs/00-Lurexa-Bible.md`
- `Docs/Architecture/Learner Model Architecture.md`
- `Docs/Architecture/Capability Interaction Matrix.md`
- `Docs/Architecture/Dependency Graph.md`
- `ROADMAP.md`
- `AGENTS.md`
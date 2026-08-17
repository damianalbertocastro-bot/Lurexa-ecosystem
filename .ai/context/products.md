# Lurexa Product Ecosystem

Version: 1.2  
Status: Approved  
Last updated: 2026-08-17

## Authoritative company and product model

```text
Lurexa Learning Technologies
│
├── Shared ecosystem layers
│   ├── Lurexa Core
│   └── Lurexa Mind
│
└── Products
    ├── Lurexa Learn
    ├── Lurexa Coach
    ├── Lurexa Teach
    ├── Lurexa Admin
    ├── Lurexa Insight
    └── Lurexa Studio
```

**Lurexa Learning Technologies** is the parent company and master business identity.

**Lurexa Core** owns trust: identity, authentication, authorization, permissions, trusted learner records, persistence, shared platform services and cross-product contracts.

**Lurexa Mind** interprets authorized learning evidence and provides personalization, adaptation, recommendations, interventions, AI tutoring/coaching, assessment intelligence, pronunciation/fluency intelligence and cross-product learning intelligence.

Core and Mind are shared ecosystem layers, not ordinary end-user products.

## Governing learner principle

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Lurexa uses one persistent cross-product Learner Model.

Authorized products generate learning evidence. Mind interprets that evidence. Core owns trusted persistence and authorization. Products receive only the context they are authorized and designed to use.

The Learner Model may progressively include CEFR state, curriculum context, competencies, recurring mistakes, pronunciation patterns/targets, vocabulary and grammar development, fluency development, goals, strengths/weaknesses, activity/performance history, interventions, relevant preferences and progress over time.

Do not create separate learner truth per product.

## Lurexa Learn

Learner-facing LMS and structured learning experience.

Responsibilities may include:
- CEFR-aligned course delivery;
- modules, lessons, activities and assessment;
- progress experience;
- offline-capable learning where practical;
- personalized learning experiences using Mind;
- generation of trustworthy learning evidence through Core-governed contracts.

Learn does not own a separate personalization or learner-memory architecture.

## Lurexa Coach

AI-powered English speaking and pronunciation product.

First deep linguistic specialization: **Dominican Spanish speakers learning English**.

Coach prioritizes:
- intelligibility;
- naturalness;
- speaking fluency;
- pronunciation refinement;
- spoken confidence;
- recurring-pattern identification;
- targeted corrective practice;
- Dominican-Spanish-to-English transfer awareness;
- context-aware practice appropriate to CEFR level and goals.

The objective is **not accent erasure**.

Coach should use reliable authorized learner context already known by Lurexa rather than repeatedly asking learners to start over. New Coach evidence should be capable of improving the shared Learner Model through Core/Mind boundaries.

Dominican Spanish is the first deep L1 profile, not a permanent technical limit. Additional L1 linguistic profiles must be addable without rebuilding Coach or the Learner Model.

Coach is a product powered by Core and Mind. Coach must not become a second Mind or an independent learner-profile store.

## Lurexa Teach

Teacher-facing product for class and learner management, assignments, scheduling, progress/intervention review and AI-assisted instructional support.

Teach may consume role-appropriate Learner Model summaries and contribute approved teacher observations/interventions.

## Lurexa Admin

Institutional and administrative product for organizations, users, roles/permissions, program configuration, subscriptions/billing, governance, audit and policy workflows.

Admin configures governance; Core enforces trusted authorization and persistence.

## Lurexa Insight

Analytics, intelligence and reporting product.

Responsibilities may include learner outcomes, cohort/course performance, engagement/retention, institutional dashboards, AI/learning-impact metrics and interpretable intervention signals.

The authoritative product name is **Lurexa Insight**. Do not introduce `Lurexa Analytics` or `Lurexa Insights` as current product names.

## Lurexa Studio

Content and learning-experience creation product for course/lesson authoring, assessments, media/resources, reusable learning objects, versioning/publishing and AI-assisted creation through Mind.

Studio owns authoring experiences, not learner truth.

## Cross-product learning loop

```text
Product experience
  ↓ evidence
Core trusted persistence
  ↓ authorized evidence/context
Mind interpretation
  ↓ approved intelligence
Core-governed learner context
  ↓
Authorized product adaptation
```

This is a two-way learning loop, not profile synchronization.

## Product boundary rules

Correct:
- Learn delivers structured learning.
- Coach delivers speaking/pronunciation coaching.
- Teach delivers teacher workflows.
- Admin delivers administration/governance workflows.
- Insight delivers analytics/reporting.
- Studio delivers authoring.
- Mind delivers shared learning intelligence.
- Core owns trust and trusted persistence.

Incorrect:
- each product creates its own learner model;
- Coach becomes the AI platform;
- Mind becomes the authentication/persistence authority;
- products copy learner profiles between apps;
- product UIs directly call model providers for persistent learner intelligence;
- product UIs directly mutate arbitrary inferred learner state.

## Commercial direction

The thesis prototype is a validation/reference artifact. Active Lurexa work targets the scalable commercial multi-product ecosystem.

## Roadmap orientation

Current strategic sequence:

1. engineering/Core foundation;
2. Lurexa Learn production MVP;
3. Learner Model + Mind foundation;
4. Lurexa Coach MVP;
5. closed-loop Learn ↔ Coach adaptation;
6. Lurexa Teach;
7. offline/mobile resilience;
8. Lurexa Admin + Insight;
9. Lurexa Studio;
10. Coach distribution expansion;
11. additional L1 profiles, subjects and ecosystem expansion.

Use `ROADMAP.md` for the authoritative implementation sequence.
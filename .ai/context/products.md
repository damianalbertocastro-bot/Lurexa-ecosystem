# Lurexa Product Ecosystem

Version: 1.3  
Status: Approved  
Last updated: 2026-08-20

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

Lurexa Learn is the learning-management and instructional-delivery product for learners and the teachers who operate their learning experiences.

Responsibilities include:
- student dashboard;
- teacher dashboard;
- CEFR-aligned course delivery;
- modules, lessons, activities and assessment;
- classes, assignments and learning management;
- learner progress/support workflows;
- offline-capable learning where practical;
- personalized learning experiences using Mind;
- generation of trustworthy learning evidence through Core-governed contracts.

The teacher dashboard inside Learn exists to manage learners, classes, lessons, assignments and instructional delivery. It must be branded Lurexa Learn, not Lurexa Teach.

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

Lurexa Teach is the independent educator professional-development product. It does not own the Lurexa Learn teacher dashboard.

Responsibilities include:
- teacher professional development;
- teacher CEFR / English proficiency growth;
- professional courses and learning pathways;
- teaching-practice development;
- training and competency-based certification;
- teacher community and professional circles;
- peer collaboration and feedback;
- professional evidence, reflection and educator credentials;
- personalized professional-growth recommendations through Mind.

A teacher may use both Learn and Teach with one Lurexa identity. Learn is where teachers operate student learning; Teach is where teachers develop themselves professionally.

Teach may use authorized educator context and professional evidence. Core owns trusted identity, persistence, evidence verification and credential awards. Mind interprets authorized educator state and evidence to recommend next steps.

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
- Learn delivers structured student learning, the student dashboard and the teacher operational dashboard.
- Coach delivers speaking/pronunciation coaching.
- Teach delivers educator professional development, proficiency growth, professional learning, certification and community.
- Admin delivers administration/governance workflows.
- Insight delivers analytics/reporting.
- Studio delivers authoring.
- Mind delivers shared learning intelligence.
- Core owns trust and trusted persistence.

Incorrect:
- branding the Learn teacher dashboard as Lurexa Teach;
- placing class/learner-management ownership under Teach;
- creating a second teacher identity to separate Learn from Teach;
- each product creates its own learner model;
- Coach becomes the AI platform;
- Mind becomes the authentication/persistence authority;
- products copy learner profiles between apps;
- product UIs directly call model providers for persistent learner intelligence;
- product UIs directly mutate arbitrary inferred learner state.

Repository mapping:
- `apps/teacher-portal` = Lurexa Learn teacher operational workspace.
- `apps/teach-web` = independent Lurexa Teach professional-development product.

See `Docs/Product/LUREXA_LEARN_TEACH_BOUNDARY.md` for the authoritative Learn/Teach boundary and `Docs/Architecture/LUREXA_TEACH_MVP_ARCHITECTURE.md` for Teach MVP implementation ownership.

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

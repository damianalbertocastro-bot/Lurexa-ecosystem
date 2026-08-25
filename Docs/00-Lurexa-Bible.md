---
title: Lurexa Bible
subtitle: Authoritative Guide to the Lurexa Ecosystem
version: 1.4.0
status: Approved
owner: Lurexa Learning Technologies
author: Damian + AI collaborators
created: 2026-07-23
last_updated: 2026-08-24
---

# Lurexa Bible

This document is the primary strategic source of truth for Lurexa. Detailed architecture documents may provide deeper implementation guidance, but they must not contradict the responsibility model defined here.

## 1. Company identity

**Lurexa Learning Technologies** is the parent company and master business identity.

It owns the Lurexa brand, ecosystem strategy, product portfolio, platform technologies, intellectual property, standards and long-term commercial direction.

Lurexa is not a single LMS. It is a scalable commercial EdTech ecosystem designed to support multiple learning products, educators, institutions, content workflows and intelligence capabilities.

The earlier thesis prototype is a **validation/reference artifact**. It is not the production architecture and does not constrain the commercial roadmap unless a later explicit decision adopts a specific validated idea.

## 2. Vision

Build a trusted intelligent learning ecosystem in which every authorized learning experience can benefit from a learner's evolving history without forcing the learner to start over in each product.

## 3. Mission

Empower learners and educators through intelligent, personalized, accessible and measurable education while preserving human agency, privacy and trustworthy technical foundations.

## 4. Governing learner principle

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Lurexa uses one persistent cross-product Learner Model rather than independent learner profiles per product.

Authorized products contribute learning evidence. Lurexa Mind interprets that evidence. Lurexa Core owns trusted records, authorization and persistence. Products consume only the context they are authorized and designed to use.

## 5. Company and product architecture

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
    ├── Lurexa Studio
    └── Lurexa Campus
```

Core and Mind are not ordinary end-user products. They are reusable ecosystem layers that support the product family.

## 6. Lurexa Core

**Lurexa Core** is the shared trusted technical/platform foundation.

Core owns or governs:

- identity and authentication;
- authorization and permissions;
- canonical user and learner identity;
- trusted learner records;
- persistence;
- shared platform services;
- cross-product data contracts;
- organizations and tenancy;
- enrollment and progress records;
- evidence provenance;
- approved persistence of derived observations;
- content contracts;
- commerce/billing infrastructure;
- scheduling;
- notifications;
- storage and configuration;
- audit/observability infrastructure;
- offline/synchronization trust boundaries;
- infrastructure required for products to safely exchange authorized learning information.

**Core owns the trusted record.**

Core must remain reliable, secure, modular and largely invisible to end users.

## 7. Lurexa Mind

**Lurexa Mind** is the shared AI and learning-intelligence layer.

Mind interprets authorized learning evidence and can support:

- personalization;
- learner-state interpretation;
- adaptive experiences;
- recommendations;
- learning interventions;
- AI tutoring and coaching;
- mastery/error interpretation;
- pronunciation and fluency intelligence;
- L1-transfer intelligence;
- assessment intelligence;
- content adaptation;
- pedagogical agents;
- model/provider abstraction;
- validation and responsible-AI safeguards.

Mind does **not** own authoritative authentication, authorization or persistence. When a Mind-derived observation should become persistent learner state, it must pass through an approved Core-governed boundary.

## 8. Learner Model

The Learner Model is the persistent evolving representation of the learner across the ecosystem.

It may progressively represent:

- CEFR level;
- curriculum position/context;
- demonstrated competencies;
- recurring mistakes;
- pronunciation patterns and targets;
- vocabulary development;
- grammar development;
- fluency development;
- goals;
- strengths and weaknesses;
- activity/performance history;
- prior interventions;
- relevant learning preferences;
- progress over time.

The Learner Model is an ecosystem construct: trusted evidence/state is governed by Core; Mind interprets authorized evidence; products receive only appropriate context.

It must not become a giant ungoverned profile document mixing raw evidence, AI guesses, permissions and UI state.

## 9. Cross-product learning loop

Lurexa should behave as one learning relationship.

Example:

```text
Learn experience
  ↓ learning evidence
Core trusted record
  ↓ authorized evidence
Mind interpretation
  ↓ authorized learner context
Coach adaptation
  ↓ speaking/pronunciation evidence
Core trusted record
  ↓
Mind interpretation
  ↓
Learn next experience
```

This is a two-way ecosystem learning loop, not simple profile synchronization.

A learner moving from Learn to Coach should not need to restate reliable authorized information already known by Lurexa, such as CEFR level, current curriculum context, recurring English mistakes, pronunciation targets, goals, relevant prior activity, strengths or weaknesses.

## 10. Product family

### Lurexa Learn

Lurexa Learn is the learning-management and instructional-delivery product for learners and the teachers who operate their learning experiences.

Learn owns:

- student dashboard;
- teacher dashboard;
- course and lesson experience;
- learning management;
- classes and assignments;
- learner progress and support workflows;
- assessment and structured learning delivery;
- adaptive learning experiences;
- trustworthy learning evidence generated through Core-governed contracts.

The teacher dashboard inside Learn exists so teachers can manage student learning. It must be branded Lurexa Learn. It is not the Lurexa Teach product.

### Lurexa Coach

AI-powered English speaking and pronunciation experience.

Its first deep linguistic specialization is **Dominican Spanish speakers learning English**.

Coach prioritizes:

- intelligibility;
- naturalness;
- speaking fluency;
- pronunciation refinement;
- confidence in spoken communication;
- recurring pronunciation-pattern identification;
- targeted corrective practice;
- Dominican-Spanish-to-English linguistic transfer;
- context-aware speaking appropriate to level and goals.

The objective is **not accent erasure**.

Dominican Spanish is the first deep linguistic profile, not a permanent technical limitation. Additional L1 profiles must be addable without redesigning Coach or the Learner Model from scratch.

Coach is a product that consumes Core and Mind. It must not become a second Mind or a separate learner-memory architecture.

### Lurexa Teach

Lurexa Teach is the independent educator professional-development product.

Teach owns:

- teacher professional development;
- teacher CEFR / English proficiency growth;
- professional learning pathways and courses;
- teaching-practice development;
- training and competency-based certification;
- teacher community and professional circles;
- peer collaboration and feedback;
- professional evidence and reflection;
- persistent educator growth profile;
- professional credentials;
- personalized professional-growth recommendations through Mind.

A teacher may use both Learn and Teach through one Lurexa identity. **Learn is where teachers operate student learning; Teach is where teachers develop themselves professionally.**

Teach may use authorized educator context and professional evidence. Core owns trusted identity, persistence, evidence verification and credential awards. Mind interprets authorized educator state and evidence to recommend next steps.

Repository mapping:

- `apps/teacher-portal` = Lurexa Learn teacher operational workspace.
- `apps/teach-web` = independent Lurexa Teach product.

See `Docs/Product/LUREXA_LEARN_TEACH_BOUNDARY.md` and `Docs/Architecture/LUREXA_TEACH_MVP_ARCHITECTURE.md`.

### Lurexa Admin

Institutional and administrative product for organizations, users, roles, programs, billing/subscriptions, governance, audit and policy configuration. Core remains responsible for enforcing trust and permissions.

### Lurexa Insight

Analytics, intelligence and reporting product. It surfaces learner, cohort, engagement, outcome and learning-intelligence views using governed records and interpretable intelligence.

### Lurexa Studio

Content and learning-experience creation product for courses, lessons, assessments, media, reusable learning objects, authoring, publishing/versioning and AI-assisted creation through Mind.

### Lurexa Campus

Institutional learning and academic deployment product.

Campus connects higher-education and organizational cohorts, academic programs, faculty workspaces, and institutional learning deployments into the shared Lurexa ecosystem.

Campus personality: connected, institutional, and intelligent.

## 11. Product philosophy

Every product or feature must improve at least one of these outcomes:

- learning;
- teaching;
- operating an educational program;
- creating learning experiences;
- understanding learning evidence or outcomes.

Products are experiences. Core and Mind are reusable ecosystem layers.

## 12. Learning philosophy

Lurexa may combine evidence-informed approaches such as:

- CEFR;
- Communicative Language Teaching;
- Task-Based Learning;
- retrieval practice;
- spaced repetition;
- formative assessment;
- mastery-oriented progression;
- adaptive practice where evidence supports it.

AI should reinforce sound pedagogy rather than replace it.

## 13. AI philosophy

AI should explain, guide, personalize, adapt, recommend, coach and help educators interpret learning evidence.

AI should not silently become the source of truth, fabricate authoritative learner state, expose unnecessary personal data or make high-impact decisions without governance.

Model providers are implementation dependencies behind Lurexa Mind, not product architecture.

## 14. Engineering principles

- TypeScript-first where appropriate.
- Capability-oriented architecture.
- Shared contracts before duplicated logic.
- Products depend on supported capabilities; Core does not depend on product applications.
- Mind does not bypass Core trust boundaries.
- Product UIs do not write arbitrary inferred learner state directly.
- Product UIs do not call AI providers directly for production learner intelligence.
- Evidence and inference remain distinguishable.
- Authorization and data minimization precede AI access.
- Documentation precedes major architecture changes.
- Conceptual architecture changes do not automatically require immediate package renaming/refactoring.

## 15. Current technology direction

Current repository direction includes:

- Turborepo + pnpm monorepo;
- Next.js + React + TypeScript;
- Tailwind CSS / shared UI and design tokens;
- Firebase/Auth/Firestore/Storage-oriented platform infrastructure;
- GitHub Actions;
- Vercel/Firebase deployment responsibilities as appropriate;
- AI/speech providers accessed through governed Mind capabilities;
- PWA/offline-first capabilities where valuable.

Technology choices may evolve. Responsibility boundaries should remain stable unless explicitly changed.

## 16. Repository architecture

Current high-level structure includes applications, shared packages, `Docs/`, `.ai/` and `bootstrap/`.

Existing packages such as `@lurexa/auth`, `@lurexa/backend`, `@lurexa/database`, `@lurexa/sdk`, `@lurexa/types`, `@lurexa/ui`, `@lurexa/tokens`, `@lurexa/config` and `@lurexa/utils` should be mapped to Core/Mind/product responsibilities before renaming or splitting them.

Architecture branding is not by itself a reason to restructure code.

## 17. Business direction

Commercial opportunities may include:

- individual learner subscriptions;
- premium Coach experiences;
- teacher subscriptions;
- schools and institutes;
- universities;
- corporate learning;
- institutional analytics;
- government/large-institution deployments;
- future marketplace/API offerings.

The product architecture must support growth beyond the thesis prototype and beyond the initial Dominican-English specialization.

## 18. Accessibility, trust and resilience

Lurexa should target accessible user experiences, strong privacy and secure authorization, responsible AI, low-bandwidth resilience and meaningful offline capability where practical.

For user-facing products, WCAG 2.2 AA is the intended accessibility baseline where applicable.

## 19. Source-of-truth hierarchy

For architecture decisions, use this order unless a newer explicit decision replaces it:

1. explicit current decision from the product owner;
2. this Lurexa Bible;
3. `Docs/Architecture/*` detailed architecture documents;
4. `ROADMAP.md` implementation sequencing;
5. `AGENTS.md` and `.ai/*` AI-development instructions;
6. older historical documents.

When an older document conflicts with this model, mark the older assumption as superseded rather than mixing architectures.

## 20. Superseded assumptions

The following are obsolete unless explicitly reintroduced:

- thesis prototype as the commercial production architecture;
- Lurexa as only an LMS with extra portals;
- one independent learner profile per product;
- Mind as the authoritative persistence/authorization owner;
- Coach as merely a generic chatbot feature;
- accent erasure as a Coach objective;
- Dominican Spanish as Coach's permanent technical limit;
- Lurexa Teach as the class/learner-management teacher dashboard;
- direct product-to-model-provider coupling for production learner intelligence.

## 21. End-state principle

> **Lurexa Learning Technologies builds the ecosystem.**  
> **Lurexa Core owns trust.**  
> **Lurexa Mind interprets learning.**  
> **Products deliver experiences and generate evidence.**  
> **One learner. One evolving model. Every Lurexa experience adapts around it.**
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

## 5. Company, product and institution architecture

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

**Lurexa Campus** is not another sibling product that owns the product family. It is the approved customer-facing institutional environment through which a school, academy, university, training provider, company or other organization enters the Lurexa experiences to which it is entitled.

The technical tenant concept behind Campus is an **Institution Workspace**. Engineering may retain names such as `InstitutionWorkspaceContext` where they remain precise and stable.

Lurexa Admin is the administrative control plane for Campus. Core remains authoritative for organization identity, membership, permissions, tenancy and trusted persistence.

## 6. Lurexa Campus

**Lurexa Campus** is the institution-facing experience layer for Lurexa.

Primary positioning:

> **One intelligent learning environment for your entire institution.**

Complementary institutional promise:

> **One institution. One connected learning ecosystem.**

Campus may provide:

- institution identity and co-branding;
- organization-aware home and navigation;
- role-aware and entitlement-aware entry points;
- member, group and product-access orientation;
- organization switching;
- lightweight institutional summaries;
- coherent transitions into specialist Lurexa products.

Campus must not become:

- a Moodle/Canvas-style monolithic application that duplicates specialist product workflows;
- the owner of learning content, assessment or submissions that belong to Learn;
- the owner of educator professional-development workflows that belong to Teach;
- a replacement for Insight, Coach or Studio;
- an independent authorization layer outside Core;
- a second learner model or AI-intelligence layer.

Customer-facing institution language should use **Lurexa Campus**. Internal architecture may use **Institution Workspace** where technically appropriate.

See `Docs/Product/LUREXA_CAMPUS_PRODUCT_DEFINITION.md` and `docs/engineering/INSTITUTION_WORKSPACES.md`.

## 7. Lurexa Core

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

## 8. Lurexa Mind

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

## 9. Learner Model

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

## 10. Cross-product learning loop

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

Campus may preserve institution context during these transitions, but it does not own the learner model or evidence loop.

## 11. Product family

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

Administrative control plane for platform and organization-scoped operations, including organizations, users, roles, access, programs, billing/subscriptions, governance, audit and policy configuration. Core remains responsible for enforcing trust and permissions.

Admin has two distinct scopes:

- **Platform Admin** for Lurexa-operated global administration;
- **Institution Admin** for authorized organization-scoped administration inside a Campus context.

Admin must not become a monolithic LMS or duplicate the specialist workflows of Learn, Teach, Insight, Coach or Studio.

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

Products are experiences. Core and Mind are reusable ecosystem layers. Campus connects the institution experience without becoming the owner of specialist product domains.

## 13. Learning philosophy

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

## 14. AI philosophy

AI should explain, guide, personalize, adapt, recommend, coach and help educators interpret learning evidence.

AI should not silently become the source of truth, fabricate authoritative learner state, expose unnecessary personal data or make high-impact decisions without governance.

Model providers are implementation dependencies behind Lurexa Mind, not product architecture.

## 15. Engineering principles

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
- Customer-facing naming changes do not automatically require internal contract churn.
- Conceptual architecture changes do not automatically require immediate package renaming/refactoring.

## 16. Current technology direction

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

## 17. Repository architecture

Current high-level structure includes applications, shared packages, `Docs/`, `.ai/` and `bootstrap/`.

Existing packages such as `@lurexa/auth`, `@lurexa/backend`, `@lurexa/database`, `@lurexa/sdk`, `@lurexa/types`, `@lurexa/ui`, `@lurexa/tokens`, `@lurexa/config` and `@lurexa/utils` should be mapped to Core/Mind/product responsibilities before renaming or splitting them.

Architecture branding is not by itself a reason to restructure code. `InstitutionWorkspaceContext` and related internal terminology remain valid after the Lurexa Campus naming decision.

## 18. Business direction

Commercial opportunities may include:

- individual learner subscriptions;
- premium Coach experiences;
- teacher subscriptions;
- Lurexa Campus for schools and institutes;
- Lurexa Campus for universities;
- Lurexa Campus for corporate learning;
- institutional analytics;
- government/large-institution deployments;
- future marketplace/API offerings.

Campus packaging should support flexible product entitlements rather than force one fixed institutional bundle.

The product architecture must support growth beyond the thesis prototype and beyond the initial Dominican-English specialization.

## 19. Accessibility, trust and resilience

Lurexa should target accessible user experiences, strong privacy and secure authorization, responsible AI, low-bandwidth resilience and meaningful offline capability where practical.

For user-facing products, WCAG 2.2 AA is the intended accessibility baseline where applicable.

Campus co-branding must not weaken accessibility, security indicators, semantic states or recognizable Lurexa product identity.

## 20. Source-of-truth hierarchy

For architecture decisions, use this order unless a newer explicit decision replaces it:

1. explicit current decision from the product owner;
2. this Lurexa Bible;
3. `Docs/Architecture/*` and accepted engineering architecture documents;
4. `ROADMAP.md` implementation sequencing;
5. `AGENTS.md` and `.ai/*` AI-development instructions;
6. older historical documents.

When an older document conflicts with this model, mark the older assumption as superseded rather than mixing architectures.

## 21. Superseded assumptions

The following are obsolete unless explicitly reintroduced:

- thesis prototype as the commercial production architecture;
- Lurexa as only an LMS with extra portals;
- one independent learner profile per product;
- Mind as the authoritative persistence/authorization owner;
- Coach as merely a generic chatbot feature;
- accent erasure as a Coach objective;
- Dominican Spanish as Coach's permanent technical limit;
- Lurexa Teach as the class/learner-management teacher dashboard;
- Institution Workspace as the preferred customer-facing institution name;
- Lurexa Campus as a sibling product that owns the other products;
- direct product-to-model-provider coupling for production learner intelligence.

## 22. End-state principle

> **Lurexa Learning Technologies builds the ecosystem.**  
> **Lurexa Core owns trust.**  
> **Lurexa Mind interprets learning.**  
> **Products deliver experiences and generate evidence.**  
> **Lurexa Campus connects the institution experience.**  
> **One learner. One evolving model. Every Lurexa experience adapts around it.**

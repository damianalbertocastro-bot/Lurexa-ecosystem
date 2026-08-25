---
title: Lurexa Bible
subtitle: Authoritative Guide to the Lurexa Ecosystem
version: 1.6.0
status: Approved
owner: Lurexa Learning Technologies
author: Damian + AI collaborators
created: 2026-07-23
last_updated: 2026-08-25
---

# Lurexa Bible

This document is the primary strategic source of truth for Lurexa. Detailed architecture documents may provide deeper implementation guidance, but they must not contradict the responsibility model defined here.

## 1. Company identity

**Lurexa Learning Technologies** is the parent company and master business identity.

Lurexa is a scalable commercial EdTech ecosystem designed to support multiple learning products, educators, institutions, content workflows and intelligence capabilities. The earlier thesis prototype is a **validation/reference artifact**, not the production architecture.

## 2. Vision

Build a trusted intelligent learning ecosystem in which every authorized learning experience can benefit from a learner's evolving history without forcing the learner to start over in each product.

## 3. Mission

Empower learners and educators through intelligent, personalized, accessible and measurable education while preserving human agency, privacy and trustworthy technical foundations.

## 4. Governing learner principle

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Lurexa uses one persistent cross-product Learner Model rather than independent learner profiles per product.

Authorized products generate learning evidence. Lurexa Mind interprets authorized evidence. Lurexa Core owns trusted records, authorization and persistence. Products receive only the context they are authorized and designed to use.

## 5. Ecosystem architecture

```text
Lurexa Learning Technologies
│
├── Shared ecosystem layers
│   ├── Lurexa Core
│   └── Lurexa Mind
│
├── Product family
│   ├── Lurexa Learn
│   ├── Lurexa Coach
│   ├── Lurexa Teach
│   ├── Lurexa Admin
│   ├── Lurexa Insight
│   └── Lurexa Studio
│
├── Institutional experience
│   └── Lurexa Campus
│
└── Shared signature experience layer
    ├── Learner Pulse
    ├── Adaptive Learning Path
    ├── Memory Thread
    ├── Mind Trace
    ├── Product Bridge
    └── Knowledge Object
```

This classification is normative.

- **Core and Mind are shared ecosystem layers**, not ordinary end-user products.
- **Learn, Coach, Teach, Admin, Insight and Studio are the product family.**
- **Campus is an institutional experience/shell**, not a sibling product owner and not an authorization or persistence layer.
- **Signature Experience primitives are shared cross-product interaction capabilities**, not products or independent data owners.

Technical implementations may continue to use `InstitutionWorkspaceContext` and similar internal terminology where precise.

## 6. Lurexa Campus

**Lurexa Campus** is the approved customer-facing institutional environment through which a school, academy, university, training provider, company or other organization enters the Lurexa experiences to which it is entitled.

Primary positioning:

> **One intelligent learning environment for your entire institution.**

Complementary institutional promise:

> **One institution. One connected learning ecosystem.**

Campus may provide institution identity/co-branding, organization-aware home/navigation, role- and entitlement-aware entry points, organization switching, lightweight institutional summaries, and coherent transitions into specialist products.

Campus must not become:

- a monolithic LMS duplicating specialist product workflows;
- the owner of Learn content, assessment or submissions;
- the owner of Teach professional-development workflows;
- a replacement for Admin, Insight, Coach or Studio;
- an authorization layer outside Core;
- a second learner model or intelligence layer;
- a product owner merely because it appears in navigation or design tokens.

**Lurexa Admin is the administrative control plane available within appropriate Campus contexts. Core remains authoritative for organization identity, membership, permissions, tenancy and trusted persistence.**

## 7. Lurexa Core

**Lurexa Core** is the trusted technical/platform foundation.

Core owns or governs identity, authentication, authorization, permissions, canonical user and learner identity, organizations/tenancy, trusted learner records, persistence, enrollment/progress, evidence provenance, approved persistence of derived observations, shared data contracts, storage/configuration, commerce/billing infrastructure, scheduling, notifications, audit/observability infrastructure and offline/synchronization trust boundaries.

> **Core owns the trusted record.**

Products must not bypass Core for authoritative learner state, permissions or persistent cross-product context.

## 8. Lurexa Mind

**Lurexa Mind** is the shared AI and learning-intelligence layer.

Mind interprets authorized evidence to support personalization, learner-state interpretation, adaptive experiences, recommendations, interventions, tutoring/coaching, mastery/error interpretation, pronunciation/fluency intelligence, L1-transfer intelligence, assessment intelligence, content adaptation, pedagogical agents, provider abstraction and responsible-AI safeguards.

Mind does **not** own authoritative authentication, authorization or persistence. A Mind-derived observation that should become persistent learner state must pass through an approved Core-governed boundary.

## 9. Learner Model

The Learner Model is the persistent evolving representation of the learner across the ecosystem.

It may progressively represent CEFR/proficiency, curriculum context, demonstrated competencies, recurring mistakes, pronunciation patterns/targets, vocabulary, grammar, fluency, goals, strengths/weaknesses, relevant activity history, interventions and learning preferences.

The Learner Model is an ecosystem construct: Core governs trusted evidence/state, Mind interprets authorized evidence, and products consume minimized authorized context.

It must not become a giant ungoverned document mixing raw evidence, AI guesses, permissions and UI state.

## 10. Signature Experience System

The Signature Experience System makes Lurexa's learning continuity visible and actionable without creating another source of learner truth.

The six canonical primitives are:

1. **Learner Pulse** — an evidence-aware projection of what Lurexa can currently support about a learner's state. Pulse is not the Learner Model and must preserve `unknown` where evidence is insufficient.
2. **Adaptive Learning Path** — a visible personalization overlay around canonical curriculum. v1 must not silently rewrite or autonomously skip required curriculum.
3. **Memory Thread** — a governed developmental narrative showing how a learning target changes over time. It is not a raw activity log and must not mix institutional evidence implicitly.
4. **Mind Trace** — an approved learner-facing explanation using a Signal → Interpretation → Action structure. It must not expose hidden model reasoning or chain-of-thought.
5. **Product Bridge** — a purpose-scoped, expiring, server-validated handoff between Lurexa experiences. It must not embed raw learner context in URLs.
6. **Knowledge Object** — a versioned semantic representation of what is being learned, reusable across curriculum, evidence, Coach, adaptation, analytics and Studio.

Ownership rule:

```text
Core = authorization, trusted evidence, persistence, provenance, projections
Mind = interpretation and recommendation
Signature layer = shared interaction/read-model expression
Products = workflows and learner/educator experiences
```

See `Docs/Architecture/LUREXA_SIGNATURE_EXPERIENCE_ARCHITECTURE.md`, `Docs/Design/LUREXA_SIGNATURE_INTERACTION_SYSTEM.md` and `Docs/Product/LUREXA_SIGNATURE_EXPERIENCE_ROADMAP.md`.

## 11. Cross-product learning loop

Lurexa should behave as one learning relationship.

```text
Learn experience
  ↓ learning evidence
Core trusted record
  ↓ authorized evidence
Mind interpretation
  ↓ approved/minimized context
Learner Pulse / Path / Mind Trace
  ↓ purpose-scoped Product Bridge
Coach adaptation
  ↓ speaking/pronunciation evidence
Core trusted record
  ↓
Mind interpretation
  ↓
Memory Thread + updated Pulse/Path
```

A learner moving from Learn to Coach should not need to restate reliable authorized information already known by Lurexa. Campus may preserve institution context during transitions but does not own the learner model or evidence loop.

## 12. Product family

### Lurexa Learn

Lurexa Learn is the learning-management and instructional-delivery product for learners and the educators who operate their learning experiences.

Learn owns the learner experience **and the operational teacher workspace for those learners**. The Learn Teacher Workspace owns course/class operations, authorized rosters, learner access/invitations, assignments and submissions, assessment/grading workflows, learner progress, instructional analytics, teacher feedback/interventions, and student-facing Signature Experience projections used for instructional decisions.

A teacher acting inside Learn is an **educator operating student learning**, not a learner in the Teach product. Delegated access to a student's learner context is therefore a Lurexa Learn capability, purpose-scoped through Core as `teacher_instructional_support`.

The teacher workspace inside Learn is not Lurexa Teach.

### Lurexa Coach

Lurexa Coach is the AI-powered English speaking and pronunciation product. Its first deep linguistic specialization is **Dominican Spanish speakers learning English**.

Coach prioritizes intelligibility, naturalness, fluency, pronunciation refinement, spoken confidence, recurring-pattern identification, targeted corrective practice and Dominican-Spanish-to-English transfer. The objective is **not accent erasure**.

Dominican Spanish is the first deep linguistic profile, not a permanent technical limitation. Coach consumes Core and Mind and must not become a second Mind or separate learner-memory architecture.

### Lurexa Teach

Lurexa Teach is the independent educator professional-development product. **In Teach, the teacher is the learner.**

Teach owns professional learning, educator English/CEFR development, educator competency pathways, teaching-practice growth, training/certification, educator community/professional circles, professional evidence/reflection, credentials, professional goals and Mind-supported growth recommendations.

Teach does **not** own classroom rosters, student invitations, student progress dashboards, grading, submissions, student-level instructional interventions, or direct browsing of student Learner Pulse/Memory Thread. Those operational responsibilities belong to the Lurexa Learn Teacher Workspace.

Authorized teaching-practice evidence may later flow from Learn through Core/Mind into Teach as minimized professional-development evidence. Student weaknesses must never be copied into the teacher's own professional learner model.

> **Learn is where teachers operate student learning. Teach is where teachers develop themselves professionally.**

Repository mapping is authoritative:

- `apps/learn-web/app/teacher` = **Lurexa Learn Teacher Workspace** (student/class/course operations).
- `apps/teach-web` = **Lurexa Teach** (teacher professional learning and growth).

### Lurexa Admin

Administrative control plane for platform and organization-scoped operations including organizations, users, roles, access, programs, billing/subscriptions, governance, audit and policy configuration. Core enforces trust and permissions.

Admin has Platform Admin and Institution Admin scopes. It must not become a monolithic LMS or overall Campus shell.

### Lurexa Insight

Analytics, intelligence and reporting product. It surfaces learner, cohort, engagement, outcome and learning-intelligence views using governed records and interpretable intelligence.

### Lurexa Studio

Content and learning-experience creation product for courses, lessons, assessments, media, reusable learning objects, authoring, publishing/versioning and AI-assisted creation through Mind.

## 13. Product philosophy

Every product or major feature must improve at least one of these outcomes: learning, teaching, operating an educational program, creating learning experiences, or understanding learning evidence/outcomes.

Shared capabilities should not be promoted into products merely because they have visible UI. Products should not duplicate shared platform or intelligence responsibilities merely to ship faster.

## 14. Learning philosophy

Lurexa may combine evidence-informed approaches including CEFR, Communicative Language Teaching, Task-Based Learning, retrieval practice, spaced repetition, formative assessment, mastery-oriented progression and adaptive practice where evidence supports it.

AI should reinforce sound pedagogy rather than replace it.

## 15. AI philosophy

AI should explain, guide, personalize, adapt, recommend, coach and help educators interpret learning evidence.

AI must not silently become the source of truth, fabricate authoritative learner state, expose unnecessary personal data or make high-impact decisions without governance. Model providers are implementation dependencies behind Lurexa Mind, not product architecture.

## 16. Engineering principles

- TypeScript-first where appropriate.
- Capability-oriented architecture.
- Shared contracts before duplicated logic.
- Products depend on supported capabilities; Core does not depend on product applications.
- Mind does not bypass Core trust boundaries.
- Product UIs do not write arbitrary inferred learner state directly.
- Product UIs do not call AI providers directly for production learner intelligence.
- Evidence and inference remain distinguishable.
- Authorization and data minimization precede AI access.
- Unknown/insufficient evidence is an acceptable state; UI must not manufacture precision.
- Canonical curriculum and adaptive overlays remain distinguishable.
- Documentation precedes major architecture changes.
- Customer-facing naming changes do not automatically require internal package churn.

## 17. Current technology direction

Current repository direction includes Turborepo + pnpm, Next.js + React + TypeScript, Tailwind/shared UI/design tokens, Firebase/Auth/Firestore/Storage-oriented platform infrastructure, GitHub Actions, Vercel/Firebase deployment responsibilities as appropriate, governed AI/speech providers, and PWA/offline-first capabilities where valuable.

Technology choices may evolve. Responsibility boundaries should remain stable unless explicitly changed.

## 18. Repository architecture

Current high-level structure includes applications, shared packages, `Docs/`, `.ai/` and `bootstrap/`.

Existing packages such as `@lurexa/auth`, `@lurexa/backend`, `@lurexa/database`, `@lurexa/sdk`, `@lurexa/types`, `@lurexa/ui`, `@lurexa/tokens`, `@lurexa/config` and `@lurexa/utils` should be mapped to Core/Mind/product responsibilities before renaming or splitting them.

Architecture branding alone is not a reason to restructure code.

## 19. Business direction

Commercial opportunities may include individual learner subscriptions, premium Coach experiences, teacher subscriptions, Campus institutional packaging for schools/universities/corporate learning, institutional analytics, government/large-institution deployments and future marketplace/API offerings.

Campus packaging should support flexible product entitlements rather than force one fixed institutional bundle.

## 20. Accessibility, trust and resilience

Lurexa targets accessible experiences, strong privacy and authorization, responsible AI, low-bandwidth resilience and meaningful offline capability where practical. WCAG 2.2 AA is the intended accessibility baseline for user-facing products where applicable.

Campus co-branding must not weaken accessibility, security indicators, semantic states or recognizable Lurexa product identity.

## 21. Source-of-truth hierarchy

For architecture decisions, use this order unless a newer explicit decision replaces it:

1. explicit current decision from the product owner;
2. this Lurexa Bible;
3. `Docs/Architecture/*` and accepted engineering architecture documents;
4. `ROADMAP.md` implementation sequencing;
5. `AGENTS.md` and `.ai/*` AI-development instructions;
6. older historical documents.

When an older document conflicts with this model, mark the older assumption as superseded rather than mixing architectures.

## 22. Superseded assumptions

The following are obsolete unless explicitly reintroduced:

- thesis prototype as the commercial production architecture;
- Lurexa as only an LMS with extra portals;
- one independent learner profile per product;
- Mind as authoritative persistence/authorization owner;
- Coach as merely a generic chatbot;
- accent erasure as a Coach objective;
- Dominican Spanish as Coach's permanent technical limit;
- Lurexa Teach as the class/learner-management teacher dashboard;
- student rosters, grading, submissions or student-level instructional support inside Lurexa Teach;
- Institution Workspace as the preferred customer-facing institution name;
- **Lurexa Campus as a sibling product in the product family**;
- Campus as owner of specialist products;
- Signature Experience primitives as products or independent learner-state stores;
- direct product-to-model-provider coupling for production learner intelligence.

## 23. End-state principle

> **Lurexa Learning Technologies builds the ecosystem.**  
> **Lurexa Core owns trust.**  
> **Lurexa Mind interprets learning.**  
> **Products deliver experiences and generate evidence.**  
> **Lurexa Campus connects the institutional experience.**  
> **The Signature Experience System makes continuity visible.**  
> **One learner. One evolving model. Every Lurexa experience adapts around it.**

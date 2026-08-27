---
title: Lurexa Bible
subtitle: Authoritative Guide to the Lurexa Ecosystem
version: 1.8.0
status: Approved
owner: Lurexa Learning Technologies
author: Damian + AI collaborators
created: 2026-07-23
last_updated: 2026-08-27
---

# Lurexa Bible

This document is the primary strategic source of truth for Lurexa. Detailed architecture documents may provide deeper implementation guidance, but they must not contradict the responsibility model defined here. Implementation, deployment and production maturity are tracked separately; the existence of a product in this Bible is not by itself a claim that its standalone application is deployed or production-ready.

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
- **Learn, Coach, Teach, Admin, Insight and Studio are the six sibling products.**
- **Campus is an institutional experience/shell**, not a sibling product owner and not an authorization or persistence layer.
- **Signature Experience primitives are shared cross-product interaction capabilities**, not products or independent data owners.

A product may be architecturally approved before its standalone implementation or deployment exists. `ROADMAP.md` is authoritative for current maturity state.

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

The current repository Campus UI is a representative prototype only. It must not be interpreted as proof of a live institutional tenant, SSO integration, entitlement state or institutional analytics deployment.

## 7. Lurexa Core

**Lurexa Core** is the trusted technical/platform foundation.

Core owns or governs identity, authentication, authorization, permissions, canonical user and learner identity, organizations/tenancy, trusted learner records, persistence, enrollment/progress, evidence provenance, approved persistence of derived observations, shared data contracts, storage/configuration, commerce/billing infrastructure, scheduling, notifications, audit/observability infrastructure and offline/synchronization trust boundaries.

Core also owns the authoritative distinction between product entitlement, educator qualification scope and teaching authorization.

> **Core owns the trusted record.**

Products must not bypass Core for authoritative learner state, permissions or persistent cross-product context.

## 8. Lurexa Mind

**Lurexa Mind** is the shared AI and learning-intelligence layer.

Mind interprets authorized evidence to support personalization, learner-state interpretation, adaptive experiences, recommendations, interventions, tutoring/coaching, mastery/error interpretation, pronunciation/fluency intelligence, L1-transfer intelligence, assessment intelligence, content adaptation, pedagogical agents, provider abstraction and responsible-AI safeguards.

For educators, Mind may interpret authorized professional evidence to identify qualification readiness, missing competencies and recommended Teach/Coach development pathways, but it must not independently grant authoritative teaching permission.

Mind does **not** own authoritative authentication, authorization or persistence. A Mind-derived observation that should become persistent learner state must pass through an approved Core-governed boundary.

## 9. Learner Model

The Learner Model is the persistent evolving representation of the learner across the ecosystem.

It may progressively represent CEFR/proficiency, curriculum context, demonstrated competencies, recurring mistakes, pronunciation patterns/targets, vocabulary, grammar, fluency, goals, strengths/weaknesses, relevant activity history, interventions and learning preferences.

The Learner Model is an ecosystem construct: Core governs trusted evidence/state, Mind interprets authorized evidence, and products consume minimized authorized context.

It must not become a giant ungoverned document mixing raw evidence, AI guesses, permissions and UI state.

### Educators as learners

An educator can have a professional learner state under the same canonical Lurexa identity. Professional evidence may represent English proficiency for teaching, methodology, lesson planning, activity/assessment design, instructional practice, reflection, credentials, professional goals and qualification readiness.

Professional learner state must remain purpose-scoped and must not become an ungoverned copy of student evidence.

## 10. Educator identity, entitlement, qualification and authorization

Lurexa uses **one canonical identity across products**. A person must not create a second account merely to move from Learn to Teach or Coach.

Four concepts are authoritative and must remain separate:

1. **Identity** — who the person is across Lurexa; owned by Core.
2. **Product entitlement** — which Lurexa products/benefits that identity may enter.
3. **Educator qualification scope** — what subject/level the person is evidence-backed to teach.
4. **Teaching authorization** — where the person is permitted to operate student learning: institution/program/course/scope.

A global `teacher = true` flag must not become the sole long-term access model.

### Learn educator benefits

A verified/authorized educator operating in Lurexa Learn:

- keeps the same account when entering Lurexa Teach;
- receives Teach access automatically or through a lightweight activation/opt-in path that does not recreate identity;
- receives **full Lurexa Coach access as an educator benefit**, subject to platform commercial, safety and abuse policies;
- continues to use Teach for their own professional development independently of their Learn student-operation permissions.

### Teach learner progression into teaching

A Lurexa Teach learner does not automatically receive Learn Teacher Workspace access.

Teach may prepare that learner toward qualification through English development, methodology, lesson planning, activity/assessment creation, assessment literacy, instructional practice/reflection and digital/AI teaching competence.

English proficiency or mastery of a CEFR level is necessary evidence for some teaching scopes but is not, by itself, proof of teaching qualification.

Learn Teacher Workspace access requires:

- Learn Teacher entitlement;
- an eligible educator qualification scope; and
- explicit platform/institution/program/course teaching authorization.

If a person is qualified to teach A1–B1 and wants to teach B2, Lurexa must not silently broaden access. Mind should identify the gap and recommend the relevant Teach and/or Coach pathway. Core may expand qualification only under approved governance after sufficient evidence exists; separate teaching authorization is still required.

See `Docs/Architecture/LUREXA_EDUCATOR_IDENTITY_QUALIFICATION_MODEL.md`.

## 11. Signature Experience System

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

## 12. Cross-product learning loop

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
Standalone Coach adaptation
  ↓ speaking/pronunciation evidence
Core trusted record
  ↓
Mind interpretation
  ↓
Memory Thread + updated Pulse/Path
```

A learner moving from Learn to standalone Coach should not need to restate reliable authorized information already known by Lurexa. Learn may launch Coach but does not own its canonical UI/runtime. Campus may preserve institution context during transitions but does not own the learner model or evidence loop.

The same continuity rule applies to educators: Learn teaching-practice evidence may contribute, through governed professional-evidence boundaries, to Teach professional growth; Teach may bridge educators into standalone Coach for language development without creating a separate identity.

## 13. Product family

### Lurexa Learn

Lurexa Learn is the learning-management and instructional-delivery product for learners and the educators who operate their learning experiences.

Learn owns the learner experience **and the operational teacher workspace for those learners**. The Learn Teacher Workspace owns course/class operations, authorized rosters, learner access/invitations, assignments and submissions, assessment/grading workflows, learner progress, instructional analytics, teacher feedback/interventions, and student-facing Signature Experience projections used for instructional decisions.

A teacher acting inside Learn is an **educator operating student learning**, not a learner in the Teach product. Delegated access to a student's learner context is therefore a Lurexa Learn capability, purpose-scoped through Core as `teacher_instructional_support`.

The teacher workspace inside Learn is not Lurexa Teach.

### Lurexa Coach

Lurexa Coach is the standalone AI-powered English speaking, pronunciation and fluency product. Its canonical web application lives independently from Learn, while Learn and Teach integrate with it through governed cross-product handoffs.

Its first deep linguistic specialization is **Dominican Spanish speakers learning English**.

Coach prioritizes intelligibility, naturalness, fluency, pronunciation refinement, spoken confidence, recurring-pattern identification, targeted corrective practice and Dominican-Spanish-to-English transfer. The objective is **not accent erasure**.

Dominican Spanish is the first deep linguistic profile, not a permanent technical limitation. Coach consumes Core and Mind and must not become a second Mind or separate learner-memory architecture.

Verified/authorized Lurexa educators receive full Coach access as an educator benefit under the same canonical identity. Coach access supports the educator's own language development but does not itself grant educator qualification or student-operation authorization.

### Lurexa Teach

Lurexa Teach is the independent educator professional-development product. **In Teach, the teacher is the learner.**

Teach owns professional learning, educator English/CEFR development, educator competency pathways, teaching-practice growth, training/certification, educator community/professional circles, professional evidence/reflection, credentials, professional goals and Mind-supported growth recommendations.

Teach does not own Learn student rosters, course operations, grading or delegated student context.

### Lurexa Admin

Lurexa Admin is the institutional governance and administration product. Core remains authoritative for trusted authorization/persistence. Qualification review and teaching authorization are separate governed workflows. Billing concepts do not imply production payment settlement.

### Lurexa Insight

Lurexa Insight is the analytics/intelligence product. It remains distinct from Learn Teacher instructional insights. Standalone implementation/deployment maturity is tracked in `ROADMAP.md`.

### Lurexa Studio

Lurexa Studio is the governed authoring/content-creation product. Core owns authoritative content/Knowledge Object state and Mind may assist authoring. The current Learn-hosted Studio UI is only a contained interaction prototype; standalone implementation maturity is tracked in `ROADMAP.md`.

## 14. Product maturity truth

Architectural approval and implementation maturity are different dimensions. Current maturity uses:

`CONCEPT → ARCHITECTURE → PROTOTYPE → CONTRACT_IMPLEMENTED → MVP_IMPLEMENTED → VERIFIED → DEPLOYED → PRODUCTION_READY`

No document should use a feature checkbox, route name, successful build or deployment manifest entry as automatic proof of production readiness.

## 15. End-state principle

> **Lurexa Learning Technologies builds the ecosystem.**  
> **Lurexa Core owns trust.**  
> **Lurexa Mind interprets learning.**  
> **Products deliver experiences and generate evidence.**  
> **Campus connects the institutional experience.**  
> **One learner. One evolving model. Every Lurexa experience adapts around it.**

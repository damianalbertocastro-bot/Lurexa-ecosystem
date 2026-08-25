---
title: Lurexa Ecosystem Agent Context
purpose: Concise, authoritative context for AI agents and knowledge libraries
source_of_truth: Docs/00-Lurexa-Bible.md
last_updated: 2026-08-25
---

# Lurexa Ecosystem

## Identity

**Lurexa Learning Technologies** is the parent company, brand owner and builder of a scalable commercial EdTech ecosystem. Lurexa is not a single LMS. The earlier thesis prototype is a validation/reference artifact, not the production architecture.

## Governing principle

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

- **Lurexa Core** owns identity, authorization, trusted records, persistence, evidence provenance, tenancy and shared platform contracts.
- **Lurexa Mind** interprets authorized learning and educator-development evidence to provide personalization, recommendations, adaptive experiences, AI tutoring/coaching and learning intelligence.
- **Products** deliver specialist experiences and generate evidence through Core-governed boundaries.
- **Lurexa Campus** is the customer-facing institutional environment/shell. It preserves organization, role, entitlement and wayfinding context without becoming a sibling product owner.
- **The Signature Experience System** makes cross-product continuity visible through shared interaction/read-model primitives without becoming a new data owner.

Core and Mind are shared ecosystem layers, not end-user products. Mind does not own authoritative records, authorization or persistence; persistent derived observations must pass through Core-governed boundaries.

## Canonical classification

```text
Lurexa Learning Technologies
│
├── Shared layers
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
└── Signature experience layer
    ├── Learner Pulse
    ├── Adaptive Learning Path
    ├── Memory Thread
    ├── Mind Trace
    ├── Product Bridge
    └── Knowledge Object
```

Do not infer product ownership from design tokens or navigation IDs. Campus may appear in an experience-level enum while remaining excluded from product-owner types.

## Institutional Experience

**Lurexa Campus** is the approved customer-facing name for the institution environment.

- Customer-facing: **Lurexa Campus**
- Technical concept: **Institution Workspace** where precise
- Administrative control plane: **Lurexa Admin**
- Authorization/tenancy authority: **Lurexa Core**

Campus may provide institution identity/co-branding, role-aware navigation, entitlement-aware product access, organization switching, institution-level orientation, lightweight summaries and coherent product transitions.

Campus must not duplicate specialist product workflows, become a second Admin implementation, decide authorization independently of Core, create a second learner model, or collapse the ecosystem into one monolithic LMS.

## Products

| Product | Purpose |
| --- | --- |
| **Lurexa Learn** | Learning management and instructional delivery for learners and the teachers operating student learning: courses, lessons, activities, assessment, assignments, classes, progress and adaptive learning experiences. |
| **Lurexa Coach** | AI-powered English speaking, pronunciation, fluency and confidence practice. First deep specialization: Dominican Spanish speakers learning English; optimizes for intelligibility, not accent erasure. |
| **Lurexa Teach** | Professional learning and teacher formation for practicing educators and teachers-to-be: academic/subject knowledge, methodology, teaching practice, competencies, evidence, credentials and educator community. |
| **Lurexa Admin** | Administrative control plane for platform and organization-scoped operations: organizations, users, roles, access, subscriptions, governance, audit and policy configuration. |
| **Lurexa Insight** | Governed analytics/reporting for learner, cohort, engagement, outcome and learning-intelligence views. |
| **Lurexa Studio** | Creation, review, publishing, versioning and AI-assisted authoring of courses, lessons, assessments, media and reusable learning/knowledge objects. |

Campus is intentionally absent from this product table because it is an institutional experience/shell rather than a sibling product owner.

## Signature Experience System

The six canonical primitives are shared across products when relevant:

1. **Learner Pulse** — evidence-aware learner-state projection. Preserve `unknown` where evidence is insufficient. Pulse is not the Learner Model.
2. **Adaptive Learning Path** — visible personalization overlay around canonical curriculum. v1 must not silently rewrite or skip required curriculum.
3. **Memory Thread** — governed developmental narrative across evidence/events. It is not a raw activity log and must not mix institutional evidence implicitly.
4. **Mind Trace** — learner-facing Signal → Interpretation → Action explanation. Use approved summaries only; never expose hidden reasoning or chain-of-thought.
5. **Product Bridge** — purpose-scoped, expiring, server-validated cross-product handoff. Never place raw learner context in URLs.
6. **Knowledge Object** — stable versioned semantic target reusable across curriculum, evidence, Coach, adaptation, Insight and Studio.

Repository implementation direction:

- contracts: `@lurexa/types`;
- trusted projections/handoffs: server-only Core boundaries in `@lurexa/backend`;
- supported application interfaces: `@lurexa/sdk`;
- shared presentational primitives: `@lurexa/ui`;
- product composition: product applications;
- Mind remains interpretation/recommendation, not UI persistence.

Canonical docs:

- `Docs/Architecture/LUREXA_SIGNATURE_EXPERIENCE_ARCHITECTURE.md`
- `Docs/Design/LUREXA_SIGNATURE_INTERACTION_SYSTEM.md`
- `Docs/Product/LUREXA_SIGNATURE_EXPERIENCE_ROADMAP.md`

## Lurexa Teach canonical model

Canonical definition: `Docs/Product/LUREXA_TEACH_PRODUCT_DEFINITION.md`.

Teach serves two first-class pathways:

1. **Teacher Formation Pathway** for aspiring teachers/teachers-to-be learning methodology, academic/subject knowledge, planning, assessment, classroom practice, technology, reflection, simulation/microteaching and professional competencies.
2. **Practicing Educator Growth Pathway** for active educators improving academic/subject knowledge, language proficiency where relevant, methodology, teaching practice, specialization, evidence, credentials and continuing professional growth.

Teach must combine structured professional learning with governed AI support and appropriate human support. AI may tutor, explain, simulate, coach, critique and recommend through Mind, but does not replace human mentorship, supervised practice, expert review or high-stakes verification where required.

> **Lurexa Learn is where teachers operate and support student learning. Lurexa Teach is where practicing and future teachers learn, practice, develop and grow as educators.**

## Product philosophy

Every product or feature must improve at least one of: learning, teaching, operating an educational program, creating learning experiences, or understanding learning evidence/outcomes.

Products must not create private authoritative learner profiles, duplicate foundational logic, bypass governed contracts or couple product clients directly to model providers for persistent intelligence.

## Learning philosophy

Lurexa combines evidence-informed practice where appropriate, including CEFR, Communicative Language Teaching, Task-Based Learning, retrieval practice, spaced repetition, formative assessment, mastery-oriented progression and evidence-supported adaptive practice.

AI reinforces sound pedagogy; it does not replace it. Learning and educator-development experiences should be accessible, measurable, culturally relevant and driven by demonstrated evidence rather than assumed proficiency or a single completion signal.

## AI, trust and privacy

- AI should explain, guide, personalize, adapt, recommend and coach.
- AI must not silently become the source of truth or fabricate authoritative learner/educator state.
- Evidence and inference remain distinct and traceable.
- Authorization and data minimization precede AI access.
- Model/speech providers are replaceable dependencies behind Mind.
- Unknown/insufficient evidence is a valid product state.
- Learner-facing explanations are approved summaries, not hidden reasoning.
- Cross-product handoffs carry opaque references, not raw learner context.

## Agent guardrails

1. Do not treat Lurexa as only an LMS or disconnected portals.
2. Do not create independent authoritative learner/educator profiles in products.
3. Do not let product UIs directly persist arbitrary inferred state or call AI providers for production learner intelligence.
4. Use Core/Mind contracts for cross-product context.
5. Treat Dominican Spanish as Coach's first deep linguistic specialization, not a permanent limit.
6. Preserve the Learn/Teach distinction.
7. Do not narrow Teach to practicing-teacher CPD only; teacher formation is first-class.
8. Use **Lurexa Campus** in customer-facing institution language; retain Institution Workspace terminology where technically useful.
9. Do not make Campus a sibling product owner or monolithic Moodle/Canvas substitute.
10. Admin is the Campus administrative control plane; Core remains authorization authority.
11. Do not make Signature Experience primitives products or persistent learner stores.
12. Preserve canonical curriculum versus adaptive overlays.
13. Preserve explicit uncertainty/unknown states instead of manufacturing scores.
14. Product Bridge must be purpose-scoped, expiring and server validated.
15. Knowledge Object IDs referenced by trusted evidence must remain version-stable.
16. Prioritize learner/educator agency, privacy, accessibility, evidence-based pedagogy and trustworthy verification.

## Canonical summary

**Lurexa Learning Technologies builds the ecosystem. Lurexa Core owns trust. Lurexa Mind interprets learning and authorized educator-development evidence. Learn, Coach, Teach, Admin, Insight and Studio are the product family. Lurexa Campus connects the institutional experience. The Signature Experience System makes continuity visible. One learner. One evolving model. Every Lurexa experience adapts around it.**

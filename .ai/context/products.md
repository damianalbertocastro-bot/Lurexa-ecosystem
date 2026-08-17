# Lurexa Product Ecosystem

Version: 1.1

Status: Approved

Last updated: 2026-08-17

---

# Purpose

This document defines the authoritative product model for Lurexa Learning Technologies and provides product context for AI assistants, developers, designers, and stakeholders.

Every feature should belong to a product or a reusable platform capability. Products should not duplicate Lurexa Core or Lurexa Mind responsibilities.

---

# Company and Product Architecture

```text
Lurexa Learning Technologies
│
├── Lurexa Core
│   └── Shared technical/platform foundation
│
├── Lurexa Mind
│   └── Shared learning intelligence and adaptation
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

**Lurexa Core** owns trusted platform foundations such as identity, authorization, organizations, learning records, content contracts, commerce, notifications, scheduling, APIs, analytics events, and offline/sync infrastructure.

**Lurexa Mind** owns reusable learning intelligence such as the Learner Model, personalization, recommendations, tutoring intelligence, pronunciation intelligence, L1-transfer analysis, adaptive feedback, assessment intelligence, and pedagogical AI behavior.

Products compose Core and Mind capabilities to create user experiences.

---

# Core Product Principle — One Learner, One Evolving Model

A learner must not start from zero when moving between Lurexa products.

The ecosystem maintains one authorized, evolving learner model that can be used by relevant products through Lurexa Mind and Lurexa Core boundaries.

> **One learner. One evolving profile. Every Lurexa experience adapts around it.**

Products observe the learner. Lurexa Mind interprets those observations. Lurexa Core owns trusted records, permissions, and persistence.

The learner model may include:

- CEFR level and proficiency estimates
- Current course, module, lesson, and learning objectives
- Vocabulary and grammar mastery
- Skill estimates by reading, listening, speaking, and writing
- Recurring error patterns
- Pronunciation patterns and targets
- L1-transfer patterns
- Speaking fluency indicators
- Learning history and practice history
- Goals
- Confidence indicators
- Preferred support mode
- Recent learning context
- Recommended next actions

The learner model is not a duplicate user database and must not expose unrestricted personal data to AI systems.

---

# Lurexa Learn

Status: MVP / highest priority

Purpose: the flagship learner-facing digital learning environment.

Primary responsibilities:

- CEFR-aligned course delivery
- Modules, lessons, activities, quizzes, and assignments
- Progress tracking
- Assessments and feedback
- Certificates
- Offline-capable learning where practical
- AI-assisted tutoring through Lurexa Mind
- Personalized learning paths
- Capture of learning signals that can improve the Learner Model

Lurexa Learn contributes structured evidence such as completed lessons, assessment performance, recurring mistakes, current vocabulary, current grammar targets, and learner goals.

It does not own a separate personalization engine.

---

# Lurexa Coach

Status: planned; first delivered as an embedded experience inside Lurexa Learn

Purpose: an AI-powered English speaking and pronunciation coach designed first around the linguistic realities of Dominican Spanish speakers.

Lurexa Coach is a product powered by Lurexa Mind and Lurexa Core. It is not the intelligence layer itself.

## Core differentiation

Coach should understand how Dominican Spanish can influence English production and provide useful, English-first coaching rather than generic accent scoring.

The goal is not accent erasure. The goal is clearer, more intelligible, more natural, and more controllable English pronunciation and speaking.

Coach should be capable of working with:

- Pronunciation
- Intelligibility
- Fluency
- Stress and rhythm
- Intonation
- Connected speech
- Grammar in spoken communication
- Vocabulary and natural phrasing
- Communicative effectiveness
- Dominican-Spanish-to-English transfer patterns
- Dominican idioms, slang, and intended meaning when learners attempt direct transfer into English

## English-first pedagogy

Coach should default to explanations and interaction in English when the learner can handle them.

Possible support modes:

- English Immersion — English only
- Guided English — English first, Spanish clarification when needed
- Foundation Support — additional Spanish support for true beginners

Spanish is an explanatory support tool, not the default operating language.

## CEFR-aware adaptation

Coach must use the shared Learner Model before starting or adapting a session.

An A1 learner should receive A1-appropriate topics, vocabulary, sentence length, pace, instructions, and correction load. Coach must not force the learner into language complexity far beyond their current ability unless the learner explicitly requests a challenge.

Example session context supplied by Mind may include:

```text
CEFR: A1
Current topic: daily routines
Known language: family, food, simple present
Current objectives: frequency adverbs, simple present
Pronunciation targets: final consonants, /iː/ vs /ɪ/
Avoid: advanced conditionals, rare vocabulary, long multi-part questions
Feedback intensity: light during conversation, detailed after conversation
```

## Persistent coaching context

Coach should know relevant, authorized context already learned through Lurexa Learn and previous Coach sessions.

It should not repeatedly ask learners for information the ecosystem already knows, such as their CEFR level or current learning unit.

After a Coach session, useful observations can flow back through approved services to improve the Learner Model, such as:

- recurring pronunciation patterns
- repeated grammar errors in spontaneous speech
- fluency changes
- vocabulary gaps
- confidence indicators
- successful corrections
- recommended practice targets

## Feedback philosophy

Coach should prioritize the highest-value feedback rather than interrupt every error.

When appropriate, feedback should explain why a Dominican Spanish speaker may produce a sound or phrase in a particular way and show how to improve it.

Preferred progression:

1. Intelligibility
2. Naturalness
3. Refinement toward an optional target pronunciation style

Avoid framing a Dominican accent itself as a defect.

## Product evolution

1. Embedded Coach inside Lurexa Learn.
2. Cross-product Coach using the shared Learner Model.
3. Standalone Lurexa Coach only when independent user and business value justify it.

---

# Lurexa Teach

Status: planned

Purpose: educator workspace.

Responsibilities:

- Class and learner management
- Assignment workflows
- Progress review
- Scheduling
- Teacher analytics
- AI-assisted lesson and feedback support
- Interpretable intervention recommendations

Teach may consume approved Learner Model summaries to help teachers understand patterns and support students, subject to role permissions and privacy controls.

---

# Lurexa Admin

Status: planned

Purpose: institutional and operational administration.

Responsibilities:

- Organizations and tenants
- Users, roles, and permissions
- Program/course configuration
- Billing and subscriptions
- Governance
- Audit and compliance controls
- Platform configuration

Admin should manage access to learner data; it should not become a teaching or personalization engine.

---

# Lurexa Insight

Status: future

Purpose: analytics and learning-intelligence product.

Responsibilities:

- Learner outcome dashboards
- Cohort and course performance
- Engagement and retention
- Teacher and institutional views
- AI usage and learning-impact metrics
- Interpretable risk and intervention signals
- Aggregated pronunciation and skill trends where authorized

The authoritative product name is **Lurexa Insight**, singular. Do not use the older product names `Lurexa Analytics` or `Lurexa Insights` in new work.

---

# Lurexa Studio

Status: future

Purpose: educational content creation and authoring environment.

Responsibilities:

- Course and lesson authoring
- Assessment creation
- Question banks
- Media/resource management
- Templates
- AI-assisted content creation through Mind
- Review, versioning, approval, and publishing

Studio creates and manages content. Learn delivers it.

---

# Shared Learner Experience

A learner should experience Lurexa as one intelligent system rather than disconnected applications.

Example:

```text
Lurexa Learn
Student studies Unit 6: Ordering Food
        ↓
Core records trusted learning state
        ↓
Mind updates authorized learner context
        ↓
Lurexa Coach
Creates an A1/A2 restaurant role-play using recently studied language
        ↓
Coach observes pronunciation and speaking patterns
        ↓
Mind interprets the observations
        ↓
Core persists approved learning records
        ↓
Learn can recommend targeted follow-up practice
```

This cross-product continuity is a strategic differentiator and should be preserved in architecture decisions.

---

# AI Product Rules

- Products do not call model providers directly when Mind provides an approved interface.
- Products do not own independent learner profiles for personalization.
- Mind may interpret authorized learner context but does not bypass Core authorization.
- AI feedback must adapt to CEFR level and current learning context where those signals are available.
- Learners should be able to understand why meaningful recommendations or corrections are being made.
- High-impact educational decisions require appropriate validation and governance.
- Personalization must respect privacy, data minimization, and user controls.

---

# Product Boundaries

Correct:

- Learn delivers structured learning.
- Coach provides speaking/pronunciation coaching.
- Studio authors content.
- Insight interprets learning evidence for dashboards.
- Mind provides shared intelligence.
- Core provides trusted platform foundations.

Incorrect:

- Each product creates its own learner model.
- Coach directly reads Firestore or directly calls an AI provider.
- Learn creates a second speaking intelligence engine separate from Mind.
- Insight becomes a second analytics event store.
- Studio creates its own authentication or organization model.

Products collaborate. They do not compete or duplicate platform capabilities.

---

# Product Evolution

Phase 1 — Core platform foundation

Phase 2 — Lurexa Learn MVP and reliable learning records

Phase 3 — Lurexa Mind foundation and Learner Model

Phase 4 — Embedded Lurexa Coach with CEFR-aware speaking/pronunciation practice

Phase 5 — Lurexa Teach

Phase 6 — Offline/mobile resilience

Phase 7 — Lurexa Admin + Lurexa Insight

Phase 8 — Lurexa Studio

Phase 9 — Cross-product Coach and deeper learner-model adaptation

Phase 10 — Enterprise, marketplace, APIs, additional subjects, and additional L1 profiles

---

# Future Expansion

Dominican Spanish is the first deep linguistic profile for Lurexa Coach, not a permanent technical limit.

Future L1 profiles could model additional Spanish varieties and other first-language backgrounds without changing the Core/Mind/product architecture.

Potential future products may include Lurexa Assess, Classroom, Marketplace, Enterprise, Research, and other specialized experiences when they solve a distinct problem and justify separate product boundaries.

---

# Guiding Principles

> **Lurexa Learning Technologies builds the ecosystem.**

> **Lurexa Core powers it.**

> **Lurexa Mind understands and adapts.**

> **Products deliver the experience.**

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

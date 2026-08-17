# Capability Architecture

Version: 1.2

Status: Approved

Owner: Platform Architecture

Last updated: 2026-08-17

---

# Purpose

This document defines the reusable business capabilities of the Lurexa platform and maps them to the company architecture established by Lurexa Learning Technologies.

Applications do not own core business logic. Applications compose capabilities.

---

# Company and Platform Context

```text
Lurexa Learning Technologies
│
├── Lurexa Core
│   └── Shared platform and operational capabilities
│
├── Lurexa Mind
│   └── Intelligence, learner modeling, and adaptive-learning capabilities
│
└── Products
    ├── Lurexa Learn
    ├── Lurexa Coach
    ├── Lurexa Teach
    ├── Lurexa Admin
    ├── Lurexa Insight
    └── Lurexa Studio
```

Core and Mind are platform technology layers. They are not product applications.

Products consume capabilities through stable interfaces.

---

# Top-Level Capability Architecture

```text
Lurexa Platform
│
├── Lurexa Core
│   ├── Identity
│   ├── Organizations
│   ├── Learning Records
│   ├── Content Contracts
│   ├── Commerce
│   ├── Scheduling
│   ├── Notifications
│   ├── Platform Analytics
│   └── Offline & Sync
│
└── Lurexa Mind
    ├── AI Gateway
    ├── Learner Model
    ├── Personalization
    ├── Recommendations
    ├── Tutoring Intelligence
    ├── Speaking & Pronunciation Intelligence
    ├── L1 Transfer Intelligence
    ├── Assessment Intelligence
    ├── Content Adaptation
    └── Pedagogical Agents
```

The mapping is conceptual ownership. Existing packages do not need immediate renaming. Package boundaries should change only when domain boundaries are proven.

---

# Capability Contract

A capability owns, as applicable:

- domain rules
- APIs and service interfaces
- data contracts
- validation
- events
- permissions
- documentation

Applications consume capabilities. Capabilities do not depend on product applications.

---

# Lurexa Core

## Purpose

Lurexa Core is the trusted technical and operational foundation of the ecosystem.

> **Lurexa Core is the technology foundation that powers the Lurexa ecosystem.**

Core owns authoritative platform state, authorization, and reusable operational services.

## Identity

Responsibilities:

- authentication
- sessions
- user lifecycle
- user/account profiles
- RBAC
- permissions

## Organizations

Responsibilities:

- organizations
- memberships
- tenant boundaries
- institutional roles
- organization configuration

## Learning Records

Responsibilities:

- courses
- modules
- lessons
- activities
- quizzes
- enrollment
- progress
- certificates
- assessment records
- trusted learning events

Learning Records are evidence sources for Lurexa Mind. Mind should not become a second source of truth for course completion or enrollment.

## Content Contracts

Responsibilities:

- learning object contracts
- questions
- media references
- content metadata
- publication/version state

Studio is the product experience for authoring. Content contracts remain platform capabilities.

## Commerce

Responsibilities:

- plans
- subscriptions
- billing
- invoices
- coupons
- refunds

## Scheduling

Responsibilities:

- calendar integration
- availability
- bookings
- time zones
- live-class metadata

## Notifications

Responsibilities:

- email
- push
- in-app notifications
- future approved channels
- notification preferences

## Platform Analytics

Responsibilities:

- event contracts
- usage telemetry
- engagement events
- learning events
- AI usage events
- operational metrics

Lurexa Insight is the product that presents and interprets authorized analytics.

## Offline & Sync

Responsibilities:

- local caching
- download management
- synchronization
- conflict resolution
- offline eligibility
- evidence reconciliation
- on-device adapters where appropriate

Offline learning evidence must be reconciled safely before it influences persistent learner-model state.

---

# Lurexa Mind

## Purpose

Lurexa Mind is the shared intelligence and adaptation layer of the ecosystem.

> **Lurexa Mind is the intelligence layer that understands, adapts, and responds to learners and educators.**

Mind is not equivalent to a chatbot, prompt library, or model provider.

---

# AI Gateway

Responsibilities:

- provider abstraction
- model routing
- structured outputs
- cost controls
- rate limits
- fallback behavior
- observability
- request policies

Products should not directly depend on model providers when the Mind gateway provides the abstraction.

---

# Learner Model

Purpose:

Represent the evolving educational state needed for responsible personalization across products.

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

The learner model may include:

- overall and skill-specific CEFR estimates
- current curriculum context
- vocabulary and grammar mastery
- speaking, listening, reading, and writing skill estimates
- recurring errors
- pronunciation patterns and targets
- L1-transfer patterns
- fluency indicators
- learning and practice history
- goals
- support preferences
- confidence indicators
- recommended next actions

The Learner Model must preserve the difference between:

- observed evidence
- inferred state
- learner-provided preference
- teacher-provided judgment
- system recommendation

Where practical, meaningful learner-model attributes should preserve source, timestamp, confidence, and review/expiry behavior.

The Learner Model consumes only authorized Core evidence. It must not become an uncontrolled duplicate user database.

Detailed rules are defined in `Docs/Architecture/Learner Model Architecture.md`.

---

# Personalization

Responsibilities:

- difficulty adaptation
- CEFR-aware interaction constraints
- practice sequencing
- explanation-style adaptation
- content selection
- learning-path adjustments

An A1 learner should not receive unnecessarily advanced conversation simply because the underlying model can generate it.

---

# Recommendations

Responsibilities:

- next activity suggestions
- review recommendations
- study-plan suggestions
- targeted remediation
- teacher-facing interventions

Meaningful recommendations should be explainable.

---

# Tutoring Intelligence

Responsibilities:

- explanations
- hints
- guided practice
- error feedback
- Socratic support
- writing support
- conversational practice

Tutoring Intelligence is reusable across Learn and Coach. A product UI named AI Tutor is not itself the architecture.

---

# Speaking & Pronunciation Intelligence

Purpose:

Provide reusable speech-focused educational intelligence for Lurexa Coach and other products.

Responsibilities may include:

- speech analysis orchestration
- intelligibility-oriented feedback
- phoneme-level targets where technically reliable
- word stress
- sentence stress
- rhythm
- intonation
- connected speech
- pronunciation pattern tracking
- correction prioritization
- speaking fluency indicators
- CEFR-aware speaking-task generation

Educational goal:

1. Intelligibility
2. Naturalness
3. Optional pronunciation refinement

The system must not treat a Dominican accent itself as a defect.

---

# L1 Transfer Intelligence

Purpose:

Understand how a learner's first-language background may influence English production.

The first deeply modeled profile is Dominican Spanish.

Responsibilities may include:

- likely sound substitutions
- vowel/consonant transfer patterns
- final consonant and cluster patterns
- stress/rhythm transfer
- lexical and grammatical transfer
- interpretation of direct transfers from Dominican idioms/slang into intended English meaning
- generation of culturally and linguistically useful explanations

This capability should support future L1 profiles without changing the overall architecture.

---

# Assessment Intelligence

Responsibilities may include:

- answer analysis
- error categorization
- writing feedback
- speaking assessment support
- rubric assistance
- difficulty estimation
- progress interpretation

High-impact decisions require transparent rules and appropriate human oversight.

---

# Content Adaptation

Responsibilities may include:

- CEFR-level adaptation
- simplification
- expansion
- example generation
- practice generation
- language support

Consumed by Learn, Teach, Studio, and Coach.

---

# Pedagogical Agents

Potential roles include:

- tutor agent
- speaking coach agent
- study-planning agent
- teacher-support agent
- assessment-support agent

Agents operate under Mind policies, Core authorization, and product-specific constraints.

---

# Core ↔ Mind Relationship

Core owns trusted state and authorization.

Mind owns intelligent interpretation and adaptive behavior.

Mind should not bypass Core to read or mutate product data.

Preferred interaction:

```text
Product
  ↓
Core authorization + trusted context
  ↓
Mind intelligence service
  ↓
Validated response / recommendation / observation
  ↓
Approved persistence boundary
  ↓
Product experience
```

When Mind needs to persist an observation or inference, it should use an approved Core-owned contract/service boundary.

---

# Product Composition

## Lurexa Learn

Primary capabilities:

- Identity
- Learning Records
- Content Contracts
- Offline & Sync
- Platform Analytics
- Learner Model
- Personalization
- Recommendations
- Tutoring Intelligence
- Assessment Intelligence

Learn contributes structured evidence to the Learner Model and consumes adaptive context from Mind.

## Lurexa Coach

Primary capabilities:

- Identity
- Learning Records
- Learner Model
- Personalization
- Recommendations
- Tutoring Intelligence
- Speaking & Pronunciation Intelligence
- L1 Transfer Intelligence
- Assessment Intelligence
- Pedagogical Agents

Coach must use relevant authorized learning context already known from Learn and prior Coach sessions.

Coach initially focuses on English speaking/pronunciation for Dominican Spanish speakers and should adapt tasks to current CEFR/context.

Coach is a product. It consumes Mind; it is not Mind.

Recommended evolution:

1. Embedded in Lurexa Learn.
2. Cross-product using the shared Learner Model.
3. Standalone only when independent user/business value justifies it.

## Lurexa Teach

Primary capabilities:

- Identity
- Organizations
- Learning Records
- Scheduling
- Notifications
- Platform Analytics
- Recommendations
- Assessment Intelligence
- Content Adaptation
- Pedagogical Agents

Teach may consume role-appropriate Learner Model summaries, subject to authorization and privacy policy.

## Lurexa Admin

Primary capabilities:

- Identity
- Organizations
- Commerce
- Platform Analytics
- Notifications
- governance-oriented services

Administrative access does not imply unrestricted access to detailed pedagogical learner data.

## Lurexa Insight

Primary capabilities:

- Identity
- Organizations
- Platform Analytics
- Learning Records
- approved Mind interpretation services

Insight is a product. Analytics remains a Core capability.

## Lurexa Studio

Primary capabilities:

- Identity
- Organizations
- Content Contracts
- Platform Analytics
- Content Adaptation
- Assessment Intelligence
- Pedagogical Agents

---

# Dependency Rules

Allowed:

```text
Product Application
↓
Capability Interface
↓
Domain/Application Logic
↓
Infrastructure Adapter
```

Forbidden:

```text
Product UI → Firestore directly
Product UI → AI provider directly
Product-specific learner model → duplicate shared learner state
Mind → unauthorized direct platform-data access
```

---

# Package Mapping

Capabilities may map to multiple focused packages.

Do not create giant `core/` and `mind/` umbrella packages solely to mirror branding.

Preferred interpretation:

- **Lurexa Core** = architectural ownership group for cohesive platform capabilities/packages.
- **Lurexa Mind** = architectural ownership group for cohesive intelligence capabilities/packages.

Packages should remain narrowly scoped and independently testable.

---

# Evolution Strategy

## Phase 1 — Core foundation

Identity, organizations, learning records, stable contracts, commerce, notifications, offline/sync foundations.

## Phase 2 — Learn composition

Deliver the Learn MVP on trusted Core capabilities.

## Phase 3 — Mind + Learner Model foundation

AI gateway, learner context contracts, evidence provenance, CEFR state, personalization, recommendations, tutoring intelligence, validation/privacy controls.

## Phase 4 — Embedded Coach

CEFR-aware conversation, speaking/pronunciation evidence, Dominican-Spanish L1-transfer support, prioritized feedback, and safe persistence back into the shared Learner Model.

## Phase 5+

Compose the same Core and Mind capabilities into Teach, Admin, Insight, Studio, cross-product Coach, enterprise offerings, additional subjects, and future L1 profiles.

---

# Guiding Principles

> Applications are temporary. Capabilities are durable.

> Core owns trusted platform foundations.

> Mind owns reusable intelligence.

> Products observe the learner. Mind understands the learner. Core protects and persists the trusted learning record.

> Build capabilities first. Compose products second.

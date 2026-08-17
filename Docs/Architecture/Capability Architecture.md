# Capability Architecture

Version: 1.1

Status: Approved

Owner: Platform Architecture

Last updated: 2026-08-17

---

# Purpose

This document defines the business capabilities of the Lurexa platform and maps them to the company architecture established by Lurexa Learning Technologies.

Capabilities are the highest reusable architectural building blocks of the ecosystem.

Applications do not own core business logic.

Applications compose capabilities.

This allows new products to be created without rewriting existing functionality.

---

# Company and Platform Context

```text
Lurexa Learning Technologies
│
├── Lurexa Core
│   └── Shared platform and operational capabilities
│
├── Lurexa Mind
│   └── Intelligence, personalization, and adaptive-learning capabilities
│
└── Products
    ├── Lurexa Learn
    ├── Lurexa Teach
    ├── Lurexa Admin
    ├── Lurexa Insight
    ├── Lurexa Coach
    └── Lurexa Studio
```

Lurexa Core and Lurexa Mind are platform technology layers.

They are not product applications.

Products consume capabilities from Core and Mind through stable interfaces.

---

# What is a Capability?

A capability is a reusable business domain that provides services to one or more products.

A capability owns:

- Business rules
- APIs
- Data model
- Services
- Events
- Permissions
- Validation
- Documentation

Applications consume capabilities.

Capabilities never depend on applications.

---

# Top-Level Capability Architecture

```text
Lurexa Platform
│
├── Lurexa Core
│   ├── Identity
│   ├── Organizations
│   ├── Learning
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
    ├── Assessment Intelligence
    ├── Content Adaptation
    └── Pedagogical Agents
```

Every capability should be independently testable.

The mapping above is conceptual ownership. Existing packages do not need to be renamed immediately. Package boundaries should change only when the domain boundaries are proven and the refactor reduces rather than increases complexity.

---

# Capability Layers

Every capability follows the same internal architecture.

```text
Capability
│
├── Domain
├── Application
├── Infrastructure
└── Interface
```

---

## Domain

Contains:

- Entities
- Business Rules
- Value Objects
- Domain Events

No framework code belongs here.

---

## Application

Contains:

- Use Cases
- Commands
- Queries
- Services

Coordinates business logic.

---

## Infrastructure

Contains adapters and implementations such as:

- Firestore
- Firebase
- External APIs
- Stripe
- Google Calendar
- AI model providers

Infrastructure implements interfaces defined by the domain/application layers.

---

## Interface

Contains:

- SDK contracts
- React Hooks where appropriate
- API Clients
- UI Adapters
- Public service interfaces

Applications communicate with capabilities through supported interfaces rather than implementation details.

---

# Lurexa Core

## Purpose

Lurexa Core is the shared technical and operational foundation of the ecosystem.

Core should provide trusted identity, data, permissions, system state, operational services, and reusable business capabilities to all products.

A concise definition is:

> **Lurexa Core is the technology foundation that powers the Lurexa ecosystem.**

Core should remain secure, stable, reusable, observable, and independent of any one product experience.

---

# Identity Capability

Purpose:

Manage users and access.

Responsibilities:

- Authentication
- RBAC
- Sessions
- User Profiles
- Identity lifecycle

Owns:

- Users
- Roles
- Permissions

Consumed by:

Every product and authorized Mind service.

---

# Organizations Capability

Purpose:

Support schools, institutions, teams, and future multi-tenant customers.

Responsibilities:

- Organizations
- Memberships
- Institutional roles
- Tenant boundaries
- Organization configuration

Consumed by:

Learn, Teach, Admin, Insight, Studio, Coach where applicable.

---

# Learning Capability

Purpose:

Represent and track structured education.

Responsibilities:

- Courses
- Modules
- Lessons
- Activities
- Quizzes
- Progress
- Certificates
- Enrollment
- Learning records

Consumed by:

Learn, Teach, Insight, Coach, Studio, and approved Mind capabilities.

---

# Content Contracts Capability

Purpose:

Define the reusable platform representation of educational content.

Responsibilities:

- Learning object contracts
- Question contracts
- Media references
- Version identifiers
- Content metadata
- Publication states

This capability should not be confused with Studio, which is a product experience for authoring and managing content.

Consumed by:

Learn, Teach, Studio, Coach, and Mind content-adaptation services.

---

# Commerce Capability

Purpose:

Monetize the platform.

Responsibilities:

- Products
- Plans
- Billing
- Coupons
- Refunds
- Invoices
- Subscription state

Provider adapters may include Stripe.

Consumed by:

Learn, Admin, future enterprise products, and future standalone Coach offerings if commercialized separately.

---

# Scheduling Capability

Purpose:

Coordinate time-based educational workflows.

Responsibilities:

- Calendar integration
- Bookings
- Availability
- Time Zones
- Live Classes
- Appointment metadata

Consumed by:

Teach, Learn, Admin, and Coach where relevant.

---

# Notifications Capability

Purpose:

Communicate with users through approved channels.

Responsibilities:

- Email
- Push
- In-App
- SMS (future)
- WhatsApp (future)
- Notification preferences

Consumed by:

All relevant products and approved Mind workflows.

---

# Platform Analytics Capability

Purpose:

Capture reliable platform and learning events that products and Insight can interpret.

Responsibilities:

- Event contracts
- Usage telemetry
- Engagement events
- Learning events
- AI usage events
- Operational metrics

Lurexa Insight is the product that turns these records into decision-support experiences. The analytics capability itself remains part of Core.

---

# Offline & Sync Capability

Purpose:

Guarantee meaningful learning during unreliable connectivity.

Responsibilities:

- IndexedDB or equivalent client storage
- Download Manager
- Sync Engine
- Conflict Resolution
- Offline eligibility rules
- Local state reconciliation
- On-device model adapters where appropriate

Offline is considered a platform capability, not a cosmetic product feature.

Consumed primarily by Learn and potentially Coach and future mobile products.

---

# Lurexa Mind

## Purpose

Lurexa Mind is the shared intelligence and adaptation layer of the ecosystem.

Mind should understand approved learning context, transform it into pedagogically useful decisions, and expose reusable intelligence services to Lurexa products.

A concise definition is:

> **Lurexa Mind is the intelligence layer that understands, adapts, and responds to learners and educators.**

Mind is not equivalent to a chatbot, prompt library, or individual AI provider.

It is an architectural layer that owns reusable intelligence behavior.

---

# AI Gateway Capability

Purpose:

Provide a controlled abstraction between Lurexa products/intelligence services and external or local model providers.

Responsibilities:

- Model routing
- Provider abstraction
- Request policies
- Cost controls
- Rate limits
- Model fallbacks
- Structured outputs
- Provider observability

Products should not directly depend on a model provider where the Mind gateway can provide the abstraction.

---

# Learner Model Capability

Purpose:

Represent the educational state needed for responsible personalization.

Responsibilities may include:

- Proficiency state
- Skill estimates
- Learning goals
- Practice history
- Common errors
- Preference signals
- Confidence indicators
- Recent learning context

The Learner Model consumes only data that Core authorizes and exposes through supported interfaces.

It should not become an uncontrolled duplicate user database.

---

# Personalization Capability

Purpose:

Adapt learning experiences to learner context.

Responsibilities:

- Difficulty adaptation
- Practice sequencing
- Content selection
- Explanation style adaptation
- Learning-path adjustments

Consumed by:

Learn, Coach, and future adaptive products.

---

# Recommendations Capability

Purpose:

Recommend educationally meaningful next actions.

Responsibilities:

- Next activity suggestions
- Review recommendations
- Study-plan suggestions
- Intervention recommendations
- Teacher-facing recommendations

Recommendations should be explainable where they materially influence learning decisions.

---

# Tutoring Intelligence Capability

Purpose:

Provide reusable pedagogical tutoring behavior.

Responsibilities:

- Explanations
- Guided practice
- Socratic support
- Error feedback
- Hint generation
- Conversation-based practice
- Speaking support
- Writing support

Consumed primarily by:

Learn and Coach.

This capability is broader than a single UI feature named AI Tutor.

---

# Assessment Intelligence Capability

Purpose:

Use validated intelligence to support formative assessment and feedback.

Responsibilities may include:

- Answer analysis
- Error categorization
- Writing feedback
- Speaking assessment support
- Rubric assistance
- Difficulty estimation
- Progress interpretation

High-impact decisions should preserve human oversight and transparent evaluation rules.

---

# Content Adaptation Capability

Purpose:

Adapt approved educational content for specific learning contexts without undermining source integrity.

Responsibilities may include:

- Level adaptation
- Example generation
- Practice generation
- Simplification
- Expansion
- Language support
- Variant generation

Consumed by:

Learn, Teach, Studio, and Coach.

---

# Pedagogical Agents Capability

Purpose:

Coordinate specialized AI behaviors around bounded educational roles.

Potential roles include:

- Tutor agent
- Speaking coach agent
- Study-planning agent
- Teacher-support agent
- Assessment-support agent

Agents must operate under Mind policies, Core authorization, and product-specific constraints.

---

# Core ↔ Mind Relationship

Core and Mind have different responsibilities.

Core owns trusted platform state and operational truth.

Mind owns intelligent interpretation and adaptive behavior.

Mind should not bypass Core to read or mutate product data.

Preferred interaction:

```text
Product
  ↓
Core authorization + context
  ↓
Mind intelligence service
  ↓
Validated recommendation / response / action
  ↓
Product experience
```

When Mind needs to persist a result, that persistence should occur through an approved Core-owned service or contract rather than direct database coupling where practical.

---

# Product Composition

Products are experiences composed from Core and Mind capabilities.

## Lurexa Learn

Primary consumers:

- Identity
- Learning
- Content Contracts
- Offline & Sync
- Platform Analytics
- Learner Model
- Personalization
- Recommendations
- Tutoring Intelligence
- Assessment Intelligence

## Lurexa Teach

Primary consumers:

- Identity
- Organizations
- Learning
- Scheduling
- Notifications
- Platform Analytics
- Recommendations
- Assessment Intelligence
- Content Adaptation
- Pedagogical Agents

## Lurexa Admin

Primary consumers:

- Identity
- Organizations
- Commerce
- Platform Analytics
- Notifications
- Governance-oriented platform services

## Lurexa Insight

Primary consumers:

- Identity
- Organizations
- Platform Analytics
- Learning records
- Approved Mind interpretation services

Insight is a product. Analytics is a Core capability.

## Lurexa Coach

Primary consumers:

- Identity
- Learning
- Notifications
- Scheduling where relevant
- Learner Model
- Personalization
- Recommendations
- Tutoring Intelligence
- Assessment Intelligence
- Pedagogical Agents

Coach is a user-facing product powered by Mind. Coach is not Mind itself.

Recommended evolution:

1. Embedded in Lurexa Learn.
2. Shared across relevant Lurexa products.
3. Standalone only when independent user and business value justify it.

## Lurexa Studio

Primary consumers:

- Identity
- Organizations
- Content Contracts
- Platform Analytics
- Content Adaptation
- Assessment Intelligence
- Pedagogical Agents

Studio is the authoring product. Content contracts remain reusable platform capabilities.

---

# Capability Ownership

Each capability owns:

- Data or authoritative domain state where applicable
- Validation
- APIs
- Events
- Documentation
- Authorization rules for its domain

No capability should modify another capability's internal state directly.

Communication occurs through public interfaces and supported contracts.

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
Capability
↓
Product Application
```

Forbidden:

```text
Product UI
↓
Firestore directly
```

Forbidden where avoidable:

```text
Product UI
↓
AI Provider directly
```

Preferred:

```text
Product
↓
Lurexa Core / Lurexa Mind interfaces
```

---

# Cross-Capability Communication

Capabilities communicate through:

- Public APIs
- Domain/application services
- Events
- Shared Contracts

Never through undocumented internal implementation details.

---

# Package Mapping

Capabilities may eventually become one or more packages.

Current and future mappings can include packages such as:

```text
packages/
  auth/
  backend/
  database/
  sdk/
  types/
  learning/
  identity/
  content/
  commerce/
  analytics/
  notifications/
  offline/
  scheduling/
  ai/
  personalization/
  recommendations/
```

Do not create `core/` and `mind/` umbrella packages simply to mirror the brand hierarchy if doing so would create circular dependencies or a monolithic package.

The preferred pattern is:

- **Lurexa Core** = architectural ownership group for multiple cohesive capabilities/packages.
- **Lurexa Mind** = architectural ownership group for multiple cohesive intelligence capabilities/packages.

Each package should remain narrowly scoped and independently testable.

Engineering standards are defined in the repository governance and standards documents.

---

# Evolution Strategy

## Phase 1 — Core foundation

Prioritize:

- Identity
- Organizations
- Learning
- Core data contracts
- Commerce foundation
- Notifications foundation
- Offline/sync foundations

## Phase 2 — Learn composition

Use Core capabilities to deliver the Lurexa Learn MVP without duplicating business logic in the application.

## Phase 3 — Mind foundation

Prioritize:

- AI Gateway
- Learner Model
- Personalization
- Recommendations
- Tutoring Intelligence
- Validation and responsible-AI controls

## Phase 4 — Embedded Coach

Use Mind capabilities inside Lurexa Learn to validate Lurexa Coach before creating a separate application.

## Phase 5+

Compose the same Core and Mind capabilities into Teach, Admin, Insight, Studio, cross-product Coach, enterprise offerings, and additional subjects.

---

# Guiding Principles

> Applications are temporary. Capabilities are durable.

> Core owns trusted platform foundations.

> Mind owns reusable intelligence.

> Products compose both to deliver user value.

> Build capabilities first. Compose products second.

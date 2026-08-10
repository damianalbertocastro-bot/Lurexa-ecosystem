# Dependency Graph

Version: 1.0

Status: Approved

Owner: Platform Architecture

---

# Purpose

This document defines the permitted dependency relationships within the Lurexa ecosystem.

Its goals are to:

- Prevent circular dependencies
- Keep business logic isolated
- Preserve modularity
- Improve maintainability
- Enable independent package evolution
- Simplify testing
- Reduce coupling

Every new dependency introduced into the repository must comply with this document.

---

# Dependency Philosophy

Dependencies always flow downward.

Higher-level modules orchestrate lower-level modules.

Lower-level modules must never depend on higher-level modules.

The architecture follows the Dependency Rule.

```
Applications
        │
        ▼
Capability Interfaces
        │
        ▼
Application Layer
        │
        ▼
Domain Layer
        │
        ▼
Infrastructure
        │
        ▼
External Services
```

Dependencies never flow upward.

---

# Architecture Layers

## Layer 1

Applications

Examples

- learn-web
- teacher-portal
- admin-portal
- mobile

Responsibilities

- Routing
- UI composition
- User interaction

Applications contain almost no business rules.

---

## Layer 2

Capability Interfaces

Examples

packages/

- learning
- ai
- commerce
- scheduling

Expose

- SDK
- Hooks
- Public APIs
- Shared Types

Applications communicate only with this layer.

---

## Layer 3

Application Layer

Contains

- Use Cases
- Commands
- Queries
- Services

Coordinates business operations.

No framework code.

---

## Layer 4

Domain Layer

Contains

- Entities
- Value Objects
- Business Rules
- Domain Events

This layer has zero external dependencies.

It represents the core of the platform.

---

## Layer 5

Infrastructure

Contains

- Firestore
- Firebase
- Stripe
- Gemini
- Google Calendar
- Storage

Infrastructure implements interfaces defined by the Domain.

---

## Layer 6

External Services

Examples

- Firebase
- Gemini
- Stripe
- Google Calendar
- TensorFlow Lite

These services never know the platform exists.

---

# Allowed Dependency Matrix

| From | Can Depend On |
|--------|---------------|
| Applications | Capability Interfaces |
| Capability Interfaces | Application Layer |
| Application Layer | Domain Layer |
| Infrastructure | Domain Layer |
| Infrastructure | External Services |
| Domain Layer | Nothing External |

---

# Forbidden Dependencies

Applications

❌ Firestore

❌ Firebase SDK

❌ Stripe SDK

❌ Gemini SDK

❌ Calendar APIs

Applications always communicate through capabilities.

---

Capability Interfaces

❌ React Pages

❌ Next.js Routing

❌ UI Components

Interfaces remain framework-neutral whenever possible.

---

Domain Layer

Never imports

- React
- Firebase
- Next.js
- Stripe
- Firestore
- Browser APIs

The Domain Layer should be portable.

---

Infrastructure

Cannot contain business rules.

Infrastructure only implements contracts.

---

# Capability Dependencies

The following dependencies are approved.

Identity

↓

None

Identity is foundational.

---

Learning

↓

Identity

---

AI

↓

Identity

Learning

---

Content

↓

Identity

AI

---

Commerce

↓

Identity

---

Scheduling

↓

Identity

Notifications

---

Notifications

↓

Identity

---

Analytics

↓

Identity

Learning

AI

Commerce

---

Offline

↓

Learning

Identity

---

# Dependency Diagram

```
                     Identity
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    Learning        Commerce      Notifications
        │               │               │
        │               │               │
        ▼               ▼               ▼
        AI         Scheduling      Analytics
        │                               ▲
        │                               │
        └──────────────┬────────────────┘
                       │
                   Offline
```

Identity sits at the center of the platform.

No capability may create a dependency cycle.

---

# Shared Packages

These packages may be imported by every capability.

packages/

- types
- tokens
- config
- utils

Rules

Shared packages

↓

Never depend on capabilities.

Capabilities

↓

May depend on shared packages.

---

# SDK Rules

Applications never import capability internals.

Allowed

```ts
import { sdk } from "@lurexa/sdk";
```

Not allowed

```ts
import { FirestoreCourseRepository } from "@lurexa/learning";
```

The SDK is the public contract.

---

# UI Rules

Applications consume

@lurexa/ui

Capabilities never depend on UI.

UI components never contain business logic.

---

# Event Communication

Capabilities communicate through:

- Events
- Interfaces
- Contracts

Never by directly modifying another capability's data.

Example

Enrollment Created

↓

Analytics updates metrics

↓

Notifications sends email

↓

Coach updates study plan

No capability calls another capability's private implementation.

---

# Data Ownership

Every entity has exactly one owner.

| Entity | Owner |
|---------|-------|
| User | Identity |
| Role | Identity |
| Course | Learning |
| Module | Learning |
| Lesson | Learning |
| Enrollment | Learning |
| Certificate | Learning |
| Prompt | AI |
| Conversation | AI |
| Product | Commerce |
| Subscription | Commerce |
| Booking | Scheduling |
| Notification | Notifications |
| Analytics Report | Analytics |

Ownership is exclusive.

Other capabilities consume public interfaces.

---

# Circular Dependency Policy

Circular dependencies are prohibited.

Examples

Learning

↓

AI

↓

Learning

❌ Forbidden

Instead

Learning

↓

Event

↓

AI

AI reacts.

Learning remains unchanged.

---

# Repository Mapping

Future package organization

packages/

identity/

learning/

ai/

content/

commerce/

notifications/

analytics/

offline/

scheduling/

shared/

config/

sdk/

tokens/

types/

ui/

utils/

Capabilities never import applications.

Applications compose capabilities.

---

# Code Review Checklist

Every Pull Request should answer:

- Does this introduce a new dependency?
- Is the dependency allowed?
- Does it create tighter coupling?
- Does it duplicate existing functionality?
- Does it violate capability ownership?
- Could this dependency become an event instead?

If any answer raises concern, the dependency should be reviewed before merging.

---

# Future Evolution

As the ecosystem grows, additional capabilities may be added.

Examples

- Assessments
- Research
- Enterprise
- Parents
- Kids

Every new capability must:

- Define ownership
- Define dependencies
- Update this document
- Update the Capability Interaction Matrix
- Include an ADR if introducing a new architectural pattern

---

# Guiding Principle

Dependencies should make the platform easier to extend—not harder to understand.

Every dependency is a long-term commitment.

Prefer stable contracts, clear ownership, and loose coupling over convenience.
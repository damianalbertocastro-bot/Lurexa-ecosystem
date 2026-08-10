# Capability Architecture

Version: 1.0

Status: Approved

Owner: Platform Architecture

---

# Purpose

This document defines the business capabilities of the Lurexa Platform.

Capabilities are the highest architectural building blocks of the ecosystem.

Applications do not own business logic.

Applications compose capabilities.

This allows new products to be created without rewriting existing functionality.

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

# Architecture

```

Lurexa Platform

│

├── Identity

├── Learning

├── AI

├── Content

├── Commerce

├── Scheduling

├── Notifications

├── Analytics

└── Offline

```

Every capability should be independently testable.

---

# Capability Layers

Every capability follows the same internal architecture.

```

Capability

│

├── Domain

├── Application

├── Infrastructure

└── Interface

```

---

## Domain

Contains

- Entities
- Business Rules
- Value Objects
- Domain Events

No framework code belongs here.

---

## Application

Contains

- Use Cases
- Commands
- Queries
- Services

Coordinates business logic.

---

## Infrastructure

Contains

- Firestore
- External APIs
- Firebase
- Stripe
- Google Calendar

Infrastructure implements interfaces defined by the Domain.

---

## Interface

Contains

- SDK
- React Hooks
- API Clients
- UI Adapters

Applications communicate only through this layer.

---

# Identity Capability

Purpose

Manage users and access.

Responsibilities

- Authentication
- RBAC
- Organizations
- Sessions
- User Profiles

Owns

- Users
- Roles
- Permissions

Consumed by

Every product.

---

# Learning Capability

Purpose

Deliver education.

Responsibilities

- Courses
- Modules
- Lessons
- Activities
- Quizzes
- Progress
- Certificates
- Enrollment

Consumed by

Learn

Coach

Classroom

Analytics

---

# AI Capability

Purpose

Provide intelligent educational services.

Responsibilities

- AI Tutor
- Prompt Library
- AI Gateway
- Exercise Generation
- Translation
- Explanations
- Feedback

Future

- Speaking Assessment
- Essay Evaluation

Consumed by

Learn

Coach

Studio

Admin

---

# Content Capability

Purpose

Create educational resources.

Responsibilities

- Lesson Editor
- Rich Text
- Images
- Videos
- Question Banks
- Flashcards
- Templates

Primary Consumer

Studio

---

# Commerce Capability

Purpose

Monetize the platform.

Responsibilities

- Products
- Plans
- Billing
- Coupons
- Refunds
- Invoices

Provider

Stripe

---

# Scheduling Capability

Purpose

Coordinate time.

Responsibilities

- Google Calendar
- Bookings
- Availability
- Time Zones
- Live Classes

---

# Notifications Capability

Purpose

Communicate with users.

Responsibilities

- Email
- Push
- SMS (future)
- WhatsApp (future)
- In-App

---

# Analytics Capability

Purpose

Measure learning.

Responsibilities

- KPIs
- Reports
- Engagement
- Retention
- AI Usage
- Learning Insights

---

# Offline Capability

Purpose

Guarantee learning without connectivity.

Responsibilities

- IndexedDB
- Download Manager
- Sync Engine
- TensorFlow Lite
- Conflict Resolution

Offline is considered a platform capability, not a feature.

---

# Capability Ownership

Each capability owns

- Data
- Validation
- APIs
- Events
- Documentation

No other capability may modify another capability's data directly.

Communication occurs through public interfaces.

---

# Dependency Rules

Allowed

Application

↓

Capability

↓

Shared Infrastructure

Forbidden

Capability

↓

Application

Forbidden

Application

↓

Database

Forbidden

UI

↓

Firestore

---

# Cross-Capability Communication

Capabilities communicate through

- Public APIs
- Events
- Shared Contracts

Never through internal implementation details.

---

# Package Mapping

Every capability eventually becomes one or more packages.

Example

packages/

identity/

learning/

ai/

content/

commerce/

analytics/

notifications/

offline/

scheduling/

Each package follows the same engineering standards defined in:

- AGENTS.md
- stack.md
- conventions.md
- principles.md

---

# Evolution Strategy

Phase 1

Identity

Learning

AI

Commerce

Offline

Notifications

Phase 2

Scheduling

Analytics

Content

Phase 3

Marketplace

Enterprise

Research

---

# Guiding Principle

Applications are temporary.

Capabilities are permanent.

Build capabilities first.

Compose products second.
# Capability Interaction Matrix

Version: 1.0

Status: Approved

Owner: Platform Architecture

---

# Purpose

This document defines how each Lurexa product consumes platform capabilities.

It establishes clear ownership boundaries and prevents duplicated functionality across the ecosystem.

Every new feature should first identify:

1. Which product it belongs to.
2. Which capability owns the business logic.
3. Whether the capability already exists.

No product should implement business logic that belongs to another capability.

---

# Legend

| Symbol | Meaning |
|---------|---------|
| ✅ | Primary Consumer |
| 🔶 | Secondary Consumer |
| 🔍 | Read Only |
| ⚙️ | Administrative Access |
| ❌ | Not Used |

---

# Capability Matrix

| Capability | Learn | Teacher Portal | Admin Portal | Studio | Coach | Classroom | Marketplace | Mobile |
|------------|:-----:|:--------------:|:------------:|:------:|:-----:|:----------:|:-----------:|:------:|
| Identity | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Learning | ✅ | ✅ | 🔍 | 🔶 | ✅ | ✅ | ❌ | ✅ |
| AI | ✅ | ✅ | 🔍 | ✅ | ✅ | 🔶 | ❌ | ✅ |
| Content | 🔍 | 🔶 | ⚙️ | ✅ | ❌ | 🔶 | ✅ | 🔍 |
| Commerce | ✅ | 🔍 | ✅ | ❌ | ❌ | ❌ | ✅ | 🔍 |
| Scheduling | 🔶 | ✅ | ⚙️ | ❌ | 🔍 | ✅ | ❌ | 🔶 |
| Notifications | ✅ | ✅ | ✅ | 🔶 | ✅ | ✅ | ✅ | ✅ |
| Analytics | 🔍 | ✅ | ✅ | 🔍 | ✅ | 🔍 | 🔍 | 🔍 |
| Offline | ✅ | 🔶 | ❌ | ❌ | ✅ | 🔶 | ❌ | ✅ |

---

# Product Responsibilities

## Lurexa Learn

Primary purpose:

Deliver asynchronous learning experiences.

Consumes

- Identity
- Learning
- AI
- Commerce
- Offline
- Notifications

Does not own business logic.

---

## Teacher Portal

Primary purpose:

Enable teachers to create, manage, and monitor learning.

Consumes

- Identity
- Learning
- AI
- Scheduling
- Analytics
- Notifications

Owns no platform services.

---

## Admin Portal

Primary purpose:

Platform administration.

Consumes

- Identity
- Commerce
- Analytics
- Content
- Scheduling
- Notifications

Administrative access only.

Business logic remains inside the capabilities.

---

## Studio

Primary purpose:

Content authoring.

Consumes

- Content
- AI
- Identity

Studio publishes content.

Learning delivers content.

---

## Coach

Primary purpose:

Personalized learning assistant.

Consumes

- Learning
- AI
- Analytics
- Notifications
- Offline

Coach never edits course content.

---

## Classroom

Primary purpose:

Live learning experiences.

Consumes

- Identity
- Learning
- Scheduling
- AI
- Notifications

Future capability.

---

## Marketplace

Primary purpose:

Educational commerce.

Consumes

- Commerce
- Content
- Identity
- Notifications

Marketplace never delivers lessons.

---

## Mobile

Primary purpose:

Portable learning experience.

Consumes

- Identity
- Learning
- AI
- Offline
- Notifications

Acts as another client of the platform.

---

# Capability Ownership

## Identity

Owns

- Users
- Organizations
- Roles
- Authentication
- Permissions

No other capability manages user identities.

---

## Learning

Owns

- Courses
- Modules
- Lessons
- Activities
- Assessments
- Progress
- Certificates
- Enrollment

---

## AI

Owns

- Prompt Library
- Tutor
- AI Gateway
- AI Memory
- Feedback Engine
- Recommendations

---

## Content

Owns

- Lesson Builder
- Media Library
- Templates
- Question Banks
- Flashcards

---

## Commerce

Owns

- Products
- Pricing
- Subscriptions
- Billing
- Coupons
- Invoices
- Refunds

---

## Scheduling

Owns

- Calendars
- Availability
- Bookings
- Time Zones
- Events

---

## Notifications

Owns

- Email
- Push
- SMS
- WhatsApp
- In-App Messaging

---

## Analytics

Owns

- Dashboards
- KPIs
- Reports
- Predictions
- Learning Metrics

---

## Offline

Owns

- Sync Engine
- IndexedDB
- Download Manager
- Local Cache
- TensorFlow Lite Runtime

---

# Allowed Dependencies

Products

↓

Capabilities

↓

Shared Infrastructure

↓

Cloud Services

Allowed

---

Forbidden

Products

↓

Firestore

---

Forbidden

Products

↓

Stripe

---

Forbidden

Products

↓

Google Calendar

---

Forbidden

Products

↓

Gemini SDK

Products must always communicate through the corresponding capability.

---

# Feature Routing Guide

Before implementing any feature, determine its owner.

Examples

| Feature | Capability |
|---------|------------|
| Student Login | Identity |
| Course Enrollment | Learning |
| AI Tutor Chat | AI |
| Lesson Generator | Content + AI |
| Subscription Checkout | Commerce |
| Google Calendar Booking | Scheduling |
| Push Notification | Notifications |
| Progress Dashboard | Analytics |
| Offline Downloads | Offline |

If a feature spans multiple capabilities, each capability remains responsible only for its own business rules.

---

# AI Assistant Rules

Every AI assistant must determine the owning capability before generating code.

AI assistants must not:

- Duplicate business logic.
- Bypass capability APIs.
- Move responsibilities between capabilities.
- Add cross-capability dependencies without approval.

If ownership is unclear, request clarification before implementation.

---

# Evolution Policy

Capabilities may expand internally.

Their public interfaces should remain stable.

Applications should require minimal changes when a capability evolves.

Backward compatibility is preferred whenever practical.

---

# Architecture Principle

Products represent user experiences.

Capabilities represent business domains.

Business logic belongs to capabilities.

Applications orchestrate capabilities.

This separation is the foundation of the Lurexa Platform Architecture.
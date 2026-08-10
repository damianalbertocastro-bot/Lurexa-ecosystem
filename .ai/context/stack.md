# Lurexa Technology Stack

Version: 1.0

Status: Approved

---

# Purpose

This document defines the official technology stack for the Lurexa ecosystem.

All AI assistants (Codex, Cursor, Claude, GPT, etc.) must follow these decisions unless explicitly instructed otherwise.

Technology choices are considered architectural decisions.

Do not replace technologies without a documented Architecture Decision Record (ADR).

---

# Engineering Philosophy

Lurexa prioritizes:

- Maintainability over cleverness
- Scalability over shortcuts
- Simplicity over unnecessary abstraction
- Strong typing over flexibility
- Reusable components over duplication
- Developer experience over premature optimization

---

# Runtime

Node.js

Current Version

22 LTS

Package Manager

pnpm

Reason

- Fast
- Efficient disk usage
- Native workspace support
- Excellent Turborepo integration

---

# Monorepo

Tool

Turborepo

Purpose

- Shared packages
- Incremental builds
- Remote caching
- Multiple applications
- Shared tooling

---

# Language

TypeScript

Mode

Strict

Rules

Never use JavaScript.

Never disable strict mode.

Avoid `any`.

Prefer explicit types.

---

# Frontend

Framework

Next.js

Router

App Router

Rendering Strategy

Prefer Server Components.

Use Client Components only when browser APIs or local state are required.

---

# UI

Tailwind CSS

Version

v4

Component Library

shadcn/ui

Accessibility

Radix UI

Icons

Lucide

Animations

Motion (formerly Framer Motion)

Charts

Recharts

---

# Styling Rules

Never hardcode

- Colors
- Spacing
- Radius
- Shadows
- Typography
- Motion

Use

@lurexa/tokens

All styling must originate from the Design Token system.

---

# Forms

React Hook Form

Validation

Zod

Never create custom validation logic if Zod already solves the problem.

---

# Backend

Platform

Firebase

Services

- Authentication
- Firestore
- Storage
- Cloud Functions
- Cloud Messaging
- Hosting
- Analytics

Future additions

- Cloud Run
- Vertex AI integrations

---

# Database

Primary Database

Firestore

Data Access

Applications

↓

SDK

↓

Repositories

↓

Firestore

Applications must never communicate directly with Firestore.

---

# Authentication

Firebase Authentication

Supported Providers

- Email
- Google

Future

- Microsoft
- Apple

Authorization

Role-Based Access Control (RBAC)

Roles

Student

Teacher

Admin

Super Admin

---

# AI Platform

Primary Model

Google Gemini

Architecture

Applications

↓

AI Gateway

↓

Prompt Builder

↓

Gemini

↓

Response Validator

↓

Client

Future Compatibility

OpenAI

Anthropic

Mistral

DeepSeek

The AI Gateway isolates model-specific logic.

---

# Offline Platform

Primary Strategy

Progressive Web App

Storage

IndexedDB

Synchronization

Background Sync

On-device AI

TensorFlow Lite

Goal

Core learning experiences remain functional without an internet connection.

---

# State Management

Priority

1. Server Components

2. URL State

3. TanStack Query

4. React Context

5. Local Component State

Avoid introducing Redux, Zustand, or similar libraries unless justified by documented requirements.

---

# API Layer

Applications never call fetch directly.

Always use

@lurexa/sdk

Example

sdk.course.list()

sdk.lesson.get()

sdk.ai.chat()

sdk.calendar.book()

---

# Payments

Provider

Stripe

Future

Regional payment providers

Invoices

Stripe Billing

Subscriptions

Stripe Billing

---

# Scheduling

Google Calendar API

Future

Microsoft Outlook Calendar

---

# File Storage

Firebase Storage

Supported

Images

Videos

PDFs

Audio

Certificates

---

# Notifications

Firebase Cloud Messaging

Future

Email

SMS

WhatsApp

---

# Search

Phase 1

Firestore indexes

Future

Algolia

or

Meilisearch

---

# Analytics

Google Analytics

Firebase Analytics

Future

PostHog

Business Intelligence

Metabase

---

# Logging

Development

Console

Production

Firebase Logging

Future

Sentry

---

# Testing

Unit Tests

Vitest

Component Testing

Testing Library

E2E

Playwright

Accessibility

axe

---

# Documentation

Markdown

Storybook

Nextra

Architecture Decision Records

ADR

---

# CI/CD

GitHub Actions

Deployment

Vercel

Firebase

Preview Deployments

Enabled

---

# Code Quality

ESLint

Prettier

Husky

lint-staged

Commitlint

TypeScript Strict Mode

---

# Security

Never expose API keys.

Never trust client permissions.

Validate all input.

Use server-side authorization.

Sanitize AI-generated content.

---

# Browser Support

Chrome

Edge

Firefox

Safari

Latest two versions

---

# Mobile Support

Responsive Web

PWA

Future

React Native (if needed)

---

# Performance Targets

Initial Load

< 2 seconds

Lighthouse

90+

Accessibility

100 preferred

CLS

< 0.1

Largest Contentful Paint

< 2.5 seconds

---

# Versioning

Semantic Versioning

Major

Breaking

Minor

Features

Patch

Bug fixes

---

# Decision Policy

No AI assistant may introduce a new framework, dependency, or architectural pattern without:

1. Explaining the tradeoffs.
2. Demonstrating why the current stack is insufficient.
3. Receiving explicit approval.

The approved stack is the default for every implementation.
---

# Dependency Approval Levels

Every dependency introduced into Lurexa must be classified into one of four categories.

## Core Dependencies

Core dependencies define the platform architecture.

Changing them requires an Architecture Decision Record (ADR).

Examples

- Next.js
- React
- TypeScript
- Turborepo
- pnpm
- Firebase
- Tailwind CSS
- shadcn/ui
- Radix UI

---

## Preferred Dependencies

These are the default choices for solving common problems.

Alternatives may be used only when there is a clear technical advantage.

Examples

- React Hook Form
- Zod
- Motion
- Recharts
- Lucide React
- TanStack Query

---

## Optional Dependencies

These may be added for isolated features when they provide meaningful value.

Examples

- date-fns
- Fuse.js
- react-pdf
- react-dropzone
- Embla Carousel

Every Optional dependency should include a brief justification in the pull request.

---

## Experimental Dependencies

Experimental libraries require explicit approval before installation.

Examples

- New AI SDKs
- Beta frameworks
- Release candidates
- Unstable packages
- Packages with fewer than one year of maintenance history

---

# Dependency Evaluation Checklist

Before adding any package, answer the following questions:

- Does an existing dependency already solve this problem?
- Is the package actively maintained?
- Is it compatible with the current stack?
- Does it increase bundle size significantly?
- Is it tree-shakeable?
- Is it well documented?
- Does it have TypeScript support?
- Is the license compatible with commercial software?
- Can the same result be achieved with native APIs?

If the answer to the last question is "yes", prefer the native solution.

---

# AI Assistant Rule

AI assistants must never introduce a new dependency without first explaining:

1. Why the dependency is needed.
2. Why existing project dependencies are insufficient.
3. The expected impact on bundle size and maintenance.
4. Any viable alternatives.

The project maintainer must explicitly approve all new dependencies before they are added.

---

# Browser Support

Lurexa is a Progressive Web Application (PWA) and must provide a consistent experience across modern browsers.

## Supported Browsers

Desktop

- Google Chrome (latest 2 versions)
- Microsoft Edge (latest 2 versions)
- Mozilla Firefox (latest 2 versions)
- Safari (latest 2 versions)

Mobile

- Chrome for Android
- Safari on iOS
- Samsung Internet (latest stable)

Internet Explorer is not supported.

---

# Device Support

Primary Target

- Desktop
- Laptop
- Tablet
- Mobile

Minimum Supported Screen Width

320px

Maximum

No limit

Design should remain responsive on ultrawide monitors.

---

# Performance Budgets

Performance is considered a feature.

Every Pull Request should preserve these targets.

## Lighthouse

Performance

≥ 90

Accessibility

100 preferred

Best Practices

≥ 95

SEO

≥ 90

---

## Core Web Vitals

Largest Contentful Paint (LCP)

< 2.5 s

Interaction to Next Paint (INP)

< 200 ms

Cumulative Layout Shift (CLS)

< 0.10

---

## JavaScript

Avoid unnecessary client-side JavaScript.

Prefer Server Components whenever possible.

---

## Images

Use

- next/image
- AVIF
- WebP

Lazy-load all non-critical images.

---

## Fonts

Use variable fonts whenever available.

Limit the number of font families.

Preload primary fonts.

---

# Security Standards

Security is part of the architecture.

Never treat it as an afterthought.

## Authentication

Use Firebase Authentication.

Never store passwords.

Never implement custom authentication.

---

## Authorization

Always validate permissions on the server.

Never trust client-side role checks.

---

## Secrets

Secrets must never be committed to Git.

Use

- GitHub Secrets
- Firebase Secrets
- Environment Variables

---

## Input Validation

Validate all external input.

Use Zod whenever possible.

---

## AI Security

AI-generated content must be treated as untrusted input.

Validate

- Markdown
- HTML
- Uploaded files
- Generated code
- Generated links

---

## Dependencies

Run dependency updates regularly.

Review security advisories before upgrading.

---

# Accessibility Standards

Accessibility is a release requirement.

Not a future enhancement.

## Compliance

Target

WCAG 2.2 AA

---

## Every Component Must

- Support keyboard navigation
- Have visible focus indicators
- Use semantic HTML
- Provide ARIA labels when necessary
- Meet contrast requirements
- Support screen readers

---

## Forms

Every input requires

- Label
- Validation message
- Error state
- Success state

---

## Motion

Respect

prefers-reduced-motion

---

# Coding Standards

## General

Prefer

- Small functions
- Small components
- Explicit naming
- Pure functions

Avoid

- Deep nesting
- Long files
- Side effects
- Duplicate logic

---

## TypeScript

Never

- Use any
- Disable strict mode
- Ignore compiler warnings

Prefer

- Interfaces
- Utility Types
- Type inference

---

## React

Prefer

Server Components

Then

Client Components only when required.

Avoid unnecessary state.

---

## Folder Naming

Folders

kebab-case

Files

PascalCase for components

camelCase for utilities

---

## Component Size

Target

< 250 lines

If a component grows significantly larger, consider extracting subcomponents.

---

# Versioning Policy

Semantic Versioning

## Major

Breaking API changes

## Minor

Backward-compatible features

## Patch

Bug fixes

---

## Internal Packages

Every package under

packages/

must maintain independent versions.

Examples

- @lurexa/ui
- @lurexa/sdk
- @lurexa/tokens

---

# Upgrade Strategy

Dependencies should not be upgraded automatically.

Upgrade cadence

## Critical Security Updates

Immediately

## Minor Updates

Monthly

## Major Updates

After evaluation and testing

Every upgrade requires

- Successful build
- Passing tests
- Storybook verification
- Manual QA

---

# Deprecation Policy

Deprecated APIs should remain available for at least one release cycle.

Every deprecated feature must include

- Documentation
- Migration guide
- Planned removal version

Do not remove public APIs without notice.

---

# Architecture Decision Records (ADR)

Architectural changes must be documented.

Create records in

docs/architecture/adr/

Naming convention

ADR-0001-title.md

Examples

ADR-0001-use-turborepo.md

ADR-0002-adopt-firebase.md

ADR-0003-ai-gateway.md

Each ADR should contain

- Context
- Problem
- Decision
- Alternatives
- Consequences
- Status

---

# Decision Governance

AI assistants may recommend architectural changes.

They may not implement architectural changes automatically.

Every architectural modification requires explicit approval from the project owner.

When proposing changes, include

- Motivation
- Tradeoffs
- Benefits
- Risks
- Migration strategy

---

# Engineering Principles

Every contribution to Lurexa should satisfy the following principles.

1. Build for reuse before convenience.

2. Prefer composition over duplication.

3. Optimize for readability before optimization.

4. Security and accessibility are non-negotiable.

5. Every feature should be testable.

6. Every component should be documented.

7. Every public API should be typed.

8. Offline capability is a first-class citizen.

9. AI should enhance the user experience, never block it.

10. Every technical decision should make the next feature easier to build.
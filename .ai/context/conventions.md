# Lurexa Engineering Conventions

Version: 1.0

Status: Approved

---

# Purpose

This document defines the coding, naming, organization, and architectural conventions used throughout the Lurexa ecosystem.

All contributors, including AI assistants, must follow these conventions.

Consistency is more valuable than individual preference.

---

# General Philosophy

Write code that another developer can understand within minutes.

Prioritize:

- Readability
- Consistency
- Simplicity
- Maintainability
- Reusability

Avoid clever solutions that reduce clarity.

---

# Repository Structure

```
apps/
packages/
services/
firebase/
docs/
scripts/
```

Do not create new top-level directories without approval.

---

# Applications

Each application follows this structure:

```
app/
components/
features/
hooks/
lib/
providers/
services/
styles/
types/
utils/
public/
```

Avoid creating deeply nested folder structures.

---

# Feature Organization

Large features should be self-contained.

Example

```
features/

authentication/
    components/
    hooks/
    services/
    types/

courses/
    components/
    hooks/
    services/
    types/

lessons/
    components/
    hooks/
    services/
    types/
```

Business logic belongs inside features.

Reusable logic belongs in packages.

---

# Package Structure

Every shared package should follow:

```
src/
components/
hooks/
utils/
types/
constants/
tests/

README.md
package.json
tsconfig.json
```

---

# File Naming

Folders

kebab-case

Example

```
course-builder
student-dashboard
```

---

React Components

PascalCase

```
Button.tsx

LessonCard.tsx

CourseProgress.tsx
```

---

Hooks

camelCase

```
useLesson.ts

useCourse.ts

useOffline.ts
```

---

Utilities

camelCase

```
formatDate.ts

calculateScore.ts

slugify.ts
```

---

Types

PascalCase

```
Course.ts

Student.ts

Lesson.ts
```

---

Constants

UPPER_SNAKE_CASE

```
DEFAULT_PAGE_SIZE

MAX_UPLOAD_SIZE
```

---

# Component Rules

Components should have a single responsibility.

Avoid components larger than 250 lines.

If a component becomes difficult to understand:

Split it.

---

Every component should include

- Props interface
- Documentation
- Loading state
- Error state (when applicable)
- Empty state (when applicable)

---

# TypeScript

Always use

Strict Mode

Never use

```
any
```

Prefer

```
unknown
```

when the type is not known.

Prefer explicit interfaces for exported APIs.

---

Interfaces

Use for

- Props
- Public APIs
- Domain models

Types

Use for

- Utility types
- Unions
- Mapped types

---

# Imports

Import order

1. External libraries

2. Internal packages

3. Local modules

4. Relative imports

Example

```ts
import { Button } from "@lurexa/ui";

import { Course } from "@lurexa/types";

import { useLesson } from "@/hooks/useLesson";

import "./styles.css";
```

---

Avoid long relative paths.

Bad

```
../../../../utils
```

Good

```
@/utils
```

---

# Functions

Prefer

Small functions.

Target

20–40 lines.

If a function becomes difficult to explain,

split it.

---

Function names should describe actions.

Good

```
calculateProgress()

validateLesson()

createEnrollment()
```

Bad

```
process()

handle()

run()
```

---

# Components

Prefer composition.

Avoid inheritance.

Keep presentation separate from business logic.

UI Components

↓

Business Logic

↓

Data Layer

---

# State Management

Priority

Server Components

↓

URL State

↓

TanStack Query

↓

React Context

↓

Local State

Avoid unnecessary global state.

---

# Styling

Use Tailwind CSS.

Never hardcode

- Colors
- Spacing
- Radius
- Shadows

Use Design Tokens.

---

Bad

```
padding: 20px;
```

Good

```
padding: var(--space-5);
```

---

# Forms

Always use

React Hook Form

+

Zod

Never write custom validation if schema validation already exists.

---

# Error Handling

Never ignore errors.

Every asynchronous operation should

- Handle loading
- Handle failure
- Provide useful feedback
- Log unexpected errors

---

# Logging

Development

Console

Production

Centralized logging

Never leave debugging statements in production code.

---

# Comments

Write code that rarely requires comments.

Use comments only for

- Complex business rules
- Non-obvious decisions
- External limitations

Never explain obvious code.

---

# Environment Variables

Never hardcode

- API keys
- URLs
- Secrets

Always use

Environment variables.

---

# Git Conventions

Branch Names

```
feature/authentication

feature/payments

fix/calendar

docs/prd

refactor/ui

test/offline
```

---

Commit Messages

Use Conventional Commits.

Examples

```
feat(auth): add Google login

fix(ui): resolve dark mode bug

docs(prd): update payment flow

refactor(database): simplify repositories

test(ai): add tutor integration tests
```

---

# Pull Requests

Every Pull Request should include

Purpose

Summary

Screenshots (if UI)

Testing

Known limitations

Future improvements

---

# Documentation

Every public package requires

README

Every exported component requires

Example usage

Public APIs must be documented.

---

# Testing

Every feature should include

Unit Tests

Integration Tests when applicable

End-to-End Tests for critical flows

Tests should describe behavior,

not implementation.

---

# Accessibility

Every interactive element must

Support keyboard navigation

Have visible focus states

Include accessible labels

Meet contrast requirements

Accessibility is mandatory.

---

# Performance

Avoid unnecessary re-renders.

Prefer memoization only when profiling demonstrates benefit.

Optimize images.

Lazy-load large modules.

---

# Security

Validate all input.

Never trust client data.

Escape untrusted content.

Protect secrets.

Use least-privilege principles.

---

# AI Assistant Expectations

Before generating code:

- Search for existing components.
- Search for existing utilities.
- Search for existing hooks.
- Reuse before creating.

When creating something new:

- Explain why it cannot reuse existing code.
- Keep it modular.
- Document it.
- Add tests when appropriate.

Never duplicate functionality.

---

# Definition of Done

A task is complete only when:

✓ TypeScript passes

✓ ESLint passes

✓ Build succeeds

✓ Tests pass

✓ Documentation updated

✓ Uses Design Tokens

✓ Uses shared UI components

✓ No duplicated logic

✓ Accessibility verified

✓ Ready for production

---

# Final Principle

Every contribution should leave the codebase cleaner than it was before.

If you touch a file, improve it when reasonable.

Small continuous improvements are preferred over large future rewrites.
# Coding Standards

Version: 1.0

Status: Approved

Owner: Engineering

---

# Purpose

This document defines the coding standards for every repository within the Lurexa ecosystem.

These standards apply equally to:

- Human developers
- AI coding assistants
- External contributors

Consistency is more important than personal preference.

---

# Core Principles

Write code that is:

- Readable
- Predictable
- Testable
- Maintainable
- Reusable

Future maintainers should understand the code with minimal explanation.

---

# General Rules

Always prefer:

- Small files
- Small functions
- Explicit names
- Composition
- Immutable data
- Strong typing

Avoid:

- Deep nesting
- Duplicate logic
- Hidden side effects
- Premature optimization
- Magic values

---

# File Length

Recommended maximums

Component

250 lines

Hook

150 lines

Utility

100 lines

Configuration

100 lines

If a file grows beyond these recommendations, consider splitting it.

---

# Function Guidelines

Functions should perform one responsibility.

Preferred size

20–40 lines

Maximum

60 lines unless strongly justified.

Function names should describe behavior.

Good

calculateCourseProgress()

Bad

handleData()

---

# Naming

Variables

camelCase

Components

PascalCase

Hooks

useSomething

Constants

UPPER_SNAKE_CASE

Interfaces

PascalCase

Enums

PascalCase

Folders

kebab-case

---

# React Guidelines

Prefer:

Server Components

Use Client Components only when browser APIs or local state are required.

Keep business logic outside UI components.

---

# TypeScript

Strict Mode is mandatory.

Forbidden

- any
- @ts-ignore
- disabled compiler checks

Prefer:

- unknown
- utility types
- discriminated unions

---

# Comments

Comments explain "why", not "what".

Bad

// increment i

Good

// Retry because Firebase transactions may conflict under heavy concurrency.

---

# Imports

Order

1. External packages

2. Internal packages

3. Aliased imports

4. Relative imports

Never use long relative paths.

---

# Logging

Development

Console

Production

Centralized logging

Debug statements must not remain in production code.

---

# Error Handling

Every async operation must handle:

- Loading
- Success
- Failure
- Retry (when applicable)

Never silently swallow exceptions.

---

# Documentation

Every exported function should have a clear purpose.

Every shared package requires a README.

Every public component requires usage examples.

---

# Guiding Principle

Readable code scales better than clever code.
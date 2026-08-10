# Code Review Guidelines

**Version:** 1.0  
**Status:** Approved  
**Owner:** Engineering Team  
**Applies to:** All repositories within the Lurexa organization

---

# Purpose

Code reviews exist to improve software quality, maintain consistency, share knowledge, reduce defects, and ensure that every change aligns with the long-term vision of the Lurexa platform.

Reviews are not intended to criticize developers.

They are intended to improve the product.

---

# Core Principles

Every review should prioritize:

1. Correctness
2. Simplicity
3. Readability
4. Maintainability
5. Security
6. Performance
7. Accessibility
8. Consistency
9. User Experience

Whenever trade-offs exist, reviewers should favor long-term maintainability over short-term convenience.

---

# Review Philosophy

A Pull Request is considered a design discussion, not merely a code submission.

Reviewers should ask:

- Is this the simplest solution?
- Will another engineer understand this in six months?
- Does this follow our architecture?
- Does this introduce unnecessary complexity?
- Does it improve the product?

---

# Reviewer Responsibilities

Reviewers are responsible for ensuring:

- Architecture is respected.
- Business logic is correct.
- Edge cases are handled.
- Naming is clear.
- Code follows project conventions.
- Documentation is updated.
- Tests exist when required.
- No security risks are introduced.
- No unnecessary complexity is added.

A reviewer is accountable for every approval they give.

---

# Author Responsibilities

Before requesting review, the author should verify that:

- All tests pass.
- Build succeeds.
- Lint passes.
- Type checking passes.
- Documentation is updated.
- Feature has been manually tested.
- No debugging code remains.
- No commented-out code remains.
- No secrets are committed.

---

# Review Checklist

## Functionality

- Does the feature work?
- Are requirements satisfied?
- Are edge cases handled?
- Is error handling appropriate?
- Does the implementation match the intended behavior?

---

## Architecture

Verify that the implementation:

- Respects folder structure.
- Uses existing abstractions.
- Does not duplicate logic.
- Does not violate layering.
- Avoids unnecessary coupling.

Questions:

- Can this reuse an existing service?
- Should this belong elsewhere?
- Is this introducing technical debt?

---

## Code Quality

Review for:

- Readability
- Simplicity
- Small functions
- Clear naming
- Low complexity
- Minimal nesting
- Consistent formatting

Avoid:

- Large functions
- Magic numbers
- Hidden side effects
- Unclear variables
- Duplicate logic

---

## Naming

Names should clearly describe intent.

Prefer:

```ts
calculateFinalScore()

createStudent()

isAuthenticated
```

Avoid:

```ts
calc()

doStuff()

value2

temp
```

Names should explain *why* something exists, not merely *what* it is.

---

# TypeScript Standards

Require:

- Explicit types where useful
- Strong typing
- No unnecessary `any`
- Prefer interfaces for object contracts
- Use enums sparingly
- Prefer discriminated unions when appropriate

Avoid:

```ts
any

unknown casting

type assertions without justification
```

---

# React Standards

Verify:

- Components have a single responsibility.
- Hooks are used correctly.
- State is minimal.
- Effects are necessary.
- Memoization is justified.
- Components remain reusable.

Watch for:

- Prop drilling
- Large components
- Excessive state
- Business logic inside UI

---

# Performance Review

Check for:

- Unnecessary renders
- Expensive computations
- Missing memoization
- Duplicate API calls
- Large bundle additions

Questions:

- Can this be lazy loaded?
- Can this be cached?
- Is this efficient enough?

---

# Security Review

Always verify:

- Authentication
- Authorization
- Input validation
- Secret management
- API permissions
- Data exposure

Never approve:

- Hardcoded credentials
- Exposed API keys
- Unsafe queries
- Missing authorization
- Trusting client input

---

# Accessibility Review

Ensure:

- Semantic HTML
- Keyboard navigation
- Focus management
- Accessible labels
- Color contrast compliance
- Screen reader compatibility

Accessibility is required—not optional.

---

# UI Review

Verify:

- Uses approved design system components.
- Uses design tokens.
- Consistent spacing.
- Responsive layout.
- Visual consistency.

Do not introduce custom styling when an existing component already solves the problem.

---

# API Review

Review:

- Endpoint naming
- Validation
- Error responses
- Status codes
- Pagination
- Versioning

APIs should remain predictable and consistent.

---

# Database Review

Verify:

- Queries are optimized.
- Indexes exist when necessary.
- No unnecessary reads.
- No unnecessary writes.
- Data integrity is preserved.

---

# AI Feature Review

For AI-related features, verify:

- Prompt quality
- Prompt versioning
- Prompt safety
- Deterministic behavior where required
- Hallucination mitigation
- Error fallback
- Token efficiency

Never hardcode prompts inside business logic.

Prompts should remain versioned and maintainable.

---

# Documentation Review

Every feature should update documentation when applicable.

Examples:

- README
- Architecture docs
- API documentation
- Environment variables
- User guides

Code without documentation becomes technical debt.

---

# Testing Review

Verify appropriate test coverage:

## Unit Tests

Business logic

Utilities

Services

## Integration Tests

API behavior

Database interaction

Authentication

## End-to-End Tests

Critical user journeys

---

# Comment Classification

Use comments consistently.

## Blocking

Must be fixed before merge.

Examples:

- Security issue
- Broken functionality
- Incorrect architecture
- Missing tests
- Critical bug

---

## Required

Should be fixed before merge.

Examples:

- Readability
- Missing validation
- Naming
- Documentation

---

## Suggestion

Optional improvement.

Examples:

- Refactoring
- Cleaner implementation
- Better abstraction

---

## Question

Clarification only.

No change required.

---

# Approval Rules

A Pull Request may be approved only if:

- Requirements are satisfied.
- Review checklist passes.
- Tests pass.
- CI passes.
- Documentation is updated.
- No blocking comments remain.

---

# Merge Rules

Never merge if:

- CI is failing.
- Merge conflicts exist.
- Security concerns remain.
- Architecture concerns remain unresolved.
- Requested changes have not been addressed.

---

# Review Etiquette

Reviews should be:

- Respectful
- Specific
- Educational
- Objective

Focus on improving the code—not the author.

Prefer:

> "This function could be simplified by extracting the validation logic."

Avoid:

> "This code is bad."

---

# Continuous Improvement

The review process should evolve over time.

The engineering team should periodically evaluate:

- Review quality
- Common review findings
- Recurring defects
- Review duration
- Knowledge-sharing effectiveness

Lessons learned should be incorporated into future versions of this document.

---

# Success Metrics

A healthy review culture results in:

- Lower defect rates
- Faster onboarding
- Consistent architecture
- Reduced technical debt
- Better collaboration
- Higher code quality
- Stable releases

---

# Related Documents

- Pull Request Checklist.md
- Testing Strategy.md
- Development Constitution.md
- Engineering Principles.md
- Monorepo Standards.md
- AI Development Guidelines.md

---

**Document Owner:** Engineering Team

**Review Cycle:** Every 6 months

**Status:** Active
# Code Review Guidelines

Version: 1.0

Status: Approved

Owner: Engineering

---

# Purpose

This document defines the standards and expectations for reviewing code within the Lurexa ecosystem.

Code review exists to improve:

- Software quality
- Architecture consistency
- Security
- Maintainability
- Knowledge sharing

The goal of review is not to find mistakes.

The goal is to build better software together.

---

# Review Philosophy

A good code review is:

- Technical
- Respectful
- Constructive
- Specific
- Focused on improvement

Reviewers should evaluate the code, not the person who wrote it.

---

# Reviewer Responsibilities

A reviewer should verify:

- The solution solves the intended problem.
- The implementation follows Lurexa architecture.
- The code is maintainable.
- The change does not introduce unnecessary complexity.
- Security and performance risks are considered.
- Tests adequately cover the behavior.

---

# What Reviewers Should NOT Do

Avoid:

- Personal opinions without technical reasoning.
- Requesting changes only because of personal preference.
- Rewriting the author's code without explanation.
- Blocking small improvements while ignoring major issues.
- Reviewing style when automated tools already handle it.

Focus human review on decisions, not formatting.

---

# Review Priority Levels

Not all comments have equal importance.

Use these categories:

---

## Blocker

Requires resolution before merging.

Examples:

- Security vulnerability
- Data corruption risk
- Broken architecture
- Incorrect business logic
- Production-breaking issue

Format:

```
BLOCKER:

This should be changed before merging because...
```

---

## Major

Should be addressed before merging.

Examples:

- Poor abstraction
- Missing error handling
- Significant performance issue
- Missing important tests

Format:

```
MAJOR:

Consider changing this because...
```

---

## Minor

Improvement suggestion.

Examples:

- Naming improvement
- Simplification
- Better readability

Format:

```
MINOR:

Optional improvement:
```

---

## Question

Used when clarification is needed.

Format:

```
QUESTION:

Could you explain the reasoning behind this approach?
```

---

# Review Areas

## 1. Correctness

Verify:

- Does the feature work as intended?
- Are edge cases handled?
- Are errors handled correctly?
- Are requirements satisfied?

---

## 2. Architecture

Check:

- Correct capability ownership
- Dependency rules followed
- No application bypasses capabilities
- No business logic inside UI components
- Existing patterns reused

Questions:

- Does this belong in this capability?
- Could another product reuse this?
- Does this create unnecessary coupling?

---

## 3. Code Quality

Review:

- Naming clarity
- Function size
- Component complexity
- Duplication
- Readability

Prefer:

Clear code over clever code.

---

## 4. TypeScript

Verify:

- Strict typing used
- No unnecessary `any`
- Types are meaningful
- Public APIs are typed

Avoid:

```ts
any
```

Prefer:

```ts
unknown
```

with validation.

---

## 5. Testing

Review:

- Are important behaviors tested?
- Are edge cases covered?
- Are tests readable?
- Do tests verify behavior instead of implementation?

Good:

```text
User can complete lesson and progress updates.
```

Bad:

```text
Function X was called three times.
```

---

## 6. Security

Check:

- Authentication
- Authorization
- Input validation
- Data exposure
- Secret handling

Ask:

"What happens if a malicious user controls this input?"

---

## 7. Performance

Review:

Potential issues:

- Excessive database queries
- Large bundles
- Unnecessary re-renders
- Missing caching
- Expensive AI calls

Consider:

Will this still work with 100,000 users?

---

## 8. Accessibility

For UI changes:

Verify:

- Keyboard navigation
- Focus states
- Semantic HTML
- Screen reader support
- Color contrast

Accessibility is part of correctness.

---

# Frontend Review Guidelines

Reviewers should verify:

## Components

- Uses existing Lurexa UI components when possible.
- Uses design tokens.
- Has loading states.
- Has error states.
- Has empty states.

---

## State Management

Ask:

- Is state necessary?
- Could server components solve this?
- Is data fetching handled correctly?

---

## Responsive Design

Verify:

- Mobile layouts
- Tablet layouts
- Desktop layouts

---

# Backend Review Guidelines

Verify:

- Business logic is inside capabilities.
- Data ownership is respected.
- APIs are clearly defined.
- Validation exists.
- Errors are meaningful.

---

# Database Review Guidelines

Check:

- Correct ownership
- Query efficiency
- Index requirements
- Security rules
- Migration strategy

Never allow applications to directly access databases.

---

# AI Feature Review Guidelines

For AI-related changes, verify:

## Prompt Design

- Purpose is documented.
- Expected behavior is clear.
- Edge cases considered.

---

## Safety

Check:

- Hallucination handling
- Sensitive information exposure
- Output validation
- User trust

---

## Cost

Consider:

- Token usage
- Model selection
- Caching opportunities
- Frequency limits

---

# Review Comments Guidelines

Good comment:

```
This query may create performance issues because it loads all lessons.
Could we paginate this data through the repository layer?
```

Poor comment:

```
This is wrong.
```

---

# Approval Standards

A reviewer approves when:

- The implementation is correct.
- The architecture is respected.
- Risks are understood.
- The code is maintainable.

Approval does not mean:

"The code is perfect."

It means:

"The code is ready to become part of the product."

---

# AI-Assisted Code Review

AI tools may assist with:

- Finding bugs
- Suggesting improvements
- Checking patterns
- Reviewing tests

However:

AI suggestions require human judgment.

AI-generated review comments should not automatically block changes.

---

# Review Checklist

Before approving:

- [ ] Problem solved correctly
- [ ] Architecture respected
- [ ] No unnecessary dependencies
- [ ] Tests included
- [ ] Security reviewed
- [ ] Performance considered
- [ ] Accessibility considered
- [ ] Documentation updated
- [ ] Code is understandable

---

# Guiding Principle

The purpose of code review is not to protect the existing codebase.

It is to protect the future of the codebase.

Every review should help Lurexa become easier to build, easier to maintain, and easier to trust.
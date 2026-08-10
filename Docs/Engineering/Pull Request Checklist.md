# Pull Request Checklist

Version: 1.0

Status: Approved

Owner: Engineering

---

# Purpose

This document defines the minimum requirements for every Pull Request (PR) submitted to the Lurexa ecosystem.

A Pull Request is not only a code change.

It is a communication tool that explains:

- What changed
- Why it changed
- How it was tested
- What impact it has on the ecosystem

Every PR should make the codebase better.

---

# Pull Request Requirements

Every Pull Request must include:

- Clear title
- Description of the change
- Reason for the change
- Testing information
- Screenshots or recordings for UI changes
- Known limitations
- Related issues or tasks

---

# Pull Request Title Format

Lurexa uses Conventional Commits.

Format:

```
type(scope): description
```

Examples:

```
feat(auth): add Google authentication

feat(learning): create course enrollment flow

fix(ui): resolve mobile navigation issue

docs(architecture): update capability model

refactor(ai): simplify prompt pipeline

test(offline): add sync engine tests
```

---

# Pull Request Types

## Feature

New functionality.

Example:

```
feat(course): add lesson progress tracking
```

---

## Bug Fix

Fix existing behavior.

Example:

```
fix(player): resolve video loading issue
```

---

## Refactor

Improve code without changing behavior.

Example:

```
refactor(api): simplify repository pattern
```

---

## Documentation

Documentation-only changes.

Example:

```
docs(engineering): add release strategy
```

---

## Testing

Adding or improving tests.

Example:

```
test(ai): add tutor response validation
```

---

# Before Creating a Pull Request

The author must verify:

## Code Quality

- [ ] Code follows Lurexa coding standards
- [ ] No unnecessary duplication
- [ ] Naming conventions followed
- [ ] No debugging code remains

---

## Architecture

- [ ] Correct capability owns the functionality
- [ ] No forbidden dependencies introduced
- [ ] Existing architecture respected
- [ ] ADR created if architecture changed

---

## Testing

- [ ] New functionality has tests
- [ ] Existing tests pass
- [ ] Edge cases considered

---

## UI Changes

For frontend changes:

- [ ] Responsive behavior verified
- [ ] Accessibility checked
- [ ] Design tokens used
- [ ] Existing components reused when possible
- [ ] Storybook updated if applicable

---

## Security

- [ ] No secrets added
- [ ] Input validation included
- [ ] Permissions verified
- [ ] User data protected

---

# Pull Request Description Template

Every PR should follow this structure:

```md
## Summary

Describe what changed.

---

## Motivation

Why was this change necessary?

---

## Changes

List the main implementation details.

- Change one
- Change two
- Change three

---

## Testing

Explain how this was tested.

Examples:

- Unit tests
- Integration tests
- Manual testing

---

## Screenshots

Required for UI changes.

---

## Risks

Describe possible issues.

---

## Future Improvements

Optional follow-up work.

---
```

---

# Review Requirements

Every PR requires review based on:

## Correctness

Does the implementation solve the intended problem?

---

## Architecture

Does the change respect:

- Capability boundaries
- Dependency rules
- System architecture

---

## Maintainability

Will future developers understand this code?

---

## Security

Could this introduce vulnerabilities?

---

## Performance

Could this negatively affect:

- Loading speed
- Database usage
- AI costs
- User experience

---

## Accessibility

Can all users interact with this feature?

---

# AI-Generated Code Requirements

AI-assisted contributions must receive the same review standard as human-written code.

Before merging AI-generated code:

- The developer understands the implementation.
- The architecture is respected.
- Tests exist where appropriate.
- Security implications are reviewed.

AI should accelerate development, not bypass engineering responsibility.

---

# Large Pull Requests

Avoid large PRs whenever possible.

Preferred:

Small, focused changes.

Avoid:

- Multiple unrelated features
- Large refactors mixed with features
- Architecture changes without discussion

If a PR is large, explain why.

---

# Review Approval Rules

A Pull Request can merge when:

- Required reviews completed
- CI passes
- Tests pass
- Conflicts resolved
- Documentation updated when needed

---

# Merge Policy

Preferred strategy:

Squash merge

Reason:

- Cleaner history
- Easier rollback
- Better release tracking

---

# After Merge

The author should verify:

- Deployment succeeded
- Feature works in production environment
- Monitoring shows expected behavior

---

# Guiding Principle

A Pull Request should leave three things better:

1. The product
2. The codebase
3. The understanding of the system

A successful PR is not just code that works.

It is a contribution that improves Lurexa.
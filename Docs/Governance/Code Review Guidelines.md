# Lurexa Code Review Guidelines

**Version:** 1.0 (merged)
**Status:** Draft — supersedes prior Lurexa reviewer doc and generic Engineering Team doc
**Applies to:** All repositories within the Lurexa organization
**Reviewers:** Human developers and AI collaborators (Cursor, code-review personas)

---

## Core Philosophy

Code reviews at Lurexa are not just about finding bugs; they are about maintaining architectural consistency, ensuring educational accessibility, and keeping the monorepo clean. A Pull Request is a design discussion, not merely a code submission. Reviews improve the product — they are not a critique of the developer.

---

## Pre-Review Requirements (Author, before opening a PR)

- [ ] **Type Safety:** `pnpm check-types` from root — 0 errors.
- [ ] **Linting:** `pnpm lint` — no warnings or errors.
- [ ] **Build:** `pnpm build` — all workspace packages build successfully.
- [ ] **Scope:** PR addresses a single concern (not "Add auth and redesign dashboard").
- [ ] **Tests:** New features include relevant tests — see Testing Standards below.
- [ ] No debugging code, no commented-out code, no secrets committed.
- [ ] Documentation updated where applicable (README, `.ai/personas`, env vars, API docs).

---

## Reviewer Checklist

### 1. Architecture & Monorepo Integrity
- Are shared utilities placed in `@lurexa/utils` instead of duplicated in apps?
- Are shared UI components added to `@lurexa/ui`?
- Does the code break the dependency graph? (apps → packages, not packages → apps)
- Can this reuse an existing service instead of introducing a new abstraction?
- Is this introducing technical debt disproportionate to the feature's value?

### 2. Type Strictness
- Any use of `any`? Reject — require explicit types.
- Do database/Firestore schemas match `@lurexa/types` exactly?
- Type assertions require inline justification or they're a blocking comment.

### 3. Code Quality
- Small functions, low nesting, clear naming (`calculateFinalScore`, not `calc()` or `temp`).
- No magic numbers, no hidden side effects, no duplicate logic.
- Names explain *why* something exists, not just *what* it is.

### 4. React Standards
- Single-responsibility components, minimal state, justified effects and memoization.
- Watch for prop drilling, oversized components, business logic embedded in UI.

### 5. Educational Platform Standards (A11y & UX)
- Full accessibility: ARIA labels, keyboard navigation, focus management, color contrast.
- Responsive for students on low-end mobile devices.
- Graceful loading states, especially for slow AI generation requests.

### 6. Security & Firebase
- Firestore queries securely filtered by `organizationId` and `userId` — no exceptions.
- No hardcoded API keys or secrets — reject immediately if `.env` values are committed.
- Client input is never trusted without server-side validation.

### 7. Performance
- Unnecessary renders, missing memoization, duplicate API calls, large bundle additions.
- Can this be lazy-loaded or cached?

### 8. API & Database Review
- Endpoint naming, validation, error responses, status codes, pagination, versioning are consistent.
- Queries are optimized; indexes exist where needed; no unnecessary reads/writes.

---

## AI Feature Review — Deferred (Phase 2)

*Not part of the core Reviewer Checklist. No `@lurexa/prompts` (or equivalent versioned prompt package) exists yet, and building one is out of scope while Phase 1 (repo stabilization: lint/typecheck/build/docs) is the P0. These items are guidance, not gates — nothing here blocks or requires changes on a PR today.*

- Prompts should eventually live outside business logic, in a versioned, diffable location — not enforced until that location exists.
- Deterministic behavior for grading/scoring logic is worth flagging informally if you notice non-determinism, but isn't a review requirement yet.
- Hallucination mitigation and error fallback for user-facing AI output — same: flag, don't block.
- **Trigger to promote this section to the core checklist:** either `@lurexa/prompts` gets built, or AI feature work exceeds ~2–3 hardcoded prompts, whichever comes first. At that point delete this section and reinstate AI Feature Review as item 9 in the Reviewer Checklist, with prompt-location violations moved to the Blocking row of the Comment Classification table.

---

## Testing Standards

- **Unit tests (Vitest):** business logic, utilities, services.
- **Integration tests:** API behavior, database interaction, authentication.
- **E2E tests (Playwright):** critical user journeys (auth, course flow, AI tutor interaction).

---

## Comment Classification
*(New — imported from generic doc; Lurexa-specific doc had no severity taxonomy, which made review threads ambiguous.)*

| Level | Meaning | Examples |
|---|---|---|
| **Blocking** | Must be fixed before merge | Security issue, broken functionality, incorrect architecture, missing tests, `any` usage, exposed secret/API key |
| **Required** | Should be fixed before merge | Readability, missing validation, naming, documentation |
| **Suggestion** | Optional improvement | Refactoring, cleaner implementation, better abstraction |
| **Question** | Clarification only | No change required |

---

## Approval & Merge Rules
*(New — the original stack-specific doc had a pre-review checklist but no explicit merge gate.)*

A PR may be **approved** only if:
- Pre-review requirements are all met.
- Reviewer checklist passes with no unresolved Blocking comments.
- CI is green.
- Documentation is updated.

**Never merge if:**
- CI is failing.
- Merge conflicts exist.
- Security concerns remain (Firestore scoping, exposed keys, unvalidated input).
- Architecture concerns are unresolved (dependency graph violations, duplicated shared logic).

*(No merge gate on prompt location — see "AI Feature Review — Deferred" section above.)*

---

## Review Etiquette

Prefer: *"This function could be simplified by extracting the validation logic."*
Avoid: *"This code is bad."*

Focus on improving the code, not the author. This applies equally when the "author" is an AI collaborator — critique the diff, not the model.

---

## Related Documents

- Monorepo Standards.md
- AI Development Guidelines.md
- Development Constitution.md
- `.ai/personas/` (CEO, CPO, curriculum, technical writer roles)

---

**Review Cycle:** Every 6 months, or on major architecture decisions (e.g., Firebase → alternative, Turborepo restructure).
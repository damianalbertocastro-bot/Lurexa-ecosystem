# Lurexa Agent Operating System

This directory defines repository-native specialist roles for Codex and other capable coding agents. These files do not grant tools by themselves; the execution environment must already have repository and command access.

## Operating model

- `AGENTS.md` is the repository constitution and highest local agent instruction file.
- `.agents/orchestration.md` defines delegation, sequencing, handoffs, and completion criteria.
- `.agents/agents/*` defines specialist roles.
- `.agents/rules/*` contains cross-cutting rules.
- `.agents/skills/*` contains reusable domain procedures.
- `Docs/*` remains the Lurexa product, architecture, curriculum, and policy source of truth.

## Default workflow

For non-trivial work, the active coding agent must:

1. inspect repository state and relevant source-of-truth documents;
2. classify the request by domain;
3. load the minimum necessary specialist roles;
4. establish an implementation plan and acceptance criteria;
5. make the smallest coherent set of changes;
6. run relevant validation commands;
7. invoke audit/QA review for affected areas;
8. update documentation when behavior, architecture, product boundaries, curriculum, or operating rules changed;
9. report completed changes, validation evidence, unresolved risks, and decisions requiring the product owner.

## Specialist registry

- `orchestrator.md` — coordinates multi-domain work and handoffs.
- `software-architect.md` — architecture, package boundaries, contracts, technical debt.
- `developer.md` — implementation across applications and shared packages.
- `curriculum-architect.md` — curriculum, CEFR, methodology, assessment, learning-object design.
- `pedagogist.md` — pedagogical quality and learning-science review.
- `designer.md` — product UX/UI and shared design-system consistency.
- `qa-engineer.md` — tests, regressions, acceptance criteria, verification.
- `devops-engineer.md` — CI, Vercel, build/release, environment parity.
- `auditor.md` — security, privacy, architecture and quality review.
- `documentation-specialist.md` — source-of-truth and developer documentation.

## Delegation principle

Specialists are roles, not independent sources of truth. They must not invent conflicting product decisions. The orchestrator resolves overlaps using the precedence rules in `AGENTS.md` and authoritative `Docs/*` files.

## Completion rule

A task is not complete merely because code was written. It is complete when the requested behavior is implemented, relevant checks pass or failures are explicitly diagnosed, architectural and product boundaries are preserved, and affected documentation is synchronized.

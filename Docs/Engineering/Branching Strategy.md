# Branching Strategy

## Default branch

`main` is the protected, releasable source of truth. Changes reach it through reviewed pull requests and required automated checks.

## Working branches

- Create focused branches from current `main` using the `codex/` prefix where applicable, for example `codex/add-audit-log`.
- Keep branches short-lived and scoped to one cohesive change.
- Rebase or merge from `main` as needed to resolve drift before review.

## Pull requests

- Explain the problem, solution, test coverage, and any deployment considerations.
- Prefer small pull requests that are easy to review and roll back.
- Squash merge unless preserving individual commits provides meaningful history.

## Emergency changes

Use a narrowly scoped hotfix branch, complete expedited review and validation, then merge the fix back into `main` promptly.

# Foundation Consolidation Plan

Status: proposed execution baseline  
Scope: repository ownership, duplication control, verification and safe retirement

## Decision

Do not delete active-looking applications or packages until the verification gate is green and ownership is recorded. This repository contains a commercial ecosystem, an active Learn MVP, generated starter remnants and historical scaffolding. The correct sequence is classify → verify → migrate → retire.

## Canonical application map

| Path | Intended role | Status | Rule |
|---|---|---|---|
| `apps/web` | Lurexa Learning Technologies public ecosystem site | active | Owns company/product marketing only. |
| `apps/learn-web` | Lurexa Learn learner-facing MVP | active | Owns learner experience and temporary educator MVP routes only until Teach migration is approved. |
| `apps/teacher-portal` | Legacy/provisional teacher portal | migration candidate | No new feature work until a Lurexa Teach migration decision. |
| `apps/admin-portal` | Lurexa Admin | active foundation | Keep minimal until tenancy/authorization capabilities are verified. |
| `apps/mobile` | future mobile surface | planned | No parallel feature work before Learn web vertical slice is complete. |
| `apps/docs` | technical documentation app | review candidate | Retain only if it has a deployed/documentation purpose. |
| `my-app` | unknown starter or experiment | quarantine candidate | Inventory imports/deployments before removal. |

## Required decisions before deletion

1. Confirm the active Vercel/Firebase deployment root for every app.
2. Search workspace references, CI workflows, deployment config, and documentation.
3. Build the affected workspace project in isolation.
4. Remove only through a dedicated PR with a rollback description.
5. Update `repository.json`, workspace configuration, generators and documentation in the same PR.

## Package rules

- `@lurexa/ui` is the sole reusable UI primitive package. Normalize casing and export paths before more product UI work.
- `@lurexa/tokens` owns brand, semantic, product-accent, spacing, typography and state tokens.
- `@lurexa/backend`, `@lurexa/auth` and `@lurexa/database` require a capability-ownership review before consolidation; do not merge them based on names alone.
- Product applications must not introduce direct Firestore mutation or direct model-provider calls.

## Immediate repository defects

- Empty files under `.ai/checklists/` and `.ai/prompts/` provide no enforcement.
- UI import casing appears inconsistent (for example `Button` versus `button`), which is unsafe across case-sensitive environments.
- More than one teacher-facing surface exists without an approved Teach migration boundary.
- Starter/template residue exists in `apps/web` and potentially `my-app`.
- The repository must use one verification contract locally, in GitHub Actions and in Vercel.

## Phase 0 lock

The foundation is locked only when these commands succeed from a clean install:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Each command must have a root script and each active workspace must participate intentionally or be explicitly excluded with a documented reason.

## Next executable work order

1. Produce an app/package/deployment inventory.
2. Normalize UI import/export casing with automated checks.
3. Fill AI feature, testing, PR and release checklists.
4. Align root scripts, Turbo tasks, GitHub CI and Vercel build behavior.
5. Run the Phase 0 lock.
6. Retire confirmed unused starter surfaces in dedicated, reversible PRs.
7. Start the Learn A1 end-to-end vertical slice.

## Non-negotiable boundary

No deletion, migration or package rename is complete until the project passes the Phase 0 lock and the affected deployment is verified.

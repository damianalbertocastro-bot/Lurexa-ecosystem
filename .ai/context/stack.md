# Lurexa Technology Stack

Version: 2.0  
Status: Authoritative current-stack guidance  
Last reconciled: 2026-08-27

This document tells repository agents what is actually in use. It is not permission to replace technologies without an ADR or explicit architecture decision.

## Engineering principles

- Maintainability over cleverness.
- Strong typing and explicit trust boundaries.
- Shared contracts/components over duplication.
- Server authority for trusted state.
- Accessibility, privacy and low-bandwidth behavior are product requirements, not polish.
- Do not manufacture production readiness from a prototype or successful build.

## Runtime and package management

- Node.js: **24.x** (root `engines`, GitHub CI and deployment validation).
- pnpm: **10.3.0** (root `packageManager` and CI).
- Monorepo: pnpm workspaces + Turborepo.

Use the root `pnpm-lock.yaml`. Do not introduce npm/yarn/per-package lockfiles.

## Language and application frameworks

- TypeScript is the primary application/package language.
- JavaScript/`.mjs` is intentionally used for repository verification/build tooling where already established; do not rewrite it solely for stylistic consistency.
- Next.js App Router powers current web applications.
- Expo/React Native powers the Learn mobile surface.
- Prefer Server Components where practical; use Client Components for browser state/APIs/interactions.

## Current web applications and local ports

| App | Workspace | Port |
| --- | --- | ---: |
| Ecosystem | `web` | 3000 |
| Learn | `learn-web` | 3001 |
| Teach | `@lurexa/teach-web` | 3002 |
| Admin | `admin-portal` | 3003 |
| Docs | `docs` | 3004 |
| Coach | `@lurexa/coach-web` | 3005 |

Canonical app/domain metadata lives in `packages/config/src/domains.ts`.

No standalone Insight, Studio or Campus application exists yet. Do not invent paths/ports/deployments for them before the product-expansion foundation stage.

## Frontend/UI

Current repository direction:

- shared design tokens: `@lurexa/tokens`;
- shared components/marks: `@lurexa/ui`;
- product-specific personality may layer on the shared design grammar;
- Next.js/Tailwind patterns vary by app and are being version-reconciled during platform/package cleanup.

Prefer shared tokens/components for reusable primitives. Product personality is allowed and expected; do not make every product visually identical.

## Backend, trust and data

Primary infrastructure is Firebase-oriented:

- Firebase Authentication;
- Firestore;
- Firebase/Google Cloud Storage capabilities where configured;
- Firebase Emulator Suite for governed integration/security testing.

Trusted flow:

```text
Product UI
  ↓ authenticated API/capability boundary
Lurexa Core service/authorization
  ↓ authorized evidence/context when intelligence is needed
Lurexa Mind interpretation
  ↓ validated result/candidate
Core approval/persistence where required
```

Do not interpret the historical `@lurexa/backend` package name as permission for browser code to use privileged server capabilities. Its root barrel is browser-safe legacy/current service surface; privileged services use explicit server-only subpaths. Platform/package reconciliation will reduce that ambiguity.

## Database/data-access rules

Firestore is the current primary operational store.

- Trusted learner/professional evidence, authorization, qualification, entitlements and derived state must be server-governed.
- UI components must not directly author authoritative inferred/trusted state.
- Existing browser-safe Firebase services are legacy/current surfaces to be reconciled, not a pattern to expand indiscriminately.
- Firestore security rules and server authorization must not diverge toward weaker role-only access.

## Core and Mind

Core owns:

- identity and authentication integration;
- authorization/permissions;
- tenant boundaries;
- trusted learner/professional records;
- educator qualification and teaching authorization;
- persistence and provenance;
- entitlements and shared contracts.

Mind owns interpretation/intelligence over authorized evidence. Mind does not own authentication, trusted persistence, entitlement or authority grants.

## AI/provider rules

- Product UIs do not call model providers directly for persistent learning intelligence.
- Provider credentials remain server-only.
- AI fallbacks must be explicitly labeled; canned output must not impersonate a live model.
- Evaluate timeout, reliability, privacy, cost and pedagogical validity for production-critical AI.

## Environment configuration

- Public browser variables use explicit `NEXT_PUBLIC_` names only when safe for exposure.
- Service accounts/provider keys are server-only.
- `.env*`/temporary credential artifacts are repository-hygiene protected.
- Environment variable aliases/duplicates are scheduled for platform/package reconciliation; do not add new spelling variants.

## CI and repository governance

`main` is protected by `Lurexa Main Protection`:

- PR required;
- strict required status `Verify Foundation & Build`;
- review-thread resolution;
- no force pushes/non-fast-forward updates;
- no branch deletion;
- no bypass actors.

The required CI job includes repository hygiene, product/brand/architecture verifiers, prototype containment, curriculum, Core/Mind, educator governance/journeys, Firestore rules and Phase 0 build checks.

## Deployment

`deployment/products.json` expresses intended repository deployment topology, not live-runtime truth. Live Vercel project/domain state must be verified during deployment reconciliation before a surface is described as deployed/production-live.

## Source-of-truth hierarchy

For current work, prefer:

1. machine-enforced contracts/registries and current repository code;
2. `Docs/00-Lurexa-Bible.md` for ecosystem principles;
3. `ROADMAP.md` for maturity/execution truth;
4. architecture boundary docs for specific domains;
5. this stack file for runtime/tooling conventions;
6. historical audits/closure docs only as history, not current truth.

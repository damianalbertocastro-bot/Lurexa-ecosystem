# Lurexa Ecosystem

Lurexa is the product and technology ecosystem developed by **Lurexa Learning Technologies**.

The company is building an intelligent, accessible and adaptive EdTech ecosystem rather than a single LMS.

```text
Lurexa Learning Technologies
│
├── Shared ecosystem layers
│   ├── Lurexa Core   trusted platform, identity, authorization, persistence and records
│   └── Lurexa Mind   learning intelligence, interpretation, adaptation and AI
│
├── Six sibling products
│   ├── Lurexa Learn
│   ├── Lurexa Coach
│   ├── Lurexa Teach
│   ├── Lurexa Admin
│   ├── Lurexa Insight
│   └── Lurexa Studio
│
└── Institutional shell
    └── Lurexa Campus
```

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Core owns trusted state and authorization. Mind interprets authorized evidence but does not become the system of record. Products compose Core and Mind capabilities rather than duplicating learner truth. Campus orchestrates an institutional experience without becoming a seventh sibling product.

## Workspace layout

This repository is a TypeScript monorepo using pnpm and Turborepo.

```text
apps/
  web/              Lurexa Learning Technologies ecosystem landing site
  learn-web/        Lurexa Learn learner application + Learn Teacher Workspace
  coach-web/        Lurexa Coach standalone speaking/pronunciation product
  teach-web/        Lurexa Teach professional-development product
  admin-portal/     Lurexa Admin governance/operations portal
  docs/             Lurexa documentation site
  mobile/           Lurexa Learn Expo/React Native surface
packages/
  auth/             authentication contracts/adapters under reconciliation
  backend/          shared client-safe services plus explicit server-only subpaths
  config/           shared application, domain and product configuration
  database/         database/test/seed abstractions under reconciliation
  sdk/              shared SDK contracts under reconciliation
  tokens/           design tokens
  types/            shared TypeScript domain contracts
  ui/               shared UI component library
  utils/            shared utilities
```

`bootstrap/`, `turbo/`, and `utilities/` contain repository tooling. The root owns the single `pnpm-lock.yaml`.

Package names are implementation boundaries, not branding. Do not create giant `core` or `mind` packages merely to mirror product language; move responsibilities only when import graphs and ownership justify it.

## Product ownership

### Lurexa Learn

Primary learner product. Learn owns curriculum delivery, learner progress, and its embedded Teacher Workspace for class/course/student operations.

### Lurexa Coach

Standalone first-class product at `apps/coach-web`. Coach owns speaking, pronunciation, fluency and professional-language practice. Learn and Teach launch Coach through governed Product Bridges; neither owns a second Coach implementation.

### Lurexa Teach

Professional-development product for educators and teachers-to-be. Teach owns educator-as-learner growth, methodology, professional competencies, reflection and credentials. It does not own student roster/course operations.

### Lurexa Admin

Governance and institutional operations product. Current verified scope includes educator qualification and teaching-authorization governance. Do not infer that every future billing/institutional operation is production-complete.

### Lurexa Insight

Sibling analytics/intelligence product. Standalone product foundations remain pending; Learn Teacher Insights are a Learn instructional feature and must not be presented as Lurexa Insight.

### Lurexa Studio

Sibling authoring product. Knowledge Object and authoring foundations exist, while the Learn Teacher Workspace Studio surface is explicitly a prototype until the standalone governed product exists.

### Lurexa Campus

Institutional orchestration shell, structurally different from the six sibling products. The current representative Campus page is a prototype and does not make live institution, SSO, entitlement, enrollment or analytics claims.

## Requirements

- Node.js 24.x
- pnpm 10.3.0

```bash
pnpm install --frozen-lockfile
```

## Common commands

```bash
pnpm dev                     # Start learn-web
pnpm build                   # Build workspace apps/packages that expose build scripts
pnpm lint                    # Run workspace linting
pnpm check-types             # Run workspace TypeScript checks
pnpm test                    # Run package test scripts
pnpm verify:local            # Broad local architecture/quality verification
pnpm verify:phase0           # Phase 0 Learn dependency lint/type/build gate
pnpm firebase:emulators      # Start Auth + Firestore emulators
pnpm --filter learn-web dev
pnpm --filter @lurexa/coach-web dev
pnpm --filter @lurexa/teach-web dev
```

## Architecture rules

- Core owns trusted platform foundations and authoritative operational state.
- Mind owns interpretation/intelligence over explicitly authorized evidence; it does not grant authority or own canonical persistence.
- Products may consume Core and Mind capabilities; platform capabilities must not depend on product applications.
- Maintain one persistent cross-product Learner Model with purpose/role-scoped projections.
- Learn Teacher Workspace belongs to Learn; Teach is professional development.
- Coach is a standalone product and cross-product practice destination.
- Campus is an institutional shell, not a sibling product owner.
- Prototype UI must never represent fabricated/demo/local state as production truth.
- UI components must not perform authoritative Firestore mutations directly.
- Avoid direct product-to-model-provider coupling where shared Mind/server capabilities own the boundary.
- Use shared design tokens/components unless a product-specific personality intentionally extends the shared grammar.

See `Docs/00-Lurexa-Bible.md`, `Docs/Architecture/Capability Architecture.md`, and `Docs/Engineering/REPOSITORY_MATURITY_STATUS.md`.

## Maturity and roadmap truth

A page, contract or checked roadmap item does not by itself mean a product is production-ready.

The repository uses these maturity states:

**Concept → Architecture → Prototype → Contract implemented → MVP implemented → Verified → Deployed → Production ready**

`Docs/Engineering/REPOSITORY_MATURITY_STATUS.md` is the operational maturity reference. `ROADMAP.md` is the execution plan and must use those states for phase-level claims.

## Deployment and automation

`deployment/products.json` declares the intended deployment topology. Its status fields are repository intent, not proof of live external health by themselves.

Current deployable repository surfaces include ecosystem web, Learn, Coach, Teach, Admin and Docs. Mobile is not a Vercel surface. Insight, Studio and Campus receive dedicated projects only when their standalone applications exist.

GitHub Actions use Node 24 and pnpm 10.3.0. The protected `main` branch requires pull requests and the `Verify Foundation & Build` status check, requires the branch to be current before merge, requires review-thread resolution, and blocks deletion/force pushes through the active repository ruleset.

External Vercel project/domain health is reconciled separately from repository intent; see the Vercel release/runbook documentation rather than assuming a manifest entry proves a live deployment.

## Environment

Local configuration belongs in `.env.local` and remains excluded from version control. Firebase browser configuration uses `NEXT_PUBLIC_FIREBASE_*`; trusted server-side Core routes require server-only credentials such as `FIREBASE_SERVICE_ACCOUNT_JSON` outside emulator usage.

Never expose server credentials through `NEXT_PUBLIC_` variables or commit secrets. Repository hygiene CI rejects tracked live environment/temp credential artifacts.

## Current execution focus

The current program is repository reconciliation and product-foundation hardening: prototype containment, documentation truth, platform/package reconciliation, deployment reconciliation, then standalone product-expansion foundations.

See [ROADMAP.md](ROADMAP.md) for the detailed execution plan.

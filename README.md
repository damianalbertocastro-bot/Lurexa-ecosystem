# Lurexa Ecosystem

Lurexa is the commercial learning-technology ecosystem developed by **Lurexa Learning Technologies**.

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

## Architecture at a glance

```text
Lurexa Learning Technologies
│
├── Shared ecosystem layers
│   ├── Lurexa Core — trust, identity, authorization, persistence and authoritative records
│   └── Lurexa Mind — interpretation, personalization, adaptation and AI/learning intelligence
│
├── Six sibling products
│   ├── Lurexa Learn
│   ├── Lurexa Coach
│   ├── Lurexa Teach
│   ├── Lurexa Admin
│   ├── Lurexa Insight
│   └── Lurexa Studio
│
└── Institutional orchestration shell
    └── Lurexa Campus
```

Core and Mind are shared layers, not end-user products. Campus is structurally different from the six sibling products. Products compose Core and Mind capabilities instead of creating competing identity, learner-memory, authorization or persistence systems.

## Current repository applications

```text
apps/
  web/              Lurexa ecosystem landing/application shell
  learn-web/        Lurexa Learn learner experience + embedded Teacher Workspace
  coach-web/        Lurexa Coach standalone speaking/pronunciation product
  teach-web/        Lurexa Teach educator professional-development product
  admin-portal/     Lurexa Admin governance/administration product
  docs/             Lurexa documentation application
  mobile/           Lurexa Learn mobile/Expo surface
```

There is currently no standalone Insight, Studio or Campus application. Their product/shell architecture exists, but their current representative or supporting surfaces must not be treated as production implementations. The Learn-hosted `/teacher/insights` route is an instructional Learn Teacher Workspace feature, not Lurexa Insight. The Learn-hosted Studio page is an explicitly contained local interaction prototype.

## Shared packages

```text
packages/
  auth/             Authentication abstractions currently under platform reconciliation
  backend/          Browser-safe services plus explicit server-only capabilities
  config/           Shared product/domain/runtime configuration
  database/         Database abstractions currently under platform reconciliation
  sdk/              Shared SDK/contracts surface
  tokens/           Design tokens
  types/            Shared TypeScript/domain contracts
  ui/               Shared UI component library
  utils/            Shared utilities
```

Package existence is not proof that every abstraction is still authoritative. `ROADMAP.md` tracks the planned platform/package reconciliation rather than preserving old scaffolds indefinitely.

## Product boundaries

### Lurexa Learn

Structured learner delivery and the operational Teacher Workspace. Learn owns courses, lessons, enrollment/progress, assignments, instructional support and student-facing learning experiences.

### Lurexa Coach

A **standalone first-class product** at `apps/coach-web`. Coach owns adaptive English speaking, pronunciation, fluency and educator-professional English practice. Learn and Teach may launch Coach through governed Product Bridges; they do not own its canonical UI/runtime.

### Lurexa Teach

Educator-as-learner professional development. Teach owns professional growth, pedagogy/methodology development, educator evidence, credentials and development recommendations. It does not own student rosters/class operations.

### Lurexa Admin

Institutional governance and administration. Current verified scope includes educator qualification review and teaching authorization foundations. Billing is not yet a production payment capability.

### Lurexa Insight

The future standalone institutional/cohort analytics product. It must remain distinct from Learn Teacher instructional insights until a dedicated product boundary/application exists.

### Lurexa Studio

The future standalone governed authoring product. Core-owned Knowledge Object/catalog foundations exist, while the current Teacher Workspace Studio UI is only a contained local prototype.

### Lurexa Campus

An institutional orchestration shell, **not a seventh sibling product**. The current representative Campus page is not connected to a real tenant, SSO provider, entitlement set or institutional analytics environment.

## Prototype containment

Lurexa retains useful prototypes when they support design or architecture work, but they must not claim production behavior. Current containment policy explicitly prevents:

- Marketplace pages from claiming purchases, receipts, licenses, publisher earnings or Stripe readiness;
- billing from presenting fabricated checkout/subscription state;
- UI placeholders from presenting canned responses as live AI;
- Campus from impersonating a real institution/SSO/entitlement environment;
- Studio local state from being described as Core persistence/publication;
- Learn from maintaining a second Coach-like chat experience.

See `Docs/Architecture/LUREXA_PROTOTYPE_CONTAINMENT.md`.

## Requirements

- **Node.js 24.x**
- **pnpm 10.3.0**

Install from the repository root:

```bash
pnpm install --frozen-lockfile
```

## Local application ports

| Surface | Command / workspace | Default local URL |
| --- | --- | --- |
| Ecosystem | `web` | `http://localhost:3000` |
| Learn | `learn-web` | `http://localhost:3001` |
| Teach | `@lurexa/teach-web` | `http://localhost:3002` |
| Admin | `admin-portal` | `http://localhost:3003` |
| Docs | `docs` | `http://localhost:3004` |
| Coach | `@lurexa/coach-web` | `http://localhost:3005` |

The canonical port/domain contract lives in `packages/config/src/domains.ts`; do not duplicate new port maps in application code.

## Common commands

```bash
pnpm dev                         # Start Learn by default
pnpm build                       # Build workspace apps/packages with build scripts
pnpm lint                        # Run workspace linting
pnpm check-types                 # Run TypeScript checks
pnpm test                        # Run package test scripts
pnpm verify:local                # Broad local verification sequence
pnpm firebase:emulators          # Start Firebase auth/firestore emulators
pnpm --filter learn-web dev      # Learn only
pnpm --filter @lurexa/coach-web dev
pnpm --filter @lurexa/teach-web dev
```

## Governance and merge policy

`main` is protected by the active **Lurexa Main Protection** GitHub ruleset:

- pull request required;
- `Verify Foundation & Build` required and strict/up-to-date;
- review conversations must be resolved;
- force pushes/non-fast-forward updates blocked;
- branch deletion blocked;
- no bypass actors;
- zero mandatory human approvals for the current AI-assisted solo-maintainer workflow.

CODEOWNERS remains in the repository so approval requirements can be strengthened when the engineering team grows.

## Architecture rules

- Core owns trusted authorization/persistence; Mind interprets authorized evidence.
- One persistent cross-product Learner Model; do not synchronize competing product profiles.
- Product UI must not directly mutate trusted inferred learner state.
- Keep server-only privileged capabilities behind explicit server imports/routes.
- Teacher Workspace stays inside Learn.
- Coach stays a standalone product.
- Learn Teacher Insights must not be presented as standalone Insight.
- Campus remains an institutional shell.
- Prototypes must fail honest/closed for unimplemented trusted actions.
- Use shared design tokens/components while preserving distinct product personalities.

## Deployment truth

`deployment/products.json` describes intended repository deployment topology. It is **not by itself proof that a Vercel project/domain is currently live**. Live project/domain/runtime state is reconciled separately during the deployment-reconciliation stage in `ROADMAP.md`.

Do not infer `DEPLOYED` or `PRODUCTION_READY` from a successful build, a manifest status field, or the existence of a Vercel project alone.

## Environment and secrets

Local values belong in ignored environment files; secrets belong in encrypted deployment/local secret stores. Firebase browser configuration uses `NEXT_PUBLIC_FIREBASE_*`; privileged Core routes require server-side credentials. Never expose service-account material through `NEXT_PUBLIC_` variables or commit credentials.

Repository hygiene CI rejects known temporary/live-environment artifact patterns.

## Project status

Use `ROADMAP.md` for the current maturity matrix and execution sequence. It distinguishes **CONCEPT → ARCHITECTURE → PROTOTYPE → CONTRACT_IMPLEMENTED → MVP_IMPLEMENTED → VERIFIED → DEPLOYED → PRODUCTION_READY** instead of treating a checkbox as proof of production completion.

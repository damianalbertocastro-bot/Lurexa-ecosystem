# Lurexa Ecosystem

Lurexa is the product and technology ecosystem developed by **Lurexa Learning Technologies**.

The company is building intelligent, accessible, and adaptive educational technology rather than a single LMS. The ecosystem is organized around two reusable platform technology layers — **Lurexa Core** and **Lurexa Mind** — that power a growing family of user-facing products.

```text
Lurexa Learning Technologies
│
├── Lurexa Core      Shared platform foundation
├── Lurexa Mind      Learning intelligence and AI
│
└── Products
    ├── Lurexa Learn
    ├── Lurexa Teach
    ├── Lurexa Admin
    ├── Lurexa Insight
    ├── Lurexa Coach
    └── Lurexa Studio
```

**Lurexa Core** owns trusted platform foundations such as identity, organizations, learning records, permissions, commerce, scheduling, notifications, shared data contracts, offline synchronization, and platform analytics.

**Lurexa Mind** owns reusable intelligence such as AI orchestration, learner modeling, personalization, recommendations, tutoring intelligence, assessment intelligence, content adaptation, and pedagogical agents.

Products compose Core and Mind capabilities instead of duplicating foundational logic.

> **Lurexa Learning Technologies builds the ecosystem. Core powers it. Mind makes it intelligent. Products deliver the experience.**

## Workspace layout

This repository is a TypeScript monorepo using pnpm and Turborepo to share UI, domain, data, authentication, configuration, and platform code between applications.

```text
apps/
  learn-web/        Lurexa Learn learner-facing Next.js application
  admin-portal/     Lurexa Admin administrative Next.js portal
  teacher-portal/   Lurexa Teach teacher Next.js portal
  web/              Additional Next.js web application
  docs/             Documentation Next.js application
  mobile/           Expo/React Native application
  storybook/        Component-library development environment
packages/
  auth/             Authentication primitives
  backend/          Backend and Firebase-facing services
  config/           Shared application configuration
  database/         Database schema, configuration, and seed data
  sdk/              Shared SDK surface
  tokens/           Design tokens
  types/            Shared TypeScript types
  ui/               Shared UI component library
  utils/            Shared utilities
```

`bootstrap/`, `turbo/`, and `utilities/` provide Turborepo generators and setup support. The root contains one pnpm lockfile (`pnpm-lock.yaml`); do not add per-package or npm lockfiles.

The Core/Mind naming is currently an architectural ownership model. Existing packages should not be renamed or collapsed into large `core` or `mind` packages merely for branding. Package boundaries should follow proven domain responsibilities.

## Product direction

### Lurexa Learn

The flagship learner-facing product and first production experience.

### Lurexa Teach

The educator workspace for learner management, instructional workflows, scheduling, feedback, and teacher-facing intelligence.

### Lurexa Admin

The institutional and operational management experience.

### Lurexa Insight

The analytics and learning-intelligence product for learners, educators, and institutions.

### Lurexa Coach

The personalized user-facing AI learning coach powered by Lurexa Mind. Coach should initially be embedded inside Lurexa Learn, then evolve into a cross-product or standalone experience only when independent user value justifies it.

### Lurexa Studio

The educational content creation, authoring, and publishing environment.

## Requirements

- Node.js 20 or later
- pnpm 10.3.0

Install dependencies from the repository root:

```bash
pnpm install
```

## Common commands

```bash
pnpm dev                    # Start learn-web
pnpm build                  # Build all workspace packages and apps
pnpm lint                   # Run workspace linting
pnpm check-types            # Run workspace TypeScript checks
pnpm test                   # Run package test scripts
pnpm firebase:emulators     # Start the backend Firebase emulators
pnpm --filter learn-web dev # Start only the learner application
pnpm --filter @lurexa/database seed
```

## Architecture rules

- Products are experiences; reusable business logic belongs in capabilities and shared services.
- Lurexa Core owns trusted platform foundations and authoritative operational state.
- Lurexa Mind owns reusable intelligence, personalization, and adaptive-learning behavior.
- Products may consume Core and Mind capabilities; platform capabilities must not depend on product applications.
- Use TypeScript only; do not introduce `any` without an explicitly justified exception.
- Use design tokens and shared UI components instead of hard-coded visual values.
- Prefer Server Components unless client state is necessary.
- Keep Firestore access behind backend services; UI components must not access Firestore directly.
- Avoid direct product-to-model-provider coupling where Lurexa Mind can provide the abstraction.

See `Docs/00-Lurexa-Bible.md` and `Docs/Architecture/Capability Architecture.md` for the source-of-truth company, product, and capability architecture.

## Deployment and automation

The root Vercel configuration builds `learn-web` and uses `apps/learn-web/.next` as its output directory. GitHub Actions validate linting, type checking, and builds for pushes and pull requests.

The repository package manager is pnpm 10.3.0, but the current workflow files install pnpm 9. Align those versions before treating CI as a reliable release gate.

Two duplicate standalone Next.js templates and conflicting lockfiles were removed from the repository. Use the applications under `apps/` as the supported runtime entry points.

## Environment

Local configuration belongs in `.env.local` and is intentionally excluded from version control. The monorepo build recognizes `DATABASE_URL` and `NODE_ENV`. Never commit secrets.

## Project status

Recent work has focused on `learn-web` deployment configuration, workspace dependency alignment, Playwright/type-check compatibility, database seed data, and formalizing the company/platform/product architecture.

See [ROADMAP.md](ROADMAP.md) for the current execution plan.

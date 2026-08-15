# Lurexa Ecosystem

Lurexa is a TypeScript monorepo for its learning platform. The workspace uses pnpm and Turborepo to share UI, domain, data, authentication, and configuration code between web applications.

## Workspace layout

```text
apps/
  learn-web/        Learner-facing Next.js application
  admin-portal/     Administrative Next.js portal
  teacher-portal/   Teacher Next.js portal
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

- Use TypeScript only; do not introduce `any`.
- Use design tokens and shared UI components instead of hard-coded visual values.
- Prefer Server Components unless client state is necessary.
- Keep Firestore access behind backend services; UI components must not access Firestore directly.

## Deployment and automation

The root Vercel configuration builds `learn-web` and uses `apps/learn-web/.next` as its output directory. GitHub Actions validate linting, type checking, and builds for pushes and pull requests.

The repository package manager is pnpm 10.3.0, but the current workflow files install pnpm 9. Align those versions before treating CI as a reliable release gate.

Two duplicate standalone Next.js templates and conflicting lockfiles were removed from the repository. Use the applications under `apps/` as the supported runtime entry points.

## Environment

Local configuration belongs in `.env.local` and is intentionally excluded from version control. The monorepo build recognizes `DATABASE_URL` and `NODE_ENV`. Never commit secrets.

## Project status

Recent work focused on `learn-web` deployment configuration, workspace dependency alignment, Playwright/type-check compatibility, and database seed data. See [ROADMAP.md](ROADMAP.md) for the current execution plan.

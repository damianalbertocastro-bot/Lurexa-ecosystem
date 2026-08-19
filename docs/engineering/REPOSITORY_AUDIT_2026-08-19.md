# Repository audit — 2026-08-19

## Completed in this pass

- Unified the ecosystem, Learn, Teach, Admin, and Docs visual language.
- Added product-aware marks to shared workspace navigation.
- Updated common UI primitives: buttons, cards, inputs, badges, and progress indicators.
- Added missing Tailwind/PostCSS dependencies for Admin and Docs.
- Declared Teach's new shared UI dependency and a type-check script.
- Made root recursive utility commands safe for packages without a matching script.
- Added Vercel project configuration for Admin, Teach, and Docs.

## High-priority next improvements

1. Replace client-side demo identifiers (`student_demo`, `org_demo`, and equivalent placeholders) with authenticated user and organization context. These occur in Coach, marketplace, developer, billing, and analytics flows. Leaving them in production risks cross-tenant behavior and inaccurate data access.
2. Make end-to-end tests executable. The repository contains a Playwright scenario but no Playwright configuration or package test command; the scenario also assumes an authenticated seeded learner and outdated UI copy.
3. Consolidate deployment ownership. The ecosystem Vercel project currently builds only `apps/web`; Learn, Teach, Admin, and Docs should each receive a Vercel project, production domain, environment-variable set, and deployment check.
4. Align framework versions deliberately. The monorepo currently mixes Next 16.2.0, 16.2.12, and 16.3.1 along with multiple React 19 patch versions. Upgrade together in a dedicated verified change, including the lockfile.
5. Replace browser `alert()` flows with accessible inline error and success states. This should be handled with a shared notification component and preserved error identifiers.
6. Resolve product-boundary duplication. Teach and Admin have standalone portal apps while related routes also exist inside Learn. Choose one production entry point per product and redirect or retire the duplicate route.

## Quality gates to require before production

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm check-types`
- product-specific builds for Learn, Teach, Admin, Docs, and web
- seeded authenticated E2E flow for a learner and an educator
- mobile viewport and keyboard-only review for all public/authenticated entry pages

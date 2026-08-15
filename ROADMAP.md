# Lurexa roadmap

Status reflects the workspace and repository state inspected on 2026-08-14. It is a working plan, not a release promise.

## Current baseline

- [x] pnpm/Turborepo workspace established with shared packages and multiple applications.
- [x] Firebase configuration, Firestore rules, and indexes are present.
- [x] Shared design tokens, UI, types, database, backend, auth, config, SDK, and utility packages exist.
- [x] `learn-web` has a Vercel build configuration and recent deployment-focused fixes.
- [x] Database seed data has recent fixes for organization, author, status, and module fields.
- [x] GitHub Actions provide lint, type-check, and build workflows.

## Immediate priorities

1. Align GitHub Actions with the declared pnpm 10.3.0 version, then run the full CI workflow on `main`.
2. Verify the `learn-web` production deployment end to end: install, build, environment variables, and the deployed application.
3. Run `pnpm lint`, `pnpm check-types`, and `pnpm build` from a clean dependency install; resolve any remaining workspace incompatibilities.
4. Replace remaining generated app READMEs with project-specific setup and ownership documentation.

## Product foundation

- [ ] Complete authentication, RBAC, and user-profile flows using the shared auth and backend layers.
- [ ] Define stable domain contracts in `@lurexa/types` and expose supported integrations through `@lurexa/sdk`.
- [ ] Establish database migrations, repeatable seed data, and environment-specific operational guidance.
- [ ] Document application ownership and the supported relationship among learner, teacher, admin, mobile, and documentation apps.

## Quality and delivery

- [ ] Add focused test coverage for shared packages and critical learner flows.
- [ ] Standardize framework and React versions across applications where compatibility permits.
- [ ] Establish preview/production deployment ownership to avoid overlapping Vercel and GitHub Actions deploy paths.
- [ ] Add release checks for environment configuration and Firestore security rules.

## Repository hygiene

- [x] Generated dependency directories and Turborepo cache identified as safe-to-regenerate artifacts.
- [x] Remove duplicate standalone Next.js templates and conflicting npm/per-package lockfiles; supported runtime apps now live under `apps/`.
- [ ] Keep root documentation current as applications, packages, and deployment ownership change.

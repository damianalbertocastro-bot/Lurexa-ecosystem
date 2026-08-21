# Lurexa Brand and Product-Surface Repository Audit — 2026-08-21

Status: **Active repository audit aligned to current architecture**

## Executive finding

The repository now has a coherent source-of-truth pattern for product identity, navigation configuration, and shell branding.

> **Shared grammar + distinct personalities.**

Canonical product classification and copy live in `@lurexa/config`; canonical mark geometry lives in `@lurexa/ui` and `packages/ui/brand`; current executable shells use product-specific metadata and icons; URL names and fallback behavior are governed centrally; automated checks prevent future Lurexa Community from leaking into current runtime navigation or deployment.

Learn and Teach deliberately retain their previously approved marks. Coach, Admin, Insight, Studio and Docs retain the newer personality-based marks. Core and Mind remain shared ecosystem layers rather than ordinary products.

**Lurexa Community** remains a reserved future product concept with a dedicated concept mark, product vision, and architecture boundary. It is not part of the current six-product family and has no runtime application/deployment.

## Resolved high-priority drift

### RESOLVED — Learn / Teach ownership

The roadmap, product portfolio, repository mapping, and UI now use the current boundary:

- **Lurexa Learn** owns learner experiences, classes, assignments, progress/support workflows, and the teacher operational workspace.
- **Lurexa Teach** owns educator professional growth, professional learning, evidence/reflection, credentials, and educator community.

`apps/teacher-portal` remains a Lurexa Learn surface. `apps/teach-web` remains the independent Teach product.

### RESOLVED — duplicated ecosystem product identity

`apps/web` consumes shared `MasterMark` / `ProductMark` components and canonical product metadata from `@lurexa/config`. Local duplicate master/product SVG implementations and stale Teach positioning were removed.

### RESOLVED — typed product classification

`packages/config/src/product-registry.ts` distinguishes:

- current products;
- shared ecosystem layers;
- ecosystem surfaces such as Docs;
- future product concepts such as Community;
- other future capability/offering concepts.

### RESOLVED — `apps/web` package boundary

`apps/web` declares `@lurexa/config` as a `workspace:*` dependency, imports through the package export, and the workspace link is recorded in `pnpm-lock.yaml`.

### RESOLVED — cross-product public URL contract

`packages/config/src/product-urls.ts` now defines the canonical `NEXT_PUBLIC_LUREXA_*_URL` names and fallback behavior. See `Docs/Design/CROSS_PRODUCT_URL_CONTRACT.md`.

The contract is local-first: localhost values can be supplied without changing shared code, while the variable names remain stable across environments.

`NEXT_PUBLIC_LUREXA_COMMUNITY_URL` is reserved but inactive. Its existence does not activate Community.

### RESOLVED — automated brand and navigation governance baseline

`pnpm verify:brand-system` now checks:

- canonical current product/layer/surface marks;
- Community future-product classification;
- documented URL-variable usage;
- shell metadata;
- canonical shell icons;
- Teach Community vs future Lurexa Community identity;
- mobile Learn attribution;
- Community exclusion from active deployment/navigation;
- presence of the local visual QA route.

The command runs first inside `pnpm verify:local`.

### RESOLVED — current product-shell identity audit

See `Docs/Design/PRODUCT_SHELL_AUDIT_2026-08-21.md`.

Applied improvements include:

- ecosystem landing starter metadata removed;
- Admin root metadata added;
- Learn metadata aligned to Lurexa Learn;
- canonical Next `app/icon.svg` identities for ecosystem, Learn, Learn teacher workspace, Teach, Admin, and Docs;
- obsolete ecosystem starter `favicon.ico` removed;
- mobile Learn and tutor screens visibly attributed to Lurexa Learn;
- ambiguous shared `community` visual kind replaced by explicit `teach-community`.

## Community guardrails

The reserved distinction remains:

- **Lurexa Community:** future cross-ecosystem social learning product for learners and educators.
- **Teach Community:** educator-only professional collaboration inside Lurexa Teach.
- **Learn discussions:** class/course/lesson discussion needed for instructional delivery inside Lurexa Learn.

> **Social activity is not trusted learning evidence by default.**

Posts, reactions, follows, reputation, and participation must not automatically alter CEFR, mastery, credentials, or trusted learner state. Any later evidence path requires an explicit Core-governed evidence contract.

## Local visual QA

`apps/storybook` is optional in the repository manifest and is not currently present. To avoid adding an unnecessary dependency tree merely for brand inspection, the current baseline is:

1. `pnpm verify:brand-system` for deterministic governance;
2. the local Docs `/brand` route for visual inspection;
3. actual product routes reviewed locally before an intentional hosted release.

See `Docs/Design/BRAND_VISUAL_QA.md`.

If Storybook is activated later, it should reuse this QA matrix rather than become a second source of brand truth.

## Validation policy

Lurexa uses a local-first pre-production workflow to avoid unnecessary hosting builds.

```bash
pnpm verify:local
```

This runs brand governance, lint, type checks, tests, and builds using the pinned workspace toolchain. Product-specific browser verification should happen locally before an intentional hosted preview or production deployment.

GitHub CI remains a repository integration gate. A green CI run does not require or imply an automatic Vercel preview.

## Remaining improvement opportunities

### P1 — validate registry consumers across repository manifests

`deployment/products.json`, `bootstrap/repository.json`, related-experience mappings, and current navigation have different responsibilities and should not be collapsed. Add a focused validator that cross-checks entries presented as current products against the typed registry while allowing legitimate non-product app surfaces such as the Learn teacher workspace and Docs.

### P2 — semantic mark sizing only if visual QA demonstrates need

Shared mark components currently expose compact/full variants. Add a semantic size API only if local `/brand` and real product-shell review show an actual sizing problem. Do not reintroduce copied SVG geometry or brittle descendant selectors.

### P2 — route-level auth/error/empty-state review

Top-level shells are aligned. Authentication, error, loading, and empty states should receive route-level brand/accessibility review when those workflows are next modified.

### P2 — optional Storybook activation

Storybook can become useful once the design-system surface area justifies the maintenance cost. When activated, import existing shared components and mirror `BRAND_VISUAL_QA.md`; do not create duplicate mark implementations or product catalogs.

### P2 — Community remains gated

Do not create `apps/community`, active navigation, deployment, or current product types until the explicit Community activation gate is met.

## Recommended next order

1. Run `pnpm verify:local` in the normal local repository environment.
2. Review Docs `/brand` and representative product shells locally.
3. Add registry-consumer validation for deployment/bootstrap/navigation boundaries.
4. Fix any concrete sizing or route-level identity defects found by local review.
5. Keep Community deferred.
6. Deploy only when a hosted preview or production release is intentionally needed.

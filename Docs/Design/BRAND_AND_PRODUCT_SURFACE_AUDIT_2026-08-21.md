# Lurexa Brand and Product-Surface Repository Audit — 2026-08-21

Status: active audit record for the `feat/ecosystem-related-experiences` branch.

## Executive finding

The repository has a strong current architecture source of truth, but product identity still drifts in a few implementation and roadmap surfaces. The highest-risk pattern is **duplicated product definitions**: product ownership, product copy, deployment metadata, and SVG geometry are repeated in multiple places instead of being consumed from shared contracts.

The brand direction remains:

> **Shared grammar + distinct personalities.**

Learn and Teach deliberately retain their previously approved marks. Coach, Admin, Insight, Studio and Docs retain the newer personality-based marks. Core and Mind now have dedicated ecosystem-layer identities without being promoted into end-user products.

## Changes applied during this audit

- Restored the approved earlier **Lurexa Learn** mark in `ProductMark` and the canonical SVG source.
- Restored the approved earlier **Lurexa Teach** mark in `ProductMark` and the canonical SVG source.
- Preserved the newer Coach, Admin, Insight, Studio and Docs marks.
- Added canonical **Lurexa Core** and **Lurexa Mind** SVG marks.
- Added `EcosystemLayerMark` so Core/Mind can be represented without abusing `ProductMark`.
- Added a separate `brand/concepts/` area for roadmap-backed identity explorations.
- Added Marketplace, API, Mobile and Enterprise identity concepts there; these are explicitly not approved products.
- Updated the brand README to distinguish parent identity, products, shared layers, ecosystem surfaces and future concepts.
- Corrected the deployment manifest brand name from `Lurexa Documentation` to **Lurexa Docs**.
- Replaced the obsolete Teach deployment status `pending-app-merge`; the app exists, while deployment validation remains unverified.

## High-priority drift defects

### P0 — ROADMAP Phase 6 contradicts the authoritative Learn/Teach boundary

`ROADMAP.md` still describes Lurexa Teach with class management, learner management and assignment workflows. That is superseded.

Authoritative ownership is:

- **Lurexa Learn teacher workspace:** classes, assignments, learner progress, instructional delivery and classroom operations.
- **Lurexa Teach:** educator professional development, teacher CEFR/English growth, professional pathways, evidence/reflection, trusted assessment, credentials, community and professional recommendations.

This roadmap section should be rewritten before future implementation agents use it for feature planning.

### P0 — Ecosystem landing contains stale Teach positioning

`apps/web/app/page.tsx` currently describes Teach as `Human teaching` with learner signals and timing language. That copy reflects the older teacher-dashboard interpretation rather than the current professional-development product.

The landing page should position Teach around professional growth, evidence, credentials, development pathways and educator community.

### P1 — Ecosystem landing duplicates master/product SVG implementations

`apps/web/app/page.tsx` defines local `MasterMark` and `ProductIcon` SVG implementations even though canonical shared mark components exist in `@lurexa/ui`.

This already caused visual drift: changing `ProductMark` does not automatically change the ecosystem landing.

Recommended fix:

- import `MasterMark` and `ProductMark` from `@lurexa/ui`;
- delete local product-logo SVG copies;
- keep capability icons local or move them to a separate capability icon system if they become reusable.

### P1 — Product metadata exists in several independent sources

Product identity appears in:

- `Docs/00-Lurexa-Bible.md`;
- `ROADMAP.md`;
- `deployment/products.json`;
- `bootstrap/repository.json`;
- `apps/web/app/page.tsx`;
- related-experience mappings;
- shared UI mark types.

Not all of these should be merged into one file, because they serve different responsibilities. However, product **name, classification and ownership** should derive from one typed product registry or be validated against one.

Recommended future package/module:

`packages/config/src/product-registry.ts`

It should distinguish:

- parent/company;
- current products;
- shared ecosystem layers;
- ecosystem surfaces such as Docs;
- future concepts.

### P1 — Product URL environment variables need one documented contract

Related-experience components correctly use `NEXT_PUBLIC_LUREXA_*_URL` variables, but their expected names and deployment ownership should be documented centrally and validated in deployment configuration.

### P2 — Storybook coverage should include identity components

Shared brand components should have visual stories for:

- `MasterMark`;
- all `ProductMark` variants;
- `DocsMark`;
- `EcosystemLayerMark`;
- `RelatedExperiences`.

This would make accidental geometry or contrast regressions much easier to catch.

### P2 — Future-concept naming must remain non-authoritative

The roadmap mentions marketplace capabilities, public/partner APIs, native mobile, enterprise/institutional offerings and corporate learning. These are directions, not approved new top-level product names.

Concept assets under `packages/ui/brand/concepts/` must never be added to application navigation or `LurexaProduct` until an explicit product architecture decision approves them.

## Repository structure observations

- `bootstrap/repository.json` correctly preserves `apps/web` as required ecosystem web and `apps/docs` as required docs application.
- `apps/teacher-portal` remains a Lurexa Learn teacher surface; this is correct and must not be renamed to Teach.
- `apps/teach-web` exists as the independent Lurexa Teach application.
- `deployment/products.json` correctly lists Coach, Insight and Studio as future dedicated deployable web products when matching apps exist.
- Core and Mind are correctly represented as shared layers rather than Vercel end-user websites.
- Mobile currently belongs to Lurexa Learn in deployment metadata; a future native-mobile identity concept must not silently turn it into a separate product.

## Recommended implementation order

1. Rewrite the stale `ROADMAP.md` Phase 6 Teach section.
2. Refactor `apps/web` to consume shared brand components and update Teach copy.
3. Add the typed product registry and validate deployment/navigation metadata against it.
4. Document and validate cross-product URL environment variables.
5. Add Storybook visual coverage for the identity system.
6. Audit every product header/sidebar/favicon/metadata surface for canonical marks.
7. After PR retargeting, run full lint/typecheck/build and deployment validation before marking the brand rollout complete.

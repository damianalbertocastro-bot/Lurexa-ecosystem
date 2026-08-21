# Lurexa Brand and Product-Surface Repository Audit — 2026-08-21

Status: active audit record for the `feat/ecosystem-related-experiences` branch.

## Executive finding

The repository now has a stronger single-source pattern for product identity: canonical product classification/copy lives in the typed registry, while product geometry lives in shared UI brand components. The highest-risk implementation drift identified in the first pass—the ecosystem landing maintaining its own product catalog and SVG family—has been removed.

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
- Added `packages/config/src/product-registry.ts` as the typed registry for current products, shared layers, Docs and future concepts.
- Corrected `ROADMAP.md` Phase 6 so Teach owns educator professional growth rather than classroom operations.
- Refactored `apps/web/app/page.tsx` to consume shared `MasterMark` / `ProductMark` components and canonical product registry metadata.
- Removed stale `Human teaching` positioning and replaced it with Teach's professional-development positioning.
- Removed the landing page's duplicated local Master Mark and six duplicated product SVG definitions.

## Resolved high-priority drift defects

### RESOLVED — ROADMAP Phase 6 contradicted the authoritative Learn/Teach boundary

The roadmap now explicitly states:

- **Lurexa Learn teacher workspace:** class and learner management, assignments, operational scheduling, progress/intervention workflows and instructional delivery.
- **Lurexa Teach:** educator professional growth, professional learning pathways, evidence/reflection, trusted assessment, credentials, community and professional recommendations.

The Phase 6 exit condition now validates a professional-development product rather than a duplicate teacher dashboard.

### RESOLVED — Ecosystem landing contained stale Teach positioning

The landing now labels Teach around **Professional growth** and gets its canonical description from `lurexaProducts.teach`.

The shared-intelligence section also now distinguishes learner continuity across Learn/Coach from educator professional growth in Teach, while explicitly keeping classroom operations in Learn.

### RESOLVED — Ecosystem landing duplicated master/product SVG implementations

`apps/web/app/page.tsx` now consumes:

- `MasterMark` from `@lurexa/ui/MasterMark`;
- `ProductMark` from `@lurexa/ui/ProductMark`.

The local `MasterMark`, `ProductIcon`, and product SVG copies have been removed. Capability icons remain local because they are capability presentation, not canonical product identity.

### RESOLVED — Product metadata lacked a typed classification registry

`packages/config/src/product-registry.ts` now distinguishes:

- current products;
- shared ecosystem layers;
- ecosystem surfaces such as Docs;
- future concepts.

The ecosystem landing consumes the canonical product name, description and product ID from this registry. Landing-only concerns such as eyebrow text, CTA status, destination URL and display order remain local presentation configuration.

## Remaining improvement opportunities

### P1 — Formalize the `apps/web` → `@lurexa/config` package boundary

The current landing consumes the canonical registry source directly so this cleanup remains lockfile-neutral on the stacked PR. The preferred final dependency boundary is for `apps/web` to declare `@lurexa/config` as a workspace dependency and import from the package export once the lockfile is regenerated and validated in the normal repository execution environment.

Do not duplicate the registry locally as a workaround.

### P1 — Product URL environment variables need one documented contract

Related-experience components and the ecosystem landing use `NEXT_PUBLIC_LUREXA_*_URL` variables, but their expected names, ownership and fallback rules should be documented centrally and validated in deployment configuration.

### P1 — Validate registry consumers rather than allowing parallel catalogs to return

`deployment/products.json`, `bootstrap/repository.json`, related-experience mappings and future navigation still serve different responsibilities and should not be collapsed blindly. However, automated validation should ensure that any entry presented as a top-level product matches the typed registry classification and canonical name.

### P2 — Storybook coverage should include identity components

Shared brand components should have visual stories for:

- `MasterMark`;
- all `ProductMark` variants;
- `DocsMark`;
- `EcosystemLayerMark`;
- `RelatedExperiences`.

This would make accidental geometry or contrast regressions much easier to catch.

### P2 — Audit mark sizing after replacing local SVGs

The shared mark components intentionally own their geometry and currently render at their standard compact size. The ecosystem orbit/cards previously used local SVGs with page-specific dimensions. A visual verification pass should decide whether shared marks need a semantic `size` prop rather than reintroducing page-specific SVGs or brittle descendant CSS.

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

## Recommended implementation order from here

1. Formalize and validate the `apps/web` dependency on `@lurexa/config` when lockfile regeneration is available.
2. Document and validate cross-product URL environment variables.
3. Add automated registry validation for deployment/navigation surfaces.
4. Add Storybook visual coverage for the identity system.
5. Audit every product header/sidebar/favicon/metadata surface for canonical marks.
6. Add a semantic shared-mark sizing API if visual verification shows the ecosystem landing needs larger mark variants.
7. After PR retargeting, run full lint/typecheck/build and deployment validation before marking the brand rollout complete.

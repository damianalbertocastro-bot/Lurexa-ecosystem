# Lurexa Brand and Product-Surface Repository Audit — 2026-08-21

Status: active audit record for the `feat/ecosystem-related-experiences` branch.

## Executive finding

The repository now has a stronger single-source pattern for product identity: canonical product classification/copy lives in the typed registry, while product geometry lives in shared UI brand components. The highest-risk implementation drift identified in the first pass—the ecosystem landing maintaining its own product catalog and SVG family—has been removed.

The brand direction remains:

> **Shared grammar + distinct personalities.**

Learn and Teach deliberately retain their previously approved marks. Coach, Admin, Insight, Studio and Docs retain the newer personality-based marks. Core and Mind have dedicated ecosystem-layer identities without being promoted into end-user products.

**Lurexa Community** is now reserved as a future product concept with a dedicated mark, naming contract, product vision and architecture boundary. It is intentionally not part of the current six-product family and has no runtime application/deployment yet.

## Changes applied during this audit

- Restored the approved earlier **Lurexa Learn** mark in `ProductMark` and the canonical SVG source.
- Restored the approved earlier **Lurexa Teach** mark in `ProductMark` and the canonical SVG source.
- Preserved the newer Coach, Admin, Insight, Studio and Docs marks.
- Added canonical **Lurexa Core** and **Lurexa Mind** SVG marks.
- Added `EcosystemLayerMark` so Core/Mind can be represented without abusing `ProductMark`.
- Added a separate `brand/concepts/` area for future identity directions.
- Added Marketplace, API, Mobile and Enterprise identity concepts there; these remain non-authoritative capability/offering concepts.
- Added **Lurexa Community** as a stronger `future-product-concept`, with a dedicated social/network concept mark.
- Created the editable **Lurexa Brand System v3 — Community Future Product Concept** in Canva and recorded it in the brand README.
- Created `Docs/Product/LUREXA_COMMUNITY_FUTURE_PRODUCT_VISION.md`.
- Created `Docs/Architecture/LUREXA_COMMUNITY_FUTURE_ARCHITECTURE.md`.
- Added Community to the product personality system as a future concept without adding it to runtime current-product tokens.
- Updated the Product Portfolio document to distinguish Community, Teach Community and Learn discussions.
- Updated the brand README to distinguish parent identity, current products, shared layers, ecosystem surfaces, future product concepts and other future concepts.
- Corrected the deployment manifest brand name from `Lurexa Documentation` to **Lurexa Docs**.
- Replaced the obsolete Teach deployment status `pending-app-merge`; the app exists, while deployment validation remains unverified.
- Added `packages/config/src/product-registry.ts` as the typed registry for current products, shared layers, Docs and future concepts.
- Corrected `ROADMAP.md` Phase 6 so Teach owns educator professional growth rather than classroom operations.
- Refactored `apps/web/app/page.tsx` to consume shared `MasterMark` / `ProductMark` components and canonical product registry metadata.
- Removed stale `Human teaching` positioning and replaced it with Teach's professional-development positioning.
- Removed the landing page's duplicated local Master Mark and six duplicated product SVG definitions.

## Community concept guardrails

Community is deliberately prepared before implementation so future work begins from stable boundaries instead of an improvised social feature.

The reserved distinction is:

- **Lurexa Community:** future cross-ecosystem social learning product for learners and educators.
- **Teach Community:** educator-only professional collaboration feature inside Lurexa Teach.
- **Learn discussions:** class/course/lesson discussion needed for instructional delivery inside Lurexa Learn.

The governing evidence rule is:

> **Social activity is not trusted learning evidence by default.**

Posts, reactions, upvotes, follows, reputation and participation must not automatically alter CEFR, mastery, professional credentials or the trusted Learner Model. Any later evidence path requires an explicit Core-governed evidence contract.

Community must remain excluded from current product navigation, pricing, deployment and runtime `LurexaProduct`/current-product personality types until a later activation decision.

## Resolved high-priority drift defects

### RESOLVED — ROADMAP Phase 6 contradicted the authoritative Learn/Teach boundary

The roadmap now explicitly states:

- **Lurexa Learn teacher workspace:** class and learner management, assignments, operational scheduling, progress/intervention workflows and instructional delivery.
- **Lurexa Teach:** educator professional growth, professional learning pathways, evidence/reflection, trusted assessment, credentials, community and professional recommendations.

The Phase 6 exit condition now validates a professional-development product rather than a duplicate teacher dashboard.

### RESOLVED — Product Portfolio contained the older Teach interpretation

`Docs/Product/Product Portfolio and Boundaries.md` now uses the same professional-development definition as the Bible and roadmap. This matters for Community because Teach Community must be scoped against the current Teach model, not an obsolete teacher-operations model.

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
- future product concepts such as Community;
- other future capability/offering concepts.

The ecosystem landing consumes the canonical current-product name, description and product ID from this registry. Landing-only concerns such as eyebrow text, CTA status, destination URL and display order remain local presentation configuration.

## Remaining improvement opportunities

### P1 — Formalize the `apps/web` → `@lurexa/config` package boundary

The current landing consumes the canonical registry source directly so this cleanup remains lockfile-neutral on the stacked PR. The preferred final dependency boundary is for `apps/web` to declare `@lurexa/config` as a workspace dependency and import from the package export once the lockfile is regenerated and validated in the normal repository execution environment.

Do not duplicate the registry locally as a workaround.

### P1 — Product URL environment variables need one documented contract

Related-experience components and the ecosystem landing use `NEXT_PUBLIC_LUREXA_*_URL` variables, but their expected names, ownership and fallback rules should be documented centrally and validated in deployment configuration.

### P1 — Validate registry consumers rather than allowing parallel catalogs to return

`deployment/products.json`, `bootstrap/repository.json`, related-experience mappings and future navigation serve different responsibilities and should not be collapsed blindly. Automated validation should ensure that any entry presented as a current top-level product matches the typed registry classification and canonical name.

The validator should also reject `future-product-concept` and `future-concept` entries from current navigation/deployment unless explicitly activated.

### P2 — Storybook coverage should include identity components

Shared brand components should have visual stories for:

- `MasterMark`;
- all `ProductMark` variants;
- `DocsMark`;
- `EcosystemLayerMark`;
- `RelatedExperiences`.

Future-concept marks, including Community, can be shown in a brand governance/reference story without adding them to current product types.

### P2 — Audit mark sizing after replacing local SVGs

The shared mark components intentionally own their geometry and currently render at their standard compact size. The ecosystem orbit/cards previously used local SVGs with page-specific dimensions. A visual verification pass should decide whether shared marks need a semantic `size` prop rather than reintroducing page-specific SVGs or brittle descendant CSS.

### P2 — Community activation remains intentionally gated

Before Community implementation begins, the product and architecture activation gates require mature identity/authorization, privacy, moderation/reporting, social-content retention, recommendation governance and evidence-firewall rules.

Do not create `apps/community` simply because the brand and architecture are now prepared.

## Repository structure observations

- `bootstrap/repository.json` correctly preserves `apps/web` as required ecosystem web and `apps/docs` as required docs application.
- `apps/teacher-portal` remains a Lurexa Learn teacher surface; this is correct and must not be renamed to Teach.
- `apps/teach-web` exists as the independent Lurexa Teach application.
- Community has no app mapping yet by design.
- `deployment/products.json` correctly lists Coach, Insight and Studio as future dedicated deployable web products when matching apps exist.
- Core and Mind are correctly represented as shared layers rather than Vercel end-user websites.
- Mobile currently belongs to Lurexa Learn in deployment metadata; a future native-mobile identity concept must not silently turn it into a separate product.

## Recommended implementation order from here

1. Keep Community implementation deferred while preserving the new brand/product/architecture contracts.
2. Formalize and validate the `apps/web` dependency on `@lurexa/config` when lockfile regeneration is available.
3. Document and validate cross-product URL environment variables.
4. Add automated registry validation for deployment/navigation surfaces, including rejection of inactive future concepts.
5. Add Storybook visual coverage for the identity system.
6. Audit every product header/sidebar/favicon/metadata surface for canonical marks.
7. Add a semantic shared-mark sizing API if visual verification shows the ecosystem landing needs larger mark variants.
8. After PR retargeting, run full lint/typecheck/build and deployment validation before marking the brand rollout complete.

# Lurexa Product Shell Identity Audit — 2026-08-21

Status: **Current implementation audit — second pass complete**

## Scope

This audit covers current executable surfaces and their top-level identity signals: product naming, metadata, canonical marks, browser/app icons, cross-product navigation, shared mark hierarchy, and mobile product attribution. It does not replace route-by-route functional testing or curriculum/content QA.

## Ecosystem landing — `apps/web`

- Identity: **Lurexa Learning Technologies / master Lurexa**.
- Uses shared `MasterMark` and canonical current `ProductMark` components.
- Product names/descriptions come from the typed registry in `@lurexa/config`.
- Starter `Create Next App` metadata removed.
- Canonical master `app/icon.svg` is the single browser icon source.
- Cross-product product URLs are governed by the shared URL contract.
- Shared mark components now support semantic `sm`, `md`, and `lg` sizes so future hierarchy adjustments do not require local SVG copies or descendant CSS hacks.

Result: **aligned**.

## Lurexa Learn — `apps/learn-web`

- Identity: **Lurexa Learn**.
- Root metadata names Learn rather than the company-wide ecosystem.
- Canonical Learn `app/icon.svg` is now the single browser icon source; the remaining starter `favicon.ico` was removed in the second pass.
- Login and other auth surfaces route through the shared `ProductMark` via `LurexaLearnLogo` rather than maintaining a local logo implementation.
- Learn/Coach/Teach/Docs related-experience positioning preserves product boundaries.
- Coach remains a Learn-hosted route where configured that way, without turning Coach into the shared Mind layer.

Result: **aligned at shell and auth-identity level**.

## Learn teacher workspace — `apps/teacher-portal`

- Identity remains **Lurexa Learn | Teacher Dashboard**.
- This is intentionally not branded Lurexa Teach.
- Canonical Learn `app/icon.svg` is now the single browser icon source; the starter `favicon.ico` was removed.
- Existing metadata correctly reflects the Learn teacher-workspace responsibility.
- The second pass found duplicate Teach promotion: a large Teach sidebar card and mobile Teach card repeated the shared Related Experiences recommendation already appended by the layout.
- Those duplicate promotional cards were removed. The dashboard now stays operationally focused, while Related Experiences remains the deliberate cross-product recommendation surface.

Result: **aligned; duplicate cross-product promotion removed**.

## Lurexa Teach — `apps/teach-web`

- Identity: **Lurexa Teach**.
- Existing metadata positions Teach around educator growth, professional learning, credentials, and community.
- Canonical Teach `app/icon.svg` is the single browser icon source.
- Teach Community remains a feature identity inside Teach rather than a separate top-level current product.

Result: **aligned**.

## Lurexa Admin — `apps/admin-portal`

- Identity: **Lurexa Admin**.
- Dashboard header uses the canonical Admin `ProductMark`.
- Root product metadata is present.
- Canonical Admin `app/icon.svg` is now the single browser icon source; the remaining starter `favicon.ico` was removed in the second pass.

Result: **aligned**.

## Lurexa Docs — `apps/docs`

- Identity: **Lurexa Docs**.
- Existing metadata names Docs.
- Canonical Docs `app/icon.svg` is now the single browser icon source; the remaining starter `favicon.ico` was removed in the second pass.
- Dedicated Docs mark remains distinct from the master brand.
- `/brand` local QA route now exercises full/compact, inverse, product, layer, Docs, and semantic `sm`/`md`/`lg` sizing treatments.

Result: **aligned**.

## Mobile — `apps/mobile`

- Current classification: **Lurexa Learn mobile surface**, not a separate Lurexa Mobile product.
- Student Learn screen visibly identifies Lurexa Learn and uses the Learn family palette.
- Tutor screen identifies itself as learning support inside Lurexa Learn and labels its AI behavior as a prototype.
- Production learner intelligence remains governed by Core/Mind boundaries; the current simulated tutor is not presented as production Mind capability.

Result: **identity aligned; feature maturity remains separate work**.

## Related Experiences identity rule

The shared `RelatedExperiences` component previously exposed a generic `community` kind that rendered the Teach mark. That became ambiguous after reserving future **Lurexa Community**.

The runtime kind is explicitly `teach-community`. Until Lurexa Community is activated, there is no current-product runtime kind for it.

Related Experiences is also now treated as the preferred cross-product recommendation pattern. Individual product shells should avoid duplicating the same promotional content in sidebars or route-local cards unless the local action serves a distinct workflow purpose.

Result: **identity ambiguity and one duplicate recommendation pattern removed**.

## Semantic shared-mark sizing

The first implementation hardcoded a 36px glyph inside every shared mark component. That made parent containers appear larger without actually increasing the mark geometry and encouraged page-specific sizing selectors.

The shared identity components now use one semantic contract:

- `sm` — compact/navigation contexts;
- `md` — default lockup and general UI contexts;
- `lg` — hero, product-card, and visual-reference contexts.

The default remains `md`, so existing consumers do not change unexpectedly. Future visual tuning should use the semantic `size` prop rather than copying SVGs or styling internal descendants.

## Current products without dedicated apps

Lurexa Insight and Lurexa Studio have canonical marks, registry entries, personality rules, and future URL variables, but no current dedicated app shell in this repository. No fake shell was added merely to satisfy brand coverage.

Lurexa Community remains a future product concept and intentionally has no app shell, deployment entry, active navigation item, or current-product runtime type.

## Verification

Structural identity governance:

```bash
pnpm verify:brand-system
```

Registry/deployment/navigation governance:

```bash
pnpm verify:product-registry
```

Full local-first repository gate:

```bash
pnpm verify:local
```

Visual review:

1. run the Docs app locally;
2. open `/brand`;
3. inspect semantic sizes, full/compact lockups, inverse treatments, products, layers, Docs, and Related Experiences;
4. inspect actual current product routes locally before an intentional hosted release.

## Remaining shell opportunities

- Perform route-by-route browser review of authentication, loading, error, empty, and permission-denied states as those workflows are implemented or touched.
- Migrate ecosystem orbit/product-card marks to explicit semantic sizes when the landing receives its next local visual pass; do not use descendant selectors to resize shared marks.
- If Storybook is later activated, reuse the `/brand` QA matrix rather than creating a parallel identity contract.
- Continue keeping Insight, Studio, and Community out of runtime shells until their product activation/implementation phases.

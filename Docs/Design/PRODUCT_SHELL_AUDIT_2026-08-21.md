# Lurexa Product Shell Identity Audit — 2026-08-21

Status: **Current implementation audit**

## Scope

This audit covers current executable surfaces and their top-level identity signals: product naming, metadata, canonical marks, browser/app icons, cross-product navigation, and mobile product attribution. It does not replace route-by-route UX testing or curriculum/content QA.

## Ecosystem landing — `apps/web`

- Identity: **Lurexa Learning Technologies / master Lurexa**.
- Uses shared `MasterMark` and canonical current `ProductMark` components.
- Product names/descriptions come from the typed registry in `@lurexa/config`.
- Starter `Create Next App` metadata removed.
- Canonical master `app/icon.svg` added.
- Legacy starter `favicon.ico` removed so it cannot override the master identity.
- Cross-product product URLs are governed by the shared URL contract.

Result: **aligned**.

## Lurexa Learn — `apps/learn-web`

- Identity: **Lurexa Learn**.
- Root metadata now names Learn rather than the company-wide ecosystem.
- Canonical Learn `app/icon.svg` added.
- Learn/Coach/Teach/Docs related-experience positioning preserves product boundaries.
- Coach remains a Learn-hosted route where configured that way, without turning Coach into the shared Mind layer.

Result: **aligned at shell level**.

## Learn teacher workspace — `apps/teacher-portal`

- Identity remains **Lurexa Learn | Teacher Dashboard**.
- This is intentionally not branded Lurexa Teach.
- Canonical Learn `app/icon.svg` added.
- Existing metadata already reflected the correct Learn teacher-workspace responsibility.

Result: **aligned**.

## Lurexa Teach — `apps/teach-web`

- Identity: **Lurexa Teach**.
- Existing metadata already positions Teach around educator growth, professional learning, credentials, and community.
- Canonical Teach `app/icon.svg` added.
- Teach Community remains a feature identity inside Teach rather than a separate top-level current product.

Result: **aligned**.

## Lurexa Admin — `apps/admin-portal`

- Identity: **Lurexa Admin**.
- Dashboard header already uses the canonical Admin `ProductMark`.
- Root product metadata was missing and has been added.
- Canonical Admin `app/icon.svg` added.

Result: **aligned**.

## Lurexa Docs — `apps/docs`

- Identity: **Lurexa Docs**.
- Existing metadata already names Docs.
- Canonical Docs `app/icon.svg` added.
- Dedicated Docs mark remains distinct from the master brand.
- `/brand` local QA route now provides an identity reference surface for shared marks and Related Experiences.

Result: **aligned**.

## Mobile — `apps/mobile`

- Current classification: **Lurexa Learn mobile surface**, not a separate Lurexa Mobile product.
- Student Learn screen now visibly identifies Lurexa Learn and uses the Learn family palette.
- Tutor screen now identifies itself as learning support inside Lurexa Learn and labels its AI behavior as a prototype.
- Production learner intelligence remains governed by Core/Mind boundaries; the current simulated tutor is not presented as production Mind capability.

Result: **identity aligned; feature maturity remains separate work**.

## Related Experiences identity rule

The shared `RelatedExperiences` component previously exposed a generic `community` kind that rendered the Teach mark. That became ambiguous after reserving future **Lurexa Community**.

The runtime kind is now explicitly `teach-community`. Until Lurexa Community is activated, there is no current-product runtime kind for it.

Result: **ambiguity removed**.

## Current products without dedicated apps

Lurexa Insight and Lurexa Studio have canonical marks, registry entries, personality rules, and future URL variables, but no current dedicated app shell in this repository. No fake shell was added merely to satisfy brand coverage.

Lurexa Community remains a future product concept and intentionally has no app shell, deployment entry, active navigation item, or current-product runtime type.

## Verification

Structural identity governance:

```bash
pnpm verify:brand-system
```

Full local-first repository gate:

```bash
pnpm verify:local
```

Visual review:

1. run the Docs app locally;
2. open `/brand`;
3. inspect full, compact, inverse, product, layer, Docs, and Related Experiences treatments;
4. inspect the actual current product routes locally before an intentional hosted release.

## Remaining shell opportunities

- Perform route-by-route browser review of authentication and error/empty states when those workflows are next touched.
- Add a semantic mark-size API only if local visual review demonstrates a real sizing problem.
- If Storybook is later activated, move the existing `/brand` QA matrix into reusable stories rather than creating a parallel brand contract.
- Continue keeping Insight, Studio, and Community out of runtime shells until their product activation/implementation phases.

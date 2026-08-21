# Lurexa Brand Visual QA

Status: **Active local QA workflow**

## Why this exists

`apps/storybook` remains optional and is not currently present in the repository. Rather than introducing a new dependency tree only for identity inspection, Lurexa uses two local-first brand gates:

1. deterministic structural verification with `pnpm verify:brand-system`;
2. a visual identity reference route at `apps/docs/app/brand/page.tsx` (`/brand` when Docs runs locally).

This gives the current repository an immediately usable visual QA surface without adding Storybook packages or lockfile churn. If Storybook is activated later, the same cases below should become stories rather than creating a second visual contract.

## Required visual cases

The local `/brand` route must render:

- MasterMark — full and compact;
- ProductMark — Learn, Coach, Teach, Admin, Insight, Studio;
- DocsMark;
- EcosystemLayerMark — Core and Mind;
- semantic `sm`, `md`, and `lg` sizes;
- inverse/dark-background treatment;
- compact treatment;
- RelatedExperiences with Learn, Teach Community, and Docs examples.

Future concept marks, including Lurexa Community, stay outside current runtime product types until explicit activation.

## Semantic size rule

All shared mark components use the same `BrandMarkSize` contract:

- `sm` — navigation, dense controls, compact shell identity;
- `md` — default lockups and general UI;
- `lg` — hero, prominent card, and identity-reference contexts.

Do not resize the internal SVG through descendant CSS. If a new scale is genuinely required, extend the shared semantic contract rather than adding a page-local geometry rule.

## Manual review checklist

For each current mark check:

- recognizable at `sm` compact size;
- no clipping or distorted aspect ratio at `sm`, `md`, or `lg`;
- readable wordmark hierarchy;
- acceptable contrast on light and dark surfaces;
- consistent alignment with neighboring marks;
- focus-visible treatment where the mark is interactive;
- no accidental substitution of the master mark for a product mark;
- no use of Teach identity to represent future Lurexa Community.

For current web shells also check:

- exactly one canonical browser icon source (`app/icon.svg`);
- no legacy starter `favicon.ico` competing with the canonical icon;
- metadata title and description identify the correct product/surface.

For RelatedExperiences check:

- keyboard focus is visible;
- CTA hierarchy is understandable;
- product identity is correct;
- reduced-motion behavior does not depend on hover transforms;
- Teach Community is clearly educator-only and inherits Teach identity;
- a product shell does not repeat the same cross-product promotion elsewhere unless the local action serves a distinct workflow purpose.

## Automated gate

Run:

```bash
pnpm verify:brand-system
```

The command is also part of `pnpm verify:local` and GitHub CI.

## Storybook activation rule

If `apps/storybook` is created later, do not duplicate brand geometry or test data. Storybook should import the existing shared components and reproduce this QA matrix. Its initial story set should be generated from the same current-product list and must keep future concepts in a separate governance/reference section.

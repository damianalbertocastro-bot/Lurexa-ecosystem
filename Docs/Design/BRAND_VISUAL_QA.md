# Lurexa Brand Visual QA

Status: **Active local QA workflow**

## Why this exists

`apps/storybook` remains optional and is not currently present in the repository. Rather than introducing a new dependency tree only for identity inspection, Lurexa now has two local-first brand gates:

1. deterministic structural verification with `pnpm verify:brand-system`;
2. a visual identity reference route at `apps/docs/app/brand/page.tsx` (`/brand` when Docs runs locally).

This gives the current repository an immediately usable visual QA surface without adding Storybook packages or lockfile churn. If Storybook is activated later, the same cases below should become stories rather than creating a second visual contract.

## Required visual cases

The local `/brand` route must render:

- MasterMark — full and compact;
- ProductMark — Learn, Coach, Teach, Admin, Insight, Studio;
- DocsMark;
- EcosystemLayerMark — Core and Mind;
- inverse/dark-background treatment;
- compact treatment;
- RelatedExperiences with Learn, Teach Community, and Docs examples.

Future concept marks, including Lurexa Community, stay outside current runtime product types until explicit activation.

## Manual review checklist

For each current mark check:

- recognizable at compact size;
- no clipping or distorted aspect ratio;
- readable wordmark hierarchy;
- acceptable contrast on light and dark surfaces;
- consistent alignment with neighboring marks;
- focus-visible treatment where the mark is interactive;
- no accidental substitution of the master mark for a product mark;
- no use of Teach identity to represent future Lurexa Community.

For RelatedExperiences check:

- keyboard focus is visible;
- CTA hierarchy is understandable;
- product identity is correct;
- reduced-motion behavior does not depend on hover transforms;
- Teach Community is clearly educator-only and inherits Teach identity.

## Automated gate

Run:

```bash
pnpm verify:brand-system
```

The command is also the first step of `pnpm verify:local`.

## Storybook activation rule

If `apps/storybook` is created later, do not duplicate brand geometry or test data. Storybook should import the existing shared components and reproduce this QA matrix. Its initial story set should be generated from the same current-product list and must keep future concepts in a separate governance/reference section.

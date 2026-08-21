# Lurexa Docs Web

`apps/docs` is the web experience for the Lurexa ecosystem documentation. It is not the authoritative source by itself: the canonical Markdown sources remain under the repository-level `Docs/` directory.

## Purpose

The Docs website makes the repository knowledge system easier to navigate while preserving the same conceptual domains:

- Architecture
- Product
- Curriculum
- Engineering
- Governance
- Design

The site must not silently invent a second documentation hierarchy or contradict the Markdown sources it represents.

## Source-of-truth rule

When documentation conflicts, follow the repository hierarchy defined in `AGENTS.md` and `Docs/00-Lurexa-Bible.md`: newer explicit product-owner decisions take precedence, followed by the Bible and the applicable detailed specifications.

## Design direction

Lurexa Docs is a first-class ecosystem experience. It should use:

- the shared Lurexa master mark from `@lurexa/ui`;
- the shared navy / violet / blue / cyan visual family;
- strong information hierarchy and generous spacing;
- accessible focus states and touch targets;
- responsive documentation-domain navigation;
- reduced-motion behavior;
- clear distinction between authoritative source material and navigation/summary copy.

Avoid generic Create Next App styling, duplicate inline brand marks, fake search controls, or navigation that does not lead to a meaningful documentation destination.

## Local development

From the repository root:

```bash
pnpm --filter docs dev
```

The app is configured to run locally on port `3001`.

Verification before merge:

```bash
pnpm --filter docs check-types
pnpm --filter docs lint
pnpm --filter docs build
```

## Current portal structure

- `/` — documentation home and source-of-truth orientation
- `/architecture`
- `/product`
- `/curriculum`
- `/engineering`
- `/governance`
- `/design`

The domain pages currently provide repository-aligned navigation and context. Future document rendering/search should consume the canonical `Docs/` content rather than copy-pasting separate web-only versions.

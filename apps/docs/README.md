# Lurexa Docs Web

`apps/docs` is the web experience over the Lurexa ecosystem documentation. The repository-level `Docs/` directory remains the only canonical documentation source.

## Core rule

Do not copy canonical Markdown into `apps/docs` to make a web page. The web app discovers, indexes, renders, and searches `Docs/**/*.md` directly.

When a canonical file changes, the website should reflect that change without maintaining a second body of documentation.

## Documentation domains

- Architecture
- Product
- Curriculum
- Engineering
- Governance
- Design

The site must not invent a competing hierarchy or silently reconcile conflicting source files. Source-of-truth precedence remains governed by `AGENTS.md`, `Docs/00-Lurexa-Bible.md`, explicit newer decisions, and the applicable detailed specifications.

## Canonical content system

`lib/docs-content.ts` locates the repository-level `Docs/` directory, recursively indexes Markdown files, creates stable URL slugs, extracts titles/excerpts/headings, powers full-text search, and resolves relative Markdown-to-Markdown links into Lurexa Docs routes.

`app/docs/[...slug]/page.tsx` renders canonical documents.

Example:

```text
Docs/Architecture/Learner Model Architecture.md
        ↓
/docs/architecture/learner-model-architecture
```

`app/search/page.tsx` searches canonical titles, paths, and Markdown content. Search does not depend on a separately maintained index.

The Markdown presentation layer escapes raw HTML before rendering and supports headings/deep links, paragraphs, lists, blockquotes, fenced code, tables, inline emphasis/code, and links.

## Deployment

`next.config.js` sets the repository as the output-file tracing root and includes `../../Docs/**/*.md` so canonical Markdown remains available in the deployed Next.js server bundle.

## Design direction

Lurexa Docs is a first-class ecosystem experience and uses the shared Lurexa master mark, navy/violet/blue/cyan visual family, responsive navigation, accessible focus states, reduced-motion behavior, readable long-form typography, document table-of-contents navigation, and canonical source-path metadata.

## Routes

- `/` — documentation home and source-of-truth orientation
- `/architecture`
- `/product`
- `/curriculum`
- `/engineering`
- `/governance`
- `/design`
- `/search?q=...` — full-text canonical search
- `/docs/[...slug]` — canonical Markdown document renderer

## Local development

From repository root:

```bash
pnpm --filter docs dev
```

Before merge:

```bash
pnpm --filter docs check-types
pnpm --filter docs lint
pnpm --filter docs build
```

Repository CI uses a frozen pnpm lockfile. Never weaken that check to work around a stale workspace lock; regenerate and commit `pnpm-lock.yaml` with `pnpm install` when workspace dependencies change.

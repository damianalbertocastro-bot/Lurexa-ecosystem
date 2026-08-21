# Lurexa Cross-Product Public URL Contract

Status: **Normative configuration contract**

## Purpose

Every Lurexa surface must use the same environment-variable names and fallback rules when linking to another Lurexa experience. Product URLs are configuration, not product identity and not page-local constants.

The typed source of truth is `packages/config/src/product-urls.ts`.

## Active public URL variables

| Experience | Environment variable | Default/fallback |
| --- | --- | --- |
| Ecosystem | `NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL` | `https://lurexa.com` |
| Learn | `NEXT_PUBLIC_LUREXA_LEARN_URL` | `https://learn.lurexa.com` |
| Learn teacher workspace | `NEXT_PUBLIC_LUREXA_TEACHER_URL` | Learn URL |
| Coach | `NEXT_PUBLIC_LUREXA_COACH_URL` | `<Learn URL>/coach` while Coach remains a Learn-hosted surface |
| Teach | `NEXT_PUBLIC_LUREXA_TEACH_URL` | Ecosystem URL until a dedicated URL is configured |
| Admin | `NEXT_PUBLIC_LUREXA_ADMIN_URL` | Ecosystem URL until a dedicated URL is configured |
| Insight | `NEXT_PUBLIC_LUREXA_INSIGHT_URL` | Ecosystem URL until activated/configured |
| Studio | `NEXT_PUBLIC_LUREXA_STUDIO_URL` | Ecosystem URL until activated/configured |
| Docs | `NEXT_PUBLIC_LUREXA_DOCS_URL` | Ecosystem URL until a dedicated URL is configured |

## Future-product rule

`NEXT_PUBLIC_LUREXA_COMMUNITY_URL` is reserved but **inactive**. Its existence in an environment must not cause Community to appear in current navigation, deployment, pricing, or runtime product types. Community requires an explicit product activation decision first.

## Local-first behavior

Local development may override any active variable with a localhost URL. Do not hard-code local ports into the shared contract because applications may be run independently or with different port assignments.

Example local shell configuration:

```env
NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL=http://localhost:3000
NEXT_PUBLIC_LUREXA_LEARN_URL=http://localhost:3001
NEXT_PUBLIC_LUREXA_TEACH_URL=http://localhost:3002
NEXT_PUBLIC_LUREXA_ADMIN_URL=http://localhost:3003
NEXT_PUBLIC_LUREXA_DOCS_URL=http://localhost:3004
```

Those ports are examples only; the contract is the variable name, not the example port.

## Ownership rules

1. `@lurexa/config` owns environment-variable names and URL resolution rules.
2. Product apps own presentation text and route-specific CTA behavior.
3. Product registries own product identity/classification, not deployment URLs.
4. `deployment/products.json` may describe deployment topology but must not become a second naming source.
5. Future concepts must never become active navigation solely because an environment variable exists.
6. Client code may consume only `NEXT_PUBLIC_*` variables. Private service URLs must use separate server-only configuration.

## Validation

Run:

```bash
pnpm verify:brand-system
```

The verifier checks the canonical registry, mark assets, the URL contract, current shell metadata, and guards against accidental activation of Lurexa Community.

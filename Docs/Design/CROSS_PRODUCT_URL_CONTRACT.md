# Lurexa Cross-Product Public URL Contract

Status: **Normative configuration contract**  
Last reconciled: 2026-08-27

## Purpose

Every Lurexa surface must use centralized URL/domain resolution when linking to another Lurexa experience. Product URLs are configuration and deployment concerns, not product identity and not page-local constants.

Current typed sources:

- `packages/config/src/domains.ts` — active deployable ecosystem apps, canonical domains and local ports;
- `packages/config/src/product-urls.ts` — public cross-product URL/environment resolution including not-yet-active product fallbacks.

These sources overlap today and are scheduled for consolidation during platform/deployment reconciliation. Do not create a third URL registry.

## Active deployable app URLs

| Experience | Environment variable(s) | Canonical fallback | Local default |
| --- | --- | --- | --- |
| Ecosystem | `NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL` / supported root alias | `https://lurexa.org` | `http://localhost:3000` |
| Learn | `NEXT_PUBLIC_LUREXA_LEARN_URL` | `https://learn.lurexa.org` | `http://localhost:3001` |
| Learn Teacher Workspace | `NEXT_PUBLIC_LUREXA_TEACHER_URL` where compatibility requires it | Learn URL | Learn URL |
| Teach | `NEXT_PUBLIC_LUREXA_TEACH_URL` | `https://teach.lurexa.org` | `http://localhost:3002` |
| Admin | `NEXT_PUBLIC_LUREXA_ADMIN_URL` | `https://admin.lurexa.org` | `http://localhost:3003` |
| Docs | `NEXT_PUBLIC_LUREXA_DOCS_URL` | `https://docs.lurexa.org` | `http://localhost:3004` |
| Coach | `NEXT_PUBLIC_LUREXA_COACH_URL` | `https://coach.lurexa.org` | `http://localhost:3005` |

Coach is a standalone product. Its fallback must **never** regress to `<Learn URL>/coach`; Learn `/coach` is only a compatibility handoff.

## Products without active standalone application URLs

| Product / shell | Public variable | Current fallback behavior |
| --- | --- | --- |
| Insight | `NEXT_PUBLIC_LUREXA_INSIGHT_URL` | Ecosystem root until a standalone Insight app/deployment is activated |
| Studio | `NEXT_PUBLIC_LUREXA_STUDIO_URL` | Ecosystem root until a standalone Studio app/deployment is activated |
| Campus | `NEXT_PUBLIC_LUREXA_CAMPUS_URL` | Ecosystem root until a standalone Campus shell app/deployment is activated |

An environment-variable name or registry entry does not prove that a product is deployed.

## Future-product rule

`NEXT_PUBLIC_LUREXA_COMMUNITY_URL` is reserved but inactive. Its existence must not activate Community in current navigation, deployment, pricing, product types or entitlements. Community requires an explicit activation decision.

## Ownership rules

1. `@lurexa/config` owns public URL/domain variable names and resolution.
2. Product apps own CTA/presentation behavior, not canonical cross-product domain constants.
3. Product registry owns identity/classification, not proof of deployment state.
4. `deployment/products.json` describes intended deployment topology but is not proof that a project/domain is live.
5. Future/inactive concepts cannot become active merely because an environment variable exists.
6. Client code consumes only safe `NEXT_PUBLIC_*` values; private service endpoints/credentials remain server-only.
7. Learn Teacher Workspace is a Learn route surface, not an independent product/deployment.
8. Coach is an independent product/runtime surface even when launched from Learn or Teach.

## Validation

Relevant repository checks include:

```bash
pnpm verify:brand-system
pnpm verify:product-registry
pnpm verify:documentation-truth
```

Deployment reconciliation later compares these intended contracts with actual Vercel project/domain state before a surface is labeled deployed or production-live.

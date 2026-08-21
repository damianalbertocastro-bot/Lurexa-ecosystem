# Lurexa Product Registry Consumer Governance

Status: **Normative implementation contract**

## Purpose

`packages/config/src/product-registry.ts` is the canonical classification and naming source for Lurexa products, shared layers, ecosystem surfaces, and future concepts.

Other files may describe different operational concerns, but they must not silently create a second product catalog.

The governing principle is:

> **One classification source. Multiple purpose-specific consumers. No parallel product truth.**

## Canonical classifications

### Current products

- Lurexa Learn
- Lurexa Coach
- Lurexa Teach
- Lurexa Admin
- Lurexa Insight
- Lurexa Studio

Only entries classified as `product` may appear as current top-level products in ecosystem navigation.

### Shared layers

- Lurexa Core
- Lurexa Mind

These are platform/intelligence layers, not ordinary end-user product websites.

### Ecosystem surfaces

- Lurexa Docs

Docs is a supported ecosystem surface with its own identity, but it is not part of the six-product family.

### Future concepts

`future-product-concept` and `future-concept` entries are intentionally inactive. Their presence in the registry reserves naming, classification, and design direction; it does not authorize runtime navigation, deployment, pricing, or product-type promotion.

Lurexa Community currently remains `future-product-concept`.

## Consumer responsibilities

### `deployment/products.json`

Owns deployment topology only.

It may reference:

- the parent ecosystem web surface;
- current products;
- ecosystem surfaces such as Docs;
- shared layers in the dedicated `sharedLayers` section.

It must not activate `future-product-concept` or `future-concept` entries.

`futureProducts` means an approved current product whose dedicated deployable surface does not exist yet. It does **not** mean an unapproved/future concept.

### `bootstrap/repository.json`

Owns repository/app/package presence and required/optional bootstrap expectations.

It is not a product catalog.

Every deployable root in `deployment/products.json` must resolve to a required app entry in this manifest. Optional tooling surfaces such as Storybook may remain optional and absent.

### Ecosystem landing navigation

`apps/web/app/page.tsx` must:

- import canonical product identity from `@lurexa/config/product-registry`;
- type product ordering with `LurexaProductId[]`;
- include every current product exactly once;
- exclude shared layers, ecosystem surfaces, future-product concepts, and future concepts from the current six-product family grid.

Landing-only presentation such as eyebrow copy, CTA wording, destination fallbacks, and display order may remain local.

### Related Experiences

Current recommendation kinds may reference:

- current products;
- Docs;
- the parent ecosystem surface;
- explicit feature identities such as `teach-community`.

A feature identity must not masquerade as a top-level product. In particular, Teach Community is not Lurexa Community.

### Mobile

`apps/mobile` currently remains a Lurexa Learn surface. The existence of the future Mobile concept does not turn the native app into a separate current product.

## Automated verification

Run:

```bash
pnpm verify:product-registry
```

The verifier checks:

- registry key/id integrity;
- exactly six current products;
- deployment product names against canonical classifications;
- deployment roots against required bootstrap apps;
- future deployment targets against approved current products;
- shared-layer topology against the registry;
- ecosystem product navigation completeness/exclusivity;
- Related Experiences kinds and inactive-concept promotion;
- Lurexa Learn ownership of the current mobile surface.

The command is also part of:

```bash
pnpm verify:local
```

and GitHub CI.

## Activation procedure for a future product

When a future product concept is formally approved for activation, do not bypass the verifier. Change the source-of-truth model deliberately:

1. approve the product boundary and architecture;
2. move the registry entry into the current-product classification/type;
3. create its canonical runtime mark/component support;
4. add its app/workspace only when implementation starts;
5. update bootstrap/deployment topology as appropriate;
6. add URL contract/navigation only when the surface is real;
7. update Related Experiences intentionally;
8. run `pnpm verify:product-registry`, `pnpm verify:brand-system`, and the full local gate.

This prevents a URL, mock page, marketing card, or deployment configuration from accidentally becoming the mechanism that creates a new Lurexa product.

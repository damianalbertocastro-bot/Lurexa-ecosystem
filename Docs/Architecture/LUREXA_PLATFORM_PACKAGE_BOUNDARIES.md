# Lurexa Platform Package Boundaries

Status: normative repository policy  
Roadmap: R6 — Platform / Package Reconciliation

## Purpose

Shared packages exist to reduce duplication, not to blur authority. Every active package has one declared maturity class in `packages/package-boundaries.json`:

- **Production** — supported runtime implementation used by product surfaces.
- **Contract** — shared types, configuration or public contract helpers; must not own privileged persistence or authorization.
- **Test** — repository tooling, linting, build or test support.

Retired package names are recorded separately so repository history remains understandable without preserving dead runtime scaffolds.

## Current active package classification

| Package | Class | Governing role |
| --- | --- | --- |
| `@lurexa/backend` | Production | Shared implementation. Root barrel remains browser-safe; privileged capabilities use governed explicit server-only subpaths. |
| `@lurexa/ui` | Production | Shared UI grammar/primitives. |
| `@lurexa/utils` | Production | Runtime-neutral utility helpers. |
| `@lurexa/types` | Contract | Canonical cross-product/domain types. |
| `@lurexa/config` | Contract | Runtime-neutral product/domain configuration. |
| `@lurexa/sdk` | Contract | Typed cross-product/client contract helpers; never an authority store. |
| `@lurexa/tokens` | Contract | Canonical design-token contract. |
| `@lurexa/eslint-config` | Test | Quality/tooling configuration. |
| `@lurexa/typescript-config` | Test | TypeScript/tooling configuration. |

## Retired packages

Two zero-consumer legacy scaffolds are retired and their package directories are removed:

- `@lurexa/auth` — replaced by canonical product authentication and authorization through governed app/Core/backend boundaries.
- `@lurexa/database` — replaced by Core-owned backend repositories and trusted persistence boundaries.

Their names remain in `retiredPackages` inside `packages/package-boundaries.json` only to make the retirement explicit and enforceable. They are not workspace packages, supported imports, or compatibility surfaces.

## Backend import boundary

`@lurexa/backend` is intentionally split by import behavior:

1. The root barrel (`@lurexa/backend`) may expose browser-safe implementation only.
2. Privileged Firebase Admin, Google Cloud, Core, Mind and other trusted capabilities must be imported through explicit server-only subpaths from API routes, server components or other trusted server modules.
3. The supported server export patterns are `@lurexa/backend/*.server`, `@lurexa/backend/core/*.server`, and `@lurexa/backend/mind/*.server`.
4. An unrestricted `@lurexa/backend/*` package export or TypeScript path alias is prohibited because it would bypass the governed server boundary.
5. A file marked `"use client"` must never import a server-only backend subpath.
6. Privileged commerce, billing, entitlement and authorization mutations must never be added to the browser-safe root barrel.

The package may contain both client-safe and server-only source files, but source coexistence does not make them equivalent capabilities.

## Removed authority stubs

R6 removed three Phase-0-era abstractions that were unsafe to keep as supported runtime services:

- `billing.service.ts` — produced fabricated Stripe checkout URLs and treated client-readable subscription state as plan authority.
- `marketplace.service.ts` — could create listings, purchases and completed receipts directly from a client-capable Firestore service and returned demo inventory as if it were live.
- `ai-guardrails.service.ts` — coupled AI quota authorization to the prototype billing abstraction.

These capabilities may return only through authenticated server-owned contracts with Core-owned trusted state, provenance and audit.

## Authentication and persistence ownership

The retirement of `@lurexa/auth` and `@lurexa/database` does not move authority into product UI code. Canonical authentication, authorization and persistence remain governed through the current app/Core/backend architecture. New shared abstractions must preserve that ownership rather than recreate generic parallel packages.

## SDK boundary

`@lurexa/sdk` remains a contract package. It may expose typed request/response and cross-product helpers, but it must not:

- persist authoritative learner or educator records;
- grant permissions, qualifications or teaching authority;
- create commerce settlement or entitlements;
- import Firebase Admin or provider secrets;
- become a second implementation layer parallel to Core/backend services.

## CI enforcement

`scripts/verify-platform-package-boundaries.mjs` enforces the R6 package/runtime policy. It verifies:

- every active shared package has exactly one supported class;
- every retired package directory remains physically absent;
- retired package imports do not appear in runtime source;
- product build configuration does not retain retired-package hooks;
- `@lurexa/backend` does not expose an unrestricted wildcard subpath;
- the backend package export map and shared TypeScript path aliases expose the same governed server-only patterns;
- deleted prototype authority stubs stay deleted and out of the backend root barrel;
- Client Components do not import explicit backend server-only modules.

## R6 closure condition

Environment-contract normalization was completed in PR #75. This package/runtime-policy slice is the final R6 implementation gate. R6 is closed only after this exact branch head passes the protected `Verify Foundation & Build` gate, Product Deployment Validation, all review-thread requirements, and is merged to `main` under the repository ruleset.

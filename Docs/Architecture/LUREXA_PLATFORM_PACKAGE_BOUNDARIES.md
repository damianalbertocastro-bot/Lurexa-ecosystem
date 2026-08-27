# Lurexa Platform Package Boundaries

Status: normative repository policy  
Roadmap: R6 — Platform / Package Reconciliation

## Purpose

Shared packages exist to reduce duplication, not to blur authority. Each package has one declared maturity class in `packages/package-boundaries.json`:

- **Production** — supported runtime implementation used by product surfaces.
- **Contract** — shared types, configuration or public contract helpers; must not own privileged persistence or authorization.
- **Test** — repository tooling, linting, build or test support.
- **Deprecated** — legacy scaffold retained temporarily for compatibility/history; no new runtime consumers are allowed.

## Current package classification

| Package | Class | Governing role |
| --- | --- | --- |
| `@lurexa/backend` | Production | Shared implementation. Root barrel must remain browser-safe; privileged capabilities use explicit server-only subpaths. |
| `@lurexa/ui` | Production | Shared UI grammar/primitives. |
| `@lurexa/utils` | Production | Runtime-neutral utility helpers. |
| `@lurexa/types` | Contract | Canonical cross-product/domain types. |
| `@lurexa/config` | Contract | Runtime-neutral product/domain configuration. |
| `@lurexa/sdk` | Contract | Typed cross-product/client contract helpers; never an authority store. |
| `@lurexa/tokens` | Contract | Canonical design-token contract. |
| `@lurexa/eslint-config` | Test | Quality/tooling configuration. |
| `@lurexa/typescript-config` | Test | TypeScript/tooling configuration. |
| `@lurexa/auth` | Deprecated | Legacy session/context scaffold. Do not add new runtime consumers. |
| `@lurexa/database` | Deprecated | Legacy generic database abstraction. Core repositories supersede it. Do not add new runtime consumers. |

## Backend import boundary

`@lurexa/backend` is intentionally split by import behavior:

1. The root barrel (`@lurexa/backend`) may expose browser-safe implementation only.
2. Firebase Admin, Google Cloud and other privileged code must be imported through explicit server-only subpaths from API routes, server components or other trusted server modules.
3. A file marked `"use client"` must never import a server-only backend subpath.
4. Privileged commerce, billing, entitlement and authorization mutations must never be added to the browser-safe root barrel.

The package may contain both client-safe and server-only source files during migration, but source coexistence does not make them equivalent capabilities.

## Removed authority stubs

R6 removes three Phase-0-era abstractions that were unsafe to keep as supported runtime services:

- `billing.service.ts` — produced fabricated Stripe checkout URLs and treated client-readable subscription state as plan authority.
- `marketplace.service.ts` — could create listings, purchases and completed receipts directly from a client-capable Firestore service and returned demo inventory as if it were live.
- `ai-guardrails.service.ts` — coupled AI quota authorization to the prototype billing abstraction.

These capabilities may return only through authenticated server-owned contracts with Core-owned trusted state, provenance and audit.

## Authentication and persistence ownership

`@lurexa/auth` and `@lurexa/database` are deprecated scaffolds, not the production source of truth. New application code must use the governed app/Core/backend boundaries already responsible for identity, authorization and persistence. Their existence in the monorepo must not be interpreted as endorsement for new imports.

## SDK boundary

`@lurexa/sdk` remains a contract package. It may expose typed request/response and cross-product helpers, but it must not:

- persist authoritative learner or educator records;
- grant permissions, qualifications or teaching authority;
- create commerce settlement or entitlements;
- import Firebase Admin or provider secrets;
- become a second implementation layer parallel to Core/backend services.

## CI enforcement

`scripts/verify-platform-package-boundaries.mjs` enforces the first R6 boundary slice. It verifies:

- every shared package has exactly one declared class;
- deprecated package imports do not appear in runtime source;
- deleted prototype authority stubs stay deleted and out of the backend root barrel;
- Client Components do not import explicit backend server-only modules.

R6 remains **in progress** after this slice. Environment-contract normalization, broader backend export tightening and final deprecated-package removal require separate import-graph-safe changes.

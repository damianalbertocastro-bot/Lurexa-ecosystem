# Lurexa Core Analytics Projection

**Status:** implemented on `architecture/core-analytics-projections`  
**Date:** 2026-08-24

## Purpose

Define the first trusted platform-operations projection owned by Lurexa Core and remove fabricated analytics from product-facing services.

The governing rule is:

> Core owns trusted records and platform services. Products consume authorized projections; they do not manufacture operational truth in the browser.

## Platform Admin flow

```text
Lurexa Admin client
      |
      v
Firebase authenticated user
      |
      v
Admin Route Handler
      |
      v
Core PlatformAdminService
- verifies Firebase ID token
- requires role=super_admin
- reads trusted collections
- computes measured projection
      |
      v
PlatformAdminSnapshot
      |
      v
Lurexa Admin UI
```

Organization status changes follow the same authenticated server path.

## Measured metrics

The current MVP projection reports only values supported by trusted records:

- **Monthly active learners** — distinct learner IDs with progress activity in the trailing 30 days.
- **Organizations** — actual organization records.
- **AI tokens recorded** — sum of `tokenCount` on stored AI conversation records.
- **Student membership count** — actual organization members whose role is `student`.

The projection intentionally returns `null` for metrics that are not yet supported by a trusted source:

- monthly recurring revenue;
- system error-rate percentage.

The UI must present these as unavailable/not instrumented. It must not substitute estimates, placeholders, demo values, or AI-generated guesses.

## Authorization

`packages/backend/src/core/platform-admin.server.ts` is server-only.

Every platform read and organization-status mutation requires a verified Firebase ID token whose custom `role` claim is exactly `super_admin`.

The Admin login screen may check the same claim for user experience, but that client-side check is not an authorization boundary. Core re-verifies the token on every protected API request.

## Removed trust violations

The prior browser services contained several invalid patterns:

- hard-coded platform KPI values;
- hard-coded demo institutions;
- hard-coded learner names and risk metrics;
- a class-analytics query using an `orgId` field that does not exist on `StudentProgress`;
- fabricated “AI recommendations” presented beside operational analytics;
- organization status mutations directly through the browser Firestore SDK.

The legacy `AdminService` and `AnalyticsService` now fail closed rather than returning fabricated data. New callers must use an authorized Core projection appropriate to their product and purpose.

## Current scale limitation

This first commercial-MVP projection scans current trusted collections at request time. That is acceptable for the current low-volume stage but is not the long-term high-scale analytics architecture.

Before significant production volume, Core should maintain materialized/aggregated projections for platform operations. Those aggregates should preserve source timestamps, metric definitions, tenancy boundaries, and refresh provenance.

## Server/client dependency rule

Core platform administration must not be exported through the browser-safe `@lurexa/backend` root barrel. Product clients call an authenticated API/capability boundary; server Route Handlers import explicit server modules.

The repository verifier `pnpm verify:core-analytics` checks this boundary and prevents known fabricated metrics from returning.

## Next steps

1. Add trusted telemetry/observability projection before showing system error-rate metrics.
2. Add Core-owned commerce/billing projection before showing MRR or financial KPIs.
3. Evolve request-time scans into materialized analytics projections when usage justifies it.
4. Move additional legacy browser-side trusted mutations behind Core APIs.
5. Continue reducing wildcard server/client package exposure with explicit, verified package entrypoints.

## Product-owner intervention point

Code can enforce `role=super_admin`, but it cannot safely invent or assign that privilege. At least one real Firebase account must eventually receive the approved `super_admin` custom claim through trusted administrative tooling. That operational authorization is a product-owner/security action, not something the client app should self-provision.

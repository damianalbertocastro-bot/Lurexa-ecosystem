# Phase 2 — Entitlement Primitives Implementation

Status: Contract implemented
Date: 2026-09-18

## Implemented

- Added `@lurexa/types` entitlement primitives.
- Separated commercial context from subscription plan.
- Defined product and capability identifiers.
- Defined entitlement sources and lifecycle states.
- Defined subscription entitlement source with explicit Plus product selection.
- Defined educator benefit records separately from subscriptions.
- Defined organization grants separately from consumer subscriptions.
- Defined quota entitlements with product/capability/organization scope.
- Defined provenance records for trusted entitlement decisions.
- Defined a resolved-entitlements projection for product authorization checks.
- Added a Core server-side resolution service that consumes trusted records and never grants qualification or teaching authorization.

## Important boundary

This phase does not connect payment processors or allow clients to write entitlements.

The resolver is intentionally deterministic and accepts already-trusted records. Billing reconciliation, organization administration, educator verification, and professional qualification remain separate authorities.

## Compatibility

Existing subscription and billing contracts remain in place during reconciliation. They are not silently deleted because current applications still reference them.

The next migration phase should move consumers away from the mixed `SubscriptionTier`/enterprise model and legacy plan quota structure.

## Next

Phase 3 — Individual & Educator Entitlement Migration:
- make Plus product selection explicit in billing;
- migrate individual access checks to capabilities;
- separate consumer subscriptions from educator benefits;
- migrate quota checks to scoped quota contracts;
- remove production dependence on legacy mixed plan definitions;
- add verification gates.

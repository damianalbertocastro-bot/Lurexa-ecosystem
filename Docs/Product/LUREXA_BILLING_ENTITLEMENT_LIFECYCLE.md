# Lurexa Commercial Billing → Entitlement Lifecycle

Status: implementation contract baseline
Date: 2026-09-23

## Authority

Lurexa Core owns commercial state and entitlement projection. Payment providers supply verified commercial events; they do not authorize product access.

The required path is:

payment/provider event → verified billing event → Core billing state → entitlement snapshot → capability authorization → product runtime

A product must never interpret a payment-provider status directly.

## Individual subscriptions

The canonical individual tiers are Basic, Plus and Ultra.

Plus is product-scoped for Learn or Coach. Premium ElevenLabs is granted only to the subscribed product.

Ultra grants full Learn + Coach and their approved cross-product capabilities. It does not imply Teach, Studio or future-product access.

## Business

Business is an organization contract.

The effective commercial record is:

organization contract + product attachments + learner/seat allowance + negotiated usage + explicit capabilities

Business does not use the individual Basic/Plus/Ultra lifecycle.

## Entitlement mapping

Every billing transition must produce or recalculate an entitlement projection containing:

- customer/organization scope;
- purchased or contracted product;
- effective capability set;
- quota/allowance;
- effective timestamp;
- expiry/cancellation behavior;
- provenance to the originating billing event.

The authorization layer consumes this projection.

## Lifecycle

### Trialing

A trial may activate only the capabilities explicitly included in the trial contract. Trial expiry recalculates the entitlement rather than assuming a paid tier.

### Active

An active subscription or contract grants its effective capability projection for the current period.

### Past due

Past-due handling is a commercial state, not an immediate authorization implementation detail. Core applies the configured suspension/grace policy and records the resulting entitlement decision.

### Paused

A paused subscription has its capabilities suspended unless the commercial contract explicitly defines retained capabilities.

### Canceled

Cancellation revokes or schedules revocation according to the effective cancellation date recorded by Core.

### Expired

Expired commercial state has no active paid entitlement unless another independent entitlement source remains valid.

### Refunds and credits

Refunds and credits create auditable commercial adjustments. They must not silently mutate historical usage events.

## Usage interaction

Usage is recorded independently of billing events. Usage ledger records remain the detailed audit source. Monthly aggregates are derived reporting accelerators.

Any future billable overage calculation must reconcile authoritative Business pooled usage against attributed usage before invoicing.

## Production acceptance gate

Before enabling real payment collection:

1. provider webhook signatures are verified;
2. webhook/event processing is idempotent;
3. billing state transitions are deterministic;
4. entitlement activation/revocation is idempotent;
5. failed-payment/grace policy is explicitly configured;
6. cancellation and period-end behavior are tested;
7. refund/credit behavior is auditable;
8. financial reconciliation is implemented;
9. provider-backed end-to-end tests pass;
10. authorization consumes Core entitlement state rather than provider state.

## Legacy billing drift audit

The following legacy structures remain compatibility surfaces and must not become new authorization authorities:

- `PricingPlan` in `packages/types/src/user.ts`;
- `InstitutionalPlanTier` and `InstitutionalBillingAccount` in `packages/types/src/billing.ts`;
- legacy Stripe identifiers in the old `Subscription` shape;
- fixed per-seat price assumptions such as `pricePerSeatMonthlyUsd`.

They should be migrated behind the canonical commercial-billing and subscription contracts before legacy billing UI becomes production commerce.

The existing institutional admin screen is therefore a migration surface, not proof that those old commercial fields are authoritative.

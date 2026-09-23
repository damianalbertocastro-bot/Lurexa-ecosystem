# Lurexa Commercial Billing Architecture

Status: implementation design baseline
Date: 2026-09-23

## Purpose

This document defines the boundary between Lurexa commercial truth, runtime entitlement, usage accounting, and external payment processing.

## Commercial authority

Lurexa Core is authoritative for:

- which products a customer has purchased or contracted;
- which capabilities are entitled;
- applicable quotas and pooled allowances;
- entitlement effective/expiry state;
- organization/tenant scope;
- usage attribution and reconciliation.

A payment provider is not an authorization authority.

The required flow is:

Customer/payment event -> Core billing state -> entitlement resolution -> capability authorization -> product runtime.

## Individual subscriptions

Canonical individual tiers are:

- Basic
- Plus
- Ultra

Individual pricing is defined by `LUREXA_PRICING_PLANS`.

Plus premium ElevenLabs is product-scoped: Learn Plus receives premium voice for Learn; Coach Plus receives premium voice for Coach.

Ultra provides full Learn + Coach access and deeper cross-product capabilities. Ultra does not automatically grant Teach, Studio, or future-product access.

## Business

Business is an organization contract for small and medium organizations.

The commercial unit is:

organization contract + learner/seat allowance + negotiated usage.

Business is not represented as a public individual-style Basic/Plus/Ultra ladder.

Products are independently attachable through the organization contract, and capabilities are the authorization unit.

## Usage and billing

Usage evidence is recorded in the durable usage ledger with product, capability, provider, organization, user, entitlement source, billing period, and idempotency information.

Usage is reconciled against Business pooled usage before any future billable overage calculation.

The billing domain separates:

1. customer;
2. subscription or Business contract;
3. entitlement snapshot;
4. usage;
5. invoice;
6. payment;
7. refund/adjustment.

## Payment-provider boundary

Stripe is the current intended payment-provider boundary in the type contracts, but provider integration is not yet implemented.

Provider events must be idempotently processed and translated into Core billing state.

Provider status must never be used directly by product authorization code.

For example:

payment succeeded -> update Core commercial state -> resolve entitlement -> authorize capability.

Not:

payment succeeded -> product assumes access.

## Required production billing capabilities

Before production commerce is enabled, the system still needs:

- checkout/session creation;
- subscription creation and cancellation;
- trial lifecycle;
- payment-method handling;
- webhook verification and idempotent processing;
- invoice synchronization;
- payment failure/dunning state;
- refund and credit handling;
- proration policy;
- tax policy;
- currency policy;
- billing-period transitions;
- entitlement activation/deactivation;
- customer self-service billing portal;
- billing audit trail;
- financial reconciliation;
- production provider fixtures and end-to-end tests.

## Current implementation boundary

Already implemented:

- canonical individual pricing;
- capability-based entitlement resolution;
- Business contract model;
- pooled Business usage enforcement;
- durable usage ledger;
- idempotent usage recording;
- monthly usage aggregates;
- Business usage reconciliation;
- provider attribution;
- commercial UX source-of-truth documentation.

Not yet implemented:

- real payment collection;
- provider webhook runtime;
- production invoices;
- refunds/credits;
- dunning;
- tax;
- financial reconciliation against provider settlement.

The payment integration must begin only after the commercial and entitlement contracts remain green under CI.


## Legacy billing migration — implemented

Legacy organization fields (`plan`, `planTier`, `allocatedSeats`, and legacy entitlement flags) are now treated as migration inputs only.

The migration mapper writes a versioned Core-owned `organizations/{organizationId}.billing` record with:

- canonical commercial model (Campus or Business);
- institutional profile when applicable;
- explicit product attachments;
- explicit capabilities;
- seat allowance;
- billing state;
- legacy source provenance.

The migration is non-destructive: organizations that already contain a canonical billing record are not rewritten. The Admin billing endpoint exposes a superadmin-only migration operation for controlled execution.

No legacy fixed per-seat price is migrated as a commercial truth. No payment method, invoice, or provider event is fabricated.

## Canonical Admin billing — implemented

Admin billing now consumes `AdminBillingAccount` derived from the Core-owned organization billing record. Seat changes update the canonical seat allowance rather than the legacy `planTier` or `pricePerSeatMonthlyUsd` fields.

Invoices and payments are read only from synchronized Core collections. Empty collections mean that provider billing has not yet synchronized financial records.

## Stripe provider webhook — implemented baseline

Stripe is now an actual provider adapter rather than a placeholder checkout/webhook service.

The provider boundary:

`apps/learn-web/app/api/billing/webhook/route.ts` → verified Stripe adapter → Core webhook service → canonical billing records.

Webhook signatures are verified with the Stripe signing secret, timestamp tolerance is enforced, duplicate provider events are ignored after successful processing, and subscription/invoice/payment records are persisted under Core-owned billing collections.

Subscription events also produce an entitlement projection when the event contains the required user and product metadata. The existing user subscription fields are updated only as a compatibility projection; provider status is never used directly for runtime authorization.

Real checkout, customer portal, tax, dunning, refunds/credits, and provider settlement reconciliation remain separate production tasks.


## Billing hardening pass — improvements applied

The billing sequence was reviewed for authority, lifecycle integrity and operational recovery. The following improvements were applied before production testing:

- Entitlements are now a first-class typed snapshot rather than an ad-hoc Firestore shape. The snapshot carries identity, product, capabilities, quotas, effective/expiry timestamps, source and lifecycle status.
- Organization identity is preserved on provider subscriptions. Provider events carrying `organizationId` synchronize the organization billing record and create organization-scoped entitlement projections from the canonical contract.
- Invoice records retain subscription linkage when the provider supplies it, allowing invoice → subscription → entitlement tracing.
- Invoice statuses are normalized against the canonical lifecycle enum instead of blindly casting arbitrary provider strings.
- Reconciliation now compares Core subscriptions, invoices, payments and entitlement projections against the provider, including status, period, monetary totals and entitlement drift.
- Reconciliation is restricted to platform superadmins and is exposed as an explicit administrative operation rather than an automatic mutation.
- Billing server modules are exported through the governed `@lurexa/backend/billing/*` boundary instead of bypassing the package export policy.
- CI verification now checks the billing hardening contracts in addition to the migration and provider checks.

### Remaining production gates

The implementation should not be considered production-billing ready until these are demonstrated with real infrastructure:

1. Stripe test-mode webhook delivery against the deployed endpoint.
2. Signature rejection, replay/timestamp rejection and duplicate-event tests.
3. Checkout → subscription → invoice → payment → entitlement propagation.
4. Cancellation, payment failure and recovery lifecycle tests.
5. Business organization subscription → organization entitlement propagation.
6. Provider/Core reconciliation with deliberately introduced mismatches.
7. Firestore transaction/concurrency behavior under duplicate webhook delivery.
8. Secret/configuration verification on the authoritative production deployment.
9. Observability evidence for webhook failures, reconciliation issues and entitlement synchronization latency.

No automatic reconciliation repair is enabled yet. Reconciliation reports discrepancies; it does not silently overwrite Core state. This is intentional until the repair policy and audit trail are formally validated.

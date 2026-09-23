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

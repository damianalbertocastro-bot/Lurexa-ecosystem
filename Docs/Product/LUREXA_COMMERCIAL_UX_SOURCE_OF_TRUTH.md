# Lurexa Commercial UX Source of Truth

Status: Phase 19 implementation baseline

## Individual plans

LUREXA_PRICING_PLANS in packages/types/src/subscription.ts is the canonical individual public pricing definition for Basic, Plus and Ultra.

Public ecosystem pricing consumes this definition through PricingCards. Learn billing now consumes the same monthly and annual price fields rather than maintaining separate price literals.

## Commercial boundaries

- Plus premium ElevenLabs remains product-scoped.
- Ultra is full Learn + Coach and does not automatically include Teach, Studio or future products.
- Business is organization-contract based, quote based and capability driven.
- Business must not acquire invented public Basic/Pro/Enterprise-style bundles.
- Legacy institutional Enterprise identifiers are migration inputs, not the commercial authority.

## Drift prevention

Public pricing verification must reject customer-facing legacy Enterprise terminology and verify that Business remains quote based. Future pricing surfaces should consume canonical definitions rather than introducing local prices.

## Benefit communication

Pricing surfaces should explain the practical benefit of each included capability, not only name the feature. Entitlement, quota and provider behavior must remain consistent with the canonical commercial specification.

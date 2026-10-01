# Lurexa Commercial Capability Architecture — A–F Completion Contract

**Status:** Implementation sequence baseline  
**Scope:** Commercial Capability Enforcement → Product Consumption → Unified Identity/Product Switching → Business Administration → Usage Metering → Commercial Observability

## Architecture authority

The runtime authorization chain is:

`Identity → Entitlement → Capability → Product Action → Mind/Gateway → Provider`

Payment providers and product UI are not authorization authorities.

The canonical capability registry in `packages/types/src/capability-registry.ts` is the source of capability metadata. Runtime callers must resolve capabilities by registry ID. Caller-supplied capability definitions are not trusted.

## Phase A — Commercial Capability Enforcement

Completed implementation boundary:

- `authorizeCommercialCapability` resolves the capability from the canonical registry.
- Product/capability mismatches are rejected before execution.
- Disabled or unknown capabilities are rejected.
- Core user and organization records determine commercial context.
- Organization-scoped capabilities require an organization contract.
- Required entitlement capabilities are evaluated before runtime execution.
- `resolveAuthorizedCapability` remains only as a compatibility projection.

Acceptance gate:

- No protected AI/speech/organization capability may execute from a caller-supplied tier or capability object.

## Phase B — Product-Facing Entitlement Consumption

The product runtime consumes resolved capabilities rather than interpreting payment-provider state.

Current governed examples:

- Learn Mind roleplay uses the AI Gateway.
- Coach live streaming resolves `coach.live_streaming`.
- Premium Coach voice is represented as an explicit `coach.premium_voice` capability.
- ElevenLabs selection is entitlement-driven and never an automatic fallback.

Acceptance gate:

- Product code may request a capability ID, but it must not decide entitlement from Stripe state.

## Phase C — Unified Account and Product Switching

Shared Lurexa identity remains separate from product authorization.

The expected contract is:

`shared identity → destination product → server-side capability evaluation`

A learner must not create a second Lurexa identity to use another authorized product, while a shared identity must not imply access to every product.

Acceptance gate:

- Destination products independently authorize access after identity recognition.
- Product switching carries scoped context only; it does not carry an authorization decision.

## Phase D — Business Administration

Business remains an organization contract rather than an individual plan.

The authorization chain is:

`Organization Contract → Product Attachment → Role → Capability → Usage Policy`

Roles do not create commercial entitlements.

Acceptance gate:

- Organization capabilities and user roles are evaluated independently.
- Organization-scoped resources cannot be accessed using a client-supplied organization ID alone.
- Business product attachments remain independently configurable.

## Phase E — Usage Metering

Usage is recorded after the capability decision and attributed to:

- organization
- user
- product
- capability
- provider
- billing period
- entitlement source
- provider/model metadata where available

Idempotent usage events update the detailed ledger and monthly aggregate transactionally.

Acceptance gate:

- Duplicate usage events cannot increment aggregates twice.
- Business-attributed usage can be reconciled against pooled Business usage.

## Phase F — Commercial Observability

Commercial decisions must be explainable through an auditable chain:

`Identity → Organization → Contract/Subscription → Entitlement → Capability → Quota → Provider → Usage`

The usage ledger records provider outcome and latency where available. AI Gateway resilience events remain separate from authorization decisions.

Acceptance gate:

- Support and engineering can identify why a capability was granted, denied, metered, or routed to a fallback without reading provider billing state directly.

## Explicit non-goals

This contract does not authorize:

- automatic reconciliation repair;
- automatic ElevenLabs fallback;
- invented Business pricing;
- implicit Teach/Studio access from Ultra;
- product-local subscription authorities;
- client-controlled organization authorization.

## Promotion rule

A new Lurexa product or premium capability must be registered and pass the capability-level authorization, quota, tenant-isolation, usage-attribution and observability tests before production enablement.

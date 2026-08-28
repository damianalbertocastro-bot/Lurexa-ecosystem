# Lurexa Prototype Containment

Status: normative repository policy

## Purpose

Lurexa may retain prototypes when they are useful for product discovery, interaction design, curriculum validation, or future architecture work. A prototype must never present an unimplemented capability as operational.

## Governing rule

**Prototype usefulness does not confer production truth.**

A surface that is not backed by the authoritative Core/Mind/product boundary must identify itself as a prototype, preview, representative environment, or unavailable capability and must fail closed for trusted actions.

## Contained surfaces

### Marketplace

Marketplace is a future capability/concept. Current Learn routes may explain the concept but must not:

- create purchases or receipts;
- mark transactions completed;
- claim author earnings;
- claim Stripe/processor readiness;
- publish a listing for sale;
- grant licenses or entitlements;
- present fallback demo listings as live inventory.

Production activation requires a server-owned payment lifecycle, verified settlement/webhooks, Core-owned entitlements/licenses, publisher governance, audit, refund/dispute handling, and institutional purchasing policy.

### Billing

Teacher billing is a commercial-planning preview. It must not use hard-coded organizations or usage and must not link to fabricated provider checkout URLs. Production subscription state must follow an authenticated organization, authorized billing actor, server-created checkout, signed provider reconciliation, and Core-owned entitlement/audit records.

### Learn AI Tutor

A UI placeholder may describe the intended Learn Tutor capability but must not return canned/generated-looking responses and label them as live AI. Interactive tutoring activates only through the governed Learn Tutor server boundary with authorized lesson context and learner evidence/privacy rules.

### Campus

The current Learn-hosted Campus page is a representative institutional-shell prototype, not a live tenant. It must not claim a real institution, accreditation, SSO, entitlements, enrollment/faculty metrics, or institutional analytics. Campus remains structurally separate from the six sibling products.

### Studio

The current Teacher Workspace Studio page is an interaction prototype for future standalone Lurexa Studio. Locally created objects are not persisted, registered, governed, versioned, or published. A production Studio catalog must be Core-owned with provenance, versioning, permissions, validation and publication state; Mind may assist but may not own the authoritative record.

### Legacy Learn chat

Learn must not host a second Coach-like conversation experience. The legacy `/chat` route resolves through the canonical Coach entry.

## Product ownership distinctions

- Learn Teacher Insights are instructional operations inside Learn; they are not Lurexa Insight.
- Teacher Workspace Studio preview is not the standalone Lurexa Studio product.
- Learn may launch Coach but does not own Coach UI/runtime.
- Campus orchestrates products but is not a seventh sibling product.

## CI enforcement

`scripts/verify-prototype-containment.mjs` is a required part of `Verify Foundation & Build`. It detects known misleading production claims and ownership regressions. Because `main` requires that status check and has no bypass actors, contained prototypes cannot be merged back into misleading states without changing the governed contract through a passing pull request.

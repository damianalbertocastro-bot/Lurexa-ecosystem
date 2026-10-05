# Lurexa Commercial Production Readiness Runbook

## Gate 1 — Automated repository readiness

Required before live acceptance:

- CI billing verification is green.
- Commercial A–F verification is green.
- Product deployment validation is green.
- Cloudflare deployment topology validation is green.
- Observability contract validation is green.
- Cross-tenant and usage-ledger integration tests are green.

A green repository gate does not imply a live Stripe gate.

## Gate 2 — Stripe test-mode acceptance

Run with Stripe test credentials only:

1. Create a Checkout Session for the configured test price.
2. Complete the test subscription.
3. Deliver the resulting signed webhook to the deployed webhook endpoint.
4. Deliver the same event concurrently more than once.
5. Confirm exactly one canonical provider-event projection and no duplicate entitlement/usage state.
6. Change subscription state and deliver events out of order.
7. Confirm older provider events cannot regress canonical state.
8. Trigger a payment failure, recover payment, and verify entitlement state transitions according to the configured billing policy.
9. Set cancellation at period end and verify access remains active until the effective cancellation boundary.
10. Deliver the effective cancellation event and verify entitlement revocation.
11. Create a Business test subscription with the organization identifier in provider metadata.
12. Verify the event resolves only to the intended organization and creates the expected organization entitlement.
13. Attempt the same Business flow against another organization and require rejection.

## Gate 3 — Reconciliation acceptance

Deliberately corrupt one Core record at a time:

- provider subscription ID
- subscription status
- invoice status
- payment amount/status
- entitlement status
- entitlement capability set

Run reconciliation as an authorized superadmin.

Expected behavior:

- discrepancy is reported;
- provider and Core identifiers are shown in the discrepancy;
- no automatic repair occurs;
- unrelated tenants remain untouched.

Also verify provider-first detection where the provider contains a record absent from Core. The Stripe adapter now exposes bounded provider listing operations for subscriptions, invoices, and payments so reconciliation can report provider-only records without repairing them.

## Gate 4 — Production configuration

Production must contain, through the deployment secret/configuration mechanism:

- live Stripe secret key;
- Stripe webhook signing secret;
- Firebase trusted server credentials;
- required AI provider secrets;
- required speech provider secrets;
- production product URLs;
- deployment-specific callback/webhook URLs.

Secrets must never be committed to source control or pasted into support/debug output.

## Gate 5 — Commercial observability

Every protected commercial request must be explainable by:

Identity → Organization → Contract/Subscription → Entitlement → Capability → Quota → Provider → Usage.

At minimum retain:

- product;
- capability;
- organization;
- user;
- entitlement source;
- provider;
- model where applicable;
- outcome;
- usage units;
- latency where applicable;
- idempotency key for retryable usage;
- timestamp.

Sensitive prompt/audio payloads are not part of the commercial audit record.

## Gate 6 — Expansion readiness

Insight, Studio and Campus expansion requires:

- server-owned authorization;
- cross-tenant tests;
- usage attribution;
- observability/redaction;
- accessibility validation;
- deployment topology validation;
- product-specific runtime acceptance;
- explicit maturity evidence.

Campus remains an institutional orchestration shell, not a seventh sibling product.

## Environment-dependent status

The following cannot be marked passed by repository inspection alone:

- deployed Stripe webhook delivery;
- real payment failure → recovery;
- real Business metadata delivery;
- live production secret validation.

Those require the deployment and provider environments.
## Live acceptance execution

The repository now contains a manual GitHub Actions workflow at `.github/workflows/commercial-live-acceptance.yml` and a provider-backed harness at `packages/backend/scripts/test-commercial-live-acceptance.ts`.

Run the workflow only against Stripe test mode. It requires the GitHub Actions secrets `STRIPE_TEST_SECRET_KEY`, `STRIPE_TEST_WEBHOOK_SECRET`, and `STRIPE_TEST_PRICE_ID`. The workflow input `webhook_url` must point to the deployed Lurexa billing webhook for the same Stripe test environment.

The harness verifies the configured Stripe webhook endpoint, creates a real Stripe test subscription, delivers a signed event to the deployed endpoint, exercises concurrent duplicate delivery, cancellation-at-period-end, a stale out-of-order event, and effective cancellation. It does not claim payment-failure recovery, Business cross-tenant isolation, or production-secret readiness; those remain separate acceptance gates.


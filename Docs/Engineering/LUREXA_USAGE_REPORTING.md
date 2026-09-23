# Lurexa Usage Reporting

Status: Phase 18 implementation baseline

## Durable records

The usage ledger remains the detailed event source containing product, capability, provider, organization, user, entitlement source, billing period, usage units, provider model, idempotency key, latency and outcome.

Monthly organization aggregates are maintained transactionally in usage-ledger-monthly.

## Aggregate dimensions

Monthly aggregates contain total AI turns and voice minutes plus product, capability and provider breakdowns. Business-attributed usage is tracked separately so pooled Business consumption can be reconciled with the ledger.

## Idempotency

When an idempotency key is supplied, ledger creation and aggregate update occur in the same Firestore transaction. Duplicate events do not increment the aggregate twice.

## Business reconciliation

UsageReportingService.reconcileBusinessUsage compares the authoritative pooled business-usage record with Business-attributed ledger aggregate totals and returns explicit AI-turn and voice-minute deltas.

## Reporting retention

The ledger is the detailed audit record. Monthly aggregates are reporting accelerators. Retention, correction and replay operations must preserve the original event trail and rebuild aggregates rather than mutate historical events silently.

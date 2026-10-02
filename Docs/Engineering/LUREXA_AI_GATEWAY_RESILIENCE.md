# Lurexa AI Gateway Production Resilience

Status: Implemented contract

The AI Gateway is the only provider execution boundary for Mind AI capabilities.

## Runtime policy

- Provider timeout: 15 seconds.
- Safe transient retry: at most one retry for 408, 425, 429 and 5xx responses.
- Network/timeout failures are treated as transient.
- Non-transient provider responses are not retried.
- Circuit state is process-local and keyed by provider + capability.
- Circuit opens after 3 consecutive provider failures for 30 seconds.
- Circuit state never changes entitlement or authorization decisions.
- Capabilities with deterministic fallback may return deterministic fallback while the circuit is open or the provider fails.
- Capabilities with no fallback surface the provider failure.
- Runtime records latency and provider outcome in the usage ledger.
- Provider cost is optional metadata; no fabricated cost is calculated when provider billing data is unavailable.

## Promotion requirement

Empirical latency, error-rate and cost thresholds remain deployment acceptance criteria. The resilience mechanism is implemented, but threshold values must be validated against real traffic before a product is called production-ready.

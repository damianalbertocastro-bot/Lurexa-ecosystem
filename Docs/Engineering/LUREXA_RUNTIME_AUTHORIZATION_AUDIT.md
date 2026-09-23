# Lurexa Runtime Authorization Audit

Status: Phase 17 implementation baseline

## Authority chain

Identity → Entitlement → Capability → Mind task → AI/Speech Gateway → Provider

SubscriptionService remains the canonical entitlement resolver. resolveAuthorizedCapability is the server-owned runtime projection used by capability gateways.

## Completed audit changes

- AI Gateway resolves capability authorization before provider execution.
- Speech Gateway resolves capability authorization before provider execution.
- Coach live streaming now resolves the registered coach.live_streaming capability server-side instead of trusting a caller-provided tier.
- coach.live_streaming is a first-class capability with live_streaming entitlement.
- Business organization contracts are resolved from the server-owned organization record.
- Product/capability mismatches are rejected before provider execution.

## Deliberate authorities

- SubscriptionService: canonical entitlement and quota definition.
- QuotaEnforcementServerService: individual usage quota enforcement.
- BusinessUsageService: pooled Business usage enforcement.
- CapabilityRegistry: executable capability/provider/fallback contract.
- resolveAuthorizedCapability: server-side entitlement-to-capability authorization projection.

UI plan checks are presentation logic only and must not be treated as authorization.

## Remaining audit surface

Direct tier-based helpers such as hasTierAccess, module gating, and recommendation logic may remain where they explicitly consume the canonical subscription service for presentation or non-security product rules. Any backend path that grants access to protected data, AI, speech, streaming, organization resources, or cross-tenant data must use server-owned authorization.

## Cross-tenant rule

A learner ID and organization ID supplied by a client are not sufficient authority by themselves. The authenticated identity and server-owned organization membership must determine whether the requested organization context is valid before capability execution.

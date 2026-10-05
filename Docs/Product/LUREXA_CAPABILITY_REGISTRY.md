# Lurexa Capability Registry

**Status:** Architecture contract — Phase 8

The capability registry is the canonical bridge between commercial definitions and technical authorization/runtime.

## Required fields

Every governed capability records owner, product, plan/entitlement source, quota, AI provider, speech provider, authorization requirement, organization scope, description and enablement state.

## Resolution chain

commercial agreement -> entitlement set -> authorization -> capability -> gateway/runtime

A plan name is never a sufficient runtime authorization check.

## Provider rules

AI provider selection occurs only after capability resolution and through the AI Gateway.

Speech provider selection occurs only after speech capability resolution and through the Speech Gateway.

ElevenLabs is an explicitly entitled premium provider. It is never selected merely because a standard provider failed.

## Executable source

The registry is implemented in packages/types/src/capability-registry.ts. New production capabilities must be registered before enablement.

## Governance

Core owns trust and authorization primitives. Mind owns learning-intelligence task contracts. Products own experience contracts. Campus owns institutional orchestration.

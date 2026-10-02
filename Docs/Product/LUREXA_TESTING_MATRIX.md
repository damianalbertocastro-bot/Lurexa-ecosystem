# Lurexa Commercial Capability Testing Matrix

**Status:** Phase 15 contract

The test suite must test both commercial profiles and capabilities independently.

## Individual

- Basic learner
- Plus Learn
- Plus Coach
- Ultra

## Teach

- Teach Basic
- Teach Plus
- Verified educator
- Teach + educator Coach benefit

Teach commercial definitions must be approved before final public pricing tests are enabled.

## Institutional

- Campus Community
- Campus Standard
- Campus Pro
- Campus Enterprise legacy migration

Institutional tests must verify product attachment and capability resolution independently of profile names.

## Business

- Business contract with baseline capabilities
- Business contract with expanded capabilities
- Business contract with custom capabilities

No test may assume a public Business price or rigid Business SKU.

## Capability-level tests

For each premium capability verify:

- authorized access succeeds;
- missing entitlement fails;
- missing role authorization fails;
- missing quota fails;
- wrong product scope fails;
- wrong organization scope fails;
- provider policy is enforced;
- usage attribution records product, capability, provider and billing period.

## Provider-specific rules

ElevenLabs must be tested as an explicitly entitled provider. A standard-provider failure must never cause an automatic ElevenLabs selection.

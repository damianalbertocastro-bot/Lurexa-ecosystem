# Lurexa Capability Enforcement Architecture

**Status:** Phase 13 contract

Premium capability execution follows:

Frontend request
-> authenticated server boundary
-> entitlement resolution
-> capability resolution
-> authorization
-> quota/usage check
-> gateway/runtime
-> provenance and usage accounting

The frontend must never authorize a premium operation from a plan string.

Examples of prohibited authorization patterns include plan === ULTRA, plan === PLUS, or client-side selection of ElevenLabs.

## Server enforcement

The server must verify:

1. identity;
2. organization scope;
3. entitlement;
4. capability;
5. quota;
6. provider policy.

Only then may execution occur.

The capability registry is the canonical bridge. Provider choice is a runtime policy decision after capability resolution.

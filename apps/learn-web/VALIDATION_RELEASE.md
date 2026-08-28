# Lurexa Learn Validation Release

Validation cohort release ID: `2026-08-28-r2`

This product is included in the second empirical production-readiness validation release, cut after Testing Truth, institutional tenant isolation, parallel CI, accessibility baseline, observability, and truthful production speech-failure handling were established on the shared mainline.

The release is valid for formal user research only after:

- protected CI and Product Deployment Validation pass on the merged SHA;
- Vercel builds that exact mainline SHA for the Learn project;
- `https://learn.lurexa.org` resolves to that exact deployment;
- the entry/onboarding/auth/lesson handoff smoke path is reachable;
- accessibility baseline journeys remain green;
- runtime errors are checked after deployment;
- the exact deployment SHA, deployment ID, and canonical URL are recorded in the validation evidence.

This file is a release-intent record, not a claim that Lurexa Learn is production-ready. Empirical promotion remains governed by `Docs/Engineering/REAL_USER_VALIDATION_PROTOCOL.md`.

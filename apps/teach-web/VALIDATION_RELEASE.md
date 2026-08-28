# Lurexa Teach Validation Release

Validation cohort release ID: `2026-08-28-r2`

This product is included in the second empirical production-readiness validation release, cut from the same protected mainline as Learn and Coach after the production-reliability hardening sequence.

The release is valid for formal user research only after:

- protected CI and Product Deployment Validation pass on the merged SHA;
- Vercel builds that exact mainline SHA for the Teach project;
- `https://teach.lurexa.org` resolves to that exact deployment;
- educator entry, professional-growth, Coach handoff, and return smoke paths are reachable;
- runtime errors are checked after deployment;
- cross-product handoffs preserve educator-professional evidence semantics;
- the exact deployment SHA, deployment ID, and canonical URL are recorded in the validation evidence.

This file is a release-intent record, not a claim that Lurexa Teach is production-ready. Empirical promotion remains governed by `Docs/Engineering/REAL_USER_VALIDATION_PROTOCOL.md`.

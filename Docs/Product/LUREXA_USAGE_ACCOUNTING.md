# Lurexa Usage Accounting

**Status:** Phase 14 contract

Usage must be attributable at minimum by:

- product;
- capability;
- provider;
- organization;
- user;
- subscription or entitlement source;
- billing period.

The canonical event stream is implemented by UsageLedgerService in packages/backend/src/usage-ledger.server.ts.

Business pooled quota remains separately enforceable through BusinessUsageService. The usage ledger adds attribution detail without replacing quota enforcement.

This allows reporting such as Coach + premium voice + ElevenLabs + organization + learner + billing period rather than one undifferentiated voice total.

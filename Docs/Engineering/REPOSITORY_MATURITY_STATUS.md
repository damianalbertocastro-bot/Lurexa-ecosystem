# Lurexa Repository Maturity Status

Updated: 2026-08-27

This document is the operational maturity truth model for the Lurexa repository. It complements product architecture documents; it does not replace them.

## Maturity vocabulary

Every product, surface, capability, or program should use the highest state it can actually prove:

1. **Concept** — direction or product intent exists, but no governed implementation is claimed.
2. **Architecture** — ownership, contracts, boundaries, and intended topology are defined.
3. **Prototype** — useful implementation exists for validation or reference, but may use representative/local/demo behavior and is not production truth.
4. **Contract implemented** — governed types/services/interfaces exist and are verified, but a complete end-user MVP is not implied.
5. **MVP implemented** — the intended MVP flow exists in repository code.
6. **Verified** — the implemented scope passes the repository's relevant automated quality/security/architecture gates.
7. **Deployed** — a dedicated intended runtime/deployment exists and is reachable in the target environment.
8. **Production ready** — deployment, operational ownership, security, monitoring, data governance, acceptance testing, and truthful UX are all complete for the stated scope.

A lower maturity state is not a failure. It is an accurate statement of what is ready to depend on.

## Current ecosystem maturity

| Area | Structural role | Current maturity | Evidence / limitation |
| --- | --- | --- | --- |
| Lurexa Core | Shared trusted platform layer | Verified baseline | Trusted identity/evidence/authorization services and CI boundaries exist; platform capability reconciliation is still ongoing. |
| Lurexa Mind | Shared intelligence layer | Verified baseline | Storage-free interpretation and governed Core approval contracts are verified; broader product intelligence remains incremental. |
| Lurexa Learn | Sibling product | Verified MVP implementation | Learner runtime, onboarding, curriculum runner, Teacher Workspace and trusted evidence flows are implemented and verified. Production-readiness remains an operational/deployment acceptance claim, not a checkbox. |
| Lurexa Coach | Sibling product | Verified MVP implementation | `apps/coach-web` is the canonical standalone Coach surface; Learn/Teach launch it through governed bridges. Vercel project/domain provisioning remains a deployment task until independently verified. |
| Lurexa Teach | Sibling product | Verified MVP implementation | Standalone professional-development surface, educator growth path and governed evidence boundaries are implemented and verified. |
| Lurexa Admin | Sibling product | Verified contract/MVP subset | Educator qualification/authorization governance is implemented. Do not infer that billing, all institutional operations, or production deployment are complete. |
| Lurexa Insight | Sibling product | Architecture / contract foundations | Aggregation and teacher instructional intelligence foundations exist, but there is no canonical standalone `apps/insight-web` product yet. Learn Teacher Insights are a Learn feature, not Lurexa Insight. |
| Lurexa Studio | Sibling product | Architecture / prototype foundations | Knowledge Object/catalog contracts exist. The Learn Teacher Workspace Studio page is an explicitly local prototype, not the standalone product or authoritative publisher. |
| Lurexa Campus | Institutional shell | Architecture / representative prototype | Campus is not a seventh sibling product. The Learn-hosted Campus page is representative only; no real tenant, SSO, entitlement, enrollment or institutional analytics claims are made. |
| Lurexa Marketplace | Future concept/capability | Concept / contained prototype | Transactions, receipts, payouts and publishing are disabled. A server-owned commerce and entitlement architecture is required before activation. |
| Billing / subscriptions | Core/Admin capability direction | Prototype / planning only | Current user-facing billing surface is non-transactional. Real payment settlement, webhook reconciliation and trusted subscription records are required. |
| Learn mobile | Learn product surface | Architecture / implementation subset | Expo app exists, but dedicated mobile quality/release validation is not yet equivalent to the web product gates. |
| Community | Future product concept | Concept | Not a current product or active deployment target. Teach Community/professional circles are distinct from a future Lurexa Community product. |

## Deployment truth

`deployment/products.json` declares intended deployable topology. Its status field is repository intent and must not be treated as proof of live production health by itself.

A deployment can only be called **Deployed** or **Production ready** after the Deployment Reconciliation program verifies the corresponding external Vercel project/domain/environment and runtime acceptance checks.

Shared layers Core and Mind are not standalone web products. Learn Teacher Workspace is a surface inside the Learn deployment, not a second product deployment. Campus may become its own application while remaining structurally an institutional shell.

## Roadmap semantics

Detailed roadmap checkboxes may record that a scoped implementation task exists. They do **not** independently mean that the product or phase is production-ready.

Every major roadmap phase should therefore carry an explicit maturity statement and exit evidence. Product launch decisions must use this maturity model, not checkbox totals.

## Promotion rule

A surface may move to a higher maturity state only when the repository can point to concrete evidence for that state. In particular:

- Prototype → Contract implemented requires governed ownership/contracts rather than local/demo state.
- Contract implemented → MVP implemented requires the intended end-user flow.
- MVP implemented → Verified requires applicable CI/security/architecture gates.
- Verified → Deployed requires the intended external runtime/project/domain.
- Deployed → Production ready requires operational acceptance, monitoring, security, governance and truthful UX.

Never promote maturity solely because a page exists, a roadmap checkbox is checked, or a mock/demo flow renders successfully.

# Lurexa Roadmap

Last reconciled: 2026-08-27

This roadmap describes **repository maturity**, not marketing readiness or a release promise. A checked implementation detail is not automatically a deployed or production-ready product.

## Strategic source of truth

Lurexa is the commercial multi-product EdTech ecosystem built by **Lurexa Learning Technologies**. The earlier thesis prototype is a validation/reference artifact only.

```text
Lurexa Learning Technologies
│
├── Shared ecosystem layers
│   ├── Lurexa Core — trust, identity, authorization, persistence and authoritative records
│   └── Lurexa Mind — interpretation, personalization, adaptation and AI/learning intelligence
│
├── Six sibling products
│   ├── Lurexa Learn
│   ├── Lurexa Coach
│   ├── Lurexa Teach
│   ├── Lurexa Admin
│   ├── Lurexa Insight
│   └── Lurexa Studio
│
├── Institutional orchestration shell
│   └── Lurexa Campus
│
└── Shared signature experience system
    ├── Learner Pulse
    ├── Adaptive Learning Path
    ├── Memory Thread
    ├── Mind Trace
    ├── Product Bridge
    └── Knowledge Object
```

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Core and Mind are shared layers, not end-user products. Campus is structurally different from the six sibling products. Teacher Workspace is an operational surface inside Learn. Learn Teacher Insights are not the standalone Insight product. The Learn-hosted Studio page is currently only a contained interaction prototype and is not the standalone Studio product.

## Maturity vocabulary

Every major capability or product should use these states instead of a single completion checkbox:

1. **CONCEPT** — product/capability intent exists; no implementation claim.
2. **ARCHITECTURE** — ownership, boundaries and contracts are defined.
3. **PROTOTYPE** — representative interaction or technical proof exists; it is not production truth.
4. **CONTRACT_IMPLEMENTED** — governed interfaces/services exist and are testable.
5. **MVP_IMPLEMENTED** — the intended minimum product journey exists in code.
6. **VERIFIED** — repository CI/emulator/build checks validate the implemented scope.
7. **DEPLOYED** — a verified runtime is available in the intended environment.
8. **PRODUCTION_READY** — operational, security, privacy, reliability, support and acceptance requirements are satisfied.

A product may satisfy several earlier states while not satisfying later ones. `VERIFIED` does not imply `DEPLOYED`; `DEPLOYED` does not imply `PRODUCTION_READY`.

## Current maturity snapshot

| Surface / capability | Current maturity | What is true now | What is not yet claimed |
| --- | --- | --- | --- |
| Lurexa Core | VERIFIED baseline | Trusted server boundaries, learner evidence/context, educator qualification/authorization, tenant-aware projections and governance tests exist | Complete enterprise platform maturity |
| Lurexa Mind | VERIFIED baseline | Storage-free interpretation, recommendations, learning/professional intelligence contracts and Core approval boundaries exist | Autonomous authority or independent persistence |
| Lurexa Learn | VERIFIED MVP scope | Learner onboarding, curriculum runtime, evidence persistence, Teacher Workspace, Signature Experience and governed learning capabilities are implemented/tested | Full production-readiness across every course/device/environment |
| Lurexa Coach | VERIFIED MVP scope | Standalone `apps/coach-web`, adaptive practice, educator-professional mode, Product Bridge returns and privacy boundaries are implemented/tested | Production deployment/operations are tracked separately from repository verification |
| Lurexa Teach | VERIFIED MVP scope | Standalone educator professional-development surface, growth paths, credentials/review and governed Coach benefit integration exist | Complete commercial PD catalog and production operations |
| Lurexa Admin | VERIFIED governance scope | Educator qualification review, teaching authorization and governance foundations exist | Complete institutional administration/billing suite |
| Lurexa Insight | ARCHITECTURE | Product identity and analytics ownership direction are defined; Learn has instructional teacher insights | A standalone Insight application or production institutional analytics product |
| Lurexa Studio | PROTOTYPE + CONTRACT_IMPLEMENTED foundations | Governed Knowledge Object/catalog services exist; Teacher Workspace contains a clearly labeled local authoring prototype | Standalone Studio, authoritative authoring UI, publication workflow or production catalog management |
| Lurexa Campus | PROTOTYPE + ARCHITECTURE | Campus is defined as an institutional shell; a representative contained prototype demonstrates orchestration | Real tenant workspace, SSO, live entitlements, institutional metrics or production Campus app |
| Marketplace | CONCEPT | Commerce direction remains available for future design | Purchases, receipts, publisher earnings, Stripe readiness, licenses or live marketplace inventory |
| Billing | PROTOTYPE / planning | Plan concepts and activation requirements are documented in a contained preview | Real checkout, subscription settlement or live billing state |
| Learn mobile | PROTOTYPE / implementation foundation | Expo/mobile workspace exists and remains a Learn surface | Production mobile release readiness |
| Signature Experience System | VERIFIED baseline | Six shared primitives/contracts, projections and Learn/Coach continuity are tested | Universal rollout across every future product |

## Current execution sequence

The repository reconciliation program takes priority over broad product expansion:

1. **Security & Governance — DONE**
   - secret/temp artifact hygiene;
   - CODEOWNERS and repository hygiene verification;
   - protected `main` ruleset with no bypass actors;
   - required `Verify Foundation & Build`, PR-only merge path, current-branch checks, resolved conversations, no deletion/force pushes.

2. **Ecosystem Reconciliation — DONE**
   - exactly six sibling products;
   - Campus separated as institutional shell;
   - Teacher Workspace remains inside Learn;
   - Core/Mind remain shared layers.

3. **Coach first-class reconciliation — DONE**
   - standalone Coach application/runtime ownership;
   - Learn/Teach Product Bridge entry and return paths;
   - independent validation contract.

4. **Prototype Containment — DONE at repository policy/implementation level**
   - Marketplace purchase/publish claims disabled;
   - billing fake checkout removed from user-facing flow;
   - fake AI tutor behavior removed;
   - Campus/Studio explicitly labeled as representative/local prototypes;
   - legacy Learn chat hands off to Coach;
   - required CI verifier prevents regressions.

5. **Roadmap & documentation truth — IN PROGRESS**
   - adopt maturity vocabulary;
   - align README/runtime/tooling facts;
   - remove stale Coach/Campus/Studio/Insight claims;
   - make authoritative docs and agent context agree.

6. **Platform/package reconciliation — NEXT**
   - classify every package as Production, Contract, Test or Deprecated;
   - remove/contain stale scaffold abstractions;
   - strengthen browser/server import boundaries;
   - reconcile dependency and environment contracts;
   - strengthen mobile quality gates.

7. **Deployment reconciliation — LATER**
   - compare repository topology with live Vercel projects/domains;
   - retire obsolete projects/aliases;
   - define deployment lifecycle states;
   - establish repository-to-runtime health verification.

8. **Product expansion foundations — AFTER RECONCILIATION**
   - establish standalone Insight foundation;
   - establish standalone Studio foundation;
   - establish Campus application foundation;
   - keep Marketplace deferred until real commerce governance exists.

## Product-specific next gates

### Learn

Current focus after reconciliation:

- controlled end-to-end acceptance on representative learner and educator identities;
- accessibility/mobile/low-bandwidth validation;
- curriculum production validation by level rather than equating bundle existence with instructional readiness;
- production environment/deployment acceptance.

### Coach

Current focus after reconciliation:

- provision/verify the canonical Coach deployment and domain during deployment reconciliation;
- validate learner and educator-professional sessions in a real cross-domain environment;
- deepen pronunciation history only through governed Core projections;
- continue Dominican Spanish specialization without accent-erasure framing.

### Teach

Current focus after reconciliation:

- professional evidence pipeline beyond Coach;
- richer educator-development catalog and assessment validity;
- controlled qualification/readiness integration without allowing Mind to grant authority.

### Admin

Current focus after reconciliation:

- expand organization governance only where the Core authorization model exists;
- preserve the separation between qualification review and teaching authorization;
- defer real billing state until trusted commerce/payment architecture exists.

### Insight

Foundation requirements before MVP status:

- standalone product ownership and application boundary;
- institution/cohort analytics contracts distinct from Learn Teacher Insights;
- aggregation/privacy thresholds and tenant authorization;
- measured data only—no fabricated platform metrics;
- interpretable provenance for recommendations/risk signals.

### Studio

Foundation requirements before MVP status:

- standalone application boundary;
- Core-owned Knowledge Object persistence, provenance, permissions and versioning;
- draft/review/approval/publish lifecycle;
- A1–C2 curriculum alignment;
- Mind-assisted authoring that cannot publish or overwrite authoritative content by itself.

### Campus

Foundation requirements before MVP status:

- standalone institutional-shell application;
- Core-owned organization/tenant resolution;
- real entitlement-aware navigation;
- SSO only after an actual identity integration exists;
- purpose-scoped Product Bridges preserving institution context;
- no independent learner truth or product-domain ownership.

### Marketplace and commerce

Remain **CONCEPT** until all of the following exist:

- authenticated/authorized publisher and buyer;
- server-owned payment intent;
- verified provider settlement/webhook;
- Core-owned license/entitlement and transaction records;
- refund/dispute/audit policy;
- publisher payout/tax/compliance model;
- no browser-authoritative `completed` purchase state.

## Curriculum truth

The English portfolio targets A1–C2 and is represented in governed curriculum planning/runtime artifacts. Repository bundle/runner coverage must not be used as a synonym for classroom validation or production readiness. Production maturity should be stated per level/module based on content QA, assessment validity, learner testing and runtime acceptance.

Coach and Teach curricula are separate governed programs connected to the same ecosystem identity/evidence architecture.

## Quality and governance requirements

All new work must preserve:

- protected `main` and PR-only merge flow;
- required `Verify Foundation & Build` status;
- Core authorization before trusted state access/mutation;
- Mind as interpretation rather than authority;
- evidence vs inference separation and provenance;
- one persistent cross-product learner model;
- professional evidence separated from student learner evidence;
- exact-course educator authorization where student context is involved;
- prototype containment for unimplemented capabilities;
- truthful deployment/product maturity language;
- accessibility, privacy and low-bandwidth considerations appropriate to the product scope.

## Repository architecture rules

- Do not create competing learner truth per product.
- Do not move Teacher Workspace out of Learn merely to mirror branding.
- Do not collapse Coach back into Learn; Learn may launch Coach through governed continuity.
- Do not present Learn Teacher Insights as the standalone Insight product.
- Do not present the Learn-hosted Studio interaction preview as standalone Studio.
- Treat Campus as institutional orchestration, not a seventh product.
- Do not activate commerce with browser-owned payment/purchase state.
- Keep Core/Mind ownership separate from deployment/application naming.
- Treat documentation maturity separately from implementation maturity.

## End-state principle

> **Lurexa Learning Technologies builds the ecosystem.**  
> **Lurexa Core owns trust.**  
> **Lurexa Mind interprets learning.**  
> **Products deliver experiences and generate evidence.**  
> **Campus connects the institutional experience.**  
> **One learner. One evolving model. Every Lurexa experience adapts around it.**

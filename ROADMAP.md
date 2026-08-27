# Lurexa Roadmap

Updated: 2026-08-27

Lurexa is the commercial multi-product EdTech ecosystem built by **Lurexa Learning Technologies**. The earlier thesis prototype is a validation/reference artifact and does not define production architecture.

This roadmap distinguishes **implementation tasks** from **product maturity**. A checked task means that scoped repository work exists; it does **not** mean the containing product is deployed or production-ready.

## Maturity model

All phase-level status claims use the operational maturity vocabulary defined in `Docs/Engineering/REPOSITORY_MATURITY_STATUS.md`:

**Concept → Architecture → Prototype → Contract implemented → MVP implemented → Verified → Deployed → Production ready**

Promotion requires evidence for the new state. A page, mock, checked task, or manifest entry is never sufficient by itself.

---

## Ecosystem architecture

```text
Lurexa Learning Technologies
│
├── Shared ecosystem layers
│   ├── Lurexa Core
│   └── Lurexa Mind
│
├── Six sibling products
│   ├── Lurexa Learn
│   ├── Lurexa Coach
│   ├── Lurexa Teach
│   ├── Lurexa Admin
│   ├── Lurexa Insight
│   └── Lurexa Studio
│
├── Institutional shell
│   └── Lurexa Campus
│
└── Shared signature experience layer
    ├── Learner Pulse
    ├── Adaptive Learning Path
    ├── Memory Thread
    ├── Mind Trace
    ├── Product Bridge
    └── Knowledge Object
```

Core owns trusted records, identity, authorization, persistence, provenance and shared platform services. Mind interprets explicitly authorized evidence but does not grant permissions or own canonical persistence. Campus is structurally different from the six sibling products.

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

---

# Immediate reconciliation program

This program takes precedence over new product expansion until the repository, deployment topology and maturity claims agree.

## R1 — Security & Governance

**Maturity: Verified**

Completed scope:

- [x] Remove tracked temporary-value artifacts and reject their return through CI.
- [x] Add CODEOWNERS repository ownership.
- [x] Pin pnpm to 10.3.0 and keep CI aligned.
- [x] Add repository-hygiene verification to `Verify Foundation & Build`.
- [x] Establish active `main` ruleset requiring pull requests and `Verify Foundation & Build`.
- [x] Require branches to be current before merge.
- [x] Require review-thread resolution.
- [x] Block `main` deletion and non-fast-forward/force updates.
- [x] Keep bypass actor list empty.

Operational note: if a removed historical temp artifact ever contained a live credential, credential rotation/history remediation remains an external security action; file deletion alone cannot revoke a secret.

## R2 — Ecosystem Reconciliation

**Maturity: Verified**

- [x] Establish exactly six sibling products: Learn, Coach, Teach, Admin, Insight and Studio.
- [x] Classify Campus as institutional shell/orchestration experience.
- [x] Keep Core and Mind as shared layers rather than products.
- [x] Keep Learn Teacher Workspace inside Learn.
- [x] Keep Community as a future product concept.
- [x] Align product-registry and CI invariants to this taxonomy.

## R3 — Coach first-class product

**Maturity: Verified MVP implementation**

- [x] Create canonical standalone `apps/coach-web` workspace.
- [x] Make Coach the owner of speaking/pronunciation/fluency UI.
- [x] Keep Learn `/coach` routes as compatibility launch redirects only.
- [x] Route Teach educator professional-language practice directly to Coach.
- [x] Preserve learner → Learn and educator → Teach return loops.
- [x] Preserve learner/professional evidence separation.
- [x] Add independent Coach lint/type/build validation and product-boundary verification.

Deployment truth: the repository implementation is verified; independent external Vercel project/domain health is a later Deployment Reconciliation concern and must not be inferred from this phase.

## R4 — Prototype Containment

**Maturity: Verified containment**

- [x] Make Marketplace non-transactional and explicitly future/conceptual.
- [x] Remove fake purchase, receipt, sales and author-earnings claims from user-facing flows.
- [x] Make billing a non-transactional planning preview.
- [x] Remove canned Learn AI Tutor responses that presented themselves as live AI.
- [x] Redirect legacy generic chat to canonical Coach instead of owning another conversation product.
- [x] Make Campus a representative shell prototype without live institution/SSO/accreditation/entitlement/analytics claims.
- [x] Make Learn-hosted Studio explicitly local/non-persistent and represent A1–C2 honestly.
- [x] Add executable prototype-containment CI verification.

## R5 — Roadmap & Documentation Truth

**Maturity: Verified**

- [x] Define repository maturity vocabulary.
- [x] Add operational maturity matrix.
- [x] Reconcile root README with six products + Campus shell.
- [x] Document Coach as standalone rather than Learn-embedded.
- [x] Align Node/pnpm requirements with actual repository policy.
- [x] Remove ghost Storybook/runtime claims from the root workspace overview.
- [x] Correct Learn local port documentation.
- [x] Replace phase-level completion inflation with explicit maturity status.
- [x] Defer volatile external deployment-health claims to Deployment Reconciliation rather than treating repository manifests as proof.
- [x] Add executable documentation-truth verification to the required CI gate.

## R6 — Platform / Package Reconciliation

**Maturity: Pending**

Goals:

- classify every shared package as Production, Contract, Test or Deprecated;
- eliminate ambiguous/stale Phase-0 abstractions only after import-graph verification;
- separate browser-safe client services from privileged server-only capabilities more clearly;
- prevent authoritative commerce/billing/platform mutations from leaking into client-safe barrels;
- reconcile `@lurexa/auth`, `@lurexa/database`, `@lurexa/sdk` and `@lurexa/backend` responsibilities;
- normalize framework/dependency policy where runtime constraints allow;
- introduce canonical typed environment contracts and reduce duplicate environment names;
- remove temporary lint compatibility exceptions when underlying dead bindings are removed.

Exit evidence: package ownership and import boundaries are explicit, dead abstractions are removed/deprecated safely, and all repository gates remain green.

## R7 — Deployment Reconciliation

**Maturity: Pending**

Goals:

- reconcile `deployment/products.json` with live Vercel projects/domains/environments;
- use lifecycle states that distinguish declared/provisioned/preview-ready/production-live/retired;
- stop modeling Learn Teacher Workspace as a second independent deployment;
- provision/verify standalone Coach project and canonical domain;
- reconcile Admin project/domain aliases and remove wrong Learn-family aliases;
- verify Teach preview/production behavior;
- decide and document the authoritative Git-triggered vs explicit-release model;
- add automated repository ↔ deployment-topology drift detection where tool/API support permits.

Exit evidence: repository manifest and external hosting agree, with runtime acceptance evidence for every surface called deployed.

## R8 — Product Expansion Foundations

**Maturity: Pending**

Do not claim standalone product completion simply because a prototype route exists.

### Insight

Target maturity: **Contract implemented / standalone foundation**

- define institutional/cohort analytics product boundary separate from Learn Teacher Insights;
- define purpose-scoped aggregation contracts and privacy thresholds;
- introduce `apps/insight-web` only when the standalone product contract is ready;
- keep learner-level instructional actions owned by Learn.

### Studio

Target maturity: **Contract implemented / standalone foundation**

- define authoritative Knowledge Object authoring/versioning/publishing workflow;
- define provenance, review, approval and publication states;
- introduce `apps/studio-web` only when it can use governed Core records rather than local UI state;
- keep Learn Teacher Workspace prototype clearly non-authoritative until then.

### Campus

Target maturity: **Contract implemented / standalone shell foundation**

- define authenticated Core-owned organization resolution;
- define institutional role/entitlement projection and Product Bridge context;
- introduce `apps/campus-web` when the shell can use trusted tenant state;
- preserve Campus as orchestration shell, not seventh product owner.

Marketplace remains deferred until server-owned payment, entitlement, publisher/payout, refund/dispute and audit architecture exists.

---

# Horizontal Program S — Signature Experience

**Current maturity: Verified baseline across implemented scopes**

Detailed work lives in `Docs/Product/LUREXA_SIGNATURE_EXPERIENCE_ROADMAP.md`.

Implemented baseline includes:

- [x] v1 signature contracts and shared UI primitives.
- [x] Learner Pulse projection.
- [x] Memory Thread projection.
- [x] Adaptive Learning Path.
- [x] Mind Trace.
- [x] expiring/single-use Product Bridge.
- [x] Knowledge Object contracts/catalog foundations.
- [x] Learn ↔ Coach continuity and educator Coach → Teach professional-growth loop.
- [x] tenant/course-scoped Learn Teacher projections.

Still requiring empirical/product validation before broad production claims:

- [ ] complete visual/accessibility review across representative mobile, keyboard, reduced-motion and high-zoom conditions;
- [ ] learner comprehension validation for Pulse/Path/Mind Trace;
- [ ] production telemetry/latency/cost acceptance thresholds per deployed product.

---

# Product maturity roadmap

## Lurexa Learn

**Current maturity: Verified MVP implementation**

Implemented scope includes onboarding, A1–C2 curriculum planning/runtime foundations, lesson navigation, trusted evidence flows, learner dashboard, Teacher Workspace, placement/start-check foundations, adaptive recommendations and Signature Experience integration.

Next promotion work focuses on deployment/runtime acceptance, real user testing, accessibility/device validation, production observability and operational readiness rather than adding decorative features.

## Lurexa Coach

**Current maturity: Verified MVP implementation**

Implemented scope includes standalone product surface, authorized learner context, learner and educator-professional modes, Dominican-Spanish linguistic transfer foundations, minimized evidence completion, and governed return bridges.

Next promotion work focuses on independent deployment, production speech/audio experience validation, longitudinal history projections, quality evaluation and cost/latency acceptance.

## Lurexa Teach

**Current maturity: Verified MVP implementation**

Implemented scope includes professional-growth profile/pathways, educator evidence, qualification/benefit integration, credentials and Coach professional-practice bridge.

Next promotion work focuses on production deployment acceptance and deeper curriculum/professional-program validation.

## Lurexa Admin

**Current maturity: Verified MVP subset**

Verified scope includes educator qualification lifecycle/reviewer workflow and exact teaching authorization governance.

Not implied complete: billing settlement, every organization operation, all compliance tooling, or production deployment.

## Lurexa Insight

**Current maturity: Architecture / contract foundations**

Learn Teacher Insights are an instructional Learn feature. Standalone institutional analytics, cohort intelligence, privacy thresholds and leadership surfaces remain product-expansion work.

## Lurexa Studio

**Current maturity: Architecture / prototype foundations**

Knowledge Object/catalog services exist. Standalone governed authoring, review, versioning and publishing remain product-expansion work.

## Lurexa Campus

**Current maturity: Architecture / representative prototype**

Campus is the institutional shell. Real tenant identity, SSO, entitlement navigation, institutional analytics and standalone runtime remain product-expansion work.

## Learn mobile

**Current maturity: Implementation subset**

The Expo surface exists but does not yet have web-equivalent release gates or representative-device validation. Mobile production claims remain pending a dedicated quality/release program.

---

# Future capability directions

These are directions, not completed roadmap phases:

- additional L1 linguistic profiles beyond Dominican Spanish;
- broader Spanish regional transfer profiles;
- additional subjects;
- Marketplace and institutional content licensing;
- public/partner APIs;
- corporate learning;
- government/large-institution deployment patterns;
- future Lurexa Community product if justified;
- native/mobile expansion where product evidence supports it.

Dominican Spanish remains the first deep linguistic specialization, not a technical limitation.

---

# Quality and governance requirements

These requirements apply continuously and do not become permanently “done”:

- protect `main` through repository rulesets and required CI;
- maintain evidence/inference separation;
- maintain Core ownership of trusted records/authorization;
- keep Mind storage-free unless an explicitly governed service boundary is introduced;
- test cross-tenant/course authorization boundaries;
- prevent prototype/demo state from being presented as production truth;
- preserve Knowledge Object version/provenance stability once trusted evidence references it;
- evaluate AI usefulness, reliability, latency and cost before production-critical promotion;
- validate Dominican-Spanish linguistic claims with ELT/linguistic expertise;
- maintain accessibility, privacy and observability as release gates rather than one-time tasks.

# End-state principle

> **Lurexa Learning Technologies builds the ecosystem.**  
> **Lurexa Core owns trust.**  
> **Lurexa Mind interprets learning.**  
> **Products deliver experiences and generate evidence.**  
> **Campus connects the institutional experience.**  
> **One learner. One evolving model. Every Lurexa experience adapts around it.**

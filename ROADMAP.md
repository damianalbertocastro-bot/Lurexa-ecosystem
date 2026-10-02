# Lurexa Roadmap

Updated: 2026-09-22

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

**Maturity: Verified**

Completed scope:

- [x] Classify every active shared package as Production, Contract or Test and record retired package names separately.
- [x] Remove the zero-runtime-consumer `@lurexa/auth` and `@lurexa/database` scaffolds after import-graph verification.
- [x] Keep authentication, authorization and persistence ownership in governed app/Core/backend boundaries rather than recreating generic parallel packages.
- [x] Keep `@lurexa/sdk` contract-only and prevent it from becoming a second authority/implementation layer.
- [x] Tighten `@lurexa/backend` to a browser-safe root plus explicit `*.server`, `core/*.server` and `mind/*.server` capability exports.
- [x] Remove unrestricted backend wildcard exports and TypeScript aliases that could bypass the governed server boundary.
- [x] Remove stale Learn build hooks for retired packages.
- [x] Remove unsafe Phase-0 commerce/billing/quota authority stubs until governed server-owned replacements exist.
- [x] Introduce canonical typed environment contracts, normalize public/server environment names and prohibit legacy aliases in runtime source.
- [x] Reconcile repository/bootstrap package inventories with the actual workspace.
- [x] Enforce package retirement, backend export policy and environment contracts through required CI.
- [x] Verify frozen dependency installation, repository gates, Phase 0, and all configured product lint/type/build validations after the cleanup.

Exit evidence: PR #75 normalized environment contracts and PR #76 completed the package/runtime-policy cleanup. Both exact heads passed the protected `Verify Foundation & Build` gate and Product Deployment Validation before merge.

## R7 — Deployment Reconciliation

**Maturity: Verified / Operationally Standardized**

Completed scope:

- [x] Reconcile deployment topology with authoritative edge target: transitioned primary hosting to Cloudflare Workers via OpenNext while retaining Vercel configurations for reference.
- [x] Canonical branch standard: locked production deployment branch to `main` across all services.
- [x] All 8 application surfaces configured with autonomous `wrangler.toml` files, OpenNext build directives (`opennextjs-cloudflare build`), and explicit Node.js compatibility flags.
- [x] Automated deployment CI workflow (`.github/workflows/deploy.yml`) active and passing for pull requests and `main` merges.
- [x] Production secret provisioning automation (`scripts/cloudflare-secret-provisioner.mjs`) implemented and tested with `--check`, `--dry-run`, `--deploy`, and `--surface` selective targeting for `FIREBASE_SERVICE_ACCOUNT_JSON` and `GEMINI_API_KEY`.
- [x] Stop modeling Learn Teacher Workspace as a second independent deployment; consolidated under `apps/learn-web/app/teacher`.
- [x] Provision standalone Coach project configuration and canonical domain (`https://coach.lurexa.org`).
- [x] Reconcile Admin, Insight, Studio, and Teach preview and production topologies.
- [x] Automated repository ↔ deployment drift detection active via `pnpm verify:cloudflare`.

Exit evidence: PR #110 and PR #111 locked `main` as the authoritative Cloudflare production deployment branch with verified build directives across all 8 surfaces, and CI deployment workflow plus secret provisioning tooling are operational.



## R7.1 — Commercial Reconciliation & Pre-Phase-5 Entitlement Gate

**Maturity: Verified / pre-Phase-5 gate closed**

This gate records the approved commercial decisions before technical entitlement enforcement.

- [x] Resolve Plus ElevenLabs contradiction: premium ElevenLabs is product-scoped for Learn Plus and Coach Plus.
- [x] Freeze Ultra's current commercial boundary at full Learn + Coach plus deeper cross-product adaptation and premium AI/speech.
- [x] Keep Ultra future-product entitlements extensible; Teach, Studio and future products are not automatically included.
- [x] Define Business for small and medium organizations.
- [x] Define Business as an organization contract + learner/seat allowance + negotiated usage.
- [x] Define Business as ecosystem access configured through capabilities rather than Basic/Pro/Enterprise SKU packages.
- [x] Define pooled organizational usage with optional individual limits.
- [x] Define standard Business capabilities: groups/cohorts, assignments, analytics, reporting, role management, audit, SSO, data export and teacher/admin management.
- [x] Define negotiated support and contract-based customization for custom curricula, Studio authoring, branding and integrations.
- [x] Set Business pricing as contract/quote based with no public fixed price.
- [x] Create canonical commercial specification at `Docs/Product/LUREXA_COMMERCIAL_SPECIFICATION.md`.
- [x] Reconcile subscription types with product-scoped premium voice and Business contract capabilities.
- [x] Remove superseded Enterprise pricing from the customer-facing Learn billing surface.
- [x] Migrate individual entitlement logic away from the legacy `enterprise` tier; remaining `enterprise` references are institutional/branding legacy and require separate migration decisions.
- [x] Add capability-level entitlement resolution and pooled Business usage accounting contract/checks.
- [x] Persist organization-level Business quota usage with transactional enforcement.
- [x] Connect persisted Business consumption to the implemented Learn/Coach AI and voice runtime entry points, including Coach live-stream entitlement gating.
- [x] Prove end-to-end Business enforcement through the repository verification gate and successful Product Deployment Validation.
- [x] Add automated commercial-contract verification before Phase 5.
- [x] Run the equivalent protected CI verification suite for the PR head and resolve all regressions before Phase 5 enforcement.

**Exit condition:** no customer-facing surface presents superseded Enterprise pricing; canonical commercial rules and capability contracts agree; legacy runtime dependencies are identified; verification is green.

## Execution Phases 5–7 — Quality, Controlled AI & Offline PWA

These phases are the implementation sequence carried forward from the earlier platform roadmap. They are evaluated separately from product maturity so an implemented subsystem is not mistaken for a production-ready product.

### Phase 5 — Testing, Security & Observability
**Status: Verified baseline**

- [x] Critical learner/teacher journeys have Playwright coverage.
- [x] Accessibility baseline exists for critical Learn journeys.
- [x] Commercial entitlement and Business quota enforcement have executable regression checks.
- [x] Structured operational telemetry with request correlation and redaction is enforced on critical AI paths.
- [x] Protected CI and Product Deployment Validation are green on the current branch head.

### Phase 6 — Controlled AI Tutor
**Status: Verified implementation baseline**

- [x] Provider/model fallback boundary exists behind the Learn Tutor service.
- [x] Trusted curriculum capability is resolved server-side.
- [x] Authorized learner context is grounded into the tutor request.
- [x] Prompt contract is versioned (learn-tutor-roleplay-v1).
- [x] Audio turns request structured JSON and are parsed into bounded tutor/evaluation fields.
- [x] Deterministic fallback exists when the provider is unavailable.
- [x] AI turns are connected to Business pooled usage enforcement.
- [x] Tutor evidence records provider/model and prompt-version provenance.
- [ ] Complete empirical AI evaluation dataset and latency/cost acceptance thresholds before production promotion.

### Phase 7 — PWA / Offline
**Status: Verified implementation baseline**

- [x] Installable Learn PWA manifest and service worker exist.
- [x] Static assets and audio use explicit cache strategies.
- [x] Successful navigations are cached for offline fallback.
- [x] IndexedDB stores lessons, progress, evidence, learner-model deltas and audio.
- [x] Offline progress queues and retries are implemented.
- [x] Offline evidence is synchronized to Core before local deletion.
- [x] Spoken offline evidence uploads through the canonical evidence endpoint before local deletion.
- [x] Idempotent Core evidence persistence prevents duplicate evidence from duplicate retries.
- [ ] Complete representative-device/low-bandwidth field validation before claiming production-ready offline support.
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

## Commercial Architecture Program — Phases 6–15

**Supersession note:** The earlier implementation-only Phase 6 (Controlled AI Tutor) and Phase 7 (PWA/Offline) remain valid implementation records, but their numbering is superseded for the next commercial-architecture sequence below. Do not use numeric phase labels without this program context.

### Phase 6 — Formalize Campus
**Status: Contract implemented — runtime migration baseline audited**

- [x] Authoritative institutional capability matrix.
- [x] Products attach independently to organizations.
- [x] Legacy institutional identifiers treated as migration inputs, not authorization authority.
- [ ] Runtime migration of all institutional authorization checks to capability projections.

### Phase 7 — Formalize Business
**Status: Contract implemented**

- [x] Customer definition: small and medium organizations.
- [x] Organization user/role model.
- [x] Product access and organizational capabilities.
- [x] Workforce learning model.
- [x] Analytics/privacy boundary.
- [x] AI governance contract.
- [x] Contract/quote commercial model with no invented public prices.
- [ ] Final commercial approval of any future public Business service profiles.

### Phase 8 — Build Capability Registry
**Status: Implementation baseline — production completeness still audited**

- [x] Registry schema covers owner, product, entitlement source, quota, AI provider, speech provider, authorization and organization scope.
- [x] Initial executable registry created.
- [ ] Expand registry to every production capability and make CI completeness mandatory.

### Phase 9 — Integrate AI Gateway
**Status: Implementation complete — pending protected CI/runtime validation**

- [x] Provider-neutral AI Gateway contract created.
- [x] OpenRouter adapter boundary created.
- [x] Usage provenance hook created.
- [x] Migrate Learn Tutor text, opener and speech-analysis provider calls behind the gateway.
- [x] Resolve entitlement and capability server-side before provider execution.
- [x] Add production timeout/retry/circuit-breaker policy and empirical acceptance thresholds mechanism.
- [ ] Validate empirical latency/cost/error thresholds before production promotion.

### Phase 10 — Implement OpenRouter Roleplay
**Status: Implementation complete — pending protected CI/runtime validation**

- [x] conversational roleplay established as a first-class Mind capability in the registry.
- [x] Learn identified as the first major consumer.
- [x] Move runtime text roleplay and opener generation to OpenRouter through the AI Gateway.
- [ ] Define Teach professional-simulation consumer contract without duplicating the Mind capability.

### Phase 11 — Implement Speech Gateway
**Status: Implementation complete — pending protected CI/runtime validation**

- [x] Entitlement-driven standard vs ElevenLabs provider selection implemented.
- [x] ElevenLabs is explicit entitlement, never fallback.
- [x] Product/provider usage attribution implemented.
- [x] Migrate Learn curriculum speech behind the Speech Gateway.
- [x] Premium provider choice is entitlement-driven and server-enforced.
- [x] Migrate remaining Coach live authorization path behind the capability contract.
- [ ] Add dedicated speech provider health, timeout and cost controls.

### Phase 12 — Reconcile Pricing UX
**Status: Implementation baseline — canonical individual pricing now wired**

- [x] Canonical pricing UX rules documented.
- [x] Business quote semantics documented.
- [x] Teach/institutional pricing explicitly protected from invented legacy assumptions.
- [x] Wire the public ecosystem and Learn individual price surfaces to canonical individual definitions.
- [ ] Finish any remaining product-specific pricing surface migration.

### Phase 13 — Enforcement
**Status: Implementation substantially complete — Phase 17 audit continuing**

- [x] Server-side capability enforcement architecture documented.
- [x] Gateway boundaries require capability resolution.
- [x] AI and Speech gateways resolve entitlement + capability server-side before execution.
- [x] Coach streaming now resolves streaming entitlement rather than directly reading tier quotas.
- [x] Audit remaining legacy quota/role paths and remove the identified non-authoritative runtime checks from protected provider/streaming paths.
- [ ] Complete cross-tenant authorization fixtures for all protected runtime surfaces.

### Phase 14 — Usage Accounting
**Status: Implementation substantially complete — durable reporting added in Phase 18**

- [x] Product/capability/provider/organization/user/entitlement/billing-period ledger contract implemented.
- [x] Business pooled quota remains enforced separately.
- [x] Add idempotency-key support to the usage ledger.
- [x] AI and Speech gateways record product/capability/provider/user/organization/billing-period provenance.
- [x] Add durable monthly reporting aggregates and Business reconciliation.
- [ ] Connect and reconcile any remaining premium runtime paths.

### Phase 15 — Testing Matrix
**Status: Executable verification baseline — full runtime matrix remains a release gate**

- [x] Individual, Teach, Campus and Business test matrix documented.
- [x] Capability-independent testing requirements defined.
- [x] Add executable Phase 15–20 contract verification and CI-ready checks.
- [ ] Expand the matrix into provider-backed integration fixtures before production promotion.

**Execution status:** Phases 9–15 implementation is substantially present but remains blocked from production promotion until protected CI is green. Phase 16 resilience, Phase 17 authorization audit, Phase 18 reporting, Phase 19 commercial source-of-truth and Phase 20 expansion contracts are now implemented at baseline. The remaining work is verification, empirical acceptance, cross-tenant fixtures and final release evidence—not speculative product expansion.

### Post-Phase-15 Execution Sequence — Production Hardening & Expansion Readiness

This sequence starts only after Phases 9–15 pass protected CI and Product Deployment Validation. It is the next implementation track; it does not declare product readiness by itself.

#### Phase 16 — AI Gateway Production Resilience
**Status: Implementation complete — pending protected CI and empirical acceptance validation**
- [x] Add bounded provider timeouts.
- [x] Add retry policy limited to safe transient failures.
- [x] Add circuit-breaker/health state without changing entitlement decisions.
- [x] Record latency, provider outcome and bounded cost metadata.
- [ ] Validate empirical latency/cost/error acceptance thresholds before production promotion.

#### Phase 17 — Runtime Authorization Audit
**Status: Implementation baseline — cross-tenant/runtime audit continues**
- [x] Inventory remaining direct tier/plan/quota checks across backend runtime paths.
- [x] Replace non-authoritative checks with capability resolution where appropriate.
- [x] Complete Coach live-stream authorization under the same server-owned capability contract.
- [ ] Verify cross-tenant and cross-product authorization boundaries with integration fixtures.

#### Phase 18 — Usage & Reporting Completion
**Status: Implementation baseline — durable aggregates and reconciliation implemented**
- [x] Add durable monthly usage aggregates derived from the ledger.
- [x] Preserve product/capability/provider/organization/user attribution.
- [x] Add reconciliation checks between pooled Business usage and ledger totals.
- [x] Define reporting retention and correction/replay rules.

#### Phase 19 — Commercial UX Source-of-Truth
**Status: Implementation baseline — canonical individual pricing wired**
- [x] Make public pricing surfaces consume canonical individual commercial definitions.
- [x] Keep Business quote-based and capability-driven.
- [x] Validate Learn/Coach/Teach/institutional messaging against approved commercial contracts.
- [x] Add CI checks preventing pricing-copy drift.

#### Phase 20 — Product Expansion Readiness Gate
**Status: Contract implemented — final release evidence gate remains**
- [x] Define production contracts for Insight, Studio and Campus before adding substantial standalone functionality.
- [x] Confirm Core/Mind/Product ownership boundaries.
- [x] Establish deployment, observability, accessibility and authorization gates per product.
- [ ] Only then open implementation phases for the next standalone product surfaces after final release evidence passes.


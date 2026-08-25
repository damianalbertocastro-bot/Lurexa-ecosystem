# Lurexa Roadmap

Status reflects the working commercial roadmap through 2026-08-25. It is not a release promise.

## Strategic source of truth

Lurexa is the commercial multi-product EdTech ecosystem built by **Lurexa Learning Technologies**. The earlier thesis prototype is a validation/reference artifact and does not define the production architecture.

## Ecosystem architecture

```text
Lurexa Learning Technologies
│
├── Shared ecosystem layers
│   ├── Lurexa Core
│   │   └── trust, identity, authorization, persistence,
│   │       authoritative records and shared platform services
│   └── Lurexa Mind
│       └── learning intelligence, interpretation,
│           personalization, adaptation and AI capabilities
│
├── Product family
│   ├── Lurexa Learn
│   ├── Lurexa Coach
│   ├── Lurexa Teach
│   ├── Lurexa Admin
│   ├── Lurexa Insight
│   └── Lurexa Studio
│
├── Institutional experience
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

Core and Mind are shared ecosystem layers, not products. Campus is an institutional experience/shell, not a sibling product owner. Signature primitives are cross-product capabilities and read/interaction patterns, not products or independent learner stores.

## Governing learner principle

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Products generate experiences and evidence. Core owns trust, identity, authorization, persistence and authoritative records. Mind interprets authorized evidence. The Learner Model must not be duplicated per product.

## Current verified baseline

- [x] pnpm/Turborepo multi-app workspace.
- [x] Firebase/Firestore-oriented infrastructure.
- [x] Shared packages for auth, backend, config, database, SDK, tokens, types, TypeScript config, UI and utilities.
- [x] GitHub Actions/CI infrastructure.
- [x] `bootstrap/` repository tooling.
- [x] Core/Mind/product architecture documented.
- [x] One persistent cross-product Learner Model established architecturally.
- [x] v1 Learning Evidence, Learner Context, Mind Interpretation and Derived Observation boundaries implemented at baseline level.
- [x] Product personality system established.
- [x] Signature Experience architecture, interaction specification and dedicated S0–S8 roadmap established.

These statements describe repository foundations, not production completion.

---

# Horizontal Program S — Lurexa Signature Experience System

This program cuts across the product roadmap. Detailed execution lives in `Docs/Product/LUREXA_SIGNATURE_EXPERIENCE_ROADMAP.md`.

## S0 — Architecture reconciliation

- [x] Classify Learn/Coach/Teach/Admin/Insight/Studio as product family.
- [x] Classify Campus as institutional experience/shell.
- [x] Classify the six signature primitives as a shared experience layer.
- [x] Reconcile the Lurexa Bible and Product Personality System.
- [x] Reconcile the main AI-agent ecosystem context.
- [ ] Reconcile any remaining stale Campus wording found in secondary docs during audit.

## S1 — Contract foundations

- [x] Add v1 shared signature contracts to `@lurexa/types`.
- [x] Reuse canonical `LurexaProduct` rather than maintaining a second product union.
- [x] Add typed signature projection purposes.
- [x] Add SDK service boundary.
- [x] Establish Core projection services for Pulse, Path, Mind Trace and Memory Thread.
- [x] Add canonical knowledge-object references to Learning Evidence source metadata.
- [ ] Add contract validators and compatibility tests for signature records.

## S2 — Prototype and usability validation

- [x] Add deterministic developer gallery for all six patterns.
- [x] Define loading/empty/partial/error behavior for the learner dashboard integration.
- [ ] Complete visual/accessibility review across mobile, keyboard, reduced motion and high zoom.
- [ ] Conduct learner comprehension validation for Pulse/Path/Mind Trace.

## S3 — Learner Pulse vertical slice

- [x] Add Core Pulse projection.
- [x] Preserve `unknown` instead of manufacturing proficiency states.
- [x] Add shared Pulse UI.
- [x] Integrate Pulse into Learn dashboard.
- [ ] Add longitudinal momentum only after an approved comparison contract exists.
- [ ] Add evidence-linked automated tests.

## S4 — Memory Thread vertical slice

- [x] Add Memory Thread contract/UI.
- [x] Add tenant-safe self-service projection path.
- [x] Prevent raw evidence payload exposure.
- [x] Enable exact Knowledge Object filtering when evidence is explicitly mapped.
- [ ] Expand event narrative from metadata-only summaries to approved derived narrative summaries.

## S5 — Adaptive Learning Path

- [x] Add Path contract/UI and Core projection.
- [x] Keep canonical requirements distinguishable from adaptive overlays.
- [x] Prohibit autonomous required-content skipping in v1.
- [x] Integrate Path into Learn dashboard.
- [ ] Map recommendations to Knowledge Objects consistently.
- [ ] Add curriculum-governance tests.

## S6 — Mind Trace + Product Bridge

- [x] Add Mind Trace contract/UI/projection.
- [x] Enforce approved-summary-only explanation policy.
- [x] Add expiring Core-owned Product Bridge capability.
- [x] Implement self-service Learn → Coach handoff.
- [x] Validate bridge on Coach arrival while re-authorizing Coach context independently.
- [x] Add Coach → Learn return bridge after session completion.
- [x] Add bridge telemetry and abuse/expiry tests.

## S7 — Knowledge Objects

- [x] Add Knowledge Object contract/UI.
- [x] Add initial deterministic English semantic catalog.
- [x] Allow evidence to reference canonical Knowledge Object IDs.
- [x] Map production A1/A2 curriculum competencies to canonical objects incrementally.
- [ ] Establish Studio authoring/versioning ownership before large-scale catalog expansion.

## S8 — Cross-product hardening

- [x] Learn + Coach closed-loop end-to-end tests and runtime integration.
- [x] Teach-compatible growth patterns where educator contracts support them.
- [ ] Insight projections/aggregation design.
- [ ] Campus orientation/handoff integration without data ownership.
- [ ] Studio Knowledge Object management.
- [ ] Admin governance surfaces only where operationally useful.
- [ ] Performance, caching, telemetry, accessibility and privacy hardening.

---

# Phase 1 — Stabilize engineering and establish Core foundations

Goal: create a reliable production platform on which every product can depend.

- [x] Verify clean `pnpm install`, lint, type-check, test and build workflows continuously.
- [x] Keep CI aligned with package-manager/tooling versions.
- [x] Complete authentication flows.
- [x] Complete RBAC/authorization foundations.
- [x] Establish organizations/tenancy boundaries.
- [x] Define canonical user/learner identity rules.
- [x] Complete trusted learning-record/evidence persistence boundaries.
- [x] Maintain stable shared domain contracts.
- [x] Expose supported interfaces through `@lurexa/sdk` or equivalent boundaries.
- [x] Keep Core authorization rules explicit for Mind/context access.
- [x] Establish migration, seed and environment guidance.

Exit condition: products depend on stable identity, authorization, contracts and trusted records without duplicating platform logic.

---

# Phase 2 — Lurexa Learn production MVP

Goal: ship the first production learner experience on Core and generate reliable learning evidence.

- [x] Complete learner onboarding.
- [x] Complete course/module/lesson navigation.
- [x] Complete enrollment/progress persistence.
- [x] Deliver core interactive activities.
- [x] Establish assessment/feedback workflows.
- [x] Capture structured evidence through Core boundaries.
- [x] Validate responsive, accessible and low-bandwidth behavior.
- [x] Establish learner-facing analytics.
- [x] Integrate approved Signature Experience primitives incrementally rather than as decorative mockups.

Initial evidence domains may include CEFR/placement, curriculum position, recently studied topics, vocabulary/grammar targets, activity/assessment outcomes, reliable recurring-error evidence, goals and learner-selected preferences.

Exit condition: a learner can register, enroll, learn, complete activities and retain trustworthy progress/evidence in production.

---

# Phase 3 — Learner Model + Mind foundation

Goal: reusable learning intelligence over Core-governed evidence rather than product-specific AI memory.

- [x] Establish v1 Learning Evidence baseline.
- [x] Establish v1 Learner Context baseline.
- [x] Establish Mind Interpretation baseline.
- [x] Establish approved Derived Observation persistence baseline.
- [x] Establish provider abstraction and pedagogical prompt/policy layers.
- [x] Deepen evidence provenance/reliability/versioning.
- [x] Incrementally implement proficiency, curriculum context, goals/preferences, vocabulary/grammar and recurring-error model domains.
- [x] Establish personalization/recommendation primitives.
- [x] Implement safety, privacy, validation and observability boundaries.
- [x] Define AI evaluation metrics for usefulness, reliability, latency and cost.

Exit condition: multiple experiences can consume authorized shared learner intelligence without separate memories or provider coupling.

---

# Phase 4 — Lurexa Coach MVP

Goal: validate the differentiated English speaking/pronunciation product using the shared Learner Model.

## Session adaptation

- [x] Read authorized learner context before session start.
- [x] Adapt to CEFR level and relevant curriculum.
- [x] Use known goals/recurring issues without asking the learner to start over.
- [x] Adjust speed, question length and correction load.

## Speaking experience

- [x] Free conversation mode.
- [x] Guided role-play.
- [x] Pronunciation-focused practice.
- [x] Curriculum-linked practice from Learn.
- [x] Level- and goal-aware feedback.

## Pronunciation and fluency intelligence

- [x] Define structured speaking/pronunciation evidence.
- [x] Track recurring patterns, not isolated errors only.
- [x] Prioritize intelligibility, naturalness and fluency.
- [x] Support stress, rhythm, intonation and connected speech where reliable.
- [x] Avoid accent-erasure framing/scoring.

## Dominican Spanish specialization

- [x] Maintain initial Dominican-Spanish-to-English transfer taxonomy.
- [x] Validate high-value transfer patterns with ELT/linguistic expertise.
- [x] Build targeted corrective practice where pedagogically useful.
- [x] Keep linguistic-profile architecture extensible.

## Evidence loop

- [x] Submit Coach evidence through Core-governed contracts.
- [x] Allow Mind to interpret Coach evidence.
- [x] Persist approved derived observations through Core.
- [x] Expose relevant updated context to authorized products.

Exit condition: Coach provides useful CEFR-appropriate speaking practice, uses known context and contributes evidence back to the ecosystem.

---

# Phase 5 — Closed-loop Learn ↔ Coach adaptation

Goal: prove Lurexa behaves as one ecosystem rather than synchronized independent profiles.

- [ ] Learn recommends Coach practice from current learning needs.
- [ ] Coach uses recent Learn context when relevant.
- [ ] Coach evidence can trigger targeted Learn follow-up.
- [ ] Repeated speaking issues influence recommended practice.
- [ ] Successful corrections reduce unnecessary repetition.
- [x] Establish Product Bridge architecture and first Learn → Coach self-service handoff.
- [ ] Complete Coach → Learn return handoff.
- [ ] Provide learner-facing Mind Trace explanations for adaptive recommendations.
- [ ] Provide appropriate personalization/history controls.

Reference loop:

```text
Learn → evidence → Core → Mind → Pulse/Path/Trace
  ↓ Product Bridge
Coach → evidence → Core → Mind → Memory Thread/updated Pulse → Learn
```

Exit condition: learners experience continuity without duplicate profiles or raw context transfer.

---

# Phase 6 — Lurexa Teach

Goal: ship independent educator professional development without duplicating the Learn teacher operational workspace.

- [ ] Educator onboarding/professional-growth profile.
- [ ] Teacher English/CEFR pathways.
- [ ] Professional learning and competency pathways.
- [ ] Evidence submission/reflection/review.
- [ ] Credential award, verification, revocation and expiry policy.
- [ ] Teach Community/professional circles.
- [ ] Mind-based growth recommendations using authorized educator evidence.
- [ ] Bridges back to Learn teacher operations.

Guardrail: Learn owns class/learner operations; Teach owns educator professional growth.

---

# Phase 7 — Offline and mobile resilience

- [ ] Robust offline caching for eligible content.
- [ ] Safe progress/evidence synchronization.
- [ ] Conflict resolution.
- [ ] Low-bandwidth media/data optimization.
- [ ] Define viable offline Coach capabilities.
- [ ] Reconcile offline evidence before changing trusted Learner Model state.
- [ ] Validate representative lower-cost devices/unreliable networks.

---

# Phase 8 — Lurexa Admin + Lurexa Insight

## Admin

- [ ] Organization/tenant administration.
- [ ] User/role/permission management.
- [ ] Program/course configuration.
- [ ] Billing/subscription administration.
- [ ] Governance/audit/compliance controls.
- [ ] Learner-data/model access policy controls where required.

## Insight

- [ ] Learner outcome dashboards.
- [ ] Cohort/course analysis.
- [ ] Engagement/retention analysis.
- [ ] Teacher/institution views.
- [ ] AI usage/learning-impact metrics.
- [ ] Interpretable intervention/risk signals.
- [ ] Authorized aggregated speaking/pronunciation trends.

---

# Phase 8b — Lurexa Campus institutional experience

Goal: provide a coherent institution-facing shell across entitled specialist products without creating another product owner.

- [ ] Campus onboarding and institution identity/co-branding.
- [ ] Organization/role/entitlement-aware navigation.
- [ ] Cohort, department and academic-program orientation connected to Core-owned organization records.
- [ ] Multi-product institutional entitlement presentation.
- [ ] Mind-powered summaries only through explicitly authorized institution purposes.
- [ ] Product Bridge integration preserving institution context without transferring raw learner data.
- [ ] Clear entry into Learn, Teach, Admin, Insight, Coach and Studio according to role/entitlements.

Exit condition: an institution experiences one coherent Lurexa environment while specialist products retain ownership of their domains.

---

# Phase 9 — Lurexa Studio

- [ ] Course/lesson authoring.
- [ ] Assessment/question-bank creation.
- [ ] Media/resource management.
- [ ] Templates/reusable learning objects.
- [ ] Knowledge Object authoring, mapping, versioning and publishing governance.
- [ ] AI-assisted creation through Mind.
- [ ] Review/approval/versioning/publishing.
- [ ] Learner-aware delivery-time adaptation without corrupting canonical source content.

---

# Phase 10 — Coach distribution expansion

- [ ] Evaluate embedded vs dedicated Coach application UX.
- [ ] Preserve identity/Learner Model regardless of distribution surface.
- [ ] Deepen pronunciation history/practice sequencing.
- [ ] Evaluate independent subscription economics when justified.
- [ ] Preserve the rule that Coach consumes Mind; Coach does not become Mind.

---

# Phase 11 — Linguistic and ecosystem expansion

Potential directions:

- [ ] Additional Spanish L1 profiles.
- [ ] Additional L1 linguistic profiles.
- [ ] Additional subjects.
- [ ] Enterprise/institutional offerings.
- [ ] Marketplace/public APIs.
- [ ] Native mobile where justified.
- [ ] Corporate learning.
- [ ] Government/large-institution deployments.

Dominican Spanish is the first deep profile, not a permanent limit.

---

# Quality and governance requirements

- [ ] Focused tests for critical learner flows.
- [ ] Authorization tests for learner-context and Product Bridge access.
- [ ] Tests for missing, stale and partial context.
- [ ] Cross-tenant isolation tests for Memory Thread and related projections.
- [ ] AI evaluation/regression testing before Mind becomes production-critical.
- [ ] Representative Coach evaluation set for Dominican Spanish learners.
- [ ] Linguistic/ELT validation for production transfer claims.
- [ ] Measure personalized Coach sessions against generic uncontextualized conversation.
- [ ] Track speech/AI cost, reliability and latency.
- [ ] Maintain evidence/inference separation.
- [ ] Maintain Knowledge Object version stability once referenced by trusted evidence.

# Repository architecture rules

- Keep architecture documentation current as ownership changes.
- Do not rename packages solely to match branding.
- Prevent products from bypassing Core trust boundaries.
- Prevent product UIs from calling AI providers directly for persistent learner intelligence.
- Prevent multiple apps from creating competing learner truth.
- Treat Campus as an experience/shell, not a product-owner capability boundary.
- Treat Signature Experience primitives as shared interaction/read-model capabilities, not databases.
- Keep canonical curriculum distinguishable from adaptive overlays.
- Treat conceptual architecture changes separately from implementation status.

# End-state principle

> **Lurexa Learning Technologies builds the ecosystem.**  
> **Lurexa Core owns trust.**  
> **Lurexa Mind interprets learning.**  
> **Products deliver experiences and generate evidence.**  
> **Campus connects the institutional experience.**  
> **The Signature Experience System makes continuity visible.**  
> **One learner. One evolving model. Every Lurexa experience adapts around it.**

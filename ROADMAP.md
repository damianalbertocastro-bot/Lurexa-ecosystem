# Lurexa Roadmap

Status reflects the repository state inspected through 2026-08-17. This is a working commercial roadmap, not a release promise.

## Strategic source of truth

Lurexa is the commercial multi-product EdTech ecosystem built by **Lurexa Learning Technologies**.

The earlier thesis prototype is a validation/reference artifact. It does not define the production architecture or commercial implementation roadmap.

## Company and ecosystem architecture

```text
Lurexa Learning Technologies
│
├── Shared ecosystem layers
│   ├── Lurexa Core
│   │   └── trust, identity, authorization, persistence,
│   │       authoritative records and shared platform services
│   │
│   └── Lurexa Mind
│       └── learning intelligence, interpretation,
│           personalization, adaptation and AI learning capabilities
│
└── Product family
    ├── Lurexa Learn
    ├── Lurexa Coach
    ├── Lurexa Teach
    ├── Lurexa Admin
    ├── Lurexa Insight
    ├── Lurexa Studio
    └── Lurexa Campus
```

Core and Mind are shared ecosystem layers, not ordinary end-user products.

## Governing learner principle

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Products generate learning experiences and evidence. Lurexa Mind interprets authorized evidence and produces learning intelligence. Lurexa Core owns trust, identity, authorization, persistence and authoritative records.

The Learner Model is the persistent evolving representation of the learner across the ecosystem. It is not an independent database owned solely by Mind and it must not be duplicated per product.

## Current verified baseline

The following repository foundations already exist and should not be rebuilt merely because the conceptual architecture has matured:

- [x] pnpm/Turborepo workspace with multiple applications and shared packages.
- [x] Firebase configuration and Firestore-related infrastructure present in the repository.
- [x] Shared packages for auth, backend, config, database, SDK, tokens, types, TypeScript config, UI and utilities.
- [x] GitHub Actions / CI infrastructure present.
- [x] `bootstrap/` repository-bootstrap tooling present.
- [x] Lurexa company/product hierarchy documented.
- [x] Dedicated architecture documents for capabilities, dependencies and Learner Model present.
- [x] Root AI-development guidance present in `AGENTS.md` and `.ai/`.

These statements describe verified repository structure, not completion of production features.

## Immediate architecture-alignment work

- [x] Establish Lurexa Learning Technologies as parent/master business identity.
- [x] Establish Lurexa Core and Lurexa Mind as shared ecosystem layers.
- [x] Establish Learn, Coach, Teach, Admin, Insight, Studio and Campus as product family.
- [x] Establish one persistent cross-product Learner Model.
- [x] Separate Core trust/persistence from Mind interpretation/intelligence.
- [x] Define Coach as a speaking/pronunciation product, not the intelligence layer.
- [x] Define Dominican Spanish as Coach's first deep L1 profile, not a permanent technical limit.
- [x] Align core architecture documentation and AI-agent guidance with these decisions.

## Highest-priority next technical action

Define the first production-oriented **Learner Context Contract** and **Learning Evidence Contract** against the existing repository before building production personalization or Coach memory.

Do not begin by renaming packages. First map existing code to the responsibility model and identify actual gaps.

---

# Phase 1 — Stabilize engineering and establish Lurexa Core foundations

Goal: create a reliable production platform on which every product can depend.

- [ ] Verify clean `pnpm install`, lint, type-check, test and build workflows.
- [ ] Keep CI aligned with repository package-manager/tooling versions.
- [ ] Complete authentication flows.
- [ ] Complete RBAC/authorization foundations.
- [ ] Establish organizations/tenancy boundaries.
- [ ] Define canonical user and learner identity rules.
- [ ] Define trusted learning-record and evidence persistence boundaries.
- [ ] Define stable shared domain contracts.
- [ ] Expose supported application interfaces through `@lurexa/sdk` or equivalent boundaries.
- [ ] Define Core authorization rules for Mind access to learner context.
- [ ] Establish migration, seed and environment guidance.
- [ ] Map existing shared packages to Core, Mind and product responsibilities without premature renaming.

Exit condition: products can depend on stable identity, authorization, contracts and trusted records without duplicating platform logic.

---

# Phase 2 — Lurexa Learn production MVP

Goal: ship the first production learner experience on Core and begin generating reliable learning evidence.

- [ ] Complete learner onboarding.
- [ ] Complete course/module/lesson navigation.
- [ ] Complete enrollment and progress persistence.
- [ ] Deliver core interactive activities.
- [ ] Establish assessment and feedback workflows.
- [ ] Capture structured learning evidence through Core-owned boundaries.
- [ ] Validate responsive, accessible and low-bandwidth behavior.
- [ ] Establish learner-facing product analytics.

Initial evidence domains may include:

- CEFR/placement evidence;
- course/module/unit position;
- recently studied topics;
- vocabulary/grammar targets;
- activity and assessment outcomes;
- recurring-error evidence where reliable;
- goals and learner-selected preferences.

Exit condition: a learner can register, enroll, learn, complete activities and retain trustworthy progress/evidence in production.

---

# Phase 3 — Learner Model + Lurexa Mind foundation

Goal: create reusable learning intelligence over Core-governed evidence instead of product-specific AI memory.

- [ ] Define v1 Learning Evidence Contract.
- [ ] Define v1 Learner Context Contract.
- [ ] Define Mind Interpretation Contract.
- [ ] Define approved Derived Observation Persistence Contract.
- [ ] Establish model/provider abstraction.
- [ ] Establish pedagogical prompt/policy layers.
- [ ] Define evidence provenance: source, timestamp, confidence/reliability and versioning where appropriate.
- [ ] Implement initial learner-model domains incrementally:
  - [ ] CEFR/proficiency state;
  - [ ] curriculum context;
  - [ ] goals/preferences;
  - [ ] vocabulary/grammar development primitives;
  - [ ] recurring-error representation.
- [ ] Establish personalization and recommendation primitives.
- [ ] Implement safety, privacy, validation and observability boundaries.
- [ ] Define AI evaluation metrics for educational usefulness, reliability, latency and cost.

Exit condition: multiple product experiences can consume authorized shared learner intelligence without separate learner memories or direct provider coupling.

---

# Phase 4 — Lurexa Coach MVP

Goal: validate the differentiated English speaking/pronunciation product using the shared Learner Model.

## Session adaptation

- [ ] Read authorized learner context before starting a session.
- [ ] Adapt to current CEFR level.
- [ ] Adapt vocabulary/grammar to relevant learning context.
- [ ] Use known goals and recurring issues rather than asking the learner to start over.
- [ ] Adjust speaking speed, question length and correction load.

## Speaking experience

- [ ] Free conversation mode.
- [ ] Guided role-play mode.
- [ ] Pronunciation-focused practice.
- [ ] Curriculum-linked practice from Learn.
- [ ] Level- and goal-aware feedback.

## Pronunciation and fluency intelligence

- [ ] Define structured speaking/pronunciation evidence.
- [ ] Track meaningful recurring patterns rather than isolated errors only.
- [ ] Prioritize intelligibility.
- [ ] Support naturalness and pronunciation refinement.
- [ ] Support fluency-oriented feedback.
- [ ] Support word stress, sentence stress, rhythm, intonation and connected speech where technically reliable.
- [ ] Avoid accent-erasure framing and scoring.

## Dominican Spanish specialization

- [ ] Define initial Dominican-Spanish-to-English transfer taxonomy.
- [ ] Validate high-value transfer patterns with appropriate ELT/linguistic expertise.
- [ ] Build targeted corrective practice around predictable transfer where pedagogically useful.
- [ ] Keep linguistic-profile architecture extensible for future L1 populations.

## Evidence loop

- [ ] Submit Coach evidence through Core-governed contracts.
- [ ] Allow Mind to interpret Coach evidence.
- [ ] Persist approved derived observations through Core boundaries.
- [ ] Make relevant updated context available to Learn and other authorized products.

Exit condition: Coach provides useful CEFR-appropriate speaking practice, uses known learner context automatically and contributes evidence back into the shared ecosystem loop.

---

# Phase 5 — Closed-loop Learn ↔ Coach adaptation

Goal: prove that Lurexa behaves like one learning ecosystem rather than synchronized independent profiles.

- [ ] Learn recommends Coach practice based on current learning needs.
- [ ] Coach uses recent Learn curriculum context when relevant.
- [ ] Coach evidence can trigger targeted Learn follow-up.
- [ ] Repeated speaking issues can influence recommended practice.
- [ ] Successful corrections can reduce unnecessary repetition.
- [ ] Provide learner-facing explanations for recommendations where useful.
- [ ] Provide appropriate personalization/history controls.

Reference loop:

```text
Learn experience
  ↓ evidence
Core trusted record
  ↓ authorized evidence
Mind interpretation
  ↓ authorized context
Coach adaptation
  ↓ evidence
Core trusted record
  ↓
Mind interpretation
  ↓
Learn next experience
```

Exit condition: learners experience continuity across Learn and Coach without duplicate profiles.

---

# Phase 6 — Lurexa Teach

Goal: ship the independent educator professional-development product on Core and Mind without duplicating the Learn teacher operational workspace.

- [ ] Complete educator onboarding and the persistent professional-growth profile.
- [ ] Complete teacher English / CEFR development pathways.
- [ ] Deliver professional learning courses and competency-based pathways.
- [ ] Complete professional evidence submission and reflection workflows.
- [ ] Complete trusted evidence review and assessor workflows.
- [ ] Complete credential award, public verification, revocation and expiry policy.
- [ ] Deliver Teach Community / professional circles and peer collaboration.
- [ ] Provide Mind-based professional-growth recommendations using authorized educator evidence.
- [ ] Provide clear bridges back to the Lurexa Learn teacher workspace for class operations.
- [ ] Preserve one Lurexa identity across Learn and Teach without duplicate profiles.

**Guardrail:** Lurexa Learn owns class and learner management, assignments, operational scheduling, progress/intervention workflows and instructional delivery. Lurexa Teach owns educator professional growth, evidence, credentials and community.

Exit condition: an educator can develop professionally, submit and review trusted evidence, earn and verify credentials, participate in professional community and receive growth recommendations without Teach becoming the Learn teacher dashboard.

---

# Phase 7 — Offline and mobile resilience

Goal: make connectivity limitations a first-class commercial platform concern.

- [ ] Robust offline caching for eligible learning content.
- [ ] Safe progress/evidence synchronization.
- [ ] Conflict-resolution strategy.
- [ ] Low-bandwidth media/data optimization.
- [ ] Define viable offline Coach capabilities.
- [ ] Reconcile offline evidence before it changes trusted Learner Model state.
- [ ] Validate PWA/mobile behavior on representative lower-cost devices and unreliable networks.

Exit condition: core learning remains useful during intermittent connectivity and evidence synchronizes safely.

---

# Phase 8 — Lurexa Admin + Lurexa Insight

## Lurexa Admin

- [ ] Organization and tenant administration.
- [ ] User, role and permission management.
- [ ] Program/course configuration.
- [ ] Billing/subscription administration.
- [ ] Governance, audit and compliance controls.
- [ ] Learner-data/model access policy controls where required.

## Lurexa Insight

- [ ] Learner outcome dashboards.
- [ ] Cohort/course analysis.
- [ ] Engagement and retention analysis.
- [ ] Teacher/institution views.
- [ ] AI usage and learning-impact metrics.
- [ ] Interpretable intervention/risk signals.
- [ ] Authorized aggregated speaking/pronunciation trends.

Exit condition: institutions can operate the platform and understand outcomes without direct database access or opaque AI scores.

---

# Phase 8b — Lurexa Campus

Goal: support institutional cohorts, academic programs, faculty workspaces and campus-wide deployments across the shared Lurexa ecosystem.

- [ ] Campus onboarding and institutional workspace structure.
- [ ] Cohort, department and academic program management connected to Core.
- [ ] Multi-product institutional licenses and administrative governance.
- [ ] Mind-powered cohort learning insights and faculty support.
- [ ] Connect educator professional development (Teach) and student learning delivery (Learn) under institutional adoption.

---

# Phase 9 — Lurexa Studio

Goal: provide scalable content and learning-experience creation workflows.

- [ ] Course and lesson authoring.
- [ ] Assessment/question-bank creation.
- [ ] Media/resource management.
- [ ] Templates and reusable learning objects.
- [ ] AI-assisted content creation through Mind.
- [ ] Review, approval, versioning and publishing.
- [ ] Learner-aware adaptation at delivery time without corrupting canonical source content.

---

# Phase 10 — Coach distribution expansion

Goal: evolve Coach's distribution only after the learning loop demonstrates independent value.

- [ ] Evaluate embedded vs dedicated Coach application UX.
- [ ] Preserve shared identity and Learner Model regardless of distribution surface.
- [ ] Deepen pronunciation history and practice sequencing.
- [ ] Evaluate independent subscription/economics when justified.
- [ ] Preserve the rule that Coach consumes Mind; Coach does not become Mind.

---

# Phase 11 — Linguistic and ecosystem expansion

Goal: expand beyond the initial Dominican-English specialization without redesigning the foundation.

Potential directions:

- [ ] Additional Spanish L1 profiles.
- [ ] Additional L1 linguistic profiles.
- [ ] Additional subjects.
- [ ] Enterprise/institutional offerings.
- [ ] Marketplace capabilities.
- [ ] Public/partner APIs.
- [ ] Native mobile where justified.
- [ ] Corporate learning.
- [ ] Government/large-institution deployments.

Dominican Spanish is the first deep linguistic profile, not a permanent technical limit.

---

# Quality and governance requirements

- [ ] Focused tests for critical learner flows.
- [ ] Authorization tests for learner-context access.
- [ ] Tests for missing, stale and partial learner context.
- [ ] AI evaluation/regression testing before Mind becomes production-critical.
- [ ] Representative Coach evaluation set for Dominican Spanish learners.
- [ ] Linguistic/ELT validation for production transfer claims.
- [ ] Measure personalized Coach sessions against generic uncontextualized AI conversation.
- [ ] Track speech/AI cost, reliability and latency.
- [ ] Maintain evidence/inference separation.

# Repository architecture rules

- Keep architecture documentation current as ownership changes.
- Do not rename packages solely to match branding.
- Prevent products from bypassing Core trust boundaries.
- Prevent product UIs from calling AI providers directly for persistent learner intelligence.
- Prevent multiple apps from creating competing learner truth.
- Keep Lurexa Insight as the analytics/intelligence/reporting product name.
- Treat conceptual architecture changes separately from implementation status.

# End-state principle

> **Lurexa Learning Technologies builds the ecosystem.**  
> **Lurexa Core owns trust.**  
> **Lurexa Mind interprets learning.**  
> **Products deliver experiences and generate evidence.**  
> **One learner. One evolving model. Every Lurexa experience adapts around it.**
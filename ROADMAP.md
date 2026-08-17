# Lurexa roadmap

Status reflects the workspace and repository state inspected through 2026-08-17. It is a working plan, not a release promise.

## Strategic company and product architecture

```text
Lurexa Learning Technologies
│
├── Lurexa Core
│   └── Shared trusted platform foundation
│
├── Lurexa Mind
│   └── Shared learning intelligence and adaptation
│
└── Products
    ├── Lurexa Learn
    ├── Lurexa Coach
    ├── Lurexa Teach
    ├── Lurexa Admin
    ├── Lurexa Insight
    └── Lurexa Studio
```

### Lurexa Learning Technologies

The parent company and master business identity. It owns the platform technologies, products, intellectual property, standards, and ecosystem strategy.

### Lurexa Core

The shared technical foundation. Core owns trusted identity, authorization, organizations, learning records, content contracts, commerce, scheduling, notifications, APIs, platform analytics, and offline/sync infrastructure.

### Lurexa Mind

The shared intelligence layer. Mind owns the Learner Model, personalization, recommendations, tutoring intelligence, speaking/pronunciation intelligence, L1-transfer intelligence, adaptive feedback, assessment intelligence, content adaptation, pedagogical agents, model abstraction, validation, and responsible-AI safeguards.

### Lurexa Coach

Lurexa Coach is a user-facing English speaking and pronunciation product, initially focused on Dominican Spanish speakers. It is powered by Mind and Core.

Coach should launch first inside Lurexa Learn, use the shared Learner Model, and automatically adapt conversation difficulty, topics, vocabulary, correction load, and pronunciation targets to the learner's current CEFR/context.

The goal is not accent erasure. The progression is intelligibility → naturalness → optional pronunciation refinement.

## Strategic learner principle

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Products observe the learner. Mind interprets authorized evidence. Core protects and persists trusted learning records.

A learner moving from Learn to Coach should not need to restate information the ecosystem already knows, such as current CEFR level, unit, vocabulary targets, grammar targets, or recurring speaking issues.

The detailed architecture is defined in `Docs/Architecture/Learner Model Architecture.md`.

## Current baseline

- [x] pnpm/Turborepo workspace established with shared packages and multiple applications.
- [x] Firebase configuration, Firestore rules, and indexes are present.
- [x] Shared design tokens, UI, types, database, backend, auth, config, SDK, and utility packages exist.
- [x] `learn-web` has a working Vercel-oriented build configuration after recent deployment fixes.
- [x] GitHub Actions provide lint, type-check, and build workflows.
- [x] Company/product hierarchy defined: Learning Technologies → Core/Mind → products.
- [x] Lurexa Bible updated with the company/platform hierarchy.
- [x] Product ecosystem documentation aligned to Learn, Coach, Teach, Admin, Insight, and Studio.
- [x] Dedicated Learner Model Architecture created.
- [x] Codex and root agent instructions updated to enforce Core/Mind/product ownership and learner-model rules.

## Immediate engineering priorities

1. Align GitHub Actions with the declared pnpm 10.3.0 version and verify CI on `main`.
2. Verify the `learn-web` production deployment end to end.
3. Run the supported lint/type/build workflow from a clean dependency install and resolve remaining workspace incompatibilities.
4. Replace generated app READMEs with project-specific setup/ownership documentation.
5. Map existing packages explicitly to Core/Mind capabilities without premature renaming.
6. Define the first version of the shared learner-context contract before implementing production personalization.

---

# Phase 1 — Engineering and Lurexa Core foundation

Goal: create a stable production platform on which all products can depend.

- [ ] Complete authentication, RBAC, organizations, and user-profile flows.
- [ ] Define stable domain contracts in `@lurexa/types`.
- [ ] Expose supported application interfaces through `@lurexa/sdk` or equivalent service boundaries.
- [ ] Establish reliable enrollment, progress, assessment, and learning-event persistence.
- [ ] Define Core ownership for identity, learning records, content contracts, commerce, scheduling, notifications, platform analytics, and offline/sync.
- [ ] Define authorization rules for Mind access to learner context.
- [ ] Establish migrations/seed/environment guidance.

Exit condition: new product experiences do not need to duplicate foundational business logic or trusted learner records.

---

# Phase 2 — Lurexa Learn MVP

Goal: ship the first production learner experience on Core.

- [ ] Complete learner onboarding and profile flow.
- [ ] Complete course/module/lesson navigation.
- [ ] Complete enrollment and progress persistence.
- [ ] Deliver core interactive activities.
- [ ] Establish assessment and feedback workflows.
- [ ] Capture reliable learning evidence needed later by Mind.
- [ ] Validate responsive and low-bandwidth behavior.
- [ ] Establish learner-facing product analytics.

Important evidence to capture:

- current CEFR/placement state
- current course/module/unit
- recently studied topics
- vocabulary/grammar targets
- activity and assessment outcomes
- recurring error evidence where reliable

Exit condition: a learner can register, enroll, learn, complete activities, and retain trustworthy progress in production.

---

# Phase 3 — Lurexa Mind + Learner Model foundation

Goal: create reusable intelligence and a shared learner model instead of product-specific AI memory.

- [ ] Establish AI/model gateway and provider abstraction.
- [ ] Define pedagogical prompt/policy layers.
- [ ] Define learner-context contracts supplied by Core.
- [ ] Define evidence provenance: source, timestamp, confidence, and review behavior where appropriate.
- [ ] Implement initial Learner Model domains:
  - [ ] CEFR/proficiency state
  - [ ] current curriculum context
  - [ ] goals/preferences
  - [ ] vocabulary/grammar mastery primitives
  - [ ] recurring error representation
- [ ] Establish personalization and recommendation primitives.
- [ ] Implement validation, safety, privacy, and observability boundaries.
- [ ] Define AI evaluation metrics for educational usefulness, reliability, latency, and cost.

Exit condition: multiple product experiences can consume shared intelligence and learner context without creating separate learner memories or direct provider coupling.

---

# Phase 4 — Embedded Lurexa Coach MVP

Goal: validate the differentiated speaking/pronunciation experience inside Lurexa Learn.

## Session adaptation

- [ ] Read authorized learner context before starting a session.
- [ ] Adapt conversation to current CEFR level.
- [ ] Adapt vocabulary and grammar to recent learning context.
- [ ] Adjust speaking speed, question length, and correction intensity.
- [ ] Avoid forcing advanced structures on lower-level learners unless explicitly requested.

## Speaking experience

- [ ] Free conversation mode.
- [ ] Guided role-play mode.
- [ ] Pronunciation-focused practice.
- [ ] Curriculum-linked speaking practice from Learn.
- [ ] English-first feedback modes.

## Pronunciation intelligence

- [ ] Define initial pronunciation evidence model.
- [ ] Track high-value recurring patterns rather than isolated mistakes only.
- [ ] Support intelligibility-focused feedback.
- [ ] Support word stress, sentence stress, rhythm, intonation, and connected speech where technically reliable.
- [ ] Implement initial Dominican-Spanish L1-transfer taxonomy.
- [ ] Provide actionable explanations instead of generic accent scores.

## Dominican linguistic differentiation

- [ ] Build a validated initial catalog of common Dominican-Spanish → English transfer patterns.
- [ ] Include common literal-transfer and natural-phrasing cases.
- [ ] Support intended-meaning interpretation for selected Dominican idioms/slang without teaching literal translation as natural English.
- [ ] Validate examples with qualified English-language teaching/pronunciation expertise before treating them as production rules.

## Session feedback

- [ ] Prioritize highest-impact feedback rather than interrupting every error.
- [ ] Separate conversation-time feedback from post-session review.
- [ ] Record successful corrections and recurring targets.
- [ ] Update the Learner Model through approved persistence boundaries.

Exit condition: Coach can conduct a useful CEFR-appropriate session, use known Learn context automatically, identify meaningful speaking/pronunciation patterns, and feed approved observations back into the shared Learner Model.

---

# Phase 5 — Closed-loop adaptation between Learn and Coach

Goal: make Learn and Coach reinforce each other instead of acting as separate tools.

- [ ] Learn recommends Coach practice based on current lessons and learner needs.
- [ ] Coach automatically uses recent Learn curriculum context.
- [ ] Coach evidence can trigger targeted follow-up activities in Learn.
- [ ] Repeated speaking errors can influence recommended practice.
- [ ] Successful corrections can reduce unnecessary repetition.
- [ ] Add user-facing explanations for why a practice activity is recommended.
- [ ] Add learner controls for relevant personalization/history settings.

Example loop:

```text
Learn lesson
  ↓
Core learning record
  ↓
Mind learner model
  ↓
Coach targeted practice
  ↓
Speaking evidence
  ↓
Mind interpretation
  ↓
Core-approved persistence
  ↓
Learn follow-up recommendation
```

Exit condition: learners experience Learn + Coach as one continuous learning relationship.

---

# Phase 6 — Lurexa Teach

Goal: provide educators with a professional workspace powered by the same Core and Mind capabilities.

- [ ] Class, learner, and assignment management.
- [ ] Progress and intervention views.
- [ ] Scheduling workflows.
- [ ] AI-assisted lesson/feedback support.
- [ ] Role-appropriate learner-model summaries.
- [ ] Interpretable recommendations and learner-risk signals.
- [ ] Privacy controls preventing unnecessary exposure of detailed learner-model data.

Exit condition: teachers can manage learning workflows and use appropriate learner intelligence without a separate technical foundation.

---

# Phase 7 — Offline and mobile resilience

Goal: make connectivity limitations a first-class architecture concern.

- [ ] Robust offline caching for eligible learning content.
- [ ] Safe progress synchronization and conflict resolution.
- [ ] Low-bandwidth media/data optimization.
- [ ] Define offline Coach capabilities where viable.
- [ ] Reconcile offline learning evidence safely before it changes persistent learner-model state.
- [ ] Validate PWA/mobile behavior on representative lower-cost devices and unreliable networks.

Exit condition: core learning remains useful during intermittent connectivity and learner evidence synchronizes safely.

---

# Phase 8 — Lurexa Admin and Lurexa Insight

## Lurexa Admin

- [ ] Organization and tenant administration.
- [ ] User, role, and permission management.
- [ ] Program/course configuration.
- [ ] Billing/subscription administration.
- [ ] Governance, audit, and compliance controls.
- [ ] Learner-model access policy controls where required.

## Lurexa Insight

- [ ] Learner outcome dashboards.
- [ ] Cohort/course performance analysis.
- [ ] Engagement and retention analysis.
- [ ] Teacher/institution views.
- [ ] AI usage and learning-impact metrics.
- [ ] Interpretable learning-risk/intervention signals.
- [ ] Aggregated speaking/pronunciation trends where authorized and educationally useful.

Exit condition: institutional users can operate the platform and understand meaningful outcomes without direct database access or opaque AI scores.

---

# Phase 9 — Lurexa Studio

Goal: provide scalable educational content creation and publishing workflows.

- [ ] Course and lesson authoring.
- [ ] Assessment/question-bank creation.
- [ ] Media/resource management.
- [ ] Templates and reusable learning objects.
- [ ] AI-assisted content creation through Mind.
- [ ] Review, approval, versioning, and publishing workflows.
- [ ] Allow learner-model-informed adaptation at delivery time without corrupting canonical source content.

---

# Phase 10 — Cross-product / standalone Lurexa Coach

Goal: evolve Coach only after the embedded product demonstrates independent value.

- [ ] Shared identity and Learner Model across relevant products.
- [ ] Cross-product goals and practice plans.
- [ ] Deeper pronunciation history and personalized practice sequencing.
- [ ] Optional target-pronunciation preferences.
- [ ] Evaluate standalone application/subscription economics.
- [ ] Preserve the rule that Coach consumes Mind; Coach does not become Mind.

Exit condition: Coach has sufficient independent user and business value to justify standalone distribution.

---

# Phase 11 — Linguistic and ecosystem expansion

Goal: expand beyond the initial Dominican-English beachhead without breaking the architecture.

Potential directions:

- [ ] Additional Spanish L1 profiles.
- [ ] Additional subjects.
- [ ] Enterprise/institutional offerings.
- [ ] Marketplace.
- [ ] Public/partner APIs.
- [ ] Native mobile where justified.
- [ ] Corporate learning.
- [ ] Government/large-institution deployments.

Dominican Spanish is the first deep linguistic profile, not a permanent technical limit.

---

# Quality and validation requirements

- [ ] Add focused tests for critical learner flows.
- [ ] Add authorization tests for learner-context access.
- [ ] Add tests for missing, stale, and partial learner-model context.
- [ ] Establish AI evaluation/regression testing before Mind becomes production-critical.
- [ ] Build a representative Dominican Spanish learner evaluation set for Coach.
- [ ] Validate pronunciation/L1-transfer claims with appropriate linguistic/ELT expertise.
- [ ] Measure whether personalized Coach sessions outperform generic uncontextualized AI conversation.
- [ ] Track cost and latency of speech/AI pipelines.

---

# Repository hygiene and architecture rules

- [ ] Keep root documentation current as product/capability ownership changes.
- [ ] Avoid renaming existing packages solely for branding.
- [ ] Prevent product applications from bypassing Core service boundaries.
- [ ] Prevent product UIs from calling AI providers directly.
- [ ] Prevent multiple apps from creating separate learner-model truth.
- [ ] Keep Lurexa Insight as the authoritative product name; do not reintroduce `Lurexa Analytics` as a product name.

---

# End-state principle

> **Lurexa Learning Technologies builds the ecosystem.**  
> **Lurexa Core powers it.**  
> **Lurexa Mind understands and adapts.**  
> **Products deliver the experience.**  
> **One learner. One evolving model. Every Lurexa experience adapts around it.**

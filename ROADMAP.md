# Lurexa roadmap

Status reflects the workspace and repository state inspected through 2026-08-17. It is a working plan, not a release promise.

## Strategic company and product architecture

Lurexa is organized around a four-level model:

```text
Lurexa Learning Technologies
│
├── Platform technologies
│   ├── Lurexa Core
│   └── Lurexa Mind
│
├── Products
│   ├── Lurexa Learn
│   ├── Lurexa Teach
│   ├── Lurexa Admin
│   ├── Lurexa Insight
│   ├── Lurexa Coach
│   └── Lurexa Studio
│
└── Product features
    ├── AI Tutor
    ├── Speaking Coach
    ├── Adaptive Learning Paths
    ├── Assessment Engine
    └── Offline Learning
```

### Lurexa Learning Technologies

The parent company and master business identity. It owns the platform technologies, products, intellectual property, standards, and long-term ecosystem strategy.

### Lurexa Core

The shared technical foundation. Core owns reusable infrastructure and platform services such as identity, organizations, RBAC, learning records, shared data contracts, billing, scheduling, notifications, APIs, offline synchronization, and platform analytics.

### Lurexa Mind

The reusable learning-intelligence layer. Mind owns AI orchestration, learner modeling, personalization, adaptive learning, recommendations, tutoring intelligence, assessment intelligence, content adaptation, pedagogical agents, model abstraction, validation, and responsible-AI safeguards.

### Lurexa Coach

Lurexa Coach is a user-facing product powered by Lurexa Mind and supported by Lurexa Core. It should launch first as an embedded experience inside Lurexa Learn, then evolve into a cross-product and potentially standalone product after it demonstrates independent value.

## Current baseline

- [x] pnpm/Turborepo workspace established with shared packages and multiple applications.
- [x] Firebase configuration, Firestore rules, and indexes are present.
- [x] Shared design tokens, UI, types, database, backend, auth, config, SDK, and utility packages exist.
- [x] `learn-web` has a Vercel build configuration and recent deployment-focused fixes.
- [x] Database seed data has recent fixes for organization, author, status, and module fields.
- [x] GitHub Actions provide lint, type-check, and build workflows.
- [x] Company/product hierarchy defined: Lurexa Learning Technologies → Core/Mind → products → features.
- [x] Lurexa Bible updated to make the hierarchy a source-of-truth decision.

## Immediate priorities

1. Align GitHub Actions with the declared pnpm 10.3.0 version, then run the full CI workflow on `main`.
2. Verify the `learn-web` production deployment end to end: install, build, environment variables, and the deployed application.
3. Run `pnpm lint`, `pnpm check-types`, and `pnpm build` from a clean dependency install; resolve any remaining workspace incompatibilities.
4. Replace remaining generated app READMEs with project-specific setup and ownership documentation.
5. Map existing packages and capabilities explicitly to Lurexa Core and Lurexa Mind without prematurely renaming stable packages.

## Phase 1 — Engineering and Lurexa Core foundation

Goal: create a stable production platform on which every Lurexa product can depend.

- [ ] Complete authentication, RBAC, organizations, and user-profile flows using shared auth and backend layers.
- [ ] Define stable domain contracts in `@lurexa/types` and expose supported integrations through `@lurexa/sdk`.
- [ ] Establish database migrations, repeatable seed data, and environment-specific operational guidance.
- [ ] Define Core ownership boundaries for identity, learning records, content contracts, commerce, scheduling, notifications, offline/sync, and platform analytics.
- [ ] Document application ownership and the supported relationship among learner, teacher, admin, mobile, and documentation apps.
- [ ] Define authorization rules for any future Mind access to learner context and personal data.

Exit condition: shared platform services are stable enough that new product experiences do not need to duplicate foundational business logic.

## Phase 2 — Lurexa Learn MVP

Goal: ship the first production learner experience on top of Lurexa Core.

- [ ] Complete learner onboarding and profile flow.
- [ ] Complete course/module/lesson navigation.
- [ ] Complete enrollment and progress persistence.
- [ ] Deliver core interactive learning activities.
- [ ] Establish assessment and feedback workflows.
- [ ] Validate responsive and low-bandwidth behavior.
- [ ] Establish learner-facing product analytics.

Exit condition: a learner can register, enroll, learn, complete activities, and retain progress reliably in production.

## Phase 3 — Lurexa Mind foundation

Goal: create reusable intelligence services instead of embedding provider-specific AI logic directly in applications.

- [ ] Establish an AI/model gateway and provider abstraction.
- [ ] Define pedagogical prompt and policy layers.
- [ ] Define learner-context contracts supplied by Core.
- [ ] Implement validation, safety, privacy, and observability boundaries.
- [ ] Establish learner modeling and personalization primitives.
- [ ] Implement recommendation and adaptive-learning services.
- [ ] Define AI evaluation metrics for educational usefulness, reliability, latency, and cost.

Exit condition: multiple product experiences can consume shared intelligence without directly coupling to a specific model provider.

## Phase 4 — Embedded Lurexa Coach

Goal: turn Lurexa Mind into a differentiated user-facing learning relationship inside Lurexa Learn.

- [ ] Introduce a persistent Coach experience inside Lurexa Learn.
- [ ] Support learning goals and study planning.
- [ ] Recommend next activities using learner context.
- [ ] Provide progress reflection and error analysis.
- [ ] Add speaking and practice workflows where viable.
- [ ] Define Coach memory/context boundaries and privacy controls.
- [ ] Measure whether Coach improves learning behavior and outcomes beyond a generic chatbot.

Exit condition: Coach provides useful personalized guidance inside Learn and demonstrates measurable value as a product concept.

## Phase 5 — Lurexa Teach

Goal: provide educators with a professional workspace powered by the same Core and Mind capabilities.

- [ ] Complete class, learner, and assignment management.
- [ ] Add progress and intervention views.
- [ ] Add teacher-facing scheduling workflows.
- [ ] Add AI-assisted lesson and feedback support through Mind.
- [ ] Add educator analytics and learner-risk signals with interpretable evidence.

Exit condition: teachers can manage learning workflows without requiring a separate technical foundation from Learn.

## Phase 6 — Offline and mobile resilience

Goal: make connectivity limitations a first-class architecture concern.

- [ ] Implement robust offline caching for eligible learning content.
- [ ] Implement safe progress synchronization and conflict resolution.
- [ ] Optimize low-bandwidth media and data flows.
- [ ] Define on-device intelligence use cases where practical.
- [ ] Validate PWA/mobile behavior on representative lower-cost devices and unreliable networks.

Exit condition: core learning workflows remain useful during intermittent connectivity and synchronize safely.

## Phase 7 — Lurexa Admin and Lurexa Insight

Goal: support institutions, operations, governance, and evidence-based decision making.

### Lurexa Admin

- [ ] Organization and tenant administration.
- [ ] User, role, and permission management.
- [ ] Program and course configuration.
- [ ] Billing/subscription administration.
- [ ] Governance, audit, and compliance controls.

### Lurexa Insight

- [ ] Learner outcome dashboards.
- [ ] Cohort/course performance analysis.
- [ ] Engagement and retention analysis.
- [ ] Teacher/institution views.
- [ ] AI usage and learning-impact metrics.
- [ ] Interpretable learning-risk and intervention signals.

Exit condition: institutional users can operate the platform and understand meaningful learning outcomes without direct database access.

## Phase 8 — Lurexa Studio

Goal: provide scalable educational content creation and publishing workflows.

- [ ] Course and lesson authoring.
- [ ] Assessment and question-bank creation.
- [ ] Media/resource management.
- [ ] Templates and reusable learning objects.
- [ ] AI-assisted content creation through Mind.
- [ ] Review, approval, versioning, and publishing workflows.

Exit condition: educators and internal teams can build high-quality content without engineering intervention for normal authoring tasks.

## Phase 9 — Cross-product Lurexa Coach

Goal: evolve Coach from an embedded Learn feature into an ecosystem-level product experience.

- [ ] Allow Coach to use shared identity and learner context across relevant products.
- [ ] Define role-aware experiences for learners and educators.
- [ ] Establish cross-product goals, recommendations, and progress reflection.
- [ ] Evaluate whether Coach warrants its own application and/or subscription tier.
- [ ] Preserve the architectural rule that Coach consumes Mind; Coach does not become Mind.

Exit condition: Coach has sufficient independent value and technical separation to justify cross-product or standalone distribution.

## Phase 10 — Ecosystem expansion

Goal: extend Lurexa beyond the initial English-learning product while preserving the platform architecture.

Potential areas:

- [ ] Additional subjects.
- [ ] Institutional/enterprise offerings.
- [ ] Marketplace.
- [ ] Public or partner APIs.
- [ ] Mobile-native products where justified.
- [ ] Corporate learning.
- [ ] Government and large-institution deployments.

Architecture rule: new products must compose Lurexa Core and Lurexa Mind capabilities rather than create isolated platform foundations.

## Quality and delivery

- [ ] Add focused test coverage for shared packages and critical learner flows.
- [ ] Standardize framework and React versions across applications where compatibility permits.
- [ ] Establish preview/production deployment ownership to avoid overlapping Vercel and GitHub Actions deploy paths.
- [ ] Add release checks for environment configuration and Firestore security rules.
- [ ] Add architectural checks that prevent product applications from bypassing Core service boundaries.
- [ ] Establish AI evaluation and regression testing before Mind becomes production-critical.

## Repository hygiene

- [x] Generated dependency directories and Turborepo cache identified as safe-to-regenerate artifacts.
- [x] Remove duplicate standalone Next.js templates and conflicting npm/per-package lockfiles; supported runtime apps now live under `apps/`.
- [ ] Keep root documentation current as applications, packages, platform ownership, and deployment responsibility change.
- [ ] Avoid renaming existing packages solely for branding; introduce Core/Mind package boundaries when supported by actual domain ownership.

## End-state principle

> **Lurexa Learning Technologies builds the ecosystem.**  
> **Lurexa Core powers it.**  
> **Lurexa Mind makes it intelligent.**  
> **Lurexa products deliver the experience.**

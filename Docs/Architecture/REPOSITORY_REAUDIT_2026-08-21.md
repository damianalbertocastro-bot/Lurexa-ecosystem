# Lurexa Repository Re-Audit — 2026-08-21

Status: **Post-consolidation audit — implementation branch**

Scope: repository topology, current deployable apps, Learn/Teach product boundaries, product-shell identity, shared UI portability, visible placeholder data, commerce stubs, security-sensitive future services, GitHub validation topology, and Vercel project ownership.

This audit evaluates the repository after the Teach-led design/consolidation work on `design/teach-led-ecosystem-unification`. It does not treat stale production deployments as repository truth.

## Executive assessment

The repository is materially cleaner than at the start of this audit. The largest structural defect — two independent Lurexa Learn teacher applications — has been removed from the repository. Current app topology is now:

- `apps/web` — Lurexa Learning Technologies ecosystem site;
- `apps/learn-web` — Lurexa Learn learner + teacher operational experience;
- `apps/teach-web` — Lurexa Teach professional-development product;
- `apps/admin-portal` — Lurexa Admin;
- `apps/docs` — Lurexa Docs;
- `apps/mobile` — Lurexa Learn mobile surface.

There is no longer a repository-level `apps/teacher-portal` application on this branch.

The highest remaining risks are no longer visual. They are release/configuration drift, legacy browser-write services, incomplete commerce/telemetry infrastructure, and the need for a real executable validation run after repeated GitHub Actions runner-start failures.

## Fixed — product ownership and teacher architecture

### Duplicate teacher application removed

`apps/teacher-portal` duplicated functionality already owned by `apps/learn-web/app/teacher/*`. It contained no unique trusted course/invitation/backend implementation requiring preservation.

Correction:

- deleted `apps/teacher-portal`;
- removed it from `bootstrap/repository.json`;
- removed it as an independent deployment-validation surface;
- `deployment/products.json` assigns the teacher workspace to `apps/learn-web` / `lurexa-learn-web`;
- added `scripts/verify-teacher-workspace-boundary.mjs`;
- added `pnpm verify:teacher-workspace` to local and CI verification.

### Canonical `/teacher/*` routes corrected to Lurexa Learn

A P0 identity defect was found in `apps/learn-web/app/teacher/layout.tsx`: the entire Learn teacher route tree was wrapped in `ProductShell product="teach"`.

Correction: canonical teacher routes now render `product="learn"`.

This enforces the product boundary:

- Learn owns classes, courses, lessons, learners, assignments, progress, interventions and instructional operations;
- Teach owns educator professional development, growth, evidence, credentials and educator professional community.

## Fixed — Teach-led visual-system rollout

Lurexa Teach remains the quality reference for shared interaction grammar without forcing products to share one personality.

Updated Learn surfaces:

- student dashboard;
- teacher dashboard;
- login;
- signup;
- onboarding;
- teacher course management;
- teacher student access management;
- teacher insights;
- teacher assessment builder;
- teacher plan/billing surface;
- Learn Scenario Lab prototype.

Shared improvements include:

- one product identity per screen hierarchy;
- sticky product shell instead of repeated logos;
- title/subtitle moved into strong content heroes;
- navy/violet gradient hero language;
- cyan participation/intelligence accents;
- 12px action buttons;
- 24–34px content/card radius hierarchy;
- clearer primary/secondary actions;
- better empty/loading/error honesty.

Teach login/profile, Admin and Docs were reviewed and already substantially followed the target grammar; broad rewrites were intentionally avoided.

## Fixed — ecosystem logo rendering

Root cause: `apps/web` does not run Tailwind, while shared `MasterMark` and `ProductMark` components previously relied on Tailwind utility classes for essential SVG dimensions.

Correction:

- brand mark sizes now include explicit pixel geometry;
- SVG glyphs use explicit width/height behavior;
- compact product marks render without depending on a Tailwind consumer.

Shared UI follow-up: essential geometry/accessibility in reusable primitives must not depend on an app-specific CSS framework unless that dependency is explicitly part of the component contract.

## Fixed — teacher analytics trust defects

The old teacher analytics flow had multiple trust violations:

- UI queried hard-coded `org_demo`;
- analytics service returned a fabricated 24-student class when no data existed;
- roster returned three fabricated named students regardless of organization;
- recommendation copy was labeled AI without a governed Mind boundary.

Corrections:

- teacher organization resolved from authenticated membership;
- org-scoped course progress is used for available aggregate metrics;
- no-data returns zero/empty rather than demo data;
- roster returns empty until Core-owned learner identity/profile data can be joined safely;
- recommendations are labeled class-data recommendations, not Mind output.

Remaining architecture task: create a trusted org-scoped analytics projection/read model that joins membership identity, course enrollment/progress and validated learning evidence without requiring expensive client aggregation.

## Fixed — Admin fabricated metrics

The old Admin service hard-coded:

- monthly active users;
- monthly recurring revenue;
- AI token volume;
- system error rate;
- demo organizations;
- a fake 25-student count per real organization.

Corrections:

- organization count is read from stored organizations;
- monthly active learners are derived from recent progress activity;
- AI token count uses recorded AI-conversation telemetry;
- organization student count uses actual student membership subcollections;
- unavailable MRR/error telemetry remains unavailable instead of fabricated;
- empty organization collections render empty states rather than fake institutions.

Remaining architecture task: move global operational metrics to trusted server-side aggregated projections rather than broad browser reads.

## Fixed — billing and commerce honesty

The old teacher billing surface:

- used `org_demo`;
- showed a hard-coded `18` seats used;
- displayed unapproved `$9` and `$29` prices;
- redirected upgrade actions to fake Stripe `demo_*` checkout URLs.

Corrections:

- organization comes from authenticated membership;
- student seat usage is counted from real org members;
- stored subscriptions determine current plan;
- no paid prices are presented as authoritative;
- paid checkout throws an explicit not-configured error and performs no payment action;
- UI explains that commerce requires pricing source of truth, server checkout, webhooks, billing-state reconciliation, tax/refund policy and audit contracts before activation.

## Fixed — future Marketplace transactions

Marketplace is a future concept, but legacy `MarketplaceService` could:

- publish listings;
- fabricate listings when empty;
- record purchases as `completed` without a payment processor.

Correction:

- listing publication is disabled;
- catalog returns empty while inactive;
- purchase operations throw an explicit future-concept error;
- no fake transaction or revenue split is persisted.

Activation must be an explicit product/architecture decision.

## Fixed — institutional API-key storage

Legacy `EcosystemService.generateAPIKey()` stored the raw key value in a field named `apiKeyHash` and used `Math.random()` key material.

Correction:

- key material uses cryptographic random bytes;
- only a SHA-256 digest is persisted;
- raw secret is returned exactly once to the caller.

Future production API activation still needs server-only issuance, scoped permissions, revocation, rotation, audit logging, usage enforcement and secure secret-display UX.

## Fixed — prototype product-boundary defects

### Learn Scenario Lab

`/teacher/studio` previously called itself `Lurexa Studio` and saved a hard-coded chemistry scenario to `crs_studio_chem`.

Correction:

- renamed conceptually to Learn Scenario Lab prototype;
- explicitly separated from standalone Lurexa Studio;
- demo persistence disabled;
- production authoring must use authenticated course/lesson context and governed learning-activity contracts.

### Quiz sample generator

The assessment builder presented `AIGeneratorService.generateLessonDraft()` as an AI Question Generator even though the service currently returns deterministic placeholder content.

Correction:

- UI labels it a prototype sample helper;
- explicit note says it is not Lurexa Mind or live AI;
- production generation must use approved server-side intelligence/provider orchestration plus educator review.

## Reviewed — lesson runtime

`LessonRuntime` remains a large but substantive production path:

- authenticated load;
- trusted server-side start/attempt/response/complete actions;
- retrieval scheduling/completion;
- structured activities;
- advanced listening/speaking/roleplay capability boundaries;
- completion explicitly does not claim mastery.

It already runs inside the canonical Learn `ProductShell`. A broad visual rewrite is lower value than preserving its learning-evidence behavior. Future improvements should extract reusable visual activity containers rather than rewrite the runtime wholesale.

## Reviewed — Teach, Admin and Docs UI

### Teach

The Teach landing, shell, login and professional profile remain the reference-quality product implementation. Their professional-development ownership is consistent with the canonical boundary.

### Admin

The shell is visually consistent and accessible; data-trust defects were fixed in the service/UI as described above.

### Docs

Docs has its own structured knowledge-base personality, canonical mark, sticky navigation, mobile navigation, search entry and repository-backed documentation model. No Teach-style homogenization is required.

## Remote configuration still required — Vercel

The repository already contains the intended project-provisioning behavior in `scripts/provision-vercel-projects.mjs`:

- legacy ignored-build command cleared;
- native affected-project deployments enabled;
- one project per actual deployable surface.

Current connected Vercel tooling in this session does not expose the project-setting mutation or project-deletion actions required to apply/verify all remote changes.

Required remote actions:

1. apply/verify affected-project deployment settings for each active Vercel project;
2. verify `/teacher/*` is served by `lurexa-learn-web` after release;
3. migrate any externally used teacher-specific domain/alias if one exists;
4. delete/retire the orphaned `lurexa-teacher` Vercel project;
5. confirm production SHA after intentional production release.

Do not create extra hosted previews merely for visual review; local-first verification remains the default policy.

## Remaining P0/P1 repository risks

### P0 — executable validation signal

Repeated PR #48 GitHub Actions runs failed before executing any workflow step. Jobs contained zero steps and produced no useful code-level logs. This is a runner/start infrastructure failure pattern, not evidence that source verification failed.

Before merge, obtain one executable run of:

- frozen install;
- brand verification;
- product registry verification;
- teacher-workspace verification;
- Vercel release-contract verification;
- linguistic intelligence;
- learner model;
- Mind recommendations;
- Firestore rules;
- Phase 0 lint/type/build;
- affected product builds.

### P1 — stale lock importer

Because the duplicate app was retired through repository tree operations in this session, `pnpm-lock.yaml` still contains an `apps/teacher-portal` importer block. It should be removed by a normal pnpm lock regeneration, not by manually rewriting unrelated generated lock data.

Required cleanup:

```bash
pnpm install --lockfile-only
# or normal pnpm install using pnpm 10.3.0
```

Then verify no `apps/teacher-portal` importer remains and run `pnpm install --frozen-lockfile`.

### P1 — legacy direct browser write services

`CourseService.saveCourse` and `CourseBuilderService` still expose client-side Firestore mutation paths while canonical Learn authoring now uses trusted CoursePlatform/API routes.

Recommended next cleanup:

1. find remaining consumers;
2. migrate them to the trusted server boundary;
3. disable/remove direct browser writes;
4. make Firestore rules enforce the same ownership boundary.

### P1 — analytics projection architecture

Current honest analytics are still client-side aggregations. Build Core-owned projections for:

- organization learner count;
- active learners;
- course/lesson completion;
- assessment evidence summaries;
- intervention queues;
- operational telemetry.

### P1 — telemetry and commerce activation contracts

MRR and system error rate are deliberately unavailable until supported by authoritative telemetry. Paid commerce is deliberately unavailable until Stripe/server contracts exist.

### P2 — legacy service naming and prototype debt

`AIGeneratorService` is a deterministic placeholder despite its historical name. Keep current UI honesty, then either replace it with approved Mind/provider orchestration or rename/remove the legacy service.

`EcosystemService` is a broad historical catch-all spanning Studio, Coach, classroom and API concepts. Continue decomposing it into product/layer-specific trusted services as those capabilities mature.

### P2 — shared shell primitives

Once the current Learn/Teach implementations settle, consider extracting narrowly scoped family primitives:

- ProductHeader;
- ProductHero;
- ProductSubnav;
- MetricCard;
- ActionPanel.

Do not create a universal dashboard template that erases product personality.

## Current release recommendation

Do **not** merge PR #48 solely on GitHub’s current red indicator because the observed failures did not execute steps. Also do not declare the branch green.

Merge only after one real executable CI run (or an equivalent local `pnpm verify:local`) confirms the post-retirement lock/workspace state and affected app builds.

After merge, release intentionally and verify production SHA before judging the live Vercel UI.

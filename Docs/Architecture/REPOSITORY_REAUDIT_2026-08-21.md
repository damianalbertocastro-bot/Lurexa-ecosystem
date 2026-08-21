# Lurexa Repository Re-Audit — 2026-08-21

Status: **Post-consolidation + production-hardening audit — implementation branch**

Branch: `design/teach-led-ecosystem-unification`

This audit evaluates repository truth after the Teach-led ecosystem redesign and the subsequent production-hardening pass. Stale production deployments are not treated as source of truth.

## Executive assessment

The repository is materially cleaner and safer than at the start of this audit. The major structural, trust, and product-boundary defects found during the audit have been corrected on this branch.

Current app topology:

- `apps/web` — Lurexa Learning Technologies ecosystem site;
- `apps/learn-web` — Lurexa Learn learner + teacher operational experience;
- `apps/teach-web` — Lurexa Teach professional-development product;
- `apps/admin-portal` — Lurexa Admin;
- `apps/docs` — Lurexa Docs;
- `apps/mobile` — Lurexa Learn mobile surface.

`apps/teacher-portal` no longer exists on this branch.

The highest remaining blockers are now release/execution issues rather than unresolved repository architecture:

1. regenerate the pnpm lockfile so the deleted teacher-portal importer disappears through pnpm rather than hand-editing generated dependency data;
2. obtain a real executable CI run after repeated GitHub Actions runner-start failures;
3. apply/verify Vercel affected-project settings remotely and retire the orphaned `lurexa-teacher` Vercel project after route verification;
4. add real commerce/observability infrastructure before activating paid plans, MRR, or production error-rate reporting.

## Fixed — product ownership and teacher architecture

### Duplicate teacher application retired

The standalone `apps/teacher-portal` duplicated the operational teacher experience already owned by `apps/learn-web/app/teacher/*`.

Corrections:

- deleted `apps/teacher-portal`;
- removed it from bootstrap and deployment ownership;
- canonical teacher deployment belongs to `apps/learn-web` / `lurexa-learn-web`;
- added `scripts/verify-teacher-workspace-boundary.mjs`;
- added `pnpm verify:teacher-workspace` to local/CI verification.

### Learn / Teach identity corrected

The canonical `/teacher/*` layout incorrectly rendered `ProductShell product="teach"`.

It now renders Lurexa Learn. Operational teaching remains in Learn; educator professional development remains in Teach.

## Fixed — Teach-led visual system rollout

Teach remains the ecosystem quality reference without becoming a universal visual template.

Updated Learn surfaces include:

- student dashboard;
- teacher dashboard;
- login/signup/onboarding;
- teacher course management;
- learner-access management;
- teacher Insights;
- assessment builder;
- organization plan surface;
- Learn Scenario Lab prototype.

Shared improvements include one product identity per hierarchy, clearer heroes/actions, consistent card/button grammar, responsive navigation, honest empty/error states, and preservation of product-specific personality.

## Fixed — non-Tailwind brand rendering

`MasterMark` and `ProductMark` previously depended on Tailwind for essential SVG dimensions, which allowed marks to collapse in `apps/web`.

Brand glyph geometry is now self-contained and portable across consumers.

## Fixed — authoritative Learn course-write boundary

Legacy browser services could write course/module/lesson records directly.

Corrections:

- `CourseService.saveCourse()` fails closed;
- all `CourseBuilderService` mutations fail closed;
- canonical Learn authoring uses `/api/learning` + `CoursePlatformService` on Firebase Admin;
- Firestore client rules deny create/update/delete for `courses` and deny direct module/lesson access;
- emulator rule tests verify that browser teacher clients cannot create or mutate authoritative course records.

Core therefore owns the trusted course-authoring write path.

## Fixed — teacher analytics projection

Earlier teacher analytics contained hard-coded demo organization/data and later relied on broad browser aggregation.

Current architecture:

- `OrganizationAnalyticsService` runs on Firebase Admin;
- organization context is derived from trusted educator membership;
- learner identity comes from Core organization membership/user records;
- signals come from organization-scoped course progress;
- `/api/teacher/insights` returns a private no-store projection;
- the UI consumes only that authenticated API;
- legacy browser `AnalyticsService` fails closed.

Recommendations remain deterministic support prompts, not Lurexa Mind decisions or mastery claims.

Current implementation is suitable for early-stage scale. If query volume grows materially, replace on-demand aggregation with Core-maintained materialized projections rather than returning to browser aggregation.

## Fixed — Lurexa Admin trust and authorization

Earlier Admin code used fabricated operational metrics and then broad browser Firestore reads.

Current architecture:

- dedicated `/login` surface;
- no public Admin registration flow;
- ID token must contain `role: "super_admin"`;
- `/api/admin` verifies the claim server-side;
- `PlatformAdminService` uses Firebase Admin for platform metrics, organization directory, and organization status changes;
- browser `AdminService` fails closed;
- unavailable MRR/error-rate telemetry remains unavailable rather than estimated.

A local privileged maintenance command is provided through `@lurexa/backend`:

```bash
pnpm --filter @lurexa/backend admin:superadmin -- --uid <firebase-uid> --enable --confirm
```

The command requires `FIREBASE_SERVICE_ACCOUNT_JSON`, refuses unconfirmed changes, and refuses to overwrite another existing role unless `--replace-role` is explicitly supplied. Dedicated platform-admin accounts are preferred.

## Fixed — organization plan / billing boundary

Earlier billing used `org_demo`, invented seat usage/pricing, and a fake Stripe checkout URL. Later it still attempted browser reads of trusted subscription/member data.

Current architecture:

- `OrganizationPlanService` resolves educator organization membership on Firebase Admin;
- stored organization/subscription state determines the active plan;
- actual organization student membership determines seat usage;
- `/api/teacher/plan` returns the private authenticated projection;
- the Learn plan UI consumes that projection;
- legacy browser subscription/seat reads fail closed;
- usage-ledger writes are server-only;
- Firestore explicitly protects `subscriptions` and `usage_records`;
- paid checkout remains unavailable and performs no payment action.

No paid price or upgrade flow should appear until pricing authority, Stripe/server checkout, webhooks, subscription reconciliation, tax/refund policy, and audit contracts exist.

## Fixed — future Marketplace transactions

Marketplace remains a future concept.

Legacy behavior that could publish listings, fabricate a catalog, and record completed purchases without payment is disabled. The compatibility service cannot execute commerce transactions, and Marketplace/purchase collections are server-only in Firestore rules.

## Fixed — sensitive future service boundaries

The historical `EcosystemService` previously mixed Studio, Coach, classroom, and API mutations in a client Firestore abstraction.

It is now a deprecated compatibility facade whose mutations fail closed.

Institutional API credentials moved to `institutional-api-key.server.ts`:

- server/Admin SDK only;
- owner/admin organization authorization;
- cryptographically random key material;
- SHA-256 digest persisted instead of raw secret;
- raw key returned once;
- revocation supported.

Public API activation still requires scopes, rotation policy, usage enforcement, audit logs, and secure secret UX.

## Fixed — prototype honesty

### Learn Scenario Lab

The Learn teacher route no longer impersonates the standalone Lurexa Studio product and no longer writes hard-coded demo scenarios.

### Prototype content generation

The deterministic assessment helper is canonically `PrototypeContentService`, not an AI provider boundary. The old `AIGeneratorService` name remains only as a deprecated compatibility alias.

Production generation must eventually use an approved Mind/provider server boundary plus educator review.

## Fixed — Firestore sensitive-data posture

Explicit client-deny rules now protect authoritative or server-owned records including:

- modules;
- lessons;
- progress writes;
- learning evidence;
- learner insights;
- tutor/spoken/retrieval/intervention records;
- Studio/classroom future records;
- institutional API keys;
- Marketplace listings/purchases;
- subscriptions;
- usage records;
- AI conversation telemetry.

Course metadata remains readable only in organization-member context; authoring writes are server-only.

## Fixed — production-honesty verification

`scripts/verify-production-honesty.mjs` now protects against recurrence of the audit’s most important failure classes:

- hard-coded demo organizations;
- fabricated analytics/admin data;
- browser organization analytics;
- browser platform administration;
- browser subscription/usage access;
- fake checkout;
- inactive Marketplace commerce;
- client future-service persistence;
- weak/plaintext API-key handling;
- deterministic content presented as live AI;
- legacy direct course writes;
- missing Firestore server-ownership rules.

`pnpm verify:production-honesty` is included in local verification and as an explicit GitHub Actions step.

## Reviewed — lesson runtime, Teach and Docs

The Learn lesson runtime already uses authenticated trusted APIs for lesson state, attempts, evidence and completion, and explicitly avoids treating completion as mastery. A wholesale visual rewrite is lower value than preserving that evidence path.

Teach remains the reference-quality professional-development product. Docs remains a distinct structured knowledge-base experience. Neither should be homogenized into a universal dashboard template.

## Remote configuration still required — Vercel

Repository configuration already intends:

- clear legacy custom ignored-build commands;
- Vercel native affected-project deployments;
- one project per actual deployable surface.

Remaining remote actions:

1. apply/verify affected-project settings on every active Vercel project;
2. verify `/teacher/*` is served by `lurexa-learn-web` after release;
3. migrate any externally used teacher-specific alias/domain if one exists;
4. retire/delete orphaned `lurexa-teacher` after route verification;
5. compare production Git SHA with `main` after intentional release.

The connected Vercel surface available during this audit exposes project/deployment inspection but not the settings-update/project-delete actions required for those operations. Repository truth should not be confused with remote configuration truth.

## Remaining P0 — executable validation

Repeated PR #48 GitHub Actions attempts have failed before executing workflow steps. Until a runner actually executes the workflow, the branch cannot be called green.

Required executable release signal:

- frozen install;
- brand verification;
- product-registry verification;
- teacher-workspace verification;
- production-honesty verification;
- Vercel release contract;
- linguistic intelligence;
- learner model;
- Mind recommendations;
- Firestore emulator rules;
- Phase 0 lint/type/build;
- affected product builds.

## Remaining P0/P1 — generated lockfile drift

`pnpm-lock.yaml` still contains the importer for the deleted `apps/teacher-portal` workspace. Do not manually rewrite generated dependency resolution data.

Regenerate using pnpm 10.3.0:

```bash
pnpm install --lockfile-only
pnpm install --frozen-lockfile
```

Then verify `apps/teacher-portal` no longer appears as an importer.

This is the principal repository-generated-file blocker before merge.

## Remaining P1 — real telemetry and commerce

The repository intentionally does **not** fabricate:

- MRR;
- platform error rate;
- paid pricing;
- checkout success;
- Marketplace transactions.

Before activation, build authoritative server integrations and audit contracts for those capabilities.

## Remaining P2 — scale optimizations

At current early-stage scale, teacher analytics/Admin projections use trusted server-side aggregation. When data volume makes those reads costly, introduce Core-maintained materialized read models for:

- organization learner counts;
- active learners;
- course/lesson completion;
- assessment summaries;
- support/intervention queues;
- product usage;
- operational telemetry.

This is a scale optimization, not a reason to reintroduce browser-wide queries.

## Remaining P2 — shared shell extraction

After this branch is validated, narrow reusable family primitives can be extracted where repetition is proven:

- ProductHeader;
- ProductHero;
- ProductSubnav;
- MetricCard;
- ActionPanel.

Do not create a universal dashboard abstraction that erases product personality.

## Release recommendation

Keep PR #48 draft until:

1. the lockfile is regenerated through pnpm;
2. one real CI/local verification run executes successfully;
3. affected app builds complete;
4. Vercel release ownership/settings are verified for deployment.

After merge, release intentionally and verify the production Git SHA before judging the live UI.

# Lurexa Ecosystem UI & Deployment Audit — 2026-08-21

Status: **Active implementation audit**

## Design reference

Lurexa Teach is the current quality reference for shared ecosystem interaction grammar:

- sticky translucent product header;
- one clear product identity per surface;
- strong gradient hero hierarchy;
- 12px action-button radius with clear primary/secondary hierarchy;
- 26–34px card and section radii;
- restrained violet, blue, cyan, navy and soft-surface accents;
- spacious content rhythm;
- product-specific personality preserved inside a shared family language.

This is a reference system, not a requirement for every product to become visually identical.

## P0 — Consolidate the Learn teacher workspace

### Finding

The repository currently contains two teacher-facing Learn implementations:

1. canonical routes under `apps/learn-web/app/teacher/*`;
2. standalone `apps/teacher-portal`.

Vercel also contains a separate `lurexa-teacher` project even though the authoritative product boundary says the teacher operational workspace belongs to Lurexa Learn.

### Current correction

`deployment/products.json` now assigns both learner-web and teacher-workspace surfaces to:

- workspace: `learn-web`;
- root: `apps/learn-web`;
- Vercel project: `lurexa-learn-web`.

`apps/teacher-portal` is now optional in `bootstrap/repository.json` and is no longer a deployment-validation surface.

### Required retirement sequence

1. confirm all required teacher routes exist under `apps/learn-web/app/teacher/*`;
2. confirm login/role redirects target those routes;
3. migrate any unique code or data behavior from `apps/teacher-portal`;
4. add redirects for any externally used teacher-portal URLs if required;
5. remove `apps/teacher-portal` from the workspace only after the above is verified;
6. retire/delete the Vercel `lurexa-teacher` project after production traffic is confirmed on `lurexa-learn-web`.

Do not maintain two independent Learn teacher products.

## P0 — Fix Vercel affected-project routing

### Finding

The Vercel `lurexa` ecosystem project receives preview attempts for branch commits that only modify Learn or teacher code. Those previews are then canceled. This creates noise, unnecessary deployment work and confusing project history.

The repository GitHub workflow already implements affected-surface validation more accurately.

### Required correction

Each Vercel project should use an ignored-build rule that builds only when:

- its owned app changes;
- a shared package/tooling dependency that can affect it changes;
- root workspace/lock/config files that can affect it change.

The rule must safely handle missing/invalid previous Git SHAs on previews and must default to **build**, not error, when change detection cannot be proven.

## P0 — Keep production deployments fresh

### Finding

The production `lurexa` deployment can lag the current `main` branch. A user may therefore review a UI that does not match current repository truth.

### Required correction

- make production deployment state visible in release checks;
- compare production Git SHA with `main` before considering a design change released;
- avoid evaluating visual fixes solely from stale production URLs.

## P1 — Remove framework coupling from shared UI

### Finding

`MasterMark` and `ProductMark` relied on Tailwind utility classes for essential SVG dimensions. `apps/web` does not run Tailwind, which allowed product logos to collapse even though the React components were present.

### Current correction

Brand glyph dimensions are now explicit at runtime while retaining utility classes for Tailwind consumers.

### Follow-up

Audit shared UI primitives for other essential behavior that depends on a consuming app having Tailwind or a specific global stylesheet. Shared primitives should carry essential geometry, accessibility and interaction behavior themselves.

## P1 — Unify product shells without homogenizing products

### Finding

Teach currently has the strongest shell pattern. Learn student and teacher dashboards previously used unrelated layout conventions and repeated product marks.

### Current correction

The student dashboard and canonical Learn teacher dashboard now use:

- a single top product header;
- title/subtitle in the content hero rather than beside another logo;
- Teach-derived spacing, button and card hierarchy;
- Learn colors and learner/teacher purpose preserved.

### Follow-up

Extract a small family of reusable shell primitives only after the current Learn/Teach implementations prove the pattern:

- `ProductHeader`;
- `ProductHero`;
- responsive product navigation;
- metric cards;
- action panels.

Do not create one generic dashboard component that erases product personalities.

## P1 — Review all role and auth surfaces

The next visual pass should cover:

- Learn login;
- Learn signup;
- Learn onboarding;
- teacher course list/detail/authoring routes;
- student lesson player and completion states;
- Teach login/onboarding/profile;
- Admin shell and empty/loading/error states;
- Docs shell/search/brand pages.

The audit should check identity duplication, heading hierarchy, button consistency, mobile navigation, empty states and destructive actions.

## P2 — Replace presentation-only analytics

Some teacher/dashboard surfaces still use decorative text/glyph charts. Replace them with semantic accessible chart components only when real analytics data is connected. Do not fabricate precision or trends.

## P2 — Remove deprecated teacher portal code

Once migration verification is complete, delete the optional `apps/teacher-portal` app, remove its package/workspace references, update the lockfile if necessary, and delete its Vercel project. Until then, it is transitional code and must not be treated as a current product surface.

## Release gate for this redesign

The redesign is ready only when:

1. brand verification passes;
2. product-registry verification passes;
3. Learn lint/typecheck/build passes;
4. Product Deployment Validation passes for affected current surfaces;
5. browser review confirms logos render in the non-Tailwind ecosystem landing;
6. canonical teacher routes under `apps/learn-web` are used for teacher operations;
7. production deployment SHA is confirmed after merge.

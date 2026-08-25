# Lurexa Signature Experience — S9 Rollout

Status: Implementation
Date: 2026-08-25
Depends on: PR #61 / S0–S8 Signature Experience foundation

## Objective

Move the Signature Experience system from its Learn ↔ Coach proving ground into governed institutional consumption without weakening Core/Mind trust boundaries.

S9 is a rollout and hardening phase. It does not introduce a seventh signature primitive, another learner model, or a new product tier.

## Structural placement

The six signature primitives remain a shared experience/read-model layer used by products and institutional surfaces.

- Learn, Coach, Teach, Admin, Insight, and Studio remain product owners.
- Campus remains the institutional experience/shell and is not a sibling product owner.
- Core remains the authorization, trusted-record, persistence, provenance, and server-projection authority.
- Mind remains the interpretation/adaptation layer and does not become an authorization or persistence owner.
- Shared signature UI continues to inherit `@lurexa/ui` and the Lurexa token/accessibility grammar; product shells keep their distinct personalities.

## S9 workstreams

### 1. Roster-backed Teach instructional support

Teach now exposes a `Students` workspace sourced from trusted course participation rather than free-form learner IDs.

The v1 roster is derived from:

1. courses the signed-in educator is already authorized to teach;
2. trusted course-progress records;
3. an explicit student-membership check in the same organization.

The roster returns only the minimum identity and participation metadata required to select a learner for instructional support. Learner evidence is not embedded in roster responses.

The selected learner's Learner Pulse remains separately authorized through Core and is independently controlled by `NEXT_PUBLIC_TEACH_SIGNATURE_V1=on`.

#### Known limitation

The roster represents **participating learners**, not every allocated/enrolled seat. Learners who have never generated course progress will require a future Core-owned enrollment index. S9 intentionally does not create a second enrollment table merely to fill that gap.

### 2. First-class delegated Core authorization

The S8 Teach adapter performed tenant and role checks before delegating to a self-authorized projection. S9 removes that compatibility workaround.

Core's learner-context boundary now receives the real educator actor and owns the delegated-access decision.

Current delegated policy:

- approved product: Teach;
- approved purpose: `teacher_instructional_support`;
- organization ID: required;
- actor role: `owner`, `admin`, or `teacher` in the requested organization;
- supported learner: must be a `student` member of the same organization;
- explicit organization scope wins over a learner's more recent activity in another institution.

Other products/purposes cannot reuse this delegated path.

### 3. Insight as aggregate-first consumer

There is no dedicated `apps/insight-web` deployment surface yet. S9 therefore establishes Insight at the governed service/contract boundary rather than creating a premature shell.

`InsightOrganizationSignatureOverviewV1` returns organization-level learning signals only:

- number of governed courses;
- participating **current student-member** count;
- active current student members in the last 14 days;
- descriptive average course progress for current student members;
- Knowledge Object evidence coverage from current student members.

Insight checks current student membership before counting either progress or semantic evidence, so stale activity from former or non-student members does not inflate the organization overview.

Insight v1 deliberately returns no learner IDs, raw learning evidence, transcripts, or individual recommendations. Organization analytics is restricted to owner/admin membership.

A future Insight application should consume this supported contract rather than reading Firestore directly.

### 4. Knowledge Object corpus coverage

The governed Knowledge Object catalog now maps every pattern in the current 21-entry Dominican-English linguistic corpus.

Coverage includes:

- Spanish orthographic/phonological transfer;
- initial `/s/` clusters;
- English vowel spelling/sound variation;
- cognate pronunciation transfer;
- regular-past form and ending pronunciation;
- `/θ/` and `/ð/` perception/production;
- English clause order;
- `do/does` question formation;
- third-person singular `-s`;
- spontaneous advanced grammar use;
- conventional requests/pragmatic directness;
- spoken sentence automaticity;
- mental translation reduction;
- productive lexical retrieval and range;
- semantic range/collocation;
- spaced lexical retrieval;
- receptive-to-productive transfer.

These mappings are semantic references, not claims that a learner has a pattern. Learner state still requires authorized evidence and Core-approved interpretation.

### 5. Delegated-authorization integration tests

S9 adds an executable Firestore Emulator integration test.

The critical fixture gives one learner older progress in Organization A and newer progress in Organization B, then verifies that an authorized Organization A teacher receives only Organization A context when that tenant is explicitly requested.

The test also verifies:

- owner access;
- learner self-access within an organization they belong to;
- student-to-student delegation denial;
- cross-organization educator denial;
- denial when a delegated actor attempts to reuse a self-service Learn purpose.

### 6. Performance and visual-regression gates

S9 introduces two layers of protection.

#### Operational performance

Signature Operations reports average and p95 projection duration from privacy-minimized telemetry.

Initial operational warning budget:

- projection p95: **1,200 ms**.

Exceeding the budget produces a `watch` state. It is not treated as a learner-outcome or mastery metric.

#### Source/bundle-risk guardrails

Until runtime bundle and Web Vitals instrumentation is introduced, S9 also caps the source size of the new high-level client/service slices. These limits are engineering guardrails, not runtime-performance claims.

#### Structural visual regression

The current CI can enforce responsive anatomy, accessibility semantics, and visible focus behavior, but it does not yet run a browser screenshot comparison suite. S9 deliberately calls these **structural visual-regression gates**, not pixel-level visual regression.

A browser-backed screenshot runner remains follow-up work.

### 7. Rollout and telemetry operations

Admin gains a superadmin-only Signature Operations surface based on the identity-free telemetry introduced in S8.

It reports:

- Product Bridges created/resolved;
- bridge resolution ratio;
- projection successes/failures;
- average projection duration;
- p95 projection duration against the warning budget.

Telemetry continues to exclude actor IDs, learner IDs, organization IDs, evidence IDs, utterances, recommendation content, and destination/context references.

The operations API is private/no-store.

## Supported SDK boundaries

`@lurexa/sdk` now defines supported rollout consumers for:

- Teach instructional roster;
- Insight organization overview;
- Signature Operations rollup.

The SDK interfaces are not authorization grants. Implementations must call authenticated server capabilities.

## CI gates

S9 adds the following required checks to Phase 0:

- `verify:signature-rollout`
- `test:signature-delegation`

The rollout verifier protects:

- full current corpus → Knowledge Object mapping coverage;
- Core-owned delegated authorization;
- no Teach learner impersonation;
- roster-only learner selection and no free-form learner ID input;
- private/no-store roster and operations APIs;
- aggregate-first Insight contract privacy;
- current-student membership filtering for Insight progress and semantic coverage;
- identity-free telemetry;
- p95 operational latency reporting;
- source-size budgets;
- responsive/accessibility/focus anatomy for the new UIs.

## Exit criteria

S9 is merge-ready when:

1. Phase 0, including emulator delegation and rollout verification, is green on the PR merge tree;
2. Teach Web, Admin, Learn, Docs, and other affected deployment surfaces pass lint, typecheck, and production build;
3. no roster path permits free-form learner-ID lookup;
4. explicit organization scope is honored inside Core;
5. all 21 current corpus patterns resolve to governed Knowledge Objects;
6. Insight remains aggregate-first, current-member scoped, and identity-free by contract;
7. Signature Operations remains superadmin-only and telemetry remains identity-free;
8. roadmap/PR documentation distinguishes implemented runtime gates from future screenshot/Web-Vitals infrastructure.

## Post-S9 follow-up

- Core-owned enrollment index so Teach can represent never-started enrolled learners;
- dedicated Insight product shell when its deployment phase begins;
- browser-backed visual screenshot regression at desktop/mobile/high zoom;
- real-user Web Vitals and route/bundle budgets;
- maintained telemetry aggregates instead of bounded collection scans at scale;
- finer institutional permissions beyond the initial owner/admin/teacher policy;
- curriculum references attached to Knowledge Objects as A1/A2 production content is semantically indexed;
- learner feedback/override policy for adaptive recommendations.

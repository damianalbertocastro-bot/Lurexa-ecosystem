# Lurexa Signature Experience — S9 Rollout

Status: Implementation
Date: 2026-08-25
Depends on: PR #61 / S0–S8 Signature Experience foundation

## Objective

Move the Signature Experience system from its Learn ↔ Coach proving ground into governed institutional consumption without weakening product boundaries or Core/Mind trust boundaries.

S9 does not introduce a new product tier. It makes one boundary explicit and enforceable:

> **Lurexa Learn is where educators operate student learning. Lurexa Teach is where educators develop themselves professionally.**

## Structural placement

- Learn, Coach, Teach, Admin, Insight, and Studio remain product owners.
- Campus remains the institutional experience/shell.
- Core remains authorization, trusted-record, persistence, provenance, and server-projection authority.
- Mind remains the interpretation/adaptation layer.
- Signature UI remains shared grammar; product shells keep distinct personalities.

## 1. Roster-backed Lurexa Learn Teacher Workspace

The operational roster belongs to `apps/learn-web/app/teacher`, not `apps/teach-web`.

The Learn Teacher Workspace now combines:

- student invitations/access management;
- course rosters derived from courses the educator is authorized to teach;
- trusted course-participation progress;
- explicit current-student membership checks;
- purpose-scoped Learner Pulse for instructional decisions.

The roster contains only minimum display identity and participation metadata. Learner evidence remains behind Core projections.

The instructional Pulse rollout is independently controlled by:

`NEXT_PUBLIC_LEARN_TEACHER_SIGNATURE_V1=on`

### Known limitation

The v1 roster represents participating learners, not every enrolled seat. Never-started learners require a future Core-owned enrollment index. S9 does not create a second enrollment table.

## 2. Authoritative Lurexa Teach boundary

Lurexa Teach is the educator professional-development product. It does not own classroom/student operations.

S9 therefore removes from Teach:

- `/students` operational roster UI;
- student roster API;
- delegated student Signature API;
- Teach-owned roster backend capability;
- Teach-owned student Learner Pulse adapter;
- Students navigation/footer entry.

Teach retains professional learning, educator competency growth, assessment, reflection, credentials, community, and professional-growth experiences.

Future Learn → Teach handoffs may contribute minimized professional-development evidence about the educator's practice, but student weaknesses must not become attributes of the educator's own learner model.

## 3. First-class delegated Core authorization

Core receives the real educator actor and owns the delegated-access decision.

Current delegated policy:

- approved product: **Lurexa Learn**;
- approved purpose: `teacher_instructional_support`;
- organization ID: required;
- actor role: `owner`, `admin`, or `teacher` in the requested organization;
- supported learner: must be a `student` member of that organization;
- explicit organization scope wins over more recent learner activity elsewhere.

Lurexa Teach has **no delegated student-context purpose**.

The generic Signature service treats a `consumer: "learn"` request as learner self-service when actor and learner match, and as Learn teacher instructional support when they differ. Teach is not an authorized student Signature consumer.

## 4. Insight as aggregate-first consumer

There is no dedicated `apps/insight-web` deployment surface yet. S9 establishes Insight at the governed service/contract boundary.

`InsightOrganizationSignatureOverviewV1` returns only organization-level signals:

- governed course count;
- participating current-student count;
- active current students in the last 14 days;
- descriptive average course progress for current students;
- Knowledge Object evidence coverage from current students.

Insight returns no learner IDs, raw evidence, transcripts, or individual recommendations. Owner/admin membership is required.

## 5. Knowledge Object corpus coverage

The governed Knowledge Object catalog maps every pattern in the current 21-entry Dominican-English linguistic corpus across pronunciation, grammar, pragmatics, fluency, vocabulary, and receptive/productive transfer.

These mappings are semantic references, not claims that a learner has a pattern. Learner state still requires authorized evidence and Core-approved interpretation.

## 6. Delegated-authorization integration test

The Firestore Emulator integration test proves:

- Learn teacher delegation stays inside the explicitly requested organization;
- newer cross-organization activity does not override explicit tenant scope;
- owner access succeeds;
- student-to-student delegation fails;
- cross-organization educator access fails;
- delegated actors cannot reuse `learn_adaptive_practice`;
- **the same delegated instructional request using `requestingProduct: "teach"` fails.**

## 7. Performance and structural visual gates

Signature Operations reports average and p95 projection duration from privacy-minimized telemetry.

Initial operational watch budget:

- projection p95: **1,200 ms**.

S9 also enforces source-size budgets plus responsive/accessibility/focus anatomy. These are structural regression gates, not pixel-level screenshot regression or runtime Web Vitals.

## 8. Rollout and telemetry operations

Admin exposes a superadmin-only Signature Operations surface reporting:

- Product Bridges created/resolved;
- bridge resolution ratio;
- projection successes/failures;
- average projection duration;
- p95 projection duration.

Telemetry excludes actor IDs, learner IDs, organization IDs, evidence IDs, utterances, recommendation content, and destination/context references. The API is private/no-store.

## Supported SDK boundaries

`@lurexa/sdk` exposes:

- `getLearnTeacherInstructionalRoster`;
- Insight organization overview;
- Signature Operations rollup.

The SDK does not expose an operational Teach roster method.

## CI gates

S9 requires:

- `verify:signature-rollout`;
- `test:signature-delegation`;
- existing Signature Experience, Core/Mind, linguistic-intelligence, Firestore security, Phase 0, and deployment validation gates.

The rollout verifier explicitly fails if student-roster/student-Signature capabilities reappear inside Lurexa Teach.

## Exit criteria

S9 is merge-ready when:

1. Phase 0 is green on the PR merge tree;
2. affected deployment surfaces pass lint, typecheck, and production build;
3. Learn owns the operational teacher roster and student instructional support;
4. Teach contains no operational student-management surface or delegated student-context entitlement;
5. explicit organization scope is honored inside Core;
6. all 21 corpus patterns resolve to governed Knowledge Objects;
7. Insight remains aggregate-first, current-member scoped, and identity-free;
8. Signature Operations remains superadmin-only and identity-free;
9. documentation and CI agree on the Learn/Teach boundary.

## Post-S9 follow-up

- Core-owned enrollment index for never-started enrolled learners;
- professional evidence bridge from Learn teaching practice into Teach professional growth;
- dedicated Insight product shell when its deployment phase begins;
- browser-backed screenshot regression at desktop/mobile/high zoom;
- real-user Web Vitals and route/bundle budgets;
- maintained telemetry aggregates at scale;
- finer institutional permissions;
- curriculum references attached to Knowledge Objects;
- learner feedback/override policy for adaptive recommendations.

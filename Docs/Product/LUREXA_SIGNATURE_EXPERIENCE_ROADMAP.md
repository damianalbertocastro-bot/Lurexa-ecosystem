# Lurexa Signature Experience Roadmap

Status: Implementation hardening / pre-merge
Last reconciled: 2026-08-25
Active implementation: PR #61 — `design/signature-experience-system`

## Strategic objective

Turn Lurexa's architectural differentiator — one persistent cross-product Learner Model — into a recognizable, trustworthy interaction system rather than another generic LMS dashboard.

The signature system is not a new product and does not own learner truth. It is a shared experience/read-model layer that makes Core-owned evidence and Mind-approved interpretation understandable and actionable across Lurexa experiences.

## Architectural position

Current product family:

- Lurexa Learn
- Lurexa Coach
- Lurexa Teach
- Lurexa Admin
- Lurexa Insight
- Lurexa Studio

Shared ecosystem layers:

- Lurexa Core — identity, authorization, trusted records, persistence, provenance, contracts, and server-authorized projections.
- Lurexa Mind — interpretation, recommendations, adaptive guidance, learner-model intelligence, tutoring/coaching intelligence.

Structurally different experience:

- Campus — institutional experience/shell. Campus is not a sibling product owner and must not be added to the canonical product registry as if it were Learn/Coach/Teach/Admin/Insight/Studio.

Signature Experience primitives:

- Learner Pulse
- Adaptive Learning Path
- Memory Thread
- Mind Trace
- Product Bridge
- Knowledge Object

These primitives sit below the product-composition tier and above Core/Mind service boundaries. They are shared capabilities, not products, databases, or new sources of learner truth.

## Design-system inheritance

Signature primitives inherit Lurexa's shared design grammar:

- `@lurexa/tokens` foundations and semantic states;
- `@lurexa/ui` accessibility and component conventions;
- shared focus, motion, spacing, typography, state, and responsive rules.

Products do **not** become visually identical. Each product composes the shared primitives through its own personality:

- Learn — inviting and progressive;
- Coach — conversational and alive;
- Teach — professional and developmental;
- Admin — authoritative;
- Insight — analytical;
- Studio — creative;
- master Lurexa — institutional and foundational.

Shared semantic meaning must remain stable even when product composition, color emphasis, hierarchy, copy, and surrounding layout differ.

---

# Delivery status

## S0 — Architecture reconciliation

Status: **Complete for this vertical slice**.

Implemented:

- authoritative product tiering reconciled;
- Campus classified as an institutional shell rather than sibling product;
- signature layer classified as shared experience/read-model capability;
- Bible, product personality system, root roadmap, and agent context reconciled;
- shared product identities reused rather than duplicated.

Exit condition: met.

## S1 — Contract foundations

Status: **Complete for v1 vertical slice; broader runtime schema migration remains incremental**.

Implemented:

- versioned v1 contracts for Pulse, Path, Thread, Trace, Bridge, and Knowledge Object;
- canonical product identities reused;
- purpose-scoped projection requests;
- Knowledge Object references added to evidence source metadata;
- Core/Mind ownership boundaries preserved;
- CI verifier protects versioning, consumer boundaries, security invariants, and semantic separation.

Remaining after merge:

- migrate more boundaries from structural/static verification to reusable runtime validators where high-value;
- add migration fixtures when v2 contract work begins.

## S2 — Prototype and visual validation

Status: **Implemented; qualitative recognizability research remains post-merge**.

Implemented:

- deterministic `/developer/signature` gallery for all six primitives;
- responsive shared primitives;
- loading/partial/error states in Learn composition;
- reduced-motion and keyboard-focus hardening;
- production build regression fixed for interactive Adaptive Path.

Remaining after merge:

- logo-hidden recognizability study;
- formal visual-regression suite;
- high-zoom/localization-expansion QA.

## S3 — Learner Pulse

Status: **Vertical slice implemented in Learn**.

Implemented:

- Core-authorized projection;
- conservative unknown states;
- evidence-basis/limitations metadata;
- Learn dashboard composition behind staged feature flag;
- shared accessible UI primitive.

## S4 — Memory Thread

Status: **Vertical slice implemented**.

Implemented:

- cross-product normalized thread projection;
- tenant-safe organization scoping;
- exact Knowledge Object filtering;
- no raw evidence structures exposed to product UI;
- shared accessible UI primitive.

## S5 — Adaptive Learning Path

Status: **Governed v1 vertical slice implemented**.

Implemented:

- canonical curriculum remains unchanged;
- adaptive nodes are overlays rather than mutations;
- competency IDs are not treated as Knowledge Object IDs;
- Knowledge Object references are validated through the governed catalog;
- interactive shared UI is correctly isolated as a Client Component.

Policy retained:

- v1 does not autonomously skip required curriculum.

## S6 — Mind Trace + Product Bridge

Status: **Learn ↔ Coach closed loop implemented**.

Implemented:

- approved-summary-only Mind Trace;
- opaque, expiring, single-use Product Bridge;
- allowlisted product-purpose pairs;
- expiry/replay/destination checks;
- Learn → Coach targeted-practice handoff;
- Coach → Learn return-to-learning handoff;
- explicit learner-visible Coach completion action;
- completion evidence written through Core;
- learner intelligence refreshed before return;
- return bridge resolved before navigation;
- retry-safe completion ordering;
- active Coach session refresh recovery through server reauthorization.

## S7 — Knowledge Object semantic layer

Status: **Initial governed catalog implemented; semantic expansion continues**.

Implemented:

- versioned Knowledge Object contract;
- initial deterministic English catalog;
- initial Dominican-English pronunciation mappings;
- evidence can carry governed Knowledge Object references;
- Memory Thread and Adaptive Path use canonical references;
- competency and Knowledge Object namespaces are explicitly distinct.

Next semantic expansion:

- broaden A1/A2 curriculum mappings;
- map additional Dominican transfer/error taxonomy patterns;
- connect more Mind recommendations directly to governed Knowledge Objects;
- prepare Insight/Studio consumption without creating a new semantic source of truth.

## S8 — Cross-product hardening, measurement, rollout

Status: **In progress; current pre-merge focus**.

Implemented in this PR:

- learner rollout flag: `NEXT_PUBLIC_SIGNATURE_EXPERIENCE_V1=on`, default off;
- keyboard-focus and reduced-motion hardening;
- polite live-region handling for asynchronous signature states;
- privacy-minimized operational telemetry;
- bridge creation/resolution telemetry;
- projection success/failure latency telemetry;
- telemetry excludes actor, learner, tenant, evidence, utterance, recommendation text, and destination/context references;
- learner-model/signature API responses explicitly use private/no-store caching policy;
- Coach completion acts as a retention boundary: completed transcript storage is redacted and persisted turn evidence removes raw `learnerForm` while retaining structured linguistic signal;
- first governed Teach Signature consumer boundary added;
- Teach instructional-support access requires explicit organization scope, educator role, learner membership in the same organization, and matching organization projection;
- Teach API remains server-authenticated and is not exposed as an unsafe free-form learner-ID UI.

### S8 merge blockers

1. Final CI after Teach/privacy/no-store/telemetry commits.
2. Confirm PR remains mergeable against current `main`.
3. Reconcile PR description with actual S8 implementation.
4. Review changed-file set for accidental/generated artifacts or stale duplicate definitions.
5. Final merge recommendation.

### S8 post-merge rollout work

- roster-backed Teach instructional-support UI; do not expose manual learner-ID entry as a production workflow;
- Insight consumer built on shared contracts;
- formal authorization-matrix integration tests for delegated Teach access;
- visual-regression coverage;
- performance and low-bandwidth budgets;
- telemetry aggregation/operational dashboard;
- localization expansion tests;
- abandoned/incomplete Coach-session retention/TTL policy;
- broader Knowledge Object mapping;
- learner feedback/override policy for adaptive recommendations;
- qualitative signature-recognition research.

---

# Governing interaction loop

```text
Learn activity
  ↓
Core evidence
  ↓
Mind interpretation
  ↓
Learner Pulse / Adaptive Path / Mind Trace
  ↓
Product Bridge
  ↓
Coach targeted practice
  ↓
Core evidence + completion boundary
  ↓
Mind refresh
  ↓
Memory Thread / updated Pulse / updated Path
  ↓
validated return to Learn
```

Teach consumes only explicitly authorized projections; it does not bypass Core or gain raw evidence access.

---

# Repository ownership

| Concern | Owner |
| --- | --- |
| signature contracts | `@lurexa/types` |
| trusted projections / authorization | `@lurexa/backend` / Core |
| interpretation / recommendation / explanation | Mind server capabilities |
| shared visual primitives | `@lurexa/ui` |
| shared foundations / semantic tokens | `@lurexa/tokens` |
| Learn composition | `apps/learn-web` |
| Coach composition | current Coach surface inside `apps/learn-web`, until product topology changes explicitly |
| Teach instructional-support consumer | `apps/teach-web` + Core-authorized Teach adapter |
| future aggregate analytics | Insight |
| future semantic authoring/versioning | Studio |

---

# Non-negotiable engineering rules

1. Core remains the trusted record and authorization boundary.
2. Mind does not own authoritative persistence or authorization.
3. Signature primitives do not write Firestore directly from the browser.
4. Products do not create competing Pulse, Thread, Bridge, or Knowledge Object schemas.
5. Adaptive Path never mutates canonical curriculum in v1.
6. Product Bridge never carries raw learner context in URLs.
7. Mind Trace never exposes hidden chain-of-thought.
8. Unknown remains unknown when evidence is insufficient.
9. Tenant-scoped evidence is never implicitly mixed across organizations.
10. Teach delegated learner access requires explicit organization authorization.
11. Completed Coach sessions do not retain raw conversation transcripts under the v1 retention boundary.
12. Signature telemetry must remain operational and privacy-minimized, never a shadow learner-data store.
13. Product personality may change composition and presentation, never semantic meaning or accessibility guarantees.

---

# Merge gate

PR #61 can be recommended for merge only when all of the following are true:

- Phase 0 CI green on final head;
- Product Deployment Validation green on final head;
- Signature Experience verifier green;
- Learn Firestore security rules green;
- Learn, Teach, Admin, Docs, ecosystem web, and teacher workspace production builds green where affected;
- PR mergeable against current `main`;
- no unresolved review threads requiring code changes;
- PR description and this roadmap reflect the final implementation.

Until those conditions are satisfied on the final head, the branch remains pre-merge even if an earlier commit was green.

---

# Immediate next sequence

```text
final CI
→ inspect failures if any
→ reconcile PR body
→ changed-file / mergeability audit
→ merge recommendation
→ user review / merge decision
```

After merge, continue S8 with roster-backed Teach UI and Insight as the next cross-product consumer rather than widening visual rollout indiscriminately.

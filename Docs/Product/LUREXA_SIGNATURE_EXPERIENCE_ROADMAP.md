# Lurexa Signature Experience Roadmap

Status: Execution roadmap
Date: 2026-08-25
Scope: Learner Pulse, Adaptive Learning Path, Memory Thread, Mind Trace, Product Bridge, Knowledge Object

## Strategic objective

Turn Lurexa's architectural differentiator — one persistent learner model across a multi-product ecosystem — into a recognizable user experience.

The target is not visual novelty. The target is a coherent set of interaction primitives that competitors cannot reproduce credibly without equivalent cross-product learning architecture.

---

# 1. Program structure

The work is divided into eight phases.

- S0 — architecture reconciliation and source-of-truth cleanup
- S1 — contract foundations
- S2 — prototype system and visual validation
- S3 — Learner Pulse vertical slice
- S4 — Memory Thread vertical slice
- S5 — Adaptive Learning Path vertical slice
- S6 — Mind Trace + Product Bridge
- S7 — Knowledge Object semantic layer
- S8 — cross-product hardening, measurement, rollout

The first production proving ground is Learn + Coach. Teach/Insight/Campus follow after contracts are stable.

---

# S0 — Architecture reconciliation and source-of-truth cleanup

## Goal

Remove documentation contradictions and make the signature system's architectural tier explicit before implementation.

## Tasks

- [ ] Reconcile Campus classification across Bible, ROADMAP, product registry, product personality system, and Campus architecture docs.
- [ ] State explicitly that signature primitives are a shared experience layer, not products.
- [ ] Add signature-system reference to `Docs/00-Lurexa-Bible.md`.
- [ ] Add signature-system reference to `Docs/Lurexa Ecosystem Agent Context.md`.
- [ ] Add roadmap pointer to root `ROADMAP.md`.
- [ ] Add docs navigation links from `Docs/README.md`.
- [ ] Confirm no existing component/package already claims conflicting names.
- [ ] Confirm product IDs and Campus tier before Product Bridge types are frozen.

## Exit condition

Every authoritative document agrees on product tiers, Core/Mind ownership, and the signature shared-experience layer.

---

# S1 — Contract foundations

## Goal

Define stable read models and service boundaries before UI code.

## Workstream A — shared domain types

Proposed location:

```text
packages/types/src/signature/
├── learner-pulse.ts
├── adaptive-path.ts
├── memory-thread.ts
├── mind-trace.ts
├── product-bridge.ts
├── knowledge-object.ts
└── index.ts
```

Tasks:

- [ ] Define `LearnerPulseProjectionV1`.
- [ ] Define `AdaptivePathProjectionV1`.
- [ ] Define `MemoryThreadProjectionV1`.
- [ ] Define `MindTraceV1`.
- [ ] Define `ProductBridgeIntentV1`.
- [ ] Define `KnowledgeObjectV1`.
- [ ] Define shared `ExperienceRef`, `ProductId`, `KnowledgeObjectRef`, and provenance references.
- [ ] Add runtime validation for server boundaries.
- [ ] Add contract versioning rules.
- [ ] Add compatibility tests.

## Workstream B — Core projection services

Proposed server boundaries:

```text
packages/backend/
├── signature/
│   ├── learner-pulse.server.ts
│   ├── adaptive-path.server.ts
│   ├── memory-thread.server.ts
│   ├── product-bridge.server.ts
│   └── knowledge-object.server.ts
```

Tasks:

- [ ] Pulse projection reads authorized evidence/approved observations only.
- [ ] Thread projection normalizes events without exposing raw sensitive payloads.
- [ ] Path projection combines canonical curriculum eligibility with approved adaptation decisions.
- [ ] Bridge service validates actor, tenant, entitlement, purpose, expiry, and destination.
- [ ] Knowledge Object read service returns canonical/versioned objects.
- [ ] Add authorization tests for each projection.
- [ ] Add missing/stale/partial evidence tests.
- [ ] Add tenant-isolation tests.

## Workstream C — Mind services

Tasks:

- [ ] Define adaptation recommendation output.
- [ ] Define explanation-summary output for Mind Trace.
- [ ] Require evidence/observation basis on every adaptive recommendation.
- [ ] Require limitations/confidence metadata where applicable.
- [ ] Keep provider-specific output behind service adapters.
- [ ] Add deterministic fallback explanations for rule-based decisions.
- [ ] Add AI evaluation fixtures.

## Exit condition

All six primitives have versioned contracts and server-authorized projection/service boundaries without UI dependencies.

---

# S2 — Prototype system and visual validation

## Goal

Validate recognizability and comprehension before hardening shared components.

## Prototype A — Learn dashboard

Include:

- Learner Pulse;
- Adaptive Path;
- one Mind Trace explanation;
- current lesson/next action.

Questions to test:

- Can the learner explain what the Pulse means?
- Do they understand that unknown ≠ weak?
- Can they identify why the next recommendation exists?
- Is the UI distinctive after hiding the logo?

## Prototype B — Learn → Coach handoff

Include:

- recommendation from path;
- Product Bridge;
- Coach session target;
- Pulse change after session.

Questions:

- Does the learner perceive continuity?
- Is context-sharing understandable?
- Is the transition trustworthy rather than magical?

## Prototype C — Memory Thread

Use a real Lurexa scenario:

regular past pronunciation difficulty → Coach practice → Learn listening reinforcement → teacher feedback → later stable performance.

Questions:

- Can the learner explain what improved?
- Is the difference between evidence and interpretation clear?
- Is the timeline useful or overwhelming?

## Design deliverables

- [ ] desktop prototype;
- [ ] mobile prototype;
- [ ] reduced-motion prototype;
- [ ] screen-reader content model;
- [ ] component anatomy diagrams;
- [ ] product-variant study for Learn/Coach/Teach/Insight;
- [ ] signature iconography study for Mind Trace and Bridge;
- [ ] visual distinctiveness review.

## Exit condition

The three prototype scenarios pass comprehension, accessibility, and recognizability review before the shared component API is frozen.

---

# S3 — Learner Pulse vertical slice

## Goal

Ship the first recognizable signature primitive in Learn using real Core/Mind data.

## Backend

- [ ] Implement Pulse projection service.
- [ ] Start with seven English learning skill dimensions where evidence exists.
- [ ] Do not fabricate missing dimensions.
- [ ] Compute trend from approved observation/evidence windows using transparent policy.
- [ ] Return limitations.
- [ ] Add caching/projection invalidation strategy.

## SDK

- [ ] Add typed Pulse fetch method.
- [ ] Preserve purpose and actor context.
- [ ] Define expected error states.

## UI

Proposed shared components:

```text
LearnerPulse
LearnerPulseCompact
LearnerPulseLegend
LearnerPulseDimensionDetail
PulseChangeAnnotation
```

- [ ] keyboard and screen-reader support;
- [ ] compact/mobile layout;
- [ ] reduced-motion behavior;
- [ ] loading/empty/insufficient-data/error states;
- [ ] product personality API;
- [ ] no hard-coded Learn-only semantics in shared primitive.

## Learn integration

- [ ] learner dashboard Pulse;
- [ ] lesson completion Pulse change summary;
- [ ] entry point to dimension details;
- [ ] link to relevant next action.

## Tests

- [ ] component tests;
- [ ] projection tests;
- [ ] authorization tests;
- [ ] accessibility tests;
- [ ] snapshot/visual regression where useful;
- [ ] stale-data behavior.

## Exit condition

A learner completing a real Learn activity can see a trustworthy, accessible Pulse update derived from persisted evidence.

---

# S4 — Memory Thread vertical slice

## Goal

Make learning history understandable across Learn and Coach.

## Backend

- [ ] Normalize Learn and Coach evidence into thread entries.
- [ ] Introduce thread subject references keyed to knowledge concepts/skills.
- [ ] Enforce visibility scopes.
- [ ] Exclude raw audio and sensitive payloads.
- [ ] Generate optional summary only from authorized thread entries.

## UI

Shared components:

```text
MemoryThread
MemoryThreadEntry
MemoryThreadFilter
MemoryThreadSummary
ThreadProductMarker
```

## First use case

Regular past pronunciation thread:

1. initial instability observed;
2. Learn activity evidence;
3. Coach targeted practice;
4. later speaking attempt;
5. stability/improvement observation.

## Exit condition

A learner can open one concept/skill and see a coherent multi-product history without seeing raw internal evidence structures.

---

# S5 — Adaptive Learning Path vertical slice

## Goal

Make adaptation visible, inspectable, and pedagogically bounded.

## Canonical-path rule

The curriculum remains canonical. Personalized routes are overlays over eligible content, not mutations of published curriculum.

## First supported adaptation reasons

- `reinforce_recurring_error`
- `practice_prerequisite`
- `coach_speaking_transfer`
- `review_after_instability`
- `optional_enrichment`

Do not introduce autonomous skipping of required curriculum until pedagogy and mastery policy are validated.

## Backend

- [ ] path projection;
- [ ] deterministic rule engine baseline;
- [ ] Mind recommendation adapter;
- [ ] reason/provenance storage;
- [ ] expiry/re-evaluation policy;
- [ ] learner override policy for recommendations where appropriate.

## UI

Shared components:

```text
AdaptiveLearningPath
AdaptivePathNode
AdaptiveBranch
AdaptationReason
PathProductDestination
```

## Learn integration

- [ ] current course/unit path;
- [ ] prerequisite reinforcement;
- [ ] Coach recommendation branch;
- [ ] explanation for adaptive insertion.

## Exit condition

Learn can insert one governed personalized branch based on real evidence, explain it, and keep canonical curriculum unchanged.

---

# S6 — Mind Trace + Product Bridge

## Goal

Create the trust/explanation pattern and the cross-product continuity pattern.

## Mind Trace tasks

- [ ] unique shared icon/mark;
- [ ] compact + expanded components;
- [ ] observed/inferred/recommended language taxonomy;
- [ ] limitations state;
- [ ] user feedback state;
- [ ] policy/model version metadata for expert/admin debugging, hidden from normal learner view;
- [ ] no chain-of-thought exposure.

## Product Bridge tasks

- [ ] server-issued bridge intent;
- [ ] destination validation;
- [ ] expiration;
- [ ] entitlement check;
- [ ] tenant/role check;
- [ ] analytics instrumentation;
- [ ] source/destination product identity;
- [ ] contextual continuation copy;
- [ ] graceful failure and return path.

## First bridge

Learn → Coach:

“Practice regular past endings in Coach using your current lesson context.”

## Second bridge

Coach → Learn:

“Review the listening/pronunciation activity connected to this target.”

## Exit condition

A learner can move Learn → Coach → Learn with authorized continuity, understandable context transfer, and no raw learner context in URLs.

---

# S7 — Knowledge Object semantic layer

## Goal

Create stable concept identity connecting curriculum, evidence, recommendations, authoring, and analytics.

## Phase 7A — taxonomy foundation

- [ ] define ID convention;
- [ ] define versioning;
- [ ] define domain/skill/CEFR relationships;
- [ ] define prerequisite graph rules;
- [ ] define misconception/error relationships;
- [ ] map current A1 curriculum concepts to initial objects;
- [ ] map pronunciation taxonomy targets to objects where valid;
- [ ] validate with curriculum architecture.

## Phase 7B — repository implementation

Suggested location:

```text
packages/types/src/knowledge/
packages/backend/knowledge/
packages/sdk/src/knowledge.ts
```

If the domain grows substantially, evaluate a dedicated shared package later. Do not create one preemptively.

## Phase 7C — product consumption

- [ ] Learn references objects from activities/lessons;
- [ ] Coach references eligible speaking/pronunciation objects;
- [ ] Memory Thread groups by object;
- [ ] Pulse dimensions can aggregate object evidence;
- [ ] Adaptive Path nodes can target objects;
- [ ] Insight can aggregate object outcomes;
- [ ] Studio eventually authors/versions objects.

## Exit condition

At least one curriculum slice uses stable Knowledge Object IDs across Learn, Coach, Thread, and Path without duplicating concept definitions.

---

# S8 — Cross-product hardening and rollout

## Goal

Move from promising feature set to durable ecosystem design language.

## Product rollout order

1. Learn
2. Coach
3. Teach
4. Insight
5. Campus
6. Studio
7. Admin only where governance/operations require it

## Hardening work

- [ ] shared Storybook/examples;
- [ ] accessibility regression suite;
- [ ] visual regression coverage;
- [ ] contract compatibility tests;
- [ ] authorization matrix tests;
- [ ] performance budgets;
- [ ] low-bandwidth behavior;
- [ ] telemetry dashboards;
- [ ] design QA checklist;
- [ ] copy/terminology glossary;
- [ ] localization readiness;
- [ ] privacy review;
- [ ] learner control/feedback policies;
- [ ] feature flags for staged rollout.

## Recognition research

Run qualitative tests with logo hidden.

Success criterion:

Participants repeatedly identify the Pulse/Thread/Path/Bridge interaction family as belonging to the same system and distinguish it from generic LMS dashboards.

---

# 2. Dependency map

```text
Existing Core evidence contracts
        ↓
S0 architecture reconciliation
        ↓
S1 signature contracts
        ↓
Knowledge Object ID foundation ─────────────┐
        ↓                                   │
Learner Pulse                               │
        ↓                                   │
Memory Thread ← Learn + Coach evidence      │
        ↓                                   │
Adaptive Path ← Mind recommendation ────────┘
        ↓
Mind Trace
        ↓
Product Bridge
        ↓
Cross-product rollout
```

The Knowledge Object taxonomy starts early but should not block the first Pulse prototype.

---

# 3. Repository ownership map

| Concern | Proposed owner |
| --- | --- |
| signature contract types | `@lurexa/types` |
| trusted projections/authorization | `@lurexa/backend` / Core |
| interpretation/adaptation/explanation | Mind server services |
| supported product consumption APIs | `@lurexa/sdk` |
| shared visual primitives | `@lurexa/ui` |
| foundational + semantic personality tokens | `@lurexa/tokens` |
| Learn compositions | `apps/learn-web` |
| Coach compositions | Coach product surface/server routes |
| authoring/versioning of canonical knowledge objects | Studio, later phase |
| aggregate analytical views | Insight |

---

# 4. Engineering rules

1. No shared primitive may write Firestore directly from the browser.
2. No primitive imports an AI provider SDK.
3. No product creates its own competing Learner Pulse schema.
4. No product creates a private Memory Thread store.
5. No path adaptation mutates canonical curriculum content.
6. No Product Bridge carries raw learner context in URLs.
7. No Mind Trace exposes hidden reasoning.
8. No Knowledge Object label is used as its stable identifier.
9. No product-specific visual variant changes semantic meaning.
10. No signature token bypasses accessibility or semantic-state foundations.

---

# 5. Testing strategy

## Contract
- schema validation;
- version compatibility;
- missing fields;
- unknown enum states;
- migration fixtures.

## Core security
- wrong learner;
- wrong tenant;
- wrong role;
- wrong purpose;
- expired bridge;
- unauthorized product-purpose pair.

## Data integrity
- duplicate evidence;
- stale evidence;
- conflicting observations;
- insufficient data;
- deprecated Knowledge Object;
- missing source product.

## UI
- keyboard;
- screen reader;
- reduced motion;
- responsive;
- empty/loading/error;
- very long labels;
- localization expansion;
- high zoom.

## AI/Mind
- unsupported recommendation;
- explanation basis mismatch;
- hallucinated evidence reference;
- missing limitation;
- low-confidence decision;
- provider failure fallback.

## End-to-end

Minimum flagship E2E:

```text
learner completes Learn activity
→ evidence persists through Core
→ Mind interprets approved basis
→ Pulse updates
→ Adaptive Path inserts Coach recommendation
→ learner opens Mind Trace
→ Product Bridge validates transition
→ Coach consumes scoped context
→ Coach evidence persists
→ Memory Thread updates
→ returning Learn Pulse/path reflect approved new state
```

---

# 6. Metrics

## UX
- next-action comprehension;
- recommendation explanation comprehension;
- cross-product handoff completion;
- Pulse detail engagement;
- Thread usefulness rating.

## Learning
- practice completion after recommendation;
- repeated-error reduction;
- time to demonstrated stability;
- intervention effectiveness;
- adaptive vs non-adaptive outcome comparison.

## Trust
- explanation disagreement rate;
- user override rate;
- false-certainty reports;
- privacy/support incidents;
- authorization failures.

## Platform
- projection latency;
- bridge failure rate;
- contract error rate;
- cache hit/miss;
- Mind cost per adaptive decision;
- AI fallback rate.

---

# 7. Delivery gates

## Gate A — architecture

- authoritative tiering reconciled;
- contracts reviewed;
- Core/Mind boundary accepted.

## Gate B — design

- accessible prototypes;
- distinctiveness test passed;
- mobile/reduced-motion states complete.

## Gate C — vertical slice

- Learn real-data Pulse;
- Learn/Coach Memory Thread;
- one governed adaptive branch.

## Gate D — trust/continuity

- Mind Trace;
- secure Product Bridge;
- Learn → Coach → Learn E2E.

## Gate E — semantic scale

- Knowledge Object IDs used across at least two products;
- Insight/Teach consumers begin using shared contracts.

## Gate F — rollout

- telemetry healthy;
- accessibility green;
- security review green;
- feature-flag rollout complete;
- documentation updated.

---

# 8. Priority recommendation

Do not spend the next cycle polishing all seven products visually. The highest-leverage implementation is one complete signature loop in Learn + Coach.

Build this first:

```text
Learner Pulse
   ↓
Adaptive recommendation
   ↓
Mind Trace
   ↓
Product Bridge
   ↓
Coach practice
   ↓
Memory Thread
   ↓
Pulse/path update
```

If this loop works, Lurexa's architecture becomes visible to the user. If it does not, adding more product-specific visual polish will not create a truly distinctive system.

# Lurexa Signature Experience Architecture

Status: Proposed normative architecture
Date: 2026-08-25
Owner: Lurexa Learning Technologies
Applies to: Lurexa Core, Lurexa Mind, Learn, Coach, Teach, Admin, Insight, Studio, Campus, and shared UI/design packages

## 1. Purpose

Lurexa must become recognizable through system behavior, not only through logos, gradients, cards, or product colors. This document defines six signature interaction primitives that operationalize the governing principle:

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

These primitives are ecosystem capabilities. They are not a new sibling product, sub-product, or independent design system.

The six primitives are:

1. Learner Pulse
2. Adaptive Learning Path
3. Memory Thread
4. Mind Trace
5. Product Bridge
6. Knowledge Object

They share one architecture and are rendered differently by each product personality.

---

## 2. Architectural position

```text
Lurexa Learning Technologies
│
├── Lurexa Core
│   ├── trusted learner/evidence records
│   ├── authorization and tenancy
│   ├── persistence and provenance
│   └── approved projections
│
├── Lurexa Mind
│   ├── interpretation
│   ├── adaptation
│   ├── recommendation
│   ├── confidence/limitations
│   └── explanation generation
│
├── Shared experience layer
│   ├── Learner Pulse
│   ├── Adaptive Learning Path
│   ├── Memory Thread
│   ├── Mind Trace
│   ├── Product Bridge
│   └── Knowledge Object
│
└── Product surfaces
    ├── Learn
    ├── Coach
    ├── Teach
    ├── Admin
    ├── Insight
    ├── Studio
    └── Campus
```

The shared experience layer is structurally different from Learn/Coach/Teach/Admin/Insight/Studio/Campus. It is a reusable interaction-and-projection layer over Core/Mind capabilities.

It **inherits** `@lurexa/tokens`, `@lurexa/ui`, shared accessibility rules, shared motion rules, semantic states, trust patterns, and product personality contracts. It must not fork them.

---

## 3. Non-negotiable trust boundaries

1. Product UIs do not become authoritative learner-state stores.
2. Core owns trusted records, authorization, persistence, provenance, and approved projections.
3. Mind interprets authorized evidence and proposes adaptive state; Mind does not own authoritative persistence.
4. Signature components consume versioned read models; they do not infer from arbitrary client data.
5. Evidence and inference remain visually and structurally distinguishable.
6. Explanations must never imply certainty that the underlying evidence does not support.
7. Cross-product handoff does not bypass entitlement, tenant, or role checks.
8. A Knowledge Object is canonical learning-domain metadata plus governed relationships; it is not a second copy of curriculum content.
9. Learner Pulse is a projection, not the Learner Model itself.
10. Memory Thread is a narrative projection over authorized events, not a raw activity log.

---

# 4. Signature Primitive 1 — Learner Pulse

## 4.1 Product intent

The Learner Pulse is the recognizable learner-facing representation of current learning state. It answers:

- Where am I strong?
- Where am I developing?
- What changed recently?
- What needs attention?
- Why is Lurexa adapting around me?

It must feel alive without pretending to be a medical, psychological, or deterministic score.

## 4.2 Data model

Recommended projection contract:

```ts
export interface LearnerPulseProjectionV1 {
  contractVersion: "1";
  learnerId: string;
  generatedAt: string;
  scope: {
    organizationId?: string;
    courseId?: string;
    language?: string;
  };
  dimensions: LearnerPulseDimension[];
  momentum: "rising" | "stable" | "mixed" | "insufficient-data";
  highlights: PulseHighlight[];
  limitations: string[];
  evidenceWindow: {
    from: string;
    to: string;
    evidenceCount: number;
  };
}

export interface LearnerPulseDimension {
  key: string;
  label: string;
  state: "emerging" | "developing" | "stable" | "strong" | "unknown";
  confidence?: number;
  trend?: "up" | "flat" | "down" | "unknown";
  basisType: "observed" | "derived" | "mixed";
}
```

The initial English-learning dimension set may include vocabulary, grammar, listening, speaking, reading, writing, and phonetics. Confidence or motivation should not be inferred unless a separate approved measurement policy exists.

## 4.3 Rendering rules

- Prefer an evolving radial, constellation, layered-ring, or pulse topology over a generic radar chart.
- Never collapse the learner into one global score.
- `unknown` must be visually legitimate, not treated as failure.
- Trend and certainty must not rely on color alone.
- Reduced-motion mode must preserve comprehension.
- The Pulse should support compact, standard, and expanded variants.

## 4.4 Product expressions

- Learn: personal progress and next action.
- Coach: speaking/pronunciation state and session targets.
- Teach: only role-authorized instructional interpretation, not unrestricted learner profiling.
- Insight: cohort/aggregate projection with statistical context.
- Campus: orientation summary and authorized progress context.
- Admin: policy/availability controls only; no pedagogical reinterpretation.
- Studio: preview how authored objects may connect to dimensions, not learner-specific state by default.

---

# 5. Signature Primitive 2 — Adaptive Learning Path

## 5.1 Product intent

The Adaptive Learning Path makes personalization visible and inspectable. It answers:

- What is next?
- What changed?
- Why was something inserted, delayed, shortened, or reinforced?
- Which destinations are required, recommended, or optional?

## 5.2 Contract

```ts
export interface AdaptivePathProjectionV1 {
  contractVersion: "1";
  learnerId: string;
  generatedAt: string;
  pathVersion: string;
  nodes: AdaptivePathNode[];
  edges: AdaptivePathEdge[];
  currentNodeId?: string;
  adaptations: PathAdaptation[];
  limitations: string[];
}

export interface AdaptivePathNode {
  id: string;
  knowledgeObjectId?: string;
  experienceRef: ExperienceRef;
  state: "completed" | "current" | "recommended" | "required" | "optional" | "locked";
  reasonCode?: string;
}
```

## 5.3 Adaptation rules

Every machine-generated path change must carry:

- reason code;
- evidence/observation references;
- confidence or rule certainty where applicable;
- source policy/version;
- reversibility where pedagogically appropriate;
- learner-facing explanation capability.

Path adaptation must not silently mutate canonical curriculum structure. Canonical content remains owned by curriculum/Studio publication. Adaptation changes the learner's route through eligible experiences.

## 5.4 First MVP behaviors

1. Insert reinforcement after repeated error evidence.
2. Recommend Coach practice from Learn context.
3. Skip or shorten redundant practice only when policy allows.
4. Re-open prerequisites after demonstrated instability.
5. Display the reason for each adaptive branch.

---

# 6. Signature Primitive 3 — Memory Thread

## 6.1 Product intent

The Memory Thread converts fragmented evidence into an understandable learning story:

> struggle → practice → feedback → reinforcement → improvement

It is not a raw event stream.

## 6.2 Event taxonomy

Recommended normalized thread events:

- observed difficulty;
- learner attempt;
- assessment result;
- Coach practice;
- teacher feedback;
- derived observation;
- recommendation;
- intervention;
- demonstrated improvement;
- mastery/stability update;
- learner preference or goal change.

## 6.3 Contract

```ts
export interface MemoryThreadProjectionV1 {
  contractVersion: "1";
  learnerId: string;
  subject: ThreadSubjectRef;
  generatedAt: string;
  entries: MemoryThreadEntry[];
  summary?: string;
  limitations: string[];
}

export interface MemoryThreadEntry {
  id: string;
  occurredAt: string;
  product: ProductId;
  type: string;
  title: string;
  evidenceIds?: string[];
  observationIds?: string[];
  knowledgeObjectIds?: string[];
  visibility: "learner" | "educator" | "institutional";
}
```

## 6.4 Privacy and safety

- Do not expose raw audio, sensitive payloads, internal prompts, or hidden model reasoning.
- Support purpose-scoped projections.
- Allow redaction where policy requires.
- Do not use Memory Thread as a disciplinary or surveillance feed.
- Learner-facing entries should explain growth rather than expose internal system jargon.

---

# 7. Signature Primitive 4 — Mind Trace

## 7.1 Product intent

Mind Trace is the standardized explanation layer for adaptive or AI-assisted decisions. It answers “Why this?” without exposing chain-of-thought or internal model reasoning.

## 7.2 Contract

```ts
export interface MindTraceV1 {
  contractVersion: "1";
  id: string;
  decisionType: string;
  outcomeRef: string;
  explanation: string;
  basis: TraceBasis[];
  confidence?: number;
  limitations: string[];
  policyVersion: string;
  generatedAt: string;
}
```

The explanation must summarize approved evidence and policy basis. It must never expose private chain-of-thought, secrets, hidden prompts, or provider internals.

## 7.3 UI pattern

Use one recognizable Lurexa-specific trace affordance across products. Avoid generic AI sparkle iconography as the primary symbol. The component states should include:

- compact reason;
- expanded evidence summary;
- uncertainty/limitations;
- learner control where applicable;
- feedback action such as “not useful” or “this does not fit me.”

---

# 8. Signature Primitive 5 — Product Bridge

## 8.1 Product intent

A Product Bridge is a context-preserving transition between authorized Lurexa experiences. It turns product switching into a continuation of the same learning journey.

Examples:

- Learn → Coach for speaking reinforcement.
- Coach → Learn for targeted grammar/listening follow-up.
- Campus → Learn for an institutional learning experience.
- Teach → Learn teacher workspace for classroom operations.
- Insight → authorized operational/product destination.
- Studio → preview/publish destination.

## 8.2 Contract

```ts
export interface ProductBridgeIntentV1 {
  contractVersion: "1";
  bridgeId: string;
  actorId: string;
  sourceProduct: ProductId;
  destinationProduct: ProductId;
  purpose: string;
  destinationRef: ExperienceRef;
  contextRef?: string;
  expiresAt: string;
}
```

A bridge token/reference must be server-issued, purpose-scoped, short-lived where sensitive, and validated by the destination. Never place raw learner context into a browser URL.

## 8.3 UX requirements

- Explicit source and destination identity.
- Explain what context will continue.
- Never visually fake seamlessness when authentication or entitlement changes.
- Preserve back-navigation semantics.
- Record bridge analytics separately from learning evidence unless the transition itself is pedagogically meaningful.

---

# 9. Signature Primitive 6 — Knowledge Object

## 9.1 Product intent

A Knowledge Object is the shared conceptual anchor connecting curriculum, practice, evidence, adaptation, analytics, and authoring.

Examples:

- English regular past pronunciation
- present perfect for life experience
- /θ/ production
- academic paragraph cohesion

It must not be confused with a lesson page or a reusable visual card.

## 9.2 Canonical contract

```ts
export interface KnowledgeObjectV1 {
  contractVersion: "1";
  id: string;
  canonicalLabel: string;
  description: string;
  domain: string;
  levelRefs?: string[];
  skillRefs?: string[];
  prerequisiteIds?: string[];
  relatedIds?: string[];
  misconceptionIds?: string[];
  pronunciationTargets?: string[];
  status: "draft" | "active" | "deprecated";
  version: string;
}
```

Studio should eventually govern creation/versioning. Learn consumes objects in instruction. Coach consumes eligible speaking/pronunciation targets. Mind connects evidence to object state. Insight aggregates authorized object-level outcomes.

## 9.3 Identity rule

Knowledge Objects need stable IDs independent of labels so terminology can evolve without breaking evidence history.

---

# 10. Shared UI component architecture

Recommended future package structure:

```text
packages/ui/src/signature/
├── learner-pulse/
├── adaptive-path/
├── memory-thread/
├── mind-trace/
├── product-bridge/
├── knowledge-object/
└── index.ts
```

Shared components should be headless/composable where possible. Product-specific wrappers may live in product apps when they encode product-only workflows.

Recommended layers:

```text
contract/read model
   ↓
headless state adapter
   ↓
shared accessible primitive
   ↓
product personality variant
   ↓
page/workflow composition
```

Do not put authorization, persistence, AI provider calls, or curriculum mutation logic inside visual components.

---

# 11. Token and motion architecture

Add signature semantic tokens only after prototype validation. Candidate groups:

- `signature.pulse.*`
- `signature.path.*`
- `signature.thread.*`
- `signature.trace.*`
- `signature.bridge.*`
- `signature.knowledge.*`

These must resolve through foundational/product tokens rather than hard-coded product colors.

Motion categories:

- Pulse: state evolution.
- Path: route change and insertion.
- Thread: temporal connection.
- Trace: explanation reveal.
- Bridge: contextual transition.
- Knowledge Object: relationship/focus change.

All motion requires reduced-motion equivalence.

---

# 12. Analytics and evaluation

Each primitive needs product metrics and learning-safety metrics.

## Learner Pulse
- open rate;
- comprehension in usability testing;
- false-certainty reports;
- next-action conversion.

## Adaptive Path
- recommendation acceptance;
- completion after branch;
- override rate;
- learning-outcome improvement against non-adaptive baseline.

## Memory Thread
- revisit rate;
- learner understanding of improvement history;
- educator usefulness;
- privacy complaints/redaction events.

## Mind Trace
- explanation open rate;
- helpful/not-helpful feedback;
- correction/override rate;
- user understanding of uncertainty.

## Product Bridge
- successful handoff rate;
- abandonment during handoff;
- authorization failures;
- destination task completion.

## Knowledge Object
- reuse across lessons/products;
- evidence coverage;
- broken/deprecated references;
- authoring duplication reduction.

---

# 13. Accessibility requirements

- WCAG-conformant contrast and focus treatment.
- Keyboard-complete interaction.
- Screen-reader descriptions independent of visual topology.
- No meaning encoded only by color, motion, radial position, or line thickness.
- Reduced-motion behavior.
- Touch targets appropriate for mobile.
- Text alternatives for visualized learner state.
- Avoid cognitive overload: summary first, detail on demand.

---

# 14. Security and privacy requirements

- Server-authorized projections only.
- Tenant isolation on every learner-scoped query.
- Explicit purpose in context requests.
- Raw evidence minimized by default.
- No learner-state payloads in shareable URLs.
- Audit bridge issuance and sensitive projection access.
- Keep AI explanation content separate from hidden reasoning.
- Support retention/deletion policy inheritance from Core.

---

# 15. Sequencing decision

Do not implement all six at production depth simultaneously.

Wave A — identity-defining core:
1. Learner Pulse
2. Memory Thread
3. Adaptive Learning Path

Wave B — trust and ecosystem continuity:
4. Mind Trace
5. Product Bridge

Wave C — semantic unification:
6. Knowledge Object

Knowledge Object architecture begins early because Pulse/Path/Thread should reference stable concepts, but the full Studio authoring workflow comes later.

---

# 16. Definition of done for the signature system

The signature system is considered established only when:

1. three or more products render at least one shared primitive from the same contract;
2. Learn and Coach demonstrate a real cross-product adaptive loop;
3. Core/Mind ownership is enforced by tests;
4. no primitive requires a parallel component library;
5. accessibility tests cover all shared primitives;
6. users can identify at least one signature interaction as distinctly Lurexa in qualitative testing;
7. explanations clearly separate observation, inference, and recommendation;
8. visual variants preserve shared semantics across product personalities.

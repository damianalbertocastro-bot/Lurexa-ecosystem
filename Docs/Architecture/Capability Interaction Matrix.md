# Capability Interaction Matrix

Status: Authoritative conceptual architecture  
Owner: Lurexa Learning Technologies  
Last updated: 2026-08-17

## Purpose

This matrix defines which Lurexa layer or product is responsible for generating, interpreting, persisting, governing, or consuming important ecosystem capabilities.

It is a responsibility map, not an implementation-status claim.

## Core responsibility matrix

| Capability | Primary owner | Producers / contributors | Consumers | Rule |
|---|---|---|---|---|
| Identity | Lurexa Core | Products initiate flows | All authorized products/services | One canonical identity foundation |
| Authentication | Lurexa Core | — | Products, Core, Mind | Mind never authenticates users independently |
| Authorization / permissions | Lurexa Core | Admin/governance config may influence policy | Products and Mind | Access is enforced before context is exposed |
| Trusted learner records | Lurexa Core | Learn, Coach, Teach and future authorized sources | Authorized products and Mind | Core owns authoritative persistence |
| Learning evidence | Core-governed | Products generate evidence | Mind and authorized analytics/services | Evidence retains provenance |
| Learner interpretation | Lurexa Mind | Uses authorized evidence/context | Products via approved contracts | Interpretation is not raw evidence |
| Learner Model | Ecosystem construct; trusted persistence governed by Core, interpretation by Mind | Authorized products + Mind | Authorized products | No product-specific competing truth |
| Personalization | Lurexa Mind | Uses learner/context evidence | Learn, Coach, Teach, Studio where appropriate | Products consume approved intelligence |
| Recommendations | Lurexa Mind | Uses evidence and goals | Learn, Coach, Teach | Must be interpretable where consequential |
| AI tutoring/coaching intelligence | Lurexa Mind | Product context + learner evidence | Learn, Coach | Product UX stays separate from intelligence layer |
| Speaking/pronunciation evidence | Core-governed | Coach | Mind, authorized products | Raw/structured evidence remains distinguishable from inference |
| Pronunciation interpretation | Lurexa Mind | Coach evidence | Coach, Learn, Teach where authorized | Prioritize intelligibility, not accent erasure |
| L1-transfer intelligence | Lurexa Mind | Linguistic profiles + learner evidence | Coach and future experiences | Dominican Spanish is first profile, not permanent limit |
| Course/lesson learning experience | Lurexa Learn | Learn/Studio content | Learners | Learn generates evidence; does not own shared learner truth |
| Teacher workflows | Lurexa Teach | Teachers | Teachers/institutions | Role-appropriate learner context only |
| Institutional administration | Lurexa Admin | Administrators | Organizations/platform | Admin configures policy; Core enforces trusted access |
| Analytics/reporting experience | Lurexa Insight | Core data + Mind intelligence | Institutions/teachers/authorized users | Insight does not become the source database |
| Content authoring | Lurexa Studio | Authors/teachers/AI-assisted workflows | Learn and other products | Canonical content remains separate from learner-specific delivery adaptation |
| Offline/synchronization trust | Lurexa Core | Eligible products | Products | Reconciliation occurs before trusted state changes |

## Product-to-layer interactions

### Lurexa Learn

**Writes through Core:**
- enrollment/progress evidence;
- activity outcomes;
- assessment evidence;
- curriculum-position changes;
- other approved learning events.

**Consumes from Mind through approved contracts:**
- personalization;
- recommendations;
- adaptive follow-up;
- learner-aware tutoring support.

**Must not:**
- own a separate authoritative learner profile;
- write arbitrary inferred learner state directly;
- call AI providers directly for production learner intelligence.

### Lurexa Coach

**Receives authorized context:**
- CEFR state;
- curriculum context;
- recurring mistakes;
- pronunciation targets;
- goals;
- relevant activity history;
- strengths and weaknesses.

**Generates evidence:**
- speaking activity;
- pronunciation observations;
- fluency evidence;
- successful corrections;
- recurring targets;
- practice outcomes.

**Consumes Mind intelligence:**
- session adaptation;
- pronunciation interpretation;
- L1-transfer interpretation;
- corrective-practice selection;
- feedback prioritization.

**Must not:**
- ask learners to rebuild known context unnecessarily;
- optimize for accent erasure;
- hard-code Dominican Spanish as the only possible L1 profile;
- become a second independent AI architecture.

### Lurexa Teach

**May contribute:**
- teacher observations;
- interventions;
- assignment/context information;
- authorized human review.

**May consume:**
- progress summaries;
- learner strengths/weaknesses;
- intervention suggestions;
- role-appropriate learner intelligence.

Teach should receive the minimum useful learner detail for the educator workflow.

### Lurexa Admin

Admin configures and manages institutional structures, roles, policies, subscriptions and governance workflows. Core remains responsible for enforcing trusted identity, permissions and persistence rules.

### Lurexa Insight

Insight consumes governed data and interpretable intelligence for reporting. It should prefer aggregated/minimized data where detailed learner data is unnecessary.

### Lurexa Studio

Studio creates canonical learning content and experiences. Mind may assist authoring or delivery adaptation, but learner-specific adaptations must not silently mutate canonical source content.

## Cross-product continuity example

```text
Learn activity
  ↓
Core persists authorized evidence
  ↓
Mind interprets learner state
  ↓
Core exposes authorized learner context
  ↓
Coach adapts speaking practice
  ↓
Coach generates new speaking evidence
  ↓
Core persists evidence
  ↓
Mind updates interpretation
  ↓
Learn receives a better next-practice recommendation
```

This is the intended closed loop.

## Trust rules

1. Products generate evidence; they do not independently declare ecosystem-wide truth.
2. Mind produces intelligence; it does not independently authorize access.
3. Core owns trust and authoritative persistence.
4. The Learner Model is shared across products, with access scoped by purpose and permission.
5. Evidence and inference remain distinguishable.
6. Cross-product sharing occurs through contracts, not informal database coupling.
7. Conceptual ownership does not force immediate repository renaming.

## Superseded interaction patterns

Do not implement:

- Learn profile → manual copy → Coach profile;
- Coach-only learner memory disconnected from Learn;
- direct UI → Firestore writes for inferred learner state;
- direct UI → Gemini/other provider for persistent personalized intelligence;
- Mind-controlled identity/permissions;
- product-specific versions of CEFR/progress that can silently conflict.

## Related documents

- `Docs/Architecture/Capability Architecture.md`
- `Docs/Architecture/Learner Model Architecture.md`
- `Docs/Architecture/Dependency Graph.md`
- `ROADMAP.md`
# Lurexa Signature Interaction System

Status: Normative design proposal
Date: 2026-08-25
Principle: **Shared grammar + distinct personalities**

## Purpose

This document defines the visual and behavioral language for six Lurexa signature primitives. The goal is recognizability through interaction behavior rather than surface styling alone.

The system must feel unmistakably Lurexa while remaining accessible, calm, credible, and compatible with each product personality.

---

## 1. The six signature patterns

| Primitive | Core user question | Signature visual idea | Primary owner of truth |
| --- | --- | --- | --- |
| Learner Pulse | “How am I developing?” | evolving field/rings/constellation | Core projection of trusted + approved derived state |
| Adaptive Learning Path | “What should I do next and why?” | branching route with visible adaptation | Core-approved path projection informed by Mind |
| Memory Thread | “How did I get here?” | connected evidence story across products | Core event/projection layer |
| Mind Trace | “Why did Lurexa recommend this?” | distinct trace/node explanation affordance | Mind explanation over Core-authorized basis |
| Product Bridge | “Where should I continue?” | context-carrying transition between products | Core authorization + product routing |
| Knowledge Object | “What concept am I learning?” | persistent concept capsule/object | canonical curriculum/domain model |

---

# 2. Global design grammar

## 2.1 Shape

The signature system should use a restrained family of connected forms:

- nodes = evidence, concepts, products, milestones;
- threads = relationship and continuity;
- halos = confidence, scope, or active focus;
- paths = sequence and recommendation;
- fields = multidimensional learner state.

Avoid excessive glassmorphism, generic floating gradients, or decorative blobs that do not encode meaning.

## 2.2 Color

Signature primitives must use semantic roles first and product palette second.

Examples:

- observed evidence;
- inferred state;
- recommendation;
- uncertainty;
- active focus;
- completed/stable;
- attention needed.

Color must never be the only signal.

## 2.3 Motion

Motion should communicate state transition:

- a Pulse dimension evolves;
- a path branch is inserted;
- a thread reveals continuity;
- a Trace expands to show reasoning basis;
- a Bridge transfers context;
- a Knowledge Object reveals relationships.

No continuous decorative animation by default. Respect reduced motion.

## 2.4 Typography

Use shared Lurexa typography. Signature patterns rely on hierarchy, short explanatory labels, clear time/context markers, and evidence/inference language. Avoid tiny dashboard labels or dense analytical jargon in learner-facing surfaces.

---

# 3. Learner Pulse design specification

## 3.1 Required states

- empty / insufficient data;
- initial baseline;
- active learning;
- improving dimension;
- stable dimension;
- uncertain dimension;
- changed since last visit;
- compact summary;
- expanded exploration.

## 3.2 Anatomy

1. learner-state field;
2. dimension nodes/segments;
3. current focus marker;
4. momentum indicator;
5. recent-change annotation;
6. “Why?” / Mind Trace affordance where derived;
7. next-action link.

## 3.3 Anti-patterns

Do not:

- show a single “intelligence” or “ability” score;
- present confidence as learner worth;
- use a radar chart without a stronger Lurexa treatment;
- animate continuously to seem “AI-powered”;
- imply every dimension is directly measured.

## 3.4 Product variants

Learn: spacious, encouraging, next-action oriented.
Coach: more immediate, speaking-centric, session-responsive.
Teach: diagnostic only where authorized, with instructional language.
Insight: aggregate and comparative, with uncertainty and sample size.
Campus: compact orientation summary.
Admin: control/status only, not learner diagnosis.
Studio: concept mapping preview, not learner state.

---

# 4. Adaptive Learning Path design specification

## 4.1 Anatomy

1. current position;
2. completed path;
3. upcoming required nodes;
4. recommended branches;
5. optional enrichment;
6. adaptive insertion marker;
7. reason affordance;
8. destination product identity when a node crosses products.

## 4.2 Interaction model

Selecting a node opens a short explanation before navigation when the node exists because of adaptation. Learners should be able to distinguish canonical sequence from personalized branches.

## 4.3 Visual language

- continuous line = canonical progression;
- branched line = personalized route;
- softly emphasized node = recommendation;
- locked node = prerequisite state;
- bridge-marked node = cross-product destination.

These meanings require non-color cues.

---

# 5. Memory Thread design specification

## 5.1 Anatomy

1. subject header: concept/skill/goal;
2. chronological spine;
3. product-origin markers;
4. evidence events;
5. feedback events;
6. interpretation events;
7. milestone/improvement states;
8. summary of change over time.

## 5.2 Narrative rule

The thread should answer “what changed?” rather than merely “what happened?”

Preferred entry copy:

- “You practiced…”
- “Your teacher highlighted…”
- “Coach detected a recurring pattern…”
- “This became more stable across recent attempts…”

Avoid exposing raw model terminology.

## 5.3 Filtering

Allow filters by:

- concept;
- skill;
- product;
- time period;
- evidence vs feedback vs recommendation.

Default learner view should remain concise.

---

# 6. Mind Trace design specification

## 6.1 Brand role

Mind Trace should become the recognizable Lurexa trust affordance for machine-supported decisions.

Do not use a generic sparkle as the primary icon. Design a unique mark based on a node plus connected trace/arc or similar Lurexa geometry.

## 6.2 States

- compact reason;
- expanded basis;
- uncertain/limited;
- user disagrees;
- stale recommendation;
- human-reviewed where applicable.

## 6.3 Copy framework

A strong explanation follows:

**Signal → interpretation → action**

Example:

“Across your last three speaking activities, regular past endings were inconsistent. Lurexa recommends a short Coach practice before the next storytelling task.”

Where relevant, add limitation:

“This is based on recent speaking evidence and may not represent all contexts.”

---

# 7. Product Bridge design specification

## 7.1 Anatomy

1. source product mark;
2. destination product mark;
3. reason for transition;
4. context continuation summary;
5. primary continue action;
6. secondary stay/back action.

## 7.2 Signature transition

The visual transition should show one context node moving along a connecting path from source to destination. In reduced-motion mode, use a static connected-state transition.

## 7.3 Trust copy

Where meaningful:

“Coach will use your current lesson target and recent speaking focus.”

Never imply that all data is shared everywhere.

---

# 8. Knowledge Object design specification

## 8.1 Purpose

A Knowledge Object should feel like a persistent concept with relationships, not a content card.

## 8.2 Anatomy

1. canonical label;
2. domain/skill;
3. level relation;
4. concept state where learner-specific use is authorized;
5. prerequisites;
6. related concepts;
7. misconceptions/errors;
8. available experiences: Learn/Coach/etc.;
9. provenance/version in authoring or expert contexts.

## 8.3 Variants

- learner capsule;
- educator diagnostic object;
- Studio authoring object;
- Insight analytical object;
- compact inline reference.

---

# 9. Cross-product personality matrix

| Primitive | Learn | Coach | Teach | Admin | Insight | Studio | Campus |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Pulse | motivational | immediate/speaking | developmental | restricted/control | analytical | preview only | orientation |
| Path | learning journey | session/practice | growth pathway | configuration | funnel/outcome | authoring flow | institutional journey |
| Thread | personal growth | practice history | evidence/reflection | audit boundary | trend narrative | version history relation | cross-program context |
| Trace | supportive explanation | conversational explanation | professional rationale | policy rationale | analytical explanation | authoring rationale | contextual explanation |
| Bridge | Learn↔Coach | Coach↔Learn | Teach↔Learn workspace | Admin destinations | Insight→action | Studio→preview/publish | Campus→products |
| Knowledge Object | learn/practice | speak/practice | teach/reflect | taxonomy governance | analyze | author/version | discover/orient |

This matrix describes expression, not ownership. Products do not create separate semantic definitions for the primitives.

---

# 10. Responsive behavior

Mobile:
- Pulse defaults to compact visualization + expandable list.
- Path uses vertical progression instead of wide horizontal maps.
- Thread is vertical by default.
- Trace opens as sheet/dialog.
- Bridge uses a concise transition card.
- Knowledge Object collapses relationships progressively.

Desktop:
- richer spatial relationships permitted;
- split-pane detail views permitted;
- avoid excessive dashboard density for learner-facing products.

---

# 11. Accessibility design acceptance criteria

Every primitive must pass:

- keyboard navigation;
- visible focus;
- screen-reader meaningful order;
- text representation of graph/spatial meaning;
- no color-only distinctions;
- 200% zoom usability;
- reduced-motion mode;
- touch target minimums;
- high-contrast semantic state review;
- cognitive-load review for learner-facing states.

---

# 12. Prototype validation

Before production token/component hardening, test three flagship scenarios:

## Scenario A — Learn dashboard
Learner Pulse + Adaptive Path + Mind Trace.

Success test: learner understands current state, next action, and why it is recommended within 10–15 seconds.

## Scenario B — Learn → Coach
Adaptive Path + Product Bridge + Coach Pulse update.

Success test: learner understands why Coach is suggested and perceives continuity rather than an unrelated app switch.

## Scenario C — concept history
Knowledge Object + Memory Thread.

Success test: learner can explain how a recurring difficulty improved over time.

---

# 13. Visual distinctiveness test

A design is not accepted merely because it is polished.

Reviewers should ask:

1. Could this screenshot plausibly be a generic SaaS dashboard after removing the logo?
2. Is at least one Lurexa signature primitive visible or behaviorally present on key learner surfaces?
3. Does the primitive encode real learning-system behavior rather than decoration?
4. Does it still belong to the current product personality?
5. Does it preserve evidence/inference distinction?
6. Is it understandable without animation?

If #1 is yes and #2 is no, the design is still too generic.

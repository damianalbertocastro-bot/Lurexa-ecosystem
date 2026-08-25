# Lurexa Product Personality System

- Status: **Normative design direction**
- Applies to: Lurexa master brand, product experiences, Lurexa Campus, Docs, approved future concepts, and shared signature interactions
- Principle: **Shared grammar + distinct personalities**
- Last reconciled: **2026-08-25**

## Classification rule

Lurexa experiences must feel like members of one ecosystem without becoming visually interchangeable.

The authoritative classification is:

```text
Master identity
└── Lurexa Learning Technologies

Shared ecosystem layers
├── Lurexa Core
└── Lurexa Mind

Product family
├── Lurexa Learn
├── Lurexa Coach
├── Lurexa Teach
├── Lurexa Admin
├── Lurexa Insight
└── Lurexa Studio

Institutional experience
└── Lurexa Campus

Shared signature experience layer
├── Learner Pulse
├── Adaptive Learning Path
├── Memory Thread
├── Mind Trace
├── Product Bridge
└── Knowledge Object
```

**Campus is not a sibling product owner.** It may have its own experience ID, visual personality, routing shell and co-branding behavior without being added to product-owner domain unions. Runtime types must distinguish an `ExperienceId` from a product-owner ID when the distinction matters.

## Shared grammar

Every Lurexa experience preserves:

1. accessible typography, contrast, focus, touch targets and responsive behavior;
2. shared foundational tokens and composable components before local forks;
3. a clear master-brand/product relationship;
4. calm hierarchy, purposeful whitespace and readable density;
5. consistent semantic treatment for success, warning, error, trust, evidence and AI-generated guidance;
6. reduced-motion support and motion that communicates state rather than decoration;
7. cross-product navigation that preserves the user's mental model of one ecosystem;
8. distinct product marks rather than repeated use of the master mark as a substitute;
9. explicit distinction between observed evidence, inference, recommendation and uncertainty;
10. the six Signature Experience primitives as shared interaction grammar when their underlying capability is relevant.

Similarity communicates family. Difference communicates purpose.

## Personality map

| Experience | Classification | Personality | Primary experience signal |
| --- | --- | --- | --- |
| Master Lurexa | Parent identity | Institutional and foundational | Trust, ecosystem orientation, company narrative |
| Lurexa Learn | Product | Inviting and progressive | Momentum, confidence, next useful learning action |
| Lurexa Coach | Product | Conversational and alive | Speaking turns, immediacy, safe experimentation |
| Lurexa Teach | Product | Professional and developmental | Growth, reflection, evidence, credentials, community |
| Lurexa Admin | Product | Authoritative and controlled | Operations, permissions, auditability, institutional health |
| Lurexa Insight | Product | Analytical and interpretive | Trends, evidence, uncertainty, decision support |
| Lurexa Studio | Product | Creative and constructive | Authoring, composition, preview, reusable learning objects |
| Lurexa Campus | Institutional experience | Connected, welcoming and institutionally confident | Institution identity, orientation, role/entitlement context |
| Lurexa Docs | Ecosystem surface | Structured and knowledge-oriented | Reading, search, provenance, hierarchy |
| Lurexa Community | Future concept | Social, welcoming and participatory | Conversation, discovery, contribution, belonging |

## Master Lurexa

Master Lurexa represents the institution and ecosystem rather than a daily task surface.

Design behavior:

- spacious, architectural layouts;
- restrained motion;
- confident navy foundation with controlled violet/blue/cyan accents;
- company/product-system storytelling;
- master mark reserved for company/ecosystem identity;
- lower interface density than operational products.

Avoid making the master site look like a student dashboard, analytics console or authoring tool.

## Lurexa Learn

Personality: **inviting, progressive, understandable, confidence-building.**

Design behavior:

- soft surfaces and approachable geometry;
- visible progress and next-step hierarchy;
- brighter sky/indigo/teal emphasis;
- gentle motion that rewards momentum without distraction;
- more breathing room than operational dashboards;
- plain-language learning actions and supportive empty states;
- Learner Pulse should feel personal and encouraging rather than clinical;
- Adaptive Learning Path should make canonical vs adaptive learning visually understandable;
- Mind Trace should explain recommendations without sounding technical or deterministic.

Avoid enterprise-dashboard density, overly technical language and punitive gamification.

## Lurexa Coach

Personality: **conversational, alive, immediate, safe to experiment in.**

Design behavior:

- responsive listening/speaking/processing/feedback states;
- more expressive shape and motion than other products while preserving calmness;
- strong conversational focal point;
- clear separation of learner turn, Coach response, pronunciation feedback and private context;
- cyan/teal energy layered onto the violet/blue family;
- confidence-building feedback rather than red-state dominance;
- Product Bridge arrival should feel like continuation, not a new login or reset;
- Memory Thread may surface speaking development as a concise history rather than a transcript archive.

Avoid gamified noise, anthropomorphic deception, accent-erasure framing or animation that competes with speech practice.

## Lurexa Teach

Personality: **credible, developmental, professionally aspirational.**

Design behavior:

- mature violet/navy/blue palette with deliberate cyan accents;
- balanced professional-learning density;
- evidence, reflection, credentials, progress and community with clear hierarchy;
- editorial treatment for development content;
- durable career-oriented profile/evidence surfaces;
- signature patterns should be reframed around educator growth when authorized, not reuse learner language blindly.

Teach is not the Learn teacher dashboard. Classroom operations and learner management remain inside Lurexa Learn.

## Lurexa Admin

Personality: **stable, authoritative, controlled.**

Design behavior:

- compact but readable density;
- strong grids, tables and operational grouping;
- restrained blue/navy palette;
- precise status and destructive-action hierarchy;
- minimal decorative motion;
- visible permission, organization, environment, audit and system-health context.

Do not force learner-facing signature patterns into Admin merely for visual consistency. Admin should use them only where they improve governance, policy or operational understanding.

## Lurexa Insight

Personality: **analytical, interpretive, evidence-conscious.**

Design behavior:

- chart-first hierarchy with explanatory context nearby;
- compact analytical density;
- quieter surfaces so data and interpretation remain primary;
- confidence and state distinctions that do not rely on color alone;
- clear distinction between observation, inference, recommendation and uncertainty;
- Knowledge Objects may become stable analytical dimensions;
- Pulse-like views should communicate uncertainty and aggregation rather than impersonate an individual learner's self-view.

Avoid false precision and decorative dashboard noise.

## Lurexa Studio

Personality: **creative, constructive, professional.**

Design behavior:

- modular canvas/panel composition;
- controlled magenta/cyan expression alongside Lurexa violet;
- visually distinct edit/preview states;
- functional motion for manipulation, validation and publishing;
- explicit structure/content/preview/version state;
- strong affordances for compose, duplicate, arrange and iterate;
- Knowledge Object authoring and mapping should eventually feel native to Studio rather than like metadata forms bolted onto lessons.

Avoid making Studio look like Admin with editing controls added.

## Lurexa Campus

Classification: **institutional experience/shell, not product owner.**

Personality: **connected, welcoming, institutionally confident, intelligent.**

Campus should feel like an institution has entered its own place inside Lurexa while specialist products retain their identities.

Design behavior:

- institution identity and Lurexa identity visible together;
- stronger orientation and wayfinding than specialist products;
- spacious home surfaces with structured institutional sections;
- meaningful product entry points rather than a generic app launcher;
- visible organization, role and entitlement context;
- controlled co-branding with institution logo/accent customization;
- calm motion reinforcing institution-to-product transitions;
- enough warmth to feel more inviting than Admin;
- enough structure to feel more institutionally grounded than Learn;
- Product Bridge may preserve institution context, but Campus never becomes the learner-data owner.

Campus navigation may expose Learning, Professional Growth, Analytics, Coaching, Creation, People, Products & Access and Settings according to role and entitlements.

Avoid:

- making Campus visually indistinguishable from Admin;
- a dense enterprise dashboard as the default home;
- reducing Campus to product tiles without institution context;
- hiding institution or role context;
- allowing co-branding to override accessibility or semantic states;
- presenting Campus as owner of Learn, Teach, Admin, Insight, Coach or Studio.

Customer-facing language uses **Lurexa Campus**. Internal implementations may use Institution Workspace terminology where precise.

## Lurexa Docs

Personality: **structured, intelligent, knowledge-oriented.**

Design behavior:

- editorial reading hierarchy;
- minimal motion;
- strong search, provenance, breadcrumbs, headings and cross-reference behavior;
- dedicated Docs mark;
- source-path/authority context visible where useful.

Avoid generic developer-doc styling when a stronger Lurexa knowledge experience is practical.

## Lurexa Community — future concept

Community remains a future concept until an explicit product-architecture decision activates it.

Personality: **social, welcoming, participatory, trustworthy.**

Design behavior should prioritize conversation, contribution, discovery, visible group identity, moderation/provenance cues and useful participation without infinite-feed dark patterns or popularity-as-mastery signals.

Community must not be added to current product-owner unions or navigation merely because a concept mark/personality exists.

## Signature Experience grammar

The six signature primitives are shared interaction patterns that products express through their own personalities. They must not be reimplemented independently per product.

| Primitive | Meaning | Non-negotiable trust rule |
| --- | --- | --- |
| Learner Pulse | Current evidence-aware learner-state projection | Unknown remains unknown; Pulse is not the Learner Model |
| Adaptive Learning Path | Visible personalization overlay | Canonical requirements remain distinguishable |
| Memory Thread | Developmental learning narrative | Not a raw activity log; no implicit cross-tenant mixing |
| Mind Trace | Why Lurexa recommends an action | Approved summary only; no hidden reasoning exposure |
| Product Bridge | Context-preserving cross-product continuation | Purpose-scoped, expiring and server validated |
| Knowledge Object | Canonical semantic learning target | Versioned object; not learner state by itself |

Product expression examples:

- **Learn:** encouraging Pulse, visible route adaptation, supportive Mind Trace.
- **Coach:** immediate practice targets, conversational handoff, speaking-development thread.
- **Teach:** professional growth/evidence framing when educator contracts support it.
- **Insight:** analytical aggregation and uncertainty framing.
- **Studio:** Knowledge Object creation/mapping and adaptation-aware preview.
- **Admin:** governance-only usage where useful.
- **Campus:** orientation/handoff framing without owning the primitive's underlying state.

See `Docs/Design/LUREXA_SIGNATURE_INTERACTION_SYSTEM.md`.

## What may vary

Products and major experiences may vary palette emphasis, radius/shape expression, spacing density, panel composition, motion character, illustration/icon style, information density, empty-state tone and product-specific interaction metaphors.

These differences are desirable when they reinforce purpose.

## What must not drift

Experiences must not independently redefine:

- accessibility baseline;
- semantic error/success meaning;
- identity/authentication trust patterns;
- Core/Mind ownership language;
- product-family naming/classification;
- Campus vs product ownership boundary;
- master/product mark relationship;
- foundational spacing/typographic quality;
- destructive-action safety;
- cross-product navigation conventions;
- the semantic meaning/trust constraints of signature primitives.

## Implementation contract

Semantic product personality tokens live in `@lurexa/tokens` under `productPersonalities`.

An experience-level token type may include Campus because Campus has an independent visual shell. This **must not** be interpreted as making Campus a product owner. Use a product-owner type when ownership/authorization/contracts require a product, and an experience ID when styling/navigation requires a broader surface identifier.

Personality tokens are guardrails, not a hard-coded theme engine. Products should use shared tokens/components without importing another product's personality merely for implementation speed.

When reviewing a major surface, ask:

1. Does this unmistakably belong to Lurexa?
2. Can the user tell which product or Campus context they are in?
3. Does personality reinforce the job this surface performs?
4. Are shared components reused without forcing sameness?
5. Has distinctiveness been achieved without weakening accessibility or trust?
6. If a signature primitive appears, does it preserve its semantic/trust contract?

If #2, #3 or #6 fails, the surface is too generic, too homogenized or architecturally misleading.

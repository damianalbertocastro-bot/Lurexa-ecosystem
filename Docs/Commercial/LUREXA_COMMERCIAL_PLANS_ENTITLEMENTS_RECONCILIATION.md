# Lurexa Commercial Plans & Entitlements Reconciliation Specification

Status: Phase 1 — Commercial Model Freeze
Date: 2026-09-18
Scope: Individual, Educator/Teach, Institution/Campus, Business
Authority: Reconciles the current Lurexa commercial direction with repository contracts and product definitions.

## 1. Purpose

This document freezes the commercial model that later entitlement, billing, AI, speech, product-navigation, and UI implementation must follow.

The critical rule is:

> Plan ≠ Product Entitlement ≠ Capability Entitlement ≠ Usage Quota ≠ Educator Benefit ≠ Professional Qualification ≠ Teaching Authorization.

A subscription or organization contract may create entitlements, but it must not be used as a shortcut for qualification, authorization, or trust decisions.

## 2. Canonical ecosystem commercial structure

Lurexa has four distinct commercial/access contexts:

1. Individual — a person purchasing Lurexa for personal learning and development.
2. Educator / Teach — a person using Lurexa Teach for professional learning and teacher formation.
3. Institution / Campus — an organization providing entitled Lurexa experiences to its members.
4. Business / Workforce — an organization using Lurexa for workforce learning and professional development.

These contexts may share identity, Core, Mind, design infrastructure, and underlying capabilities, but their benefits, controls, quotas, reporting, and commercial semantics must remain distinct.

Lurexa Campus is an institutional experience shell, not a seventh product and not a consumer subscription tier.

## 3. Individual plans — frozen direction

### Basic

Price: $0.

Basic is the free individual entry tier.

Current repository-defined baseline includes:
- placement diagnostic;
- 3 level-matched trial modules;
- bounded AI tutoring;
- bounded standard voice access;
- standard processing/rate limits.

Basic does not include premium ElevenLabs access.

### Plus

Price: $9.99/month; annual pricing currently represented as $99/year in the shared subscription contract.

Plus is a single-product subscription. The subscriber chooses one product entitlement:

- Learn Plus; or
- Coach Plus; or
- Teach Plus.

The choice is a product entitlement, not merely a display preference.

The previously documented $9.99 single-product model is authoritative for this reconciliation.

Plus benefits are therefore product-specific:
- Learn Plus: full Learn access under the Plus entitlement, with the Plus usage/capability envelope.
- Coach Plus: full Coach access under the Plus entitlement, with premium Coach capabilities defined by the Coach plan contract.
- Teach Plus: full Teach access under the Plus entitlement, with Teach professional-learning capabilities defined by the Teach plan contract.

Plus must not silently become an all-product subscription.

ElevenLabs is product-selected:
- Learn Plus → ElevenLabs capability for Learn.
- Coach Plus → ElevenLabs capability for Coach.
- Teach Plus → no assumption of ElevenLabs unless a future Teach commercial contract explicitly grants it.

### Ultra

Price: $19.99/month; annual pricing currently represented as $199/year in the shared subscription contract.

Ultra is the integrated individual ecosystem tier.

The current product direction is:
- full Learn + Coach access;
- integrated cross-product Learner Model experience;
- premium AI capabilities;
- premium ElevenLabs speech capabilities for the entitled premium experiences;
- broader future-product benefits when explicitly released under the Ultra contract.

Ultra is not a substitute for professional qualification or institutional teaching authorization.

The repository's older wording that describes Ultra as unrestricted access to every product, including Teach and Studio, is treated as a reconciliation item rather than an automatic entitlement. Teach's professional-learning eligibility and any future Studio entitlement must be modeled explicitly.

### Individual AI/speech provider policy

Gemini:
- normal instructional tutoring;
- explanations;
- lesson assistance;
- learner feedback;
- summaries and related instructional intelligence.

OpenRouter:
- curriculum-constrained conversational roleplay in Learn;
- conversational simulation;
- selected reasoning/diversity tasks where model choice is valuable.

ElevenLabs:
- premium speech generation/voice only;
- entitlement-controlled;
- never a generic fallback for Gemini/OpenRouter.

Standard voice remains available to Basic/standard users through the non-ElevenLabs speech path.

## 4. Teach commercial model — frozen direction

Teach is a professional learning and teacher-formation product for:
- practicing educators;
- teachers-to-be / aspiring educators.

Teach stages T1–T5 are professional-development progression stages. They are not subscription tiers.

Teach subscription access and professional progression must therefore be represented separately.

### Teach Basic

Teach Basic is the free/entry Teach experience for users who have access to Teach without a paid Teach Plus entitlement.

Its exact learning limits should be expressed through Teach capability/usage configuration rather than copied from learner Basic quotas.

The entry experience may include:
- professional onboarding/diagnostic;
- limited professional-learning content;
- pathway orientation;
- limited AI-supported practice;
- professional profile foundation.

No statement that Basic equals a specific T1 stage is permitted.

### Teach Plus

Teach Plus is the paid single-product Plus choice at $9.99/month.

It provides the full Teach professional-learning experience covered by the Teach Plus contract, including as applicable:
- Teacher Formation and Practicing Educator Growth pathways;
- structured professional learning;
- AI-guided tutoring/rehearsal/feedback;
- human-support experiences when offered by the program;
- professional evidence workflows;
- community;
- growth planning;
- professional credentials subject to their separate trust rules;
- full Teach product capabilities within the plan's usage limits.

Teach Plus does not automatically make a person a qualified educator and does not grant institutional teaching authorization.

### Teach + Coach educator benefit

Verified educators can receive a governed `coach_full` educator benefit independently of consumer Coach Plus.

This is an educator benefit, not a consumer subscription tier.

When active, the educator can use Coach's professional mode for their own professional English/pronunciation practice and return to Teach through the professional-growth bridge.

The professional Coach flow must remain separate from learner Coach evidence.

### Teach + Learn relationship

Teach does not replace Learn Teacher Workspace.

- Learn Teacher Workspace = operate/support student learning.
- Teach = develop as an educator.
- Coach educator mode = practice the educator's own professional spoken English.

A single identity can access all three when Core-authorized.

## 5. Institution / Campus commercial model

Institutional plans are organizational contracts, not consumer-plan variants.

The repository already defines these institutional tiers:

1. `free_community`
2. `standard_institutional`
3. `campus_pro`
4. `enterprise`

These names remain the canonical technical tier identifiers for the current institutional model.

### free_community

Purpose:
- entry institutional/community deployment;
- basic organizational presence;
- bounded access to entitled experiences.

Expected institutional benefits:
- Campus/institution context;
- member and basic roster management;
- limited product access;
- basic governance and audit capabilities;
- bounded usage/seat allocation.

It must not be implemented as “consumer Basic multiplied by seats.”

### standard_institutional

Purpose:
- managed institutional learning deployment.

Expected benefits:
- larger managed seat allocation;
- Learn + Admin foundation;
- organization-scoped member/role management;
- groups/cohorts;
- product entitlement management;
- institutional operational reporting;
- stronger governance than community access.

### campus_pro

Purpose:
- mature institutional deployment with broader connected Lurexa capabilities.

Expected benefits:
- broader product bundles selected by the institution;
- expanded seats/usage;
- richer Campus experience;
- Insight and/or Teach/Coach access when explicitly entitled;
- stronger institutional analytics and operational controls;
- more advanced branding/configuration.

### enterprise

Purpose:
- contracted large-scale organizational deployment.

Expected benefits:
- custom multi-seat licensing;
- negotiated product/capability bundles;
- organization-level quota pools;
- dedicated limits/SLA arrangements where contracted;
- advanced security/integration controls;
- custom data/export/governance requirements;
- enterprise-scale institutional intelligence.

The repository contains historical Enterprise pricing and generic plan quotas. Those values must not be treated as final institutional pricing truth until the commercial contract and billing implementation are formally approved.

### Institutional packaging rule

Campus may present packages such as Learn + Admin, Learn + Admin + Insight, Learn + Teach + Admin + Insight, Learn + Coach + Admin, or broader suites.

The repository explicitly treats these as exploratory packaging language, not approved SKU names.

Therefore:
- the architecture must support arbitrary product/capability bundles;
- a tier must not hard-code one product bundle;
- institutional benefits are determined by entitlements attached to the organization contract.

## 6. Business / workforce commercial model

Business is a separate commercial context from Campus education/institution packaging.

The current repository does not establish an approved Business SKU ladder or final Business prices. Therefore Phase 1 freezes the architecture and benefit model without inventing unsupported SKU names or prices.

A Business organization should purchase workforce capabilities such as:
- organization-managed learner/workforce access;
- role and team/group management;
- assigned learning;
- workforce English/professional communication development;
- Coach professional speaking practice where contracted;
- Teach/professional development where relevant to the organization's educators/trainers;
- organization-level reporting and Insight where entitled;
- admin/governance controls;
- organization quotas and usage pools;
- SSO/integration options where contracted;
- audit and data-governance controls;
- optional custom programs/curricula through governed Studio capabilities where entitled.

Business plans must be outcome/capability based rather than copies of consumer Basic/Plus/Ultra.

The future Business commercial ladder should be defined as a separate product/market decision with:
- target organization size;
- seat model;
- product bundle;
- usage model;
- analytics level;
- security/integration level;
- support/SLA level;
- customization;
- contractual governance.

Until that decision is approved, code must not introduce fabricated Business SKUs.

## 7. Capability model

The implementation target is capability-oriented.

Representative capability IDs:

### Individual/product capabilities
- `learn.full`
- `learn.basic`
- `coach.full`
- `coach.basic`
- `teach.full`
- `teach.basic`
- `roleplay`
- `standard.voice`
- `premium.elevenlabs`
- `learner_model.cross_product`
- `offline.learning`
- `streaming.audio`

### Institutional/business capabilities
- `institution.workspace`
- `institution.members`
- `institution.groups`
- `institution.entitlements`
- `institution.analytics`
- `institution.audit`
- `institution.branding`
- `institution.sso`
- `institution.export`
- `institution.quota_pool`
- `studio.authoring`
- `studio.publishing`

### Professional/educator capabilities
- `educator.coach_full`
- `teach.formation`
- `teach.professional_growth`
- `teach.evidence`
- `teach.credentials`
- `teach.human_support`
- `teach.community`

These are capability examples for the next implementation phase, not a claim that all IDs already exist in code.

## 8. Trust and authorization boundaries

Core remains authoritative for:
- identity;
- entitlement state;
- authorization;
- trusted learner/educator records;
- organization membership;
- teaching authorization;
- provenance;
- persistence.

Mind:
- interprets authorized evidence;
- recommends;
- adapts;
- does not grant permissions;
- does not grant professional qualification;
- does not own canonical persistence.

Qualification:
- professional qualification is separate from subscription.

Teaching authorization:
- institutional permission to teach specific courses/context is separate from qualification and entitlement.

Frontend:
- may present entitlement state;
- must never be the final authority for premium capability access.

Backend/Core:
- must enforce capability access server-side.

## 9. Usage quota policy

Quotas must eventually be scoped by product/capability rather than one global counter.

Examples:
- AI turns by product/task;
- Coach voice minutes;
- ElevenLabs characters/minutes;
- roleplay turns;
- offline storage/modules;
- organization seats;
- organization AI/voice pools.

A plan may grant a quota, but a capability determines what the quota measures.

## 10. Contradictions and cleanup decisions recorded in Phase 1

The following repository inconsistencies are now explicitly tracked:

1. The master directive calls Ultra “full ecosystem” and lists Teach/Studio access, while the current individual-plan direction defines Ultra around full Learn + Coach and premium/future-product benefits. Do not infer Teach or Studio access until entitlement contracts explicitly state it.
2. `SubscriptionTier` currently mixes individual tiers with `ENTERPRISE`; institutional billing already has a separate `InstitutionalPlanTier`. These domains should be separated in the entitlement implementation.
3. `PlanQuotas` currently contains institutional-style fields such as cohort analytics alongside consumer quotas. This should be decomposed into product/capability entitlements and scoped quotas.
4. `SUBSCRIPTION_PRICING_PLANS` contains Enterprise consumer-style pricing that conflicts with the institutional billing direction. It must not become production billing truth.
5. The Learn billing UI currently combines individual and institutional language. It must be separated into consumer and institutional/business surfaces before real checkout.
6. The current Teach billing page is explicitly a non-transactional preview and does not define final paid-plan benefits. This specification is the reconciliation baseline for the next implementation work.
7. Business SKU names/prices are not established by authoritative repository material. They remain open commercial decisions.

## 11. Phase 1 exit criteria

Phase 1 is complete when:

- this specification exists on the reconciliation branch;
- individual Basic/Plus/Ultra semantics are frozen;
- Plus product selection is explicit;
- Teach Basic/Teach Plus are distinguished from T1–T5 stages;
- verified-educator Coach benefit is separated from subscription;
- institutional tiers remain distinct from consumer plans;
- Campus remains an institutional shell;
- business is established as a separate commercial context without invented SKUs;
- capability-oriented entitlement design is documented;
- trust boundaries are explicit;
- known contradictions are recorded instead of silently normalized.

## 12. Next phase

Phase 2 is **Entitlement Primitives**.

It should introduce the canonical contracts for:
- product entitlements;
- capability entitlements;
- subscription source;
- organization grants;
- educator benefits;
- qualification/authorization references;
- quota scopes;
- entitlement provenance and lifecycle.

No payment processor integration should be treated as complete until these server-owned contracts exist.

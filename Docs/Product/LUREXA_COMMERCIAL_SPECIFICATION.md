# Lurexa Commercial Specification

**Status:** Canonical — approved 2026-09-18  
**Scope:** Individual subscriptions, Business commercial model, product entitlements, and pre-Phase-5 commercial rules.

This document records the commercial decisions explicitly approved by the product owner. Older commercial drafts are historical unless they agree with this specification.

## 1. Individual model

Individual plans remain:

- **Basic** — free entry/trial experience.
- **Plus** — product-specific subscription. A learner subscribes to an eligible individual product such as Learn Plus or Coach Plus.
- **Ultra** — premium individual ecosystem experience.

### Plus

Plus is product-scoped.

- Learn Plus grants the Plus capabilities of Learn.
- Coach Plus grants the Plus capabilities of Coach.
- Premium ElevenLabs is included for the product to which the Plus subscription applies.
- Plus does not automatically grant premium ElevenLabs across other products.
- Plus does not automatically grant cross-product Learner Model synchronization.

The entitlement model must represent premium voice as a capability scoped to a product, not as an ecosystem-wide property of every Plus subscription.

### Ultra

Current approved boundary:

> **Ultra = full Learn + full Coach + deeper cross-product adaptation + premium AI/speech.**

Ultra is intentionally extensible. Teach, Studio, Insight, or future products must not be assumed to be included merely because they exist. Adding future products to Ultra is a separate commercial decision and must be expressible through capabilities without redesigning the entitlement architecture.

Ultra therefore must not depend on a hard-coded "all current products" assumption.

## 2. Business model

Business is an organizational commercial model, not a fourth individual subscription tier.

### Target market

Initial target:

- small organizations;
- medium organizations.

Large/enterprise organizations are not the initial target definition and may be addressed later through a separate commercial decision.

### Commercial unit

Business uses a hybrid contract:

- organization-level commercial agreement;
- defined learner/seat allowance;
- negotiated usage terms.

The contract is not restricted to a simple per-seat-only or per-active-learner-only calculation.

### Product access

A Business customer purchases **one Business subscription containing the Lurexa product ecosystem**, subject to the organization's contracted capabilities and authorization.

Do not create artificial packages such as Business Basic, Business Pro, or Business Enterprise unless a later market decision explicitly establishes them.

Business must remain capability/configuration based so the organization can use the products appropriate to its program.

### Usage

Business usage is hybrid:

- pooled organizational allowance;
- optional individual limits where operationally useful;
- negotiated usage terms may supplement the standard allowance.

AI and voice consumption must therefore support organization-level accounting rather than assuming every learner has an isolated quota.

### Standard Business administration capabilities

The standard Business commercial value includes:

- groups/cohorts;
- assignments;
- analytics;
- reporting;
- role management;
- audit;
- SSO;
- data export;
- teacher/admin management.

These capabilities are organizational capabilities and must not be represented as accidental side effects of an individual learner subscription.

### Support

Business support is tiered and negotiated by contract.

Possible support levels include standard, priority, dedicated support, SLA, and implementation/onboarding. The actual level belongs to the contract rather than a fixed public Business tier.

### Customization

Business customers may purchase, where contracted:

- custom curricula;
- Studio authoring;
- branded learning experiences;
- integrations.

Customization is contract capability, not an automatic property of every organization.

### Pricing

Business pricing is **contract/quote based**.

There is no approved public fixed Business price.

Do not expose a fabricated per-seat starting price, monthly Business SKU, or Enterprise price as canonical commercial truth.

## 3. Entitlement architecture

Commercial plans must not be used directly as authorization logic.

Use capability-oriented entitlements, with commercial plans/contracts resolving into capabilities.

Conceptually:

`commercial agreement -> entitlement set -> authorization -> product capability`

Examples of capability concepts include:

- `product.learn`
- `product.coach`
- `product.teach`
- `product.admin`
- `product.insight`
- `product.studio`
- `premium_voice.learn`
- `premium_voice.coach`
- `cross_product_learner_model`
- `business.groups`
- `business.assignments`
- `business.analytics`
- `business.reporting`
- `business.roles`
- `business.audit`
- `business.sso`
- `business.export`
- `business.teacher_admin_management`
- `business.custom_curriculum`
- `business.studio_authoring`
- `business.branding`
- `business.integrations`

These names are capability concepts, not a requirement that every identifier already exist in code.

## 4. Legacy documentation that is superseded

The following older assumptions are superseded by this specification:

- Enterprise as the canonical fourth individual tier;
- fixed Enterprise monthly/annual pricing;
- fixed Business/Enterprise seat pricing;
- Ultra automatically including Teach or Studio;
- Plus universally receiving premium ElevenLabs;
- Business Basic/Pro/Enterprise SKU assumptions;
- product-by-product Business purchasing as the only commercial model.

Existing legacy code may remain temporarily where removal would create unnecessary regression risk, but it must not be treated as the approved commercial contract.

## 5. Pre-Phase-5 exit criteria

Before entitlement enforcement begins:

1. customer-facing Plus benefits must state the product-scoped ElevenLabs rule;
2. Ultra must state Learn + Coach as its current boundary without promising future products;
3. Business must be represented as an organizational contract model;
4. entitlement contracts must support product-scoped and organization-scoped capabilities;
5. legacy Enterprise assumptions must be clearly marked or migrated;
6. no customer-facing page may present superseded pricing as canonical;
7. Phase 5 may then enforce these capabilities technically.

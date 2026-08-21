# Lurexa Community — Future Architecture

Status: **Architecture reserved; implementation deferred**

Related product vision: [`Docs/Product/LUREXA_COMMUNITY_FUTURE_PRODUCT_VISION.md`](../Product/LUREXA_COMMUNITY_FUTURE_PRODUCT_VISION.md)

## Purpose

This document reserves the technical responsibility model for a future **Lurexa Community** product without authorizing implementation.

Community is intended to become a cross-ecosystem social learning network for learners and educators. Its architecture must preserve Lurexa's existing trust model: Community owns social experience state, Lurexa Core owns trusted identity/authorization/persistence boundaries, and Lurexa Mind may interpret authorized context for discovery without becoming the social system of record.

## Non-goal

This document does not authorize:

- `apps/community`;
- Community deployment infrastructure;
- production Firestore collections;
- current-product navigation;
- pricing/subscriptions;
- a Community runtime API;
- Community-generated trusted learning evidence by default.

Those require a later activation decision.

## Future responsibility model

```text
Learner / Educator
       │
       ▼
Lurexa Community experience
       │
       ├── posts, threads, reactions, groups, follows
       ├── social discovery presentation
       └── moderation/reporting workflows
       │
       ▼
Lurexa Core boundaries
       │
       ├── identity / authentication
       ├── authorization / role / tenant / age boundaries
       ├── privacy / consent / retention
       ├── trusted profile claims
       └── approved persistence / audit contracts
       │
       ├──────── authorized context/evidence only ────────┐
       ▼                                                   ▼
Community trusted persistence                       Lurexa Mind
                                                    │
                                                    ├── discovery/recommendations
                                                    ├── semantic search
                                                    ├── classification
                                                    ├── summarization
                                                    └── moderation assistance
```

## Community-owned domain

If activated, Community may own product-specific social state such as:

- community/group definitions and membership;
- social posts and threaded replies;
- follows/subscriptions;
- reactions and saves;
- resource-sharing references;
- Community-specific reputation/contribution presentation;
- feed/discovery presentation state;
- moderation workflow state;
- Community-specific notification preferences;
- social UX, navigation and interaction patterns.

Community does not own canonical identity, trusted learner records, professional credentials, CEFR state, authorization, or cross-product learner truth.

## Core-owned trust boundaries

Lurexa Core must govern or provide:

- canonical user identity;
- authentication;
- role, age, organization and tenant-aware authorization;
- privacy and consent rules;
- trusted educator/profile claims;
- data-retention and deletion enforcement;
- audit/provenance for consequential moderation or trust actions where required;
- stable contracts for persisted Community entities;
- abuse/reporting security boundaries;
- any approved future transition from social activity into trusted learning/professional evidence.

A Community implementation must not create a parallel auth/profile system to move faster.

## Mind-owned intelligence boundaries

Lurexa Mind may eventually provide governed intelligence for:

- topic/community recommendations;
- personalized feed/discovery ranking;
- semantic search and retrieval;
- post/resource classification;
- duplicate/similar-question detection;
- discussion summarization;
- translation/language support where appropriate;
- moderation assistance;
- useful cross-product recommendations based on authorized context.

Mind must not own:

- the authoritative social graph;
- Community authorization;
- canonical post persistence;
- authoritative moderation decisions;
- trusted learner/professional state;
- engagement-maximization objectives that override educational value or user agency.

## Evidence firewall

The default architectural rule is:

> **Community activity is social activity, not trusted learning evidence.**

The following must remain non-authoritative by default:

- post text;
- self-claims about proficiency/mastery;
- likes/upvotes/reactions;
- follower counts;
- contribution frequency;
- group membership;
- popularity/reputation scores;
- AI interpretations of ordinary social participation.

If a later Community workflow intentionally produces learning or professional evidence, it must use a dedicated evidence contract that defines:

1. the assessment/task context;
2. actor and subject identity;
3. provenance;
4. authorization;
5. evidence type;
6. reliability/confidence rules;
7. reviewer/verification rules where needed;
8. Core-owned persistence;
9. Mind interpretation limits;
10. revocation/correction behavior.

Do not infer mastery merely because a user appears knowledgeable in a social thread.

## Relationship to Learn

Lurexa Learn retains ownership of instructional discussion required by structured learning:

- class discussion;
- course/module/lesson discussion;
- assignment discussion;
- teacher-to-learner instructional communication;
- learner-support workflows attached to class/course context.

Learn may surface links or selected Community resources later, but its required instructional workflows must not depend on Community availability.

## Relationship to Teach

Teach Community / professional circles remain inside Lurexa Teach and are educator-only professional-development experiences.

They may eventually interoperate with Lurexa Community, but they must preserve professional-development context, permissions, evidence rules and Teach branding.

A later migration or federation between Teach Community and Lurexa Community requires an explicit product decision; it must not happen implicitly through shared database collections.

## Relationship to Studio

Studio may eventually publish or share approved learning resources into Community through a governed publishing/reference contract.

Community should reference canonical published resources rather than silently cloning editable Studio source objects.

## Moderation architecture prerequisites

Before activation, the system design must define at least:

- report/flag workflow;
- moderator roles and scoped permissions;
- community-level vs platform-level moderation authority;
- content visibility/removal states;
- appeals/correction handling where applicable;
- spam/rate-limit/abuse controls;
- role/age-aware safety controls;
- block/mute controls;
- privacy defaults;
- audit requirements for consequential actions;
- AI-assistance boundaries and human override;
- retention/deletion behavior for deleted accounts/content;
- institution-specific moderation boundaries if institutional communities are supported.

## Recommendation architecture principles

A future Community recommender must optimize for useful discovery, not raw engagement.

Signals such as clicks, dwell time, reactions and follows may help rank content, but should not be treated as educational success metrics by themselves.

Recommendation behavior should support:

- user control and understandable preferences;
- diversity of useful content;
- safety and quality filtering;
- transparent sponsored/commercial separation if monetization exists later;
- avoidance of compulsive engagement loops;
- appropriate use of authorized Learner Model context without exposing private learner state publicly.

## Data-model planning guardrails

No production schema is authorized yet. When activated, likely conceptual entities may include:

- CommunitySpace;
- CommunityMembership;
- Post;
- Thread/Reply;
- Reaction;
- Follow/Subscription;
- SavedItem;
- SharedResourceReference;
- Report;
- ModerationAction;
- CommunityRole;
- CommunityNotificationPreference.

These names are planning concepts, not current database contracts.

Any future schema should prefer references to canonical Lurexa identities/resources over duplicate copies.

## Activation architecture gate

Do not begin implementation until the product owner explicitly activates Community and the following are sufficiently mature:

1. Core identity and authorization;
2. privacy/consent/data-retention policy;
3. moderation/reporting/abuse architecture;
4. stable user/profile contracts;
5. Learn and Teach collaboration boundaries;
6. recommendation governance through Mind;
7. evidence firewall and any approved evidence contract;
8. measurable product outcomes beyond time-on-platform;
9. deployment/cost model appropriate to social content scale;
10. observability and incident-response expectations.

## Governing architecture principle

> **Community owns social experience. Core owns trust. Mind supports discovery. Social engagement does not become learning truth by accident.**

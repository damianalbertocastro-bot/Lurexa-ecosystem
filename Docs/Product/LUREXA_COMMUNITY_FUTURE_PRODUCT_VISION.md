# Lurexa Community — Future Product Vision

Status: **Approved future product concept; implementation deferred**

Owner: Lurexa Learning Technologies

## Purpose

Lurexa Community is the reserved name for a future cross-ecosystem social product where learners and educators can share knowledge, ask questions, discuss learning, discover interest-based communities, form study groups, exchange useful resources, and build meaningful participation across Lurexa.

The intended experience is closer to a learning-centered Reddit-style network than to a chat room, classroom discussion board, or generic social feed.

This document defines the concept early so future implementation can preserve the correct naming, trust boundaries, product role, and relationship to the rest of the ecosystem. It does **not** authorize implementation yet.

## Product classification

Lurexa Community is a **future product concept**.

It is more product-like than capability concepts such as Marketplace, API, Mobile, or Enterprise because it has a distinct audience, experience model, social graph, content domain, interaction language, and potential standalone destination.

It is **not yet part of the current production product family**. The current family remains Learn, Coach, Teach, Admin, Insight, and Studio until a later explicit product-architecture decision promotes Community.

## Naming

Reserved name: **Lurexa Community**

Do not use the standalone name for ordinary discussion features embedded in other products.

### Lurexa Community vs Teach Community

**Lurexa Community**
- cross-ecosystem;
- learners and educators;
- broad social discovery and knowledge exchange;
- communities, posts, discussions, questions, resources, study groups, reactions and reputation;
- future standalone product/surface if activated.

**Teach Community**
- feature inside Lurexa Teach;
- educators only;
- professional circles, peer collaboration, reflection and professional-development discussion;
- inherits Lurexa Teach identity and mark;
- must not use the standalone Lurexa Community concept mark.

### Lurexa Community vs Learn discussions

Learn may own class, course, cohort, lesson, or assignment discussion spaces needed for instructional delivery. Those discussions remain part of Learn and follow Learn permissions/context.

Community should not absorb ordinary LMS discussion functionality simply because both involve conversation.

## Future experience model

A future Community implementation may include:

- home/discovery feed;
- interest-based communities;
- posts and threaded discussions;
- questions and answers;
- learner and educator spaces;
- study groups;
- resource sharing;
- reactions, saves and follows;
- trusted educator/profile signals where authorized;
- reputation/contribution systems designed to reward useful participation rather than popularity alone;
- moderation and reporting;
- personalized discovery through Lurexa Mind;
- bridges into Learn, Coach, Teach, Studio and other relevant Lurexa experiences.

These are direction-setting capabilities, not current implementation commitments.

## Architecture boundaries

### Community owns

If activated, Community should own:

- social posts and discussion threads;
- community/group membership state;
- follows/subscriptions to social spaces;
- reactions, saves and social participation state;
- social discovery presentation;
- moderation workflow state;
- Community-specific reputation/contribution presentation;
- Community product UX.

### Lurexa Core owns

Core remains responsible for:

- identity and authentication;
- authorization and age/role/tenant boundaries;
- privacy and consent controls;
- trusted identity/profile claims;
- persistence contracts;
- abuse/audit records where appropriate;
- data-retention and deletion enforcement;
- any approved transition from Community activity into trusted evidence or records.

Community must never become a second identity system or independent authoritative learner profile.

### Lurexa Mind may support

Mind may eventually support:

- community/topic recommendations;
- feed relevance and discovery;
- semantic search;
- resource/topic classification;
- duplicate-question detection;
- summarization and navigation assistance;
- safety/moderation assistance under human/governance controls;
- personalized discovery based on authorized learning context.

Mind does not own the social graph, permissions, authoritative moderation decisions, or persistent trusted learner state.

## Evidence boundary

> **Social activity is not trusted learning evidence by default.**

Examples:

- posting “I understand conditionals now” is self-expression, not proof of mastery;
- receiving many upvotes is not proficiency evidence;
- participating in an English discussion may be useful activity context but must not automatically change CEFR/mastery state;
- a teacher sharing advice is not automatically a verified professional credential.

If Community later contributes learning or professional evidence, the evidence must come from an explicit designed workflow with provenance, authorization, reliability rules, and a Core-governed persistence boundary.

## Safety and moderation boundary

Community must be designed as a high-trust educational network rather than an engagement-maximizing social platform.

Future activation requires:

- reporting and moderation systems;
- role/age-aware safety policy;
- harassment, spam and abuse controls;
- privacy-aware profile defaults;
- content visibility controls;
- institutional/community moderation boundaries where applicable;
- transparent recommendation behavior;
- protection against reputation systems becoming high-stakes learner ranking;
- clear separation between AI assistance and human moderation authority.

## Product personality

Personality: **social, welcoming, and participatory**.

Community should feel alive and human without becoming noisy, addictive, or visually chaotic.

Design direction:

- conversation and discovery first;
- clear community identity and hierarchy;
- warmer/more social composition than Admin or Insight;
- more networked/content-dense than Learn;
- less voice-session focused than Coach;
- violet/blue foundation with cyan participation/accent signals;
- expressive but controlled social motion;
- visible trust, moderation, role and provenance cues;
- accessibility and readability ahead of feed density.

The concept mark uses overlapping conversation spaces plus a participation signal. It communicates a network of contribution rather than a single chat interaction.

Canonical concept asset:

`packages/ui/brand/concepts/lurexa-community-concept.svg`

## Future activation gate

Do not create `apps/community`, deploy Community, add it to pricing, or add it to current-product navigation until an explicit product decision confirms activation.

Before activation, at minimum the following should be mature enough to support it safely:

1. Core identity, authorization, privacy and moderation foundations;
2. stable shared product/identity contracts;
3. mature Learn and Teach boundaries;
4. a reliable cross-product user/profile model;
5. documented social-content retention and moderation policy;
6. Mind recommendation boundaries that do not confuse engagement with educational value;
7. measurable product outcome beyond increasing time-on-platform.

## Success hypothesis

Community should exist only if it makes the ecosystem more useful through high-quality peer learning, educator/learner connection, resource discovery, belonging, and knowledge exchange.

The goal is not to build “social media for education.” The goal is to build a trusted learning network that strengthens Lurexa experiences without weakening instructional quality, privacy, or the trusted Learner Model.

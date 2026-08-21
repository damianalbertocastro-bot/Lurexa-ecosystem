# Design System Foundations

- Status: **Normative design baseline**
- Applies to: all Lurexa product surfaces

## Goal

Lurexa should feel calm, capable and human—not like a generic quiz app or an opaque AI interface. The design system must help learners focus, help teachers act quickly, and keep administrative complexity contained.

The governing visual principle is **shared grammar + distinct personalities**. Lurexa products must clearly belong to one ecosystem without becoming visually interchangeable. Shared components establish family resemblance; product-specific expression communicates purpose.

See `Docs/Design/PRODUCT_PERSONALITY_SYSTEM.md` for the normative personality contract for Master Lurexa, Learn, Coach, Teach, Admin, Insight, Studio and Docs.

## Core rules

1. Use design tokens and shared components before introducing local visual values.
2. Prioritize readable hierarchy, visible focus, touch-friendly controls and predictable states.
3. Explain AI behavior in plain language; never use visual polish to hide uncertainty.
4. Keep learning actions prominent and secondary data/supporting controls quiet.
5. Provide robust loading, empty, error, offline-pending and success states.
6. Support mobile-first learning without reducing essential meaning or access.
7. Do not use colour as the only carrier of status, correctness or urgency.
8. Do not force visual sameness across products. Reuse component anatomy and interaction standards while allowing product-specific palette emphasis, density, shape language, motion character, and hierarchy.
9. A user should be able to recognize both that a surface belongs to Lurexa and which Lurexa product they are using.

## Product expression

| Product / surface | Personality | Interaction emphasis |
| --- | --- | --- |
| Master Lurexa | institutional, foundational | ecosystem orientation, trust, company-level narrative, product discovery |
| Learn — learner experience | inviting, progressive | focus, progress, clear next action, low cognitive load |
| Learn — teacher workspace | operational, calm | scanning, class operations, learner support, context before action |
| Coach | conversational, alive | safety to speak, turn-taking, understandable feedback, visible privacy context |
| Teach | professional, developmental | professional growth, reflection, evidence, credentials, community, clear developmental next steps |
| Admin | authoritative, controlled | safety, permissions, auditability, destructive-action clarity |
| Insight | analytical, interpretive | comparison and interpretation without false precision |
| Studio | creative, constructive | structured authoring, preview, validation and version status |
| Docs | structured, knowledge-oriented | authority, discoverability, long-form readability, source provenance, navigation between canonical knowledge and product behavior |

The Learn teacher workspace must not be visually or conceptually relabeled as Lurexa Teach. Teach is the educator professional-development product; Learn owns operational teaching and learner management.

## Brand-family marks

Lurexa uses a family system rather than repeating the master mark for every surface.

- The **Master Mark** represents Lurexa Learning Technologies and the ecosystem as a whole.
- Product marks should preserve family resemblance through geometry, weight, spacing and the shared navy/violet/blue/cyan language while expressing a distinct product idea.
- A product or major ecosystem surface must not simply reuse the Master Mark with a different text label when a differentiated symbol improves recognition.
- Learn, Coach, Teach, Admin, Insight and Studio use their dedicated product glyphs from `@lurexa/ui/ProductMark`.
- Docs uses its dedicated knowledge/documentation glyph from `@lurexa/ui/DocsMark`; the Master Mark remains the appropriate link back to the parent ecosystem.
- Feature identities such as Teach Community should inherit their parent-product identity rather than being promoted into a false top-level product.

A new product mark should be recognizable at compact icon size, work without the wordmark, remain legible on light/dark surfaces, and avoid copying the silhouette of an existing Lurexa mark.

## Related Lurexa experiences

Main product landing pages and primary dashboards should end with a contextual **Related Lurexa Experiences** section when there are useful adjacent experiences.

The goal is ecosystem continuity, not cross-selling. Recommendations must be role-aware and task-aware:

- learners should see the most relevant practice or learning continuation first;
- teachers operating inside Learn should see Teach, Teach Community, Coach and Docs where relevant;
- educators inside Teach should be able to return to the Learn teacher workspace without confusing product ownership;
- administrators should receive context from Insight, Docs and the products they govern;
- Docs should connect source-of-truth material back to the products where those decisions become behavior.

Rules:

1. Use the shared `@lurexa/ui/RelatedExperiences` component rather than rebuilding local card grids.
2. Prioritize the highest-value adjacent experience in the first, visually dominant card.
3. Do not show every Lurexa product to every user; relevance beats catalog completeness.
4. Clearly distinguish a product from a feature (for example, **Teach Community** is a Teach feature, not a seventh product).
5. Preserve the current product's primary task hierarchy. Related experiences belong near the bottom of landing/dashboard surfaces, not above the user's main work.
6. Cross-product links should use deployment environment variables with a safe ecosystem fallback rather than hard-coded environment-specific hosts.
7. The section should reinforce the principle: **One learner. One evolving model. Every Lurexa experience adapts around it.** For educator experiences, the same continuity principle applies without creating duplicate identities or profiles.

## Tokens and components

Color, typography, spacing, elevation, radii, motion and semantic states belong in `@lurexa/tokens`. Reusable UI primitives belong in `@lurexa/ui`. Product code must not fork a component solely for a local aesthetic preference when a composable variant can serve the need.

Product personality contracts live in `@lurexa/tokens/product-personality`. They are semantic design guardrails, not a requirement to make every product consume the same theme object at runtime.

New tokens/components require: a reusable need, semantic name, light/dark and accessible-state consideration, responsive behavior, and Storybook/documentation coverage when the component is shared.

## Accessibility baseline

Meet WCAG 2.2 AA as the practical target: contrast, keyboard access, visible focus, semantic controls, labels/instructions, error identification, text alternatives, responsive reflow and motion reduction. Learning feedback must remain understandable without colour, sound or animation.

## AI interaction requirements

AI-generated content should identify its purpose, provide actionable output, reveal uncertainty where relevant, offer retry/alternative paths, and avoid claims of human certainty. Learners must be able to continue meaningful work when AI is unavailable.

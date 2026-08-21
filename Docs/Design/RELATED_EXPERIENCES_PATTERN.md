# Related Lurexa Experiences Pattern

- Status: **Active ecosystem UX pattern**
- Applies to: product landing pages and primary dashboards

## Purpose

Related Lurexa Experiences connects users to the next useful part of the ecosystem without turning product pages into catalogs or cross-sell surfaces.

The pattern should answer: **What other Lurexa experience would genuinely help this person next?**

## Placement

Place the section near the bottom of a product landing page or primary dashboard, after the user has completed or reviewed the surface's main task.

Do not place it above the primary product action, inside dense workflow forms, or on every secondary feature page.

## Context rules

- Learner contexts: prioritize Coach or another direct learning continuation.
- Learn teacher workspace: prioritize Teach, then Teach Community, Coach, and Docs when relevant.
- Teach: connect educators back to the Learn teacher workspace, Teach Community, Docs, and Coach.
- Admin: prioritize Insight, Docs, and the products being governed.
- Docs: connect canonical knowledge back to the ecosystem and concrete product behavior.
- Parent ecosystem landing: this pattern is normally unnecessary because that page already serves as the ecosystem navigator.

## Visual rules

Use `@lurexa/ui/RelatedExperiences`.

- The first card is the recommended next experience and receives stronger visual emphasis.
- Secondary cards remain quieter and equal in hierarchy.
- Product marks should remain recognizable and compact.
- Descriptions should explain why the destination matters in the current context.
- Avoid generic copy such as "Discover more products."
- Avoid showing unavailable or irrelevant products only for portfolio completeness.

## Product identity rules

Use dedicated product marks for Learn, Coach, Teach, Admin, Insight, and Studio.

Use `DocsMark` for Lurexa Docs. Docs is an ecosystem knowledge surface with its own mark; the Lurexa Master Mark continues to represent the parent ecosystem.

Teach Community is a Teach feature and inherits Teach identity. It must not be presented as a seventh top-level product.

## Link configuration

Cross-app destinations should use `NEXT_PUBLIC_LUREXA_*_URL` environment variables when available and fall back safely to the ecosystem landing page. Same-app destinations may use relative routes.

## Accessibility

Cards must remain keyboard-focusable, expose meaningful destination text, preserve visible focus states, meet touch-target guidance, and not rely on color alone to communicate the recommended item.

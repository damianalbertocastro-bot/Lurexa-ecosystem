# Design System Foundations

- Status: **Normative design baseline**
- Applies to: all Lurexa product surfaces

## Goal

Lurexa should feel calm, capable and human—not like a generic quiz app or an opaque AI interface. The design system must help learners focus, help teachers act quickly, and keep administrative complexity contained.

## Core rules

1. Use design tokens and shared components before introducing local visual values.
2. Prioritize readable hierarchy, visible focus, touch-friendly controls and predictable states.
3. Explain AI behavior in plain language; never use visual polish to hide uncertainty.
4. Keep learning actions prominent and secondary data/supporting controls quiet.
5. Provide robust loading, empty, error, offline-pending and success states.
6. Support mobile-first learning without reducing essential meaning or access.
7. Do not use colour as the only carrier of status, correctness or urgency.

## Product expression

| Product | Interaction emphasis |
| --- | --- |
| Learn | focus, progress, clear next action, low cognitive load |
| Coach | safety to speak, turn-taking, understandable feedback, visible privacy context |
| Teach | scanning, instructional decisions, context before action |
| Admin | safety, permissions, auditability, destructive-action clarity |
| Insight | comparison and interpretation without false precision |
| Studio | structured authoring, preview, validation and version status |

## Tokens and components

Color, typography, spacing, elevation, radii, motion and semantic states belong in `@lurexa/tokens`. Reusable UI primitives belong in `@lurexa/ui`. Product code must not fork a component solely for a local aesthetic preference when a composable variant can serve the need.

New tokens/components require: a reusable need, semantic name, light/dark and accessible-state consideration, responsive behavior, and Storybook/documentation coverage when the component is shared.

## Accessibility baseline

Meet WCAG 2.2 AA as the practical target: contrast, keyboard access, visible focus, semantic controls, labels/instructions, error identification, text alternatives, responsive reflow and motion reduction. Learning feedback must remain understandable without colour, sound or animation.

## AI interaction requirements

AI-generated content should identify its purpose, provide actionable output, reveal uncertainty where relevant, offer retry/alternative paths, and avoid claims of human certainty. Learners must be able to continue meaningful work when AI is unavailable.

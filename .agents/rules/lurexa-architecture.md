# Lurexa Architectural Rules

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

- **Lurexa Core** owns identity, authorization, persistence, trust boundaries, evidence provenance, and data contracts.
- **Lurexa Mind** interprets authorized learning evidence to produce recommendations, personalization, and coaching intelligence.
- **Products** (`Lurexa Learn`, `Lurexa Coach`, `Lurexa Teach`, `Lurexa Admin`, `Lurexa Insight`, `Lurexa Studio`) deliver user experiences and capture evidence through Core boundaries.

## Rules for Agents
- Do not create separate authoritative learner profiles per product.
- Do not allow product UI components to directly mutate Firestore or execute raw database queries.
- Do not call AI providers directly from product UI code for production learning intelligence.
- Use TypeScript for all new code and avoid `any` without explicit justification.
- Prefer `@lurexa/ui` design tokens over hardcoded inline styling.

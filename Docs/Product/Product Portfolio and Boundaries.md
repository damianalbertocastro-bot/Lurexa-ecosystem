# Product Portfolio and Boundaries

- Status: **Normative design baseline**
- Source: [Lurexa Bible](../00-Lurexa-Bible.md)

## Portfolio model

Lurexa Learning Technologies builds a multi-product learning ecosystem. Lurexa Core and Lurexa Mind are shared layers, not end-user products.

| Surface | Primary user/value | Must not become |
| --- | --- | --- |
| Lurexa Learn | learner’s structured learning experience | a separate learner-data silo |
| Lurexa Coach | AI-powered speaking, pronunciation and fluency practice | the shared intelligence layer |
| Lurexa Teach | educator management, feedback and intervention workspace | an unrestricted learner-surveillance tool |
| Lurexa Admin | organization, access and operational management | a direct database console |
| Lurexa Insight | authorized learning analytics and intelligible signals | opaque automated decision-making |
| Lurexa Studio | authoring, review and publishing of learning objects | a bypass around curriculum governance |
| Lurexa Core | trust, identity, authorization, persistence and contracts | a generic product UI |
| Lurexa Mind | learning interpretation, personalization and AI capability | authoritative persistence or access control |

## Product boundary rules

1. Products own experience flows and product-specific presentation state.
2. Core owns identity, authorization, tenant boundaries, trusted records, evidence provenance and approved persistence.
3. Mind interprets authorized evidence and context; its results are scoped, reviewable and persist only through Core.
4. A product may not build a private authoritative learner profile or directly couple persistent intelligence to a model provider.
5. Cross-product value is delivered through stable contracts, not database copies or client-to-client dependencies.

## First product sequence

1. **Learn** proves a complete learning/evidence vertical slice.
2. **Mind foundation** turns that evidence into reusable context and recommendation capability.
3. **Coach** proves differentiated context-aware speaking and pronunciation practice.
4. **Teach**, then **Admin/Insight**, extend the same trusted ecosystem.
5. **Studio** scales curriculum operations once learning-object delivery patterns are validated.

This order is a risk-reduction strategy, not a claim that later products are unimportant.

## Product readiness gate

Before a surface is treated as production-ready, it needs a defined user, outcome, permission model, Core/Mind interaction, evidence emitted, error/fallback behavior, accessibility and low-bandwidth expectations, and measurable acceptance criteria.

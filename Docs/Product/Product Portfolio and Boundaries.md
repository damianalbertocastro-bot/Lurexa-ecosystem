# Product Portfolio and Boundaries

- Status: **Normative design baseline**
- Source: [Lurexa Bible](../00-Lurexa-Bible.md)

## Portfolio model

Lurexa Learning Technologies builds a multi-product learning ecosystem. Lurexa Core and Lurexa Mind are shared layers, not end-user products.

| Surface | Primary user/value | Must not become |
| --- | --- | --- |
| Lurexa Learn | structured learning and instructional delivery for learners and teachers operating student learning | a separate learner-data silo |
| Lurexa Coach | AI-powered speaking, pronunciation and fluency practice | the shared intelligence layer |
| Lurexa Teach | educator professional development, growth, evidence, credentials and professional community | the Learn teacher operations dashboard |
| Lurexa Admin | organization, access and operational management | a direct database console |
| Lurexa Insight | authorized learning analytics and intelligible signals | opaque automated decision-making |
| Lurexa Studio | authoring, review and publishing of learning objects | a bypass around curriculum governance |
| Lurexa Core | trust, identity, authorization, persistence and contracts | a generic product UI |
| Lurexa Mind | learning interpretation, personalization and AI capability | authoritative persistence or access control |

## Future product concept

**Lurexa Community** is an approved future product concept whose implementation is intentionally deferred.

Its reserved purpose is a cross-ecosystem social learning network for learners and educators: communities, posts, questions, discussions, study groups, resources and useful knowledge exchange.

It is not yet part of the current production product family and must not appear as an active product in navigation, pricing or deployment until an explicit activation decision is made.

Community must remain distinct from:

- **Teach Community**, which is educator-only professional collaboration inside Lurexa Teach;
- **Learn discussions**, which are class/course/lesson discussion experiences required for instructional delivery.

See [Lurexa Community — Future Product Vision](LUREXA_COMMUNITY_FUTURE_PRODUCT_VISION.md).

## Product boundary rules

1. Products own experience flows and product-specific presentation state.
2. Core owns identity, authorization, tenant boundaries, trusted records, evidence provenance and approved persistence.
3. Mind interprets authorized evidence and context; its results are scoped, reviewable and persist only through Core.
4. A product may not build a private authoritative learner profile or directly couple persistent intelligence to a model provider.
5. Cross-product value is delivered through stable contracts, not database copies or client-to-client dependencies.
6. Social participation is not trusted learning evidence by default; any future Community-to-Learner-Model pathway requires an explicit Core-governed evidence contract.

## First product sequence

1. **Learn** proves a complete learning/evidence vertical slice.
2. **Mind foundation** turns that evidence into reusable context and recommendation capability.
3. **Coach** proves differentiated context-aware speaking and pronunciation practice.
4. **Teach**, then **Admin/Insight**, extend the same trusted ecosystem.
5. **Studio** scales curriculum operations once learning-object delivery patterns are validated.
6. **Community remains deferred** until identity, privacy, moderation, social-content governance and cross-product contracts are mature enough to support a safe networked product.

This order is a risk-reduction strategy, not a claim that later products are unimportant.

## Product readiness gate

Before a surface is treated as production-ready, it needs a defined user, outcome, permission model, Core/Mind interaction, evidence emitted, error/fallback behavior, accessibility and low-bandwidth expectations, and measurable acceptance criteria.

A social product additionally requires moderation, reporting, abuse prevention, privacy defaults, content-retention rules, recommendation safeguards and a clear separation between engagement signals and learning evidence.

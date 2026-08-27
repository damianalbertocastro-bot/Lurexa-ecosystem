# Lurexa Product Ecosystem

Version: 2.0  
Status: Authoritative product topology  
Last reconciled: 2026-08-27

## Company and ecosystem structure

```text
Lurexa Learning Technologies
│
├── Shared ecosystem layers
│   ├── Lurexa Core
│   └── Lurexa Mind
│
├── Six sibling products
│   ├── Lurexa Learn
│   ├── Lurexa Coach
│   ├── Lurexa Teach
│   ├── Lurexa Admin
│   ├── Lurexa Insight
│   └── Lurexa Studio
│
└── Institutional orchestration shell
    └── Lurexa Campus
```

Core and Mind are shared layers, not products. Campus is not a seventh sibling product.

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Core owns identity, authorization, authoritative persistence, trusted learner/professional records, qualification/teaching authorization, provenance and shared contracts. Mind interprets authorized evidence for personalization, recommendations, tutoring/coaching and professional intelligence; Mind does not grant authority or own canonical persistence.

## Lurexa Learn

Learn owns structured learner delivery and the operational Teacher Workspace.

Repository ownership:

- `apps/learn-web` = learner web + `/teacher` Teacher Workspace.
- `apps/mobile` = Learn mobile surface.

Teacher Workspace owns class/course/student operations, enrollment, progress, assignments/submissions, instructional insights/interventions and learner support. It must never be reclassified as Lurexa Teach.

Learn Teacher Insights are instructional Learn features. They are not the standalone Lurexa Insight product.

## Lurexa Coach

Coach is a standalone first-class product at `apps/coach-web`.

Coach owns adaptive English speaking, pronunciation, fluency and educator-professional English practice. Its first deep linguistic specialization is Dominican Spanish speakers learning English. It prioritizes intelligibility, naturalness and confidence rather than accent erasure.

Learn and Teach may launch Coach through purpose-scoped Product Bridges. Learn compatibility `/coach` routes must not regain canonical Coach UI/runtime ownership.

Coach consumes Core/Mind capabilities and contributes governed evidence; it does not become a second Mind or authoritative learner store. Educator-professional Coach evidence stays separate from ordinary student learner evidence.

## Lurexa Teach

Teach is the educator-as-learner professional-development product at `apps/teach-web`.

It owns professional growth, pedagogy/methodology, language development, lesson/activity/assessment competence, reflection, professional evidence, credentials and Mind-based development recommendations.

Teach does not own student rosters, class operations or Learn Teacher Workspace. One identity may use Learn Teacher Workspace, Teach and educator Coach benefits, but entitlement, qualification and teaching authorization remain separate Core-governed concerns.

## Lurexa Admin

Admin is the institutional governance/administration product at `apps/admin-portal`.

Verified current scope includes educator qualification review and teaching authorization foundations. Qualification review and teaching authorization are separate operations. Billing/payment is not production-active merely because planning UI or types exist.

## Lurexa Insight

Insight is the future standalone institutional/cohort analytics product.

Current repository state: **ARCHITECTURE**, not standalone application. Learn Teacher instructional insights must not be relabeled as Insight.

Future Insight must use tenant-authorized, aggregated/measured projections with privacy thresholds and provenance. It must not fabricate platform metrics.

## Lurexa Studio

Studio is the future standalone governed authoring product.

Current repository state: governed Knowledge Object/catalog service foundations plus a contained local Teacher Workspace interaction prototype. The prototype is not authoritative Studio persistence/publication.

Future Studio owns authoring workflow; Core owns trusted object records, provenance, permissions, versions and publication state; Mind may assist creation/validation but cannot publish authoritatively on its own.

## Lurexa Campus

Campus is an institutional orchestration shell, not a sibling product owner.

Current repository state: architecture plus representative contained prototype. It must not claim a real institution, SSO, entitlement set, enrollment/faculty metrics or institutional analytics unless those are resolved through trusted Core contracts.

Future Campus may become a standalone deployable app while retaining this structural classification.

## Future concepts/capabilities

### Marketplace

Marketplace remains a future capability/concept. Current routes are contained status/prototype surfaces. No purchase, receipt, author-earnings, licensing or Stripe-readiness claim is authoritative.

### Community

Lurexa Community remains a future product concept. Teach Community/professional circles are Teach features and must not be conflated with a standalone Lurexa Community product.

## Persistent learner/professional model rules

- Do not create separate learner truth per product.
- Student learner evidence and educator professional evidence are purpose-separated.
- Products receive only context authorized for their product/purpose/role/tenant.
- Mind interpretation is not authorization.
- Core owns authoritative qualification and teaching authorization.
- A global `teacher=true` flag is not sufficient for Learn Teacher Workspace access.

## Product ownership rules

Correct:

- Learn = learner delivery + operational Teacher Workspace.
- Coach = standalone speaking/pronunciation/fluency practice.
- Teach = educator professional development.
- Admin = governance/administration.
- Insight = standalone analytics product foundation, not Learn teacher insights.
- Studio = standalone authoring product foundation, not local prototype state.
- Campus = institutional orchestration shell.
- Core = trust/authority/persistence.
- Mind = interpretation/intelligence.

Incorrect:

- `apps/teacher-portal` as current Teacher Workspace ownership;
- Coach embedded as Learn-owned canonical UI;
- class/learner management under Teach;
- Insight equated with `/teacher/insights`;
- local Studio React state described as persistent/published objects;
- Campus classified as a seventh sibling product;
- products creating independent learner models;
- Mind granting qualification/permissions;
- browser-owned purchase/payment completion.

## Current repository application mapping

- `apps/web` — ecosystem shell/landing.
- `apps/learn-web` — Learn + Teacher Workspace.
- `apps/coach-web` — Coach.
- `apps/teach-web` — Teach.
- `apps/admin-portal` — Admin.
- `apps/docs` — documentation surface.
- `apps/mobile` — Learn mobile surface.

No current standalone `apps/insight-web`, `apps/studio-web`, or `apps/campus-web` exists. Do not invent those implementations when describing repository state.

Use `ROADMAP.md` for maturity/execution truth and `Docs/00-Lurexa-Bible.md` for company/ecosystem principles.

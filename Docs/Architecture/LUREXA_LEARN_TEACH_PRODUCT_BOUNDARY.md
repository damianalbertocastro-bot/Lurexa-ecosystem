# Lurexa Learn Teacher Workspace ↔ Lurexa Teach Product Boundary

Status: **Normative architecture and design contract**  
Owner: Lurexa Learning Technologies  
Date: 2026-08-25  
Authority: subordinate to `Docs/00-Lurexa-Bible.md`, authoritative for implementation details

## Decision

> **Lurexa Learn is where educators operate student learning. Lurexa Teach is where educators develop themselves professionally.**

The distinction is based on the **subject of the workflow**, not simply the identity of the signed-in person.

A teacher can use both products under one canonical Lurexa identity:

- inside **Learn**, the person acts as an educator operating another learner's instructional experience;
- inside **Teach**, the same person is the learner and the product adapts around their own professional growth;
- inside **Coach**, the same person may develop speaking, pronunciation and English proficiency without creating another account.

Product ownership stays separate while identity, approved evidence and governed entitlements remain cross-product.

See `Docs/Architecture/LUREXA_EDUCATOR_IDENTITY_QUALIFICATION_MODEL.md` for the normative educator identity, entitlement, qualification and authorization model.

## Identity and access rule

A Learn educator must not need to sign up for Lurexa Teach again.

The same Core-owned identity should receive:

- immediate Teach entitlement or a lightweight activation/opt-in path without account recreation;
- full Lurexa Coach access as an educator benefit, subject to commercial/safety policy;
- a professional learner state in Teach that is separate from their student-operation permissions in Learn.

A Teach learner does **not** automatically gain Learn Teacher Workspace access.

Learn Teacher Workspace access requires both:

1. an evidence-backed educator qualification scope; and
2. explicit platform/institution/program/course teaching authorization.

English proficiency alone is not sufficient teaching qualification.

## Product ownership matrix

| Capability | Learn Teacher Workspace | Lurexa Teach |
| --- | --- | --- |
| Course/class operations | Owns | Does not own |
| Student roster | Owns | Does not own |
| Student invitations/access | Owns | Does not own |
| Assignments/submissions | Owns | Does not own |
| Grades/assessment operations | Owns | Does not own |
| Student progress | Owns | Does not own |
| Student Learner Pulse | Owns authorized instructional view | Does not browse |
| Student Memory Thread | Future authorized instructional view | Does not browse |
| Student interventions/feedback | Owns | Does not own |
| Teacher professional courses | Links/bridges only | Owns |
| Teacher competency profile | Contextual link only | Owns |
| Professional goals/pathways | Does not own | Owns |
| Reflection/portfolio | May generate source evidence | Owns professional interpretation/workflow |
| Credentials/certifications | Does not own | Owns |
| Professional community | Links/bridges only | Owns |
| Teacher-growth recommendations | Links/bridges only | Owns |
| Educator qualification preparation | Consumes resulting authorization | Owns learning pathway/evidence contribution |
| Teaching authorization | Enforces Core decision | Does not grant |
| Educator English development | May link | Owns pathway; may bridge to Coach |

## Repository mapping

```text
apps/learn-web/app/teacher
└── Lurexa Learn Teacher Workspace
    ├── dashboard
    ├── courses
    ├── students
    ├── insights
    ├── quizzes / assessment operations
    └── future assignments, submissions and intervention workflows

apps/teach-web
└── Lurexa Teach
    ├── dashboard
    ├── professional learning courses
    ├── growth
    ├── professional assessment
    ├── credentials
    ├── reflection/evidence
    └── educator community
```

No operational student-management route should be introduced under `apps/teach-web`.

## Authorization contract

Delegated access to another person's learner context is an operational Learn capability.

### Approved v1 delegated path

```text
requesting product: learn
purpose: teacher_instructional_support
actor: owner | admin | teacher in organization
subject: student member in same organization
organization: explicit and required
```

Core owns this decision.

Lurexa Teach receives no delegated student-context entitlement in v1.

A future Teach professional-growth projection must use the educator's **own professional evidence/model scope**, not student-context browsing disguised as professional development.

### Future qualified-teacher authorization

The current membership role is an initial authorization mechanism, not the intended final educator model.

The target check is conceptually:

```text
canOperateLearnTeacherWorkspace =
  hasLearnTeacherEntitlement
  && hasEligibleEducatorQualification(requestedTeachingScope)
  && hasTeachingAuthorization(organization, program/course, requestedTeachingScope)
```

A global `teacher = true` flag must not become the sole long-term basis for access.

## Qualification-scoped teaching

A Teach learner may develop toward authorization to teach, but completion or English mastery does not automatically unlock Learn Teacher Workspace.

Qualification should be scoped by subject and level, and should combine evidence such as:

- language proficiency;
- teaching methodology;
- lesson planning;
- activity/assessment design;
- instructional practice;
- required credentials.

If a person is qualified to teach A1–B1 but requests B2 teaching scope, access remains closed for B2 until the qualification gap is addressed and the broader teaching scope is authorized.

Mind should explain the gap and recommend a development path in Teach and, where appropriate, Coach.

## Lurexa Teach curriculum responsibility

Teach is a full educator-learning product rather than a methodology library.

Its professional curriculum should integrate:

- English knowledge and CEFR development;
- language-teaching methodologies;
- lesson planning;
- activity and learning-experience creation;
- assessment literacy;
- instructional practice and reflection;
- digital/AI teaching competence;
- professional portfolio and credentials.

Teach may bridge into Coach for language/pronunciation development and into Studio for governed creation workflows, while those capabilities remain owned by their respective products.

## Signature Experience contract

### Learn Teacher Workspace

Student-level Signature primitives may appear only when they support an instructional decision and Core authorizes the educator:

- Learner Pulse — appropriate for concise student-state support;
- Memory Thread — appropriate when a teacher needs development history for a specific instructional target;
- Mind Trace — appropriate for explaining an instructional recommendation;
- Product Bridge — appropriate for assigning/recommending a cross-product learner experience;
- Knowledge Object — appropriate as a stable semantic target.

These are still `consumer: "learn"` experiences.

### Lurexa Teach

Teach may use the same shared Signature grammar **only around the educator's own professional growth**. Examples:

- professional competency Pulse;
- professional growth path;
- professional evidence/reflection thread;
- approved explanation of a growth or qualification-readiness recommendation;
- bridge from a Learn teaching-practice event into a Teach development activity;
- bridge into Coach for educator language development;
- professional Knowledge Objects/competencies.

Teach must not reuse student-oriented language or views blindly.

## Data-model separation

Identity may be shared across products, but evidence purpose and permissions must remain scoped.

A person can simultaneously have:

1. one canonical Lurexa identity;
2. product entitlements for Learn/Teach/Coach;
3. an educator qualification scope;
4. an institution/program/course teaching authorization;
5. an educator role in Learn, authorizing them to operate specific student learning;
6. their own professional learner state in Teach.

These must not collapse into one undifferentiated record.

### Prohibited inference

A student's weakness must never become a weakness on the teacher's professional learner model merely because the teacher taught that student.

Example of a prohibited mapping:

```text
Student repeatedly struggles with past tense
→ teacher is weak at teaching past tense
```

That conclusion requires separate educator-practice evidence.

## Cross-product professional evidence bridge

The intended future loop is:

```text
Learn Teacher Workspace
  ↓ authorized teaching-practice event/evidence
Core trusted professional-evidence boundary
  ↓ authorized evidence
Mind professional interpretation
  ↓ minimized professional context
Lurexa Teach
  ↓ professional learning / reflection / growth activity
  ↓ optional Coach / Studio bridges
Core
  ↓ updated educator professional evidence
Teach adapts future growth + qualification-readiness path
```

Student evidence should be aggregated/minimized before it contributes to educator-development interpretation unless a specific governance policy authorizes otherwise.

## Design inheritance

The Learn Teacher Workspace is **not visually Lurexa Teach embedded inside Learn**.

It inherits:

- Lurexa Learn product mark and identity;
- Learn foundational color/tokens/components;
- Learn route/navigation context;
- shared Lurexa accessibility and interaction grammar;
- shared Signature primitives.

It may use a more operational density than learner-facing Learn because the job is different.

### Learn Teacher Workspace personality

**Instructional, calm, efficient, evidence-aware.**

Design cues:

- Learn blue/indigo identity remains primary;
- denser tables/cards than the learner dashboard are acceptable;
- class/course/student context should always be visible;
- student status must not be reduced to punitive red/green scoring;
- instructional recommendations should be actionable and evidence-conscious;
- transitions to Teach must look like a cross-product professional-growth handoff, not a hidden route change.

### Lurexa Teach personality

**Professional, developmental, reflective, aspirational.**

Design cues:

- violet/navy professional-growth personality;
- editorial/professional-learning hierarchy;
- competencies, reflection, evidence, credentials and growth pathways;
- visible educator-readiness/qualification progression where appropriate;
- no classroom roster density or gradebook metaphors;
- no student-management navigation.

## Navigation contract

### Learn Teacher Workspace

Expected operational navigation may include:

- Dashboard
- Courses / Classes
- Students
- Assignments
- Assessments / Grades
- Insights
- Studio/content entry points when authorized
- Professional Growth → explicit Product Bridge/link to Lurexa Teach
- Coach → educator benefit / language-development entry point

### Lurexa Teach

Expected professional-development navigation may include:

- Dashboard
- Professional Learning
- English for Educators
- Methodology
- Lesson Planning
- Activity & Assessment Design
- Growth / Qualification Readiness
- Assessment
- Credentials
- Reflection / Portfolio
- Community
- My professional profile
- Coach → language/pronunciation development

`Students`, `Classes`, `Grades`, and `Submissions` must not become primary Teach navigation.

## Engineering guardrails

CI should fail if:

1. `apps/teach-web/app/students` reappears;
2. Teach exposes a student roster endpoint;
3. Teach receives `teacher_instructional_support` in Core product-purpose policy;
4. a delegated student Signature projection uses `consumer: "teach"`;
5. operational roster contracts are named as Teach contracts;
6. Learn teacher APIs return cacheable learner projections;
7. the real educator actor is replaced with learner impersonation;
8. cross-tenant membership checks are removed;
9. product entitlement is treated as equivalent to teaching authorization;
10. Teach completion alone directly grants student-operation access;
11. English proficiency alone directly grants a teaching scope;
12. a qualification or authorization check silently broadens an educator's teaching level.

## Current rollout flag

Student Learner Pulse inside Learn Teacher Workspace:

`NEXT_PUBLIC_LEARN_TEACHER_SIGNATURE_V1=on`

The flag name intentionally encodes the product owner.

## End-state statement

A teacher should be able to move naturally between distinct jobs without creating duplicate accounts:

> **I am teaching my learners → Lurexa Learn Teacher Workspace.**  
> **I am improving myself as an educator → Lurexa Teach.**  
> **I am developing my spoken English/pronunciation → Lurexa Coach.**

A Teach learner can grow into an authorized Learn educator, but only through evidence-backed qualification plus explicit teaching authorization.

The ecosystem should connect those jobs without merging their product responsibilities.
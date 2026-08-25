# Lurexa Learn Teacher Workspace ↔ Lurexa Teach Product Boundary

Status: **Normative architecture and design contract**  
Owner: Lurexa Learning Technologies  
Date: 2026-08-25  
Authority: subordinate to `Docs/00-Lurexa-Bible.md`, authoritative for implementation details

## Decision

> **Lurexa Learn is where educators operate student learning. Lurexa Teach is where educators develop themselves professionally.**

The distinction is based on the **subject of the workflow**, not simply the identity of the signed-in person.

A teacher can use both products:

- inside **Learn**, the teacher acts as an educator operating another learner's instructional experience;
- inside **Teach**, the same person is the learner and the product adapts around their own professional growth.

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
- approved explanation of a growth recommendation;
- bridge from a Learn teaching-practice event into a Teach development activity;
- professional Knowledge Objects/competencies.

Teach must not reuse student-oriented language or views blindly.

## Data-model separation

Identity may be shared across products, but evidence purpose must remain scoped.

A teacher can simultaneously have:

1. an educator role in Learn, authorizing them to operate student learning; and
2. their own professional learner state in Teach.

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
Core
  ↓ updated educator professional evidence
Teach adapts future growth path
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

### Lurexa Teach

Expected professional-development navigation may include:

- Dashboard
- Professional Learning
- Growth
- Assessment
- Credentials
- Reflection / Portfolio
- Community
- My professional profile

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
8. cross-tenant membership checks are removed.

## Current rollout flag

Student Learner Pulse inside Learn Teacher Workspace:

`NEXT_PUBLIC_LEARN_TEACHER_SIGNATURE_V1=on`

The flag name intentionally encodes the product owner.

## End-state statement

A teacher should be able to move naturally between two distinct jobs:

> **I am teaching my learners → Lurexa Learn Teacher Workspace.**  
> **I am improving myself as an educator → Lurexa Teach.**

The ecosystem should connect those jobs without merging them.

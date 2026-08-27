# Lurexa Learn Teacher Workspace ↔ Lurexa Teach Product Boundary

Status: **Normative architecture and design contract**  
Owner: Lurexa Learning Technologies  
Last reconciled: 2026-08-27  
Authority: subordinate to `Docs/00-Lurexa-Bible.md`, authoritative for implementation details

## Decision

> **Lurexa Learn is where educators operate student learning. Lurexa Teach is where educators develop themselves professionally.**

The distinction is based on the subject of the workflow, not merely the identity of the signed-in person.

A teacher can use Learn, Teach and Coach under one canonical Lurexa identity:

- inside **Learn**, the person acts as an educator operating authorized student learning;
- inside **Teach**, the same person is the learner and the product adapts around their professional growth;
- inside standalone **Coach**, the same person may develop speaking, pronunciation and English proficiency without creating another account.

Product ownership stays separate while identity, evidence and governed entitlements remain interoperable through Core.

## Identity and access rule

A Learn educator must not sign up for Lurexa Teach again.

The same Core-owned identity may receive:

- Teach entitlement/activation without account recreation;
- full Coach educator benefit where policy permits;
- a purpose-scoped professional learner state in Teach that remains separate from Learn student-operation permissions.

A Teach learner does **not** automatically gain Learn Teacher Workspace access.

Learn Teacher Workspace access requires all three concerns to resolve successfully:

1. Learn Teacher product entitlement;
2. an active evidence-backed educator qualification covering the requested subject/level scope;
3. explicit teaching authorization for the organization/program/course/scope being operated.

English proficiency alone is not teaching qualification. Governance role alone is not teaching qualification.

Conceptually:

```text
canOperateLearnTeacherWorkspace =
  hasLearnTeacherEntitlement
  && hasEligibleEducatorQualification(requestedScope)
  && hasTeachingAuthorization(organization, courseOrProgram, requestedScope)
```

Core owns this decision. Mind may identify readiness/gaps but cannot grant access.

## Product ownership matrix

| Capability | Learn Teacher Workspace | Lurexa Teach |
| --- | --- | --- |
| Course/class operations | Owns | Does not own |
| Student roster/enrollment | Owns | Does not own |
| Student invitations/access | Owns | Does not own |
| Assignments/submissions | Owns | Does not own |
| Grades/assessment operations | Owns | Does not own |
| Student progress | Owns | Does not own |
| Student Learner Pulse | Authorized instructional view | Does not browse |
| Student Memory Thread | Authorized instructional view where implemented/purpose-valid | Does not browse |
| Student interventions/feedback | Owns | Does not own |
| Teacher professional courses | Links/bridges only | Owns |
| Teacher competency profile | Contextual link only | Owns |
| Professional goals/pathways | Does not own | Owns |
| Reflection/portfolio | May generate source practice evidence | Owns professional workflow |
| Credentials/certifications | Does not own | Owns |
| Professional community | Links/bridges only | Owns |
| Teacher-growth recommendations | Links/bridges only | Owns |
| Educator qualification preparation | Consumes governed outcome | Owns learning pathway/evidence contribution |
| Teaching authorization | Enforces Core decision | Does not grant |
| Educator English development | May link | Owns pathway; may bridge to standalone Coach |

## Repository mapping

```text
apps/learn-web/app/teacher
└── Lurexa Learn Teacher Workspace
    ├── dashboard
    ├── courses
    ├── students
    ├── insights
    ├── assessment operations
    └── enrollment / intervention / support workflows

apps/teach-web
└── Lurexa Teach
    ├── dashboard
    ├── professional learning courses
    ├── growth plan
    ├── professional assessment/evidence
    ├── credentials
    ├── reflection
    └── educator community

apps/coach-web
└── Lurexa Coach
    ├── learner speaking/pronunciation practice
    └── educator-professional English practice
```

No operational student-management route should be introduced under `apps/teach-web`. Learn compatibility `/coach` routes must not become canonical Coach ownership again.

## Authorization contract

Delegated access to another person's learner context is an operational Learn capability.

### Current governed delegated path

```text
requesting product: learn
purpose: teacher_instructional_support
actor: authenticated educator
subject: student member in same organization
organization: explicit and required
course: explicit and required
access decision:
  Learn Teacher entitlement
  + eligible educator qualification for requested course scope
  + exact teaching authorization
```

Core owns and evaluates this decision. Organization owner/admin/teacher affiliation may establish governance/relationship context but **must not substitute for qualification and exact teaching authorization**.

Lurexa Teach receives no delegated student-context entitlement.

A Teach professional-growth projection uses the educator's own professional evidence/model scope, not student-context browsing disguised as professional development.

## Qualification-scoped teaching

Qualification is multidimensional and may include:

- subject/domain;
- CEFR/curriculum range;
- language proficiency;
- teaching methodology;
- lesson planning;
- activity/assessment design;
- instructional practice;
- required credentials and provenance/validity.

If a person is qualified for A1–B1 and requests B2 teaching scope, B2 remains closed until the qualification gap is addressed and the broader scope is separately authorized.

Mind may explain the gap and recommend Teach/Coach development. Core may expand qualification only through the approved governance lifecycle; teaching authorization remains a separate decision.

## Lurexa Teach curriculum responsibility

Teach is a full educator-learning product rather than a methodology library. Its professional curriculum integrates:

- English knowledge and classroom English/CEFR development;
- language-teaching methodology;
- lesson planning;
- activity and learning-experience creation;
- assessment literacy;
- instructional practice/reflection;
- digital/AI teaching competence;
- professional portfolio and credentials.

Teach may bridge into standalone Coach for language/pronunciation development and, in the future, standalone Studio for governed creation workflows. Those products retain their own ownership.

## Signature Experience contract

### Learn Teacher Workspace

Student-level Signature primitives may appear only when they support an instructional decision and Core authorizes the educator. These remain `consumer: "learn"` experiences.

### Lurexa Teach

Teach may use the shared Signature grammar only around the educator's own professional growth—for example professional competency Pulse, growth path, professional evidence/reflection thread, approved growth explanation and bridges into Coach.

Teach must not blindly reuse student-oriented views/language.

## Data-model separation

A person can simultaneously have:

1. one canonical Lurexa identity;
2. product entitlements;
3. educator qualification scopes;
4. institution/program/course teaching authorizations;
5. an educator-operational role inside Learn;
6. their own professional learner state in Teach.

These must not collapse into one undifferentiated record.

### Prohibited inference

A student's weakness must never become a weakness on the teacher's professional learner model merely because the teacher taught that student.

```text
Student repeatedly struggles with past tense
-X→ teacher is weak at teaching past tense
```

That professional conclusion requires separate educator-practice evidence.

## Cross-product professional evidence loop

```text
Learn Teacher Workspace
  ↓ authorized teaching-practice evidence
Core professional-evidence boundary
  ↓ authorized evidence
Mind professional interpretation
  ↓ minimized professional context
Teach
  ↓ professional learning / reflection
  ↓ optional standalone Coach / future Studio bridge
Core
  ↓ updated professional evidence
Teach adapts future growth / qualification-readiness path
```

Student data must be minimized/aggregated or otherwise specifically governed before contributing to educator-development evidence.

## Design inheritance

The Learn Teacher Workspace is **not Lurexa Teach embedded inside Learn**. It inherits Learn identity/tokens/navigation and shared Lurexa accessibility/Signature grammar, with operational density appropriate to its job.

### Learn Teacher Workspace personality

**Instructional, calm, efficient, evidence-aware.**

- Learn identity remains primary;
- class/course/student context stays visible;
- learner status should not collapse into punitive scoring;
- recommendations should be actionable and evidence-conscious;
- Teach transitions must look like cross-product professional-growth handoffs.

### Lurexa Teach personality

**Professional, developmental, reflective, aspirational.**

- professional-learning hierarchy;
- competencies, reflection, evidence, credentials and growth pathways;
- no classroom roster/gradebook ownership;
- no student-management navigation.

## Non-negotiable boundary summary

- Learn owns student learning operations.
- Teach owns educator professional growth.
- Coach owns speaking/pronunciation/fluency practice as a standalone product.
- Core owns entitlement, qualification, teaching authorization and trusted records.
- Mind may interpret readiness but cannot grant authority.
- Student and educator-professional evidence remain purpose-separated.

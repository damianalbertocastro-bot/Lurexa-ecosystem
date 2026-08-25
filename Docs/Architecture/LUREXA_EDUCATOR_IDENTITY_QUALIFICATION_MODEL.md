# Lurexa Educator Identity, Qualification & Entitlement Model

Status: **Normative architecture contract**  
Owner: Lurexa Learning Technologies  
Date: 2026-08-25  
Authority: subordinate to `Docs/00-Lurexa-Bible.md`; authoritative for educator identity, product access, qualification scope and teaching authorization

## Core principle

> **One Lurexa identity. Multiple product roles. Evidence-backed educator qualification. Explicit teaching authorization.**

A person must not create separate accounts for Lurexa Learn, Lurexa Teach or Lurexa Coach.

The same Lurexa identity can simultaneously be:

- an educator operating student learning in the **Lurexa Learn Teacher Workspace**;
- a learner developing professionally in **Lurexa Teach**;
- a user of **Lurexa Coach** for speaking, pronunciation and language development;
- a learner in other Lurexa experiences when entitled.

Product access, professional-learning state and teaching authority are distinct concepts and must not be collapsed into one role flag.

## Four separate concepts

### 1. Identity

Lurexa Core owns one canonical user identity across the ecosystem.

No product-specific sign-up should create a second account for an existing person.

### 2. Product entitlement

Entitlement answers:

> **Which Lurexa products may this identity enter and use?**

Examples:

- a verified/authorized Learn educator receives access to Lurexa Teach without creating another account;
- an educator benefit may grant full Lurexa Coach access;
- a Teach learner may have Teach and Coach access while still having no permission to operate student learning in Learn.

Entitlement does not imply teaching authority.

### 3. Educator qualification scope

Qualification answers:

> **What is this person currently qualified to teach, based on trusted evidence?**

Qualification must be evidence-backed and multidimensional. English proficiency alone is insufficient.

A qualification scope may include:

- subject/domain;
- CEFR or curriculum level range;
- language proficiency evidence;
- methodology/pedagogy competencies;
- lesson-planning competencies;
- activity and assessment design competencies;
- classroom/instructional practice evidence;
- required certifications or institution-specific conditions;
- validity/version/provenance.

Example:

```text
English educator qualification
subject: English
qualified learner levels: A1–B1
language proficiency: B2 demonstrated
methodology competencies: satisfied
lesson-planning competencies: satisfied
assessment/activity-design competencies: satisfied
status: qualified
```

A learner who masters B2 English is not automatically qualified to teach B2. Subject-matter proficiency is one input to qualification, not the entire qualification decision.

### 4. Teaching authorization

Authorization answers:

> **Is this qualified educator allowed to operate student learning in this institution/program/course?**

Core owns this authorization boundary.

Learn Teacher Workspace access requires both:

1. an eligible educator qualification scope; and
2. explicit platform/institution/program/course authorization.

An institution may authorize a qualified educator only for a subset of their qualification scope.

## Product relationship

### Existing Learn educator → Teach

A person already authorized as a teacher in Learn:

- keeps the same Lurexa identity;
- does not sign up for Teach again;
- receives Teach access automatically or an immediate activation/opt-in path without account recreation;
- begins a professional learner state in Teach under the same identity;
- can receive personalized professional-development recommendations from Mind using authorized professional evidence.

Teach may ask onboarding questions specific to professional goals, but those are not a new account registration.

### Existing Learn educator → Coach

Being a verified/authorized Lurexa educator includes **full access to Lurexa Coach** as an educator benefit, subject to platform commercial policy and abuse/safety limits.

Coach should support both:

- the educator's own English development; and
- teacher-relevant speaking/pronunciation practice where pedagogically appropriate.

Coach does not grant teaching authorization.

### Teach learner → Learn Teacher Workspace

A Teach learner is not automatically a Learn teacher.

Teach is allowed to prepare the learner toward educator qualification, but Learn Teacher Workspace remains unavailable until Core records an eligible qualification scope and an explicit teaching authorization.

The intended progression is:

```text
Lurexa Teach learner
  ↓ develops English + pedagogy + planning + instructional competencies
Core trusted professional evidence
  ↓
Mind evaluates readiness against governed qualification requirements
  ↓
qualification candidate / recommendation
  ↓ governed approval or approved automated rule where permitted
Core educator qualification scope
  ↓
institution/platform teaching authorization
  ↓
Lurexa Learn Teacher Workspace access for the authorized scope
```

## Level-scoped teaching authority

Teaching scope should be explicit rather than represented by a global `teacher = true` flag.

Example:

```text
qualifiedToTeach:
  subject: English
  levels: [A1, A2, B1]
```

If the educator wants to teach above the currently qualified range, Lurexa must not silently expand access.

Instead, Mind should identify the qualification gap and recommend a development path in Teach.

Example:

```text
Current qualification: A1–B1
Requested teaching scope: B2
Gap:
- B2/C1 language-production evidence incomplete
- advanced grammar instruction competency incomplete
- B2 lesson-planning competency incomplete

Recommended path:
Lurexa Teach → B2 educator readiness pathway
Lurexa Coach → targeted spoken-English development
```

After the required evidence is satisfied, Core may update the qualification scope according to the approved governance policy. A separate institution/platform authorization is still required before the educator can operate B2 learners.

## Lurexa Teach learning model

Lurexa Teach is a complete professional learning experience, not only a methodology library.

Its educator curriculum should integrate at least these domains:

1. **English knowledge and proficiency**
   - CEFR-aligned language development;
   - grammar, vocabulary, pronunciation, fluency, receptive and productive skills;
   - professional/classroom English;
   - targeted Coach practice where useful.

2. **Language-teaching methodology**
   - communicative teaching;
   - task-based teaching;
   - scaffolding;
   - differentiation;
   - formative assessment;
   - feedback and correction;
   - teaching pronunciation, grammar, vocabulary and skills;
   - evidence-informed learning science.

3. **Lesson planning**
   - learning objectives;
   - sequencing;
   - pacing;
   - lesson architecture;
   - differentiation and adaptation;
   - assessment alignment;
   - asynchronous + synchronous planning.

4. **Activity and learning-experience creation**
   - speaking/listening/reading/writing tasks;
   - vocabulary and grammar practice;
   - phonetics/pronunciation activities;
   - project and creative tasks;
   - assessment item design;
   - AI-assisted creation through governed Studio/Mind capabilities where appropriate.

5. **Assessment literacy**
   - validity and alignment;
   - formative/summative assessment;
   - rubric use;
   - CEFR-informed judgment;
   - feedback and intervention decisions.

6. **Instructional practice and reflection**
   - teaching-practice evidence;
   - classroom/lesson reflection;
   - observed or simulated practice;
   - professional portfolio;
   - improvement cycles.

7. **Digital/AI teaching competence**
   - responsible AI use;
   - LMS practice;
   - adaptive-learning interpretation;
   - learner-data privacy;
   - human oversight.

Teach may use Lurexa Learn learner-facing curriculum or Coach experiences as part of an educator's own development, but those experiences remain product-owned by Learn/Coach and are entered through governed product entitlements/bridges.

## Professional Learner Model

The educator's professional growth must have its own governed professional evidence scope under the same canonical identity.

It may represent:

- professional goals;
- English proficiency for teaching;
- methodology competencies;
- planning competencies;
- activity-design competencies;
- assessment literacy;
- observed/simulated teaching practice;
- reflection evidence;
- credentials;
- educator qualification readiness.

It must not become an ungoverned copy of student data.

## Qualification recommendation policy

Mind may:

- identify readiness signals;
- identify missing competencies;
- recommend Teach pathways;
- recommend Coach practice;
- explain why a requested teaching level is not yet supported;
- generate a qualification-readiness candidate from authorized evidence.

Mind must not independently grant authoritative teaching permission.

Core owns the trusted qualification state and authorization decision under approved policy.

## UX rules

### Learn educator opening Teach

Show:

> **Continue your professional growth in Lurexa Teach**

Do not show a new-account sign-up flow.

### Teach learner not yet qualified to teach

Show a development state such as:

> **Preparing to teach**

and a transparent readiness path rather than a disabled unexplained Teacher Workspace link.

### Teach learner qualified but not institution-authorized

Show:

> **Qualified for A1–B1. Teaching access requires an institution or platform authorization.**

### Educator requesting a higher teaching level

Show the missing competencies and recommended Teach/Coach path. Do not present the restriction as punishment or a generic access error.

## Engineering requirements

Core should eventually expose separate trusted contracts for:

- canonical identity;
- product entitlements;
- educator qualification scope;
- institutional/program/course teaching authorization;
- professional evidence;
- qualification-readiness projections.

Avoid a single overloaded role such as:

```text
teacher: true
```

as the sole basis for ecosystem access.

A future authorization check should conceptually evaluate:

```text
canOperateLearnTeacherWorkspace =
  hasLearnTeacherEntitlement
  && hasEligibleEducatorQualification(requestedScope)
  && hasTeachingAuthorization(organization, program/course, requestedScope)
```

## Guardrails

1. One person must not need duplicate product accounts.
2. Teach access does not imply Learn Teacher Workspace access.
3. Coach access does not imply teaching qualification.
4. English proficiency alone does not imply pedagogy competence.
5. Professional-development completion alone does not imply institutional authorization.
6. Qualification scope must be explainable and evidence-backed.
7. Higher-level teaching access must fail closed until qualification and authorization are satisfied.
8. Student weaknesses must not be copied into educator qualification records without separately governed teaching-practice evidence.
9. Institution-specific restrictions may narrow, but must not silently broaden, Core qualification scope.
10. Product entitlement, qualification and authorization must remain auditable as separate decisions.

## End-state

The ecosystem should support this natural lifecycle:

```text
Learner in Teach
→ develops English + teaching expertise
→ becomes qualified for a defined teaching scope
→ is authorized by an institution/platform
→ operates students in Learn Teacher Workspace
→ automatically retains Teach for ongoing growth
→ receives full Coach access as an educator benefit
→ expands qualification through evidence-backed Teach + Coach pathways
```

The result is one continuous educator relationship without weakening the Learn/Teach product boundary.
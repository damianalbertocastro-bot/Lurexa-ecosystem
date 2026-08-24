# Lurexa Teach MVP Architecture

Status: MVP implementation contract
Canonical product definition: `Docs/Product/LUREXA_TEACH_PRODUCT_DEFINITION.md`

## Product goal

Turn Lurexa Teach into a persistent professional-learning and teacher-formation platform where practicing educators and teachers-to-be can develop academic knowledge, pedagogical methodology, professional competencies, teaching practice, evidence, credentials and professional identity with coordinated AI and human support.

## Product boundary

Lurexa Learn owns student/teacher operational learning workflows: dashboards, classes, assignments, lessons, learner progress and learning management.

Lurexa Teach owns educator formation and professional growth: methodology learning, teacher CEFR/proficiency development where relevant, academic/subject development, professional courses, guided teaching practice, training/certification, professional evidence, educator community and peer collaboration.

> **Lurexa Learn is where teachers operate and support student learning. Lurexa Teach is where practicing and future teachers learn, practice, develop, and grow as educators.**

## Primary educator pathways

### Teacher Formation Pathway

For aspiring teachers / teachers-to-be. It may include methodology, subject knowledge, lesson and unit planning, assessment, classroom management, educational technology, inclusive practice, teaching simulations, microteaching, reflection and practicum preparation.

### Practicing Educator Growth Pathway

For active educators. It may include subject and academic development, English/CEFR growth where relevant, advanced methodology, assessment, curriculum design, technology/AI literacy, specialization, leadership, evidence, credentials and continuing professional growth.

The pathways may share courses, competencies, evidence types, community, mentors and Mind capabilities while preserving pathway-appropriate requirements.

## Supported professional-learning model

Teach must not operate as a passive course catalog. Programs may combine:

- structured learning pathways;
- adaptive recommendations through Lurexa Mind;
- AI tutoring, coaching, simulation, rehearsal and feedback;
- human instructors, mentors, reviewers or coaches;
- peer/community learning;
- guided practice and microteaching;
- evidence submission and review;
- reflection;
- formative/summative assessment;
- professional credentials.

AI supports but does not replace human mentorship, supervised practice, expert review or high-stakes professional judgment.

## MVP capabilities

1. Authentication
   - Reuse shared Lurexa authentication.
   - Educators use one Lurexa identity across Learn, Teach and entitled Campus experiences.

2. Persistent educator-development profile
   - Add educator stage/pathway (`aspiring`, `pre_service`, `practicing`, or later governed stages).
   - Self-reported English CEFR level and goals may support personalization.
   - `verifiedCefrLevel` remains separate trusted Core state for credential requirements that claim verified CEFR attainment.
   - Methodology competencies, academic/subject-development goals, teaching-practice competencies, interests and professional contribution belong to the educator-development model.

3. Professional course/content model
   - Courses, modules and learning activities.
   - Pathway applicability: Teacher Formation, Practicing Educator Growth, or both.
   - Competency targets and evidence requirements.
   - CEFR/proficiency, methodology, academic/subject and teaching-practice tracks.
   - Program-level declaration of available AI and human support.

4. Enrollment and progress
   - Per-educator enrollment.
   - Module/course progress and timestamps.
   - Product progress supports learning UX; credential-relevant high-stakes claims must not rely on completion alone.

5. Community
   - Professional posts, circles and peer exchange.
   - Contributions are attributed to educators.
   - Community activity becomes professional evidence only through an explicit governed evidence flow.

6. Practice and evidence submissions
   - Artifact, reflection, lesson-plan, teaching-simulation, practice, practicum (where authorized), and peer-contribution evidence.
   - States: `draft`, `submitted`, `verified`, `rejected`.
   - Educators may create draft/submitted evidence only.
   - Reviewer identity, notes, review timestamps and verification state are trusted server fields.

7. Human support
   - Programs may assign or expose instructors, mentors, reviewers, coaches, office hours or practicum supervisors.
   - Human-support availability must be explicit to the educator.
   - High-stakes professional verification remains human/trusted-system governed unless a later policy explicitly permits another model.

8. Credentials
   - Rule-based requirements.
   - Awards are created only by trusted server-side Core logic.
   - Award IDs are deterministic (`userId_credentialId`) to keep reconciliation idempotent.
   - Verified evidence and trusted CEFR state are distinguished from self-reported/product state.
   - Completion, competency and certification must remain distinct claims.

9. Lurexa Mind support
   - Recommendations interpret authorized educator state.
   - Mind may support methodology tutoring, academic explanation, simulation, lesson-plan critique, reflective questioning, practice feedback and professional-growth planning.
   - Persisted recommendations are trusted server-created records.
   - Mind does not verify evidence, grant credentials or own authoritative persistence.

## Trusted professional-growth vertical slice

```text
Educator learns / practices
  ↓
Teach produces product progress and candidate evidence
  ↓
Core stores submitted evidence
  ↓
Trusted reviewer / mentor where required
  ↓ verify / reject + reviewer note
Core records review provenance
  ↓
Credential reconciliation
  ↓
Create any newly eligible deterministic credential awards
  ↓
Lurexa Mind next-step interpretation
  ↓
Core persists recommendation
  ↓
Teach dashboard / pathway / credential wallet / growth experience
```

### Reviewer authorization

- Review endpoints authenticate Firebase ID tokens with Firebase Admin.
- Reviewer role must satisfy the relevant trusted policy; current MVP uses `admin` or `super_admin`.
- Reviewers cannot verify their own evidence.
- Reviewer notes are required for auditability.
- Future mentor/instructor roles require explicit authorization contracts before they can verify trusted evidence.

### Server boundary

The trusted workflow is implemented in `TeachReviewServerService` and exposed narrowly through `/api/teach/review`.

The client may request a review operation, but it cannot write verification fields, credential awards, verified CEFR state or new recommendation records directly.

### Reconciliation behavior

After evidence is verified, the server reloads the educator profile, enrollments, evidence, credential definitions and existing awards. It evaluates each credential, creates only missing eligible awards, then persists the next recommendation.

Rejected evidence produces a persisted revision recommendation using the reviewer note as rationale.

## Firestore collections

- `educatorProfiles/{userId}`
- `teachCourses/{courseId}`
- `teachEnrollments/{enrollmentId}`
- `teachCommunityPosts/{postId}`
- `teachEvidence/{evidenceId}`
- `teachCredentialDefinitions/{credentialId}`
- `teachCredentialAwards/{awardId}`
- `teachRecommendations/{recommendationId}`

New educator-stage, pathway, mentor/support and methodology-competency fields should extend existing contracts deliberately rather than create a second educator profile model.

## Trust rules

- Every educator-owned document stores `userId`.
- `verifiedCefrLevel` cannot be written by the educator client.
- Evidence verification metadata cannot be written by the educator client.
- Credential awards cannot be created/updated/deleted by product clients.
- Recommendation creation remains server-only; educators may only update supported recommendation status fields.
- Course/program authoring remains trusted/server-only.
- Product UI never calls an AI/model provider directly for persistent professional intelligence.
- AI-generated feedback must not be represented as verified professional competency.

## Current trust limitation

Course progress/completion is still educator-owned product state in this MVP. It is appropriate for learning UX but should not become the sole basis for an externally meaningful credential. Current competency credentials use verified professional evidence as the trust gate; CEFR credentials additionally require `verifiedCefrLevel`.

If course completion, practicum performance or teaching simulation becomes a high-stakes claim, migrate the credential-relevant evidence into a trusted Core server record before relying on it independently.

## Current implementation state

Implemented foundation:

1. Domain types and Firestore service layer.
2. Authentication and educator-profile bootstrap.
3. Persisted dashboard/profile data.
4. Course enrollment and progress.
5. Evidence submission.
6. Community persistence.
7. Trusted evidence-review server pipeline.
8. Credential reconciliation and deterministic awards.
9. Persisted rule-based Lurexa Mind recommendations.
10. Firestore security rules and required query indexes.

Required product-alignment work:

1. Add educator stage/pathway to the educator-development contract.
2. Add Teacher Formation and Practicing Educator Growth pathway metadata.
3. Define methodology/academic competency taxonomy.
4. Extend course/program definitions with AI + human support metadata.
5. Add teaching-practice/simulation evidence types.
6. Define mentor/instructor roles and trusted workflows where needed.
7. Make recommendations pathway-aware.
8. Preserve clear distinction among completion, demonstrated competency and verified credentials.

Still required before production use:

1. Run typecheck, lint and build for Teach plus backend/types checks.
2. Run Firebase Emulator security-rule tests.
3. Verify Firebase Admin environment configuration and reviewer custom claims.
4. Add trusted CEFR assessment/update workflow before issuing CEFR credentials in production.

## Definition of MVP

A practicing educator or teacher-to-be can sign in, enter an appropriate professional pathway, maintain a persistent educator-development profile, enroll in structured professional learning, record progress, practice, submit evidence, participate in a professional community, receive AI-guided support, access declared human support where available, have evidence reviewed through trusted workflows, receive qualifying credential awards, and receive a persisted next-step recommendation based on authorized Teach state.

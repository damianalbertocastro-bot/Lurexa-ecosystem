# Lurexa Teach MVP Architecture

Status: MVP implementation contract

## Product goal

Turn Lurexa Teach from a static professional-development experience into a persistent educator platform where progress, evidence, community participation, credentials and recommendations are saved and interpreted over time.

## Product boundary

Lurexa Learn owns student/teacher operational learning workflows: dashboards, classes, assignments, lessons, learner progress and learning management.

Lurexa Teach owns educator professional growth: teacher CEFR/proficiency development, professional courses, training/certification, professional evidence, teacher community and peer collaboration.

## MVP capabilities

1. Authentication
   - Reuse shared Lurexa authentication.
   - Teachers use one Lurexa identity across Learn and Teach.

2. Persistent educator profile
   - Self-reported English CEFR level and goals support personalization.
   - `verifiedCefrLevel` is separate trusted Core state and is required for credential requirements that claim verified CEFR attainment.
   - Teaching-practice competencies, interests, goals and professional contribution remain part of the educator profile.

3. Professional course/content model
   - Courses, modules and learning activities.
   - Competency targets and evidence requirements.
   - CEFR/proficiency and teaching-practice tracks.

4. Enrollment and progress
   - Per-educator enrollment.
   - Module/course progress and timestamps.
   - Product progress supports learning UX; credential-relevant high-stakes claims must not rely on completion alone.

5. Community
   - Professional posts, circles and peer exchange.
   - Contributions are attributed to educators.
   - Community activity becomes professional evidence only through an explicit evidence flow.

6. Evidence submissions
   - Artifact, reflection, practice and peer-contribution evidence.
   - States: `draft`, `submitted`, `verified`, `rejected`.
   - Educators may create draft/submitted evidence only.
   - Reviewer identity, notes, review timestamps and verification state are trusted server fields.

7. Credentials
   - Rule-based requirements.
   - Awards are created only by trusted server-side Core logic.
   - Award IDs are deterministic (`userId_credentialId`) to keep reconciliation idempotent.
   - Verified evidence and trusted CEFR state are distinguished from self-reported/product state.

8. Lurexa Mind recommendations
   - Recommendations interpret authorized educator state.
   - Persisted recommendations are trusted server-created records.
   - Mind does not verify evidence, grant credentials or own authoritative persistence.

## Trusted professional-growth vertical slice

```text
Educator submits evidence
  ↓
Core stores submitted evidence
  ↓
Trusted reviewer (admin/super_admin)
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
Teach dashboard / credential wallet / growth experience
```

### Reviewer authorization

- Review endpoints authenticate Firebase ID tokens with Firebase Admin.
- Reviewer role must be `admin` or `super_admin`.
- Reviewers cannot verify their own evidence.
- Reviewer notes are required for auditability.

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

## Trust rules

- Every educator-owned document stores `userId`.
- `verifiedCefrLevel` cannot be written by the educator client.
- Evidence verification metadata cannot be written by the educator client.
- Credential awards cannot be created/updated/deleted by product clients.
- Recommendation creation remains server-only; educators may only update supported recommendation status fields.
- Course authoring remains trusted/server-only.
- Product UI never calls an AI/model provider directly for persistent professional intelligence.

## Current trust limitation

Course progress/completion is still educator-owned product state in this MVP. It is appropriate for learning UX but should not become the sole basis for an externally meaningful credential. Current competency credentials use verified professional evidence as the trust gate; CEFR credentials additionally require `verifiedCefrLevel`.

If course completion itself becomes a high-stakes claim, migrate credential-relevant completion/assessment into a trusted Core server record before relying on it independently.

## MVP implementation state

Implemented:

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

Still required before merge/production use:

1. Regenerate workspace lockfile.
2. Run typecheck, lint and build for Teach plus backend/types checks.
3. Run Firebase Emulator security-rule tests.
4. Verify Firebase Admin environment configuration and reviewer custom claims.
5. Add trusted CEFR assessment/update workflow before issuing CEFR credentials in production.

## Definition of MVP

A teacher can sign in, maintain a persistent growth profile, enroll in professional learning, record progress, submit evidence, participate in a professional community, have evidence reviewed by an authorized reviewer, receive qualifying trusted credential awards, and receive a persisted next-step recommendation based on authorized Teach state.

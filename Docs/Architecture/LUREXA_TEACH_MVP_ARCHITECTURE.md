# Lurexa Teach MVP Architecture

Status: MVP implementation contract

## Product goal

Turn Lurexa Teach into a persistent educator platform where professional learning, evidence, trusted assessment, credentials, community participation and recommendations evolve over time without confusing self-reported growth with verified capability.

## Product boundary

Lurexa Learn owns student/teacher operational learning workflows: dashboards, classes, assignments, lessons, learner progress and learning management.

Lurexa Teach owns educator professional growth: teacher CEFR/proficiency development, professional courses, training/certification, trusted professional evidence, teacher community, peer collaboration and educator credentials.

## Trust model

Teach distinguishes three kinds of state:

1. **Educator-owned product state** — goals, interests, self-reported CEFR, learning progress and draft/submitted evidence.
2. **Trusted Core state** — verified evidence, verified CEFR, verified competencies, credential awards, review provenance and assessment results.
3. **Mind interpretation** — next-step recommendations derived from authorized state and persisted through Core-governed boundaries.

Self-reported state can personalize the experience. It cannot independently create a trustworthy external claim.

## Trusted evidence-review vertical slice

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
Create missing eligible deterministic credential awards
  ↓
Create safe public verification records
  ↓
Lurexa Mind next-step interpretation
  ↓
Core persists recommendation
```

Reviewers authenticate through Firebase Admin, cannot verify their own evidence, and must provide an audit note. Educator clients cannot write reviewer metadata, verification timestamps, credential awards or recommendation creation state.

## Trusted CEFR and competency assessment

Teach now supports a separate assessment workflow for claims that require independent verification.

```text
Educator requests assessment
  ↓
teachAssessments/{assessmentId} = requested
  ↓
Trusted assessor (admin/super_admin)
  ↓
Assessment performed against declared rubric
  ↓
teachAssessmentResults/{assessmentId}
  ↓
Core updates educatorProfiles verified state
  ├── verifiedCefrLevel
  └── verifiedCompetencies[]
  ↓
Credential reconciliation
  ↓
Persisted Mind recommendation
```

### Assessment rules

- Educators may create their own assessment request but cannot complete or alter trusted assessment results.
- Assessors cannot verify their own assessment.
- A result must include an assessor summary and rubric version.
- `verifiedCefrLevel` is separate from self-reported `cefrLevel`.
- `verifiedCompetencies` are separate from educator-managed competency progress.
- Credential `cefr-level` requirements use `verifiedCefrLevel` only.
- Credential `competency-level` requirements use `verifiedCompetencies` only.
- Completing an assessment automatically reruns credential reconciliation and next-step recommendation persistence.

## Credential awards and public verification

Credential awards remain private trusted Core records in `teachCredentialAwards`.

When a credential is awarded, Core also writes a deliberately minimized public record to:

`teachPublicCredentials/{verificationCode}`

Public records contain only:

- verification code;
- credential ID/name/description;
- educator display name;
- issuer;
- awarded date;
- validity status.

They intentionally exclude:

- educator user ID;
- internal evidence IDs;
- reviewer/assessor identity;
- assessment notes;
- private profile fields.

The public verification page is `/verify/{verificationCode}`. Verification records are read through a server boundary rather than direct Firestore public access.

Verification codes are deterministic per educator + credential in the MVP, which keeps repeated reconciliation idempotent. Credential award document IDs are also deterministic (`userId_credentialId`).

## Firestore collections

- `educatorProfiles/{userId}`
- `teachCourses/{courseId}`
- `teachEnrollments/{enrollmentId}`
- `teachCommunityPosts/{postId}`
- `teachEvidence/{evidenceId}`
- `teachAssessments/{assessmentId}`
- `teachAssessmentResults/{assessmentId}`
- `teachCredentialDefinitions/{credentialId}`
- `teachCredentialAwards/{awardId}`
- `teachPublicCredentials/{verificationCode}`
- `teachRecommendations/{recommendationId}`

## Server boundaries

- `TeachReviewServerService` — evidence review, credential reconciliation, public credential publication and persisted recommendation refresh.
- `TeachAssessmentServerService` — trusted CEFR/competency assessment completion and verified educator-state updates.
- `/api/teach/review` — narrow authenticated reviewer API.
- `/api/teach/assessment` — narrow authenticated assessor API.
- `/api/teach/credentials/{verificationCode}` — safe public verification API.

Product UIs do not call model providers directly and do not create authoritative verification records.

## Current trust limitation

Course progress/completion remains educator-owned product state in the current MVP. It is useful for professional-learning UX but should not become the sole basis for a high-stakes external credential. Current competency credentials require verified evidence; verified CEFR and competency claims come from the trusted assessment flow.

If course completion or assessment performance itself becomes externally meaningful, migrate the relevant completion/score into a trusted server-generated Core record before allowing it to independently satisfy a credential requirement.

## Implementation state

Implemented:

1. Authentication and persistent educator profiles.
2. Professional course catalog, enrollment and progress.
3. Community persistence.
4. Professional evidence submission.
5. Trusted evidence review.
6. Trusted CEFR/competency assessment request and completion model.
7. Separate verified CEFR and verified competency state.
8. Credential reconciliation and deterministic award records.
9. Safe public credential verification records and verification page.
10. Persisted rule-based Lurexa Mind recommendations.
11. Firestore client trust restrictions and required query indexes.

Still required before production use:

1. Regenerate the workspace lockfile after Teach workspace changes.
2. Run Teach/backend/types typecheck, lint and build verification.
3. Add Firebase Emulator tests covering assessment requests, blocked trusted-field writes, public-record isolation and reviewer/assessor flows.
4. Configure Firebase Admin credentials and reviewer/assessor custom claims in deployment.
5. Formalize production CEFR and competency rubrics beyond the MVP rubric identifier.
6. Add credential revocation/expiry policy before credentials requiring renewal are introduced.

## Definition of the trusted Teach MVP

An educator can sign in, maintain a professional-growth profile, complete professional learning, submit evidence, request trusted assessment, receive independently verified CEFR/competency outcomes, earn qualifying credentials, share a privacy-minimized credential verification record, and receive a persisted next-step recommendation based on authorized professional state.

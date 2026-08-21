# Lurexa Teach MVP Architecture

Status: MVP implementation contract

## Product goal

Turn Lurexa Teach from a static professional-development experience into a persistent educator platform where progress, evidence, community participation and credentials are saved and interpreted over time.

## MVP capabilities

1. Authentication
   - Reuse shared Lurexa authentication.
   - Teachers use one Lurexa identity across Learn and Teach.
   - Product access is not a separate identity role.

2. Persistent educator profile
   - English CEFR level and proficiency goals.
   - Teaching-practice competency levels.
   - AI/digital teaching literacy.
   - Professional interests, goals and community contribution.

3. Professional course/content model
   - Courses, modules and learning activities.
   - Competency targets and evidence requirements.
   - CEFR/proficiency and teaching-practice tracks.

4. Enrollment and progress
   - Per-educator enrollment.
   - Module/course completion.
   - Progress percentage and timestamps.
   - Evidence-backed completion where required.

5. Community
   - Professional posts and discussions.
   - Circles/topics.
   - Contributions attributed to educators.
   - Community evidence may contribute to professional growth only when explicitly eligible.

6. Evidence submissions
   - Artifact/reflection/practice evidence.
   - Review state: draft, submitted, verified, rejected.
   - Evidence links to competencies and credential requirements.

7. Credentials
   - Rule-based requirements.
   - Award only when required learning/evidence conditions are satisfied.
   - Credential records remain persistent and verifiable.

8. Lurexa Mind recommendations
   - Recommendations read authorized educator evidence and progress.
   - Recommendations do not directly mutate trusted records.
   - Lurexa Core remains owner of persistence and authorization.

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

- Every user-owned document stores `userId`.
- Client writes may create/update personal progress and draft/submitted evidence only where security rules permit.
- Credential awards and verified evidence must eventually be server-authoritative.
- AI recommendations are advisory records; they cannot grant credentials or verify evidence.

## MVP implementation order

1. Domain types and Firestore service layer.
2. Authentication gate and educator-profile bootstrap.
3. Persisted dashboard/profile data.
4. Course enrollment and progress.
5. Evidence submission.
6. Community persistence.
7. Credential evaluation/award service.
8. Lurexa Mind recommendation generation.
9. Security rules, emulator tests and end-to-end validation.

## Definition of MVP

A teacher can sign in, maintain a persistent growth profile, enroll in a professional course, record progress, submit evidence, participate in a professional community, satisfy credential requirements, and receive personalized next-step recommendations based on authorized Teach evidence.

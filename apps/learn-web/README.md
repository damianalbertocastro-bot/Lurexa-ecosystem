# Lurexa Learn Web

The learner-facing Lurexa Learn application and the owner of the embedded Learn Teacher Workspace. It is the most mature product implementation on the shared Lurexa Core and Lurexa Mind architecture.

Its current repository maturity is **Verified MVP implementation**. That does not by itself claim external production deployment/operational readiness; see `Docs/Engineering/REPOSITORY_MATURITY_STATUS.md`.

## Current MVP path

A self-paced learner can:

1. create an account without an institution code;
2. choose an English-learning goal and either explicitly begin as a true beginner or complete a short start check;
3. receive a transparent, low-confidence A1 or early-A2 starter recommendation—not a CEFR certification;
4. enter the recommended **English A1 Foundations** or **English A2 Everyday Conversations** course;
5. complete data-driven lesson activities through the canonical `LessonRuntime`;
6. use model listening, recorded speaking and curriculum-constrained AI roleplay when those capabilities are authored into the lesson;
7. have trusted learning evidence saved through server-side Core boundaries;
8. receive prioritized next actions in this order: due retrieval → teacher recommendation → Lurexa Mind recommendation → normal curriculum continuation;
9. launch standalone Lurexa Coach through governed cross-product handoffs when speaking/pronunciation practice is appropriate.

Teacher/class-code enrollment remains available for institution-led learning. Learn Teacher Workspace lives under `app/teacher`; it is not Lurexa Teach.

## Run locally

From the repository root:

```bash
pnpm install --frozen-lockfile
pnpm --filter learn-web dev
```

Open `http://localhost:3001`.

## Required local and deployed environment

Copy the relevant non-secret development values from `packages/.env.example` into `.env.local`, and keep secrets only in local secret files or the deployment platform's encrypted environment-variable store.

The application needs:

- `NEXT_PUBLIC_FIREBASE_*` values for Firebase browser authentication;
- `FIREBASE_SERVICE_ACCOUNT_JSON` for trusted server-side Core operations;
- `FIREBASE_PROJECT_ID` when using the Firebase Emulator without a service account;
- `GEMINI_API_KEY` for server-owned Learn roleplay responses;
- Google Cloud Text-to-Speech enabled in the Firebase project's Google Cloud project for curriculum and pronunciation-model audio;
- `FIREBASE_STORAGE_BUCKET` for trusted spoken-evidence storage;
- optional `LUREXA_LEARN_TUTOR_MODEL` to override the approved Gemini tutor model;
- optional `LUREXA_LEARN_TTS_VOICE` to select the approved Google Cloud Text-to-Speech voice.

`GEMINI_API_KEY`, `FIREBASE_SERVICE_ACCOUNT_JSON`, and any other secret must remain server-only. Never expose them through `NEXT_PUBLIC_` variables or commit them to the repository.

For Google Cloud Text-to-Speech, enable the **Cloud Text-to-Speech API** in the same Google Cloud project used by Firebase. Grant the existing Firebase service account stored in `FIREBASE_SERVICE_ACCOUNT_JSON` the least-privilege **Cloud Text-to-Speech User** role (`roles/texttospeech.user`). Do not create or commit a second service-account file for audio.

For Vercel, configure server-only runtime values on the **lurexa-learn-web** project. Add them to Preview first, create a new Preview deployment, and complete the Learn runtime acceptance checks before promoting equivalent Production configuration. Changes require a new deployment before existing server functions see them.

### Runtime capability behavior

- If `GEMINI_API_KEY` is absent, authored AI roleplay enters an explicitly labeled deterministic fallback rather than pretending to be production AI.
- The generic legacy Learn AI Tutor prototype does not fabricate live responses; it remains contained until a governed Mind/server capability owns that experience.
- If Cloud Text-to-Speech is not enabled, its service-account role is missing, or the server credential is unavailable, curriculum and pronunciation-model audio return a configuration error rather than recording listening completion.
- If `FIREBASE_STORAGE_BUCKET` is absent, spoken-evidence upload fails safely rather than storing an untrusted or incomplete record.
- Recorded speaking is stored as evidence but is **not yet pronunciation-scored**.

## Routes

- `/signup` — independent or class-code account creation
- `/onboarding` — self-paced goal selection, optional start check and starter-course provisioning
- `/dashboard` — prioritized learner learning paths and next actions
- `/teacher/*` — Learn Teacher Workspace for authorized class/course/student operations
- `/coach` — compatibility launch into standalone Lurexa Coach
- `/learn/english-a1-foundations/a1-introduce-yourself` — first structured A1 lesson
- `/learn/english-a2-everyday-conversations/a2-make-a-plan` — early A2 conversation starter
- `/learn/a1-preview` — focused A1 experience preview

## Architecture rules

- `LessonRuntime` is the single reusable learner lesson renderer.
- Product UI does not write trusted learner records directly.
- Server route handlers authenticate requests and use trusted server capabilities for Core-owned persistence.
- Raw learning evidence, learner profiles and derived observations are server-only.
- Lurexa Mind consumes authorized evidence through purpose-scoped Core context rather than bypassing Core.
- Retrieval and teacher-return guidance use the same governed recommendation contract family as Mind recommendations.
- Completion, activity attempts, quiz attempts, roleplay turns and spoken recordings are evidence—not standalone mastery claims.
- Due retrieval requires fresh activity or assessment evidence before it can be closed.
- Learn may launch Coach, but it no longer owns canonical Coach UI/runtime pages.

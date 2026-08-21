# Lurexa Learn Web

The learner-facing Lurexa Learn application. It is the first production surface for the shared Lurexa Core and Lurexa Mind architecture.

## Current MVP path

A self-paced learner can:

1. create an account without an institution code;
2. choose an English-learning goal and either explicitly begin as a true beginner or complete a short start check;
3. receive a transparent, low-confidence A1 or early-A2 starter recommendation—not a CEFR certification;
4. enter the recommended **English A1 Foundations** or **English A2 Everyday Conversations** course;
5. complete data-driven lesson activities through the canonical `LessonRuntime`;
6. use model listening, recorded speaking and curriculum-constrained AI roleplay when those capabilities are authored into the lesson;
7. have trusted learning evidence saved through server-side Core boundaries;
8. receive prioritized next actions in this order: due retrieval → teacher recommendation → Lurexa Mind recommendation → normal curriculum continuation.

Teacher/class-code enrollment remains available for institution-led learning.

## Run locally

From the repository root:

```bash
pnpm install
pnpm --filter learn-web dev
```

Open `http://localhost:3000`.

## Required local and deployed environment

Copy the relevant non-secret development values from `packages/.env.example` into `.env.local`, and keep secrets only in local secret files or the deployment platform's encrypted environment-variable store.

The application needs:

- `NEXT_PUBLIC_FIREBASE_*` values for Firebase browser authentication;
- `FIREBASE_SERVICE_ACCOUNT_JSON` for trusted server-side Core operations;
- `FIREBASE_PROJECT_ID` when using the Firebase Emulator without a service account;
- `OPENAI_API_KEY` for production Learn tutor responses and curriculum TTS audio;
- `FIREBASE_STORAGE_BUCKET` for trusted spoken-evidence storage;
- optional `LUREXA_LEARN_TUTOR_MODEL` to override the approved default tutor model.

`OPENAI_API_KEY`, `FIREBASE_SERVICE_ACCOUNT_JSON`, and any other secret must remain server-only. Never expose them through `NEXT_PUBLIC_` variables or commit them to the repository.

For Vercel, configure `OPENAI_API_KEY` and `FIREBASE_STORAGE_BUCKET` on the **lurexa-learn-web** project for the environments that should support AI/audio. Changes to these values require a new deployment before existing server functions see them.

### Runtime capability behavior

- If `OPENAI_API_KEY` is absent, AI roleplay enters an explicitly labeled deterministic fallback and production curriculum TTS returns a configuration error; neither path pretends to be production AI.
- If `FIREBASE_STORAGE_BUCKET` is absent, spoken-evidence upload fails safely rather than storing an untrusted or incomplete record.
- Recorded speaking is stored as evidence but is **not yet pronunciation-scored**.

## Routes

- `/signup` — independent or class-code account creation
- `/onboarding` — self-paced goal selection, optional start check and starter-course provisioning
- `/dashboard` — prioritized learner learning paths and next actions
- `/learn/english-a1-foundations/a1-introduce-yourself` — first structured A1 lesson
- `/learn/english-a2-everyday-conversations/a2-make-a-plan` — early A2 conversation starter
- `/learn/a1-preview` — focused A1 experience preview

## Architecture rules

- `LessonRuntime` is the single reusable learner lesson renderer.
- Product UI does not write trusted learner records directly.
- Server route handlers authenticate requests and use Firebase Admin for Core-owned persistence.
- Raw learning evidence, learner profiles and derived observations are server-only.
- Lurexa Mind consumes authorized evidence through purpose-scoped Core context rather than bypassing Core.
- Retrieval and teacher-return guidance use the same `LearnerRecommendationAction` contract as Mind recommendations.
- Completion, activity attempts, quiz attempts, roleplay turns and spoken recordings are evidence—not standalone mastery claims.
- Due retrieval requires fresh activity or assessment evidence before it can be closed.

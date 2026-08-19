# Lurexa Learn Web

The learner-facing Lurexa Learn application. It is the first production surface for the shared Lurexa Core and Lurexa Mind architecture.

## Current MVP path

A self-paced learner can:

1. create an account without an institution code;
2. choose an English-learning goal and either explicitly begin as a true beginner or complete a short start check;
3. receive a transparent, low-confidence A1 or early-A2 starter recommendation—not a CEFR certification;
4. enter the recommended **English A1 Foundations** or **English A2 Everyday Conversations** course;
5. complete structured activity, quiz and Create & Apply work;
6. have trusted learning evidence saved through server-side Core boundaries.

Teacher/class-code enrollment remains available for institution-led learning.

## Run locally

From the repository root:

```bash
pnpm install
pnpm --filter learn-web dev
```

Open `http://localhost:3000`.

## Required local environment

Copy the relevant values from `packages/.env.example` into `.env.local`. The application needs:

- `NEXT_PUBLIC_FIREBASE_*` values for Firebase browser authentication;
- `FIREBASE_SERVICE_ACCOUNT_JSON` for trusted server-side Core operations;
- `FIREBASE_PROJECT_ID` when using the Firebase Emulator without a service account.

Never expose `FIREBASE_SERVICE_ACCOUNT_JSON` through a `NEXT_PUBLIC_` variable or commit it to the repository.

## Routes

- `/signup` — independent or class-code account creation
- `/onboarding` — self-paced goal selection, optional start check and starter-course provisioning
- `/dashboard` — learner learning paths
- `/learn/english-a1-foundations/a1-introduce-yourself` — first structured A1 lesson
- `/learn/english-a2-everyday-conversations/a2-make-a-plan` — early A2 conversation starter
- `/learn/a1-preview` — focused A1 experience preview

## Architecture rules

- Product UI does not write trusted learner records directly.
- Server route handlers authenticate requests and use Firebase Admin for Core-owned persistence.
- Raw learning evidence, learner profiles and derived observations are server-only.
- Completion, activity attempts and quiz attempts are evidence—not standalone mastery claims.

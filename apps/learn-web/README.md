# Lurexa Learn Web

The learner-facing Lurexa Learn application. It is the first production surface for the shared Lurexa Core and Lurexa Mind architecture.

## Current MVP path

A self-paced learner can:

1. create an account without an institution code;
2. choose an English-learning goal;
3. receive a transparent A1 starter recommendation based on choosing the beginner path;
4. enter the **English A1 Foundations** course;
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
- `/onboarding` — self-paced goal selection and A1 starter provisioning
- `/dashboard` — learner learning paths
- `/learn/english-a1-foundations/a1-introduce-yourself` — first structured A1 lesson
- `/learn/a1-preview` — focused A1 experience preview

## Architecture rules

- Product UI does not write trusted learner records directly.
- Server route handlers authenticate requests and use Firebase Admin for Core-owned persistence.
- Raw learning evidence, learner profiles and derived observations are server-only.
- Completion, activity attempts and quiz attempts are evidence—not standalone mastery claims.

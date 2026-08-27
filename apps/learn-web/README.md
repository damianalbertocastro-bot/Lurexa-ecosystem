# Lurexa Learn Web

Lurexa Learn is the structured learner-delivery product and the owner of the operational Teacher Workspace at `app/teacher`. It consumes shared Lurexa Core and Lurexa Mind capabilities without creating a separate learner truth.

## Current verified MVP path

A self-paced learner can:

1. create an account without an institution code;
2. choose an English-learning goal and either explicitly begin as a true beginner or complete a short start check;
3. receive a transparent starter recommendation rather than a CEFR certification claim;
4. enter the recommended governed English course;
5. complete data-driven lesson activities through the canonical `LessonRuntime`;
6. use model listening, recorded speaking and curriculum-constrained roleplay when those capabilities are authored into the lesson;
7. have trusted learning evidence saved through server-side Core boundaries;
8. receive prioritized next actions from retrieval, teacher guidance, Mind recommendations and curriculum continuation.

Teacher/class-code enrollment remains available for institution-led learning.

## Run locally

From the repository root:

```bash
pnpm install --frozen-lockfile
pnpm --filter learn-web dev
```

Open `http://localhost:3001`.

The canonical port contract lives in `packages/config/src/domains.ts`.

## Learn and Coach boundary

Lurexa Coach is now a standalone first-class product in `apps/coach-web` (`http://localhost:3005` locally; canonical production domain `coach.lurexa.org`). Learn may recommend or launch Coach through a governed Product Bridge. Learn compatibility routes such as `/coach` must redirect to the standalone product and must not regain canonical Coach UI/runtime ownership.

Learn's embedded AI learning/tutor capabilities are curriculum-support capabilities and are distinct from Coach's speaking/pronunciation/fluency product ownership. Prototype tutor UI must not present canned responses as live Mind-backed tutoring.

## Required local and deployed environment

Copy supported non-secret development values from `packages/.env.example` into the relevant ignored local environment file. Keep secrets only in local secret stores or the deployment platform's encrypted environment-variable store.

The application may require:

- `NEXT_PUBLIC_FIREBASE_*` for Firebase browser authentication;
- `FIREBASE_SERVICE_ACCOUNT_JSON` for trusted server-side Core operations;
- `FIREBASE_PROJECT_ID` when using Firebase emulators without a service account;
- `GEMINI_API_KEY` for approved server-owned Learn roleplay/tutor capabilities;
- Google Cloud Text-to-Speech for governed curriculum/model audio;
- `FIREBASE_STORAGE_BUCKET` for trusted spoken-evidence storage;
- optional approved model/voice overrides documented by the server capability.

Server credentials must never use `NEXT_PUBLIC_` names or be committed to the repository.

### Runtime capability behavior

- If required AI provider configuration is absent, the capability must fail safely or use an explicitly labeled deterministic fallback; it must not impersonate production AI.
- If Text-to-Speech configuration/authorization is unavailable, audio generation must return a configuration error rather than recording false completion.
- If trusted storage configuration is unavailable, spoken-evidence upload must fail safely.
- Recorded speaking evidence is not automatically a pronunciation/mastery score.

## Important routes/surfaces

- `/signup` — account creation
- `/onboarding` — learner goal/start-path onboarding
- `/dashboard` — learner learning path and recommendations
- `/teacher/*` — Learn Teacher Workspace for class/course/student operations
- `/coach` — compatibility handoff to standalone Coach
- `/marketplace` — contained future-concept status surface; no production commerce
- `/campus` — representative Campus shell prototype; not a live institution
- `/teacher/studio` — contained local Studio interaction prototype; not standalone Studio

## Architecture rules

- `LessonRuntime` is the reusable learner lesson renderer.
- Product UI does not write trusted learner records directly.
- Server route handlers authenticate requests and use trusted Core/server capabilities for authoritative persistence.
- Raw learning evidence, learner profiles and derived observations remain server-governed.
- Mind consumes authorized evidence/context rather than bypassing Core.
- Retrieval and teacher-return guidance use governed recommendation contracts.
- Completion, attempts, roleplay turns and recordings are evidence—not automatic mastery claims.
- Teacher Workspace belongs to Learn; Teach is educator professional development.
- Learn Teacher Insights are operational instructional insights, not the standalone Lurexa Insight product.
- Prototypes must comply with `Docs/Architecture/LUREXA_PROTOTYPE_CONTAINMENT.md`.

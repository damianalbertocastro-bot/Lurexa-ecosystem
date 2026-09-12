# Lurexa Ecosystem: Authoritative Environment Variable Matrix

**Document Version:** 1.0.0  
**Status:** Authoritative Architectural Standard  
**Governing Package:** `@lurexa/config` (`packages/config/src/environment.ts`)  

---

## 1. Overview & Classification Principles

The Lurexa ecosystem operates across multiple deployed surfaces (`web`, `learn-web`, `coach-web`, `teach-web`, `admin-portal`, `docs`, `insight-web`, `studio-web`). To safeguard learner privacy, maintain Core trust boundaries, and prevent accidental credential leakage, all environment variables follow strict architectural classifications:

1. **Public Client Variables (`NEXT_PUBLIC_*`):**
   - Inlined by Next.js at build time.
   - Strictly restricted to public client identifiers (e.g., Firebase web app client config, canonical product URLs, environment name).
   - **NEVER** contain service account keys, private secrets, or internal server tokens.
2. **Server-Only Variables:**
   - Evaluated exclusively in server runtimes (Node.js API routes, Cloudflare Worker backend functions).
   - Never exposed to browser bundles.
3. **Canonical Namespace Enforcement:**
   - Enforced by `scripts/verify-environment-contracts.mjs`.
   - Legacy aliases (e.g., generic `API_URL`, `APP_URL`, `NEXT_PUBLIC_API_URL`) are strictly forbidden.

---

## 2. Complete Environment Variable Matrix

| Variable Name | Classification | Purpose | Owning Surface | Local Dev | Preview | Production |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Product Public URLs** | | | | | | |
| `NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL` | Public Client | Root marketing & ecosystem entrypoint | All Apps | `http://localhost:3000` | Cloudflare URL | `https://lurexa.org` |
| `NEXT_PUBLIC_LUREXA_LEARN_URL` | Public Client | Learner web app URL | All Apps | `http://localhost:3001` | Cloudflare URL | `https://learn.lurexa.org` |
| `NEXT_PUBLIC_LUREXA_TEACHER_URL` | Public Client | Learn Teacher Workspace URL | All Apps | `http://localhost:3001/teacher` | Cloudflare URL | `https://learn.lurexa.org/teacher` |
| `NEXT_PUBLIC_LUREXA_COACH_URL` | Public Client | Standalone Coach speaking product URL | All Apps | `http://localhost:3002` | Cloudflare URL | `https://coach.lurexa.org` |
| `NEXT_PUBLIC_LUREXA_TEACH_URL` | Public Client | Educator professional growth product URL | All Apps | `http://localhost:3003` | Cloudflare URL | `https://teach.lurexa.org` |
| `NEXT_PUBLIC_LUREXA_ADMIN_URL` | Public Client | Institutional operations portal URL | All Apps | `http://localhost:3004` | Cloudflare URL | `https://admin.lurexa.org` |
| `NEXT_PUBLIC_LUREXA_DOCS_URL` | Public Client | Documentation & developer portal URL | All Apps | `http://localhost:3005` | Cloudflare URL | `https://docs.lurexa.org` |
| `NEXT_PUBLIC_LUREXA_STUDIO_URL` | Public Client | Knowledge Object authoring studio URL | All Apps | `http://localhost:3006` | Cloudflare URL | `https://studio.lurexa.org` |
| `NEXT_PUBLIC_LUREXA_INSIGHT_URL` | Public Client | Institutional analytics portal URL | All Apps | `http://localhost:3007` | Cloudflare URL | `https://insight.lurexa.org` |
| `NEXT_PUBLIC_LUREXA_CAMPUS_URL` | Public Client | Institutional orchestration shell URL | All Apps | `http://localhost:3000` | Cloudflare URL | `https://lurexa.org` |
| **Shared Firebase Client Configuration** | | | | | | |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public Client | Firebase project API key | All Apps | Required | Required | `AIzaSyCSmgwnKVgVjyuywl2IpbZ_YAJH56pBkB0` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Public Client | Firebase authentication domain | All Apps | Required | Required | `lurexa-app.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Public Client | Firebase project identifier | All Apps | Required | Required | `lurexa-app` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| Public Client | Cloud Storage bucket name | All Apps | Required | Required | `lurexa-app.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Public Client | Cloud Messaging sender ID | All Apps | Required | Required | `945367564620` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Public Client | Firebase Web App App ID | All Apps | Required | Required | `1:945367564620:web:c64a1f5b825e086c96cfe9` |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` | Public Client | Flag to route client auth to local emulator | Learn/Coach | `true` (when testing) | `false` | `false` |
| `NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT` | Public Client | Local auth emulator port | Learn/Coach | `9099` | Optional | N/A |
| `NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT` | Public Client | Local Firestore emulator port | Learn/Coach | `8080` | Optional | N/A |
| **Server & Admin Credentials** | | | | | | |
| `FIREBASE_PROJECT_ID` | Server Only | Server-side Firebase project ID | Backend / Apps | `lurexa-app` | `lurexa-app` | `lurexa-app` |
| `FIREBASE_STORAGE_BUCKET` | Server Only | Server-side Storage bucket | Backend / Apps | `lurexa-app.firebasestorage.app` | Required | `lurexa-app.firebasestorage.app` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Server Secret | Firebase Admin service account credential | Backend / Apps | Optional (ADC fallback) | Secret | Production Secret |
| `FIRESTORE_EMULATOR_HOST` | Server Only | Firestore emulator host for tests | Backend / Tests | `127.0.0.1:8080` | N/A | N/A |
| **AI & Speech Providers** | | | | | | |
| `GEMINI_API_KEY` | Server Secret | Gemini API token for Mind tutoring/roleplay | Backend / Apps | Optional (fallback active) | Secret | Production Secret |
| `LUREXA_LEARN_TUTOR_MODEL` | Server Config | Active Gemini model name | Backend | `gemini-1.5-flash` | `gemini-1.5-flash` | `gemini-1.5-flash` |
| `LUREXA_LEARN_TTS_VOICE` | Server Config | Canonical TTS voice identifier | Backend | `en-US-Journey-F` | `en-US-Journey-F` | `en-US-Journey-F` |
| **Platform Environment** | | | | | | |
| `NEXT_PUBLIC_APP_ENV` | Public Client | App environment (`development`/`production`)| All Apps | `development` | `preview` | `production` |
| `NODE_ENV` | Platform | Node runtime environment | All Apps | `development` | `production` | `production` |

---

## 3. Truthful Failure & Fallback Policy

1. **Missing Provider Credentials:** When `GEMINI_API_KEY` or speech provider credentials are omitted in development or CI, services must fail truthfully or utilize deterministic, explicitly labeled offline fallback responses (`provider: "deterministic_fallback"`). They must **never** fabricate fake production results or output silent audio masquerading as real speech.
2. **Security Isolation:** Any attempt to read `FIREBASE_SERVICE_ACCOUNT_JSON` from client-side code triggers an immediate build-time error.

# Lurexa Ecosystem: Project Current State Report

**Document Date:** August 28, 2026  
**Status:** Verified Operational Baseline & MVP Implementations  
**Authoritative Architectural Standard:** Lurexa Core & Mind Architecture  
**Repository Branch:** `changes` / `main`

---

## 1. Executive Summary & Core Mission

**Lurexa Learning Technologies** develops an AI-driven, multi-product EdTech ecosystem designed for adaptive language acquisition and instructional excellence. The platform's unifying principle is:

> **"One learner. One evolving model. Every Lurexa experience adapts around it."**

Lurexa moves beyond static courseware and siloed applications by maintaining an authoritative, privacy-governed **Single Learner Model** in **Lurexa Core**, dynamically interpreted by **Lurexa Mind**, and delivered across specialized sibling products.

The primary initial pedagogical and linguistic specialization focuses on **Dominican Spanish speakers learning English**, targeting naturalness, fluency, and intelligibility while addressing regional phonological interference (e.g., /s/-aspiration, liquid neutralization, initial s-cluster epenthesis) without forcing accent erasure.

---

## 2. Authoritative Architecture & Shared Layers

```text
Lurexa Learning Technologies
│
├── Shared Ecosystem Layers
│   ├── Lurexa Core   — Trusted records, identity, authorization, persistence, provenance, platform services
│   └── Lurexa Mind   — Storage-free AI interpretation, linguistic intelligence, adaptation, recommendations
│
├── Six Sibling Products
│   ├── Lurexa Learn   — Student/teacher learning delivery, LMS, assignments, class progress
│   ├── Lurexa Coach   — Standalone AI speaking, pronunciation, and spoken fluency product
│   ├── Lurexa Teach   — Educator professional development, CEFR growth, credentials, community
│   ├── Lurexa Admin   — Institutional administration, educator qualifications, roster management
│   ├── Lurexa Insight — Cohort/institutional analytics and longitudinal trends (Architecture stage)
│   └── Lurexa Studio  — Authoritative Knowledge Object authoring and catalog governance (Architecture stage)
│
├── Institutional Shell
│   └── Lurexa Campus  — Unified tenant orchestration shell (Representative Prototype stage)
│
└── Shared Signature Experience Layer
    ├── Learner Pulse           — Multi-dimensional learner momentum & balance projection
    ├── Adaptive Learning Path  — Real-time CEFR competency & Knowledge Object recommendations
    ├── Memory Thread           — Longitudinal learning context & privacy-sanitized narrative summaries
    ├── Mind Trace              — Transparent pedagogical reasoning behind AI adaptations
    ├── Product Bridge          — Ephemeral, single-use signed tokens for cross-product continuity
    └── Knowledge Object        — Governed, immutable CEFR-aligned learning and practice assets
```

### Core / Mind Trust Boundary
- **Lurexa Core:** Owns authentication, authorization, tenant isolation, append-only learning evidence logs, and database persistence (Cloud Firestore / Cloud Storage). UI clients never mutate learner state directly in Firestore.
- **Lurexa Mind:** Interprets authorized evidence payloads in-memory. Mind produces adaptive recommendations, speech evaluation, and tutoring dialogue without owning persistence or granting permissions.

---

## 3. Product Maturity Matrix

All products and capabilities adhere to the repository maturity model defined in [`Docs/Engineering/REPOSITORY_MATURITY_STATUS.md`](file:///c:/Users/damia/lurexa/Docs/Engineering/REPOSITORY_MATURITY_STATUS.md):

| Surface / Product | Role | Current Maturity | Key Evidence & Current Capabilities |
| :--- | :--- | :--- | :--- |
| **Lurexa Core** | Shared Platform Layer | **Verified Baseline** | Trusted auth, Firestore evidence repository, tenant boundaries, and security rules verified. |
| **Lurexa Mind** | Shared Intelligence Layer | **Verified Baseline** | Linguistic analysis, adapter pipelines, phonological error detection, and A1–C2 rubric evaluations. |
| **Lurexa Learn** (`apps/learn-web`) | Sibling Product | **Verified MVP** | Complete A1–C2 curriculum runner, interactive vocabulary, spoken evidence capture, student assignments, and Teacher Workspace. |
| **Lurexa Coach** (`apps/coach-web`) | Sibling Product | **Verified MVP** | Standalone speaking experience, audio recorder, Dominican phonology packs, educator speaking practice, and return bridges. |
| **Lurexa Teach** (`apps/teach-web`) | Sibling Product | **Verified MVP** | Educator proficiency courses (T1), credential verification, professional development pathways, and educator benefits. |
| **Lurexa Admin** (`apps/admin-portal`) | Sibling Product | **Verified MVP Subset** | Institution management, educator credential verification, CSV roster bulk importing, and field pilot analytics. |
| **Lurexa Insight** | Sibling Product | **Architecture / Contract** | Metric aggregation models defined. (Learner-level instructional analytics live inside Learn Teacher Workspace). |
| **Lurexa Studio** | Sibling Product | **Architecture / Prototype** | Authoring contracts and CEFR linguistic linting defined. Local preview workbench implemented in Learn Teacher Workspace. |
| **Lurexa Campus** | Institutional Shell | **Representative Prototype** | Orchestration shell architecture defined. Non-transactional representative layout. |
| **Signature Experience** | Cross-Product Layer | **Verified Baseline** | 6 shared UI primitives, Learner Pulse, Adaptive Path, Memory Thread, Mind Trace, and Product Bridge verified across Learn & Coach. |

---

## 4. Pedagogical & Linguistic Framework

1. **Seven English Skills**:
   - Integrated coverage of **Listening**, **Speaking**, **Reading**, **Writing**, **Vocabulary**, **Grammar**, and **Phonetics**, complemented by AI Conversation and Create & Apply stages.
2. **Dominican Spanish (`es-DO`) L1-Transfer Specialization**:
   - Targeted remediation for common phonological transfers:
     - Final consonant deletion & coda weakening (/s/, /d/, /t/, /z/).
     - Liquid neutralization (/l/ vs. /r/ distinction in word-final positions).
     - Epenthesis before initial /s/-consonant clusters (`sp-`, `st-`, `sk-`).
     - Vowel tenseness & duration differences between Spanish 5-vowel system and English 12+ vowel inventory.
3. **Phonetics Progression (A1 through C2)**:
   - Preserves intelligibility and communicative confidence over accent erasure.
4. **Interactive Vocabulary UX**:
   - Active retrieval, context-rich matching, audio-visual association, and phoneme shadowing rather than passive front/back flashcards.

---

## 5. Media & Storage Architecture

Lurexa implements a decoupled, high-performance media storage pipeline:

```text
[ Client Recorder / Browser ]
         │
         ├── Offline? ──► [ IndexedDB Queue (OfflineSyncEngine) ]
         │                        │ (Sync upon reconnect)
         ▼                        ▼
[ Next.js Server Route / SpokenEvidenceService ]
         │
         ├── Binary Audio (.webm/.mp3/.m4a) ──► [ Google Cloud Storage / Firebase Storage ]
         │                                      `spoken-evidence/{uid}/{courseId}/{lessonId}/{id}.webm`
         │
         └── Metadata & Learning Evidence   ──► [ Cloud Firestore ]
                                                `spoken-evidence` collection (SpokenEvidenceRecord)
                                                `learning-evidence` collection (Append-only Learner Model log)
```

1. **Binary Storage (GCS / Firebase Storage)**:
   - Server-side managed via `getServerStorageBucket()` in `firebase-admin.server.ts`.
   - Max file size 8 MB; supports `audio/webm`, `audio/ogg`, `audio/mp4`, `audio/mpeg`, and `audio/wav`.
2. **Authoritative Metadata (Cloud Firestore)**:
   - Dedicated `spoken-evidence`, `assignments`, `submissions`, and `capstone-submissions` collections storing duration, byte length, storage paths, and competency IDs.
3. **Offline & Low-Bandwidth Resilience**:
   - `OfflineSyncEngine` buffers audio recordings in local IndexedDB until stable connectivity is re-established.

---

## 6. Recent Deliveries & PR #104 Scope

PR #104 completed major functionality, compliance, and UI integrations across the ecosystem:

1. **Teacher Assignments & Spoken Homework Delivery**:
   - `apps/learn-web/app/teacher/assignments/page.tsx`: Assignment creator with multi-criteria rubric evaluation, due dates, CEFR targeting, and submission grading.
   - `apps/learn-web/app/learn/assignments/page.tsx`: Student assignment portal for spoken defense recordings and text responses.
2. **Lurexa Studio Authoring Prototype**:
   - `apps/learn-web/app/teacher/studio/page.tsx`: Authoring workbench with live CEFR vocabulary and syntactic complexity linting (`StudioAuthoringService.lintCefrLinguistics`), phonological remediation rules, and prototype containment banners.
3. **Dominican Bulk Roster Importer**:
   - `apps/admin-portal/app/roster/page.tsx` & `RosterImportService`: Automated CSV ingestion for bulk student provisioning with target CEFR validation and dialect profile configuration.
4. **Dominican Field Pilot Mobile PWA & Telemetry**:
   - Dedicated mobile PWA manifests, low-bandwidth telemetry batching via `FieldTelemetryService`, and analytics dashboard at `apps/admin-portal/app/analytics/field-pilot`.
5. **React 19 / ESLint 0-Warning Compliance**:
   - Cleaned all `useEffect` async cascading render patterns into subscription promise callbacks.
   - Pinned TypeScript imports and re-exported backend types (`AssignmentTargetType`, `StudioKnowledgeObjectDraftV1`, `CefrLevel`).

---

## 7. Quality, Verification & CI/CD Governance

The repository is governed by strict CI quality gates running in GitHub Actions and local verification scripts:

- **Verification Command:** `pnpm verify:local` (Executes 28 validation suites).
- **Core CI Invariants:**
  1. `Verify Foundation & Build` (`.github/workflows/ci.yml`):
     - Phase 0 Build & Route Type Generation
     - 11/11 E2E Playwright Browser Journeys
     - Foundation Contracts & Single Learner Model Verification
     - Security Rules & Tenant Isolation Auditing
     - Architecture & Linguistic Intelligence Verifications
     - Curriculum Quality & Phonetics Schema Checking
  2. `Product Deployment Surface Validation`:
     - Individual typecheck (`tsc --noEmit`), lint (`--max-warnings 0`), and build validation across all 6 applications (`learn-web`, `coach-web`, `teach-web`, `admin-portal`, `docs`, `web`).
  3. `Zero Warning Policy`: `eslint . --max-warnings 0` strictly enforced across all 17 packages/apps.

---

## 8. Package & Directory Structure

```text
lurexa/
├── apps/
│   ├── learn-web/        # Student experience & Teacher Workspace (Next.js 16)
│   ├── coach-web/        # Standalone AI speaking & pronunciation product
│   ├── teach-web/        # Educator professional development & credentials
│   ├── admin-portal/     # Institutional administration & roster imports
│   ├── docs/             # Technical documentation portal
│   ├── web/              # Ecosystem landing & marketing
│   └── mobile/           # Expo React Native client application
│
├── packages/
│   ├── types/            # Canonical domain models, contracts, and CEFR schemas
│   ├── backend/          # Server services, Firestore repositories, Mind intelligence
│   ├── ui/               # Shared Design System & accessible UI components
│   ├── tokens/           # Design tokens (colors, typography, spacing, shadows)
│   ├── sdk/              # Client SDK contracts & API bridges
│   ├── config/           # Shared TypeScript & ESLint configurations
│   └── utils/            # Shared formatting, validation, and crypto utilities
│
└── Docs/                 # Authoritative architecture, curriculum, and governance guides
```

---

## 9. Immediate Next Steps & Strategic Roadmap

1. **Merge PR #104**: Commit `528413b` is fully green and ready for fast-forward merge into `main`.
2. **R7 — Deployment Reconciliation**:
   - Reconcile `deployment/products.json` with active Vercel environments and provision custom domains for standalone `coach-web`.
3. **R8 — Standalone Product Foundations**:
   - Build out independent standalone `apps/insight-web` and `apps/studio-web` as governed Core services.
4. **Field Pilot Expansion**:
   - Deploy Dominican Spanish English-learning pilot with offline audio caching and measure real-world student speaking gain metrics.

# LUREXA MASTER DIRECTIVE (v2 — RECONCILED WITH VERIFIED CURRENT STATE)
**Unified Commercial Ecosystem, Storage, Cascaded AI Runtime & Cross-Platform Architecture**

> v1 of this document was written against four aspirational draft directives with no ground-truth check against the actual repo. Damian then supplied the **Aug 28, 2026 Project Current State Report** — a verified operational baseline. This version reconciles the two. Every place v1 conflicted with the real repo is called out below. Do not treat v1 as current; this supersedes it.

---

## 0. What Changed From v1 — Read This First

| # | v1 Assumption | Verified Reality (Aug 28, 2026 report) | Action |
|---|---|---|---|
| 1 | **Storage: Cloudflare R2** via presigned PUT, "zero egress" as a core invariant | Binary audio already lives in **Google Cloud Storage / Firebase Storage** (`getServerStorageBucket()`), 8MB cap, four audio MIME types supported, verified MVP in production paths | **[OPEN DECISION — do not silently migrate]** GCS is shipped and working. R2 migration is a cost optimization (egress fees), not a correctness fix. Treat as a separate, optional infra project — don't bundle it into feature work below. If you want the egress savings, say so explicitly and I'll scope it as its own migration phase with a rollback plan. |
| 2 | Canonical apps: `learn-web`, `teacher-portal`, `admin-portal` | Real apps: `learn-web`, `coach-web`, `teach-web`, `admin-portal`, `docs`, `web`, `mobile` (7 apps) | **[RESOLVED]** `teacher-portal` doesn't exist — `teach-web` fills the "Lurexa Teach" PD-track role. This also resolves v1's Open Decision #3. |
| 3 | `apps/mobile` treated as deferred/aspirational (Phase 6) | `apps/mobile` (Expo React Native) **already exists** in the repo structure | **[RESOLVED]** It's real, but its maturity isn't in the product maturity matrix — treat as early-stage/unverified until you confirm otherwise. The field pilot mobile *PWA* (via `learn-web`) is a separate, already-verified surface — don't conflate the two. |
| 4 | Packages: `types`, `backend`, `ui`, `tokens`, plus assumed `auth`, `database`, `eslint-config`, `typescript-config` | Real packages: `types`, `backend`, `ui`, `tokens`, `sdk`, `config`, `utils` | **[RESOLVED]** Drop the assumed packages from any new work. If `auth`/`database` logic exists, it now lives inside `backend` or `config`. |
| 5 | Quality gates: generic `pnpm check-types && pnpm lint && pnpm test` | Real gate: `pnpm verify:local` (28 validation suites) + GitHub Actions `ci.yml` (Playwright 11/11 E2E, foundation contracts, security/tenant isolation audits, curriculum/phonetics schema checks) + zero-warning ESLint across 17 packages/apps | **[RESOLVED]** §9 below now points at the real command. |
| 6 | Sequencing assumed greenfield feature build-out was next | Actual next steps are: merge PR #104, reconcile Vercel deployment surfaces (R7), build standalone `insight-web`/`studio-web` (R8), expand the field pilot | **[RESOLVED]** The subscription/monetization/cascaded-AI work below is now explicitly **new scope layered on top of** the real roadmap — not a replacement for it. See §8. |
| 7 | Product list: Learn, Coach, Teach, Studio, Admin, Insight + "Lurexa Mobile" as a product | Six sibling products (Learn, Coach, Teach, Admin, Insight, Studio) sit on shared Core + Mind layers, plus an institutional shell (Lurexa Campus) and a cross-cutting Signature Experience layer (Learner Pulse, Adaptive Learning Path, Memory Thread, Mind Trace, Product Bridge, Knowledge Object) | **[RESOLVED]** §1 below reflects the real six-product-plus-shell structure. "Lurexa Mobile" is a client surface, not a seventh product. |
| 8 | Ultra pricing given as a range ($19.99–$24.99/mo) | Not addressed in the current-state report — no subscription/billing engine exists yet in any verified surface | **[STILL OPEN]** Fixed at $19.99/mo as before. This entire commercial layer (§2–3) is greenfield — nothing in the current-state report confirms it's started. |

---

## 1. Executive System Identity & Architectural Invariants

You are the Lead Autonomous DevOps and Full-Stack System Architect for Lurexa Learning Technologies, working across `packages/types`, `packages/backend`, `packages/ui`, `packages/tokens`, `packages/sdk`, `packages/config`, `packages/utils`, and apps `learn-web`, `coach-web`, `teach-web`, `admin-portal`, `docs`, `web`, `mobile`.

**System structure (verified):**
- **Lurexa Core** — trusted records, identity, authorization, persistence, provenance, platform services. Owns Firestore/Cloud Storage. UI clients never mutate learner state directly.
- **Lurexa Mind** — storage-free AI interpretation: linguistic intelligence, adaptation, recommendations. Verified baseline: phonological error detection, A1–C2 rubric evaluation.
- **Six sibling products:** Learn (`learn-web`, Verified MVP), Coach (`coach-web`, Verified MVP), Teach (`teach-web`, Verified MVP), Admin (`admin-portal`, Verified MVP subset), Insight (architecture/contract stage), Studio (architecture/prototype stage — local preview workbench live inside Learn Teacher Workspace).
- **Institutional shell:** Lurexa Campus — representative prototype, non-transactional.
- **Shared Signature Experience layer** (verified baseline across Learn & Coach): Learner Pulse, Adaptive Learning Path, Memory Thread, Mind Trace, Product Bridge, Knowledge Object.

**Non-negotiable invariants:**
- **Core vs. Mind Decoupling:** Mind interprets authorized evidence in-memory; it never owns persistence or grants permissions.
- **One Persistent Learner Model ("One Learner, One Model"):** every product reads from and adapts around `packages/types/src/learner-model.ts`.
- **Linguistic Focus (Dominican Spanish → US English):** prioritize intelligibility over accent erasure. Remediate:
  1. Final consonant deletion & coda weakening (/s/, /d/, /t/, /z/)
  2. Liquid neutralization (/l/ vs /r/ in word-final position)
  3. Epenthesis before initial /s/-clusters (`sp-`, `st-`, `sk-`)
  4. Vowel tenseness/duration gap (Spanish 5-vowel system vs. English 12+ vowel inventory)
  5. Third-person singular inflection drops in present tense
  6. Interdental stopping (/θ/→/t/, /ð/→/d/)
- **Teacher Separation:** operational classroom management and evidence review live in `learn-web` (Teacher Workspace). `teach-web` ("Lurexa Teach") is exclusively educator professional development (T1–T5).
- **Storage:** binary audio → Google Cloud Storage / Firebase Storage (not R2 — see §0.1); metadata → Cloud Firestore; offline staging → IndexedDB via `OfflineSyncEngine`.

---

## 2. Commercial Subscription Tiers & Product Matrix *(greenfield — not yet started per current-state report)*

| Tier | Pricing & Scope | AI Quota & Capabilities | Storage & Offline | Learner Model Synergy |
|---|---|---|---|---|
| **Basic** *(Free)* | $0/mo — placement diagnostic + 3 level-matched trial modules | 40 AI tutor turns & 15 voice min trial quota; standard rate limits | Online-only, no offline caching | Ephemeral session; basic grade calc |
| **Plus** *(Single product)* | $9.99/mo for 1 of: Learn Plus, Coach Plus, Teach Plus | Full single-tool access (e.g. Coach: 120 voice min/mo; Learn: unlimited quizzes) | 1 active module cached offline | Siloed — deep tracking in chosen tool, cross-product transfer locked |
| **Ultra** *(Full ecosystem)* | **$19.99/mo** *(fixed — still an assumption, see §0.8)* | 300+ voice min/mo, low-latency streaming, deep diagnostics | Full offline-first: unlimited downloads, local audio queue, background sync | **Universal Learner Model** — real-time cross-product sync (Coach errors → Learn review cards) |
| **Enterprise** *(Institutional)* | Custom multi-seat licensing | Shared quota pools, dedicated API limits, custom milestone tracks | Multi-seat offline caching, batch export, cohort diagnostics | Institutional cohort analytics, class-wide phonemic heatmaps, intervention routing |

---

## 3. Dynamic Placement-to-Trial & Upsell Funnel *(greenfield)*

`apps/learn-web/app/placement/` + `packages/backend/src/placement.service.ts`

1. **Multi-Modal Diagnostic:** adaptive 4-step assessment — written syntax + 60s spoken prompt evaluating Dominican transfer patterns and speech onset latency.
2. **Calibrated 3-Module Unlock:** auto-unlock 3 full-speed modules at assessed CEFR baseline, bounded by a hard token-quota object (`AIGuardrailsService`).
3. **Recommendation Engine:** on trial/quota exhaustion:
   - **Coach entry (e.g. placed B1):** recommend Coach Plus; anchor Ultra — cross-product error sync + B1 Capstone "My Voice in English."
   - **Learn entry (e.g. placed A2):** recommend Learn Plus; anchor Ultra — live oral practice in Coach + offline sync.
   - **Teach entry:** recommend Teach Plus (T1–T5); anchor Ultra/School Seats.
4. **Synergy Lock Modals:** Plus subscriber hitting a cross-tool feature sees a modal illustrating the Universal Learner Model bridge available in Ultra.

---

## 4. Cascaded AI & Speech Pipeline *(Mind is verified-baseline; this exact pipeline is not confirmed built)*

`packages/backend/src/coach.service.ts` — decoupled cascade, not a monolithic LLM call.

### Unit Economics

| Tier | Stack | Cost/hr | Free Runway | Fit |
|---|---|---|---|---|
| **1 — Recommended** | Gemini 2.5 Flash-Lite + Google Cloud TTS (WaveNet/Neural2) + Web Speech API/Cloud STT | **~$0.008/hr** | 4M chars free/mo (~83 hrs) | Primary |
| **2 — Gemini Live WebSockets** | Bidirectional audio in/out | ~$1.38/hr | No perpetual free tier | Premium Ultra streaming only |
| **3 — ElevenLabs cascade** | Gemini Flash-Lite + ElevenLabs Flash/Turbo | $3–6/hr | 10k chars/mo, no commercial rights free | Marketing/capstone voiceovers only |

### Pipeline
```
[ Learner Spoken Input ]
        │
        ▼
[ STT / Local Buffer ]
        │
        ├──▶ Dialogue Stream: Gemini 2.5 Flash-Lite ──▶ Google Cloud TTS ──▶ Sub-400ms audio out
        │
        └──▶ Async Diagnostic: Gemini 2.5 Flash (JSON mode) ──▶ Mind linguistic transfer vector
```
- **Dialogue turn:** static context caching (>1,024 tokens, $0.03/1M cached tokens), rolling 6–8 turn memory window.
- **TTS:** `en-US-Neural2-F` / `en-US-WaveNet-D`, audio within 300–400ms of turn completion.
- **Diagnostics:** transcript → Gemini 2.5 Flash JSON mode → CEFR intelligibility + Dominican transfer flags, non-blocking.
- **Static Prompt Audio Caching:** pre-synthesize repetitive feedback phrases, cache via Workbox to cut TTS billing.

---

## 5. Storage & Media Lifecycle *(as actually built — GCS/Firebase Storage, not R2)*

```
[ Client Recorder / Browser ]
         │
         ├── Offline? ──► [ IndexedDB Queue (OfflineSyncEngine) ]
         │                        │ (sync on reconnect)
         ▼                        ▼
[ Next.js Server Route / SpokenEvidenceService ]
         │
         ├── Binary audio (.webm/.mp3/.m4a/.wav, ≤8MB) ──► [ GCS / Firebase Storage ]
         │        `spoken-evidence/{uid}/{courseId}/{lessonId}/{id}.webm`
         │
         └── Metadata & learning evidence ──► [ Cloud Firestore ]
                  `spoken-evidence`, `assignments`, `submissions`, `capstone-submissions`,
                  `learning-evidence` (append-only Learner Model log)
```
- Server-managed via `getServerStorageBucket()` in `firebase-admin.server.ts`.
- Supported MIME types: `audio/webm`, `audio/ogg`, `audio/mp4`, `audio/mpeg`, `audio/wav`.
- `OfflineSyncEngine` buffers recordings in IndexedDB until stable connectivity returns.
- **If R2 migration is pursued later** (egress-fee optimization only — see §0.1): scope as its own phase with presigned PUT URLs, parallel-write validation, and a rollback path. Do not fold into feature phases below.

---

## 6. Mobile — `apps/mobile` (Expo React Native, exists but unverified maturity)

Distinct from the already-verified field-pilot mobile **PWA** delivered via `learn-web` in PR #104 (low-bandwidth telemetry via `FieldTelemetryService`, analytics at `admin-portal/app/analytics/field-pilot`). Confirm with Damian which of the two is the active investment before building further.

If proceeding with the native Expo app:

### Edge ML Pipeline
- `LocalInferenceService`: `react-native-fast-tflite` with native C++/Nitro bindings, ingesting MFCC acoustic feature tensors directly from microphone streams.
- Quantized INT8 models (`phoneme_scorer_int8.tflite`, ~12MB), 10–50ms on-device latency for real-time phonemic alignment during offline drills.
- Bundle base A1 acoustic models (~8MB) in the core app binary; fetch A2/B1/B2 level packs on demand upon level advancement — keep initial install size under 35MB.
- **Graceful fallback:** if device hardware lacks RAM or TFLite fails, reroute requests to `packages/backend` cloud endpoints without crashing the UI.

### UI/UX Component Specs
| Component | Full Spec |
|---|---|
| `SpokenEvidenceRecorder.tsx` (`apps/mobile/src/components/`) | Anchor the floating recording trigger inside the **lower 35% viewport boundary** (thumb zone) for single-handed recording without hand repositioning. `expo-haptics`: light impact on recording initiation, medium pulse on speech onset detection, double pulse on evaluation delivery. Horizontal slide-to-cancel gesture to abort without waiting for network timeouts. Track speech onset latency (<400ms); capture compressed audio (`audio/webm;codecs=opus` or `.m4a`). |
| Paged lesson player (`apps/mobile/app/(student)/learn.tsx`) | Replace vertical scrolling with a **3-card horizontal swipe carousel**: Card 1 — concept + instant Google Cloud TTS playback; Card 2 — interactive gap-fill/multiple-choice syntax check with immediate visual feedback; Card 3 — spoken evidence drill with thumb-zone recording. Segmented horizontal progress tracker fills per card. Inline animated bottom-sheet remediation on syntax errors (no lesson reset). |
| `PhonemicWaveform.tsx` (`apps/mobile/src/components/`) | Map real-time amplitudes to target phonemic stress points, not a generic waveform. Color-code detected Dominican transfer points: **emerald** = clear articulation, **amber** = syllable-timing adjustment. Variable playback speed controls at **0.8x / 1.0x / 1.2x** with synchronized word-by-word text highlighting. |
| Tutor bottom sheet (`apps/mobile/app/(student)/tutor.tsx`) | Context-grounded in the active lesson module (e.g. `A1.M4`) via Gemini streaming text. One-tap quick-query chips, exact strings: *"Why add -s here?"*, *"Pronounce this slowly"*, *"Give me another workplace example"*. Non-disruptive expandable drawer — main lesson view stays fully intact. |
| `OfflineIndicator.tsx` (`apps/mobile/src/components/`) | Header status pill, exact states: `● Offline Ready (12 MB)` / `● Syncing to R2...` *(update copy if storage stays on GCS — see §0.1)*. Course overview screen gets visual module-download toggles with storage indicators. On reconnect, run `OfflineSyncService`: upload queued blobs, save metadata to Firestore, purge device binary storage. |

### Implementation File Map & Target Routes
```
apps/mobile/
├── app/(student)/
│   ├── _layout.tsx        # Tab navigation (Learn, Coach, Progress, Profile)
│   ├── learn.tsx          # Paged horizontal lesson player
│   ├── coach.tsx          # Voice-first conversational roleplay
│   ├── tutor.tsx          # Context-aware AI companion bottom sheet
│   └── placement.tsx      # Multi-modal diagnostic & upsell funnel
├── src/components/
│   ├── SpokenEvidenceRecorder.tsx      # Thumb-zone voice capture & haptics
│   ├── PhonemicWaveform.tsx            # Segmented transfer visualizer
│   ├── OfflineIndicator.tsx            # Sync status pill
│   └── UpgradeRecommendationCard.tsx   # Plus vs. Ultra upsell modal
└── src/services/
    ├── mobile-sync.service.ts   # Local caching & cloud uploads
    ├── audio-recorder.service.ts # Device mic & latency tracker
    └── tflite.service.ts         # On-device edge phoneme scoring
```

---

## 6b. Multi-Agent Role Delegation (`.antigravity/agents/`)

| Agent | Scope |
|---|---|
| `engineering-architect.json` | `packages/types` domain contracts, `packages/backend` services, Core/Mind decoupling, storage pipelines |
| `mobile-systems.json` | Expo Prebuild, Nitro Modules, on-device TFLite tensor execution in `apps/mobile` |
| `ui-web-designer.json` | Accessible, token-compliant components in `packages/ui` / `packages/tokens` |
| `ux-expert.json` | Thumb-zone ergonomics, paged lesson navigation, multi-modal placement funnels, System Usability Scale (SUS) benchmarks |
| `devops-qa.json` | Enforces `pnpm verify:local`, linting, automated Playwright/unit test suites |

---

## 7. Actual Roadmap (real next steps + new commercial/AI scope layered on top)

**Immediate (already in flight, per current-state report):**
1. Merge PR #104 (commit `528413b`, green, fast-forward ready).
2. **R7 — Deployment Reconciliation:** reconcile `deployment/products.json` with active Vercel environments; provision custom domain for standalone `coach-web`.
3. **R8 — Standalone Product Foundations:** build `apps/insight-web` and `apps/studio-web` as governed Core services.
4. **Field Pilot Expansion:** deploy Dominican Spanish pilot with offline audio caching; measure real-world speaking-gain metrics.

**New scope (this directive, sequence after the above — do not interleave):**

- **Phase A — Domain Contracts (`packages/types`):** `subscription.ts` (`SubscriptionTier`, `ProductEntryPoint`, `PlanQuotas`, `PlanRecommendation`), `placement.ts` (`MultiModalPlacementPayload`, `PlacementResult`, `DiagnosticTransferHighlight`), `coach.ts` (session payloads, turn metrics, diagnostic schemas). Export all in `index.ts`.
- **Phase B — Backend Guardrails & Mind Services (`packages/backend`):** `AIGuardrailsService` (token/voice-minute caps, rate limits, trial allocations), `MindRecommendationService` (Plus vs. Ultra synergy payloads, Capstone unlock hooks), update `CoachService` for the cascaded pipeline (§4), update `LearnerModelService` for Coach→Learn error sync (Ultra only).
- **Phase C — Placement Flow & Upsell UI (`apps/learn-web`):** 4-step diagnostic page, trial expiration + synergy lock modals, Mind recommendation card. Also refactor the Learner Dashboard: fix the grid regression, add a time-of-day greeting, a 7-day streak calendar row, real achievement badges, and a unified Coach entry point.
- **Phase D — Verification Gate:** full `pnpm verify:local` pass before any further phase.
- **Phase E — Mobile (`apps/mobile`):** only after confirming scope per §6, and only after Phase D is green.

---

## 8. Quality Gates & Verification Protocol (real command)

Run before marking any subtask resolved or committing:

```bash
pnpm verify:local   # 28 validation suites
```

Which enforces, per `ci.yml`:
1. Phase 0 build & route type generation.
2. 11/11 Playwright E2E browser journeys.
3. Foundation contracts & Single Learner Model verification.
4. Security rules & tenant isolation auditing.
5. Architecture & linguistic intelligence verifications.
6. Curriculum quality & phonetics schema checking.
7. Per-app typecheck (`tsc --noEmit`), lint (`--max-warnings 0`), and build across all 6 web apps (`learn-web`, `coach-web`, `teach-web`, `admin-portal`, `docs`, `web`).
8. Zero-warning ESLint policy across all 17 packages/apps.

**Accessibility compliance (applies to all new UI in Phases C and E):** every interactive touch target maintains a minimum 48×48dp hit boundary; all color tokens conform strictly to WCAG 2.1 AA contrast standards.

New work in Phases A–E above must pass this exact gate — not a generic `check-types && lint && test` — before merge.

# Lurexa Working MVP — Acceptance Specification

**Document Version:** 1.0.0  
**Status:** Authoritative Architectural Standard  
**Governing Architecture:** Lurexa Core & Lurexa Mind  
**Target Journey:** One complete, continuous learner loop across Learn and Coach  

---

## 1. Executive Summary

This document establishes the measurable acceptance criteria required to validate the **Lurexa Working MVP**. The governing design principle across all products is:

> **"One learner. One evolving model. Every Lurexa experience adapts around it."**

The MVP does not attempt to launch all future commercial capabilities simultaneously. Instead, it validates one end-to-end, high-integrity vertical slice: a Dominican Spanish-speaking learner (`es-DO`) entering the ecosystem, completing an interactive A1 lesson in Lurexa Learn, persisting trusted learning evidence, receiving Mind-driven adaptive recommendations, transitioning into Lurexa Coach for speaking practice without re-authenticating, completing speaking turns with linguistic feedback, and returning to Learn with preserved progress and continuous state.

---

## 2. Measurable Acceptance Criteria by Domain

### Domain 1: Identity & Authentication
- [x] **Single Ecosystem Account:** A learner registers or authenticates once via Firebase Authentication and shares that identity across Lurexa Learn (`learn.lurexa.org`), Lurexa Coach (`coach.lurexa.org`), and Lurexa Teach (`teach.lurexa.org`).
- [x] **No Duplicate Accounts:** An existing learner attempting to access Coach is recognized immediately by UID and is not prompted or allowed to create a disconnected Coach-only account.
- [x] **Session Survival:** Auth tokens survive cross-product transitions via domain-level cookies (`.lurexa.org`) and secure `ProductBridge` handoffs.
- [x] **Unauthorized Access Rejection:** Direct requests to protected student or teacher APIs without valid bearer credentials return `401 Unauthorized`.

### Domain 2: Onboarding & Placement
- [x] **Dialect & Goal Selection:** The onboarding flow captures the learner's native variety (prioritizing `es-DO` Dominican Spanish) and learning objective (`daily_life`, `work`, `travel`, `study`).
- [x] **Deterministic Course Routing:** True beginners route to `english-a1-foundations` and the canonical introductory lesson (`a1-introduce-yourself`).
- [x] **Placement Respect:** Diagnostic assessments place advanced learners into appropriate CEFR levels (A2–C2) without artificially forcing them through A1.
- [x] **Idempotent Provisioning:** Initial enrollment provisions learner records in Core Firestore idempotently without corrupting prior state.

### Domain 3: Lurexa Learn Runtime
- [x] **Canonical Curriculum Rendering:** Lessons and activities are rendered from immutable, structured curriculum objects (`packages/backend/src/a1-production-curriculum.server.ts`), not hardcoded demo templates.
- [x] **7-Stage Pedagogical Flow:** Lessons advance through structured stages:
  1. `HOOK` (Mission & communicative objective)
  2. `CONTEXTUAL_INPUT` (Model audio with hidden transcript)
  3. `COMPREHENSION` (Meaning verification)
  4. `LANGUAGE_NOTICING` (Phonetic & structural patterns)
  5. `CREATE_APPLY` (Authentic production)
  6. `QUIZ` (Quick mastery check)
  7. `REFLECTION` (Wrap-up & Coach transition)
- [x] **Strict 70% Passing Threshold:** Lessons reject completion attempts until the learner has submitted at least 70% of required interactive blocks and the final quiz check.
- [x] **Attempt Provenance:** First-attempt performance is permanently distinguished from retries after hints, ensuring diagnostic integrity.
- [x] **Resumability:** Incomplete lessons remain in `in_progress` status and reload with previously submitted answers; completed lessons lock as `completed`.

### Domain 4: Lurexa Core & Evidence Repository
- [x] **Append-Only Evidence:** Learning evidence is written exclusively to the Core `learning_evidence` collection with immutable timestamps and system-observed provenance.
- [x] **Tenant Isolation:** Evidence and course memberships are strictly scoped to the active organization (`lurexa-self-paced` for direct consumers or institutional tenant ID).
- [x] **No Direct UI Mutation:** Client UI components never directly mutate the authoritative Firestore `progress` or `learning_evidence` collections; all mutations flow through authenticated server endpoints.

### Domain 5: Lurexa Mind & Adaptive Intelligence
- [x] **Stateless Interpretation:** Mind interprets authorized evidence in-memory without maintaining a rogue canonical database.
- [x] **Traceable Projections:** Projections (`Learner Pulse`, `Adaptive Path`, `Memory Thread`) declare explicit `evidenceBasis` references.
- [x] **Adaptive Next Steps:** `LearnProgressService.getLearnerDashboard` derives the next pedagogical step based on Core evidence and CEFR velocity.
- [x] **Privacy Minimization:** Mind projections expose synthesized summaries and competency mastery scores rather than raw transcripts or personally identifiable inputs.

### Domain 6: Lurexa Coach & Speaking Experience
- [x] **Standalone Sibling Product:** Coach operates with its own web runtime (`apps/coach-web`) and does not live as a sub-route of Learn.
- [x] **Inbound Bridge Reception:** Coach accepts single-use `ProductBridge` tokens from Learn and initializes practice sessions with authorized learner context.
- [x] **L1-Transfer Intelligence:** Spoken input analysis specifically detects Dominican Spanish transfer markers (e.g., `DO-ENG-PRO-001` /s/-cluster epenthesis like *"es-school"*, `DO-ENG-PRO-002` coda /s/-aspiration) and provides constructive, tactile coaching cues.
- [x] **No Accent Erasure:** Pedagogy focuses on intelligibility, rhythm, and confidence rather than accent elimination.
- [x] **Turn Evidence Logging:** Speaking turns generate structured linguistic evidence in Core without storing raw conversational audio or transcripts indefinitely.
- [x] **Privacy Redaction:** Upon session finalization, raw conversational transcripts are wiped from session storage, retaining only summarized pedagogical observations.

### Domain 7: Speech Runtime & Audio Pipeline
- [x] **Server Capability Resolution:** Audio playback and generation capabilities are resolved server-side through typed contracts.
- [x] **Truthful Failure Semantics:** The audio system never presents silent or synthetic audio as successful production speech; provider failures return typed errors (`missing_provider_configuration`, `quota_exceeded`, `provider_runtime_failure`).
- [x] **Deterministic Test Fallbacks:** In local development and automated CI without provider API keys, the system falls back to explicitly labeled deterministic test responses rather than failing silently.

### Domain 8: Cross-Product Continuity & Return Loop
- [x] **Single-Use Return Bridge:** Finishing a Coach session issues a signed, single-use `ProductBridge` pointing back to the learner's dashboard in Learn (`/dashboard`).
- [x] **Preserved Progress:** Upon returning to Learn, the learner's completed A1 lesson, overall course completion percentage, and accumulated evidence remain fully intact.
- [x] **Updated Personalized State:** The Learn dashboard reflects newly captured speaking evidence from Coach within the learner's adaptive recommendations.

---

## 3. Verification Mapping

Every acceptance criterion in this specification is continuously verified by automated suites in the repository:

| Capability Area | Verifier Script / Test Suite | CI Gate |
| :--- | :--- | :--- |
| Identity & Auth | `packages/backend/scripts/test-learn-mvp-journey.ts` | `CI (Phase 0 Lock)` |
| Onboarding & Placement | `scripts/simulate-complete-learner-lifecycle.mjs` | `Curriculum Quality` |
| 7-Stage Curriculum | `scripts/verify-full-curriculum-runner.mjs` | `Curriculum Quality` |
| 70% Passing Gate | `packages/backend/scripts/test-learn-mvp-journey.ts` | `Security & Integration` |
| Core / Mind Boundaries | `scripts/verify-core-mind-boundary.mjs` | `Architecture & Intelligence` |
| Learner Model Truth | `scripts/verify-learner-model.mjs` | `Architecture & Intelligence` |
| Coach Product Boundary | `scripts/verify-coach-product.mjs` | `Foundation Contracts` |
| Dominican L1 Adaptation | `scripts/verify-linguistic-intelligence.mjs` | `Architecture & Intelligence` |
| Speech Runtime Truth | `scripts/verify-speech-runtime.mjs` | `Foundation Contracts` |
| Signature Continuity | `scripts/verify-signature-experience.mjs` | `Architecture & Intelligence` |
| Complete Working Journey | `packages/backend/scripts/test-lurexa-working-mvp-journey.ts` | `Security & Integration` |

# Lurexa Placement & Diagnostic Assessment Specification (L-PDA & T-PDA)

Status: Authoritative Architecture Specification  
Target Systems: Lurexa Core, Lurexa Mind, Lurexa Learn (L-PDA), Lurexa Teach (T-PDA), Lurexa Coach

---

## 1. Executive Summary & Architectural Boundaries

The **Lurexa Placement & Diagnostic Assessment** framework unifies diagnostic initialization across independent learners and educators. It strictly adheres to the core Lurexa architectural principles:

> **One learner / educator. One evolving model. Every Lurexa experience adapts around it.**

### System Ownership:
1. **Lurexa Core**:
   * Owns identity, authorization, permissions, and authoritative persistent records.
   * Stores the persistent `Learner Model` (`learners/{uid}` and `learner-profiles/{uid}`) and `Educator Profile` (`teach-profiles/{uid}`).
   * Retains first-attempt assessment evidence through `FirestoreLearningEvidenceRepository` with immutable provenance.
2. **Lurexa Mind**:
   * Evaluates acoustic waveforms and speech transcripts.
   * Performs adaptive routing across CEFR bands (A1 to C2).
   * Detects Dominican Spanish L1 linguistic transfer markers.
   * Calibrates verified vs. provisional proficiency confidence and generates ecosystem recommendations.
3. **Lurexa Learn (L-PDA)**:
   * Provides learner placement testing across all 7 English skills.
   * Routes learners adaptively to entry-level courses (A1 Foundations to C2 Native-Like Mastery).
   * Provisions production course access synchronously.
4. **Lurexa Teach (T-PDA)**:
   * Delivers oral diagnostic tasks evaluating classroom instructional discourse (B1–C2).
   * Calibrates educator verified CEFR and reconciles T1–T5 credentials.

---

## 2. Lurexa Learn Placement & Diagnostic Assessment (L-PDA)

### 2.1. Seven Canonical Skill Domains
L-PDA measures proficiency across seven foundational skills:
1. **Listening Comprehension**: Contextual dialogue comprehension, schedule adjustments, and multi-speaker inference.
2. **Speaking Interaction & Fluency**: Communicative clarity, speech onset latency, and spoken sentence formulation.
3. **Reading & Discourse**: Information extraction, argument synthesis, and nuance interpretation.
4. **Writing & Structural Formulation**: Contextual gap-filling, polite written responses, and register adaptation.
5. **Vocabulary in Context**: High-frequency collocations, formulaic greetings, and idiomatic precision.
6. **Grammar & Syntax**: Verb inflection, subject-verb agreement, inversion, and complex clause connectors.
7. **Phonetics & Pronunciation**: Direct consonant cluster onsets, regular past *-ed* allomorphs, and vowel duration.

### 2.2. Adaptive Routing Engine
* **Screening Phase (A1–A2 Probes)**: Baseline screening assessing fundamental communicative and structural control.
* **Intermediate Progression (B1–B2 Probes)**: Triggered when baseline screening accuracy $\ge 75\%$.
* **Advanced Progression (C1–C2 Probes)**: Triggered when intermediate accuracy $\ge 80\%$.
* **Diagnostic Termination**: When confidence criterion is satisfied or error threshold is reached, ensuring concise testing without fatigue.

### 2.3. Dominican Spanish Transfer Highlights (Lurexa Mind)
* **DO-ENG-PRO-002 (Initial /s/ cluster epenthesis)**: Flags prosthetic vowel insertion (e.g. *eschool*, *estudent*) and recommends direct sibilant onset practice.
* **DO-ENG-PRO-006 (Regular/irregular past inflection)**: Detects past morphology simplification (e.g. *go* for *went*, regularization errors) and recommends targeted retrieval practice.

### 2.4. Provisional vs. Verified State
* Initial L-PDA completions are marked as `isProvisional: true` (`confidence: "medium"` or `"low"`).
* As learners produce corroborated multimodal evidence across interactive lessons and Coach speaking sessions, Lurexa Mind transitions proficiency to `confidence: "high"`.

---

## 3. Lurexa Teach Placement & Diagnostic Assessment (T-PDA)

### 3.1. Diagnostic Tasks (B1 to C2)
T-PDA evaluates professional classroom language through 3 benchmark scenarios:
* **Task 1 (B1 Benchmark — Classroom Staging & Instructions)**:
  * *Scenario:* Setting up a 5-minute pair-work speaking activity.
  * *Focus:* Clear imperatives, sequencing markers (*first*, *then*), and pacing.
* **Task 2 (B2 Benchmark — Formative Recasting & Feedback)**:
  * *Scenario:* Supportive oral correction of student grammatical errors (e.g. *"Yesterday I go to the beach"*).
  * *Focus:* Positive reinforcement, constructive recasting, and phonological modeling.
* **Task 3 (C1/C2 Benchmark — Pedagogical Rationale & Curriculum Adaptation)**:
  * *Scenario:* Explaining the rationale for intelligibility over accent erasure for Dominican Spanish speakers.
  * *Focus:* Academic discourse markers, sociolinguistic nuance, and complex subordinate structures.

### 3.2. Credential Reconciliation (T1–T5)
Upon T-PDA evaluation:
* `estimatedLevel` and `overallIntelligibilityScore` are written to `teach-profiles/{uid}` and `learner-profiles/{uid}` in Core.
* Verified competencies (`speaking-instruction`, `pronunciation-pedagogy`) are updated.
* Eligible credentials (`T1` through `T5`) are evaluated via `evaluateTeachCredential` and persisted in `teachCredentialAwards`.

---

## 4. Verification & Audit Conformance

The implementation satisfies:
1. Universal Learner Model integrity (60 checks passing).
2. Complete full-curriculum runner and provisioning for A1–C2 courses.
3. Coach, Learn, and Teach product boundaries and bidirectional bridges.

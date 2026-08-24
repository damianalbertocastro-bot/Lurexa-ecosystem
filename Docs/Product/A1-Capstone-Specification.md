# A1 Integrated Capstone Specification: "My Life, My English"

- Level: **CEFR A1 — Breakthrough / Foundations for Real Communication**
- Purpose: Comprehensive, multi-modal synthesis project verifying communicative exit readiness from Level A1.
- Target Audience: Dominican and global adult/young adult English learners.
- Architecture Reference: `Docs/Architecture/Learner Model Architecture.md` & `packages/types/src/capstone.ts`.

---

## 1. Pedagogical Overview

The A1 Capstone is not a traditional multiple-choice exam. It is a multi-step, evidence-based communicative showcase where the learner demonstrates independent oral, written, and conversational competence across the four thematic pillars of A1:

1. **Self-Introduction & Origins** (Name, nationality, profession, contact details).
2. **Family & Important People** (Describing key people and relationships).
3. **Daily Life & Habitual Routines** (Morning-to-night habits, schedules, times).
4. **Interactive Oral Defense** (Spontaneous response to unpredictable teacher / AI conversational prompts).

---

## 2. Multi-Step Capstone Flow

```text
[Step 1: Written Profile Draft]
      ↓
[Step 2: Spoken Narrative Audio Recording (90–120s)]
      ↓
[Step 3: Interactive Oral Defense (3 Turns with Coach / Teacher)]
      ↓
[Step 4: Multi-Modal Evidence Synthesis & Mastery Vector Evaluation]
      ↓
[Exit Decision & Learner Model Credentialing]
```

### Step 1: My Profile (Written Synthesis)
- Learner submits a structured written personal dossier (100–150 words).
- Key prompts: Personal info, who lives in their home, their typical day, and their favorite place in town.

### Step 2: Oral Presentation ("My Life, My English")
- Learner records a 90 to 120-second continuous audio presentation.
- Evaluated on: Communicative Intelligibility, Lexical Range, Grammatical Control (Simple Present, Be, Possessives), and Phonetic Fluency.

### Step 3: Interactive Oral Defense
- 3 spontaneous interactive turns with an AI Coach or Human Teacher.
- Prompts test real-time listening comprehension and spontaneous retrieval (e.g., "What time do you usually wake up on Sundays?", "Tell me about someone you admire.").

---

## 3. Rubric & Evaluation Vector

| Dimension | Threshold for Exit | Weight | Evidence Mode |
| :--- | :--- | :--- | :--- |
| **Communicative Intelligibility** | $\ge 0.75$ | 30% | Spoken Audio / Acoustic Vector |
| **Grammatical Accuracy (A1 Range)** | $\ge 0.70$ | 25% | Written & Spoken Artifacts |
| **Vocabulary Diversity (A1 Core)** | $\ge 0.70$ | 20% | Dossier + Defense Turns |
| **Interactional Responsiveness** | $\ge 0.75$ | 25% | Multi-Turn Oral Defense |

---

## 4. Decision Outcomes

- **`READY`**: All criteria met; learner advances to A2 with verified CEFR A1 badge.
- **`READY_WITH_TARGETS`**: Exit granted; specific pronunciation or fluency targets transferred to A2 Coach profile.
- **`TARGETED_REVALIDATION`**: 1 component (e.g. oral defense) requires targeted re-attempt.
- **`MORE_EVIDENCE_NEEDED`**: Insufficient independent evidence; teacher intervention assigned.

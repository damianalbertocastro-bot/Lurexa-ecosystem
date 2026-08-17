# Learner Model Architecture

Version: 1.0

Status: Approved

Owner: Lurexa Mind / Platform Architecture

Last updated: 2026-08-17

---

# Purpose

This document defines how Lurexa represents an evolving learner across products.

The Learner Model is a shared Lurexa Mind capability built on trusted records and permissions provided by Lurexa Core.

It exists so a learner does not start from zero when moving between Lurexa Learn, Lurexa Coach, and future products.

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

---

# Architectural Principle

Products observe the learner.

Lurexa Mind interprets those observations.

Lurexa Core owns trusted platform state, authorization, and persistence.

```text
Product interaction
      ↓
Core records authorized learning evidence
      ↓
Mind Learner Model interprets evidence
      ↓
Personalization / recommendations / coaching context
      ↓
Product experience
```

The Learner Model must not become a second uncontrolled user database.

---

# Learner Model vs User Profile

A user profile contains identity and account-oriented information.

Examples:

- name
- account ID
- email
- organization membership
- preferences

A Learner Model represents educational state.

Examples:

- CEFR level
- skill estimates
- current learning objectives
- vocabulary mastery
- grammar mastery
- recurring error patterns
- pronunciation targets
- speaking fluency patterns
- L1-transfer patterns
- practice history
- confidence indicators
- learning goals
- recommended next actions

Identity belongs primarily to Lurexa Core.

Educational interpretation belongs primarily to Lurexa Mind.

---

# Initial Learner Model Domains

## Proficiency

- Overall CEFR estimate
- Skill-specific CEFR estimates where evidence supports them
- Placement evidence
- Confidence/uncertainty of estimates

## Current Learning Context

- Current course
- Current module
- Current lesson/unit
- Recently studied topics
- Current vocabulary targets
- Current grammar targets
- Current speaking targets

## Mastery

- Vocabulary knowledge
- Grammar knowledge
- Listening skills
- Reading skills
- Speaking skills
- Writing skills

Mastery estimates should distinguish between observed evidence and inferred state.

## Error Patterns

Examples:

- repeated grammar errors
- lexical transfer
- word-choice patterns
- pronunciation substitutions
- final-consonant reduction
- word stress patterns
- rhythm and intonation patterns

Errors should be represented as learnable patterns, not permanent labels.

## Pronunciation Profile

The pronunciation profile may include:

- target phonemes
- recurring substitutions
- intelligibility issues
- word stress
- sentence stress
- rhythm
- connected speech
- intonation
- successful corrections
- recommended practice targets

The system must not treat a Dominican accent itself as a defect.

Preferred progression:

1. Intelligibility
2. Naturalness
3. Optional pronunciation refinement

## L1 Transfer Profile

The first deeply modeled L1 profile is Dominican Spanish.

The purpose is to identify likely transfer from Dominican Spanish into English and produce more useful explanations and practice.

Examples may include:

- Spanish vowel substitution for English vowel contrasts
- English consonant production challenges
- final consonants
- consonant clusters
- stress and rhythm transfer
- literal translation of Dominican expressions or Spanish structures

The architecture must support future L1 profiles without redesigning the learner model.

## Preferences and Support

Possible signals:

- English Immersion
- Guided English
- Foundation Support
- preferred correction intensity
- preferred speaking topics
- target pronunciation style when requested

## Goals

Examples:

- conversational confidence
- job interview preparation
- travel communication
- academic English
- professional English
- pronunciation refinement
- CEFR progression

---

# Evidence Sources

The Learner Model can be updated only from approved evidence sources.

Potential sources include:

## Lurexa Learn

- lesson completion
- quiz and assessment results
- activity attempts
- vocabulary performance
- grammar performance
- AI tutoring interactions when approved
- current curriculum context

## Lurexa Coach

- speaking-session observations
- pronunciation patterns
- fluency indicators
- recurring spontaneous grammar errors
- vocabulary gaps
- successful repairs/corrections
- session goals

## Lurexa Teach

Teacher-created or teacher-validated learning observations may contribute where product policy and permissions allow.

## Assessments

Validated placement, formative, and proficiency evidence may contribute to proficiency estimates.

---

# Evidence vs Inference

Every meaningful learner-model attribute should preserve the distinction between:

- observed evidence
- inferred state
- learner-provided preference
- teacher-provided judgment
- system recommendation

Where useful, fields should include:

```text
value
source
observedAt
confidence
scope
expiresAt or reviewAfter
```

The system should avoid turning a weak inference into permanent truth.

---

# CEFR-Aware Adaptation

Lurexa Mind should provide product-facing context that constrains difficulty.

For example, an A1 learner entering Lurexa Coach may receive:

```text
CEFR: A1
Current topic: daily routines
Known language: family, food, simple present
Current objectives: frequency adverbs, simple present
Pronunciation targets: final consonants, /iː/ vs /ɪ/
Avoid: rare vocabulary, advanced conditionals, long multi-part questions
Feedback intensity: light during conversation, detailed after conversation
```

Coach should not ask for information such as CEFR level when an authorized, current estimate already exists.

Difficulty adaptation should reduce unnecessary struggle without removing productive challenge.

---

# Cross-Product Continuity

Example:

```text
Lurexa Learn
Learner studies restaurant language
        ↓
Core records lesson progress and current objectives
        ↓
Mind updates learner context
        ↓
Lurexa Coach
Runs a level-appropriate restaurant role-play
        ↓
Coach observes speaking and pronunciation patterns
        ↓
Mind interprets patterns
        ↓
Core persists approved evidence
        ↓
Learn recommends targeted follow-up practice
```

The user should experience this as one continuous learning relationship.

---

# Product Access Rules

## Lurexa Learn

Can consume learner-model context needed for adaptive learning and recommendations.

## Lurexa Coach

Can consume relevant CEFR, current learning context, speaking targets, and prior coaching evidence needed to personalize practice.

## Lurexa Teach

Can consume educator-appropriate summaries according to permissions and privacy policy.

## Lurexa Insight

Can consume authorized individual or aggregated learning evidence for interpretable analytics.

## Lurexa Admin

Controls organization, role, governance, and access policy. It should not receive unrestricted pedagogical detail merely because a user is an administrator.

---

# Privacy and Governance

The Learner Model may become highly sensitive because it can describe performance, behavior, strengths, weaknesses, and inferred learning needs.

Rules:

- Data minimization is mandatory.
- Products receive only the context they need.
- AI providers should receive only the minimum approved context required for a task.
- Authorization must be checked before learner context is exposed.
- Learners should have meaningful transparency and control where appropriate.
- Inferences should not be treated as immutable facts.
- Sensitive learner data must not be used for unrelated commercial profiling.
- Retention and deletion policies must be defined before production-scale use.
- High-impact decisions should not rely solely on opaque model inference.

---

# Initial Technical Direction

Do not begin by creating one giant `learnerModel` document containing every possible field.

Prefer a modular domain design with stable identifiers and evidence-backed subdomains.

Conceptual structure:

```text
learner
├── identity reference       # Core-owned
├── proficiency
├── curriculum context
├── mastery estimates
├── error patterns
├── pronunciation profile
├── goals
├── preferences
└── recommendations
```

Possible implementation may span multiple collections/tables/events. The logical model should not dictate a premature Firestore schema.

Do not allow product UIs to mutate inferred learner state directly.

---

# Service Boundaries

Preferred interaction:

```text
Product
  ↓
Core authorization
  ↓
Learner Context Service
  ↓
Mind Learner Model
  ↓
Personalization / Coach / Recommendation service
```

When Mind produces a persistent observation or inference, use an approved Core-owned contract or repository/service boundary.

---

# MVP Sequence

## Stage 1 — Reliable learning evidence

- stable user IDs
- enrollment
- progress
- CEFR estimate
- current course/unit context
- assessment records

## Stage 2 — Learner Model foundation

- learner-context contract
- evidence provenance
- recurring-error representation
- goals/preferences
- basic personalization

## Stage 3 — Speaking and pronunciation profile

- Coach session evidence
- pronunciation target representation
- L1-transfer tags
- correction history
- CEFR-aware conversation context

## Stage 4 — Cross-product adaptation

- Learn uses Coach evidence for follow-up practice
- Coach uses Learn curriculum state automatically
- Teach consumes appropriate summaries
- Insight surfaces interpretable trends

---

# Success Criteria

The Learner Model succeeds when:

- learners do not repeatedly re-enter known learning context
- Coach automatically adapts to current CEFR level
- recommendations become more useful as evidence accumulates
- Learn and Coach reinforce each other
- corrections target recurring high-value patterns instead of isolated mistakes
- educators can understand relevant learner trends without receiving unnecessary private data
- personalization remains explainable, controllable, and technically reusable across products

---

# Guiding Rule

> **Products observe the learner. Mind understands the learner. Core protects and persists the trusted learning record.**

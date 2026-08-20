---
name: lurexa-core-mind
description: Guidelines and contracts for Lurexa Core, Lurexa Mind, and single Learner Model boundaries
---

# Lurexa Core & Mind Architecture Skill

Use this skill when implementing or modifying services, data contracts, AI integrations, or learner state persistence in the Lurexa ecosystem.

## Architectural Principles

1. **One Learner Model**: The Learner Model is the persistent, evolving representation of the learner across all Lurexa products (`Lurexa Learn`, `Lurexa Coach`, `Lurexa Teach`, etc.). Products do NOT maintain separate authoritative learner profiles.
2. **Lurexa Core Responsibilities**:
   - Identity & Authentication
   - Authorization & Access Control
   - Trusted Learner Records & Persistence
   - Evidence Provenance & Shared Platform Services
   - Approved persistence of derived observations
3. **Lurexa Mind Responsibilities**:
   - Learning Interpretation & Personalization
   - Speaking / Pronunciation / L1-Transfer Intelligence
   - Recommendations & Intervention Suggestions
   - Tutoring & Coaching Intelligence
4. **Boundary Rules**:
   - Never bypass Core trust boundaries to access Firestore directly from UI components for domain mutations.
   - Never call AI providers directly from product UI code for production learning intelligence.
   - Apply authorization and data minimization before exposing learner context to AI services.

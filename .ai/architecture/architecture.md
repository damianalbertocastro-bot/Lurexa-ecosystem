# Lurexa Architecture — AI Canonical Summary

Status: Authoritative AI-facing summary  
Last updated: 2026-08-17

## Company model

```text
Lurexa Learning Technologies
│
├── Lurexa Core — trust, identity, authorization, persistence,
│                 authoritative records and shared platform services
├── Lurexa Mind — interpretation, personalization, adaptation,
│                 AI tutoring/coaching and learning intelligence
└── Products — Learn, Coach, Teach, Admin, Insight, Studio
```

Core and Mind are shared ecosystem layers, not ordinary end-user products.

## Governing principle

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

Products generate experiences and learning evidence. Mind interprets authorized evidence. Core owns trusted records, authorization and persistence.

The Learner Model is a cross-product ecosystem representation. Do not create independent learner truth per product or treat Mind as a second ungoverned persistence layer.

## Required dependency direction

```text
Products → Core contracts → authorized evidence/context → Mind
Mind → approved intelligence/observations → Core-governed boundaries → Products
```

Do not integrate products through profile copying or direct shared-database assumptions.

## Coach

Lurexa Coach is the AI-powered English speaking/pronunciation product. Its first deep linguistic profile is Dominican Spanish → English.

Priorities: intelligibility, naturalness, fluency, pronunciation refinement, confidence, recurring-pattern detection, corrective practice and L1-transfer awareness.

The objective is not accent erasure. Dominican Spanish is the first deep profile, not a permanent technical limitation.

## Commercial scope

The thesis prototype is a validation/reference artifact. Production architecture and roadmaps optimize for the full scalable commercial ecosystem.

## Implementation discipline

Conceptual architecture does not require immediate package renaming. Inspect actual repository responsibility first, define contracts, then make the smallest justified code change.

For detail, read:

- `Docs/00-Lurexa-Bible.md`
- `Docs/Architecture/Capability Architecture.md`
- `Docs/Architecture/Learner Model Architecture.md`
- `Docs/Architecture/Capability Interaction Matrix.md`
- `Docs/Architecture/Dependency Graph.md`
- `ROADMAP.md`
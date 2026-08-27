# Lurexa Coach — First-Class Product Boundary

Status: **Normative**  
Last updated: 2026-08-27

## Decision

Lurexa Coach is a first-class Lurexa product at the same product tier as Lurexa Learn and Lurexa Teach. It is not a feature, route, or sub-product owned by Learn.

Coach owns a dedicated web product surface (`apps/coach-web`) and is expected to deploy independently as `lurexa-coach-web`, with canonical public URL `https://coach.lurexa.org`.

The relationship is intentionally:

> **Learn owns curriculum and operational learning. Coach owns adaptive language practice. Teach owns educator professional development. Core owns trusted state. Mind interprets authorized evidence.**

Coach remains deeply connected to Learn and Teach through shared identity, Core-governed context, Mind interpretation, and purpose-scoped Product Bridges.

## Product position

| Concern | Authoritative owner |
| --- | --- |
| Course curriculum, lessons, progression, placement | Lurexa Learn |
| Adaptive speaking and conversation practice | Lurexa Coach |
| Pronunciation, intelligibility, fluency practice | Lurexa Coach |
| Educator professional English practice | Lurexa Coach, under an educator-professional purpose |
| Professional-development pathways and qualification readiness | Lurexa Teach |
| Identity, authorization, entitlements, trusted evidence and persistence | Lurexa Core |
| Interpretation, learner modeling and recommendations | Lurexa Mind |

Coach must never become the authority for course enrollment, CEFR placement, educator qualification, teaching authorization, or trusted persistence.

## Standalone Coach surface

`apps/coach-web` is the canonical Coach UI owner. Initial product routes include:

- `/` — Coach product home
- `/dashboard` — authenticated Coach entry and mode selection
- `/practice` — live adaptive learner practice
- `/pronunciation` — pronunciation and intelligibility product area
- `/history` — privacy-aware session/memory surface
- `/educator` — governed educator-professional Coach entry
- `/login` — shared Lurexa identity sign-in
- `/api/coach` — Coach-owned session boundary delegating to shared trusted backend services
- `/api/product-bridge` — Coach-owned Product Bridge boundary

Additional Coach pages may be added without changing product ownership as long as they remain within adaptive language-practice scope.

## Learn integration

Learn may recommend or launch Coach because Coach is part of the learner's Lurexa journey. Learn does not own the Coach conversation UI.

The intended flow is:

1. Learn identifies an appropriate practice target from authorized learning context.
2. Core creates a purpose-scoped Learn → Coach Product Bridge when scoped handoff context is required.
3. Navigation enters the standalone Coach product.
4. Coach resolves the bridge and independently authorizes the context it needs.
5. Coach runs the practice session.
6. On learner completion, Coach contributes minimized trusted learning evidence through Core and creates a Coach → Learn return bridge.
7. The learner returns to Learn without losing continuity.

Legacy Learn `/coach` URLs are compatibility redirects only and must not become a second Coach implementation.

## Teach integration

Teach can recommend Coach for an educator's own professional language development. The educator uses the same Lurexa identity.

Educator-professional Coach mode requires the governed Coach educator benefit. It must remain purpose-separated from ordinary learner evidence:

- no student context;
- no raw transcript in the durable professional record;
- minimized professional-practice evidence only;
- Coach does not grant qualification;
- completion returns to Teach professional growth.

A verified educator may receive full Coach access as a benefit, but Coach access does not imply professional qualification or teaching authority.

## Learner vs. professional evidence

Coach supports two explicit modes:

### Learner mode

- consumes authorized learner context;
- may contribute minimized learning evidence;
- may trigger Mind refresh through Core;
- returns to Learn.

### Educator-professional mode

- consumes only the educator's authorized professional context/benefit;
- does not enter the ordinary learner-evidence pipeline;
- stores minimized professional practice evidence;
- contains no student context;
- returns to Teach.

These evidence purposes must never be silently merged.

## Privacy and history

Raw Coach transcripts are ephemeral session material, not the persistent Learner Model.

Completed sessions should retain only the evidence needed for learning continuity, provenance, authorized Memory Threads, and professional practice records. The standalone History page must not fabricate metrics or expose raw evidence merely because it is convenient for UI design.

## Cross-domain continuity

Coach is a separate web origin. Product Bridge destination references may be destination-relative in the trusted contract, but Coach's web boundary must qualify Learn/Teach return references against the canonical ecosystem domain registry before browser navigation.

Canonical URL ownership is centralized in `@lurexa/config`.

## Deployment

Expected deployment contract:

- workspace: `@lurexa/coach-web`
- root directory: `apps/coach-web`
- Vercel project: `lurexa-coach-web`
- canonical domain: `coach.lurexa.org`
- local development: `http://localhost:3005`

The deployment becomes `active` only after the Vercel project is actually provisioned and verified. Until then, the repository manifest should describe it as `provisioned` rather than claiming a deployment that does not exist.

## Non-goals

This decision does **not**:

- create a second Lurexa identity;
- move curriculum ownership from Learn;
- move qualification ownership from Core;
- move professional-development ownership from Teach;
- duplicate Lurexa Mind inside Coach;
- create a second persistent learner model;
- make Coach a generic unrestricted chatbot.

## Governing UX principle

Coach should feel conversational, responsive, alive, and speaking-first while retaining the shared Lurexa design grammar, accessibility contracts, identity model, and trusted platform boundaries.

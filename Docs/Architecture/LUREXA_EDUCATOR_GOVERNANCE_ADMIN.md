# Lurexa Educator Governance in Admin

Status: **Normative architecture contract**  
Owner: Lurexa Learning Technologies  
Date: 2026-08-25  
Authority: subordinate to `Docs/00-Lurexa-Bible.md` and `LUREXA_EDUCATOR_IDENTITY_QUALIFICATION_MODEL.md`

## Principle

> **Admin may authorize a qualified educator to teach. Admin may not manufacture teaching qualification from an institutional role.**

Lurexa separates four concerns:

1. canonical Lurexa identity;
2. product entitlement;
3. evidence-backed educator qualification;
4. institution/program/course teaching authorization.

Organization membership (`owner`, `admin`, `teacher`) is affiliation and governance context. It is not proof of professional competence.

## Admin responsibility

Lurexa Admin owns institutional governance of teaching assignments. For educator access it may:

- inspect educator-affiliated organization members;
- inspect product entitlements;
- inspect trusted qualification records and their evidence/provenance summaries;
- inspect active, suspended, and historical teaching authorizations;
- grant an educator authorization to one or more specific organization courses when those courses are inside an active qualified scope;
- suspend or reactivate a teaching authorization;
- retain an auditable record of authorization mutations.

Admin must not in this phase:

- change a membership role to bypass qualification;
- create a `qualified` record directly;
- broaden the levels or subject inside an existing qualification;
- authorize courses in another organization;
- authorize a subject or CEFR level outside the chosen qualification;
- delete authorization history.

Qualification creation, review, expiry, suspension and revocation belong to the separate **qualification lifecycle**.

## Authorization decision

A new teaching grant is valid only when all of the following are true:

```text
actor may govern the organization
AND educator has an active qualified scope
AND every requested course belongs to the organization
AND every requested course subject is covered by the qualification
AND every requested course level is covered by the qualification
```

The grant records:

- educator identity;
- organization;
- exact course IDs;
- subject;
- levels;
- qualification ID used as its professional basis;
- administrator who granted it;
- grant timestamp;
- optional validity end date;
- active/suspended/expired status.

The authorization is not a copy of the qualification. It is an institutional permission linked to that qualification.

## Governance actors

### Platform superadmin

A platform `super_admin` may govern educator authorization across organizations for platform operations and support.

### Organization owner/admin

An organization `owner` or `admin` may govern teaching authorization only inside their organization.

### Teacher

A `teacher` membership does not provide educator-governance authority. A teacher can be the subject of a qualification/authorization decision but cannot grant themselves or others institutional teaching permission merely because of that affiliation.

## Audit and reversibility

Authorization changes are append-audited in Core. Suspension/reactivation changes status; it does not erase the original grant.

The audit trail must make it possible to answer:

- who changed teaching access;
- for which educator;
- in which organization;
- against which qualification;
- for which course IDs;
- what status resulted;
- when the change happened.

## UI contract

The Admin Educator Governance workspace must visually separate:

- **Affiliation** — organization role;
- **Qualification** — trusted professional scope, read-only here;
- **Teaching authorization** — institution/course permission that Admin may govern.

If no active qualification exists, the UI should explain that a governed qualification lifecycle must be completed rather than offering an override.

If courses do not fit the qualification, they should not be offered as eligible choices; the server must still validate independently.

## Repository mapping

- contracts: `packages/types/src/educator-access.ts`
- Core governance: `packages/backend/src/core/educator-governance.server.ts`
- existing runtime access decision: `packages/backend/src/educator-access.server.ts`
- Admin API: `apps/admin-portal/app/api/admin/educators/route.ts`
- Admin workspace: `apps/admin-portal/app/educators/page.tsx`
- regression gate: `scripts/verify-educator-governance.mjs`

## Relationship to Learn and Teach

Admin teaching authorization is consumed by **Lurexa Learn Teacher Workspace** when deciding whether an educator may operate a specific course.

It does not turn Lurexa Teach into a classroom-management product. Teach remains the professional-learning environment that can help an educator build the evidence needed for a future qualification or qualification extension.

## Next governed phase

The next architecture phase is the educator **qualification lifecycle**:

```text
candidate
→ under review
→ qualified
→ expired / suspended / revoked
```

That lifecycle must preserve evidence references, provenance, decision history, validity dates and human/governed-rule accountability. Mind may recommend readiness; Core owns the authoritative qualification state.

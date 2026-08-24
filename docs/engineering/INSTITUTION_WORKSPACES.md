# Lurexa Campus and Institution Workspaces

Status: Accepted architecture and naming baseline for MVP foundation

## Decision

**Lurexa Campus** is the customer-facing name for Lurexa's institution environment.

The engineering concept remains an **Institution Workspace**: the organization-scoped tenant context that gives a school, academy, university, training provider, or company a coherent Lurexa environment. `InstitutionWorkspace`, `institution-workspace`, and institution-oriented route/domain terminology may remain in code where they improve technical clarity.

This naming split is intentional:

- **Customer-facing brand:** Lurexa Campus
- **Technical architecture:** Institution Workspace
- **Administrative control plane:** Lurexa Admin

Lurexa Campus is **not** a new sibling product that owns Learn, Teach, Admin, Insight, Coach, or Studio. It is the institution-facing experience and tenant context through which an organization accesses the Lurexa products and capabilities to which it is entitled.

Lurexa Admin remains the control plane for institutional administration. It must not become a Moodle/Canvas-style monolith that duplicates learning, teaching, analytics, coaching, or authoring workflows.

## Positioning

Preferred category description:

> **Lurexa Campus is one intelligent learning environment for an institution, connecting its people, governance, learning products, and authorized learning intelligence through one coherent Lurexa experience.**

Primary positioning line:

> **One intelligent learning environment for your entire institution.**

Approved supporting lines for marketing exploration:

- Your institution. One connected learning ecosystem.
- Where your institution learns, teaches, and grows.
- One campus. Every learner. Every Lurexa experience connected.
- One institution. One learning ecosystem. Every learner connected.

The primary product-level governing principle remains:

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

## Administrative scopes

Lurexa Admin has two distinct scopes:

1. **Platform Admin** — Lurexa-operated global administration across all organizations.
2. **Institution Admin** — organization-scoped administration for an institution's authorized owners/admins inside the Lurexa Campus context.

The existing `apps/admin-portal` Platform Operations dashboard is the Platform Admin surface and remains authoritative for global organization operations.

## Experience model

An institution should perceive one coherent Campus while users enter the specialist Lurexa experiences appropriate to their role and entitlements.

Typical experience:

```text
Lurexa Campus — ABC Language Academy
│
├── Overview
├── People
├── Groups
├── Learning        → Lurexa Learn
├── Professional Growth → Lurexa Teach
├── Analytics       → Lurexa Insight
├── Coaching        → Lurexa Coach (when entitled)
├── Creation        → Lurexa Studio (when entitled)
├── Products & Access
└── Settings        → Lurexa Admin controls
```

Campus does not technically own these products. It supplies a coherent organization context, identity, navigation model, branding layer, and entitlement-aware entry point.

Individual users may also access Lurexa products outside an institutional Campus where the commercial model allows it.

## Product boundaries

| Capability | Owner |
| --- | --- |
| Tenant identity, authorization, membership, trusted records, persistence | Lurexa Core |
| Campus organization settings, roster administration, permissions, product access, policies, audit administration | Lurexa Admin |
| Student learning experience, assigned learning, progress interactions | Lurexa Learn |
| Educator professional development and professional-growth experience | Lurexa Teach |
| Institution analytics and reporting experience | Lurexa Insight |
| AI interpretation, recommendations, interventions, learner-model intelligence | Lurexa Mind |
| Speaking/pronunciation coaching | Lurexa Coach |
| Authoring/creative tooling where applicable | Lurexa Studio |

Admin and Campus may present summaries and deep links from other products, but they must not duplicate those products' primary workflows.

## Workspace model

A Campus is backed by an Institution Workspace tenant context. A user enters an organization context and sees only the products and capabilities allowed by both their role and the institution's entitlements.

Recommended technical route grammar:

- `/institutions/[organizationId]` — Campus home/control overview
- `/institutions/[organizationId]/people` — members, invitations, roles
- `/institutions/[organizationId]/groups` — cohorts/classes/organizational groups
- `/institutions/[organizationId]/access` — product entitlements and seats
- `/institutions/[organizationId]/settings` — profile, branding, policies
- `/institutions/[organizationId]/audit` — administrative audit events

Customer-facing navigation should say **Campus**, not "Institution Workspace". Route names do not need to be renamed merely to mirror marketing language.

Cross-product navigation must preserve organization context when linking into Learn, Teach, Insight, Coach, or Studio. A later deployment may expose institution-branded subdomains or custom domains without changing the underlying tenant model.

## Roles

The repository already defines trusted organization roles `owner`, `admin`, `teacher`, and `student` through `MemberRole`; Campus must reuse those roles rather than introduce a parallel role vocabulary. Platform-wide Lurexa administration remains the separate `super_admin` user role.

Add specialist roles only when a real permission requirement exists. Avoid role proliferation during MVP.

## Trusted Core records

Core remains authoritative for organization-scoped security and relationship facts. Existing trusted contracts already include:

- `Organization`
- `OrganizationMember`
- `Invitation`

Institution Workspace infrastructure adds only contracts that are not already represented, beginning with:

- `InstitutionBranding`
- `InstitutionProductEntitlement`
- `InstitutionWorkspaceContext`
- a future trusted administrative `AuditEvent` contract when audit persistence is implemented

These internal names remain valid after the Lurexa Campus naming decision.

Cohorts, classes, course assignments, and enrollments must be placed according to domain ownership. Admin may manage them, but this does not automatically mean Admin owns their canonical records. Course content, lesson content, submissions, and learner-model interpretation do not belong to Admin.

## Campus MVP scope

1. Institution profile and co-branding
2. Campus home/overview
3. Member directory and invitations
4. Student roster
5. Teacher roster
6. Roles and permissions
7. Groups/cohorts
8. Product access, seats, and entitlements
9. Institution-level operational dashboard
10. Organization/Campus switcher for users belonging to multiple institutions
11. Role-aware deep links into Learn, Teach, Insight, Coach, and Studio where entitled
12. Basic administrative audit log

Later phases may add SAML/OIDC SSO, SCIM provisioning, SIS integrations, custom domains, delegated billing, advanced policy controls, richer institutional reporting, and deeper co-branding.

## Commercial model

Campus is the institution-facing container for an organization's subscribed Lurexa capabilities. Example bundles may include:

- Learn + Admin
- Learn + Admin + Insight
- Learn + Teach + Admin + Insight
- Learn + Coach + Admin
- broader Campus suites that include Studio or future products

Entitlements, seats, and plan rules are trusted platform concerns. Campus makes those entitlements feel like one environment; it must not hard-code a single bundle.

## Authorization rule

Every institution-admin request must be authorized server-side against the requested organization. Client-side route guards are not sufficient. `super_admin` authorization and organization-scoped `owner`/`admin` authorization must remain separate concepts.

Lurexa Mind must never decide access. It may consume authorized context supplied through Core contracts, but Core remains authoritative for identity, permissions, membership, and trusted persistence.

## Campus UX and brand principle

Campus should feel **connected, welcoming, institutionally confident, and intelligent**. It is more inviting and orienting than Admin, but more structured and institution-aware than Learn.

Campus must:

- visibly identify the institution and the Lurexa relationship;
- support institution co-branding without hiding the Lurexa product identity;
- orient users toward the right product rather than reproduce every workflow itself;
- preserve organization context across products;
- surface only entitled capabilities;
- make role and organization switching explicit;
- feel like one ecosystem without making every Lurexa product visually identical.

Avoid making Campus look like a generic enterprise dashboard, a database console, or a tile launcher with no meaningful institutional context.

## Naming rules

Use **Lurexa Campus** in:

- marketing and sales language;
- institution-facing navigation and UI headings;
- onboarding and institutional setup copy;
- customer documentation;
- pricing/bundle descriptions where the institution environment is being described.

Use **Institution Workspace** / `InstitutionWorkspace` where useful in:

- architecture documentation when describing the tenant-context implementation;
- types and service contracts;
- authorization/domain terminology;
- tests and internal engineering discussions.

Do not rename stable internal contracts solely for branding consistency unless there is an independent engineering reason.

## MVP implementation guardrails

- Preserve the existing Platform Operations dashboard as a global superadmin surface.
- Reuse the existing `organizations/{organizationId}/members` membership model and trusted organization contracts.
- Do not expose organization routes to institution administrators until server-side organization membership authorization exists.
- Do not create fake Campus metrics or mock trusted records in production paths.
- Do not move learning, professional-development, coaching, authoring, or analytics domain logic into Admin.
- Add new organization-scoped API routes only after Core authorization rules are defined and tested.
- Prefer additive migration over renaming existing global-admin routes during MVP.
- Preserve `InstitutionWorkspaceContext` and related internal type names unless a later technical migration justifies change.

## Migration note

The prior customer-facing phrase **Institution Workspace** is superseded by **Lurexa Campus**. Existing technical usage of Institution Workspace remains valid and is not deprecated by this branding decision.

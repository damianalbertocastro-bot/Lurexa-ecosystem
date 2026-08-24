# Lurexa Institution Workspaces

Status: Proposed architecture accepted for MVP foundation

## Decision

Lurexa Admin is not the learning-management product and must not become a Moodle/Canvas-style monolith.

An **Institution Workspace** is the tenant context that gives a school, academy, university, training provider, or company a coherent Lurexa space. The workspace composes the Lurexa products the institution is entitled to use.

Lurexa Admin is the **control plane** for that institution workspace.

This creates two distinct administrative scopes:

1. **Platform Admin** — Lurexa-operated global administration across all organizations.
2. **Institution Admin** — organization-scoped administration for an institution's authorized owners/admins.

The existing `apps/admin-portal` Platform Operations dashboard is the Platform Admin surface and remains authoritative for global organization operations.

## Product boundaries

| Capability | Owner |
| --- | --- |
| Tenant identity, authorization, membership, trusted records, persistence | Lurexa Core |
| Institution settings, roster administration, permissions, product access, policies, audit administration | Lurexa Admin |
| Student learning experience, assigned learning, progress interactions | Lurexa Learn |
| Teacher/faculty workflow and instructional management | Lurexa Teach |
| Institution analytics and reporting experience | Lurexa Insight |
| AI interpretation, recommendations, interventions, learner-model intelligence | Lurexa Mind |
| Authoring/creative tooling where applicable | Lurexa Studio |

Admin may present summaries and deep links from other products, but it must not duplicate their primary workflows.

## Workspace model

An institution workspace is a tenant context, not a new standalone end-user product. A user enters an organization context and sees only the products and capabilities allowed by both their role and the institution's entitlements.

Recommended route grammar:

- `/institutions/[organizationId]` — institution home/control overview
- `/institutions/[organizationId]/people` — members, invitations, roles
- `/institutions/[organizationId]/groups` — cohorts/classes/organizational groups
- `/institutions/[organizationId]/access` — product entitlements and seats
- `/institutions/[organizationId]/settings` — profile, branding, policies
- `/institutions/[organizationId]/audit` — administrative audit events

Cross-product navigation should preserve organization context when linking into Learn, Teach, or Insight. A later deployment may expose organization-branded subdomains without changing the underlying tenant model.

## Roles

MVP roles should stay intentionally small:

- `platform_admin` — Lurexa internal global administrator
- `org_owner` — highest institution-level authority
- `org_admin` — delegated institution administrator
- `teacher` — instructional staff member
- `student` — learner

Add specialist roles only when a real permission requirement exists. Avoid role proliferation during MVP.

## Trusted Core records

Core should remain authoritative for organization-scoped security and relationship facts. Candidate records/contracts:

- `Organization`
- `OrganizationMembership { organizationId, userId, role, status }`
- `OrganizationInvitation { organizationId, email, role, status, expiresAt }`
- `OrganizationBranding`
- `ProductEntitlement { organizationId, product, plan, seats, status }`
- `AuditEvent`

Cohorts, classes, course assignments, and enrollments must be placed according to domain ownership. Admin may manage them, but this does not automatically mean Admin owns their canonical records. Course content, lesson content, submissions, and learner-model interpretation do not belong to Admin.

## MVP institution-admin scope

1. Institution profile and branding
2. Member directory and invitations
3. Student roster
4. Teacher roster
5. Roles and permissions
6. Groups/cohorts
7. Product access, seats, and entitlements
8. Institution-level operational dashboard
9. Organization switcher for users belonging to multiple institutions
10. Role-aware deep links into Learn, Teach, and Insight
11. Basic administrative audit log

Later phases may add SAML/OIDC SSO, SCIM provisioning, SIS integrations, custom domains, delegated billing, advanced policy controls, and richer institutional reporting.

## Authorization rule

Every institution-admin request must be authorized server-side against the requested organization. Client-side route guards are not sufficient. `platform_admin` authorization and organization-scoped authorization must remain separate concepts.

Lurexa Mind must never decide access. It may consume authorized context supplied through Core contracts, but Core remains authoritative for identity, permissions, membership, and trusted persistence.

## UX principle

Institutions should experience Lurexa as one coherent workspace while the implementation remains modular.

The institution sees one branded environment. A student primarily experiences Learn. A teacher primarily experiences Teach. An institutional administrator primarily experiences Admin. Leaders and analysts primarily experience Insight. Shared navigation, tenant context, identity, and learner continuity make these experiences feel like one platform without collapsing them into one application.

## MVP implementation guardrails

- Preserve the existing Platform Operations dashboard as a global superadmin surface.
- Do not expose organization routes to institution administrators until server-side organization membership authorization exists.
- Do not create fake institution metrics or mock trusted records in production paths.
- Do not move learning, teaching, or analytics domain logic into Admin.
- Add new organization-scoped API routes only after Core contracts and authorization rules are defined and tested.
- Prefer additive migration over renaming existing global-admin routes during MVP.

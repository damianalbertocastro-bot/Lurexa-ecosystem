# Lurexa Campus — Implementation Roadmap

- Status: **Approved implementation sequence**
- Depends on: Lurexa Core organization/authorization foundation
- Customer-facing name: **Lurexa Campus**
- Technical tenant concept: **Institution Workspace**
- Control plane: **Lurexa Admin**

## Objective

Deliver a secure, coherent institution environment without creating a monolithic LMS or duplicating specialist Lurexa product workflows.

## Phase C0 — Architecture and naming foundation

- [x] Approve Lurexa Campus as the customer-facing institution name.
- [x] Preserve Institution Workspace as the technical tenant concept.
- [x] Define Campus vs Admin vs Core vs specialist-product boundaries.
- [x] Define Campus brand/personality direction.
- [x] Add shared institution branding, entitlement and workspace-context contracts.
- [x] Document migration rule: customer-facing rename does not require internal contract churn.

Exit condition: architecture, naming, branding and internal terminology are unambiguous.

## Phase C1 — Trusted organization authorization

- [ ] Implement a reusable server-side organization authorization service in the Core/backend boundary.
- [ ] Resolve authenticated user identity from trusted Firebase credentials.
- [ ] Resolve `organizations/{organizationId}/members/{membership}` or equivalent trusted membership state.
- [ ] Enforce `owner` / `admin` permissions for institution-administration actions.
- [ ] Preserve `super_admin` as a separate platform-wide scope.
- [ ] Add tests for cross-tenant denial, missing membership, suspended organization, role mismatch and valid membership.
- [ ] Define organization-context propagation contract for cross-product links/API calls.

Exit condition: no Campus or Institution Admin operation relies on client-side authorization alone.

## Phase C2 — Institution Admin API foundation

- [ ] Add organization-scoped Campus/Admin snapshot endpoint.
- [ ] Add institution profile and branding read/update endpoints.
- [ ] Add member directory endpoints.
- [ ] Add invitation create/revoke/accept lifecycle where not already available.
- [ ] Add role-management endpoints with safe owner/admin rules.
- [ ] Add product-entitlement read endpoints.
- [ ] Add basic administrative audit-event persistence contract.
- [ ] Validate all writes against organization-scoped authorization.

Exit condition: institution owners/admins can safely administer their organization through trusted APIs.

## Phase C3 — Lurexa Campus shell

- [ ] Create `/institutions/[organizationId]` Campus shell.
- [ ] Show institution identity and Lurexa Campus identity together.
- [ ] Add Campus overview/home.
- [ ] Add role and organization context to the shell.
- [ ] Add organization switcher for users with multiple memberships.
- [ ] Add loading/error/empty states that do not leak cross-tenant information.
- [ ] Add responsive and WCAG 2.2 AA-oriented navigation behavior.

Suggested navigation foundation:

- Overview
- People
- Groups
- Learning
- Professional Growth
- Analytics
- Coaching
- Creation
- Products & Access
- Settings

Only show destinations that are valid for the user's role and organization entitlements.

Exit condition: an authorized institutional user can enter a coherent Campus and understand where they are, what role they have, and what they can access.

## Phase C4 — People, roles and groups

- [ ] People directory.
- [ ] Student roster.
- [ ] Teacher roster.
- [ ] Invitations.
- [ ] Role changes with consequential-action safeguards.
- [ ] Groups/cohorts foundation.
- [ ] Search/filter/pagination suitable for institution scale.
- [ ] Basic member-status and access indicators.

Exit condition: an institution can manage its people without direct database access.

## Phase C5 — Product access and entitlements

- [ ] Persist/resolve institution product entitlements through trusted Core contracts.
- [ ] Display entitled Lurexa experiences.
- [ ] Display seats/limits where commercial rules require them.
- [ ] Provide role-aware entry points into entitled products.
- [ ] Hide or clearly upsell unavailable products without fabricating access.
- [ ] Keep commercial package names outside hard-coded authorization logic.

Exit condition: Campus navigation accurately reflects what the institution has purchased and what the current user may use.

## Phase C6 — Cross-product organization continuity

- [ ] Preserve organization context when entering Lurexa Learn.
- [ ] Preserve organization context when entering Lurexa Teach.
- [ ] Preserve organization context when entering Lurexa Insight.
- [ ] Preserve organization context when entering Coach and Studio where entitled.
- [ ] Define safe return-to-Campus behavior.
- [ ] Avoid duplicating product workflows inside Campus.
- [ ] Validate that a user belonging to multiple institutions cannot accidentally carry the wrong tenant context across products.

Exit condition: users experience one connected Campus without hidden cross-product tenant ambiguity.

## Phase C7 — Co-branding foundation

- [ ] Institution display name.
- [ ] Institution logo.
- [ ] Approved accent customization.
- [ ] Accessible contrast validation.
- [ ] Lurexa trust/product identity preservation rules.
- [ ] Campus preview before branding changes are published.
- [ ] Optional branded subdomain design contract.

Later:

- [ ] custom domains;
- [ ] richer theme controls;
- [ ] branded email/notification templates where appropriate.

Exit condition: institutions can feel ownership of their Campus without white-labeling away Lurexa trust or harming accessibility.

## Phase C8 — Institutional operations and audit

- [ ] Campus operational summary.
- [ ] Membership/activity health indicators.
- [ ] Entitlement/seat status.
- [ ] Administrative audit timeline.
- [ ] Clear deep links to Lurexa Insight for full analytics.
- [ ] Policy/configuration surfaces that belong to Admin.

Exit condition: institution administrators can operate the environment while Insight remains the analytics product.

## Phase C9 — Enterprise readiness

Deferred until justified by customer demand:

- [ ] SAML/OIDC SSO.
- [ ] SCIM provisioning.
- [ ] SIS integrations.
- [ ] delegated administration.
- [ ] advanced role/policy controls.
- [ ] custom domains.
- [ ] multi-campus / district hierarchy if required.
- [ ] contract-specific data residency and governance controls.
- [ ] enterprise billing and procurement workflows.

## MVP release gate

Lurexa Campus MVP is not ready until all of the following are true:

1. Tenant isolation is tested server-side.
2. Platform Admin and Institution Admin scopes are demonstrably separate.
3. Campus can identify the active organization and user role.
4. People and access management use trusted APIs.
5. Product entitlements are enforced rather than merely hidden in UI.
6. Cross-product navigation preserves organization context safely.
7. Campus co-branding remains accessible and recognizably Lurexa.
8. Learn, Teach, Insight, Coach, Studio and Admin responsibilities have not been duplicated into Campus.
9. No production path relies on fake institution metrics or mock trusted records.
10. Relevant CI, lint, type-check and tests are green.

## Non-goals

Do not create a separate `institution-portal` application merely because Campus has its own customer-facing name.

Do not rename `InstitutionWorkspaceContext` or organization-domain contracts solely for marketing consistency.

Do not implement Campus by embedding all specialist products into a single codebase or by weakening Core authorization boundaries.

## References

- `Docs/00-Lurexa-Bible.md`
- `Docs/Product/LUREXA_CAMPUS_PRODUCT_DEFINITION.md`
- `Docs/Product/Product Portfolio and Boundaries.md`
- `Docs/Design/PRODUCT_PERSONALITY_SYSTEM.md`
- `docs/engineering/INSTITUTION_WORKSPACES.md`

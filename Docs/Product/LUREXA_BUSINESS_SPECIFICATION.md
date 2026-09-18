# Lurexa Business — Product & Commercial Contract Specification

**Status:** Architecture contract — Phase 7

Business is one organization-level commercial subscription/contract. It is not an individual fourth tier and does not require rigid product bundles.

## Customer definition

Initial target: small and medium organizations needing coordinated learning, teaching, administration, analytics and governed AI usage.

## User model

Business users belong to an organization and receive one or more roles:

- organization_owner — contractual and organization authority
- organization_admin — operational administration
- program_manager — cohorts, assignments and program reporting
- teacher — teaching and learner support
- learner — assigned learning experiences
- analyst — purpose-scoped analytics/reporting
- auditor — read-only audit/compliance access

Roles are authorization inputs, not commercial entitlements. A role cannot grant a capability the organization did not contract.

## Product access

Business contracts may attach any authorized combination of Learn, Coach, Teach, Admin, Insight and Studio.

## Standard capabilities

groups/cohorts, assignments, analytics, reporting, role management, audit, SSO, data export and teacher/admin management.

Contracted extensions may include custom curriculum, Studio authoring, branding and integrations.

## Workforce learning

Business supports organization-scoped cohorts and programs, role-appropriate assignments, professional-growth pathways through Teach, Coach practice for authorized professional contexts, aggregate progress reporting, and organization-controlled retention/export policies.

Individual learner evidence remains governed by Core. Organizational analytics use purpose-scoped projections and privacy thresholds.

## AI governance

Every organizational AI request must resolve identity, organization membership, role authorization, product access, capability entitlement, usage/quota, approved AI task contract, AI Gateway policy, and provenance/usage record.

Governance must support provider allowlists, prompt/task versioning, model provenance, usage accounting, retention policy, safety constraints and an auditable decision path.

Business usage remains pooled at organization level, with optional individual limits.

## Commercial tiering

The approved model is contract/quote based, so public Business SKUs and fixed prices are intentionally not defined here.

Internal contracts may use capability profiles such as baseline, expanded or custom without turning those profiles into public product bundles. Each profile resolves to explicit capabilities, quotas, support terms and integrations.

No Business price may be inferred from a capability profile.

## Acceptance criteria

- Business is modeled as an organization contract.
- Roles are separate from entitlements.
- Products are independently attachable.
- AI governance is enforceable server-side.
- Usage is pooled and attributable to product, capability and provider.
- Analytics are purpose-scoped.
- No fixed public Business price is introduced.

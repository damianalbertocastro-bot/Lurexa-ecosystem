# Lurexa Campus — Authoritative Institutional Capability Matrix

**Status:** Architecture contract — Phase 6

Campus is the institutional shell. Institutional profiles are capability profiles, not product bundles. Products attach to organizations independently.

## Institutional profiles

| Profile | Meaning | Default capability direction | Product attachment |
|---|---|---|---|
| free_community | Community / pilot organization | organization identity, basic member management, limited Learn access | Learn when granted; no implied Teach/Insight/Studio |
| standard_institutional | Standard institutional program | organization management, groups/cohorts, assignments, baseline reporting, Learn/Teach administration | Learn and Teach attach independently; Insight only when granted |
| campus_pro | Expanded Campus program | Standard plus analytics, advanced role management, audit and broader orchestration | Learn, Teach, Coach, Insight and Studio attach independently |
| enterprise | Legacy institutional identifier | Migration-only compatibility input | Resolve to explicit contract capabilities; never use identifier as authority |

## Authoritative capability families

Campus authorization resolves identity and tenant, organization roles, product access, groups/cohorts, assignments, analytics/reporting, audit, SSO, data export, teacher/admin management, custom curriculum, Studio authoring, branding and integrations.

A product is attachable only when the organization has the product capability and the user has the required role authorization. A profile name alone never grants access.

## Migration rule

Existing free_community, standard_institutional, campus_pro and enterprise records may be read as migration inputs. New authorization code must resolve their effective capability projection instead of comparing the raw tier string.

enterprise is not a new price tier. It is a legacy institutional identifier until migrated to an explicit organization contract.

## Acceptance criteria

- No new runtime authorization depends directly on a legacy institutional tier string.
- Campus can attach or detach products without creating bundle SKUs.
- Organization capabilities are independently testable.
- User role authorization is evaluated separately from organization entitlement.
- Product Bridge receives only authorized destination context.

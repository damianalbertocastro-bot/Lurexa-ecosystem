# Phase 3 — Individual & Educator Entitlement Migration

Status: Contract implemented / migration started
Date: 2026-09-18

## Implemented

- Plus checkout now requires an explicit product selection.
- Plus selection is constrained to Learn, Coach, or Teach.
- Non-Plus checkout rejects a Plus-only product selection.
- Completed Plus webhook payloads require selected-product metadata.
- The canonical entitlement model already supports subscription, educator-benefit, and product/capability grants independently.

## Preserved boundaries

- Teach Plus is a consumer/individual product subscription choice.
- Verified educator `educator.coach_full` remains a separate benefit.
- T1–T5 remain professional stages and are not plan tiers.
- Qualification and teaching authorization remain outside subscription state.
- ElevenLabs remains capability/entitlement controlled and is not a fallback provider.

## Not yet migrated

The following legacy consumers still depend on `SubscriptionTier` / `DEFAULT_TIER_QUOTAS` and require a controlled migration:
- quota enforcement;
- Coach live streaming;
- batch provisioning;
- billing UI and recommendation UI;
- Mind recommendation logic;
- other legacy subscription displays.

They must migrate only after scoped quota contracts and capability checks are available.

## Verification requirement

A production migration is not complete until CI demonstrates that:
- Plus checkout cannot create an ambiguous subscription;
- entitlement resolution grants only the selected Plus product;
- educator Coach benefit can exist without consumer Coach Plus;
- consumer subscription state cannot manufacture qualification or teaching authorization;
- legacy plan checks no longer control premium capability access.

## Next

Phase 4 — Institutional & Business Entitlement Model:
- introduce organization-scoped grants;
- separate institutional tiers from consumer subscription types;
- model organization seat/quota pools;
- add Campus bundle configuration without hard-coded product combinations;
- establish Business capability contracts without inventing commercial SKUs.

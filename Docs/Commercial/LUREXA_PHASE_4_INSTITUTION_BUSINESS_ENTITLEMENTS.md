# Phase 4 — Institutional & Business Entitlement Model

Status: Contract implemented
Date: 2026-09-18

## Implemented

Organization contracts now distinguish:
- institutional vs business commercial context;
- organizational product/capability bundles;
- organization-level seat allocation;
- organization quota pools;
- individual organization seat grants;
- flexible Campus bundles;
- Business workforce contracts.

## Institutional model

The existing technical institutional tiers remain:
- `free_community`
- `standard_institutional`
- `campus_pro`
- `enterprise`

A tier does not itself hard-code a product bundle. An organization contract carries its actual products and capabilities.

This permits Campus to support combinations such as Learn + Admin, Learn + Admin + Insight, Learn + Teach + Admin + Insight, Learn + Coach + Admin, or broader suites without encoding those combinations into tier logic.

## Business model

Business remains a separate commercial context. `planCode` is intentionally opaque so the repository does not invent public Business SKU names or prices before the commercial decision is approved.

Business contracts can independently express:
- products;
- workforce capabilities;
- seats;
- quota pools;
- support level;
- integration codes;
- lifecycle.

## Trust boundary

Organization contracts and seat grants are trusted Core records. Organization membership alone does not imply every product or capability in the contract.

Teaching qualification and teaching authorization remain separate from commercial access.

## Next

Phase 5 — Capability Enforcement & Quota Migration:
- replace legacy tier checks in production capability paths;
- add capability assertions;
- migrate AI/speech access to capability-aware gates;
- migrate quotas to scoped ledgers;
- preserve provider policy: OpenRouter-primary roleplay, Gemini instructional tasks, ElevenLabs premium speech.

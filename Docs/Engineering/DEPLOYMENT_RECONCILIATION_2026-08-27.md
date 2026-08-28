# Deployment Reconciliation — 2026-08-27

This document records a point-in-time comparison between `deployment/products.json` and the connected Lurexa1 Vercel team. It is evidence for repository reconciliation, not a permanent claim about external uptime.

## Lifecycle vocabulary

The deployment manifest now uses explicit states:

- `declared` — repository intent exists but the external project is not verified.
- `provisioned` — the expected external project exists, but preview/production runtime acceptance is not yet proven.
- `preview-ready` — a verified preview deployment is reachable and passes the required smoke checks.
- `production-live` — the production deployment/domain is externally verified and passes runtime acceptance.
- `shared-deployment` — the surface intentionally shares another deployment rather than owning a second project.
- `non-vercel` — deployable surface is intentionally outside Vercel.
- `retired` — deployment is no longer an active target.

## Connected Vercel team

- Team: `Lurexa1`
- Team slug: `lurexa1`
- Repository link observed on all six Vercel projects: `damianalbertocastro-bot/Lurexa-ecosystem`
- Node runtime observed: `24.x`

## Live project inventory

| Lurexa surface | Repository workspace | Vercel project observed | Canonical/custom domain observed | Vercel `live` at audit | Manifest state after reconciliation |
| --- | --- | --- | --- | --- | --- |
| Ecosystem | `web` | `lurexa` | no `lurexa.org` domain was returned by the connected project view | `false` | `provisioned` |
| Learn learner web | `learn-web` | `lurexa-learn-web` | `learn.lurexa.org` | `false` | `provisioned` |
| Learn Teacher Workspace | `learn-web` | shares `lurexa-learn-web` | shares Learn deployment | n/a | `shared-deployment` |
| Coach | `@lurexa/coach-web` | `coach-web` | `coach.lurexa.org` | `false` | `provisioned` |
| Teach | `@lurexa/teach-web` | `lurexa-teach-web` | `teach.lurexa.org` | `false` | `provisioned` |
| Admin | `admin-portal` | `lurexa-admin` | `admin.lurexa.org` plus stale `lurexa-learn.vercel.app` alias | `false` | `provisioned` |
| Docs | `docs` | `docs` | Vercel-generated aliases only in the connected project view | `false` | `provisioned` |
| Learn mobile | `mobile` | none by design | native/mobile release channel | n/a | `non-vercel` |

## Runtime evidence observed

At the time of this audit, none of the six Vercel projects returned `live: true` from the connected project API.

The most recent project states observed included:

- Coach: latest deployment was `BUILDING` when first inspected.
- Learn: latest deployment was `CANCELED`.
- Teach: latest deployment was `CANCELED`.
- Admin: latest deployment was `CANCELED`.
- Ecosystem: latest deployment was `CANCELED`.
- Docs: latest deployment was `CANCELED`.

These recent canceled deployments were largely branch/PR-triggered builds. They do not by themselves prove that older production deployments are broken, but they also do not satisfy the evidence required for `production-live`.

## Reconciliation decisions

1. `active` is retired as a deployment status because it conflated repository intent with verified runtime state.
2. Existing projects are conservatively classified as `provisioned` until preview/production acceptance is demonstrated.
3. Learn Teacher Workspace is explicitly `shared-deployment`; it must not be modeled as an independent Vercel project.
4. The actual Coach project name is `coach-web`; the manifest now records the external resource that actually exists rather than an assumed `lurexa-coach-web` name.
5. Mobile remains outside Vercel.

## External corrections still required

### Admin stale alias

The `lurexa-admin` project currently exposes `lurexa-learn.vercel.app` in addition to its Admin domains. That Learn-family alias should be removed from the Admin project after confirming it is not intentionally referenced anywhere.

### Production acceptance

Each provisioned web project needs a deliberate production reconciliation pass:

1. verify root directory;
2. verify production branch;
3. verify required environment variables;
4. verify canonical domain and DNS;
5. create or identify an intended production deployment;
6. smoke-test the canonical URL;
7. check runtime errors/logs;
8. only then promote the manifest state to `production-live`.

## Promotion rule

No repository edit, successful build, manifest entry, Vercel project existence, or custom-domain attachment is sufficient by itself to claim `production-live`.

Promotion requires external runtime evidence and should be recorded with the exact project, deployment, domain, and acceptance result used to justify the promotion.

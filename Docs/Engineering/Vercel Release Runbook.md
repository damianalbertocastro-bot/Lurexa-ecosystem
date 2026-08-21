# Vercel Product Release Runbook

Status: active release procedure  
Scope: explicit Lurexa web deployments from the monorepo

## Policy

Git-triggered Vercel deployments remain disabled for Lurexa product projects. GitHub CI validates repository changes, but a Vercel build is created only when a product release is explicitly requested.

The canonical deployment topology is `deployment/products.json`. Do not rely on the root `.vercel` link to choose a project.

## Required local environment

The release script reads credentials from the local shell only:

- `VERCEL_TOKEN`
- `VERCEL_TEAM_ID`

Do not commit either value.

## Safe workflow

1. Synchronize and validate `main`.
2. Run the release command without `--apply` and inspect the dry-run output.
3. Create a Preview deployment of the exact validated commit.
4. Exercise the product-specific runtime acceptance checks.
5. Promote by creating a production deployment from the same commit only after preview acceptance.

## Lurexa Learn

Dry run:

```powershell
pnpm deploy:learn:preview -- --sha <validated-main-sha>
```

Create Preview:

```powershell
pnpm deploy:learn:preview -- --sha <validated-main-sha> --apply
```

Create Production from the same accepted SHA:

```powershell
pnpm deploy:learn:production -- --sha <validated-main-sha> --apply
```

## Generic product release

Use the deployment `id` from `deployment/products.json`:

```powershell
pnpm deploy:vercel -- --product <deployment-id> --target preview --sha <validated-sha> --apply
```

Supported deployment IDs currently include `ecosystem-web`, `learn-web`, `learn-teacher`, `teach-web`, `admin-web`, and `docs-web`.

## Guardrails

- The script defaults to dry-run. `--apply` is mandatory for a deployment write.
- Preview is the default target.
- A non-Vercel surface such as mobile is rejected.
- The Vercel project comes from the deployment manifest rather than the local project link.
- `forceNew=1` is used by default so the release request produces a fresh deployment instead of silently deduplicating against an older build.
- Production should use the same Git SHA that passed preview acceptance.

## Learn runtime acceptance

Before production promotion, verify at minimum:

- authenticated Learn navigation and lesson loading;
- A1 reference lesson resolution;
- trusted model-listening/TTS route;
- server-owned AI tutor/roleplay continuity;
- microphone recording and spoken-evidence upload;
- learner progress and evidence persistence;
- Mind/retrieval/teacher-return recommendation priority;
- no unexpected 4xx/5xx runtime clusters in Vercel logs.

A successful build alone is not a production acceptance signal.

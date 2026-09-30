# Lurexa Ecosystem: Reconciled Deployment Topology

**Document Version:** 1.1.0  
**Status:** Authoritative Operational Standard  
**Infrastructure Target:** Cloudflare Workers (via OpenNext) & Cloudflare DNS  
**Historical Transition:** Vercel deployment configurations are temporarily retained for reference and rollback contingency, but Cloudflare Workers is the primary live deployment target.

---

## 1. Authoritative Architecture & Surface Mapping

Each deployable web application in the monorepo has an autonomous OpenNext/Cloudflare Worker configuration (`wrangler.toml`). The canonical production domains and isolated preview environments are mapped as follows:

| Application Workspace | Cloudflare Worker (Production) | Canonical Production Domain | Cloudflare Worker (Preview) | Preview / Staging Route | Deployment Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `apps/web` | `lurexa-web` | `https://lurexa.org` | N/A | `lurexa-web.damianalbertocastro.workers.dev` | **Live Deployed (CD on main)** |
| `apps/learn-web` | `lurexa-learn` | `https://learn.lurexa.org` | `lurexa-learn-preview` | `lurexa-learn-preview.damianalbertocastro.workers.dev` | **Active CD on main / Preview Ready** |
| `apps/coach-web` | `lurexa-coach` | `https://coach.lurexa.org` | `lurexa-coach-preview` | `lurexa-coach-preview.damianalbertocastro.workers.dev` | **Active CD on main / Preview Ready** |
| `apps/teach-web` | `lurexa-teach` | `https://teach.lurexa.org` | `lurexa-teach-preview` | `lurexa-teach-preview.damianalbertocastro.workers.dev` | **Active CD on main / Preview Ready** |
| `apps/admin-portal` | `lurexa-admin` | `https://admin.lurexa.org` | N/A | `lurexa-admin.damianalbertocastro.workers.dev` | **Active CD on main** |
| `apps/docs` | `lurexa-docs` | `https://docs.lurexa.org` | N/A | `lurexa-docs.damianalbertocastro.workers.dev` | **Active CD on main** |
| `apps/insight-web` | `lurexa-insight` | `https://insight.lurexa.org` | N/A | `lurexa-insight.damianalbertocastro.workers.dev` | **Active CD on main** |
| `apps/studio-web` | `lurexa-studio` | `https://studio.lurexa.org` | N/A | `lurexa-studio.damianalbertocastro.workers.dev` | **Active CD on main** |
| `apps/mobile` | N/A (Client PWA/App) | Delivered via Learn surface | N/A | N/A | **Client Surface (Not Hosted on Workers)** |

---

## 2. Cloudflare OpenNext Runtime Rules

1. **Compatibility Flags:**
   - Every `wrangler.toml` declares:
     ```toml
     compatibility_date = "2024-12-30"
     compatibility_flags = ["nodejs_compat", "enable_weak_ref", "allow_eval_during_startup"]
     ```
2. **Build Isolation & Cloudflare Workers Builds CI Lifecycle:**
   - In Cloudflare Workers Builds CI, Cloudflare separates the build step (`Executing user build command: pnpm run build`) from the deploy step (`Executing user deploy command: npx wrangler deploy`).
   - Every application workspace configures:
     - `package.json`:
       `"build": "opennextjs-cloudflare build"`, `"build:next": "next build"`, `"build:worker": "opennextjs-cloudflare build"`, `"deploy:worker": "opennextjs-cloudflare deploy"`.
       Workspaces with preview capability additionally configure:
       `"deploy:worker:preview": "opennextjs-cloudflare deploy --env preview"`.
     - `open-next.config.ts`:
       Explicit `buildCommand: "next build"` so OpenNext compiles Next.js directly without recursing into `pnpm run build`.
   - This ensures Cloudflare's CI build step compiles both the Next.js production build and the `.open-next` worker bundles/assets (`.open-next/worker.js`, `.open-next/assets`), allowing subsequent `npx wrangler deploy` (`opennextjs-cloudflare deploy`) to deploy cleanly without "Could not find compiled Open Next config" errors.
3. **Environment Ingestion:**
   - Canonical public environment variables (`NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_LUREXA_*_URL`) are baked into `[vars]` (and `[env.preview.vars]`) within each `wrangler.toml`.
   - Production secrets (`FIREBASE_SERVICE_ACCOUNT_JSON`, `GEMINI_API_KEY`) are managed securely via Cloudflare Worker Secrets (`wrangler secret put`).

---

## 3. Vercel Historical Transition Reconciled

- `deployment/products.json` historically configured individual Vercel projects for each surface.
- Per repository change request, Vercel deployments are temporarily disabled while Cloudflare Workers serves as the primary edge deployment target.
- Verification scripts (`deploy-vercel-product.mjs`) remain intact to validate preview build packaging contracts without blocking the primary Cloudflare CI/CD pipeline.

---

## 4. Production Deployment Standard across All Surfaces

### 4.1 Authoritative Production Branch
- `main` is the designated deployment branch for production across all Cloudflare Workers.
- Every merge or push into `main` automatically triggers production verification and deployments across all affected surfaces.

### 4.2 Automated GitHub Actions CD Pipeline (`.github/workflows/deploy.yml`)
The repository includes a dedicated `production-deployment` job in `.github/workflows/deploy.yml` that executes automatically when commits merge into `main`:
1. **Change Detection:** `dorny/paths-filter` analyzes changed files to selectively target only the affected application workspaces and their shared dependencies (`packages/**`, `tooling/**`, `scripts/**`).
2. **Pre-Deployment Reliability Gate:** All workspace quality checks (lint, TypeScript validation, unit/component tests, build compilation) must pass before deployment commences.
3. **Selective Automated Deployment:** Each affected surface is deployed using `scripts/deploy-cloudflare.mjs --surface <name> --target production --deploy`.
4. **Resilient Secret Handling:** Uses repository secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`). If the token is absent or restricted, executes build verification with dry-run simulation rather than failing CI.
5. **Manual Deployment Support:** Operators can manually trigger production deployments for any single surface or all surfaces via GitHub Actions `workflow_dispatch` (Actions tab -> Product Deployment Validation -> Run workflow).

### 4.3 Cloudflare Dashboard Git Integration (Workers Builds)
In addition to the GitHub Actions CD pipeline, each Worker can be linked directly to GitHub in the Cloudflare Dashboard under **Workers & Pages -> [Worker Name] -> Settings -> Build & Deploy -> Git Integration**:

| Surface | Cloudflare Worker Name | Production Branch | Root Directory | Build Command | Deploy Command | Production Domain |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Ecosystem Web** | `lurexa-web` | `main` | `apps/web` | `pnpm run build` | `npx wrangler deploy` | `lurexa.org` |
| **Lurexa Learn** | `lurexa-learn` | `main` | `apps/learn-web` | `pnpm run build` | `npx wrangler deploy` | `learn.lurexa.org` |
| **Lurexa Coach** | `lurexa-coach` | `main` | `apps/coach-web` | `pnpm run build` | `npx wrangler deploy` | `coach.lurexa.org` |
| **Lurexa Teach** | `lurexa-teach` | `main` | `apps/teach-web` | `pnpm run build` | `npx wrangler deploy` | `teach.lurexa.org` |
| **Lurexa Admin** | `lurexa-admin` | `main` | `apps/admin-portal` | `pnpm run build` | `npx wrangler deploy` | `admin.lurexa.org` |
| **Lurexa Docs** | `lurexa-docs` | `main` | `apps/docs` | `pnpm run build` | `npx wrangler deploy` | `docs.lurexa.org` |
| **Lurexa Insight** | `lurexa-insight` | `main` | `apps/insight-web` | `pnpm run build` | `npx wrangler deploy` | `insight.lurexa.org` |
| **Lurexa Studio** | `lurexa-studio` | `main` | `apps/studio-web` | `pnpm run build` | `npx wrangler deploy` | `studio.lurexa.org` |

*Note: In `apps/*/package.json`, `"build"` is defined as `"opennextjs-cloudflare build"`, so Cloudflare's default `pnpm run build` compiles both Next.js and the Worker bundles seamlessly.*

### 4.4 Operator CLI Deployment Commands
- **Dry-run simulate production deployments (all surfaces):**
  ```bash
  pnpm deploy:cloudflare:dry-run
  ```
- **Deploy all surfaces to production:**
  ```bash
  pnpm deploy:cloudflare:all
  ```
- **Deploy an individual surface to production:**
  ```bash
  node scripts/deploy-cloudflare.mjs --surface learn-web --target production --deploy
  node scripts/deploy-cloudflare.mjs --surface coach-web --target production --deploy
  node scripts/deploy-cloudflare.mjs --surface teach-web --target production --deploy
  node scripts/deploy-cloudflare.mjs --surface admin-web --target production --deploy
  node scripts/deploy-cloudflare.mjs --surface docs-web --target production --deploy
  node scripts/deploy-cloudflare.mjs --surface insight-web --target production --deploy
  node scripts/deploy-cloudflare.mjs --surface studio-web --target production --deploy
  node scripts/deploy-cloudflare.mjs --surface ecosystem-web --target production --deploy
  ```
- **Provision secrets to production workers:**
  ```bash
  pnpm secrets:cloudflare:dry-run
  pnpm secrets:cloudflare:deploy
  ```

---

## 5. Cloudflare Preview Deployments (Pull Requests)

Lurexa Learn, Lurexa Teach, and Lurexa Coach are equipped with dedicated, isolated Cloudflare Preview Deployments to validate functional changes before merging into production.

### Preview Architecture
- **Dedicated Workers:** Each surface defines an `[env.preview]` block in its `wrangler.toml`, deploying to:
  - `lurexa-learn-preview`
  - `lurexa-teach-preview`
  - `lurexa-coach-preview`
- **Routing:** Previews use native `workers_dev = true` routes (`https://<worker-name>.damianalbertocastro.workers.dev`), ensuring zero interference with canonical production domains (`learn.lurexa.org`, `teach.lurexa.org`, `coach.lurexa.org`).
- **Automated Pull Request Deployment:** On every Pull Request touching `learn-web`, `teach-web`, or `coach-web`:
  - GitHub Actions runs the `preview-deployment` job in `.github/workflows/deploy.yml`.
  - Builds worker bundles via OpenNext and deploys to the preview environment using `opennextjs-cloudflare deploy --env preview`.
  - Posts or updates a sticky comment on the PR with direct links to the preview deployments.
  - Graceful fallback: If `CLOUDFLARE_API_TOKEN` is absent (e.g. initial setup or fork PRs), runs build validation and simulation dry-run without failing the status check.

### Operator Preview Commands
- **Simulate preview deployments (all surfaces):**
  ```bash
  pnpm deploy:cloudflare:preview:dry-run
  ```
- **Deploy all preview surfaces:**
  ```bash
  pnpm deploy:cloudflare:preview
  ```
- **Deploy individual preview surfaces:**
  ```bash
  pnpm deploy:learn:cf-preview
  pnpm deploy:teach:cf-preview
  pnpm deploy:coach:cf-preview
  ```
- **Provision secrets to preview workers:**
  ```bash
  pnpm secrets:cloudflare:preview:dry-run
  pnpm secrets:cloudflare:preview:deploy
  ```




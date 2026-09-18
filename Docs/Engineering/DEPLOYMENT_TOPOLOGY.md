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
| `apps/web` | `lurexa-web` | `https://lurexa.org` | N/A | `lurexa-web.damianalbertocastro.workers.dev` | **Live Deployed** |
| `apps/learn-web` | `lurexa-learn` | `https://learn.lurexa.org` | `lurexa-learn-preview` | `lurexa-learn-preview.damianalbertocastro.workers.dev` | **Configured / Preview Ready** |
| `apps/coach-web` | `lurexa-coach` | `https://coach.lurexa.org` | `lurexa-coach-preview` | `lurexa-coach-preview.damianalbertocastro.workers.dev` | **Configured / Preview Ready** |
| `apps/teach-web` | `lurexa-teach` | `https://teach.lurexa.org` | `lurexa-teach-preview` | `lurexa-teach-preview.damianalbertocastro.workers.dev` | **Configured / Preview Ready** |
| `apps/admin-portal` | `lurexa-admin` | `https://admin.lurexa.org` | N/A | `lurexa-admin.damianalbertocastro.workers.dev` | **Configured / Build Verified** |
| `apps/docs` | `lurexa-docs` | `https://docs.lurexa.org` | N/A | `lurexa-docs.damianalbertocastro.workers.dev` | **Configured / Build Verified** |
| `apps/insight-web` | `lurexa-insight` | `https://insight.lurexa.org` | N/A | `lurexa-insight.damianalbertocastro.workers.dev` | **Configured / Build Verified** |
| `apps/studio-web` | `lurexa-studio` | `https://studio.lurexa.org` | N/A | `lurexa-studio.damianalbertocastro.workers.dev` | **Configured / Build Verified** |
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

## 4. Production Deployment Branch Standard

- **Authoritative Production Branch:** `main` is the designated deployment branch for production across all Cloudflare Workers.
- **Continuous Deployment Policy:** All Cloudflare Worker services (`lurexa-web`, `lurexa-learn`, `lurexa-coach`, `lurexa-teach`, `lurexa-admin`, `lurexa-docs`, `lurexa-insight`, `lurexa-studio`) are bound to the `main` branch.
- **Automated Workers Builds:** Merges and direct pushes to `main` trigger automated production builds and deployments in Cloudflare using the declared `[build]` directive (`opennextjs-cloudflare build`) in each `wrangler.toml`.
- **Pre-Merge Validation:** Pull requests targeting `main` must pass all CI reliability gates, including `pnpm verify:cloudflare` (which audits configuration readiness across all 8 surfaces, including preview configurations) and `Product Deployment Validation`.
- **Deployment Coordination CLI:** Operators can inspect and coordinate deployments using `pnpm deploy:cloudflare` (`scripts/deploy-cloudflare.mjs`).
- **Secret Provisioning CLI:** Operators can validate and push production secrets (`FIREBASE_SERVICE_ACCOUNT_JSON`, `GEMINI_API_KEY`) to targeted Workers via:
  - Audit readiness: `pnpm secrets:cloudflare`
  - Dry-run simulation: `pnpm secrets:cloudflare:dry-run`
  - Push secrets to workers: `pnpm secrets:cloudflare:deploy` (or with `--surface <name>` to target a single worker)

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




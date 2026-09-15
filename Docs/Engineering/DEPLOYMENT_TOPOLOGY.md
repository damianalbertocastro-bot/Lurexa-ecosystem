# Lurexa Ecosystem: Reconciled Deployment Topology

**Document Version:** 1.0.0  
**Status:** Authoritative Operational Standard  
**Infrastructure Target:** Cloudflare Workers (via OpenNext) & Cloudflare DNS  
**Historical Transition:** Vercel deployment configurations are temporarily retained for reference and rollback contingency, but Cloudflare Workers is the primary live deployment target.

---

## 1. Authoritative Architecture & Surface Mapping

Each deployable web application in the monorepo has an autonomous OpenNext/Cloudflare Worker configuration (`wrangler.toml`). The canonical production domains are mapped to Cloudflare DNS:

| Application Workspace | Cloudflare Worker Name | Canonical Production Domain | Staging / Development Route | Deployment Status |
| :--- | :--- | :--- | :--- | :--- |
| `apps/web` | `lurexa-web` | `https://lurexa.org` | `lurexa-web.damianalbertocastro.workers.dev` | **Live Deployed** |
| `apps/learn-web` | `lurexa-learn` | `https://learn.lurexa.org` | `lurexa-learn.damianalbertocastro.workers.dev` | **Configured / Build Verified** |
| `apps/coach-web` | `lurexa-coach` | `https://coach.lurexa.org` | `lurexa-coach.damianalbertocastro.workers.dev` | **Configured / Build Verified** |
| `apps/teach-web` | `lurexa-teach` | `https://teach.lurexa.org` | `lurexa-teach.damianalbertocastro.workers.dev` | **Configured / Build Verified** |
| `apps/admin-portal` | `lurexa-admin` | `https://admin.lurexa.org` | `lurexa-admin.damianalbertocastro.workers.dev` | **Configured / Build Verified** |
| `apps/docs` | `lurexa-docs` | `https://docs.lurexa.org` | `lurexa-docs.damianalbertocastro.workers.dev` | **Configured / Build Verified** |
| `apps/insight-web` | `lurexa-insight` | `https://insight.lurexa.org` | `lurexa-insight.damianalbertocastro.workers.dev` | **Configured / Build Verified** |
| `apps/studio-web` | `lurexa-studio` | `https://studio.lurexa.org` | `lurexa-studio.damianalbertocastro.workers.dev` | **Configured / Build Verified** |
| `apps/mobile` | N/A (Client PWA/App) | Delivered via Learn surface | N/A | **Client Surface (Not Hosted on Workers)** |

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
     - `open-next.config.ts`:
       Explicit `buildCommand: "next build"` so OpenNext compiles Next.js directly without recursing into `pnpm run build`.
   - This ensures Cloudflare's CI build step compiles both the Next.js production build and the `.open-next` worker bundles/assets (`.open-next/worker.js`, `.open-next/assets`), allowing subsequent `npx wrangler deploy` (`opennextjs-cloudflare deploy`) to deploy cleanly without "Could not find compiled Open Next config" errors.
3. **Environment Ingestion:**
   - Canonical public environment variables (`NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_LUREXA_*_URL`) are baked into `[vars]` within each `wrangler.toml`.
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
- **Pre-Merge Validation:** Pull requests targeting `main` must pass all CI reliability gates, including `pnpm verify:cloudflare` (which audits configuration readiness across all 8 surfaces) and `Product Deployment Validation` (which validates production builds of all 8 affected surfaces).
- **Deployment Coordination CLI:** Operators can inspect and coordinate deployments using `pnpm deploy:cloudflare` (`scripts/deploy-cloudflare.mjs`).
- **Secret Provisioning CLI:** Operators can validate and push production secrets (`FIREBASE_SERVICE_ACCOUNT_JSON`, `GEMINI_API_KEY`) to targeted Workers via:
  - Audit readiness: `pnpm secrets:cloudflare`
  - Dry-run simulation: `pnpm secrets:cloudflare:dry-run`
  - Push secrets to workers: `pnpm secrets:cloudflare:deploy` (or with `--surface <name>` to target a single worker)



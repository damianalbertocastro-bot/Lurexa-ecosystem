#!/usr/bin/env node
/**
 * Lurexa Cloudflare Deployment Coordinator
 * Authoritative tool to manage, verify, and orchestrate Cloudflare Worker deployments across the ecosystem.
 * Production Branch: main
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

export const PRODUCTION_BRANCH = "main";

export const CLOUDFLARE_SURFACES = [
  {
    id: "ecosystem-web",
    workspace: "web",
    dir: "apps/web",
    workerName: "lurexa-web",
    domain: "lurexa.org",
    productionBranch: PRODUCTION_BRANCH,
    hasPreview: false,
  },
  {
    id: "learn-web",
    workspace: "learn-web",
    dir: "apps/learn-web",
    workerName: "lurexa-learn",
    previewWorkerName: "lurexa-learn-preview",
    domain: "learn.lurexa.org",
    previewRoute: "lurexa-learn-preview.damianalbertocastro.workers.dev",
    productionBranch: PRODUCTION_BRANCH,
    hasPreview: true,
  },
  {
    id: "coach-web",
    workspace: "@lurexa/coach-web",
    dir: "apps/coach-web",
    workerName: "lurexa-coach",
    previewWorkerName: "lurexa-coach-preview",
    domain: "coach.lurexa.org",
    previewRoute: "lurexa-coach-preview.damianalbertocastro.workers.dev",
    productionBranch: PRODUCTION_BRANCH,
    hasPreview: true,
  },
  {
    id: "teach-web",
    workspace: "@lurexa/teach-web",
    dir: "apps/teach-web",
    workerName: "lurexa-teach",
    previewWorkerName: "lurexa-teach-preview",
    domain: "teach.lurexa.org",
    previewRoute: "lurexa-teach-preview.damianalbertocastro.workers.dev",
    productionBranch: PRODUCTION_BRANCH,
    hasPreview: true,
  },
  {
    id: "admin-web",
    workspace: "admin-portal",
    dir: "apps/admin-portal",
    workerName: "lurexa-admin",
    domain: "admin.lurexa.org",
    productionBranch: PRODUCTION_BRANCH,
    hasPreview: false,
  },
  {
    id: "docs-web",
    workspace: "docs",
    dir: "apps/docs",
    workerName: "lurexa-docs",
    domain: "docs.lurexa.org",
    productionBranch: PRODUCTION_BRANCH,
    hasPreview: false,
  },
  {
    id: "insight-web",
    workspace: "@lurexa/insight-web",
    dir: "apps/insight-web",
    workerName: "lurexa-insight",
    domain: "insight.lurexa.org",
    productionBranch: PRODUCTION_BRANCH,
    hasPreview: false,
  },
  {
    id: "studio-web",
    workspace: "@lurexa/studio-web",
    dir: "apps/studio-web",
    workerName: "lurexa-studio",
    domain: "studio.lurexa.org",
    productionBranch: PRODUCTION_BRANCH,
    hasPreview: false,
  },
];

function printHelp() {
  console.log(`
Lurexa Cloudflare Deployment Coordinator
=========================================
Target Production Branch: ${PRODUCTION_BRANCH}

Usage:
  node scripts/deploy-cloudflare.mjs [options]

Options:
  --list                        List all Cloudflare Worker deployment targets and configurations.
  --check                       Run Cloudflare deployment readiness verification.
  --surface <name>              Target a specific surface (e.g., learn-web, coach-web, teach-web, web).
  --target <preview|production> Deployment target environment (default: production).
  --env <preview|production>    Alias for --target.
  --dry-run                     Simulate deployment commands without executing them.
  --deploy                      Execute deployment for targeted surfaces (or all if omitted).
  -h, --help                    Show this help message.

Environment:
  CLOUDFLARE_API_TOKEN          Required for CLI-driven deployment when not using Cloudflare Workers Builds.
  CLOUDFLARE_ACCOUNT_ID         Cloudflare account identifier.
`);
}

function getCurrentBranch() {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

async function main() {
  const args = process.argv.slice(2);
  const flags = {
    list: args.includes("--list"),
    check: args.includes("--check"),
    dryRun: args.includes("--dry-run"),
    deploy: args.includes("--deploy"),
    help: args.includes("--help") || args.includes("-h"),
    surface: null,
    target: "production",
  };

  const targetIdx = args.indexOf("--target") !== -1 ? args.indexOf("--target") : args.indexOf("--env");
  if (targetIdx !== -1 && args[targetIdx + 1]) {
    flags.target = args[targetIdx + 1].toLowerCase();
  }

  const surfaceIdx = args.indexOf("--surface") !== -1 ? args.indexOf("--surface") : args.indexOf("--product");
  if (surfaceIdx !== -1 && args[surfaceIdx + 1]) {
    flags.surface = args[surfaceIdx + 1];
  }

  if (flags.help || args.length === 0) {
    printHelp();
    return;
  }

  const currentBranch = getCurrentBranch();

  if (flags.list) {
    console.log("\n🌐 CLOUDFLARE WORKER DEPLOYMENT TOPOLOGY");
    console.log(`Authoritative Production Branch: ${PRODUCTION_BRANCH}`);
    console.log(`Current Working Branch: ${currentBranch}`);
    console.log("=====================================================");
    console.table(
      CLOUDFLARE_SURFACES.map((s) => ({
        Workspace: s.workspace,
        "Worker (Prod)": s.workerName,
        "Domain (Prod)": `https://${s.domain}`,
        "Worker (Preview)": s.previewWorkerName || "(none)",
        "Route (Preview)": s.previewRoute ? `https://${s.previewRoute}` : "(none)",
      }))
    );
    return;
  }

  if (flags.check) {
    console.log("\n🔍 Running Cloudflare deployment verification audit...");
    execSync("node scripts/verify-cloudflare-deployment-readiness.mjs", { stdio: "inherit" });
    return;
  }

  const isPreview = flags.target === "preview";

  const matchingSurfaces = flags.surface
    ? CLOUDFLARE_SURFACES.filter(
        (s) => s.id === flags.surface || s.workspace === flags.surface || s.dir.endsWith(flags.surface)
      )
    : CLOUDFLARE_SURFACES;

  if (matchingSurfaces.length === 0) {
    console.error(`❌ Error: No matching Cloudflare surface found for '${flags.surface}'.`);
    process.exit(1);
  }

  const targets = isPreview
    ? matchingSurfaces.filter((s) => s.hasPreview)
    : matchingSurfaces;

  if (targets.length === 0) {
    if (isPreview) {
      console.error(`❌ Error: Specified surface '${flags.surface}' does not have a preview environment configured.`);
      process.exit(1);
    }
  }

  if (flags.dryRun) {
    console.log(`\n📋 SIMULATING CLOUDFLARE ${flags.target.toUpperCase()} DEPLOYMENT (Branch: ${currentBranch})`);
    console.log("=================================================");
    targets.forEach((t) => {
      const activeWorker = isPreview ? t.previewWorkerName : t.workerName;
      const targetUrl = isPreview ? `https://${t.previewRoute}` : `https://${t.domain}`;
      const deployCmd = isPreview ? "opennextjs-cloudflare deploy --env preview" : "opennextjs-cloudflare deploy";
      console.log(`  → [${activeWorker}] pnpm --filter ${t.workspace} build:worker`);
      console.log(`  → [${activeWorker}] ${deployCmd} (Target: ${targetUrl})`);
    });
    console.log("\n✓ Dry-run completed successfully.\n");
    return;
  }

  if (flags.deploy) {
    console.log(`\n🚀 INITIATING CLOUDFLARE ${flags.target.toUpperCase()} DEPLOYMENT (Branch: ${currentBranch})`);
    if (!isPreview) {
      console.log(`Target Production Branch: ${PRODUCTION_BRANCH}`);
    }
    console.log("=================================================");

    for (const t of targets) {
      const activeWorker = isPreview ? t.previewWorkerName : t.workerName;
      const targetUrl = isPreview ? `https://${t.previewRoute}` : `https://${t.domain}`;
      const deployCmd = isPreview
        ? `pnpm --filter ${t.workspace} deploy:worker:preview`
        : `pnpm --filter ${t.workspace} deploy:worker`;

      console.log(`\n📦 Building worker for ${activeWorker} (${t.workspace})...`);
      execSync(`pnpm --filter ${t.workspace} build:worker`, { stdio: "inherit" });

      console.log(`\n⚡ Deploying ${activeWorker} to Cloudflare (${targetUrl})...`);
      try {
        execSync(deployCmd, { stdio: "inherit" });
        console.log(`  ✓ ${activeWorker} deployed successfully!`);
      } catch (err) {
        console.error(`  ❌ Failed to deploy ${activeWorker}:`, err.message);
        process.exit(1);
      }
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

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
  },
  {
    id: "learn-web",
    workspace: "learn-web",
    dir: "apps/learn-web",
    workerName: "lurexa-learn",
    domain: "learn.lurexa.org",
    productionBranch: PRODUCTION_BRANCH,
  },
  {
    id: "coach-web",
    workspace: "@lurexa/coach-web",
    dir: "apps/coach-web",
    workerName: "lurexa-coach",
    domain: "coach.lurexa.org",
    productionBranch: PRODUCTION_BRANCH,
  },
  {
    id: "teach-web",
    workspace: "@lurexa/teach-web",
    dir: "apps/teach-web",
    workerName: "lurexa-teach",
    domain: "teach.lurexa.org",
    productionBranch: PRODUCTION_BRANCH,
  },
  {
    id: "admin-web",
    workspace: "admin-portal",
    dir: "apps/admin-portal",
    workerName: "lurexa-admin",
    domain: "admin.lurexa.org",
    productionBranch: PRODUCTION_BRANCH,
  },
  {
    id: "docs-web",
    workspace: "docs",
    dir: "apps/docs",
    workerName: "lurexa-docs",
    domain: "docs.lurexa.org",
    productionBranch: PRODUCTION_BRANCH,
  },
  {
    id: "insight-web",
    workspace: "@lurexa/insight-web",
    dir: "apps/insight-web",
    workerName: "lurexa-insight",
    domain: "insight.lurexa.org",
    productionBranch: PRODUCTION_BRANCH,
  },
  {
    id: "studio-web",
    workspace: "@lurexa/studio-web",
    dir: "apps/studio-web",
    workerName: "lurexa-studio",
    domain: "studio.lurexa.org",
    productionBranch: PRODUCTION_BRANCH,
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
  --list                     List all 8 Cloudflare Worker deployment targets and configurations.
  --check                    Run Cloudflare deployment readiness verification.
  --surface <name>           Target a specific surface (e.g., learn-web, coach-web, web).
  --dry-run                  Simulate deployment commands without executing them.
  --deploy                   Execute deployment for targeted surfaces (or all if omitted).
  -h, --help                 Show this help message.

Environment:
  CLOUDFLARE_API_TOKEN       Required for CLI-driven deployment when not using Cloudflare Workers Builds.
  CLOUDFLARE_ACCOUNT_ID      Cloudflare account identifier.
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
  };

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
    console.log("\n🌐 CLOUDFLARE WORKER PRODUCTION DEPLOYMENT TOPOLOGY");
    console.log(`Authoritative Production Branch: ${PRODUCTION_BRANCH}`);
    console.log(`Current Working Branch: ${currentBranch}`);
    console.log("=====================================================");
    console.table(
      CLOUDFLARE_SURFACES.map((s) => ({
        Workspace: s.workspace,
        Worker: s.workerName,
        Domain: `https://${s.domain}`,
        "Prod Branch": s.productionBranch,
      }))
    );
    return;
  }

  if (flags.check) {
    console.log("\n🔍 Running Cloudflare deployment verification audit...");
    execSync("node scripts/verify-cloudflare-deployment-readiness.mjs", { stdio: "inherit" });
    return;
  }

  const targets = flags.surface
    ? CLOUDFLARE_SURFACES.filter(
        (s) => s.id === flags.surface || s.workspace === flags.surface || s.dir.endsWith(flags.surface)
      )
    : CLOUDFLARE_SURFACES;

  if (targets.length === 0) {
    console.error(`❌ Error: No matching Cloudflare surface found for '${flags.surface}'.`);
    process.exit(1);
  }

  if (flags.dryRun) {
    console.log(`\n📋 SIMULATING CLOUDFLARE DEPLOYMENT (Branch: ${currentBranch})`);
    console.log("=================================================");
    targets.forEach((t) => {
      console.log(`  → [${t.workerName}] pnpm --filter ${t.workspace} build:worker`);
      console.log(`  → [${t.workerName}] opennextjs-cloudflare deploy (Target: https://${t.domain})`);
    });
    console.log("\n✓ Dry-run completed successfully.\n");
    return;
  }

  if (flags.deploy) {
    console.log(`\n🚀 INITIATING CLOUDFLARE DEPLOYMENT (Branch: ${currentBranch})`);
    console.log(`Target Production Branch: ${PRODUCTION_BRANCH}`);
    console.log("=================================================");

    for (const t of targets) {
      console.log(`\n📦 Building worker for ${t.workerName} (${t.workspace})...`);
      execSync(`pnpm --filter ${t.workspace} build:worker`, { stdio: "inherit" });

      console.log(`\n⚡ Deploying ${t.workerName} to Cloudflare (https://${t.domain})...`);
      try {
        execSync(`pnpm --filter ${t.workspace} deploy:worker`, { stdio: "inherit" });
        console.log(`  ✓ ${t.workerName} deployed successfully!`);
      } catch (err) {
        console.error(`  ❌ Failed to deploy ${t.workerName}:`, err.message);
        process.exit(1);
      }
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

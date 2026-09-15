#!/usr/bin/env node
/**
 * Lurexa Cloudflare Secret Provisioner
 * Helper utility to safely validate and push production secrets to Cloudflare Workers via Wrangler CLI.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const REQUIRED_SECRETS = [
  {
    name: "FIREBASE_SERVICE_ACCOUNT_JSON",
    description: "Google Cloud / Firebase Service Account credentials JSON string",
    validate: (val) => {
      try {
        const parsed = JSON.parse(val);
        return Boolean(parsed.project_id && parsed.private_key && parsed.client_email);
      } catch {
        return false;
      }
    },
  },
  {
    name: "GEMINI_API_KEY",
    description: "Google Gemini API key for Mind AI pedagogical intelligence",
    validate: (val) => typeof val === "string" && val.trim().length > 10,
  },
];

const TARGET_WORKERS = [
  "lurexa-learn",
  "lurexa-coach",
  "lurexa-teach",
  "lurexa-admin",
  "lurexa-insight",
  "lurexa-studio",
  "lurexa-web",
];

// Optional helper to read key-value pairs from a local .env file if present
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const result = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (match) {
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      result[match[1]] = val;
    }
  }
  return result;
}

const rootDir = process.cwd();
const localEnv = {
  ...loadEnvFile(path.join(rootDir, ".env")),
  ...loadEnvFile(path.join(rootDir, ".env.local")),
};

const args = process.argv.slice(2);
const command = args[0] || "--help";

if (command === "--help" || command === "-h") {
  console.log(`
Lurexa Cloudflare Secret Provisioner
====================================
Usage:
  node scripts/cloudflare-secret-provisioner.mjs --check
    Validates that environment or local .env has valid secret payloads before deployment.

  node scripts/cloudflare-secret-provisioner.mjs --dry-run [--surface <name>]
    Simulates wrangler secret put commands across targeted Cloudflare workers.

  node scripts/cloudflare-secret-provisioner.mjs --deploy [--surface <name>]
    Executes 'wrangler secret put' for each worker surface using available environment variables.

Options:
  --surface <name>   Target a specific worker (e.g., lurexa-learn, lurexa-coach, or learn-web).
  -h, --help         Show this help message.
`);
  process.exit(0);
}

// Surface argument parsing
let targetWorkerFilter = null;
const surfaceFlagIdx = args.indexOf("--surface");
if (surfaceFlagIdx !== -1 && args[surfaceFlagIdx + 1]) {
  targetWorkerFilter = args[surfaceFlagIdx + 1].trim();
}

const activeWorkers = targetWorkerFilter
  ? TARGET_WORKERS.filter(
      (w) => w === targetWorkerFilter || w.replace("lurexa-", "") === targetWorkerFilter.replace("-web", "")
    )
  : TARGET_WORKERS;

if (activeWorkers.length === 0) {
  console.error(`❌ Error: No matching worker found for target '${targetWorkerFilter}'.`);
  console.error(`Available workers: ${TARGET_WORKERS.join(", ")}`);
  process.exit(1);
}

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || localEnv.FIREBASE_SERVICE_ACCOUNT_JSON || "";
const geminiApiKey = process.env.GEMINI_API_KEY || localEnv.GEMINI_API_KEY || "";

const saValid = REQUIRED_SECRETS[0].validate(serviceAccountJson);
const geminiValid = REQUIRED_SECRETS[1].validate(geminiApiKey);

if (command === "--check" || command === "--dry-run") {
  console.log("🔍 Checking Secret Availability & Payload Validity:\n");

  console.log(
    `  ${saValid ? "✓" : "⚠"} FIREBASE_SERVICE_ACCOUNT_JSON: ${
      saValid ? "Valid Service Account JSON present" : "Missing or invalid JSON in current environment"
    }`
  );

  console.log(
    `  ${geminiValid ? "✓" : "⚠"} GEMINI_API_KEY: ${
      geminiValid ? "API Key string present" : "Missing or blank in current environment"
    }\n`
  );

  if (command === "--dry-run") {
    console.log(`Planned Wrangler Secret Injections (${activeWorkers.length} target surfaces):`);
    activeWorkers.forEach((w) => {
      if (saValid) {
        console.log(`  → wrangler secret put FIREBASE_SERVICE_ACCOUNT_JSON --name ${w} (from environment)`);
      } else {
        console.log(`  ⚠ [${w}] Skip FIREBASE_SERVICE_ACCOUNT_JSON (no valid payload)`);
      }
      if (geminiValid) {
        console.log(`  → wrangler secret put GEMINI_API_KEY --name ${w} (from environment)`);
      } else {
        console.log(`  ⚠ [${w}] Skip GEMINI_API_KEY (no valid payload)`);
      }
    });
    console.log("\n(Dry run complete. No live secrets modified.)\n");
  }
} else if (command === "--deploy") {
  if (!saValid && !geminiValid) {
    console.error("❌ Error: No valid production secrets found to deploy.");
    console.error("Please export FIREBASE_SERVICE_ACCOUNT_JSON and/or GEMINI_API_KEY in your environment,");
    console.error("or provide them in a secure local .env before running --deploy.");
    process.exit(1);
  }

  console.log(`🚀 Provisioning Secrets to Cloudflare Workers (${activeWorkers.length} workers)...\n`);

  const isWindows = process.platform === "win32";
  const localBin = path.resolve(
    rootDir,
    "apps/web/node_modules/.bin",
    isWindows ? "wrangler.cmd" : "wrangler"
  );
  const wranglerCmd = fs.existsSync(localBin) ? `"${localBin}"` : "pnpm --filter web exec wrangler";

  for (const worker of activeWorkers) {
    console.log(`[${worker}] Synchronizing worker secrets...`);
    
    if (saValid) {
      try {
        console.log(`  → Putting FIREBASE_SERVICE_ACCOUNT_JSON to ${worker}...`);
        execSync(`${wranglerCmd} secret put FIREBASE_SERVICE_ACCOUNT_JSON --name ${worker}`, {
          input: serviceAccountJson,
          stdio: ["pipe", "pipe", "pipe"],
          encoding: "utf8",
        });
        console.log(`    ✓ FIREBASE_SERVICE_ACCOUNT_JSON successfully provisioned.`);
      } catch (err) {
        console.error(`    ❌ Failed to put FIREBASE_SERVICE_ACCOUNT_JSON for ${worker}:`, err.message);
      }
    }

    if (geminiValid) {
      try {
        console.log(`  → Putting GEMINI_API_KEY to ${worker}...`);
        execSync(`${wranglerCmd} secret put GEMINI_API_KEY --name ${worker}`, {
          input: geminiApiKey,
          stdio: ["pipe", "pipe", "pipe"],
          encoding: "utf8",
        });
        console.log(`    ✓ GEMINI_API_KEY successfully provisioned.`);
      } catch (err) {
        console.error(`    ❌ Failed to put GEMINI_API_KEY for ${worker}:`, err.message);
      }
    }
  }

  console.log("\n🎉 Secret provisioning process completed.");
} else {
  console.error(`Unknown command: ${command}`);
  console.log("Run with --help for available options.");
  process.exit(1);
}

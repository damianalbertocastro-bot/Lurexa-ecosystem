#!/usr/bin/env node

import fs from "node:fs/promises";
import process from "node:process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const options = {
    productId: null,
    target: "preview",
    ref: null,
    sha: null,
    apply: false,
    forceNew: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    if (arg === "--product") options.productId = argv[++index] ?? null;
    else if (arg === "--target") options.target = argv[++index] ?? "preview";
    else if (arg === "--ref") options.ref = argv[++index] ?? null;
    else if (arg === "--sha") options.sha = argv[++index] ?? null;
    else if (arg === "--apply") options.apply = true;
    else if (arg === "--no-force-new") options.forceNew = false;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function printHelp() {
  console.log(`Usage:\n  node scripts/deploy-vercel-product.mjs --product <deployment-id> [options]\n\nOptions:\n  --target preview|production   Deployment target. Default: preview\n  --ref <git-ref>               Git branch/tag to deploy. Preview apply requires a non-production ref\n  --sha <commit-sha>            Exact Git commit to deploy\n  --apply                       Create the deployment. Without this flag, dry-run only\n  --no-force-new                Allow Vercel deployment deduplication\n  -h, --help                    Show this help\n\nNotes:\n  Vercel REST does not accept target=preview. Preview requests omit the API target and must use a non-production Git ref so Vercel cannot infer Production from the production branch.\n\nExamples:\n  node scripts/deploy-vercel-product.mjs --product learn-web --target preview --ref preview/learn-<sha> --sha <sha>\n  node scripts/deploy-vercel-product.mjs --product learn-web --target preview --ref preview/learn-<sha> --sha <sha> --apply\n  node scripts/deploy-vercel-product.mjs --product learn-web --target production --sha <sha> --apply\n`);
}

async function readManifest() {
  const manifestPath = path.join(repoRoot, "deployment", "products.json");
  return JSON.parse(await fs.readFile(manifestPath, "utf8"));
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required for --apply.`);
  return value;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  if (!options.productId) throw new Error("--product is required.");
  if (!new Set(["preview", "production"]).has(options.target)) {
    throw new Error("--target must be preview or production.");
  }

  const manifest = await readManifest();
  const deployment = manifest.deployments.find((entry) => entry.id === options.productId);
  if (!deployment) throw new Error(`Unknown deployment id: ${options.productId}`);
  if (!deployment.vercelProject || deployment.status === "non-vercel") {
    throw new Error(`${options.productId} is not a Vercel deployable surface.`);
  }

  const [org, repo] = String(manifest.repository).split("/");
  if (!org || !repo) throw new Error("deployment/products.json repository must be owner/name.");

  const productionBranch = manifest.productionBranch ?? "main";
  const ref = options.ref ?? productionBranch;
  const isPreviewOnProductionBranch = options.target === "preview" && ref === productionBranch;

  if (options.apply && isPreviewOnProductionBranch) {
    throw new Error(
      `Preview deployment requires a non-production --ref. ${productionBranch} is the production branch; create/use a preview ref at the same SHA and pass --ref <preview-branch>.`,
    );
  }

  const gitSource = {
    type: "github",
    org,
    repo,
    ref,
    ...(options.sha ? { sha: options.sha } : {}),
  };

  const body = {
    name: deployment.vercelProject,
    project: deployment.vercelProject,
    ...(options.target === "production" ? { target: "production" } : {}),
    gitSource,
    meta: {
      lurexaDeploymentId: deployment.id,
      lurexaWorkspace: deployment.workspace,
      lurexaSurface: deployment.surface,
      releaseMode: "manifest-driven",
    },
  };

  const summary = {
    mode: options.apply ? "apply" : "dry-run",
    product: deployment.product,
    deploymentId: deployment.id,
    vercelProject: deployment.vercelProject,
    workspace: deployment.workspace,
    target: options.target,
    apiTarget: options.target === "production" ? "production" : null,
    gitSource,
    previewSafety: isPreviewOnProductionBranch
      ? `dry-run only: use a non-production --ref before --apply`
      : "ok",
    forceNew: options.forceNew,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (!options.apply) {
    console.log("\nDry run only. Re-run with --apply to create the deployment.");
    return;
  }

  const token = requireEnv("VERCEL_TOKEN");
  const teamId = requireEnv("VERCEL_TEAM_ID");
  const url = new URL("https://api.vercel.com/v13/deployments");
  url.searchParams.set("teamId", teamId);
  if (options.forceNew) url.searchParams.set("forceNew", "1");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message ?? payload?.message ?? response.statusText;
    throw new Error(`Vercel deployment failed (${response.status}): ${message}`);
  }

  console.log("\nDeployment created:");
  console.log(JSON.stringify({
    id: payload.id,
    url: payload.url ? `https://${payload.url}` : null,
    status: payload.status ?? payload.readyState ?? null,
    target: payload.target ?? options.target,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

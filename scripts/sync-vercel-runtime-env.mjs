#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const options = { productId: null, target: "preview", ref: null, apply: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    if (arg === "--product") options.productId = argv[++index] ?? null;
    else if (arg === "--target") options.target = argv[++index] ?? "preview";
    else if (arg === "--ref") options.ref = argv[++index] ?? null;
    else if (arg === "--apply") options.apply = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required in your local environment.`);
  return value;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.productId) throw new Error("--product is required.");
  if (!new Set(["preview", "production"]).has(options.target)) throw new Error("--target must be preview or production.");
  if (options.target === "preview" && !options.ref) throw new Error("Preview runtime env sync requires --ref so secrets stay scoped to the intended preview branch.");

  const manifest = JSON.parse(await fs.readFile(path.join(repoRoot, "deployment", "products.json"), "utf8"));
  const deployment = manifest.deployments.find((entry) => entry.id === options.productId);
  if (!deployment?.vercelProject) throw new Error(`Unknown or non-Vercel deployment: ${options.productId}`);

  const runtimeKeys = options.productId === "learn-web" ? ["OPENAI_API_KEY"] : [];
  if (!runtimeKeys.length) throw new Error(`No managed runtime secrets are declared for ${options.productId}.`);

  const present = runtimeKeys.filter((key) => Boolean(process.env[key]?.trim()));
  const missing = runtimeKeys.filter((key) => !process.env[key]?.trim());
  console.log(JSON.stringify({
    mode: options.apply ? "apply" : "dry-run",
    project: deployment.vercelProject,
    target: options.target,
    ref: options.ref,
    keysReady: present,
    keysMissingLocally: missing,
  }, null, 2));

  if (missing.length) throw new Error(`Missing local runtime secret(s): ${missing.join(", ")}. Values are never printed or committed.`);
  if (!options.apply) {
    console.log("Dry run only. Re-run with --apply to sync encrypted runtime secrets to Vercel.");
    return;
  }

  const token = requireEnv("VERCEL_TOKEN");
  const teamId = requireEnv("VERCEL_TEAM_ID");
  const url = new URL(`https://api.vercel.com/v10/projects/${encodeURIComponent(deployment.vercelProject)}/env`);
  url.searchParams.set("teamId", teamId);
  url.searchParams.set("upsert", "true");

  const requestBody = runtimeKeys.map((key) => ({
    key,
    value: process.env[key],
    type: "encrypted",
    target: [options.target],
    ...(options.target === "preview" && options.ref ? { gitBranch: options.ref } : {}),
    comment: "Managed by Lurexa manifest-driven runtime environment sync",
  }));

  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message ?? payload?.message ?? response.statusText;
    throw new Error(`Vercel runtime env sync failed (${response.status}): ${message}`);
  }

  console.log(`Synced ${runtimeKeys.length} encrypted runtime secret(s) to ${deployment.vercelProject} for ${options.target}${options.ref ? ` (${options.ref})` : ""}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

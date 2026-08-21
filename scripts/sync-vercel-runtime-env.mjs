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

function normalizedKey(name) {
  return String(name ?? "").replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase();
}

function targetMatches(entry, target) {
  const targets = Array.isArray(entry?.target) ? entry.target : [entry?.target].filter(Boolean);
  return targets.includes(target);
}

async function resolveOpenAISecretFromVercel({ project, target, ref, token, teamId }) {
  const url = new URL(`https://api.vercel.com/v10/projects/${encodeURIComponent(project)}/env`);
  url.searchParams.set("teamId", teamId);
  url.searchParams.set("decrypt", "true");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message ?? payload?.message ?? response.statusText;
    throw new Error(`Unable to inspect Vercel runtime environment (${response.status}): ${message}`);
  }

  const envs = Array.isArray(payload?.envs)
    ? payload.envs
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  const candidates = envs.filter((entry) => {
    const key = normalizedKey(entry?.key);
    return (key === "OPENAI_KEY_TUTOR" || key === "OPENAI_API_KEY") && targetMatches(entry, target);
  });

  const branchSpecific = target === "preview" && ref
    ? candidates.find((entry) => entry?.gitBranch === ref)
    : null;
  const generic = candidates.find((entry) => !entry?.gitBranch);
  const selected = branchSpecific ?? generic ?? candidates[0] ?? null;
  const value = typeof selected?.value === "string" ? selected.value.trim() : "";

  if (!value) {
    throw new Error(
      `No usable OpenAI tutor secret is attached to Vercel project ${project} for ${target}${ref ? ` (${ref})` : ""}. `
      + "Expected a key whose normalized name is OPENAI_KEY_TUTOR or OPENAI_API_KEY. Secret values are never printed.",
    );
  }

  return {
    value,
    branchScoped: Boolean(selected?.gitBranch),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.productId) throw new Error("--product is required.");
  if (!new Set(["preview", "production"]).has(options.target)) throw new Error("--target must be preview or production.");
  if (options.target === "preview" && !options.ref) throw new Error("Preview runtime env sync requires --ref so secrets stay scoped to the intended preview branch.");

  const manifest = JSON.parse(await fs.readFile(path.join(repoRoot, "deployment", "products.json"), "utf8"));
  const deployment = manifest.deployments.find((entry) => entry.id === options.productId);
  if (!deployment?.vercelProject) throw new Error(`Unknown or non-Vercel deployment: ${options.productId}`);
  if (options.productId !== "learn-web") throw new Error(`No managed runtime secrets are declared for ${options.productId}.`);

  const localOpenAIKey = process.env.OPENAI_API_KEY?.trim()
    || process.env.OPENAI_KEY_tutor?.trim()
    || process.env.OPENAI_KEY_TUTOR?.trim()
    || null;

  console.log(JSON.stringify({
    mode: options.apply ? "apply" : "dry-run",
    project: deployment.vercelProject,
    target: options.target,
    ref: options.ref,
    canonicalKey: "OPENAI_API_KEY",
    source: localOpenAIKey ? "local-environment" : options.apply ? "vercel-project-environment" : "vercel-project-environment (resolved on --apply)",
    secretValuePrinted: false,
  }, null, 2));

  if (!options.apply) {
    console.log("Dry run only. Re-run with --apply to ensure the canonical encrypted runtime secret exists for this deployment scope.");
    return;
  }

  const token = requireEnv("VERCEL_TOKEN");
  const teamId = requireEnv("VERCEL_TEAM_ID");
  const remote = localOpenAIKey
    ? null
    : await resolveOpenAISecretFromVercel({
        project: deployment.vercelProject,
        target: options.target,
        ref: options.ref,
        token,
        teamId,
      });
  const secretValue = localOpenAIKey ?? remote?.value;
  if (!secretValue) throw new Error("OpenAI runtime secret could not be resolved.");

  const url = new URL(`https://api.vercel.com/v10/projects/${encodeURIComponent(deployment.vercelProject)}/env`);
  url.searchParams.set("teamId", teamId);
  url.searchParams.set("upsert", "true");

  const requestBody = [{
    key: "OPENAI_API_KEY",
    value: secretValue,
    type: "encrypted",
    target: [options.target],
    ...(options.target === "preview" && options.ref ? { gitBranch: options.ref } : {}),
    comment: "Canonical Lurexa Learn OpenAI runtime alias managed from existing tutor secret",
  }];

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

  console.log(
    `Canonical encrypted OpenAI runtime secret is configured for ${deployment.vercelProject} ${options.target}${options.ref ? ` (${options.ref})` : ""}.`
    + `${remote ? ` Source was ${remote.branchScoped ? "branch-scoped" : "project-scoped"} Vercel configuration.` : " Source was the local environment."}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

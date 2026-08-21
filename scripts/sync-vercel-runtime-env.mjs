#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const OPENAI_ENV_KEYS = new Set(["OPENAI_KEY_TUTOR", "OPENAI_API_KEY"]);

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

function extractSecretValue(payload) {
  const candidates = [
    payload?.value,
    payload?.env?.value,
    payload?.data?.value,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return null;
}

async function fetchJson(url, token) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

async function retrieveSecretValueById({ project, envId, token, teamId }) {
  const attempts = [
    new URL(`https://api.vercel.com/v1/projects/${encodeURIComponent(project)}/env/${encodeURIComponent(envId)}`),
    new URL(`https://api.vercel.com/v1/env/${encodeURIComponent(envId)}`),
  ];

  const failures = [];
  for (const url of attempts) {
    url.searchParams.set("teamId", teamId);
    const { response, payload } = await fetchJson(url, token);
    if (response.ok) {
      const value = extractSecretValue(payload);
      if (value) return value;
      failures.push(`${url.pathname}: decrypted value missing`);
      continue;
    }
    const message = payload?.error?.message ?? payload?.message ?? response.statusText;
    failures.push(`${url.pathname}: ${response.status} ${message}`);
  }

  throw new Error(
    `Vercel exposed matching secret metadata but its encrypted value could not be retrieved by id. ${failures.join(" | ")}`,
  );
}

async function resolveOpenAISecretFromVercel({ project, target, ref, token, teamId }) {
  const url = new URL(`https://api.vercel.com/v10/projects/${encodeURIComponent(project)}/env`);
  url.searchParams.set("teamId", teamId);
  url.searchParams.set("decrypt", "true");

  const { response, payload } = await fetchJson(url, token);
  if (!response.ok) {
    const message = payload?.error?.message ?? payload?.message ?? response.statusText;
    throw new Error(`Unable to inspect Vercel runtime environment (${response.status}): ${message}`);
  }

  const envs = Array.isArray(payload?.envs)
    ? payload.envs
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  const candidates = envs.filter((entry) => OPENAI_ENV_KEYS.has(normalizedKey(entry?.key)) && targetMatches(entry, target));

  const branchSpecific = target === "preview" && ref
    ? candidates.find((entry) => entry?.gitBranch === ref)
    : null;
  const generic = candidates.find((entry) => !entry?.gitBranch);
  const selected = branchSpecific ?? generic ?? candidates[0] ?? null;

  if (!selected) {
    throw new Error(
      `No OpenAI tutor secret metadata is attached to Vercel project ${project} for ${target}${ref ? ` (${ref})` : ""}. `
      + "Expected a key whose normalized name is OPENAI_KEY_TUTOR or OPENAI_API_KEY. Secret values are never printed.",
    );
  }

  const inlineValue = extractSecretValue(selected);
  const envId = typeof selected?.id === "string" ? selected.id : null;
  const value = inlineValue ?? (envId
    ? await retrieveSecretValueById({ project, envId, token, teamId })
    : null);

  if (!value) {
    throw new Error(
      `OpenAI tutor secret ${selected.key ?? "(unnamed)"} exists for ${project}, but Vercel returned no usable decrypted value. `
      + "Secret values are never printed.",
    );
  }

  return {
    value,
    key: String(selected.key ?? "unknown"),
    branchScoped: Boolean(selected?.gitBranch),
    retrievedById: !inlineValue,
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
    acceptedSourceKeys: [...OPENAI_ENV_KEYS],
    source: localOpenAIKey ? "local-environment" : options.apply ? "vercel-project-environment" : "vercel-project-environment (resolved on --apply)",
    secretValuePrinted: false,
  }, null, 2));

  if (!options.apply) {
    console.log("Dry run only. Re-run with --apply to resolve the existing tutor secret and ensure the canonical encrypted runtime alias exists for this deployment scope.");
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

  console.log(JSON.stringify({
    configured: true,
    project: deployment.vercelProject,
    target: options.target,
    ref: options.ref,
    canonicalKey: "OPENAI_API_KEY",
    sourceKey: remote?.key ?? "local-environment",
    sourceScope: remote ? (remote.branchScoped ? "branch" : "project") : "local",
    sourceRetrieval: remote ? (remote.retrievedById ? "env-id" : "list-response") : "local",
    secretValuePrinted: false,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

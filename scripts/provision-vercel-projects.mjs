import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(
  readFileSync(resolve(root, "deployment/products.json"), "utf8"),
);

const apply = process.argv.includes("--apply");
const token = process.env.VERCEL_TOKEN;
const teamId = process.env.VERCEL_TEAM_ID;

if (!token || !teamId) {
  console.error(
    "Set VERCEL_TOKEN and VERCEL_TEAM_ID in your local environment before running this script.",
  );
  console.error("Do not commit or paste those credentials into the repository.");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

async function vercelRequest(pathname, init = {}) {
  const response = await fetch(`https://api.vercel.com${pathname}`, {
    ...init,
    headers: { ...headers, ...(init.headers ?? {}) },
  });

  if (response.status === 404) return { response, data: null };

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const detail = data?.error?.message ?? data?.message ?? text;
    throw new Error(`${response.status} ${response.statusText}: ${detail}`);
  }

  return { response, data };
}

function projectConfig(entry) {
  const selector = entry.workspace;
  return {
    framework: "nextjs",
    rootDirectory: entry.rootDirectory,
    installCommand: "cd ../.. && pnpm install --frozen-lockfile",
    buildCommand: `cd ../.. && pnpm --filter ${selector} build`,
    outputDirectory: ".next",
    commandForIgnoringBuildStep: `cd ../.. && npx --yes turbo@^2 query affected --base=$VERCEL_GIT_PREVIOUS_SHA --packages ${selector} --exit-code`,
    enableAffectedProjectsDeployments: true,
    nodeVersion: "24.x",
  };
}

async function getProject(name, query) {
  const encodedName = encodeURIComponent(name);
  return vercelRequest(`/v9/projects/${encodedName}?${query}`);
}

async function ensureProject(entry) {
  if (!entry.vercelProject || entry.status === "non-vercel") return;

  const appPath = resolve(root, entry.rootDirectory);
  if (!existsSync(appPath)) {
    console.log(
      `SKIP ${entry.vercelProject}: ${entry.rootDirectory} does not exist on this branch yet.`,
    );
    return;
  }

  const targetName = entry.vercelProject;
  const query = `teamId=${encodeURIComponent(teamId)}`;
  const config = projectConfig(entry);

  let { response, data: existing } = await getProject(targetName, query);
  let lookupName = targetName;

  if (response.status === 404 && entry.existingVercelProject) {
    lookupName = entry.existingVercelProject;
    ({ response, data: existing } = await getProject(lookupName, query));
  }

  if (response.status === 404) {
    console.log(`CREATE ${targetName} -> ${entry.rootDirectory}`);
    if (!apply) return;

    await vercelRequest(`/v11/projects?${query}`, {
      method: "POST",
      body: JSON.stringify({
        name: targetName,
        ...config,
        gitRepository: {
          type: "github",
          repo: manifest.repository,
        },
      }),
    });
    console.log(`CREATED ${targetName}`);
    return;
  }

  const rename = existing.name !== targetName;
  console.log(
    `${rename ? "REUSE" : "UPDATE"} ${existing.name}${rename ? ` -> ${targetName}` : ""} -> ${entry.rootDirectory}`,
  );
  if (!apply) return;

  const projectId = encodeURIComponent(existing.id ?? lookupName);
  await vercelRequest(`/v9/projects/${projectId}?${query}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...(rename ? { name: targetName } : {}),
      ...config,
    }),
  });
  console.log(`${rename ? "REUSED" : "UPDATED"} ${targetName}`);
}

console.log(
  apply
    ? "Applying Lurexa Vercel project topology..."
    : "Dry run only. Re-run with --apply to change Vercel projects.",
);

for (const entry of manifest.deployments) {
  await ensureProject(entry);
}

console.log("Vercel project topology check complete.");

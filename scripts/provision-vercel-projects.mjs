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
    commandForIgnoringBuildStep: `cd ../.. && npx turbo-ignore ${selector} --fallback=HEAD^1`,
    enableAffectedProjectsDeployments: true,
    nodeVersion: "24.x",
  };
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

  const name = entry.vercelProject;
  const encodedName = encodeURIComponent(name);
  const query = `teamId=${encodeURIComponent(teamId)}`;
  const { response, data: existing } = await vercelRequest(
    `/v9/projects/${encodedName}?${query}`,
  );

  const config = projectConfig(entry);

  if (response.status === 404) {
    console.log(`CREATE ${name} -> ${entry.rootDirectory}`);
    if (!apply) return;

    await vercelRequest(`/v11/projects?${query}`, {
      method: "POST",
      body: JSON.stringify({
        name,
        ...config,
        gitRepository: {
          type: "github",
          repo: manifest.repository,
        },
      }),
    });
    console.log(`CREATED ${name}`);
    return;
  }

  console.log(`UPDATE ${existing.name} -> ${entry.rootDirectory}`);
  if (!apply) return;

  await vercelRequest(`/v9/projects/${encodedName}?${query}`, {
    method: "PATCH",
    body: JSON.stringify(config),
  });
  console.log(`UPDATED ${name}`);
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

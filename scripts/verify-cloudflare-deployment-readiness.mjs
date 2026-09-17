import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const passes = [];

const pass = (msg) => passes.push(msg);
const fail = (msg) => failures.push(msg);

const SURFACES = [
  { dir: "apps/web", workerName: "lurexa-web", domain: "lurexa.org" },
  { dir: "apps/learn-web", workerName: "lurexa-learn", domain: "learn.lurexa.org" },
  { dir: "apps/coach-web", workerName: "lurexa-coach", domain: "coach.lurexa.org" },
  { dir: "apps/teach-web", workerName: "lurexa-teach", domain: "teach.lurexa.org" },
  { dir: "apps/admin-portal", workerName: "lurexa-admin", domain: "admin.lurexa.org" },
  { dir: "apps/docs", workerName: "lurexa-docs", domain: "docs.lurexa.org" },
  { dir: "apps/insight-web", workerName: "lurexa-insight", domain: "insight.lurexa.org" },
  { dir: "apps/studio-web", workerName: "lurexa-studio", domain: "studio.lurexa.org" },
];

const FORBIDDEN_SECRETS_IN_VARS = [
  "FIREBASE_SERVICE_ACCOUNT_JSON",
  "GEMINI_API_KEY",
  "OPENROUTER_API_KEY",
  "ELEVENLABS_API_KEY",
  "SESSION_SECRET",
  "PRIVATE_KEY",
  "CLIENT_SECRET",
];

for (const surface of SURFACES) {
  const wranglerPath = path.join(root, surface.dir, "wrangler.toml");
  if (!fs.existsSync(wranglerPath)) {
    fail(`${surface.dir} is missing wrangler.toml`);
    continue;
  }

  const content = fs.readFileSync(wranglerPath, "utf8");

  const nameMatch = content.match(/name\s*=\s*["']([^"']+)["']/);
  if (!nameMatch || nameMatch[1] !== surface.workerName) {
    fail(`${surface.dir}/wrangler.toml name should be '${surface.workerName}', found '${nameMatch?.[1]}'`);
  } else {
    pass(`${surface.workerName}: worker name correctly declared`);
  }

  const REQUIRED_FLAGS = ["nodejs_compat", "enable_weak_ref", "allow_eval_during_startup"];
  for (const flag of REQUIRED_FLAGS) {
    if (!content.includes(`"${flag}"`) && !content.includes(`'${flag}'`)) {
      fail(`${surface.dir}/wrangler.toml must declare compatibility_flags with '${flag}'`);
    }
  }
  pass(`${surface.workerName}: compatibility_flags includes all required runtime flags`);

  if (!content.includes("[build]") || !content.includes('command = "opennextjs-cloudflare build"')) {
    fail(`${surface.dir}/wrangler.toml must declare [build] with command = "opennextjs-cloudflare build" for Cloudflare production deployment`);
  } else {
    pass(`${surface.workerName}: build command configured for Cloudflare Workers Builds`);
  }

  if (!content.includes(".open-next/assets") || !content.includes('binding = "ASSETS"')) {
    fail(`${surface.dir}/wrangler.toml is missing valid [assets] binding to .open-next/assets`);
  } else {
    pass(`${surface.workerName}: assets binding properly configured`);
  }

  if (!content.includes(surface.domain)) {
    fail(`${surface.dir}/wrangler.toml route pattern missing canonical domain '${surface.domain}'`);
  } else {
    pass(`${surface.workerName}: custom domain '${surface.domain}' configured`);
  }

  for (const forbidden of FORBIDDEN_SECRETS_IN_VARS) {
    if (content.includes(`${forbidden} =`) || content.includes(`${forbidden}=`)) {
      fail(`${surface.dir}/wrangler.toml must not expose secret '${forbidden}' in [vars]`);
    }
  }

  if (!content.includes("[vars]")) {
    fail(`${surface.dir}/wrangler.toml is missing [vars] declaration`);
  } else {
    pass(`${surface.workerName}: [vars] declaration present`);
  }
}

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures, passes }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, failures: [], passes }, null, 2));

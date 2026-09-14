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

  // 1. Worker Name Check
  const nameMatch = content.match(/name\s*=\s*["']([^"']+)["']/);
  if (!nameMatch || nameMatch[1] !== surface.workerName) {
    fail(`${surface.dir}/wrangler.toml name should be '${surface.workerName}', found '${nameMatch?.[1]}'`);
  } else {
    pass(`${surface.workerName}: worker name correctly declared`);
  }

  // 2. Compatibility flags check
  if (!content.includes('"nodejs_compat"') && !content.includes("'nodejs_compat'")) {
    fail(`${surface.dir}/wrangler.toml must declare compatibility_flags with 'nodejs_compat'`);
  } else {
    pass(`${surface.workerName}: compatibility_flags includes nodejs_compat`);
  }

  // 3. Asset binding
  if (!content.includes(".open-next/assets") || !content.includes('binding = "ASSETS"')) {
    fail(`${surface.dir}/wrangler.toml is missing valid [assets] binding to .open-next/assets`);
  } else {
    pass(`${surface.workerName}: assets binding properly configured`);
  }

  // 4. Custom domain route
  if (!content.includes(surface.domain)) {
    fail(`${surface.dir}/wrangler.toml route pattern missing canonical domain '${surface.domain}'`);
  } else {
    pass(`${surface.workerName}: custom domain '${surface.domain}' configured`);
  }

  // 5. No raw secrets in [vars]
  for (const forbidden of FORBIDDEN_SECRETS_IN_VARS) {
    if (content.includes(`${forbidden} =`) || content.includes(`${forbidden}=`)) {
      fail(`${surface.dir}/wrangler.toml contains forbidden private secret '${forbidden}' in [vars]`);
    }
  }

  // 6. Build script in package.json
  const pkgPath = path.join(root, surface.dir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    if (!pkg.scripts?.["build:worker"] && !pkg.scripts?.build) {
      fail(`${surface.dir}/package.json missing worker build script`);
    } else {
      pass(`${surface.workerName}: build script available in package.json`);
    }
  }
}

console.log("\n⚡ CLOUDFLARE WORKER DEPLOYMENT READINESS AUDIT");
console.log("================================================");
passes.forEach((p) => console.log(`  ✓ ${p}`));
if (failures.length > 0) {
  console.log("\n❌ FAILURES:");
  failures.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("\n🎉 All 8 Cloudflare Worker surface configurations verified ready for deployment!\n");
}

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const passes = [];

const pass = (msg) => passes.push(msg);
const fail = (msg) => failures.push(msg);

const SURFACES = [
  { dir: "apps/web", workerName: "lurexa-web", domain: "lurexa.org" },
  { dir: "apps/learn-web", workerName: "lurexa-learn", domain: "learn.lurexa.org", previewWorkerName: "lurexa-learn-preview" },
  { dir: "apps/coach-web", workerName: "lurexa-coach", domain: "coach.lurexa.org", previewWorkerName: "lurexa-coach-preview" },
  { dir: "apps/teach-web", workerName: "lurexa-teach", domain: "teach.lurexa.org", previewWorkerName: "lurexa-teach-preview" },
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
  const REQUIRED_FLAGS = ["nodejs_compat", "enable_weak_ref", "allow_eval_during_startup"];
  for (const flag of REQUIRED_FLAGS) {
    if (!content.includes(`"${flag}"`) && !content.includes(`'${flag}'`)) {
      fail(`${surface.dir}/wrangler.toml must declare compatibility_flags with '${flag}'`);
    }
  }
  pass(`${surface.workerName}: compatibility_flags includes all required runtime flags`);

  // 3. Cloudflare Workers Builds build command check
  if (!content.includes("[build]") || !content.includes('command = "opennextjs-cloudflare build"')) {
    fail(`${surface.dir}/wrangler.toml must declare [build] with command = "opennextjs-cloudflare build" for Cloudflare production deployment`);
  } else {
    pass(`${surface.workerName}: build command configured for Cloudflare Workers Builds`);
  }

  // 4. Asset binding
  if (!content.includes(".open-next/assets") || !content.includes('binding = "ASSETS"')) {
    fail(`${surface.dir}/wrangler.toml is missing valid [assets] binding to .open-next/assets`);
  } else {
    pass(`${surface.workerName}: assets binding properly configured`);
  }

  // 5. Custom domain route
  if (!content.includes(surface.domain)) {
    fail(`${surface.dir}/wrangler.toml route pattern missing canonical domain '${surface.domain}'`);
  } else {
    pass(`${surface.workerName}: custom domain '${surface.domain}' configured`);
  }

  // 6. No raw secrets in [vars]
  for (const forbidden of FORBIDDEN_SECRETS_IN_VARS) {
    if (content.includes(`${forbidden} =`) || content.includes(`${forbidden}=`)) {
      fail(`${surface.dir}/wrangler.toml contains forbidden private secret '${forbidden}' in [vars]`);
    }
  }

  // 7. Scripts in package.json
  const pkgPath = path.join(root, surface.dir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    if (!pkg.scripts?.["build:worker"] || !pkg.scripts?.["deploy:worker"]) {
      fail(`${surface.dir}/package.json missing build:worker or deploy:worker script`);
    } else {
      pass(`${surface.workerName}: worker lifecycle scripts verified in package.json`);
    }
  }

  // 8. Preview environment check (for preview-enabled surfaces)
  if (surface.previewWorkerName) {
    if (!content.includes("[env.preview]")) {
      fail(`${surface.dir}/wrangler.toml missing [env.preview] configuration`);
    } else {
      pass(`${surface.previewWorkerName}: [env.preview] configuration declared`);
    }

    const previewSection = content.split("[env.preview]")[1] || "";
    const previewNameMatch = previewSection.match(/name\s*=\s*["']([^"']+)["']/);
    if (!previewNameMatch || previewNameMatch[1] !== surface.previewWorkerName) {
      fail(`${surface.dir}/wrangler.toml [env.preview] name should be '${surface.previewWorkerName}', found '${previewNameMatch?.[1]}'`);
    } else {
      pass(`${surface.previewWorkerName}: preview worker name correctly declared`);
    }

    if (!previewSection.includes("workers_dev = true") && !previewSection.includes("workers_dev=true")) {
      fail(`${surface.dir}/wrangler.toml [env.preview] missing workers_dev = true`);
    } else {
      pass(`${surface.previewWorkerName}: workers_dev routing enabled for preview`);
    }

    if (!previewSection.includes("[env.preview.assets]") || !previewSection.includes(".open-next/assets")) {
      fail(`${surface.dir}/wrangler.toml [env.preview.assets] missing valid binding to .open-next/assets`);
    } else {
      pass(`${surface.previewWorkerName}: preview assets binding properly configured`);
    }

    if (!previewSection.includes('ENVIRONMENT = "preview"') || !previewSection.includes('NEXT_PUBLIC_APP_ENV = "preview"')) {
      fail(`${surface.dir}/wrangler.toml [env.preview.vars] missing ENVIRONMENT = "preview" or NEXT_PUBLIC_APP_ENV = "preview"`);
    } else {
      pass(`${surface.previewWorkerName}: preview runtime vars correctly configured`);
    }

    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      if (!pkg.scripts?.["deploy:worker:preview"]) {
        fail(`${surface.dir}/package.json missing deploy:worker:preview script`);
      } else {
        pass(`${surface.previewWorkerName}: deploy:worker:preview script verified in package.json`);
      }
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

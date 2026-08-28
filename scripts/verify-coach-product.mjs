import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => failures.push(message);
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const exists = (relative) => fs.existsSync(path.join(root, relative));
const json = (relative) => JSON.parse(read(relative));

const requiredCoachFiles = [
  "apps/coach-web/package.json",
  "apps/coach-web/app/layout.tsx",
  "apps/coach-web/app/page.tsx",
  "apps/coach-web/app/dashboard/page.tsx",
  "apps/coach-web/app/practice/page.tsx",
  "apps/coach-web/app/pronunciation/page.tsx",
  "apps/coach-web/app/history/page.tsx",
  "apps/coach-web/app/educator/page.tsx",
  "apps/coach-web/app/login/page.tsx",
  "apps/coach-web/app/api/coach/route.ts",
  "apps/coach-web/app/api/product-bridge/route.ts",
  "Docs/Architecture/LUREXA_COACH_PRODUCT_BOUNDARY.md",
];
for (const file of requiredCoachFiles) if (!exists(file)) fail(`Missing first-class Coach surface: ${file}`);
if (!failures.some((item) => item.includes("first-class Coach surface"))) pass("Coach owns a complete standalone web product surface");

const packageJson = json("apps/coach-web/package.json");
if (packageJson.name !== "@lurexa/coach-web") fail("Coach workspace must be named @lurexa/coach-web");
if (packageJson.scripts?.dev !== "next dev --port 3005") fail("Coach local runtime must use the governed dedicated port 3005");
if (!failures.some((item) => item.includes("Coach workspace") || item.includes("Coach local"))) pass("Coach has an independent workspace/runtime identity");

const bootstrap = json("bootstrap/repository.json");
const coachBootstrap = bootstrap.apps.find((item) => item.path === "apps/coach-web");
if (!coachBootstrap || !coachBootstrap.required) fail("Coach must be a required app in bootstrap/repository.json");
else pass("Coach is a required repository app rather than a hidden Learn route");

const deployment = json("deployment/products.json");
const coachDeployment = deployment.deployments.find((item) => item.id === "coach-web");
if (!coachDeployment) fail("deployment/products.json must include coach-web");
else {
  if (coachDeployment.product !== "Lurexa Coach") fail("coach-web deployment must use canonical Lurexa Coach identity");
  if (coachDeployment.workspace !== "@lurexa/coach-web") fail("coach-web deployment must target @lurexa/coach-web");
  if (coachDeployment.rootDirectory !== "apps/coach-web") fail("coach-web deployment root must be apps/coach-web");
  if (coachDeployment.vercelProject !== "lurexa-coach-web") fail("coach-web Vercel project name must be lurexa-coach-web");
}
if (deployment.futureProducts.some((item) => item.product === "Lurexa Coach")) fail("Coach cannot remain a future deployment after apps/coach-web exists");
if (!failures.some((item) => item.includes("deployment") || item.includes("Vercel") || item.includes("future deployment"))) pass("Coach is promoted into active deployment topology");

const domains = read("packages/config/src/domains.ts");
const environment = read("packages/config/src/environment.ts");
if (!domains.includes('"root" | "learn" | "coach" | "teach"')) fail("ecosystem domain registry must expose Coach as a first-class key");
if (!domains.includes('productionUrl: "https://coach.lurexa.org"')) fail("Coach canonical domain must be coach.lurexa.org");
if (!domains.includes('developmentUrl: "http://localhost:3005"')) fail("Coach domain registry must reserve localhost:3005");
if (!environment.includes('coach: "NEXT_PUBLIC_LUREXA_COACH_URL"')) fail("canonical environment contract must expose the Coach public URL override");
if (!failures.some((item) => item.includes("domain") || item.includes("environment contract"))) pass("Coach has a canonical cross-product domain contract");

const productUrls = read("packages/config/src/product-urls.ts");
if (!productUrls.includes('coach: "https://coach.lurexa.org"')) fail("product URL fallbacks must resolve Coach to its own domain");
if (/coach:\s*cleanUrl\([^\n]+\)\s*\?\?\s*`?\$\{learn\}\/coach/.test(productUrls)) fail("Coach must not fall back to a Learn-owned /coach route");
else pass("public URL resolution no longer treats Coach as a Learn sub-route");

const legacyLearnCoach = read("apps/learn-web/app/coach/page.tsx");
if (!legacyLearnCoach.includes('resolveLurexaPublicUrls().coach') || !legacyLearnCoach.includes('redirect(')) fail("Learn /coach must be a compatibility redirect to standalone Coach");
if (!legacyLearnCoach.includes('searchParams') || !legacyLearnCoach.includes('bridge')) fail("Learn Coach compatibility redirect must preserve Product Bridge tokens");
const legacyEducatorCoach = read("apps/learn-web/app/coach/educator/page.tsx");
if (!legacyEducatorCoach.includes('resolveLurexaPublicUrls().coach') || !legacyEducatorCoach.includes('"/educator"')) fail("Learn educator Coach route must redirect to standalone Coach educator mode");
if (!failures.some((item) => item.includes("Learn /coach") || item.includes("Learn Coach") || item.includes("Learn educator"))) pass("Learn launches Coach without retaining canonical Coach UI ownership");

const teachGrowth = read("apps/teach-web/app/growth-plan/page.tsx");
if (!teachGrowth.includes('getEcosystemUrl("coach", "/educator")')) fail("Teach professional growth must route educator practice to standalone Coach");
if (teachGrowth.includes('getEcosystemUrl("learn", "/coach/educator")')) fail("Teach must not route professional Coach practice through Learn");
else pass("Teach routes professional language practice directly to Coach");

const coachApi = read("apps/coach-web/app/api/coach/route.ts");
if (!coachApi.includes('mode?: "learner" | "educator_professional"')) fail("Coach API must preserve explicit learner/professional modes");
if (!coachApi.includes("startEducatorCoachSession")) fail("Coach API must enforce the governed educator benefit path");
if (!coachApi.includes('"Cache-Control": "private, no-store, max-age=0"')) fail("Coach API must disable shared caching for private practice context");
if (!failures.some((item) => item.includes("Coach API"))) pass("Coach owns its authenticated session boundary while delegating trusted services");

const bridgeApi = read("apps/coach-web/app/api/product-bridge/route.ts");
if (!bridgeApi.includes('source: "coach"')) fail("Coach outbound Product Bridges must identify Coach as their source");
if (!bridgeApi.includes("qualifyDestinationRef")) fail("Coach bridge resolution must qualify destination-relative refs for cross-domain navigation");
if (!bridgeApi.includes('getEcosystemUrl(destination, destinationRef)')) fail("Coach cross-domain return must use the centralized ecosystem domain registry");
if (!failures.some((item) => item.includes("Product Bridges") || item.includes("cross-domain"))) pass("Coach owns secure inbound/outbound Product Bridge continuity across web origins");

const practice = read("apps/coach-web/app/practice/page.tsx");
if (!practice.includes("completion.returnBridge.destination")) fail("Coach completion UI must honor the governed return-bridge destination");
if (!practice.includes('session?.mode === "educator_professional"')) fail("Coach practice UI must distinguish educator-professional completion semantics");
if (!practice.includes("Educator-professional sessions stay in professional evidence") || !practice.includes("ordinary learner evidence pipeline")) fail("Coach practice must communicate learner/professional evidence separation");
if (!failures.some((item) => item.includes("completion UI") || item.includes("practice UI") || item.includes("evidence separation"))) pass("Coach preserves distinct learner→Learn and educator→Teach return loops");

const history = read("apps/coach-web/app/history/page.tsx");
if (!history.includes("no fabricated session list") || !history.includes("Raw transcripts")) fail("Coach history must remain evidence- and privacy-aware before a governed history projection exists");
else pass("Coach history avoids fabricated metrics and raw-transcript persistence semantics");

const workflow = read(".github/workflows/deploy.yml");
if (!workflow.includes("apps/coach-web/**") || !workflow.includes("Lurexa Coach Web") || !workflow.includes("@lurexa/coach-web")) fail("Product Deployment Validation must lint/typecheck/build Coach independently");
else pass("Coach is included in independent deployment validation");

const architecture = read("Docs/Architecture/LUREXA_COACH_PRODUCT_BOUNDARY.md");
for (const phrase of [
  "same product tier as Lurexa Learn and Lurexa Teach",
  "Learn owns curriculum and operational learning. Coach owns adaptive language practice.",
  "Educator-professional mode",
  "apps/coach-web",
]) {
  if (!architecture.includes(phrase)) fail(`Coach architecture doc is missing normative boundary: ${phrase}`);
}
if (!failures.some((item) => item.includes("architecture doc"))) pass("Coach's first-class product boundary is documented normatively");

if (failures.length) {
  console.error("\nCoach product verification failed:");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log("\nLurexa Coach first-class product verification passed.");

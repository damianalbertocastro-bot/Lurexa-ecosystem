import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const pass = (message) => console.log(`✓ ${message}`);
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const readJson = (relative) => JSON.parse(read(relative));

const retiredPortal = path.join(root, "apps/teacher-portal");
if (fs.existsSync(retiredPortal)) fail("apps/teacher-portal must remain retired; teacher operations belong inside apps/learn-web/app/teacher");
else pass("standalone teacher-portal app is retired");

const bootstrap = readJson("bootstrap/repository.json");
if (bootstrap.apps.some((app) => app.path === "apps/teacher-portal" || app.name === "teacher-portal")) {
  fail("bootstrap/repository.json must not register the retired teacher portal");
} else pass("bootstrap manifest has one Learn teacher implementation");

const deployment = readJson("deployment/products.json");
const teacherSurface = deployment.deployments.find((item) => item.id === "learn-teacher");
if (!teacherSurface) fail("deployment topology must declare the Learn teacher workspace");
else {
  if (teacherSurface.product !== "Lurexa Learn") fail("teacher workspace product must be Lurexa Learn");
  if (teacherSurface.workspace !== "learn-web") fail("teacher workspace must use the learn-web workspace");
  if (teacherSurface.rootDirectory !== "apps/learn-web") fail("teacher workspace must deploy from apps/learn-web");
  if (teacherSurface.vercelProject !== "lurexa-learn-web") fail("teacher workspace must share the lurexa-learn-web Vercel project");
}
if (!failures.some((item) => item.startsWith("teacher workspace") || item.startsWith("deployment topology"))) pass("deployment topology keeps teacher operations inside Lurexa Learn");

const teacherLayout = read("apps/learn-web/app/teacher/layout.tsx");
if (!teacherLayout.includes('product="learn"')) fail("canonical teacher layout must render the Learn product identity");
if (teacherLayout.includes('product="teach"')) fail("canonical teacher layout must never render the Teach product identity");
else pass("canonical /teacher route tree is Learn-branded");

const login = read("apps/learn-web/app/(auth)/login/page.tsx");
const signup = read("apps/learn-web/app/(auth)/signup/page.tsx");
for (const [file, source] of [["login", login], ["signup", signup]]) {
  if (!source.includes('"/teacher/dashboard"')) fail(`${file} must route educator accounts to the canonical Learn teacher dashboard`);
}
if (!failures.some((item) => item.includes("canonical Learn teacher dashboard"))) pass("educator auth flows target the canonical Learn teacher dashboard");

const studio = read("apps/learn-web/app/teacher/studio/page.tsx");
if (studio.includes("Lurexa Studio") || studio.includes("crs_studio_chem") || studio.includes("saveBranchingScenario")) {
  fail("Learn Scenario Lab must not impersonate Lurexa Studio or persist hard-coded demo scenarios");
} else pass("Learn authoring prototype remains distinct from Lurexa Studio");

const insights = read("apps/learn-web/app/teacher/insights/page.tsx");
if (insights.includes('"org_demo"')) fail("teacher insights must never query a hard-coded demo organization");
if (!insights.includes("authenticatedFetch(") || insights.includes("AnalyticsService")) fail("teacher insights must use the authenticated server projection for organization scope");
else pass("teacher insights are scoped through the authenticated server projection");

if (failures.length) {
  console.error("\nTeacher workspace boundary verification failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log("\nLurexa Learn teacher-workspace boundary verification passed.");

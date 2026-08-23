import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => failures.push(message);
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));

const retiredPortal = path.join(root, "apps/teacher-portal");
if (fs.existsSync(retiredPortal)) fail("apps/teacher-portal must remain retired");
else pass("standalone teacher-portal app is retired");

const bootstrap = readJson("bootstrap/repository.json");
if (bootstrap.apps.some((app) => app.name === "teacher-portal" || app.path === "apps/teacher-portal")) {
  fail("bootstrap manifest must not register teacher-portal");
} else pass("bootstrap manifest has no duplicate teacher app");

const deployment = readJson("deployment/products.json");
const teacherSurface = deployment.deployments.find((item) => item.id === "learn-teacher");
if (!teacherSurface) fail("deployment topology must declare learn-teacher");
else {
  if (teacherSurface.product !== "Lurexa Learn") fail("learn-teacher must belong to Lurexa Learn");
  if (teacherSurface.workspace !== "learn-web") fail("learn-teacher workspace must be learn-web");
  if (teacherSurface.rootDirectory !== "apps/learn-web") fail("learn-teacher rootDirectory must be apps/learn-web");
  if (teacherSurface.vercelProject !== "lurexa-learn-web") fail("learn-teacher must share lurexa-learn-web deployment ownership");
}
if (!failures.some((item) => item.startsWith("learn-teacher") || item.startsWith("deployment topology"))) {
  pass("deployment topology keeps teacher operations inside Lurexa Learn");
}

const canonicalTeacherRoot = path.join(root, "apps/learn-web/app/teacher");
if (!fs.existsSync(canonicalTeacherRoot)) fail("apps/learn-web/app/teacher must remain the canonical teacher workspace");
else pass("canonical teacher routes exist inside learn-web");

if (failures.length) {
  console.error("\nTeacher workspace boundary verification failed:");
  failures.forEach((message) => console.error(`✗ ${message}`));
  process.exit(1);
}

console.log("\nLurexa Learn teacher-workspace boundary verification passed.");

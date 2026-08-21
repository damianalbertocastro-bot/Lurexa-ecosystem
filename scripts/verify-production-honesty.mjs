import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const fail = (message) => failures.push(message);
const pass = (message) => console.log(`✓ ${message}`);

const teacherFiles = [
  "apps/learn-web/app/teacher/dashboard/page.tsx",
  "apps/learn-web/app/teacher/students/page.tsx",
  "apps/learn-web/app/teacher/insights/page.tsx",
  "apps/learn-web/app/teacher/billing/page.tsx",
  "apps/learn-web/app/teacher/studio/page.tsx",
];
for (const file of teacherFiles) {
  const source = read(file);
  if (source.includes("org_demo")) fail(`${file} contains a hard-coded demo organization`);
}
if (!failures.some((item) => item.includes("demo organization"))) pass("teacher operations contain no hard-coded demo organization");

const analytics = read("packages/backend/src/analytics.service.ts");
for (const forbidden of ["Fallback demo", "Carlos Ramirez", "Ana Gomez", "Mateo Diaz"]) {
  if (analytics.includes(forbidden)) fail(`analytics service contains fabricated learner data: ${forbidden}`);
}
if (!failures.some((item) => item.includes("fabricated learner data"))) pass("analytics service contains no fabricated learner roster fallback");

const admin = read("packages/backend/src/admin.service.ts");
for (const forbidden of ["1420", "2840", "1250000", "Colegio San Pedro", "Instituto Educativo Duarte"]) {
  if (admin.includes(forbidden)) fail(`admin service contains a known fabricated operational value: ${forbidden}`);
}
if (!failures.some((item) => item.includes("fabricated operational value"))) pass("admin metrics are not backed by known demo constants");

const billing = read("packages/backend/src/billing.service.ts");
if (billing.includes("checkout.stripe.com/pay/demo_")) fail("billing service must never return a fake Stripe checkout URL");
if (!billing.includes("Paid checkout is not configured yet")) fail("billing service must fail closed while paid checkout is inactive");
else pass("billing fails closed until real commerce is configured");

const marketplace = read("packages/backend/src/marketplace.service.ts");
if (marketplace.includes("marketplace_listings") || marketplace.includes("collection(db") || marketplace.includes("setDoc(")) {
  fail("future Marketplace compatibility service must not persist catalog or purchase data while inactive");
}
if (!marketplace.includes("future concept") || !marketplace.includes("throw unavailable")) {
  fail("future Marketplace service must explicitly remain inactive");
} else pass("future Marketplace cannot execute commerce transactions");

const ecosystem = read("packages/backend/src/ecosystem.service.ts");
if (ecosystem.includes("apiKeyHash: rawKey")) fail("institutional API keys must never persist raw secret material as a hash");
if (ecosystem.includes("Math.random().toString(36)")) fail("institutional API keys must not use Math.random for key material");
if (!ecosystem.includes('crypto.subtle.digest("SHA-256"')) fail("institutional API key storage must hash the secret before persistence");
else pass("institutional API key persistence uses cryptographic random material and hashing");

const quizBuilder = read("apps/learn-web/app/teacher/quizzes/builder/page.tsx");
if (quizBuilder.includes("AI Question Generator")) fail("deterministic quiz sample helper must not be presented as live AI");
if (!quizBuilder.includes("not Lurexa Mind or a live AI generator")) fail("quiz prototype must disclose its current non-AI status");
else pass("prototype content generation is represented honestly");

const courseService = read("packages/backend/src/course.service.ts");
if (courseService.includes("setDoc(") || courseService.includes("updateDoc(")) {
  fail("legacy CourseService must not mutate authoritative course records directly from product/browser code");
}
if (!courseService.includes("Direct course writes are disabled")) {
  fail("legacy CourseService must fail closed and direct callers to the trusted Learn API boundary");
} else pass("legacy CourseService mutations fail closed");

const courseBuilder = read("packages/backend/src/course-builder.service.ts");
for (const forbidden of ["setDoc(", "updateDoc(", "arrayUnion(", "collection(db"]) {
  if (courseBuilder.includes(forbidden)) fail(`legacy CourseBuilderService still contains direct Firestore mutation primitive: ${forbidden}`);
}
if (!courseBuilder.includes("Legacy CourseBuilderService writes are disabled")) {
  fail("legacy CourseBuilderService must fail closed and direct callers to the trusted CoursePlatform boundary");
} else pass("legacy CourseBuilderService mutations fail closed");

if (failures.length) {
  console.error("\nProduction-honesty verification failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log("\nLurexa production-honesty verification passed.");

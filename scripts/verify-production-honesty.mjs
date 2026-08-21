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
for (const forbidden of ["firebase/firestore", "setDoc(", "collection(db", "apiKeyHash: rawKey", "Math.random().toString(36)"]) {
  if (ecosystem.includes(forbidden)) fail(`legacy EcosystemService contains a forbidden direct client persistence pattern: ${forbidden}`);
}
if (!ecosystem.includes("Institutional API-key issuance is server-only")) {
  fail("legacy EcosystemService must redirect API-key issuance to the server-only service");
} else pass("legacy EcosystemService mutations fail closed");

const apiKeys = read("packages/backend/src/institutional-api-key.server.ts");
if (!apiKeys.includes('from "node:crypto"') || !apiKeys.includes("randomBytes(32)") || !apiKeys.includes('createHash("sha256")')) {
  fail("server API-key service must use cryptographic random material and SHA-256 hashing");
}
if (!apiKeys.includes("getServerFirestore") || !apiKeys.includes('["owner", "admin"].includes(role)')) {
  fail("server API-key service must use the Admin boundary and require owner/admin authorization");
} else pass("institutional API keys are issued through an authorized server-only boundary");

const quizBuilder = read("apps/learn-web/app/teacher/quizzes/builder/page.tsx");
if (quizBuilder.includes("AI Question Generator")) fail("deterministic quiz sample helper must not be presented as live AI");
if (!quizBuilder.includes("not Lurexa Mind or a live AI generator")) fail("quiz prototype must disclose its current non-AI status");
if (!quizBuilder.includes("PrototypeContentService")) fail("quiz prototype should consume the truthfully named prototype content service");
else pass("prototype content generation is represented honestly");

const prototypeContent = read("packages/backend/src/ai-generator.service.ts");
if (!prototypeContent.includes("PrototypeContentService")) fail("deterministic content helper must expose a truthful canonical service name");
if (prototypeContent.includes("Server-side AI prompt trigger") || prototypeContent.includes("OpenAI / Anthropic server-side route")) {
  fail("deterministic prototype content service must not claim an active AI provider boundary");
} else pass("prototype content service naming matches actual behavior");

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

const firestoreRules = read("firestore.rules");
if (!firestoreRules.includes("match /courses/{courseId}") || !firestoreRules.includes("allow create, update, delete: if false")) {
  fail("Firestore rules must deny direct client mutation of authoritative course records");
}
for (const collection of ["modules", "lessons", "studio_scenarios", "classroom_sessions", "api_keys", "marketplace_listings", "purchases"]) {
  if (!firestoreRules.includes(`match /${collection}/`)) fail(`Firestore rules must explicitly protect ${collection}`);
}
if (!failures.some((item) => item.includes("Firestore rules"))) pass("Firestore rules mirror trusted server ownership for sensitive records");

if (failures.length) {
  console.error("\nProduction-honesty verification failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log("\nLurexa production-honesty verification passed.");

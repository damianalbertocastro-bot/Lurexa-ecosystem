import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const size = (file) => fs.statSync(path.join(root, file)).size;
const exists = (file) => fs.existsSync(path.join(root, file));
const check = (condition, message) => {
  if (!condition) throw new Error(`Signature rollout verification failed: ${message}`);
  console.log(`✓ ${message}`);
};

const corpus = JSON.parse(read("Docs/Curriculum/Linguistic-Intelligence/data/dominican-error-corpus.v0.1.json"));
const catalog = read("packages/backend/src/knowledge-object-catalog.server.ts");
const learnerContext = read("packages/backend/src/learner-context.server.ts");
const signatureCore = read("packages/backend/src/signature-experience.server.ts");
const learnTeacherSignature = read("packages/backend/src/learn-teacher-signature-experience.server.ts");
const learnTeacherRoster = read("packages/backend/src/learn-teacher-roster.server.ts");
const learnRosterRoute = read("apps/learn-web/app/api/teacher/roster/route.ts");
const learnSignatureRoute = read("apps/learn-web/app/api/teacher/signature/route.ts");
const learnStudents = read("apps/learn-web/app/teacher/students/page.tsx");
const teachShell = read("apps/teach-web/app/components/TeachShell.tsx");
const insight = read("packages/backend/src/insight-signature-experience.server.ts");
const rolloutTypes = read("packages/types/src/signature-rollout.ts");
const rolloutSdk = read("packages/sdk/src/signature-rollout.ts");
const operations = read("packages/backend/src/signature-operations.server.ts");
const operationsRoute = read("apps/admin-portal/app/api/admin/signature-operations/route.ts");
const operationsPage = read("apps/admin-portal/app/signature-operations/page.tsx");
const telemetry = read("packages/backend/src/signature-telemetry.server.ts");

// Semantic coverage.
check(Array.isArray(corpus) && corpus.length === 21, "current Dominican-English corpus contains the expected 21 governed patterns");
for (const entry of corpus) {
  check(typeof entry.patternId === "string" && catalog.includes(`\"${entry.patternId}\"`), `Knowledge Object mapping covers ${entry.patternId}`);
}
check(catalog.includes("listMappedLinguisticPatternIds"), "Knowledge Object catalog exposes governed corpus mapping inventory");

// Authoritative Learn / Teach product boundary.
check(learnerContext.includes('learn: ["learn_adaptive_practice", "teacher_instructional_support"]'), "Core assigns delegated student instructional support to Lurexa Learn");
check(learnerContext.includes("teach: []"), "Core grants Lurexa Teach no delegated student-context purpose");
check(learnerContext.includes('request.requestingProduct !== "learn"'), "Core delegated authorization requires Learn as the requesting product");
check(learnerContext.includes('delegatedTeacherRoles = new Set(["owner", "admin", "teacher"])'), "Core owns the delegated educator-role policy");
check(learnerContext.includes('learnerMembership?.role !== "student"'), "Core requires the supported learner to be a student member");
check(learnerContext.includes('database.collection("courses").where("orgId", "==", request.organizationId)'), "explicit organization requests pin curriculum progress to that organization");
check(signatureCore.includes('input.request.consumer === "learn" && input.actorId !== input.request.learnerId'), "Signature Core distinguishes delegated Learn teacher reads from learner self-service");
check(!signatureCore.includes('teach: { product: "teach", purpose: "teacher_instructional_support" }'), "Signature Core no longer exposes Teach as a student instructional consumer");
check(learnTeacherSignature.includes('consumer: "learn"'), "Learn teacher instructional Pulse uses canonical Learn consumer identity");
check(learnTeacherSignature.includes("actorId: input.actorId"), "Learn teacher adapter forwards the real educator actor into Core");

// Roster-backed Learn Teacher Workspace.
check(learnTeacherRoster.includes("CoursePlatformService.getTeacherCourses(actor)"), "Learn teacher roster starts from courses the educator is authorized to teach");
check(learnTeacherRoster.includes('snapshot.data()?.role === "student"'), "Learn teacher roster verifies student membership before surfacing a learner");
check(!learnTeacherRoster.includes("email"), "Learn teacher roster response does not add learner email to instructional support");
check(learnRosterRoute.includes('"Cache-Control": "private, no-store, max-age=0"'), "Learn teacher roster API is explicitly private/no-store");
check(learnSignatureRoute.includes('consumer: "learn"'), "Learn teacher Signature telemetry uses Learn product identity");
check(learnSignatureRoute.includes('"Cache-Control": "private, no-store, max-age=0"'), "Learn teacher Signature API is explicitly private/no-store");
check(learnStudents.includes('authenticatedJson<LearnTeacherInstructionalRosterV1>(currentUser, "/api/teacher/roster")'), "Learn Students UI selects learners only from the authorized roster API");
check(learnStudents.includes("NEXT_PUBLIC_LEARN_TEACHER_SIGNATURE_V1"), "Learn teacher learner-model projection rollout is independently feature-flagged");
check(learnStudents.includes("aria-pressed") && learnStudents.includes("focus-visible:ring"), "Learn teacher roster selection preserves accessible state and visible keyboard focus");
check(rolloutTypes.includes("LearnTeacherInstructionalRosterV1") && !rolloutTypes.includes("TeachInstructionalRosterV1"), "rollout contracts name Learn as the operational teacher-workspace owner");
check(rolloutSdk.includes("getLearnTeacherInstructionalRoster") && !rolloutSdk.includes("getTeachInstructionalRoster"), "SDK exposes the roster through Learn rather than Teach");

// Lurexa Teach must remain professional-development-only at this boundary.
check(!exists("apps/teach-web/app/students/page.tsx"), "Lurexa Teach has no operational student-roster page");
check(!exists("apps/teach-web/app/api/teach/roster/route.ts"), "Lurexa Teach has no student roster API");
check(!exists("apps/teach-web/app/api/teach/signature/route.ts"), "Lurexa Teach has no delegated student Signature API");
check(!exists("packages/backend/src/teach-roster.server.ts"), "backend has no Teach-owned student roster capability");
check(!exists("packages/backend/src/teach-signature-experience.server.ts"), "backend has no Teach-owned student projection capability");
check(!teachShell.includes('["Students", "/students"]') && !teachShell.includes('href="/students"'), "Teach navigation contains no student-management entry point");
check(teachShell.includes('["Learning", "/courses"]'), "Teach navigation centers professional learning rather than classroom operations");

// Aggregate-first Insight.
const insightContractStart = rolloutTypes.indexOf("export interface InsightOrganizationSignatureOverviewV1");
const insightContractEnd = rolloutTypes.indexOf("export interface SignatureOperationalRollupV1", insightContractStart);
const insightContract = rolloutTypes.slice(insightContractStart, insightContractEnd);
check(insightContractStart >= 0 && insightContractEnd > insightContractStart, "Insight aggregate contract is statically inspectable");
check(!insightContract.includes("learnerId"), "Insight organization overview contract exposes no learner identifiers");
check(insight.includes('INSIGHT_ROLES = new Set(["owner", "admin"])'), "Insight organization analytics is restricted to owner/admin roles");
check(insight.includes("Aggregate-first Insight consumer"), "Insight explicitly documents aggregate-first privacy semantics");
check(insight.includes('where("organizationId", "==", input.organizationId)'), "Insight evidence aggregation remains organization-scoped");
check(insight.includes("const isCurrentStudent = async") && insight.includes("if (!await isCurrentStudent(learnerId)) continue;") && insight.includes("if (!await isCurrentStudent(value.learnerId)) continue;"), "Insight participation and semantic coverage are restricted to current student membership");
check(rolloutSdk.includes("getInsightOrganizationOverview"), "supported SDK declares the Insight aggregate consumer boundary");

// Operations and privacy.
check(operations.includes('token.role !== "super_admin"'), "Signature Operations requires the existing superadmin claim");
check(operations.includes("percentile95"), "Signature Operations calculates p95 projection latency");
check(operations.includes("PROJECTION_P95_WARNING_MS = 1_200"), "Signature Operations has an explicit initial p95 latency warning budget");
check(operationsRoute.includes('"Cache-Control": "private, no-store, max-age=0"'), "Signature Operations API is private/no-store");
check(operationsPage.includes("Identity-free operational telemetry"), "operations UI states the identity-free telemetry boundary");
check(operationsPage.includes("P95 warning budget") && operationsPage.includes("p95DurationMs"), "operations UI surfaces p95 latency against the explicit warning budget");
check(operationsPage.includes("overBudget") && operationsPage.includes("watch"), "operations UI marks over-budget latency as a non-alarmist watch state");
check(!telemetry.includes("learnerId") && !telemetry.includes("organizationId") && !telemetry.includes("actorId"), "telemetry schema remains free of learner, tenant, and actor identities");

// Initial source-size/performance budgets. These are not runtime Web Vitals.
const byteBudgets = new Map([
  ["apps/learn-web/app/teacher/students/page.tsx", 24_000],
  ["apps/admin-portal/app/signature-operations/page.tsx", 20_000],
  ["packages/backend/src/learn-teacher-roster.server.ts", 12_000],
  ["packages/backend/src/insight-signature-experience.server.ts", 12_000],
  ["packages/backend/src/signature-operations.server.ts", 12_000],
]);
for (const [file, budget] of byteBudgets) {
  check(size(file) <= budget, `${file} stays within its ${budget}-byte source budget`);
}

// Structural visual/accessibility regression gates until browser screenshots exist.
for (const [name, source] of [["Learn Teacher Students", learnStudents], ["Signature Operations", operationsPage]]) {
  check(source.includes("sm:") && source.includes("lg:"), `${name} retains responsive layout breakpoints`);
  check(source.includes("aria-") || source.includes("role=\""), `${name} retains explicit accessibility semantics`);
  check(source.includes("focus-visible"), `${name} retains visible keyboard focus treatment`);
}

console.log("Lurexa Signature Rollout S9 verification passed with authoritative Learn/Teach product boundaries.");

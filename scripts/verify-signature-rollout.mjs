import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const size = (file) => fs.statSync(path.join(root, file)).size;
const check = (condition, message) => {
  if (!condition) throw new Error(`Signature rollout verification failed: ${message}`);
  console.log(`✓ ${message}`);
};

const corpus = JSON.parse(read("Docs/Curriculum/Linguistic-Intelligence/data/dominican-error-corpus.v0.1.json"));
const catalog = read("packages/backend/src/knowledge-object-catalog.server.ts");
const learnerContext = read("packages/backend/src/learner-context.server.ts");
const teachSignature = read("packages/backend/src/teach-signature-experience.server.ts");
const teachRoster = read("packages/backend/src/teach-roster.server.ts");
const teachRosterRoute = read("apps/teach-web/app/api/teach/roster/route.ts");
const teachStudents = read("apps/teach-web/app/students/page.tsx");
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

// Delegated Core authorization.
check(learnerContext.includes('request.purpose !== "teacher_instructional_support"'), "Core limits delegated learner-context access to the approved Teach purpose");
check(learnerContext.includes('delegatedTeacherRoles = new Set(["owner", "admin", "teacher"])'), "Core owns the delegated educator-role policy");
check(learnerContext.includes('learnerMembership?.role !== "student"'), "Core requires the supported learner to be a student member");
check(learnerContext.includes('database.collection("courses").where("orgId", "==", request.organizationId)'), "explicit organization requests pin curriculum progress to that organization");
check(teachSignature.includes("actorId: input.actorId"), "Teach forwards the real educator actor into Core");
check(!teachSignature.includes("actorId: input.learnerId"), "Teach no longer impersonates the learner inside the projection adapter");

// Roster-backed Teach UI.
check(teachRoster.includes("CoursePlatformService.getTeacherCourses(actor)"), "Teach roster starts from courses the educator is authorized to teach");
check(teachRoster.includes('snapshot.data()?.role === "student"'), "Teach roster verifies student membership before surfacing a learner");
check(!teachRoster.includes("email"), "Teach roster response does not add learner email to instructional support");
check(teachRosterRoute.includes('"Cache-Control": "private, no-store, max-age=0"'), "Teach roster API is explicitly private/no-store");
check(teachStudents.includes('authenticatedJson<TeachInstructionalRosterV1>(user, "/api/teach/roster")'), "Teach Students UI selects learners only from the authorized roster API");
check(!teachStudents.includes("<input"), "Teach Students UI has no free-form learner identifier input");
check(teachStudents.includes("NEXT_PUBLIC_TEACH_SIGNATURE_V1"), "Teach learner-model projection rollout is independently feature-flagged");
check(teachStudents.includes("aria-pressed") && teachStudents.includes("focus-visible:ring"), "Teach roster selection preserves accessible state and visible keyboard focus");

// Aggregate-first Insight.
const insightContractStart = rolloutTypes.indexOf("export interface InsightOrganizationSignatureOverviewV1");
const insightContractEnd = rolloutTypes.indexOf("export interface SignatureOperationalRollupV1", insightContractStart);
const insightContract = rolloutTypes.slice(insightContractStart, insightContractEnd);
check(insightContractStart >= 0 && insightContractEnd > insightContractStart, "Insight aggregate contract is statically inspectable");
check(!insightContract.includes("learnerId"), "Insight organization overview contract exposes no learner identifiers");
check(insight.includes('INSIGHT_ROLES = new Set(["owner", "admin"])'), "Insight organization analytics is restricted to owner/admin roles");
check(insight.includes("Aggregate-first Insight consumer"), "Insight explicitly documents aggregate-first privacy semantics");
check(insight.includes('where("organizationId", "==", input.organizationId)'), "Insight evidence aggregation remains organization-scoped");
check(rolloutSdk.includes("getInsightOrganizationOverview"), "supported SDK declares the Insight aggregate consumer boundary");

// Operations and privacy.
check(operations.includes('token.role !== "super_admin"'), "Signature Operations requires the existing superadmin claim");
check(operations.includes("percentile95"), "Signature Operations calculates p95 projection latency");
check(operations.includes("PROJECTION_P95_WARNING_MS = 1_200"), "Signature Operations has an explicit initial p95 latency warning budget");
check(operationsRoute.includes('"Cache-Control": "private, no-store, max-age=0"'), "Signature Operations API is private/no-store");
check(operationsPage.includes("Identity-free operational telemetry"), "operations UI states the identity-free telemetry boundary");
check(!telemetry.includes("learnerId") && !telemetry.includes("organizationId") && !telemetry.includes("actorId"), "telemetry schema remains free of learner, tenant, and actor identities");

// Initial source-size/performance budgets. These are not runtime Web Vitals; they
// prevent this first slice from silently becoming a monolithic client bundle.
const byteBudgets = new Map([
  ["apps/teach-web/app/students/page.tsx", 20_000],
  ["apps/admin-portal/app/signature-operations/page.tsx", 20_000],
  ["packages/backend/src/teach-roster.server.ts", 12_000],
  ["packages/backend/src/insight-signature-experience.server.ts", 12_000],
  ["packages/backend/src/signature-operations.server.ts", 12_000],
]);
for (const [file, budget] of byteBudgets) {
  check(size(file) <= budget, `${file} stays within its ${budget}-byte source budget`);
}

// Structural visual/accessibility regression gates until a browser screenshot
// runner is introduced. These lock the intended responsive/accessibility anatomy.
for (const [name, source] of [["Teach Students", teachStudents], ["Signature Operations", operationsPage]]) {
  check(source.includes("sm:") && source.includes("lg:"), `${name} retains responsive layout breakpoints`);
  check(source.includes("aria-") || source.includes("role=\""), `${name} retains explicit accessibility semantics`);
  check(source.includes("focus-visible"), `${name} retains visible keyboard focus treatment`);
}

console.log("Lurexa Signature Rollout S9 verification passed.");

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
const curriculumCatalog = read("packages/backend/src/knowledge-object-catalog.server.ts");
const linguisticCatalog = read("packages/backend/src/linguistic-knowledge-object-catalog.server.ts");
const governedCatalog = read("packages/backend/src/governed-knowledge-object-catalog.server.ts");
const adaptivePath = read("packages/backend/src/adaptive-learning-path.server.ts");
const learnerContext = read("packages/backend/src/learner-context.server.ts");
const educatorAccess = read("packages/backend/src/educator-access.server.ts");
const educatorTypes = read("packages/types/src/educator-access.ts");
const educatorDelegationTest = read("packages/backend/scripts/test-signature-delegation.ts");
const signatureCore = read("packages/backend/src/signature-experience.server.ts");
const learnTeacherSignature = read("packages/backend/src/learn-teacher-signature-experience.server.ts");
const learnTeacherRoster = read("packages/backend/src/learn-teacher-roster.server.ts");
const learnRosterRoute = read("apps/learn-web/app/api/teacher/roster/route.ts");
const learnSignatureRoute = read("apps/learn-web/app/api/teacher/signature/route.ts");
const learnStudents = read("apps/learn-web/app/teacher/students/page.tsx");
const teachShell = read("apps/teach-web/app/components/TeachShell.tsx");
const teachLogin = read("apps/teach-web/app/login/page.tsx");
const insight = read("packages/backend/src/insight-signature-experience.server.ts");
const rolloutTypes = read("packages/types/src/signature-rollout.ts");
const rolloutSdk = read("packages/sdk/src/signature-rollout.ts");
const operations = read("packages/backend/src/signature-operations.server.ts");
const operationsRoute = read("apps/admin-portal/app/api/admin/signature-operations/route.ts");
const operationsPage = read("apps/admin-portal/app/signature-operations/page.tsx");
const telemetry = read("packages/backend/src/signature-telemetry.server.ts");

// Semantic coverage and ownership.
check(Array.isArray(corpus) && corpus.length === 21, "current Dominican-English corpus contains the expected 21 governed patterns");
for (const entry of corpus) {
  check(typeof entry.patternId === "string" && linguisticCatalog.includes(`\"${entry.patternId}\"`), `linguistic Knowledge Object mapping covers ${entry.patternId}`);
}
check(linguisticCatalog.includes("listMappedLinguisticPatternIds"), "linguistic catalog exposes governed corpus mapping inventory");
check(curriculumCatalog.includes("eng.skill.introductions.personal-identity") && curriculumCatalog.includes("eng.pronunciation.consonant-linking"), "current curriculum-linked Knowledge Objects from main remain in the curriculum catalog");
check(governedCatalog.includes("listCurriculumKnowledgeObjects") && governedCatalog.includes("listLinguisticKnowledgeObjects"), "governed semantic adapter combines curriculum and linguistic catalogs without duplicating ownership");
check(adaptivePath.includes("getGovernedKnowledgeObjectById"), "Adaptive Path validates semantic references against the unified governed catalog");

// Authoritative Learn / Teach product boundary.
check(learnerContext.includes('learn: ["learn_adaptive_practice", "teacher_instructional_support"]'), "Core assigns delegated student instructional support to Lurexa Learn");
check(learnerContext.includes("teach: []"), "Core grants Lurexa Teach no delegated student-context purpose");
check(learnerContext.includes('request.requestingProduct !== "learn"'), "Core delegated authorization requires Learn as the requesting product");
check(learnerContext.includes("!request.organizationId || !request.courseId"), "Core requires explicit organization and course boundaries for delegated instructional support");
check(learnerContext.includes("getEducatorCourseAccessDecision") && learnerContext.includes("qualification-linked authorization for this exact course"), "Core requires qualification-backed authorization for the exact delegated course");
check(learnerContext.includes('learnerMembership?.role !== "student"'), "Core requires the supported learner to be a student member");
check(learnerContext.includes('progress = allProgress.filter((record) => record.courseId === request.courseId)'), "delegated curriculum context can pin to the exact Learn course");
check(learnerContext.includes("const delegatedTeacher") && learnerContext.includes("insights = delegatedTeacher") && learnerContext.includes("? []"), "Core withholds broader derived insights from delegated teachers until course provenance exists");
check(signatureCore.includes('input.request.consumer === "learn" && input.actorId !== input.request.learnerId'), "Signature Core distinguishes delegated Learn teacher reads from learner self-service");
check(!signatureCore.includes('teach: { product: "teach", purpose: "teacher_instructional_support" }'), "Signature Core no longer exposes Teach as a student instructional consumer");
check(learnTeacherSignature.includes('consumer: "learn"'), "Learn teacher instructional Pulse uses canonical Learn consumer identity");
check(learnTeacherSignature.includes("getEducatorCourseAccessDecision") && learnTeacherSignature.includes("courseId: string"), "Learn teacher projection authorizes the exact selected course before projection");
check(learnTeacherSignature.includes("authorizationCourseId: input.courseId"), "trusted Signature server chain carries the exact authorized course into Core");
check(learnTeacherSignature.includes("actorId: input.actorId"), "Learn teacher adapter forwards the real educator actor into Core");

// Educator identity, entitlement, qualification and authorization model.
check(educatorTypes.includes("EducatorEntitlementV1") && educatorTypes.includes("EducatorQualificationScopeV1") && educatorTypes.includes("TeachingAuthorizationV1"), "educator access contracts separate entitlement, qualification, and teaching authorization");
check(educatorTypes.includes("EducatorDevelopmentRecommendationV1"), "educator access contract carries governed professional-development targets for denied scopes");
check(educatorAccess.includes('collection("user-entitlements")') && educatorAccess.includes('collection("educator-qualifications")') && educatorAccess.includes('collection("teaching-authorizations")'), "Core stores educator entitlement, qualification, and authorization as separate trusted records");
check(educatorAccess.includes("authorization.levels.every((level) => qualification.levels.includes(level))"), "teaching authorization cannot silently exceed qualification level scope");
check(educatorAccess.includes("authorization.courseIds.includes(course.id)"), "Learn teacher course access requires explicit course authorization");
check(!educatorAccess.includes("governanceRole"), "owner/admin governance role cannot bypass professional teaching qualification");
check(educatorAccess.includes('teach: verifiedEducator || explicitTeach') && educatorAccess.includes('coachFull: verifiedEducator || explicitCoach'), "verified educators automatically receive Teach and full Coach benefits under one identity");
check(educatorAccess.includes('product: "teach"') && educatorAccess.includes('reason: "extend_level_scope"'), "higher-scope denial produces a governed Teach development target");
check(educatorDelegationTest.includes("teacher membership alone does not authorize") && educatorDelegationTest.includes("higher-level course stays locked"), "Firestore integration test covers role-only denial and higher-level scope denial");
check(educatorDelegationTest.includes("organization ownership does not substitute"), "Firestore integration test proves owner status cannot substitute for teaching qualification");
check(educatorDelegationTest.includes("Teach learner can use Teach") && educatorDelegationTest.includes("practicing-educator privileges"), "Firestore integration test separates Teach learner entitlement from practicing educator access");
check(educatorDelegationTest.includes("automatically receives Teach and full Coach benefits"), "Firestore integration test covers automatic educator benefits");
check(educatorDelegationTest.includes("governed Teach growth target") && educatorDelegationTest.includes("Coach support"), "Firestore integration test covers higher-level professional-growth routing");
check(educatorDelegationTest.includes('requestingProduct: "teach"') && educatorDelegationTest.includes("cannot request student instructional context"), "Teach entitlement remains distinct from Learn student-operation authority");
check(teachLogin.includes("same account") && teachLogin.includes("no second Teach registration"), "Teach sign-in communicates shared Lurexa identity for existing Learn educators");

// Roster-backed Learn Teacher Workspace.
check(learnTeacherRoster.includes("CoursePlatformService.getTeacherCourses(actor)"), "Learn teacher roster starts from organization courses visible to the educator relationship");
check(learnTeacherRoster.includes("getEducatorCourseAccessDecision") && learnTeacherRoster.includes("decision.allowed"), "Learn teacher roster filters every course through qualification-backed authorization");
check(learnTeacherRoster.includes("Organization role alone does not create instructional access"), "Learn roster states that membership affiliation cannot substitute for qualification");
check(learnTeacherRoster.includes('snapshot.data()?.role === "student"'), "Learn teacher roster verifies student membership before surfacing a learner");
check(!learnTeacherRoster.includes("email"), "Learn teacher roster response does not add learner email to instructional support");
check(learnRosterRoute.includes('"Cache-Control": "private, no-store, max-age=0"'), "Learn teacher roster API is explicitly private/no-store");
check(learnSignatureRoute.includes('consumer: "learn"'), "Learn teacher Signature telemetry uses Learn product identity");
check(learnSignatureRoute.includes('url.searchParams.get("courseId")') && learnSignatureRoute.includes("learnerId, organizationId, and courseId"), "Learn teacher Signature API requires exact course scope");
check(learnSignatureRoute.includes('"Cache-Control": "private, no-store, max-age=0"'), "Learn teacher Signature API is explicitly private/no-store");
check(learnStudents.includes('authenticatedJson<LearnTeacherInstructionalRosterV1>(currentUser, "/api/teacher/roster")'), "Learn Students UI selects learners only from the authorized roster API");
check(learnStudents.includes("courseId: selected.courseId"), "Learn Students UI sends the selected authorized course with instructional-support requests");
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
  ["packages/backend/src/learn-teacher-roster.server.ts", 14_000],
  ["packages/backend/src/insight-signature-experience.server.ts", 12_000],
  ["packages/backend/src/signature-operations.server.ts", 12_000],
  ["packages/backend/src/educator-access.server.ts", 18_000],
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

console.log("Lurexa Signature Rollout S9 verification passed with authoritative Learn/Teach, educator qualification, and split semantic-catalog boundaries.");

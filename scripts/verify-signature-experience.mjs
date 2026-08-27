import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const check = (condition, message) => {
  if (!condition) throw new Error(`Signature Experience verification failed: ${message}`);
  console.log(`✓ ${message}`);
};

const contracts = read("packages/types/src/signature-experience.ts");
const coachTypes = read("packages/types/src/coach.ts");
const bridgeService = read("packages/backend/src/product-bridge.server.ts");
const completionService = read("packages/backend/src/coach-session-completion.server.ts");
const resumeService = read("packages/backend/src/coach-session-state.server.ts");
const telemetryService = read("packages/backend/src/signature-telemetry.server.ts");
const learnerContext = read("packages/backend/src/learner-context.server.ts");
const signatureService = read("packages/backend/src/signature-experience.server.ts");
const learnTeacherSignatureService = read("packages/backend/src/learn-teacher-signature-experience.server.ts");
const coachRoute = read("apps/coach-web/app/api/coach/route.ts");
const coachPractice = read("apps/coach-web/app/practice/page.tsx");
const signatureRoute = read("apps/learn-web/app/api/signature/route.ts");
const learnTeacherSignatureRoute = read("apps/learn-web/app/api/teacher/signature/route.ts");
const adaptiveAdapter = read("packages/backend/src/adaptive-learning-path.server.ts");
const memoryThread = read("packages/backend/src/memory-thread.server.ts");
const signaturePanel = read("apps/learn-web/app/dashboard/components/SignatureExperiencePanel.tsx");
const adaptiveUi = read("packages/ui/src/AdaptiveLearningPath.tsx");
const uiPackage = JSON.parse(read("packages/ui/package.json"));
const catalog = read("packages/backend/src/knowledge-object-catalog.server.ts");
const uiFiles = [
  "packages/ui/src/LearnerPulse.tsx",
  "packages/ui/src/AdaptiveLearningPath.tsx",
  "packages/ui/src/MemoryThread.tsx",
  "packages/ui/src/MindTrace.tsx",
  "packages/ui/src/ProductBridge.tsx",
  "packages/ui/src/KnowledgeObject.tsx",
].map(read);

check(contracts.includes('export const SIGNATURE_EXPERIENCE_CONTRACT_VERSION = "1"'), "signature contracts remain explicitly versioned at v1");
check(contracts.includes('"return_to_learning"') && contracts.includes('"professional_growth"'), "Product Bridge contract includes learner-return and educator professional-growth purposes");
check(bridgeService.includes('"learn:coach:targeted_practice"'), "Learn → Coach targeted-practice handoff is allowlisted");
check(bridgeService.includes('"coach:learn:return_to_learning"'), "Coach → Learn return handoff is allowlisted");
check(bridgeService.includes('"coach:teach:professional_growth"'), "Coach → Teach educator professional-growth handoff is allowlisted");
check(bridgeService.includes("singleUse: input.singleUse ?? true"), "Product Bridge defaults to single-use");
check(bridgeService.includes("Product Bridge has expired."), "expired Product Bridges fail closed");
check(bridgeService.includes("Product Bridge has already been used."), "replayed single-use Product Bridges fail closed");
check(!uiPackage.dependencies?.["@lurexa/types"], "shared UI remains independent from domain-contract ownership");
check(coachTypes.includes("CoachSessionEndResult"), "Coach completion has an explicit typed result");
check(completionService.includes("export async function endCoachSession"), "Coach completion is isolated behind a server capability");
check(coachRoute.includes('body.action === "endSession"'), "Coach web exposes the authenticated Coach completion action");
check(coachRoute.includes("endCoachSession"), "Coach completion route delegates to the isolated signature capability");
check(completionService.includes('purpose: educatorMode ? "professional_growth" : "return_to_learning"'), "Coach completion creates purpose-scoped educator and learner return bridges");
check(completionService.includes('destination: educatorMode ? "teach" : "learn"'), "Coach completion keeps educator and learner destinations distinct");
check(completionService.includes('event: "coach.session_completed"'), "learner-mode Coach completion contributes explicit Core evidence");

const completionPayloadStart = completionService.indexOf('event: "coach.session_completed"');
const completionPayloadEnd = completionService.indexOf("provenance:", completionPayloadStart);
const completionPayload = completionService.slice(completionPayloadStart, completionPayloadEnd);
check(completionPayloadStart >= 0 && completionPayloadEnd > completionPayloadStart, "Coach learner completion evidence payload is statically inspectable");
check(!/(?:^|[,{]\s*)transcript\s*:/.test(completionPayload), "Coach learner completion evidence does not persist the conversation transcript");
check(completionService.includes('id: `coach_session_completed_${session.id}`'), "Coach learner completion evidence is idempotently keyed by session");
check(completionService.includes('.where("source.activityId", "==", input.sessionId)'), "Coach completion finds only evidence tied to the completed session for redaction");
check(completionService.includes('if (value.learnerId !== input.learnerId || value.source?.product !== "coach")'), "Coach evidence redaction verifies learner and product ownership");
check(completionService.includes('const { learnerForm: _discardedLearnerForm, ...minimizedPayload } = payload'), "Coach completion removes raw learnerForm from persisted turn evidence");
check(completionService.includes("transcript: []"), "completed Coach session storage drops the raw transcript");
check(completionService.indexOf("redactCompletedCoachTurnEvidence") < completionService.lastIndexOf("createProductBridge"), "Coach redacts completed utterance data before issuing the return bridge");
check(completionService.indexOf("createProductBridge") < completionService.indexOf('status: "completed"'), "Coach is finalized only after the return bridge is created");
check(coachPractice.includes("async function finish()"), "Coach exposes an explicit learner-visible completion action");
check(coachPractice.includes('action: "endSession"'), "Coach UI closes the server session before leaving");
check(coachPractice.includes('/api/product-bridge?action=resolve'), "Coach UI resolves the return bridge before navigation");
check(coachPractice.includes("const destination = completion.returnBridge.destination"), "Coach validates the governed return-bridge destination rather than hard-coding a product");
check(coachPractice.includes("Finish & return to Teach") && coachPractice.includes("Finish & return to Learn"), "Coach labels learner and educator semantic completion transitions clearly");

check(resumeService.includes("resumeCoachSession"), "Coach refresh recovery is isolated behind an authorized server capability");
check(resumeService.includes("session.learnerId !== actor.uid"), "Coach resume verifies session ownership");
check(resumeService.includes('session.status !== "active"'), "Coach resume rejects completed sessions");
check(resumeService.includes("getScopedLearnerContext"), "Coach resume re-authorizes learner context instead of trusting restored client data");
check(coachRoute.includes('body.action === "resumeSession"'), "Coach API exposes authenticated active-session restoration");
check(coachPractice.includes("window.sessionStorage.setItem(ACTIVE_SESSION_KEY, payload.session.id)"), "Coach stores only its opaque active session ID for refresh recovery");
check(coachPractice.includes('action: "resumeSession"'), "Coach client revalidates a stored session through the server after refresh");
check(coachPractice.includes("window.sessionStorage.removeItem(ACTIVE_SESSION_KEY)"), "Coach clears stale/completed client session references");

check(learnTeacherSignatureService.includes("getLearnTeacherLearnerPulseProjection"), "Learn Teacher Workspace has the governed delegated Learner Pulse boundary");
check(learnTeacherSignatureService.includes("Learn teacher instructional support requires explicit organization and course boundaries."), "Learn teacher instructional support fails closed without explicit tenant and course scope");
check(learnerContext.includes('!["owner", "admin", "teacher"].includes(actorMembership.role)'), "Core restricts delegated Learn teacher access to governed educator affiliations before qualification checks");
check(learnerContext.includes('learnerMembership?.role !== "student"'), "Core verifies the supported learner is a student in the same organization");
check(learnerContext.includes('request.purpose !== "teacher_instructional_support" || request.requestingProduct !== "learn"'), "Core limits delegated context to Learn teacher instructional support");
check(learnerContext.includes("teach: []"), "Core grants Lurexa Teach no delegated student-context purpose");
check(learnerContext.includes("Delegated instructional support requires explicit organization and course boundaries."), "Core requires explicit tenant and exact-course scope for delegated instructional support");
check(learnerContext.includes("getEducatorCourseAccessDecision"), "Core requires qualification-backed exact-course authorization for delegated instructional support");
check(learnTeacherSignatureService.includes("actorId: input.actorId"), "Learn teacher workspace passes the real educator actor through to Core");
check(!learnTeacherSignatureService.includes("actorId: input.learnerId"), "Learn teacher workspace does not impersonate the learner");
check(learnTeacherSignatureService.includes("projection.organizationId !== input.organizationId"), "Learn teacher workspace rejects projections that resolve to another organization");
check(learnTeacherSignatureService.includes('consumer: "learn"'), "teacher instructional projection uses canonical Learn consumer identity");
check(signatureService.includes('input.request.consumer === "learn" && input.actorId !== input.request.learnerId'), "Signature service distinguishes Learn educator delegation from learner self-service");
check(!signatureService.includes('teach: { product: "teach", purpose: "teacher_instructional_support" }'), "Signature service does not expose Teach as a student-support consumer");
check(learnTeacherSignatureRoute.includes("CoursePlatformService.authenticate"), "Learn teacher Signature API authenticates the caller server-side");
check(learnTeacherSignatureRoute.includes("learnerId, organizationId, and courseId are required"), "Learn teacher Signature API requires explicit learner, tenant, and course identifiers");
check(!learnTeacherSignatureRoute.includes("payload"), "Learn teacher Signature API does not expose raw learner evidence payload plumbing");
check(learnTeacherSignatureRoute.includes('kind: "projection_success"'), "Learn teacher Signature API emits successful projection health telemetry");
check(learnTeacherSignatureRoute.includes('kind: "projection_failure"'), "Learn teacher Signature API emits failed projection health telemetry");
check(learnTeacherSignatureRoute.includes('consumer: "learn"'), "teacher-workspace telemetry uses canonical Learn consumer identity");
check(!exists("apps/teach-web/app/api/teach/signature/route.ts"), "Teach has no delegated student Signature endpoint");
check(!exists("packages/backend/src/teach-signature-experience.server.ts"), "Teach has no student projection backend capability");

check(catalog.includes('status: "active"'), "Knowledge Object catalog contains active governed objects");
check(catalog.includes("version:"), "Knowledge Objects carry explicit semantic versions");
check(catalog.includes('"DO-ENG-PRO-002"'), "Dominican /s/-cluster pattern has a canonical Knowledge Object mapping");
check(catalog.includes('"DO-ENG-PRO-006"'), "regular-past pronunciation pattern has canonical Knowledge Object mappings");
check(adaptiveAdapter.includes("getGovernedKnowledgeObjectById"), "Adaptive Path validates Knowledge Object IDs against the governed combined catalog");
check(adaptiveAdapter.includes("Competency identifiers are not treated as Knowledge Object identifiers"), "competency and Knowledge Object namespaces remain distinct");
check(signatureRoute.includes("getGovernedAdaptiveLearningPathProjection"), "Learn API routes Adaptive Path through the semantic governance adapter");
check(signatureRoute.includes("getScopedMemoryThreadProjection"), "Learn API routes Memory Thread through the tenant-safe projection");
check(memoryThread.includes("entry.organizationId === activeOrganizationId"), "Memory Thread scopes institutional evidence to the active organization");
check(memoryThread.includes("entry.source.knowledgeObjectIds?.includes"), "Memory Thread performs exact Knowledge Object filtering");

check(telemetryService.includes("Telemetry failure must never block a learning workflow"), "signature telemetry is explicitly best-effort");
check(!telemetryService.includes("actorId"), "signature telemetry schema excludes actor identity");
check(!telemetryService.includes("learnerId"), "signature telemetry schema excludes learner identity");
check(!telemetryService.includes("organizationId"), "signature telemetry schema excludes tenant identity");
check(!telemetryService.includes("evidenceId"), "signature telemetry schema excludes evidence identifiers");
check(!telemetryService.includes("destinationRef"), "signature telemetry schema excludes destination/context references");
check(bridgeService.includes('kind: "bridge_created"'), "Product Bridge creation emits operational telemetry");
check(bridgeService.includes('kind: "bridge_resolved"'), "Product Bridge resolution emits operational telemetry");
check(signatureRoute.includes('kind: "projection_success"'), "successful signature projections emit health telemetry");
check(signatureRoute.includes('kind: "projection_failure"'), "failed signature projections emit coarse health telemetry");
check(signatureRoute.includes("durationMs: Date.now() - startedAt"), "signature projection telemetry includes latency");
check(signatureRoute.includes('"Cache-Control": "private, no-store, max-age=0"'), "Learn signature projections explicitly disable shared/intermediary caching");
check(learnTeacherSignatureRoute.includes('"Cache-Control": "private, no-store, max-age=0"'), "Learn teacher instructional-support projections explicitly disable shared/intermediary caching");

check(signaturePanel.includes('NEXT_PUBLIC_SIGNATURE_EXPERIENCE_V1 === "on"'), "Signature Experience learner rollout is feature-flagged and default-off");
check(signaturePanel.includes('aria-live="polite"'), "Signature Experience asynchronous status uses a polite live region");
check(signaturePanel.includes("motion-reduce:animate-none"), "Signature Experience loading motion respects reduced-motion preferences");
check(adaptiveUi.startsWith('"use client"'), "interactive Adaptive Path is declared as a Client Component");
check(uiFiles.every((content) => content.includes("aria-")), "all six shared signature primitives expose accessibility semantics");
check(uiFiles.filter((content) => content.includes("<button")).every((content) => content.includes("focus-visible")), "interactive shared signature primitives expose visible keyboard focus");
check(!coachPractice.includes("scroll-smooth"), "Coach practice does not force CSS smooth scrolling for reduced-motion users");
check(coachPractice.includes('role="alert"'), "Coach practice exposes errors through an assistive-technology alert region");

console.log("Lurexa Signature Experience contract/security/accessibility/continuity/telemetry/privacy/Learn-teacher boundary verification passed.");

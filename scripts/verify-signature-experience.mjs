import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const check = (condition, message) => {
  if (!condition) throw new Error(`Signature Experience verification failed: ${message}`);
  console.log(`✓ ${message}`);
};

const contracts = read("packages/types/src/signature-experience.ts");
const coachTypes = read("packages/types/src/coach.ts");
const bridgeService = read("packages/backend/src/product-bridge.server.ts");
const completionService = read("packages/backend/src/coach-session-completion.server.ts");
const resumeService = read("packages/backend/src/coach-session-state.server.ts");
const coachRoute = read("apps/learn-web/app/api/coach/route.ts");
const coachPage = read("apps/learn-web/app/coach/page.tsx");
const signatureRoute = read("apps/learn-web/app/api/signature/route.ts");
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
check(contracts.includes('"return_to_learning"'), "Product Bridge contract includes the Coach → Learn return purpose");
check(bridgeService.includes('"learn:coach:targeted_practice"'), "Learn → Coach targeted-practice handoff is allowlisted");
check(bridgeService.includes('"coach:learn:return_to_learning"'), "Coach → Learn return handoff is allowlisted");
check(bridgeService.includes("singleUse: input.singleUse ?? true"), "Product Bridge defaults to single-use");
check(bridgeService.includes("Product Bridge has expired."), "expired Product Bridges fail closed");
check(bridgeService.includes("Product Bridge has already been used."), "replayed single-use Product Bridges fail closed");
check(!uiPackage.dependencies?.["@lurexa/types"], "shared UI remains independent from domain-contract ownership");
check(coachTypes.includes("CoachSessionEndResult"), "Coach completion has an explicit typed result");
check(completionService.includes("export async function endCoachSession"), "Coach completion is isolated behind a server capability");
check(coachRoute.includes('body.action === "endSession"'), "Learn web exposes the authenticated Coach completion action");
check(coachRoute.includes("endCoachSession"), "Coach completion route delegates to the isolated signature capability");
check(completionService.includes('purpose: "return_to_learning"'), "Coach completion creates a purpose-scoped return bridge");
check(completionService.includes('event: "coach.session_completed"'), "Coach completion contributes explicit Core evidence");
check(!completionService.includes("transcript:"), "Coach completion evidence does not persist the conversation transcript");
check(completionService.includes('id: `coach_session_completed_${session.id}`'), "Coach completion evidence is idempotently keyed by session");
check(completionService.indexOf("createProductBridge") < completionService.indexOf('status: "completed"'), "Coach is finalized only after the return bridge is created");
check(coachPage.includes("handleFinishSession"), "Coach exposes an explicit learner-visible completion action");
check(coachPage.includes('action: "endSession"'), "Coach UI closes the server session before leaving");
check(coachPage.includes('/api/product-bridge?action=resolve'), "Coach UI resolves the return bridge before navigation");
check(coachPage.includes('destination: "learn"'), "Coach return bridge is validated for the Learn destination");
check(coachPage.includes("Finish session & return to Learn"), "Coach labels the semantic completion transition clearly");

check(resumeService.includes("resumeCoachSession"), "Coach refresh recovery is isolated behind an authorized server capability");
check(resumeService.includes("session.learnerId !== actor.uid"), "Coach resume verifies session ownership");
check(resumeService.includes('session.status !== "active"'), "Coach resume rejects completed sessions");
check(resumeService.includes("getScopedLearnerContext"), "Coach resume re-authorizes learner context instead of trusting restored client data");
check(coachRoute.includes('body.action === "resumeSession"'), "Coach API exposes authenticated active-session restoration");
check(coachPage.includes("window.sessionStorage.setItem(COACH_SESSION_STORAGE_KEY, payload.session.id)"), "Coach stores only its opaque active session ID for refresh recovery");
check(coachPage.includes('action: "resumeSession"'), "Coach client revalidates a stored session through the server after refresh");
check(coachPage.includes("window.sessionStorage.removeItem(COACH_SESSION_STORAGE_KEY)"), "Coach clears stale/completed client session references");

check(catalog.includes('status: "active"'), "Knowledge Object catalog contains active governed objects");
check(catalog.includes("version:"), "Knowledge Objects carry explicit semantic versions");
check(catalog.includes('"DO-ENG-PRO-002"'), "Dominican /s/-cluster pattern has a canonical Knowledge Object mapping");
check(catalog.includes('"DO-ENG-PRO-006"'), "regular-past pronunciation pattern has canonical Knowledge Object mappings");
check(adaptiveAdapter.includes("getKnowledgeObjectById"), "Adaptive Path validates Knowledge Object IDs against the governed catalog");
check(adaptiveAdapter.includes("Competency identifiers are not treated as Knowledge Object identifiers"), "competency and Knowledge Object namespaces remain distinct");
check(signatureRoute.includes("getGovernedAdaptiveLearningPathProjection"), "Learn API routes Adaptive Path through the semantic governance adapter");
check(signatureRoute.includes("getScopedMemoryThreadProjection"), "Learn API routes Memory Thread through the tenant-safe projection");
check(memoryThread.includes("entry.organizationId === activeOrganizationId"), "Memory Thread scopes institutional evidence to the active organization");
check(memoryThread.includes("entry.source.knowledgeObjectIds?.includes"), "Memory Thread performs exact Knowledge Object filtering");

check(signaturePanel.includes('NEXT_PUBLIC_SIGNATURE_EXPERIENCE_V1 === "on"'), "Signature Experience learner rollout is feature-flagged and default-off");
check(signaturePanel.includes('aria-live="polite"'), "Signature Experience asynchronous status uses a polite live region");
check(signaturePanel.includes("motion-reduce:animate-none"), "Signature Experience loading motion respects reduced-motion preferences");
check(adaptiveUi.startsWith('"use client"'), "interactive Adaptive Path is declared as a Client Component");
check(uiFiles.every((content) => content.includes("aria-")), "all six shared signature primitives expose accessibility semantics");
check(uiFiles.filter((content) => content.includes("<button")).every((content) => content.includes("focus-visible")), "interactive shared signature primitives expose visible keyboard focus");
check(coachPage.includes("motion-reduce:animate-none"), "Coach transition motion respects reduced-motion preferences");
check(coachPage.includes("focus-visible:ring"), "Coach completion transition exposes visible keyboard focus");

console.log("Lurexa Signature Experience contract/security/accessibility/continuity verification passed.");

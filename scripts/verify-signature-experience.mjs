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
const coachService = read("packages/backend/src/coach-platform.server.ts");
const coachRoute = read("apps/learn-web/app/api/coach/route.ts");
const uiPackage = JSON.parse(read("packages/ui/package.json"));
const catalog = read("packages/backend/src/knowledge-object-catalog.server.ts");

check(contracts.includes('export const SIGNATURE_EXPERIENCE_CONTRACT_VERSION = "1"'), "signature contracts remain explicitly versioned at v1");
check(contracts.includes('"return_to_learning"'), "Product Bridge contract includes the Coach → Learn return purpose");
check(bridgeService.includes('"learn:coach:targeted_practice"'), "Learn → Coach targeted-practice handoff is allowlisted");
check(bridgeService.includes('"coach:learn:return_to_learning"'), "Coach → Learn return handoff is allowlisted");
check(bridgeService.includes("singleUse: input.singleUse ?? true"), "Product Bridge defaults to single-use");
check(bridgeService.includes("Product Bridge has expired."), "expired Product Bridges fail closed");
check(bridgeService.includes("Product Bridge has already been used."), "replayed single-use Product Bridges fail closed");
check(!uiPackage.dependencies?.["@lurexa/types"], "shared UI remains independent from domain-contract ownership");
check(coachTypes.includes("CoachSessionEndResult"), "Coach completion has an explicit typed result");
check(coachService.includes("async endSession"), "Coach exposes a real server-side session completion boundary");
check(coachRoute.includes('body.action === "endSession"'), "Learn web exposes the authenticated Coach completion action");
check(coachService.includes('purpose: "return_to_learning"'), "Coach completion creates a purpose-scoped return bridge");
check(coachService.includes('event: "coach.session_completed"'), "Coach completion contributes explicit Core evidence");

const persistedPayloadStart = coachService.indexOf("const payload: LinguisticEvidencePayload");
const persistedPayloadEnd = coachService.indexOf("await evidenceRepository.append", persistedPayloadStart);
const persistedPayload = coachService.slice(persistedPayloadStart, persistedPayloadEnd);
check(persistedPayloadStart >= 0 && persistedPayloadEnd > persistedPayloadStart, "Coach linguistic evidence payload is statically inspectable");
check(!persistedPayload.includes("learnerForm:"), "durable Coach linguistic evidence omits raw learner utterance text");

check(catalog.includes('status: "active"'), "Knowledge Object catalog contains active governed objects");
check(catalog.includes("version:"), "Knowledge Objects carry explicit semantic versions");

console.log("Lurexa Signature Experience contract/security verification passed.");

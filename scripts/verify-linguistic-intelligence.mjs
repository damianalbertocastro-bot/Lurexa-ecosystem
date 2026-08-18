import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const dataDir = resolve(root, "Docs/Curriculum/Linguistic-Intelligence/data");
const examplesDir = resolve(root, "Docs/Curriculum/Linguistic-Intelligence/examples");

const corpus = JSON.parse(
  await readFile(resolve(dataDir, "dominican-error-corpus.v0.1.json"), "utf8"),
);
const fixtures = JSON.parse(
  await readFile(resolve(examplesDir, "coach-intervention-cases.json"), "utf8"),
);

const allowedDomains = new Set(["E01", "E02", "E03", "E04", "E05", "E06", "E07", "E08", "E09"]);
const allowedImpact = new Set(["CI0", "CI1", "CI2", "CI3"]);
const allowedPriorities = new Set(["P0_MONITOR_ONLY", "P1_LOW", "P2_MEDIUM", "P3_HIGH", "P4_IMMEDIATE"]);
const allowedEvidence = new Set([
  "EV0_HYPOTHESIZED",
  "EV1_TEACHER_OBSERVED",
  "EV2_RECURRENTLY_TEACHER_OBSERVED",
  "EV3_MULTI_LEARNER_CONFIRMED",
  "EV4_LUREXA_CORPUS_SUPPORTED",
  "EV5_STRONG_EMPIRICAL_SUPPORT",
]);
const allowedTransferStatus = new Set([
  "NOT_EVALUATED",
  "PLAUSIBLE",
  "TEACHER_SUSPECTED",
  "SUPPORTED_BY_RECURRENT_EVIDENCE",
  "RESEARCH_SUPPORTED_POPULATION_PATTERN",
  "INDIVIDUAL_TRANSFER_UNCONFIRMED",
]);
const allowedPopulationClass = new Set([
  "DOMINICAN_SPECIFIC_CANDIDATE",
  "DOMINICAN_SALIENCE_HIGH",
  "GENERAL_SPANISH_TRANSFER",
  "GENERAL_ESL_PATTERN",
  "GENERAL_LEARNING_PATTERN",
  "UNRESOLVED",
]);
const allowedActions = new Set([
  "observe_only",
  "recast",
  "clarification_request",
  "elicit_self_correction",
  "explicit_correction",
  "brief_explanation",
  "model_and_repeat",
  "retry_segment",
  "delayed_feedback",
  "targeted_micropractice",
  "schedule_review",
]);
const allowedTimings = new Set([
  "immediate",
  "after_turn",
  "after_segment",
  "after_task",
  "future_review",
  "none",
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(Array.isArray(corpus) && corpus.length > 0, "Corpus must be a non-empty array.");
const patternIds = new Set();
for (const [index, entry] of corpus.entries()) {
  const at = `corpus[${index}]`;
  assert(typeof entry.patternId === "string", `${at}.patternId is required.`);
  assert(/^DO-ENG-(PRO|GRA|LEX|NAT|PRA|FLU|LIS|DIS|ORT)-\d{3}$/.test(entry.patternId), `${at}.patternId is invalid: ${entry.patternId}`);
  assert(!patternIds.has(entry.patternId), `Duplicate corpus patternId: ${entry.patternId}`);
  patternIds.add(entry.patternId);
  assert(typeof entry.learnerFormOrBehavior === "string" && entry.learnerFormOrBehavior.length > 0, `${entry.patternId}: learnerFormOrBehavior is required.`);
  assert(allowedDomains.has(entry.primaryDomain), `${entry.patternId}: invalid primaryDomain ${entry.primaryDomain}`);
  assert(typeof entry.subdomain === "string" && entry.subdomain.length > 0, `${entry.patternId}: subdomain is required.`);
  assert(Array.isArray(entry.observationTypes) && entry.observationTypes.length > 0, `${entry.patternId}: observationTypes must be non-empty.`);
  assert(allowedImpact.has(entry.communicativeImpact), `${entry.patternId}: invalid communicativeImpact.`);
  assert(allowedPriorities.has(entry.correctionPriority), `${entry.patternId}: invalid correctionPriority.`);
  assert(allowedEvidence.has(entry.evidenceStrength), `${entry.patternId}: invalid evidenceStrength.`);
  assert(allowedTransferStatus.has(entry.transferStatus), `${entry.patternId}: invalid transferStatus.`);
  if (entry.populationClass !== undefined) {
    assert(allowedPopulationClass.has(entry.populationClass), `${entry.patternId}: invalid populationClass ${entry.populationClass}`);
  }
  assert(Array.isArray(entry.sourceProvenance) && entry.sourceProvenance.length > 0, `${entry.patternId}: sourceProvenance must be non-empty.`);
}

assert(Array.isArray(fixtures) && fixtures.length > 0, "Intervention fixtures must be a non-empty array.");
const fixtureIds = new Set();
for (const [index, fixture] of fixtures.entries()) {
  const at = `fixtures[${index}]`;
  assert(typeof fixture.id === "string" && fixture.id.length > 0, `${at}.id is required.`);
  assert(!fixtureIds.has(fixture.id), `Duplicate fixture id: ${fixture.id}`);
  fixtureIds.add(fixture.id);
  assert(fixture.context && typeof fixture.context === "object", `${fixture.id}: context is required.`);
  assert(fixture.observation && typeof fixture.observation === "object", `${fixture.id}: observation is required.`);
  assert(fixture.expected && typeof fixture.expected === "object", `${fixture.id}: expected is required.`);
  assert(allowedImpact.has(fixture.observation.communicativeImpact), `${fixture.id}: invalid observation impact.`);
  assert(allowedActions.has(fixture.expected.action), `${fixture.id}: invalid expected action ${fixture.expected.action}`);
  assert(allowedTimings.has(fixture.expected.timing), `${fixture.id}: invalid expected timing ${fixture.expected.timing}`);
  if (fixture.observation.patternId !== undefined) {
    assert(patternIds.has(fixture.observation.patternId), `${fixture.id}: unknown patternId ${fixture.observation.patternId}`);
  }
}

console.log(`Linguistic Intelligence verification passed: ${corpus.length} corpus patterns, ${fixtures.length} intervention fixtures.`);

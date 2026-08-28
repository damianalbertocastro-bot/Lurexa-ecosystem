import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => failures.push(message);
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const service = read("packages/backend/src/learn-curriculum-audio.server.ts");
const route = read("apps/learn-web/app/api/learning/audio/route.ts");

if (!service.includes('process.env.NODE_ENV !== "production"')) {
  fail("Synthetic curriculum audio must be restricted to non-production runtimes.");
}
if (!service.includes("CurriculumAudioProviderError")) {
  fail("Curriculum audio provider failures must use a typed error boundary.");
}
for (const code of [
  "AUDIO_PROVIDER_UNCONFIGURED",
  "AUDIO_PROVIDER_FAILED",
  "AUDIO_PROVIDER_EMPTY_RESPONSE",
]) {
  if (!service.includes(code)) fail(`Missing governed curriculum audio error code: ${code}`);
}
if (!service.includes("TelemetryService.beginOperation")) {
  fail("Curriculum audio synthesis must emit structured operational telemetry.");
}
if (!service.includes('provider: "google-cloud-text-to-speech"')) {
  fail("Curriculum audio telemetry must identify the speech provider.");
}
if (!route.includes("error instanceof CurriculumAudioProviderError")) {
  fail("Learn audio API must map typed provider failures instead of parsing error-message text.");
}
if (!route.includes('error.code === "AUDIO_PROVIDER_UNCONFIGURED"') || !route.includes("? 503") || !route.includes(": 502")) {
  fail("Learn audio API must distinguish provider configuration failure from provider runtime failure.");
}

if (failures.length) {
  console.error("\nSpeech runtime verification failed:");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

pass("synthetic audio is non-production only");
pass("speech provider failures are typed and observable");
pass("Learn audio API exposes truthful provider failure semantics");
console.log("\nLurexa speech runtime verification passed.");

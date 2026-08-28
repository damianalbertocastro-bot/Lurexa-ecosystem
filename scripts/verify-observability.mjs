import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => failures.push(message);
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const telemetry = read("packages/backend/src/telemetry.service.ts");
const coachApi = read("apps/coach-web/app/api/coach/route.ts");

for (const required of [
  "OperationalTelemetryContext",
  "OperationalTelemetryEvent",
  "beginOperation",
  "durationMs",
  "requestId",
  "eventId",
  "sanitizeTelemetryValue",
  "[redacted]",
]) {
  if (!telemetry.includes(required)) fail(`Telemetry contract is missing ${required}`);
}
if (!failures.length) pass("structured telemetry contract and recursive redaction are present");

for (const sensitivePattern of ["authorization", "cookie", "password", "token", "secret", "api[-_]?key", "email"]) {
  if (!telemetry.includes(sensitivePattern)) fail(`Telemetry redaction pattern is missing ${sensitivePattern}`);
}
if (!failures.some((item) => item.includes("redaction pattern"))) pass("common secret and identity metadata keys are covered by redaction policy");

if (!coachApi.includes('TelemetryService.beginOperation')) fail("Coach API must start an operational telemetry span");
if (!coachApi.includes('"X-Request-Id": operation.requestId')) fail("Coach API must return X-Request-Id for correlation");
if (!coachApi.includes('operation.complete(')) fail("Coach API must record successful operation completion");
if (!coachApi.includes('operation.fail(')) fail("Coach API must record failed or denied operations");
if (!coachApi.includes('result: status === 401 || status === 403 ? "denied" : "failure"')) fail("Coach API must distinguish authorization denial from ordinary failure");
if (!failures.some((item) => item.startsWith("Coach API"))) pass("Coach critical API path is instrumented with correlated success/failure telemetry");

if (failures.length) {
  console.error("\nObservability verification failed:");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log("\nLurexa observability verification passed.");

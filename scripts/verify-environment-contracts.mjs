import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const checks = [];

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const pass = (message) => checks.push(message);
const fail = (message) => failures.push(message);

const forbiddenPublicAliases = [
  "NEXT_PUBLIC_ROOT_URL",
  "NEXT_PUBLIC_LEARN_URL",
  "NEXT_PUBLIC_TEACH_URL",
  "NEXT_PUBLIC_ADMIN_URL",
  "NEXT_PUBLIC_DOCS_URL",
  "NEXT_PUBLIC_ECOSYSTEM_URL",
];

const forbiddenCredentialAliases = [
  "FIREBASE_SERVICE_ACCOUNT_JSON_1",
  "FIREBASE_SERVICE_ACCOUNT_JSON_2",
  "FIREBASE_SERVICE_ACCOUNT_JSON_3",
  "GEMINI_API_KEY_1",
  "GOOGLE_API_KEY",
  "GOOGLE_GEMINI_API_KEY",
  "Google API Key",
  "GOOGLE API KEY",
  "Google_API_Key",
];

const environmentContract = read("packages/config/src/environment.ts");
const domains = read("packages/config/src/domains.ts");
const productUrls = read("packages/config/src/product-urls.ts");
const configIndex = read("packages/config/src/index.ts");
const turbo = read("turbo.json");
const example = read("packages/.env.example");

for (const required of [
  "NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL",
  "NEXT_PUBLIC_LUREXA_LEARN_URL",
  "NEXT_PUBLIC_LUREXA_COACH_URL",
  "NEXT_PUBLIC_LUREXA_TEACH_URL",
  "NEXT_PUBLIC_LUREXA_ADMIN_URL",
  "NEXT_PUBLIC_LUREXA_DOCS_URL",
  "FIREBASE_SERVICE_ACCOUNT_JSON",
  "GEMINI_API_KEY",
]) {
  if (!environmentContract.includes(required)) fail(`canonical environment contract is missing ${required}`);
}
if (!failures.length) pass("canonical public/server environment names are declared");

if (!configIndex.includes('export * from "./environment"')) fail("@lurexa/config does not export the canonical environment contract");
if (!domains.includes("lurexaPublicUrlEnv") || !productUrls.includes("lurexaPublicUrlEnv")) {
  fail("product URL helpers do not consume the canonical environment contract");
} else {
  pass("product URL helpers consume one canonical URL namespace");
}

for (const alias of [...forbiddenPublicAliases, ...forbiddenCredentialAliases]) {
  if (turbo.includes(alias)) fail(`turbo.json still allows legacy/duplicate environment alias ${alias}`);
  if (domains.includes(alias)) fail(`domains.ts still accepts legacy URL alias ${alias}`);
  if (example.includes(alias)) fail(`packages/.env.example still documents legacy/duplicate alias ${alias}`);
}
if (!failures.some((item) => item.includes("alias"))) pass("legacy URL and credential aliases are excluded from canonical config");

if (exists("API.env")) fail("stale tracked API.env must remain removed");
else pass("stale tracked API.env is absent");

for (const legacy of ["API_URL", "APP_URL"]) {
  if (configIndex.includes(legacy)) fail(`@lurexa/config still exposes dead generic ${legacy} configuration`);
}
if (!failures.some((item) => item.includes("dead generic"))) pass("dead generic API_URL/APP_URL config is removed");

for (const commerceVar of ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"]) {
  if (example.includes(commerceVar)) fail(`prototype-contained commerce variable ${commerceVar} is still advertised in shared env example`);
}
if (!failures.some((item) => item.includes("commerce variable"))) pass("shared env example does not advertise inactive commerce credentials");

const publicSection = environmentContract.match(/export const lurexaPublicFirebaseEnv = \{([\s\S]*?)\n\} as const;/)?.[1] ?? "";
for (const line of publicSection.split("\n")) {
  const match = line.match(/:\s*"([^"]+)"/);
  if (match && !match[1].startsWith("NEXT_PUBLIC_")) fail(`public Firebase contract contains non-public variable ${match[1]}`);
}
const serverSection = environmentContract.match(/export const lurexaServerEnv = \{([\s\S]*?)\n\} as const;/)?.[1] ?? "";
for (const line of serverSection.split("\n")) {
  const match = line.match(/:\s*"([^"]+)"/);
  if (match && match[1].startsWith("NEXT_PUBLIC_")) fail(`server environment contract exposes ${match[1]} as public`);
}
if (!failures.some((item) => item.includes("Firebase contract")) && !failures.some((item) => item.includes("server environment"))) {
  pass("public Firebase and trusted server variable classes stay separated");
}

if (failures.length) {
  console.error("Environment contract verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Environment contract verification passed (${checks.length} checks).`);
for (const check of checks) console.log(`- ${check}`);

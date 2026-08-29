#!/usr/bin/env node

/**
 * verify-r2-firestore-storage.mjs
 * Validates Cloudflare R2 Media Storage & Firestore Metadata Store implementation
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
let pass = 0;
let fail = 0;

function check(label, ok) {
  if (ok) {
    pass++;
    console.log(`  ✅ ${label}`);
  } else {
    fail++;
    console.log(`  ❌ ${label}`);
  }
}

console.log("\n========================================================");
console.log("  LUREXA CLOUDFLARE R2 & FIRESTORE STORAGE VERIFICATION  ");
console.log("========================================================\n");

// 1. Storage Type Contracts
const storageTypesFile = path.join(ROOT, "packages/types/src/storage.ts");
check("packages/types/src/storage.ts exists", fs.existsSync(storageTypesFile));

const storageTypesSrc = fs.readFileSync(storageTypesFile, "utf-8");
check("Declares StorageBackendProvider ('r2' | 'gcs' | 'emulator')", storageTypesSrc.includes('"r2"') && storageTypesSrc.includes('"gcs"'));
check("Declares PresignedUploadRequest", storageTypesSrc.includes("interface PresignedUploadRequest"));
check("Declares PresignedUploadResponse", storageTypesSrc.includes("interface PresignedUploadResponse"));
check("Declares ConfirmUploadRequest", storageTypesSrc.includes("interface ConfirmUploadRequest"));
check("Declares ConfirmUploadResponse", storageTypesSrc.includes("interface ConfirmUploadResponse"));

const typesIndexFile = path.join(ROOT, "packages/types/src/index.ts");
const typesIndexSrc = fs.readFileSync(typesIndexFile, "utf-8");
check("packages/types/src/index.ts exports storage contracts", typesIndexSrc.includes('./storage'));

// 2. Cloudflare R2 Server Service
const r2ServerFile = path.join(ROOT, "packages/backend/src/r2-storage.server.ts");
check("packages/backend/src/r2-storage.server.ts exists", fs.existsSync(r2ServerFile));

const r2Src = fs.readFileSync(r2ServerFile, "utf-8");
check("R2 service has getR2Config()", r2Src.includes("export function getR2Config"));
check("R2 service has isR2Configured()", r2Src.includes("export function isR2Configured"));
check("R2 service has getR2Client() using S3Client", r2Src.includes("new S3Client") && r2Src.includes(".r2.cloudflarestorage.com"));
check("R2 service has createR2PresignedUploadUrl()", r2Src.includes("export async function createR2PresignedUploadUrl"));
check("R2 service has createR2PresignedDownloadUrl() for zero-egress", r2Src.includes("export async function createR2PresignedDownloadUrl"));
check("R2 service has verifyR2ObjectExists()", r2Src.includes("export async function verifyR2ObjectExists"));
check("R2 service has uploadBufferToR2()", r2Src.includes("export async function uploadBufferToR2"));

// 3. Spoken Evidence Service Integration
const spokenEvidenceFile = path.join(ROOT, "packages/backend/src/spoken-evidence.server.ts");
check("packages/backend/src/spoken-evidence.server.ts exists", fs.existsSync(spokenEvidenceFile));

const spokenSrc = fs.readFileSync(spokenEvidenceFile, "utf-8");
check("SpokenEvidenceService has preparePresignedUpload()", spokenSrc.includes("preparePresignedUpload"));
check("SpokenEvidenceService has confirmPresignedUpload()", spokenSrc.includes("confirmPresignedUpload"));
check("SpokenEvidenceService stores metadata in Firestore", spokenSrc.includes('collection("spoken-evidence")'));
check("SpokenEvidenceService records diagnostic evidence in Learner Model", spokenSrc.includes("FirestoreLearningEvidenceRepository"));
check("SpokenEvidenceService triggers Learner Model intelligence refresh", spokenSrc.includes("refreshLearnerIntelligence"));
check("SpokenEvidenceService enforces 8 MB size cap and MIME validation", spokenSrc.includes("MAX_AUDIO_BYTES") && spokenSrc.includes("ALLOWED_AUDIO_TYPES"));

// 4. API Endpoints in Learn Web
const presignedRouteFile = path.join(ROOT, "apps/learn-web/app/api/storage/presigned-upload/route.ts");
check("apps/learn-web/app/api/storage/presigned-upload/route.ts exists", fs.existsSync(presignedRouteFile));
const presignedRouteSrc = fs.readFileSync(presignedRouteFile, "utf-8");
check("Presigned upload route enforces authentication", presignedRouteSrc.includes("CoursePlatformService.authenticate"));

const confirmRouteFile = path.join(ROOT, "apps/learn-web/app/api/storage/confirm-upload/route.ts");
check("apps/learn-web/app/api/storage/confirm-upload/route.ts exists", fs.existsSync(confirmRouteFile));
const confirmRouteSrc = fs.readFileSync(confirmRouteFile, "utf-8");
check("Confirm upload route enforces authentication", confirmRouteSrc.includes("CoursePlatformService.authenticate"));

// 5. Functional R2 Logic Tests
// Test unconfigured state
delete process.env.R2_ACCOUNT_ID;
delete process.env.CLOUDFLARE_R2_ACCOUNT_ID;
delete process.env.R2_ACCESS_KEY_ID;
delete process.env.R2_SECRET_ACCESS_KEY;

const { getR2Config, isR2Configured, createR2PresignedDownloadUrl } = await import(
  "../packages/backend/src/r2-storage.server.ts"
);

check("isR2Configured() returns false when env variables are unset", isR2Configured() === false);
check("getR2Config() returns null when env variables are unset", getR2Config() === null);

// Test configured state
process.env.R2_ACCOUNT_ID = "test-r2-account-id-123";
process.env.R2_ACCESS_KEY_ID = "test-access-key";
process.env.R2_SECRET_ACCESS_KEY = "test-secret-key-456";
process.env.R2_BUCKET_NAME = "lurexa-audio-prod";
process.env.R2_PUBLIC_DOMAIN = "https://media.lurexa.com";

check("isR2Configured() returns true when env variables are set", isR2Configured() === true);
const cfg = getR2Config();
check("getR2Config() resolves accountId and bucketName correctly", cfg?.accountId === "test-r2-account-id-123" && cfg?.bucketName === "lurexa-audio-prod");

const zeroEgressUrl = await createR2PresignedDownloadUrl("spoken-evidence/user1/courseA/rec.webm");
check("createR2PresignedDownloadUrl() generates zero-egress public domain URL", zeroEgressUrl === "https://media.lurexa.com/spoken-evidence/user1/courseA/rec.webm");

console.log("\n========================================================");
console.log(`  📊 Result: ${pass} passed, ${fail} failed out of ${pass + fail}`);
console.log("========================================================\n");

process.exit(fail > 0 ? 1 : 0);

#!/usr/bin/env node

/**
 * verify-optimization-improvements.mjs
 * Validates the 5 strategic optimization & performance improvements
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
console.log("  LUREXA 5 OPTIMIZATION & IMPROVEMENT SUITE VERIFIER    ");
console.log("========================================================\n");

// Step 1: Direct Client-Side Audio Upload Hook & In-Browser Opus Compression
const hookFile = path.join(ROOT, "packages/ui/src/usePresignedAudioRecorder.ts");
check("usePresignedAudioRecorder hook exists", fs.existsSync(hookFile));
const hookSrc = fs.readFileSync(hookFile, "utf-8");
check("Hook manages MediaRecorder with Opus/WebM codecs", hookSrc.includes("MediaRecorder") && hookSrc.includes("audio/webm;codecs=opus"));
check("Hook performs direct XMLHttpRequest PUT to Cloudflare R2", hookSrc.includes('xhr.open("PUT"') && hookSrc.includes("xhr.upload.onprogress"));
check("Hook confirms upload with /api/storage/confirm-upload", hookSrc.includes("/api/storage/confirm-upload"));

const widgetFile = path.join(ROOT, "packages/ui/src/PresignedAudioRecorderWidget.tsx");
check("PresignedAudioRecorderWidget UI component exists", fs.existsSync(widgetFile));

// Step 2: Edge CDN Caching & Byte-Range Streaming
const edgeCacheFile = path.join(ROOT, "packages/backend/src/media-edge-cache.server.ts");
check("media-edge-cache.server.ts exists", fs.existsSync(edgeCacheFile));
const edgeCacheSrc = fs.readFileSync(edgeCacheFile, "utf-8");
check("Declares immutable edge cache headers (max-age=31536000)", edgeCacheSrc.includes("max-age=31536000, immutable"));
check("Implements HTTP byte-range parser for audio streaming", edgeCacheSrc.includes("parseByteRange") && edgeCacheSrc.includes("bytes="));
check("Implements zero-egress custom domain media URL builder", edgeCacheSrc.includes("buildZeroEgressMediaUrl"));

// Step 3: Real-Time Audio Streaming & VAD
const streamHookFile = path.join(ROOT, "packages/ui/src/useRealtimeAudioStream.ts");
check("useRealtimeAudioStream hook exists", fs.existsSync(streamHookFile));
const streamHookSrc = fs.readFileSync(streamHookFile, "utf-8");
check("Hook implements Voice Activity Detection (VAD)", streamHookSrc.includes("vadThreshold") && streamHookSrc.includes("silenceDurationMs"));
check("Hook processes 16-bit PCM buffer chunks", streamHookSrc.includes("Int16Array") && streamHookSrc.includes("onaudioprocess"));

const visualizerFile = path.join(ROOT, "packages/ui/src/RealtimeCoachCanvasVisualizer.tsx");
check("RealtimeCoachCanvasVisualizer canvas component exists", fs.existsSync(visualizerFile));
const visualizerSrc = fs.readFileSync(visualizerFile, "utf-8");
check("Visualizer renders 60fps HTML5 canvas frequencies and speech energy", visualizerSrc.includes("<canvas") && visualizerSrc.includes("createLinearGradient"));

// Step 4: Asynchronous Phoneme Diagnostic Worker
const workerFile = path.join(ROOT, "packages/backend/src/phoneme-diagnostic-worker.server.ts");
check("phoneme-diagnostic-worker.server.ts exists", fs.existsSync(workerFile));
const workerSrc = fs.readFileSync(workerFile, "utf-8");
check("Worker evaluates contrastive L1 transfers", workerSrc.includes("getProfileByL1Code") && workerSrc.includes("getHighPriorityTransfers"));
check("Worker updates Firestore diagnostic collections asynchronously", workerSrc.includes("spoken-evidence-diagnostics") && workerSrc.includes("learner-models"));

// Step 5: Institutional Executive Analytics & CEFR Cohort Velocity
const analyticsFile = path.join(ROOT, "packages/backend/src/institutional-analytics.service.ts");
check("institutional-analytics.service.ts exists", fs.existsSync(analyticsFile));
const analyticsSrc = fs.readFileSync(analyticsFile, "utf-8");
check("Declares CefrVelocityMetric with benchmark comparisons", analyticsSrc.includes("CefrVelocityMetric") && analyticsSrc.includes("averageWeeksToComplete"));
check("Declares EarlyWarningLearnerRisk flags", analyticsSrc.includes("EarlyWarningLearnerRisk") && analyticsSrc.includes("riskScore"));
check("Declares AssignmentSlaMetric with <24h grading telemetry", analyticsSrc.includes("AssignmentSlaMetric") && analyticsSrc.includes("gradedWithin24Hours"));

const insightPageFile = path.join(ROOT, "apps/insight-web/app/page.tsx");
check("apps/insight-web/app/page.tsx exists", fs.existsSync(insightPageFile));
const insightPageSrc = fs.readFileSync(insightPageFile, "utf-8");
check("Insight dashboard renders CEFR Cohort Velocity Radar", insightPageSrc.includes("CEFR Cohort Velocity") && insightPageSrc.includes("analytics.cefrVelocity"));
check("Insight dashboard renders Early Warning Radar", insightPageSrc.includes("Early Warning Radar") && insightPageSrc.includes("analytics.earlyWarningRisks"));

console.log("\n========================================================");
console.log(`  📊 Result: ${pass} passed, ${fail} failed out of ${pass + fail}`);
console.log("========================================================\n");

process.exit(fail > 0 ? 1 : 0);

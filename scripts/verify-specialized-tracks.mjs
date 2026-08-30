#!/usr/bin/env node

/**
 * verify-specialized-tracks.mjs
 * Validates Step 2: Specialized Industry Curriculum Tracks
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
let pass = 0;
let fail = 0;

function check(label, ok) {
  if (ok) { pass++; console.log(`  ✅ ${label}`); }
  else    { fail++; console.log(`  ❌ ${label}`); }
}

console.log("\n🔍 Specialized Industry Curriculum Tracks — Verification\n");

// 1. File exists
const tracksFile = path.join(ROOT, "packages/backend/src/curriculum/specialized-tracks.ts");
check("specialized-tracks.ts exists", fs.existsSync(tracksFile));

const src = fs.readFileSync(tracksFile, "utf-8");

// 2. Type exports
check("SpecializedIndustryTrack interface exported", src.includes("export interface SpecializedIndustryTrack"));
check("SpecializedModule interface exported", src.includes("export interface SpecializedModule"));
check("RolePlayScenario interface exported", src.includes("export interface RolePlayScenario"));

// 3. Track constants
check("SPECIALIZED_INDUSTRY_TRACKS array exported", src.includes("export const SPECIALIZED_INDUSTRY_TRACKS"));
check("BPO/Call Center track present", src.includes("bpo-call-center-english-do"));
check("Tourism/Hospitality track present", src.includes("tourism-hospitality-english-do"));
check("Software Engineering track present", src.includes("software-engineering-english"));

// 4. Helper functions
check("getTrackBySlug exported", src.includes("export function getTrackBySlug"));
check("getTracksForCefrLevel exported", src.includes("export function getTracksForCefrLevel"));

// 5. Module count per track
const moduleMatches = src.match(/order:\s*\d+/g) || [];
check(`18 total modules across 3 tracks (found ${moduleMatches.length})`, moduleMatches.length >= 18);

// 6. Role-play scenarios exist
const rpMatches = src.match(/rolePlayScenarios:\s*\[/g) || [];
check(`Role-play scenarios present in modules (found ${rpMatches.length} arrays)`, rpMatches.length >= 18);

// 7. Create & Apply tasks exist
const caMatches = src.match(/createApplyTask:/g) || [];
check(`Create & Apply tasks present (found ${caMatches.length})`, caMatches.length >= 18);

// 8. Dominican cultural context
check("Dominican cultural context present", src.includes("Dominican") || src.includes("dominican") || src.includes("RD"));

// 9. CEFR competency IDs
const cefrPattern = /EN\.[AB][12]?\.\w+\.\w+/g;
const cefrIds = src.match(cefrPattern) || [];
check(`CEFR competency IDs present (found ${cefrIds.length})`, cefrIds.length > 30);

// 10. Phonetic targets
const phonTargets = src.match(/phoneticTargets:\s*\[/g) || [];
check(`Phonetic targets arrays present (found ${phonTargets.length})`, phonTargets.length >= 18);

// 11. Backend barrel export
const indexFile = path.join(ROOT, "packages/backend/src/index.ts");
const indexSrc = fs.readFileSync(indexFile, "utf-8");
check("Backend index.ts exports specialized-tracks", indexSrc.includes("./curriculum/specialized-tracks"));

// 12. No 'any' type
check("No 'any' type usage", !src.includes(": any") && !src.includes("<any>"));

console.log(`\n📊 Result: ${pass} passed, ${fail} failed out of ${pass + fail}\n`);
process.exit(fail > 0 ? 1 : 0);

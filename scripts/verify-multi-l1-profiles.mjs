#!/usr/bin/env node

/**
 * verify-multi-l1-profiles.mjs
 * Validates Step 3: Multi-L1 Contrastive Linguistic Profiles
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

console.log("\n🔍 Multi-L1 Contrastive Linguistic Profiles — Verification\n");

// 1. File exists
const profilesFile = path.join(ROOT, "packages/backend/src/curriculum/multi-l1-profiles.ts");
check("multi-l1-profiles.ts exists", fs.existsSync(profilesFile));

const src = fs.readFileSync(profilesFile, "utf-8");

// 2. Type exports
check("L1ContrastiveProfile interface exported", src.includes("export interface L1ContrastiveProfile"));
check("PhonologicalTransfer interface exported", src.includes("export interface PhonologicalTransfer"));
check("PhonemeExample interface exported", src.includes("export interface PhonemeExample"));
check("ProsodyProfile interface exported", src.includes("export interface ProsodyProfile"));
check("LexicalInterference interface exported", src.includes("export interface LexicalInterference"));
check("RemediationStrategy interface exported", src.includes("export interface RemediationStrategy"));
check("MinimalPairDrill interface exported", src.includes("export interface MinimalPairDrill"));

// 3. All four L1 profiles
check("Dominican Spanish (es-DO) profile present", src.includes("es-DO"));
check("Puerto Rican Spanish (es-PR) profile present", src.includes("es-PR"));
check("Mexican Spanish (es-MX) profile present", src.includes("es-MX"));
check("Colombian Spanish (es-CO) profile present", src.includes("es-CO"));

// 4. Array export
check("L1_CONTRASTIVE_PROFILES array exported", src.includes("export const L1_CONTRASTIVE_PROFILES"));

// 5. Helper functions
check("getProfileByL1Code exported", src.includes("export function getProfileByL1Code"));
check("getRemediationForTransfer exported", src.includes("export function getRemediationForTransfer"));
check("getHighPriorityTransfers exported", src.includes("export function getHighPriorityTransfers"));

// 6. Phonological transfer counts (8+ per profile)
const transferBlocks = src.match(/transferType:\s*'/g) || [];
check(`32+ phonological transfers across 4 profiles (found ${transferBlocks.length})`, transferBlocks.length >= 32);

// 7. Remediation strategies
const remediations = src.match(/remediationStrategies:\s*\[/g) || [];
check(`Remediation strategy arrays for all 4 profiles (found ${remediations.length})`, remediations.length >= 4);

// 8. Minimal pair drills
const drills = src.match(/minimalPairDrills:\s*\[/g) || [];
check(`Minimal pair drill arrays present (found ${drills.length})`, drills.length >= 12);

// 9. Prosody profiles
const prosody = src.match(/prosodyProfile:\s*\{/g) || [];
check(`Prosody profiles for all 4 L1 variants (found ${prosody.length})`, prosody.length >= 4);

// 10. Lexical interferences
const lexical = src.match(/commonLexicalInterferences:\s*\[/g) || [];
check(`Lexical interference arrays for all 4 profiles (found ${lexical.length})`, lexical.length >= 4);

// 11. IPA notation present
check("IPA notation used in profiles", src.includes("/") && (src.includes("ɹ") || src.includes("ʃ") || src.includes("θ")));

// 12. Backend barrel export
const indexFile = path.join(ROOT, "packages/backend/src/index.ts");
const indexSrc = fs.readFileSync(indexFile, "utf-8");
check("Backend index.ts exports multi-l1-profiles", indexSrc.includes("./curriculum/multi-l1-profiles"));

// 13. No 'any' type
check("No 'any' type usage", !src.includes(": any") && !src.includes("<any>"));

// 14. Priority levels used
check("Priority levels used (critical/high/medium/low)", 
  src.includes("'critical'") && src.includes("'high'") && src.includes("'medium'"));

console.log(`\n📊 Result: ${pass} passed, ${fail} failed out of ${pass + fail}\n`);
process.exit(fail > 0 ? 1 : 0);

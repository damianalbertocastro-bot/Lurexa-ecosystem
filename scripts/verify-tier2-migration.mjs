#!/usr/bin/env node
// scripts/verify-tier2-migration.mjs
// Verifies Tier 2 migration is complete — zero third-party deps.
// Checks for native <button>/<input> tags and Tailwind hex-colour classes.

import fs from "node:fs";
import path from "node:path";

function walk(dir, exts, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (["node_modules", "dist", "build", ".next"].includes(entry.name)) continue;
    if (entry.isDirectory()) {
      walk(full, exts, results);
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

const appsDir = path.resolve("apps");
if (!fs.existsSync(appsDir)) {
  console.error("Run this script from the repository root.");
  process.exit(1);
}

const files = walk(appsDir, [".tsx", ".jsx", ".ts", ".js", ".css"]);
const failures = [];

// Patterns — case-sensitive: only lowercase <button and <input are violations
const nativeButtonRegex = /<button[\s>]/;
const nativeInputRegex = /<input\s(?![^>]*type\s*=\s*["'](?:checkbox|radio)["'])/;
const hexTailwindRegex = /(?:bg|text|border|ring|stroke|fill|from|to|via|shadow|outline|divide)-\[#[0-9a-fA-F]{3,8}\]/;

for (const filePath of files) {
  const content = fs.readFileSync(filePath, "utf8");
  const rel = path.relative(process.cwd(), filePath);

  if (nativeButtonRegex.test(content)) {
    failures.push(`  ❌ Native <button> in ${rel}`);
  }
  if (nativeInputRegex.test(content)) {
    failures.push(`  ❌ Native <input> in ${rel}`);
  }
  if (hexTailwindRegex.test(content)) {
    failures.push(`  ❌ Hex Tailwind class in ${rel}`);
  }
}

if (failures.length === 0) {
  console.log("✅ Tier 2 verification passed — no native tags or hex Tailwind classes remain.");
  process.exit(0);
} else {
  console.error(`❌ Tier 2 verification: ${failures.length} issues found:\n`);
  failures.forEach((f) => console.error(f));
  process.exit(1);
}

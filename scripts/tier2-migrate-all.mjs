#!/usr/bin/env node
// scripts/tier2-migrate-all.mjs
// Self-contained Tier 2 UI migration — zero third-party deps.
// Replaces native <button>/<input> with Lurexa UI components,
// replaces Tailwind hex-colour classes with design-system tokens.

import fs from "node:fs";
import path from "node:path";

// ── Hex → token map ─────────────────────────────────────────────
const hexToToken = {
  "#142f85": "--color-brand-navy-light",
  "#2355bf": "--lx-secondary",
  "#7ee9ed": "--lx-accent",
  "#6b2bd9": "--lx-primary",
  "#315fd7": "--lx-secondary",
  "#dfe6f8": "--lx-surface",
  "#6677a5": "--lx-muted",
  "#3450a8": "--lx-primary",
  "#071d67": "--color-brand-navy",
  "#8df4ef": "--lx-accent",
  "#147c78": "--lx-success",
  "#147c68": "--lx-success",
  "#d8e7f6": "--lx-border",
  "#e6faf5": "--lx-surface",
  "#f3f0ff": "--lx-surface",
  "#fbbf24": "--lx-warning",
  "#ef4444": "--lx-destructive",
  "#12cdd4": "--lx-accent",
  "#10b981": "--lx-success",
  "#f59e0b": "--lx-warning",
  "#0ea5e9": "--lx-info",
  "#6f28cd": "--color-brand-accent-violet-deep",
  "#3853a4": "--color-brand-accent-blue-deep",
  "#6734dd": "--color-brand-accent-violet-bright",
  "#1d3f98": "--lx-secondary",
  "#592bd6": "--lx-primary",
  "#e1e7f6": "--lx-border",
  "#edf2ff": "--lx-surface",
  "#7180a8": "--lx-muted",
  "#cad6f2": "--lx-border",
  "#536a91": "--lx-muted",
  "#f1f4fb": "--lx-surface",
  "#d6def4": "--lx-border",
  "#4d5e8c": "--lx-muted",
  "#f7f9ff": "--lx-surface",
  "#5a36b5": "--lx-primary",
  "#dbe4f7": "--lx-border",
  "#b6c8f4": "--lx-border",
  "#edf2f9": "--lx-border",
  "#8b98b8": "--lx-muted",
  "#1d5add": "--lx-secondary",
  "#bfeee7": "--lx-accent",
  "#eafffb": "--lx-surface",
  "#f8fbff": "--lx-surface",
  "#f5f6ff": "--lx-surface",
  "#fbfdff": "--lx-surface",
};

// ── Collect files recursively ────────────────────────────────────
function walk(dir, exts, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === "build" || entry.name === ".next") continue;
    if (entry.isDirectory()) {
      walk(full, exts, results);
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

// ── Button / Input tag replacement ───────────────────────────────
// Only replaces lowercase <button …> with <Button …> and </button> with </Button>.
// Preserves every attribute byte-for-byte.
function migrateButtonTags(content) {
  let modified = content;
  // <button ...> → <Button ...>  (opening tag, preserving attrs)
  modified = modified.replace(/<button(\s)/gi, (match, after, offset) => {
    // Check if already uppercase Button
    const before = content.substring(Math.max(0, offset - 1), offset + 7);
    if (before.includes("<Button")) return match;
    return `<Button${after}`;
  });
  // <button> with no attrs
  modified = modified.replace(/<button>/g, "<Button>");
  // </button> → </Button>
  modified = modified.replace(/<\/button>/gi, "</Button>");
  return modified;
}

function migrateInputTags(content) {
  let modified = content;
  // Skip checkbox and radio inputs — only migrate text-like inputs
  // We match <input and then check if type="checkbox" or type="radio" follows
  modified = modified.replace(/<input(\s[^>]*?)(\s*\/?>)/gi, (match, attrs, closing) => {
    // If already capitalized, skip
    if (match.startsWith("<Input")) return match;
    // If it's checkbox or radio, skip
    if (/type\s*=\s*["'](?:checkbox|radio)["']/i.test(attrs)) return match;
    return `<Input${attrs}${closing}`;
  });
  return modified;
}

// ── Import management ────────────────────────────────────────────
function ensureButtonImport(content) {
  if (content.includes("@lurexa/ui/button") || content.includes('@lurexa/ui/Button')) return content;
  // Find last import statement
  const importLines = [];
  const lines = content.split("\n");
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s/.test(lines[i])) {
      lastImportIndex = i;
      // Handle multiline imports — find the closing
      while (i < lines.length && !lines[i].includes(";") && !lines[i].includes("from")) {
        i++;
        lastImportIndex = i;
      }
    }
  }
  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, 'import { Button } from "@lurexa/ui/button";');
  } else {
    lines.unshift('import { Button } from "@lurexa/ui/button";');
  }
  return lines.join("\n");
}

function ensureInputImport(content) {
  if (content.includes("@lurexa/ui/Input") || content.includes("@lurexa/ui/input")) return content;
  const lines = content.split("\n");
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s/.test(lines[i])) {
      lastImportIndex = i;
      while (i < lines.length && !lines[i].includes(";") && !lines[i].includes("from")) {
        i++;
        lastImportIndex = i;
      }
    }
  }
  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, 'import { Input } from "@lurexa/ui/Input";');
  } else {
    lines.unshift('import { Input } from "@lurexa/ui/Input";');
  }
  return lines.join("\n");
}

// ── Hex replacement ──────────────────────────────────────────────
function replaceHexTokens(content) {
  // Tailwind arbitrary values: bg-[#6b2bd9], text-[#315fd7], border-[#xxx], etc.
  let result = content.replace(
    /((?:bg|text|border|ring|stroke|fill|from|to|via|shadow|outline|divide|accent|caret|decoration|placeholder)-)\[#([0-9a-fA-F]{3,8})\]/g,
    (match, prefix, hex) => {
      const token = hexToToken[`#${hex}`.toLowerCase()];
      if (!token) return match;
      return `${prefix}[var(${token})]`;
    },
  );
  return result;
}

// ── Main ─────────────────────────────────────────────────────────
const appsDir = path.resolve("apps");
if (!fs.existsSync(appsDir)) {
  console.error("Run this script from the repository root (where apps/ lives).");
  process.exit(1);
}

const files = walk(appsDir, [".tsx", ".jsx"]);
let totalModified = 0;
const summary = { buttons: 0, inputs: 0, hex: 0 };

for (const filePath of files) {
  const original = fs.readFileSync(filePath, "utf8");
  let content = original;

  // 1. Button migration
  const hasNativeButton = /<button[\s>]/i.test(content) && !/<Button[\s>]/.test(content.replace(/<button/gi, ""));
  const hadButton = /<button[\s>]/i.test(content);
  content = migrateButtonTags(content);
  if (hadButton && content !== original) {
    content = ensureButtonImport(content);
    summary.buttons++;
  }

  // 2. Input migration (skip checkbox/radio)
  const hadInput = /<input\s/i.test(content);
  const beforeInput = content;
  content = migrateInputTags(content);
  if (content !== beforeInput) {
    content = ensureInputImport(content);
    summary.inputs++;
  }

  // 3. Hex token replacement
  const beforeHex = content;
  content = replaceHexTokens(content);
  if (content !== beforeHex) {
    summary.hex++;
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    const rel = path.relative(process.cwd(), filePath);
    console.log(`  ✓ ${rel}`);
    totalModified++;
  }
}

console.log(`\n──────────────────────────────────────`);
console.log(`Tier 2 migration complete.`);
console.log(`  Files modified: ${totalModified}`);
console.log(`  Button migrations: ${summary.buttons}`);
console.log(`  Input migrations:  ${summary.inputs}`);
console.log(`  Hex replacements:  ${summary.hex}`);
console.log(`──────────────────────────────────────`);

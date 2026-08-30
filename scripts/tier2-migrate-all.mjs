#!/usr/bin/env node
// scripts/tier2-migrate-all.mjs
// Self-contained Tier 2 UI migration — zero third-party deps.
// Replaces native <button>/<input> with Lurexa UI components,
// replaces Tailwind hex-colour classes with design-system tokens.

import fs from "node:fs";
import path from "node:path";

// ── Comprehensive Hex → token map ──────────────────────────────
const hexToToken = {
  // Navy / Deep Inks
  "#071d67": "--color-brand-navy",
  "#0a1c55": "--color-brand-navy",
  "#0b1f5f": "--color-brand-navy",
  "#10245f": "--color-brand-navy",
  "#122868": "--color-brand-navy",
  "#132a72": "--color-brand-navy",
  "#132c84": "--color-brand-navy",
  "#142e88": "--color-brand-navy",
  "#142f85": "--color-brand-navy-light",
  "#162f85": "--color-brand-navy-light",
  "#172f88": "--color-brand-navy-light",
  "#17398f": "--color-brand-navy-light",
  "#180e3d": "--color-brand-navy",
  "#18306f": "--color-brand-navy",
  "#18368d": "--color-brand-navy",
  "#19388f": "--color-brand-navy-light",
  "#1d1b64": "--color-brand-navy",
  "#1f1966": "--color-brand-navy",
  "#1f3d8f": "--color-brand-navy-light",
  "#1f3d98": "--color-brand-navy-light",
  "#20356f": "--color-brand-navy",
  "#203b95": "--color-brand-navy",
  "#22105c": "--color-brand-navy",
  "#24175b": "--color-brand-navy",
  "#24358e": "--color-brand-navy",
  "#26358c": "--color-brand-navy",
  "#30218e": "--color-brand-navy",
  "#30457f": "--lx-muted",
  "#314b88": "--lx-muted",
  "#334b87": "--lx-muted",
  "#341680": "--color-brand-navy",

  // Purples / Violets (Primary)
  "#43149c": "--lx-primary",
  "#4525a7": "--lx-primary",
  "#4825a8": "--lx-primary",
  "#4a22b8": "--lx-primary",
  "#4b28ae": "--lx-primary",
  "#4b2aaf": "--lx-primary",
  "#4d22a8": "--lx-primary",
  "#5821b8": "--lx-primary",
  "#592bd6": "--lx-primary",
  "#5a36b5": "--lx-primary",
  "#5c2ac7": "--lx-primary",
  "#6540bb": "--lx-primary",
  "#6734dd": "--color-brand-accent-violet-bright",
  "#6a5af9": "--lx-primary",
  "#6b2bd9": "--lx-primary",
  "#6f28cd": "--color-brand-accent-violet-deep",
  "#8b58d7": "--lx-primary",
  "#a05acb": "--lx-primary",

  // Blues (Secondary / Info)
  "#1d3f98": "--lx-secondary",
  "#1d5add": "--lx-secondary",
  "#2275d7": "--lx-secondary",
  "#2355bf": "--lx-secondary",
  "#315fd7": "--lx-secondary",
  "#3450a8": "--lx-primary",
  "#3853a4": "--color-brand-accent-blue-deep",
  "#0ea5e9": "--lx-info",

  // Cyan / Accent / Teal
  "#0ba5a8": "--lx-accent",
  "#12cdd4": "--lx-accent",
  "#137d7f": "--lx-accent",
  "#147c7e": "--lx-accent",
  "#28e1e8": "--lx-accent",
  "#7ee9ed": "--lx-accent",
  "#8df4ef": "--lx-accent",
  "#8ff2ed": "--lx-accent",
  "#9af4ef": "--lx-accent",
  "#9dfbf9": "--lx-accent",
  "#bfeee7": "--lx-accent",

  // Green / Emerald (Success)
  "#075b57": "--lx-success",
  "#10b981": "--lx-success",
  "#137867": "--lx-success",
  "#147c68": "--lx-success",
  "#147c78": "--lx-success",
  "#157b70": "--lx-success",
  "#48b88a": "--lx-success",
  "#315e69": "--lx-muted",

  // Muted / Slate / Text
  "#44537b": "--lx-muted",
  "#4d5e8c": "--lx-muted",
  "#536792": "--lx-muted",
  "#53679f": "--lx-muted",
  "#536ba5": "--lx-muted",
  "#536a91": "--lx-muted",
  "#5d6f9d": "--lx-muted",
  "#6074a5": "--lx-muted",
  "#6273a3": "--lx-muted",
  "#64749b": "--lx-muted",
  "#65749b": "--lx-muted",
  "#6677a5": "--lx-muted",
  "#6b7aa4": "--lx-muted",
  "#6c6372": "--lx-muted",
  "#6e7da5": "--lx-muted",
  "#7180a8": "--lx-muted",
  "#7182aa": "--lx-muted",
  "#7280a6": "--lx-muted",
  "#76664e": "--lx-muted",
  "#7a88ad": "--lx-muted",
  "#7b88a9": "--lx-muted",
  "#8190b7": "--lx-muted",
  "#8994b4": "--lx-muted",
  "#8a96b5": "--lx-muted",
  "#8b98b8": "--lx-muted",

  // Borders
  "#b6c8f4": "--lx-border",
  "#b8c7f1": "--lx-border",
  "#b9c5ea": "--lx-border",
  "#becbef": "--lx-border",
  "#c5cff0": "--lx-border",
  "#c6cff0": "--lx-border",
  "#c7d4fa": "--lx-border",
  "#c9d4ee": "--lx-border",
  "#cad6f2": "--lx-border",
  "#cbd6f1": "--lx-border",
  "#cbd7f0": "--lx-border",
  "#cbd8f8": "--lx-border",
  "#ccd7f2": "--lx-border",
  "#cdc6ff": "--lx-border",
  "#cfd9f0": "--lx-border",
  "#cfd9f2": "--lx-border",
  "#d6def4": "--lx-border",
  "#d7e0f6": "--lx-border",
  "#d8e0f6": "--lx-border",
  "#d8e7f6": "--lx-border",
  "#d9d6ff": "--lx-border",
  "#dbe4f7": "--lx-border",
  "#dcd7ff": "--lx-border",
  "#dce8f5": "--lx-border",
  "#dfe6f8": "--lx-surface",
  "#dfe7fb": "--lx-border",
  "#e1e7f6": "--lx-border",
  "#e1e7f8": "--lx-border",
  "#e2e7f7": "--lx-border",
  "#e3e9f7": "--lx-border",
  "#e3e9f8": "--lx-border",
  "#e4e9f5": "--lx-border",
  "#e4e9f7": "--lx-border",
  "#e7ebf8": "--lx-border",
  "#edf2f9": "--lx-border",

  // Surfaces / Backgrounds
  "#e4f8f2": "--lx-surface",
  "#e4fbf8": "--lx-surface",
  "#e6ecfb": "--lx-surface",
  "#e6faf5": "--lx-surface",
  "#e6fbfa": "--lx-surface",
  "#e7e0ff": "--lx-surface",
  "#e7f9f8": "--lx-surface",
  "#e8faf5": "--lx-surface",
  "#e9fbf9": "--lx-surface",
  "#e9fbff": "--lx-surface",
  "#eafffb": "--lx-surface",
  "#edf1fb": "--lx-surface",
  "#edf2ff": "--lx-surface",
  "#edf5ff": "--lx-surface",
  "#eee9ff": "--lx-surface",
  "#eef2ff": "--lx-surface",
  "#eef3ff": "--lx-surface",
  "#eefbff": "--lx-surface",
  "#eff3ff": "--lx-surface",
  "#effcfc": "--lx-surface",
  "#f0ecff": "--lx-surface",
  "#f0f3ff": "--lx-surface",
  "#f1edff": "--lx-surface",
  "#f1f4fb": "--lx-surface",
  "#f2edff": "--lx-surface",
  "#f2efff": "--lx-surface",
  "#f2f4f9": "--lx-surface",
  "#f3f0ff": "--lx-surface",
  "#f3f6ff": "--lx-surface",
  "#f4f0ff": "--lx-surface",
  "#f4f6fc": "--lx-surface",
  "#f5f2ff": "--lx-surface",
  "#f5f6ff": "--lx-surface",
  "#f5f7ff": "--lx-surface",
  "#f5fbff": "--lx-surface",
  "#f6f8ff": "--lx-surface",
  "#f7f3ff": "--lx-surface",
  "#f7f8fe": "--lx-surface",
  "#f7f9ff": "--lx-surface",
  "#f8faff": "--lx-canvas",
  "#f8fbff": "--lx-surface",
  "#fbfdff": "--lx-surface",
  "#fbfcff": "--lx-surface",
  "#faf9ff": "--lx-surface",
  "#fafbff": "--lx-surface",
  "#f8fafc": "--lx-surface",

  // Amber / Warning / Warm Tones
  "#563c1a": "--lx-warning",
  "#a05e20": "--lx-warning",
  "#a66013": "--lx-warning",
  "#d9480f": "--lx-warning",
  "#eadfcb": "--lx-warning",
  "#f4e8d3": "--lx-warning",
  "#f59e0b": "--lx-warning",
  "#fbbf24": "--lx-warning",
  "#fff3dc": "--lx-warning",
  "#fff8ed": "--lx-warning",
  "#fffaf2": "--lx-warning",
  "#fff0eb": "--lx-warning",

  // Red / Destructive / Rose
  "#a82b47": "--lx-destructive",
  "#b52c49": "--lx-destructive",
  "#ef4444": "--lx-destructive",
  "#ef8b72": "--lx-destructive",
  "#efb5c2": "--lx-destructive",
  "#efc4ce": "--lx-destructive",
  "#ffe2e7": "--lx-destructive",
  "#fff0f2": "--lx-destructive",
  "#fff5f7": "--lx-destructive",
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
function migrateButtonTags(content) {
  let modified = content;
  modified = modified.replace(/<button(\s)/g, (match, after) => `<Button${after}`);
  modified = modified.replace(/<button>/g, "<Button>");
  modified = modified.replace(/<\/button>/g, "</Button>");
  return modified;
}

function migrateInputTags(content) {
  let modified = content;
  modified = modified.replace(/<input(\s[^>]*?)(\s*\/?>)/g, (match, attrs, closing) => {
    if (/type\s*=\s*["'](?:checkbox|radio)["']/i.test(attrs)) return match;
    return `<Input${attrs}${closing}`;
  });
  return modified;
}

// ── Import management ────────────────────────────────────────────
function ensureButtonImport(content) {
  if (content.includes("@lurexa/ui/button") || content.includes('@lurexa/ui/Button')) return content;
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
  // Special case: text-[#fff] or bg-[#fff] -> text-white / bg-white
  let result = content.replace(/(bg|text|border|ring|stroke|fill|from|to|via|shadow|outline|divide)-\[#(?:fff|ffffff)\]/gi, (match, prefix) => {
    if (prefix === "bg") return "bg-white";
    if (prefix === "text") return "text-white";
    if (prefix === "border") return "border-white";
    return match;
  });

  // General Tailwind arbitrary hex values
  result = result.replace(
    /((?:bg|text|border|ring|stroke|fill|from|to|via|shadow|outline|divide|accent|caret|decoration|placeholder)-)\[#([0-9a-fA-F]{3,8})\]/g,
    (match, prefix, hex) => {
      const fullHex = `#${hex}`.toLowerCase();
      const token = hexToToken[fullHex];
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

const files = walk(appsDir, [".tsx", ".jsx", ".ts", ".js", ".css"]);
let totalModified = 0;
const summary = { buttons: 0, inputs: 0, hex: 0 };

for (const filePath of files) {
  const original = fs.readFileSync(filePath, "utf8");
  let content = original;

  // 1. Button migration (only for tsx/jsx)
  if (filePath.endsWith(".tsx") || filePath.endsWith(".jsx")) {
    const hadButton = /<button[\s>]/g.test(content);
    content = migrateButtonTags(content);
    if (hadButton && content !== original) {
      content = ensureButtonImport(content);
      summary.buttons++;
    }

    // 2. Input migration
    const beforeInput = content;
    content = migrateInputTags(content);
    if (content !== beforeInput) {
      content = ensureInputImport(content);
      summary.inputs++;
    }
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

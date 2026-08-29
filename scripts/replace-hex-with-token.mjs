// scripts/replace-hex-with-token.mjs
// Scans the codebase for hard‑coded hex colours in Tailwind className strings (e.g. bg-[#6b2bd9])
// and replaces them with the nearest existing design‑system token using CSS variables.

import fs from "fs";
import path from "path";
import { globby } from "globby";

// Mapping of observed hex values (lower‑cased) to the closest token CSS variable.
// Tokens are defined in packages/tokens/src/theme.css.
const hexToToken = {
  "#6b2bd9": "--lx-primary",
  "#315fd7": "--lx-secondary",
  "#dfe6f8": "--lx-surface",
  "#6677a5": "--lx-muted",
  "#3450a8": "--lx-primary",
  "#071d67": "--color-brand-navy",
  "#8df4ef": "--lx-accent",
  "#147c78": "--lx-success",
  "#315e69": "--lx-muted",
  "#d8e7f6": "--lx-border",
  "#e6faf5": "--lx-surface",
  "#6074a5": "--lx-muted",
  "#7182aa": "--lx-muted",
  "#d9d6ff": "--lx-border",
  "#f3f0ff": "--lx-surface",
  "#fbbf24": "--lx-warning",
  "#ef4444": "--lx-destructive",
  "#12cdd4": "--lx-accent",
  "#6f28cd": "--color-brand-accent-violet-deep",
  "#3853a4": "--color-brand-accent-blue-deep",
  "#6734dd": "--color-brand-accent-violet-bright",
  "#10b981": "--lx-success",
  "#f59e0b": "--lx-warning",
  "#0ea5e9": "--lx-info",
};

function replaceInContent(content) {
  // Replace Tailwind arbitrary colour values like bg-[#6b2bd9] or text-[#3450a8]
  const tailwindReplaced = content.replace(/(bg|text|border|ring|stroke|fill)\[#([0-9a-fA-F]{3,6})\]/g, (match, prefix, hex) => {
    const fullHex = `#${hex}`.toLowerCase();
    const token = hexToToken[fullHex];
    if (!token) return match;
    return `${prefix}[var(${token})]`;
  });

  // Replace inline style hex strings, e.g. style={{color: "#6b2bd9"}}
  const styleReplaced = tailwindReplaced.replace(/style\s*=\s*\{[^}]*["']#([0-9a-fA-F]{3,6})["'][^}]*\}/g, (match) => {
    return match.replace(/#([0-9a-fA-F]{3,6})/g, (fullMatch, hex) => {
      const token = hexToToken[fullMatch.toLowerCase()];
      if (!token) return fullMatch;
      return `var(${token})`;
    });
  });

  // Replace any remaining raw hex literals (e.g., in .css files)
  const finalContent = styleReplaced.replace(/#([0-9a-fA-F]{3,6})/g, (fullMatch, hex) => {
    const token = hexToToken[fullMatch.toLowerCase()];
    if (!token) return fullMatch;
    return `var(${token})`;
  });

  return finalContent;
}

async function processFile(filePath) {
  const ext = path.extname(filePath);
  if (![".tsx", ".ts", ".jsx", ".js", ".css"].includes(ext)) return;
  const original = await fs.promises.readFile(filePath, "utf8");
  const transformed = replaceInContent(original);
  if (transformed !== original) {
    await fs.promises.writeFile(filePath, transformed, "utf8");
    console.log(`Updated ${filePath}`);
  }
}

async function main() {
  const files = await globby([
    "**/*.{tsx,ts,jsx,js,css}",
    "!node_modules/**",
    "!**/dist/**",
    "!**/build/**",
  ]);
  for (const file of files) {
    await processFile(file);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

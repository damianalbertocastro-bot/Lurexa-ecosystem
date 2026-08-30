#!/usr/bin/env node

/**
 * verify-tier1-design-tokens.mjs
 * Validates Tier 1 Design System Implementation:
 * - Semantic Status Tokens (Success, Warning, Destructive, Info)
 * - Dark/Light Mode Token Parity
 * - Focus-Visible Ring & Accessibility Standards
 * - Hex Code Elimination in @lurexa/ui Primitives
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

console.log("\n🎨 LUREXA TIER 1 DESIGN SYSTEM & TOKEN VERIFICATION\n");

// 1. theme.css semantic status tokens
const themePath = path.join(ROOT, "packages/tokens/src/theme.css");
check("packages/tokens/src/theme.css exists", fs.existsSync(themePath));
if (fs.existsSync(themePath)) {
  const themeSrc = fs.readFileSync(themePath, "utf-8");
  check("theme.css defines --lx-success in light mode", themeSrc.includes("--lx-success:"));
  check("theme.css defines --lx-warning in light mode", themeSrc.includes("--lx-warning:"));
  check("theme.css defines --lx-destructive in light mode", themeSrc.includes("--lx-destructive:"));
  check("theme.css defines --lx-info in light mode", themeSrc.includes("--lx-info:"));
  check("theme.css defines dark mode semantic tokens in [data-theme='dark']", themeSrc.includes('[data-theme="dark"]') && themeSrc.includes("--lx-destructive-surface:"));
  check("theme.css defines @theme inline mappings for status tokens", themeSrc.includes("--color-lurexa-success:") && themeSrc.includes("--color-lurexa-destructive:"));
}

// 2. colors.ts status exports
const colorsPath = path.join(ROOT, "packages/tokens/src/colors.ts");
check("packages/tokens/src/colors.ts exists", fs.existsSync(colorsPath));
if (fs.existsSync(colorsPath)) {
  const colorsSrc = fs.readFileSync(colorsPath, "utf-8");
  check("colors.ts exports status.success", colorsSrc.includes("success:"));
  check("colors.ts exports status.warning", colorsSrc.includes("warning:"));
  check("colors.ts exports status.destructive", colorsSrc.includes("destructive:"));
  check("colors.ts exports status.info", colorsSrc.includes("info:"));
}

// 3. button.tsx primitive
const buttonPath = path.join(ROOT, "packages/ui/src/button.tsx");
check("packages/ui/src/button.tsx exists", fs.existsSync(buttonPath));
if (fs.existsSync(buttonPath)) {
  const buttonSrc = fs.readFileSync(buttonPath, "utf-8");
  check("button.tsx uses --lx-destructive for destructive variant", buttonSrc.includes("var(--lx-destructive)"));
  check("button.tsx implements focus-visible:ring-", buttonSrc.includes("focus-visible:ring-"));
  check("button.tsx implements active:scale-[0.98] spring feedback", buttonSrc.includes("active:scale-[0.98]"));
  check("button.tsx avoids hardcoded destructive hex codes", !buttonSrc.includes("#c62d48") && !buttonSrc.includes("#a91f39"));
}

// 4. Input.tsx primitive
const inputPath = path.join(ROOT, "packages/ui/src/Input.tsx");
check("packages/ui/src/Input.tsx exists", fs.existsSync(inputPath));
if (fs.existsSync(inputPath)) {
  const inputSrc = fs.readFileSync(inputPath, "utf-8");
  check("Input.tsx uses --lx-destructive for error states", inputSrc.includes("var(--lx-destructive)"));
  check("Input.tsx implements focus-visible ring", inputSrc.includes("focus-visible:ring-"));
  check("Input.tsx avoids hardcoded error hex codes", !inputSrc.includes("#d5485f") && !inputSrc.includes("#c62d48"));
}

// 5. Badge.tsx primitive
const badgePath = path.join(ROOT, "packages/ui/src/Badge.tsx");
check("packages/ui/src/Badge.tsx exists", fs.existsSync(badgePath));
if (fs.existsSync(badgePath)) {
  const badgeSrc = fs.readFileSync(badgePath, "utf-8");
  check("Badge.tsx uses semantic success surface & text tokens", badgeSrc.includes("var(--lx-success-surface)") && badgeSrc.includes("var(--lx-success)"));
  check("Badge.tsx uses semantic warning surface & text tokens", badgeSrc.includes("var(--lx-warning-surface)") && badgeSrc.includes("var(--lx-warning)"));
  check("Badge.tsx uses semantic info surface & text tokens", badgeSrc.includes("var(--lx-info-surface)") && badgeSrc.includes("var(--lx-info)"));
}

// 6. card.tsx primitive
const cardPath = path.join(ROOT, "packages/ui/src/card.tsx");
check("packages/ui/src/card.tsx exists", fs.existsSync(cardPath));
if (fs.existsSync(cardPath)) {
  const cardSrc = fs.readFileSync(cardPath, "utf-8");
  check("card.tsx implements transition-all duration-200", cardSrc.includes("transition-all duration-200"));
  check("card.tsx implements dynamic hover border elevation", cardSrc.includes("hover:border-[var(--lx-secondary)]/30"));
}

// 7. Tabs.tsx primitive
const tabsPath = path.join(ROOT, "packages/ui/src/Tabs.tsx");
check("packages/ui/src/Tabs.tsx exists", fs.existsSync(tabsPath));
if (fs.existsSync(tabsPath)) {
  const tabsSrc = fs.readFileSync(tabsPath, "utf-8");
  check("Tabs.tsx uses semantic canvas & border tokens", tabsSrc.includes("var(--lx-canvas)") && tabsSrc.includes("var(--lx-border)"));
  check("Tabs.tsx implements focus-visible:ring-", tabsSrc.includes("focus-visible:ring-"));
}

// 8. EmptyState.tsx primitive
const emptyPath = path.join(ROOT, "packages/ui/src/EmptyState.tsx");
check("packages/ui/src/EmptyState.tsx exists", fs.existsSync(emptyPath));
if (fs.existsSync(emptyPath)) {
  const emptySrc = fs.readFileSync(emptyPath, "utf-8");
  check("EmptyState.tsx uses semantic canvas & border tokens for icon wrap", emptySrc.includes("var(--lx-canvas)") && emptySrc.includes("var(--lx-border)"));
}

// 9. PresignedAudioRecorderWidget.tsx
const recorderPath = path.join(ROOT, "packages/ui/src/PresignedAudioRecorderWidget.tsx");
check("packages/ui/src/PresignedAudioRecorderWidget.tsx exists", fs.existsSync(recorderPath));
if (fs.existsSync(recorderPath)) {
  const recorderSrc = fs.readFileSync(recorderPath, "utf-8");
  check("PresignedAudioRecorderWidget uses --lx-destructive for error display", recorderSrc.includes("var(--lx-destructive)"));
  check("PresignedAudioRecorderWidget uses --lx-success for confirmation", recorderSrc.includes("var(--lx-success)"));
  check("PresignedAudioRecorderWidget implements focus-visible rings on actions", recorderSrc.includes("focus-visible:ring-"));
}

console.log(`\n📊 Tier 1 Verification Result: ${pass} passed, ${fail} failed out of ${pass + fail}\n`);
process.exit(fail > 0 ? 1 : 0);

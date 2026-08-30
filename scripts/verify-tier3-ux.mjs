#!/usr/bin/env node
// scripts/verify-tier3-ux.mjs
// Verifies Tier 3 UI/UX implementation:
// 1. Spring motion & animation keyframes in theme.css
// 2. High-FPS smoothed canvas audio visualizer HUD in @lurexa/ui
// 3. Dynamic audio waveform with spring variance in @lurexa/ui
// 4. Interactive Card hover elevation in @lurexa/ui
// 5. Spring micro-interactions in learn-web streak & milestone components
// 6. Sticky headers & scroll affordances in data tables

import fs from "node:fs";
import path from "node:path";

let passed = 0;
let failed = 0;

function check(description, condition, details = "") {
  if (condition) {
    console.log(`  ✅ ${description}`);
    passed++;
  } else {
    console.error(`  ❌ ${description}${details ? `: ${details}` : ""}`);
    failed++;
  }
}

console.log("\n✨ LUREXA TIER 3 UI/UX & MOTION VERIFICATION\n");

// 1. Theme.css spring tokens & animations
const themePath = path.resolve("packages/tokens/src/theme.css");
const themeContent = fs.existsSync(themePath) ? fs.readFileSync(themePath, "utf8") : "";
check("theme.css defines --lx-transition-spring", themeContent.includes("--lx-transition-spring"));
check("theme.css defines --lx-transition-smooth", themeContent.includes("--lx-transition-smooth"));
check("theme.css defines @keyframes lx-spring-pop", themeContent.includes("lx-spring-pop"));
check("theme.css defines @keyframes lx-pulse-glow", themeContent.includes("lx-pulse-glow"));
check("theme.css defines @keyframes lx-float", themeContent.includes("lx-float"));
check("theme.css defines .animate-spring-pop utility", themeContent.includes(".animate-spring-pop"));

// 2. RealtimeCoachCanvasVisualizer in @lurexa/ui
const visualizerPath = path.resolve("packages/ui/src/RealtimeCoachCanvasVisualizer.tsx");
const visualizerContent = fs.existsSync(visualizerPath) ? fs.readFileSync(visualizerPath, "utf8") : "";
check("RealtimeCoachCanvasVisualizer exists", fs.existsSync(visualizerPath));
check("Visualizer uses requestAnimationFrame", visualizerContent.includes("requestAnimationFrame"));
check("Visualizer implements smoothed frequency interpolation", visualizerContent.includes("smoothedHeightsRef"));
check("Visualizer renders ambient idle breathing wave", visualizerContent.includes("phaseRef.current"));
check("Visualizer implements speech energy aura ring", visualizerContent.includes("auraRadius"));

// 3. AudioWaveform in @lurexa/ui
const waveformPath = path.resolve("packages/ui/src/AudioWaveform.tsx");
const waveformContent = fs.existsSync(waveformPath) ? fs.readFileSync(waveformPath, "utf8") : "";
check("AudioWaveform exists", fs.existsSync(waveformPath));
check("AudioWaveform uses spring transition easing", waveformContent.includes("cubic-bezier(0.34, 1.56, 0.64, 1)"));

// 4. Card in @lurexa/ui
const cardPath = path.resolve("packages/ui/src/card.tsx");
const cardContent = fs.existsSync(cardPath) ? fs.readFileSync(cardPath, "utf8") : "";
check("Card component supports interactive hover elevation", cardContent.includes("interactive") && cardContent.includes("hover:-translate-y-1"));

// 5. VisualStreakTracker & MilestoneAchievementsCard in learn-web
const streakPath = path.resolve("apps/learn-web/app/dashboard/components/VisualStreakTracker.tsx");
const streakContent = fs.existsSync(streakPath) ? fs.readFileSync(streakPath, "utf8") : "";
check("VisualStreakTracker uses animate-spring-pop", streakContent.includes("animate-spring-pop"));
check("VisualStreakTracker features floating momentum flame", streakContent.includes("animate-float"));

const milestonePath = path.resolve("apps/learn-web/app/dashboard/components/MilestoneAchievementsCard.tsx");
const milestoneContent = fs.existsSync(milestonePath) ? fs.readFileSync(milestonePath, "utf8") : "";
check("MilestoneAchievementsCard implements tactile card hover states", milestoneContent.includes("hover:-translate-y-0.5"));

// 6. Data table sticky headers in admin-portal
const adminPagePath = path.resolve("apps/admin-portal/app/page.tsx");
const adminPageContent = fs.existsSync(adminPagePath) ? fs.readFileSync(adminPagePath, "utf8") : "";
check("Admin portal directory table has sticky thead", adminPageContent.includes("sticky top-0") && adminPageContent.includes("backdrop-blur-md"));

const fieldPilotPath = path.resolve("apps/admin-portal/app/analytics/field-pilot/page.tsx");
const fieldPilotContent = fs.existsSync(fieldPilotPath) ? fs.readFileSync(fieldPilotPath, "utf8") : "";
check("Field pilot matrix table has sticky thead", fieldPilotContent.includes("sticky top-0"));

const rosterPath = path.resolve("apps/admin-portal/app/roster/page.tsx");
const rosterContent = fs.existsSync(rosterPath) ? fs.readFileSync(rosterPath, "utf8") : "";
check("Roster preview table has sticky thead", rosterContent.includes("sticky top-0"));

console.log("\n────────────────────────────────────────");
console.log(`Tier 3 Verification Summary: ${passed} passed, ${failed} failed`);
console.log("────────────────────────────────────────\n");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 All Tier 3 UI/UX checks passed successfully!\n");
  process.exit(0);
}

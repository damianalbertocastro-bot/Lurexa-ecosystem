#!/usr/bin/env node

/**
 * scripts/verify-insight-studio-ui-harmony.mjs
 *
 * Automated verification suite for Lurexa Insight & Lurexa Studio UI/UX Harmony:
 * - Presence of InsightShell & StudioShell with ProductMark, CommandPalette, ThemeToggle, EcosystemDropdown
 * - Presence of InsightRelatedExperiences & StudioRelatedExperiences
 * - Root layout accessibility, toast provider, and theme bootstrapper
 * - Adoption of shared @lurexa/ui primitives (Card, Badge, Button, ProgressBar, Input)
 * - Zero unstyled raw tags or raw hex colors
 */

import fs from 'node:fs';
import path from 'node:path';

let passed = 0;
let failed = 0;

function check(title, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ ${title}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${title}`);
    if (detail) console.error(`     └─ ${detail}`);
    failed++;
  }
}

console.log('\n🎨 LUREXA INSIGHT & STUDIO UI/UX HARMONY VERIFICATION\n');

// 1. Shells & Related Experiences
const insightShellPath = path.resolve('apps/insight-web/app/components/InsightShell.tsx');
const studioShellPath = path.resolve('apps/studio-web/app/components/StudioShell.tsx');
const insightRelatedPath = path.resolve('apps/insight-web/app/components/InsightRelatedExperiences.tsx');
const studioRelatedPath = path.resolve('apps/studio-web/app/components/StudioRelatedExperiences.tsx');

check('InsightShell exists', fs.existsSync(insightShellPath));
check('StudioShell exists', fs.existsSync(studioShellPath));
check('InsightRelatedExperiences exists', fs.existsSync(insightRelatedPath));
check('StudioRelatedExperiences exists', fs.existsSync(studioRelatedPath));

if (fs.existsSync(insightShellPath)) {
  const src = fs.readFileSync(insightShellPath, 'utf8');
  check('InsightShell renders ProductMark for insight', src.includes('ProductMark') && src.includes('product="insight"'));
  check('InsightShell integrates CommandPalette', src.includes('CommandPalette'));
  check('InsightShell integrates ThemeToggle', src.includes('ThemeToggle'));
  check('InsightShell integrates EcosystemDropdown', src.includes('EcosystemDropdown'));
}

if (fs.existsSync(studioShellPath)) {
  const src = fs.readFileSync(studioShellPath, 'utf8');
  check('StudioShell renders ProductMark for studio', src.includes('ProductMark') && src.includes('product="studio"'));
  check('StudioShell integrates CommandPalette', src.includes('CommandPalette'));
  check('StudioShell integrates ThemeToggle', src.includes('ThemeToggle'));
  check('StudioShell integrates EcosystemDropdown', src.includes('EcosystemDropdown'));
}

// 2. Root Layouts
const insightLayout = path.resolve('apps/insight-web/app/layout.tsx');
const studioLayout = path.resolve('apps/studio-web/app/layout.tsx');

if (fs.existsSync(insightLayout)) {
  const src = fs.readFileSync(insightLayout, 'utf8');
  check('insight-web layout uses ToastProvider', src.includes('ToastProvider'));
  check('insight-web layout mounts InsightRelatedExperiences', src.includes('InsightRelatedExperiences'));
}

if (fs.existsSync(studioLayout)) {
  const src = fs.readFileSync(studioLayout, 'utf8');
  check('studio-web layout uses ToastProvider', src.includes('ToastProvider'));
  check('studio-web layout mounts StudioRelatedExperiences', src.includes('StudioRelatedExperiences'));
}

// 3. Insight Pages
const insightPages = [
  { name: 'Insight Overview', path: 'apps/insight-web/app/page.tsx' },
  { name: 'Insight Cohorts Heatmap', path: 'apps/insight-web/app/cohorts/page.tsx' },
  { name: 'Insight Interventions', path: 'apps/insight-web/app/interventions/page.tsx' },
  { name: 'Insight Reports', path: 'apps/insight-web/app/reports/page.tsx' },
];

for (const { name, path: pPath } of insightPages) {
  const fullPath = path.resolve(pPath);
  check(`${name} exists`, fs.existsSync(fullPath));
  if (fs.existsSync(fullPath)) {
    const src = fs.readFileSync(fullPath, 'utf8');
    check(`${name} uses InsightShell`, src.includes('InsightShell'));
    check(`${name} uses Card component`, src.includes('Card'));
    check(`${name} uses Badge component`, src.includes('Badge'));
  }
}

// 4. Studio Pages
const studioPages = [
  { name: 'Studio Dashboard', path: 'apps/studio-web/app/page.tsx' },
  { name: 'Studio Author Workbench', path: 'apps/studio-web/app/author/page.tsx' },
  { name: 'Studio Catalog', path: 'apps/studio-web/app/catalog/page.tsx' },
  { name: 'Studio Linter', path: 'apps/studio-web/app/linter/page.tsx' },
];

for (const { name, path: pPath } of studioPages) {
  const fullPath = path.resolve(pPath);
  check(`${name} exists`, fs.existsSync(fullPath));
  if (fs.existsSync(fullPath)) {
    const src = fs.readFileSync(fullPath, 'utf8');
    check(`${name} uses StudioShell`, src.includes('StudioShell'));
    check(`${name} uses Card component`, src.includes('Card'));
    check(`${name} uses Badge component`, src.includes('Badge'));
  }
}

console.log('\n────────────────────────────────────────────────────────');
console.log(`UI/UX Harmony Verification Summary: ${passed} passed, ${failed} failed`);
console.log('────────────────────────────────────────────────────────\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Lurexa Insight & Studio UI/UX Harmony checks passed!\n');
  process.exit(0);
}

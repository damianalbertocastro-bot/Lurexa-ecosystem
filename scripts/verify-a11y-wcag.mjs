#!/usr/bin/env node

/**
 * scripts/verify-a11y-wcag.mjs
 *
 * Automated verification suite for WCAG 2.1 AA Accessibility & Keyboard Navigation:
 * - Reduced motion media queries & CSS rules
 * - Skip to content navigation landmarks
 * - Dialog & modal ARIA & keyboard escape trapping
 * - Interactive command palette arrow & enter navigation
 * - Audio visualizer ARIA labels and roles
 * - Root layout landmark coverage across all products
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

console.log('\n♿ LUREXA WCAG 2.1 AA ACCESSIBILITY & KEYBOARD NAVIGATION VERIFICATION\n');

// 1. theme.css reduced motion & skip link
const themeCssPath = path.resolve('packages/tokens/src/theme.css');
const themeCss = fs.readFileSync(themeCssPath, 'utf8');

check('theme.css defines prefers-reduced-motion query', themeCss.includes('prefers-reduced-motion: reduce'));
check('theme.css disables animations in reduced motion mode', themeCss.includes('animation: none !important'));
check('theme.css defines .skip-link styles', themeCss.includes('.skip-link'));

// 2. SkipToContent UI Component
const skipToContentPath = path.resolve('packages/ui/src/SkipToContent.tsx');
check('SkipToContent.tsx component exists', fs.existsSync(skipToContentPath));
if (fs.existsSync(skipToContentPath)) {
  const skipSrc = fs.readFileSync(skipToContentPath, 'utf8');
  check('SkipToContent uses sr-only and focus:not-sr-only', skipSrc.includes('sr-only') && skipSrc.includes('focus:not-sr-only'));
  check('SkipToContent binds targetId href anchor', skipSrc.includes('href={`#${targetId}`}'));
}

// 3. Modal a11y
const modalPath = path.resolve('packages/ui/src/Modal.tsx');
check('Modal.tsx exists', fs.existsSync(modalPath));
if (fs.existsSync(modalPath)) {
  const modalSrc = fs.readFileSync(modalPath, 'utf8');
  check('Modal uses role="dialog" and aria-modal="true"', modalSrc.includes('role="dialog"') && modalSrc.includes('aria-modal="true"'));
  check('Modal closes on Escape key', modalSrc.includes('e.key === "Escape"'));
  check('Modal has focus-visible ring styling', modalSrc.includes('focus-visible:ring-'));
}

// 4. CommandPalette keyboard navigation
const commandPalettePath = path.resolve('packages/ui/src/CommandPalette.tsx');
check('CommandPalette.tsx exists', fs.existsSync(commandPalettePath));
if (fs.existsSync(commandPalettePath)) {
  const cpSrc = fs.readFileSync(commandPalettePath, 'utf8');
  check('CommandPalette handles ArrowDown key', cpSrc.includes('ArrowDown'));
  check('CommandPalette handles ArrowUp key', cpSrc.includes('ArrowUp'));
  check('CommandPalette handles Enter key', cpSrc.includes('Enter'));
  check('CommandPalette handles Escape key', cpSrc.includes('Escape'));
}

// 5. EcosystemDropdown ARIA
const dropdownPath = path.resolve('packages/ui/src/EcosystemDropdown.tsx');
check('EcosystemDropdown.tsx exists', fs.existsSync(dropdownPath));
if (fs.existsSync(dropdownPath)) {
  const dropSrc = fs.readFileSync(dropdownPath, 'utf8');
  check('EcosystemDropdown implements aria-haspopup', dropSrc.includes('aria-haspopup="true"'));
  check('EcosystemDropdown implements aria-expanded', dropSrc.includes('aria-expanded={isOpen}'));
  check('EcosystemDropdown implements role="menu" and role="menuitem"', dropSrc.includes('role="menu"') && dropSrc.includes('role="menuitem"'));
}

// 6. Audio Waveform & Canvas Visualizer
const waveformPath = path.resolve('packages/ui/src/AudioWaveform.tsx');
const visualizerPath = path.resolve('packages/ui/src/RealtimeCoachCanvasVisualizer.tsx');
if (fs.existsSync(waveformPath)) {
  const waveSrc = fs.readFileSync(waveformPath, 'utf8');
  check('AudioWaveform includes role="img" and aria-label', waveSrc.includes('role="img"') && waveSrc.includes('aria-label='));
  check('AudioWaveform respects motion-reduce', waveSrc.includes('motion-reduce:'));
}
if (fs.existsSync(visualizerPath)) {
  const vizSrc = fs.readFileSync(visualizerPath, 'utf8');
  check('RealtimeCoachCanvasVisualizer includes role="img" and aria-label', vizSrc.includes('role="img"') && vizSrc.includes('aria-label='));
}

// 7. Layouts have SkipToContent
const layouts = [
  { app: 'learn-web', path: 'apps/learn-web/app/layout.tsx' },
  { app: 'coach-web', path: 'apps/coach-web/app/layout.tsx' },
  { app: 'teach-web', path: 'apps/teach-web/app/layout.tsx' },
  { app: 'admin-portal', path: 'apps/admin-portal/app/layout.tsx' },
  { app: 'insight-web', path: 'apps/insight-web/app/layout.tsx' },
  { app: 'studio-web', path: 'apps/studio-web/app/layout.tsx' },
  { app: 'web', path: 'apps/web/app/layout.tsx' },
  { app: 'docs', path: 'apps/docs/app/layout.tsx' },
];

for (const { app, path: lPath } of layouts) {
  const fullPath = path.resolve(lPath);
  if (fs.existsSync(fullPath)) {
    const src = fs.readFileSync(fullPath, 'utf8');
    check(`${app} layout mounts SkipToContent`, src.includes('SkipToContent'));
  } else {
    check(`${app} layout exists`, false, `Missing ${lPath}`);
  }
}

console.log('\n────────────────────────────────────────');
console.log(`A11y Verification Summary: ${passed} passed, ${failed} failed`);
console.log('────────────────────────────────────────\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All WCAG 2.1 AA Accessibility & Keyboard Navigation checks passed!\n');
  process.exit(0);
}

import fs from "node:fs";
import path from "node:path";

const ignoredDirectories = new Set([
  ".next",
  ".turbo",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "out",
]);

const originalReaddirSync = fs.readdirSync.bind(fs);

fs.readdirSync = (target, options) => {
  const entries = originalReaddirSync(target, options);
  if (!Array.isArray(entries)) return entries;

  if (options && typeof options === "object" && options.withFileTypes) {
    return entries.filter((entry) => !(entry.isDirectory() && ignoredDirectories.has(entry.name)));
  }

  return entries.filter((entry) => !ignoredDirectories.has(String(entry)));
};

await import("./verify-brand-system.mjs");

// The original four-part Lurexa Master identity is a deliberate product-owner
// decision. Keep every parent-company asset aligned so a later logo exploration
// cannot silently replace it on only some web surfaces.
const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const normalizeSvg = (value) => value.replace(/\s+/g, "").replace(/#fff(?:fff)?/gi, "#FFFFFF").toUpperCase();

const canonicalMaster = read("packages/ui/brand/marks/lurexa-master.svg");
const publicMaster = read("apps/web/public/brand/lurexa-master.svg");
const ecosystemIcon = read("apps/web/app/icon.svg");
const masterComponent = read("packages/ui/src/MasterMark.tsx");

const originalGeometry = [
  "M39 38C26 38 13 31 10 15",
  "M41 38c0-15 8-26 22-30",
  "M39 42c-15 0-27 8-30 23",
  "M41 42c0 15 8 26 22 30",
  'cx="40" cy="40" r="5"',
];

for (const fragment of originalGeometry) {
  if (!canonicalMaster.includes(fragment)) {
    throw new Error(`Original Lurexa Master geometry is missing from canonical asset: ${fragment}`);
  }
  if (!masterComponent.includes(fragment)) {
    throw new Error(`MasterMark diverges from the restored original Lurexa Master geometry: ${fragment}`);
  }
}

if (normalizeSvg(canonicalMaster) !== normalizeSvg(publicMaster)) {
  throw new Error("Ecosystem public Master asset diverges from the canonical original Lurexa Master mark");
}
if (normalizeSvg(canonicalMaster) !== normalizeSvg(ecosystemIcon)) {
  throw new Error("Ecosystem browser icon diverges from the canonical original Lurexa Master mark");
}

const forbiddenReplacementGeometry = "M128 26L218 128L128 230L38 128L128 26Z";
for (const [label, content] of [
  ["canonical Master asset", canonicalMaster],
  ["shared MasterMark", masterComponent],
  ["ecosystem public Master asset", publicMaster],
  ["ecosystem browser icon", ecosystemIcon],
]) {
  if (content.includes(forbiddenReplacementGeometry)) {
    throw new Error(`${label} contains the superseded diamond Master-logo exploration`);
  }
}

console.log("✓ restored original Lurexa Master identity is aligned across canonical and ecosystem web assets");

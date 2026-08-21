import fs from "node:fs";

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

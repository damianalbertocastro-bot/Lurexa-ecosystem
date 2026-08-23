import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const theme = read("packages/tokens/src/theme.css");
const colors = read("packages/tokens/src/colors.ts");
const typography = read("packages/tokens/src/typography.ts");
const spacing = read("packages/tokens/src/spacing.ts");
const pkg = JSON.parse(read("packages/tokens/package.json"));

const failures = [];
const ok = (condition, message) => {
  if (!condition) failures.push(message);
  else console.log(`✓ ${message}`);
};

const cssVars = new Map(
  [...theme.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)].map((m) => [`--${m[1]}`, m[2].trim()]),
);

for (const source of [colors, typography]) {
  for (const match of source.matchAll(/var\((--[a-z0-9-]+)\)/gi)) {
    ok(cssVars.has(match[1]), `${match[1]} referenced by TypeScript exists in theme.css`);
  }
}

const canonical = {
  "--color-brand-navy": "#071d67",
  "--color-brand-primary": "#592bd6",
  "--color-brand-secondary": "#1d5add",
  "--color-brand-accent-cyan": "#12cdd4",
};
for (const [name, value] of Object.entries(canonical)) {
  ok(cssVars.get(name)?.toLowerCase() === value, `${name} preserves canonical ${value}`);
}

const typographyContract = {
  xs: ["0.75rem", "--font-size-xs"],
  sm: ["0.875rem", "--font-size-sm"],
  base: ["1rem", "--font-size-base"],
  lg: ["1.125rem", "--font-size-lg"],
  xl: ["1.25rem", "--font-size-xl"],
  "2xl": ["1.5rem", "--font-size-2xl"],
  "3xl": ["1.875rem", "--font-size-3xl"],
  "4xl": ["2.25rem", "--font-size-4xl"],
  "5xl": ["3rem", "--font-size-5xl"],
  display: ["clamp(2.25rem, 5vw, 3.75rem)", "--font-size-display"],
  displayLg: ["clamp(3.375rem, 6.6vw, 5.875rem)", "--font-size-display-lg"],
};
for (const [key, [value, variable]] of Object.entries(typographyContract)) {
  const tsPattern = new RegExp(`(?:["']?${key}["']?)\\s*:\\s*["']${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
  ok(tsPattern.test(typography), `typography.${key} matches ${value}`);
  ok(cssVars.get(variable) === value, `${variable} matches typography.${key}`);
}

const spacingContract = {0:"0",1:"0.25rem",2:"0.5rem",3:"0.75rem",4:"1rem",5:"1.25rem",6:"1.5rem",8:"2rem",10:"2.5rem",12:"3rem",16:"4rem",20:"5rem",24:"6rem",32:"8rem"};
for (const [key, value] of Object.entries(spacingContract)) {
  ok(new RegExp(`\\b${key}\\s*:\\s*["']${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`).test(spacing), `spacing.${key} matches ${value}`);
  ok(cssVars.get(`--spacing-${key}`) === value, `--spacing-${key} matches spacing.${key}`);
}

for (const alias of [
  "--color-lurexa-navy",
  "--color-lurexa-violet",
  "--color-lurexa-blue",
  "--color-lurexa-cyan",
  "--font-lurexa-sans",
  "--text-lurexa-display-lg",
  "--spacing-lurexa-32",
]) {
  ok(theme.includes(`${alias}:`), `${alias} is exposed to Tailwind v4 @theme`);
}
ok(/@theme\s+inline\s*\{/.test(theme), "theme.css exposes an @theme inline block");
ok(pkg.exports?.["./theme.css"] === "./src/theme.css", "package exports @lurexa/tokens/theme.css");

if (failures.length) {
  console.error(`\nDesign token contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}
console.log("\nLurexa design token contract passed.");

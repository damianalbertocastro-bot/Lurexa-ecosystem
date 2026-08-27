import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Narrow compatibility exceptions for two pre-existing, non-behavioral bindings.
  // Keep these file-scoped so the zero-warning policy remains intact everywhere else;
  // remove the bindings themselves when these components are next edited.
  {
    files: ["app/learn/components/AdvancedLearningCapabilities.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^playSuccess$" }],
    },
  },
  {
    files: ["app/learn/components/OfflineIndicator.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^Badge$" }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

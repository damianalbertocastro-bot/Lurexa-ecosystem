import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const checks = [];

function requireText(file, content, expected) {
  if (!content.includes(expected)) throw new Error(`${file} is missing current-truth marker: ${expected}`);
  checks.push(`${file}: ${expected}`);
}
function forbidText(file, content, forbidden) {
  if (content.includes(forbidden)) throw new Error(`${file} contains stale current-truth claim: ${forbidden}`);
  checks.push(`${file}: excludes ${forbidden}`);
}

const roadmap = read("ROADMAP.md");
const readme = read("README.md");
const learnReadme = read("apps/learn-web/README.md");
const products = read(".ai/context/products.md");
const stack = read(".ai/context/stack.md");
const developerAgent = read(".agents/agents/developer.md");
const bible = read("Docs/00-Lurexa-Bible.md");
const learnTeachBoundary = read("Docs/Architecture/LUREXA_LEARN_TEACH_PRODUCT_BOUNDARY.md");
const urlContract = read("Docs/Design/CROSS_PRODUCT_URL_CONTRACT.md");

for (const state of ["CONCEPT", "ARCHITECTURE", "PROTOTYPE", "CONTRACT_IMPLEMENTED", "MVP_IMPLEMENTED", "VERIFIED", "DEPLOYED", "PRODUCTION_READY"]) {
  requireText("ROADMAP.md", roadmap, state);
}
requireText("ROADMAP.md", roadmap, "Six sibling products");
requireText("ROADMAP.md", roadmap, "Lurexa Campus");
requireText("ROADMAP.md", roadmap, "Marketplace | CONCEPT");
requireText("ROADMAP.md", roadmap, "Lurexa Insight | ARCHITECTURE");
requireText("ROADMAP.md", roadmap, "Lurexa Studio | PROTOTYPE + CONTRACT_IMPLEMENTED foundations");

requireText("README.md", readme, "Node.js 24.x");
requireText("README.md", readme, "pnpm 10.3.0");
requireText("README.md", readme, "apps/coach-web");
requireText("README.md", readme, "Campus is structurally different");
requireText("README.md", readme, "http://localhost:3001");
requireText("README.md", readme, "http://localhost:3005");
forbidText("README.md", readme, "Coach should initially be embedded inside Lurexa Learn");
forbidText("README.md", readme, "Node.js 20 or later");
forbidText("README.md", readme, "storybook/        Component-library development environment");
forbidText("README.md", readme, "workflow files install pnpm 9");

requireText("apps/learn-web/README.md", learnReadme, "http://localhost:3001");
requireText("apps/learn-web/README.md", learnReadme, "apps/coach-web");
forbidText("apps/learn-web/README.md", learnReadme, "Open `http://localhost:3000`");

requireText(".ai/context/products.md", products, "apps/coach-web");
requireText(".ai/context/products.md", products, "Campus is not a seventh sibling product");
forbidText(".ai/context/products.md", products, "`apps/teacher-portal` = Lurexa Learn teacher operational workspace");
requireText(".ai/context/stack.md", stack, "Node.js: **24.x**");
requireText(".ai/context/stack.md", stack, "pnpm: **10.3.0**");
forbidText(".ai/context/stack.md", stack, "22 LTS");
forbidText(".agents/agents/developer.md", developerAgent, "apps/teacher-portal` adhering");
requireText(".agents/agents/developer.md", developerAgent, "apps/coach-web");

requireText("Docs/00-Lurexa-Bible.md", bible, "six sibling products");
requireText("Docs/00-Lurexa-Bible.md", bible, "standalone AI-powered English speaking, pronunciation and fluency product");
requireText("Docs/00-Lurexa-Bible.md", bible, "PRODUCTION_READY");
requireText("Docs/Architecture/LUREXA_LEARN_TEACH_PRODUCT_BOUNDARY.md", learnTeachBoundary, "exact teaching authorization");
requireText("Docs/Architecture/LUREXA_LEARN_TEACH_PRODUCT_BOUNDARY.md", learnTeachBoundary, "apps/coach-web");
forbidText("Docs/Architecture/LUREXA_LEARN_TEACH_PRODUCT_BOUNDARY.md", learnTeachBoundary, "The current membership role is an initial authorization mechanism");
requireText("Docs/Design/CROSS_PRODUCT_URL_CONTRACT.md", urlContract, "https://coach.lurexa.org");
requireText("Docs/Design/CROSS_PRODUCT_URL_CONTRACT.md", urlContract, "http://localhost:3005");
forbidText("Docs/Design/CROSS_PRODUCT_URL_CONTRACT.md", urlContract, "<Learn URL>/coach");
forbidText("Docs/Design/CROSS_PRODUCT_URL_CONTRACT.md", urlContract, "https://lurexa.com");

console.log(`Documentation truth verification passed (${checks.length} checks).`);

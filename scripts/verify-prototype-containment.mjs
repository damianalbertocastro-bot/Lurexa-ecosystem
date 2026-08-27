import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const checks = [];

function requireText(file, text, expected) {
  if (!text.includes(expected)) throw new Error(`${file} is missing prototype-containment marker: ${expected}`);
  checks.push(`${file}: ${expected}`);
}

function forbidText(file, text, forbidden) {
  if (text.includes(forbidden)) throw new Error(`${file} still contains misleading prototype claim: ${forbidden}`);
  checks.push(`${file}: excludes ${forbidden}`);
}

const marketplace = read("apps/learn-web/app/marketplace/page.tsx");
const marketplacePublish = read("apps/learn-web/app/marketplace/publish/page.tsx");
const billing = read("apps/learn-web/app/teacher/billing/page.tsx");
const tutor = read("apps/learn-web/app/learn/components/AITutorWidget.tsx");
const campus = read("apps/learn-web/app/campus/page.tsx");
const studio = read("apps/learn-web/app/teacher/studio/page.tsx");
const chat = read("apps/learn-web/app/chat/page.tsx");

forbidText("apps/learn-web/app/marketplace/page.tsx", marketplace, "MarketplaceService");
forbidText("apps/learn-web/app/marketplace/page.tsx", marketplace, "purchaseCourse");
requireText("apps/learn-web/app/marketplace/page.tsx", marketplace, "transactions disabled");
forbidText("apps/learn-web/app/marketplace/publish/page.tsx", marketplacePublish, "Stripe Connect Ready");
forbidText("apps/learn-web/app/marketplace/publish/page.tsx", marketplacePublish, "List Course for Sale");
requireText("apps/learn-web/app/marketplace/publish/page.tsx", marketplacePublish, "Publishing disabled");

forbidText("apps/learn-web/app/teacher/billing/page.tsx", billing, "BillingService");
forbidText("apps/learn-web/app/teacher/billing/page.tsx", billing, "org_demo");
forbidText("apps/learn-web/app/teacher/billing/page.tsx", billing, "checkout.stripe.com/pay/demo_");
requireText("apps/learn-web/app/teacher/billing/page.tsx", billing, "Billing preview · no payment processing");

forbidText("apps/learn-web/app/learn/components/AITutorWidget.tsx", tutor, "setTimeout");
requireText("apps/learn-web/app/learn/components/AITutorWidget.tsx", tutor, "Not connected");
requireText("apps/learn-web/app/learn/components/AITutorWidget.tsx", tutor, "governed Learn Tutor server boundary");

forbidText("apps/learn-web/app/campus/page.tsx", campus, "Universidad Autónoma de Santo Domingo");
forbidText("apps/learn-web/app/campus/page.tsx", campus, "Accredited Institution");
forbidText("apps/learn-web/app/campus/page.tsx", campus, "Institutional Single Sign-On");
forbidText("apps/learn-web/app/campus/page.tsx", campus, "Active Entitlement");
requireText("apps/learn-web/app/campus/page.tsx", campus, "Representative institutional shell prototype");
requireText("apps/learn-web/app/campus/page.tsx", campus, "not connected to a real institution");

forbidText("apps/learn-web/app/teacher/studio/page.tsx", studio, "created and registered to Studio catalog");
forbidText("apps/learn-web/app/teacher/studio/page.tsx", studio, "Register a persistent semantic identifier");
requireText("apps/learn-web/app/teacher/studio/page.tsx", studio, "Studio prototype · local preview only");
requireText("apps/learn-web/app/teacher/studio/page.tsx", studio, "It has not been saved to Core or published to Studio");
requireText("apps/learn-web/app/teacher/studio/page.tsx", studio, '"C2"');

requireText("apps/learn-web/app/chat/page.tsx", chat, 'redirect("/coach")');
forbidText("apps/learn-web/app/chat/page.tsx", chat, "ConversationWindow");

console.log(`Prototype containment verification passed (${checks.length} checks).`);

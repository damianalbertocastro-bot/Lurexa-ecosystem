import { readFile } from "node:fs/promises";

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

function requireText(path, content, expected) {
  if (!content.includes(expected)) throw new Error(`${path} is missing required Core analytics marker: ${expected}`);
}

function forbidText(path, content, forbidden) {
  if (content.includes(forbidden)) throw new Error(`${path} violates the Core analytics boundary: ${forbidden}`);
}

const paths = {
  contracts: "packages/types/src/platform-analytics.ts",
  core: "packages/backend/src/core/platform-admin.server.ts",
  legacyAdmin: "packages/backend/src/admin.service.ts",
  legacyAnalytics: "packages/backend/src/analytics.service.ts",
  backendBarrel: "packages/backend/src/index.ts",
  adminApi: "apps/admin-portal/app/api/admin/platform/route.ts",
  adminPage: "apps/admin-portal/app/page.tsx",
  adminLogin: "apps/admin-portal/app/login/page.tsx",
};

const content = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await source(path)])),
);

requireText(paths.contracts, content.contracts, "monthlyRecurringRevenue: number | null");
requireText(paths.contracts, content.contracts, "systemErrorRatePercent: number | null");
requireText(paths.contracts, content.contracts, "PlatformAdminSnapshot");

requireText(paths.core, content.core, "async function requireSuperAdmin");
requireText(paths.core, content.core, 'token.role !== "super_admin"');
requireText(paths.core, content.core, "await requireSuperAdmin(authorization)");
requireText(paths.core, content.core, "getServerFirestore");
requireText(paths.core, content.core, "activeLearnersMonthly");
requireText(paths.core, content.core, "monthlyRecurringRevenue: null");
requireText(paths.core, content.core, "systemErrorRatePercent: null");
forbidText(paths.core, content.core, "PlatformAdminActor");
forbidText(paths.core, content.core, "1420");
forbidText(paths.core, content.core, "1250000");
forbidText(paths.core, content.core, "2840");

requireText(paths.legacyAdmin, content.legacyAdmin, "Direct browser platform administration is disabled");
forbidText(paths.legacyAdmin, content.legacyAdmin, "firebase/firestore");
requireText(paths.legacyAnalytics, content.legacyAnalytics, "Legacy browser analytics are disabled");
forbidText(paths.legacyAnalytics, content.legacyAnalytics, "Carlos Ramirez");
forbidText(paths.legacyAnalytics, content.legacyAnalytics, "Ana Gomez");
forbidText(paths.legacyAnalytics, content.legacyAnalytics, "Mateo Diaz");
forbidText(paths.legacyAnalytics, content.legacyAnalytics, "Fallback demo metric");

requireText(paths.adminApi, content.adminApi, 'from "@lurexa/backend/core/platform-admin.server"');
requireText(paths.adminApi, content.adminApi, 'request.headers.get("authorization")');
requireText(paths.adminApi, content.adminApi, "PlatformAdminService.getSnapshot");
requireText(paths.adminApi, content.adminApi, "PlatformAdminService.updateOrganizationStatus");
forbidText(paths.adminApi, content.adminApi, "PlatformAdminService.authenticate");

requireText(paths.adminPage, content.adminPage, 'from "../lib/authenticated-fetch"');
forbidText(paths.adminPage, content.adminPage, "AdminService");
forbidText(paths.adminPage, content.adminPage, "firebase/firestore");
forbidText(paths.adminPage, content.adminPage, "monthlyRecurringRevenue.toLocaleString");
requireText(paths.adminPage, content.adminPage, "Not instrumented");

requireText(paths.adminLogin, content.adminLogin, 'claims.role !== "super_admin"');
requireText(paths.adminLogin, content.adminLogin, "does not have Lurexa Admin access");

forbidText(paths.backendBarrel, content.backendBarrel, 'export * from "./core/platform-admin.server"');
requireText(paths.backendBarrel, content.backendBarrel, "Server-only capabilities intentionally do not belong");

console.log("Core analytics boundary verification passed: measured server projections, per-operation superadmin authorization, no fabricated platform metrics, and no trusted browser mutations.");

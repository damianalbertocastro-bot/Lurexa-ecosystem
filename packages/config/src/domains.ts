import {
  lurexaPlatformEnv,
  lurexaPublicUrlEnv,
  type LurexaEnvironment,
} from "./environment";

export type EcosystemAppKey = "root" | "learn" | "coach" | "teach" | "admin" | "insight" | "studio" | "docs";

export interface EcosystemAppMeta {
  key: EcosystemAppKey;
  name: string;
  shortName: string;
  description: string;
  productionUrl: string;
  developmentUrl: string;
  devPort: number;
}

export const ECOSYSTEM_APP_REGISTRY: Record<EcosystemAppKey, EcosystemAppMeta> = {
  root: {
    key: "root",
    name: "Lurexa",
    shortName: "Ecosystem",
    description: "Core platform and ecosystem overview",
    productionUrl: "https://lurexa.org",
    developmentUrl: "http://localhost:3000",
    devPort: 3000,
  },
  learn: {
    key: "learn",
    name: "Lurexa Learn",
    shortName: "Learn",
    description: "Student and teacher operational learning experience",
    productionUrl: "https://learn.lurexa.org",
    developmentUrl: "http://localhost:3001",
    devPort: 3001,
  },
  coach: {
    key: "coach",
    name: "Lurexa Coach",
    shortName: "Coach",
    description: "Adaptive speaking, pronunciation, fluency, and professional English practice",
    productionUrl: "https://coach.lurexa.org",
    developmentUrl: "http://localhost:3005",
    devPort: 3005,
  },
  teach: {
    key: "teach",
    name: "Lurexa Teach",
    shortName: "Teach",
    description: "Professional growth, credentials, and educator community",
    productionUrl: "https://teach.lurexa.org",
    developmentUrl: "http://localhost:3002",
    devPort: 3002,
  },
  admin: {
    key: "admin",
    name: "Lurexa Admin",
    shortName: "Admin",
    description: "Institutional governance and platform operations",
    productionUrl: "https://admin.lurexa.org",
    developmentUrl: "http://localhost:3003",
    devPort: 3003,
  },
  insight: {
    key: "insight",
    name: "Lurexa Insight",
    shortName: "Insight",
    description: "Institutional analytics, learner intelligence, and cohort progress",
    productionUrl: "https://insight.lurexa.org",
    developmentUrl: "http://localhost:3006",
    devPort: 3006,
  },
  studio: {
    key: "studio",
    name: "Lurexa Studio",
    shortName: "Studio",
    description: "Curriculum authoring, knowledge objects, and competency design",
    productionUrl: "https://studio.lurexa.org",
    developmentUrl: "http://localhost:3007",
    devPort: 3007,
  },
  docs: {
    key: "docs",
    name: "Lurexa Docs",
    shortName: "Docs",
    description: "Canonical architecture and curriculum documentation",
    productionUrl: "https://docs.lurexa.org",
    developmentUrl: "http://localhost:3004",
    devPort: 3004,
  },
};

const ENV_VAR_OVERRIDES: Record<EcosystemAppKey, string> = {
  root: lurexaPublicUrlEnv.ecosystem,
  learn: lurexaPublicUrlEnv.learn,
  coach: lurexaPublicUrlEnv.coach,
  teach: lurexaPublicUrlEnv.teach,
  admin: lurexaPublicUrlEnv.admin,
  insight: lurexaPublicUrlEnv.insight,
  studio: lurexaPublicUrlEnv.studio,
  docs: lurexaPublicUrlEnv.docs,
};

function getExplicitOverride(appKey: EcosystemAppKey, env: LurexaEnvironment): string | undefined {
  const value = env[ENV_VAR_OVERRIDES[appKey]]?.trim();
  return value ? value.replace(/\/$/, "") : undefined;
}

export function isProductionEnv(env: LurexaEnvironment = process.env): boolean {
  const browserWindow = typeof globalThis !== "undefined"
    ? (globalThis as unknown as { window?: { location?: { hostname?: string } } }).window
    : undefined;
  if (browserWindow?.location?.hostname) {
    const hostname = browserWindow.location.hostname;
    if (hostname.endsWith("lurexa.org") || hostname.endsWith("vercel.app") || (!hostname.includes("localhost") && hostname !== "127.0.0.1")) {
      return true;
    }
  }
  const appEnv = env[lurexaPlatformEnv.appEnvironment]?.trim();
  if (appEnv) return appEnv === "production" || appEnv === "preview";

  const vercelEnv = env[lurexaPlatformEnv.vercelEnvironment]?.trim();
  if (vercelEnv) return vercelEnv === "production" || vercelEnv === "preview";

  return env[lurexaPlatformEnv.nodeEnvironment] === "production";
}

export function getEcosystemBaseUrl(
  appKey: EcosystemAppKey,
  env: LurexaEnvironment = process.env,
): string {
  const explicitOverride = getExplicitOverride(appKey, env);
  if (explicitOverride) return explicitOverride;

  const meta = ECOSYSTEM_APP_REGISTRY[appKey];
  if (!meta) throw new Error(`Unknown ecosystem app key: ${String(appKey)}`);

  return isProductionEnv(env) ? meta.productionUrl : meta.developmentUrl;
}

export function getEcosystemUrl(
  appKey: EcosystemAppKey,
  path?: string,
  env: LurexaEnvironment = process.env,
): string {
  const baseUrl = getEcosystemBaseUrl(appKey, env);
  if (!path) return baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export function getAllEcosystemApps(env: LurexaEnvironment = process.env): Array<EcosystemAppMeta & { url: string }> {
  return (Object.keys(ECOSYSTEM_APP_REGISTRY) as EcosystemAppKey[]).map((key) => ({
    ...ECOSYSTEM_APP_REGISTRY[key],
    url: getEcosystemUrl(key, undefined, env),
  }));
}

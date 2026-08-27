export type EcosystemAppKey = "root" | "learn" | "teach" | "admin" | "docs";

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

const ENV_VAR_OVERRIDES: Record<EcosystemAppKey, string[]> = {
  root: ["NEXT_PUBLIC_ROOT_URL", "NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL"],
  learn: ["NEXT_PUBLIC_LEARN_URL", "NEXT_PUBLIC_LUREXA_LEARN_URL"],
  teach: ["NEXT_PUBLIC_TEACH_URL", "NEXT_PUBLIC_LUREXA_TEACH_URL"],
  admin: ["NEXT_PUBLIC_ADMIN_URL", "NEXT_PUBLIC_LUREXA_ADMIN_URL"],
  docs: ["NEXT_PUBLIC_DOCS_URL", "NEXT_PUBLIC_LUREXA_DOCS_URL"],
};

function getExplicitOverride(appKey: EcosystemAppKey, env: Record<string, string | undefined>): string | undefined {
  const vars = ENV_VAR_OVERRIDES[appKey] ?? [];
  for (const varName of vars) {
    const val = env[varName]?.trim();
    if (val) {
      return val.replace(/\/$/, "");
    }
  }
  return undefined;
}

export function isProductionEnv(env: Record<string, string | undefined> = process.env): boolean {
  const browserWindow = typeof globalThis !== "undefined"
    ? (globalThis as unknown as { window?: { location?: { hostname?: string } } }).window
    : undefined;
  if (browserWindow?.location?.hostname) {
    const hostname = browserWindow.location.hostname;
    if (hostname.endsWith("lurexa.org") || hostname.endsWith("vercel.app") || (!hostname.includes("localhost") && hostname !== "127.0.0.1")) {
      return true;
    }
  }
  const appEnv = env.NEXT_PUBLIC_APP_ENV?.trim();
  if (appEnv) {
    return appEnv === "production" || appEnv === "preview";
  }
  const vercelEnv = env.VERCEL_ENV?.trim();
  if (vercelEnv) {
    return vercelEnv === "production" || vercelEnv === "preview";
  }
  return env.NODE_ENV === "production";
}

export function getEcosystemBaseUrl(
  appKey: EcosystemAppKey,
  env: Record<string, string | undefined> = process.env
): string {
  const explicitOverride = getExplicitOverride(appKey, env);
  if (explicitOverride) {
    return explicitOverride;
  }

  const meta = ECOSYSTEM_APP_REGISTRY[appKey];
  if (!meta) {
    throw new Error(`Unknown ecosystem app key: ${String(appKey)}`);
  }

  return isProductionEnv(env) ? meta.productionUrl : meta.developmentUrl;
}

export function getEcosystemUrl(
  appKey: EcosystemAppKey,
  path?: string,
  env: Record<string, string | undefined> = process.env
): string {
  const baseUrl = getEcosystemBaseUrl(appKey, env);
  if (!path) return baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export function getAllEcosystemApps(env: Record<string, string | undefined> = process.env): Array<EcosystemAppMeta & { url: string }> {
  return (Object.keys(ECOSYSTEM_APP_REGISTRY) as EcosystemAppKey[]).map((key) => {
    const meta = ECOSYSTEM_APP_REGISTRY[key];
    return {
      ...meta,
      url: getEcosystemUrl(key, undefined, env),
    };
  });
}

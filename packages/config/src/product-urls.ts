import {
  lurexaPublicUrlEnv,
  type LurexaEnvironment,
  type LurexaPublicUrlMap,
} from "./environment";

export { inactivePublicProductUrlEnv, lurexaPublicUrlEnv } from "./environment";
export type { LurexaPublicExperienceId, LurexaPublicUrlMap } from "./environment";

const canonicalFallbacks = {
  ecosystem: "https://lurexa.org",
  learn: "https://learn.lurexa.org",
  coach: "https://coach.lurexa.org",
  teach: "https://teach.lurexa.org",
  admin: "https://admin.lurexa.org",
  studio: "https://studio.lurexa.org",
  insight: "https://insight.lurexa.org",
  docs: "https://docs.lurexa.org",
} as const;

function cleanUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("#") || trimmed.startsWith("/")) return trimmed;
  try {
    return new URL(trimmed).toString().replace(/\/$/, "");
  } catch {
    throw new Error(`Invalid Lurexa public URL: ${trimmed}`);
  }
}

export function resolveLurexaPublicUrls(env: LurexaEnvironment = process.env): LurexaPublicUrlMap {
  const ecosystem = cleanUrl(env[lurexaPublicUrlEnv.ecosystem]) ?? canonicalFallbacks.ecosystem;
  const learn = cleanUrl(env[lurexaPublicUrlEnv.learn]) ?? canonicalFallbacks.learn;

  return {
    ecosystem,
    learn,
    teacher: cleanUrl(env[lurexaPublicUrlEnv.teacher]) ?? learn,
    coach: cleanUrl(env[lurexaPublicUrlEnv.coach]) ?? canonicalFallbacks.coach,
    teach: cleanUrl(env[lurexaPublicUrlEnv.teach]) ?? canonicalFallbacks.teach,
    admin: cleanUrl(env[lurexaPublicUrlEnv.admin]) ?? canonicalFallbacks.admin,
    insight: cleanUrl(env[lurexaPublicUrlEnv.insight]) ?? canonicalFallbacks.insight,
    studio: cleanUrl(env[lurexaPublicUrlEnv.studio]) ?? canonicalFallbacks.studio,
    campus: cleanUrl(env[lurexaPublicUrlEnv.campus]) ?? ecosystem,
    docs: cleanUrl(env[lurexaPublicUrlEnv.docs]) ?? canonicalFallbacks.docs,
  };
}

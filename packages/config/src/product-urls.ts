export const lurexaPublicUrlEnv = {
  ecosystem: "NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL",
  learn: "NEXT_PUBLIC_LUREXA_LEARN_URL",
  teacher: "NEXT_PUBLIC_LUREXA_TEACHER_URL",
  coach: "NEXT_PUBLIC_LUREXA_COACH_URL",
  teach: "NEXT_PUBLIC_LUREXA_TEACH_URL",
  admin: "NEXT_PUBLIC_LUREXA_ADMIN_URL",
  insight: "NEXT_PUBLIC_LUREXA_INSIGHT_URL",
  studio: "NEXT_PUBLIC_LUREXA_STUDIO_URL",
  campus: "NEXT_PUBLIC_LUREXA_CAMPUS_URL",
  docs: "NEXT_PUBLIC_LUREXA_DOCS_URL",
} as const;

export type LurexaPublicExperienceId = keyof typeof lurexaPublicUrlEnv;
export type LurexaPublicUrlMap = Record<LurexaPublicExperienceId, string>;

type PublicEnv = Partial<Record<(typeof lurexaPublicUrlEnv)[LurexaPublicExperienceId], string | undefined>>;

const canonicalFallbacks = {
  ecosystem: "https://lurexa.org",
  learn: "https://learn.lurexa.org",
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

export function resolveLurexaPublicUrls(env: PublicEnv = process.env): LurexaPublicUrlMap {
  const ecosystem = cleanUrl(env[lurexaPublicUrlEnv.ecosystem]) ?? canonicalFallbacks.ecosystem;
  const learn = cleanUrl(env[lurexaPublicUrlEnv.learn]) ?? canonicalFallbacks.learn;

  return {
    ecosystem,
    learn,
    teacher: cleanUrl(env[lurexaPublicUrlEnv.teacher]) ?? learn,
    coach: cleanUrl(env[lurexaPublicUrlEnv.coach]) ?? `${learn}/coach`,
    teach: cleanUrl(env[lurexaPublicUrlEnv.teach]) ?? "https://teach.lurexa.org",
    admin: cleanUrl(env[lurexaPublicUrlEnv.admin]) ?? "https://admin.lurexa.org",
    insight: cleanUrl(env[lurexaPublicUrlEnv.insight]) ?? ecosystem,
    studio: cleanUrl(env[lurexaPublicUrlEnv.studio]) ?? ecosystem,
    campus: cleanUrl(env[lurexaPublicUrlEnv.campus]) ?? ecosystem,
    docs: cleanUrl(env[lurexaPublicUrlEnv.docs]) ?? "https://docs.lurexa.org",
  };
}

export const inactivePublicProductUrlEnv = {
  community: "NEXT_PUBLIC_LUREXA_COMMUNITY_URL",
} as const;

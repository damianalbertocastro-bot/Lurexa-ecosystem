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

export const lurexaPublicFirebaseEnv = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
  useEmulator: "NEXT_PUBLIC_USE_FIREBASE_EMULATOR",
  emulatorHost: "NEXT_PUBLIC_FIREBASE_EMULATOR_HOST",
  authEmulatorPort: "NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT",
  firestoreEmulatorPort: "NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT",
} as const;

export const lurexaServerEnv = {
  firebaseServiceAccountJson: "FIREBASE_SERVICE_ACCOUNT_JSON",
  firebaseProjectId: "FIREBASE_PROJECT_ID",
  firebaseStorageBucket: "FIREBASE_STORAGE_BUCKET",
  firestoreEmulatorHost: "FIRESTORE_EMULATOR_HOST",
  geminiApiKey: "GEMINI_API_KEY",
  learnTutorModel: "LUREXA_LEARN_TUTOR_MODEL",
  learnTtsVoice: "LUREXA_LEARN_TTS_VOICE",
} as const;

export const lurexaPlatformEnv = {
  appEnvironment: "NEXT_PUBLIC_APP_ENV",
  vercelEnvironment: "VERCEL_ENV",
  nodeEnvironment: "NODE_ENV",
} as const;

export const inactivePublicProductUrlEnv = {
  community: "NEXT_PUBLIC_LUREXA_COMMUNITY_URL",
} as const;

export type LurexaPublicExperienceId = keyof typeof lurexaPublicUrlEnv;
export type LurexaPublicUrlMap = Record<LurexaPublicExperienceId, string>;
export type LurexaEnvironment = Record<string, string | undefined>;

export function readEnvironmentValue(
  env: LurexaEnvironment,
  name: string,
): string | undefined {
  const value = env[name]?.trim();
  return value || undefined;
}

export function requireEnvironmentValue(
  env: LurexaEnvironment,
  name: string,
): string {
  const value = readEnvironmentValue(env, name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export * from "./product-registry";

export type AppEnv = "development" | "staging" | "production";

export type AppConfig = {
  env: AppEnv;
  apiUrl: string;
  appUrl: string;
};

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function createAppConfig(): AppConfig {
  const env = (process.env.NODE_ENV ?? "development") as AppEnv;

  return {
    env,
    apiUrl: getEnv("API_URL", "http://localhost:3001"),
    appUrl: getEnv("APP_URL", "http://localhost:3000"),
  };
}

import type { User } from "@lurexa/types";

export type DatabaseClient = {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  findUserById(id: string): Promise<User | null>;
};

export type DatabaseConfig = {
  url: string;
};

export function createDatabaseConfig(url = process.env.DATABASE_URL): DatabaseConfig {
  if (!url) {
    throw new Error("Missing required environment variable: DATABASE_URL");
  }

  return { url };
}

export * from "./learner.repository";

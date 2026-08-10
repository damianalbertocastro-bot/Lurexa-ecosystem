import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

interface RepositoryEntry {
  name: string;
  path: string;
  required: boolean;
}

interface RepositoryManifest {
  name: string;
  packageManager: string;
  apps: RepositoryEntry[];
  packages: RepositoryEntry[];
}

const rootDirectory = resolve(import.meta.dirname, "../..");
const manifestPath = resolve(rootDirectory, "bootstrap/repository.json");

function readManifest(): RepositoryManifest {
  const content = readFileSync(manifestPath, "utf8");

  return JSON.parse(content) as RepositoryManifest;
}

function verifyEntries(
  category: string,
  entries: RepositoryEntry[],
): string[] {
  const errors: string[] = [];

  for (const entry of entries) {
    if (!entry.required) {
      continue;
    }

    const entryPath = resolve(rootDirectory, entry.path);

    if (!existsSync(entryPath)) {
      errors.push(
        `Missing ${category}: ${entry.name} at ${entry.path}`,
      );
    }
  }

  return errors;
}

function verifyRepository(): void {
  const manifest = readManifest();

  const errors = [
    ...verifyEntries("application", manifest.apps),
    ...verifyEntries("package", manifest.packages),
  ];

  if (errors.length > 0) {
    console.error("Repository verification failed:\n");

    for (const error of errors) {
      console.error(`- ${error}`);
    }

    process.exit(1);
  }

  console.log("Repository structure verified successfully.");
  console.log(`Applications: ${manifest.apps.length}`);
  console.log(`Packages: ${manifest.packages.length}`);
}

verifyRepository();
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const rootDirectory = resolve(import.meta.dirname, "../..");

function run(command: string): void {
  console.log(`\n> ${command}`);

  execSync(command, {
    cwd: rootDirectory,
    stdio: "inherit",
  });
}

function assertRepositoryRoot(): void {
  const requiredFiles = [
    "package.json",
    "pnpm-workspace.yaml",
    "turbo.json",
    "bootstrap/repository.json",
  ];

  for (const file of requiredFiles) {
    const fullPath = resolve(rootDirectory, file);

    if (!existsSync(fullPath)) {
      throw new Error(`Required repository file is missing: ${file}`);
    }
  }
}

function bootstrap(): void {
  console.log("Bootstrapping the Lurexa repository...");

  assertRepositoryRoot();

  run("pnpm install");
  run("pnpm bootstrap:verify");
  run("pnpm typecheck");
  run("pnpm lint");
  run("pnpm build");

  console.log("\nLurexa bootstrap completed successfully.");
  console.log("Run `pnpm dev` to start development.");
}

try {
  bootstrap();
} catch (error) {
  console.error("\nLurexa bootstrap failed.");

  if (error instanceof Error) {
    console.error(error.message);
  }

  process.exit(1);
}
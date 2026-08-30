// scripts/migrate-buttons-inputs.mjs
// This script replaces native <button> and <input> elements with Lurexa UI components.

import fs from "fs";
import path from "path";
import { globby } from "globby";

const apps = ["apps/coach-web", "apps/learn-web"];
const pattern = "**/*.tsx";

const buttonImport = "import { Button } from '@lurexa/ui';";
const inputImport = "import { Input } from '@lurexa/ui';";

async function ensureImport(content, importStmt) {
  if (content.includes(importStmt)) return content;
  const importRegex = /(import[^;]+;\s*)$/m;
  const match = content.match(importRegex);
  if (match) {
    const insertPos = match.index + match[0].length;
    return content.slice(0, insertPos) + "\n" + importStmt + content.slice(insertPos);
  }
  return importStmt + "\n" + content;
}

async function processFile(filePath) {
  let content = await fs.promises.readFile(filePath, "utf8");
  const original = content;

  // Replace <button> and </button> with <Button> and </Button>
  const buttonOpenRegex = /<\s*button\b[^>]*>/gi;
  const buttonCloseRegex = /<\s*\/\s*button\s*>/gi;
  if (buttonOpenRegex.test(content) || buttonCloseRegex.test(content)) {
    content = content.replace(buttonOpenRegex, "<Button>");
    content = content.replace(buttonCloseRegex, "</Button>");
    content = await ensureImport(content, buttonImport);
  }

  // Replace <input> (including self‑closing) with <Input>
  const inputRegex = /<\s*input\b[^>]*\/?>/gi;
  if (inputRegex.test(content)) {
    content = content.replace(inputRegex, "<Input>");
    content = await ensureImport(content, inputImport);
  }

  if (content !== original) {
    await fs.promises.writeFile(filePath, content, "utf8");
    console.log(`Modified ${filePath}`);
  }
}

async function main() {
  for (const app of apps) {
    const files = await globby(path.join(app, pattern), {
      ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
    });
    for (const file of files) {
      await processFile(file);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

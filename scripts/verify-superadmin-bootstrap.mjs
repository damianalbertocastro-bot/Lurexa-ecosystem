import { readFile } from "node:fs/promises";

const path = "packages/backend/scripts/grant-superadmin.ts";
const content = await readFile(new URL(`../${path}`, import.meta.url), "utf8");

function requireText(expected) {
  if (!content.includes(expected)) throw new Error(`${path} is missing required bootstrap safeguard: ${expected}`);
}

function forbidText(forbidden) {
  if (content.includes(forbidden)) throw new Error(`${path} contains forbidden bootstrap behavior: ${forbidden}`);
}

requireText('apply: false');
requireText('Boolean(args.email) === Boolean(args.uid)');
requireText('if (!args.apply)');
requireText('Dry run only. Re-run the same command with --apply');
requireText('await auth.setCustomUserClaims');
requireText('...existingClaims');
requireText('role: "super_admin"');
requireText('getUserByEmail');
requireText('getUser(args.uid!');
requireText('sign out and sign back in');
forbidText('password');
forbidText('private_key');
forbidText('serviceAccount:');

const dryRunPosition = content.indexOf('if (!args.apply)');
const mutationPosition = content.indexOf('await auth.setCustomUserClaims');
if (dryRunPosition < 0 || mutationPosition < 0 || dryRunPosition > mutationPosition) {
  throw new Error(`${path} must enforce dry-run before the Firebase custom-claim mutation.`);
}

console.log("Superadmin bootstrap verification passed: explicit target, dry-run by default, --apply gate, claim preservation, and no embedded credentials.");

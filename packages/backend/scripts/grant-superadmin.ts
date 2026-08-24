import { getServerFirebaseAuth } from "../src/firebase-admin.server";

interface Arguments {
  email: string | null;
  uid: string | null;
  apply: boolean;
  help: boolean;
}

function usage(): string {
  return [
    "Grant the Lurexa super_admin Firebase custom claim to one explicitly selected account.",
    "",
    "Usage:",
    "  pnpm admin:grant-superadmin -- --email admin@example.com",
    "  pnpm admin:grant-superadmin -- --uid FIREBASE_UID",
    "  pnpm admin:grant-superadmin -- --email admin@example.com --apply",
    "",
    "Safety:",
    "  - Dry-run is the default. No claim is changed without --apply.",
    "  - Exactly one of --email or --uid is required.",
    "  - Existing custom claims are preserved; only the role claim is set to super_admin.",
    "  - Firebase Admin credentials must already be configured in the environment.",
  ].join("\n");
}

function parseArguments(argv: string[]): Arguments {
  const result: Arguments = { email: null, uid: null, apply: false, help: false };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--apply") {
      result.apply = true;
      continue;
    }
    if (argument === "--help" || argument === "-h") {
      result.help = true;
      continue;
    }
    if (argument === "--email" || argument === "--uid") {
      const value = argv[index + 1]?.trim();
      if (!value || value.startsWith("--")) {
        throw new Error(`${argument} requires a value.`);
      }
      if (argument === "--email") result.email = value;
      if (argument === "--uid") result.uid = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }

  return result;
}

async function main(): Promise<void> {
  const args = parseArguments(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }
  if (Boolean(args.email) === Boolean(args.uid)) {
    throw new Error("Select exactly one account with --email or --uid.\n\n" + usage());
  }

  const auth = getServerFirebaseAuth();
  const user = args.email
    ? await auth.getUserByEmail(args.email)
    : await auth.getUser(args.uid!);
  const existingClaims = user.customClaims ?? {};
  const previousRole = typeof existingClaims.role === "string" ? existingClaims.role : null;

  console.log(JSON.stringify({
    mode: args.apply ? "apply" : "dry-run",
    targetUid: user.uid,
    targetEmail: user.email ?? null,
    previousRole,
    nextRole: "super_admin",
    preservesOtherCustomClaims: true,
  }, null, 2));

  if (!args.apply) {
    console.log("\nDry run only. Re-run the same command with --apply after confirming the target account.");
    return;
  }

  await auth.setCustomUserClaims(user.uid, {
    ...existingClaims,
    role: "super_admin",
  });

  console.log("\nSuperadmin claim applied. The account must refresh its Firebase ID token (sign out and sign back in) before Lurexa Admin access is available.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Unable to grant the superadmin claim.");
  process.exitCode = 1;
});

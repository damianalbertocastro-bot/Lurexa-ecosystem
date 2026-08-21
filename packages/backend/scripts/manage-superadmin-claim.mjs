/* eslint-disable no-undef, turbo/no-undeclared-env-vars */

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const args = process.argv.slice(2);
const uidIndex = args.indexOf("--uid");
const enable = args.includes("--enable");
const disable = args.includes("--disable");
const confirmed = args.includes("--confirm");
const uid = uidIndex >= 0 ? args[uidIndex + 1] : undefined;

if (!uid || enable === disable) {
  console.error("Usage: node packages/backend/scripts/manage-superadmin-claim.mjs --uid <firebase-uid> (--enable|--disable) --confirm");
  process.exit(1);
}
if (!confirmed) {
  console.error("Refusing to change platform-admin claims without --confirm.");
  process.exit(1);
}

const serialized = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serialized) {
  console.error("FIREBASE_SERVICE_ACCOUNT_JSON is required. Keep this credential local; never commit or paste it into the repository.");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serialized);
} catch {
  console.error("FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON.");
  process.exit(1);
}

for (const key of ["project_id", "client_email", "private_key"]) {
  if (!serviceAccount?.[key]) {
    console.error(`FIREBASE_SERVICE_ACCOUNT_JSON is missing ${key}.`);
    process.exit(1);
  }
}

const app = getApps()[0] ?? initializeApp({
  credential: cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
  }),
  projectId: serviceAccount.project_id,
});
const auth = getAuth(app);
const user = await auth.getUser(uid);
const current = user.customClaims ?? {};
const next = { ...current };

if (enable) next.role = "super_admin";
else if (next.role === "super_admin") delete next.role;

await auth.setCustomUserClaims(uid, next);
console.log(`${enable ? "Granted" : "Revoked"} Lurexa super_admin claim for Firebase user ${uid}.`);
console.log("The user must refresh or sign in again before the new ID-token claim is visible.");

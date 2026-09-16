#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const backendRequire = createRequire(path.resolve(process.cwd(), "packages", "backend", "package.json"));
const { cert, getApps, initializeApp } = backendRequire("firebase-admin/app");
const { getAuth } = backendRequire("firebase-admin/auth");
const { FieldValue, getFirestore } = backendRequire("firebase-admin/firestore");

function readServiceAccount() {
  const envJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (envJson) {
    try {
      return JSON.parse(envJson.replace(/^\uFEFF/, ""));
    } catch {
      // safe fallback
    }
  }

  const candidates = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    path.join(process.cwd(), "service-account.json"),
    path.join(process.cwd(), "service-account.json.json"),
    path.join(process.cwd(), "apps", "learn-web", "service-account.json"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        const content = fs.readFileSync(candidate, "utf8").replace(/^\uFEFF/, "").trim();
        const parsed = JSON.parse(content);
        if (parsed.project_id && parsed.client_email && parsed.private_key) {
          return parsed;
        }
      } catch {
        // safe fallback
      }
    }
  }

  return null;
}

function initFirebase() {
  if (getApps().length > 0) {
    const existing = getApps()[0];
    return { auth: getAuth(existing), firestore: getFirestore(existing) };
  }

  const sa = readServiceAccount();
  const isEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST);

  let app;
  if (sa) {
    app = initializeApp({
      credential: cert({
        projectId: sa.project_id,
        clientEmail: sa.client_email,
        privateKey: sa.private_key.replace(/\\n/g, "\n"),
      }),
      projectId: sa.project_id,
    });
  } else if (isEmulator || process.env.GCLOUD_PROJECT) {
    const projectId = process.env.GCLOUD_PROJECT || "lurexa-app";
    app = initializeApp({ projectId });
  } else {
    throw new Error(
      "Unable to initialize Firebase Admin. Please configure FIREBASE_SERVICE_ACCOUNT_JSON or place service-account.json in the repository.",
    );
  }

  return { auth: getAuth(app), firestore: getFirestore(app) };
}

const TEST_USERS = [
  // 10 Students
  ...Array.from({ length: 10 }, (_, i) => {
    const index = i + 1;
    return {
      email: `learner${index}@lurexa.org`,
      password: "LurexaLearner2026!",
      displayName: `Test Learner ${index}`,
      role: "student",
      subscriptionTier: "ultra",
      organizationId: "org_lurexa_alpha",
      unlockedModules: ["ALL"],
      status: "active",
    };
  }),
  // 2 Teachers
  {
    email: "teacher1@lurexa.org",
    password: "LurexaTeacher2026!",
    displayName: "Test Teacher 1",
    role: "teacher",
    subscriptionTier: "ultra",
    organizationId: "org_lurexa_alpha",
    unlockedModules: ["ALL"],
    status: "active",
  },
  {
    email: "teacher2@lurexa.org",
    password: "LurexaTeacher2026!",
    displayName: "Test Teacher 2",
    role: "teacher",
    subscriptionTier: "ultra",
    organizationId: "org_lurexa_alpha",
    unlockedModules: ["ALL"],
    status: "active",
  },
];

async function seedUser(auth, firestore, targetUser) {
  let uid = null;
  let isNew = false;

  try {
    const existing = await auth.getUserByEmail(targetUser.email);
    uid = existing.uid;
    await auth.updateUser(uid, {
      password: targetUser.password,
      displayName: targetUser.displayName,
      emailVerified: true,
    });
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      const created = await auth.createUser({
        email: targetUser.email,
        password: targetUser.password,
        displayName: targetUser.displayName,
        emailVerified: true,
      });
      uid = created.uid;
      isNew = true;
    } else {
      throw error;
    }
  }

  // 1. Set Custom Claims
  await auth.setCustomUserClaims(uid, {
    role: targetUser.role,
    subscriptionTier: targetUser.subscriptionTier,
    organizationId: targetUser.organizationId,
  });

  // 2. Authoritative Firestore Core /users/{uid} document
  const userDocRef = firestore.collection("users").doc(uid);
  const docSnap = await userDocRef.get();

  const profileData = {
    uid,
    id: uid,
    email: targetUser.email,
    displayName: targetUser.displayName,
    role: targetUser.role,
    subscriptionTier: targetUser.subscriptionTier,
    status: targetUser.status,
    organizationId: targetUser.organizationId,
    unlockedModules: targetUser.unlockedModules,
    updatedAt: FieldValue.serverTimestamp(),
    ...(!docSnap.exists ? { createdAt: FieldValue.serverTimestamp() } : {}),
  };

  await userDocRef.set(profileData, { merge: true });

  console.log(
    `  ${isNew ? "✓ Created" : "✓ Updated"}: ${targetUser.email} (${targetUser.role}, ${targetUser.subscriptionTier}) [UID: ${uid}]`,
  );
  return { uid, email: targetUser.email, role: targetUser.role };
}

async function run() {
  console.log("\n=======================================================");
  console.log("🌱 LUREXA TEST USER & CREDENTIAL SEEDING ENGINE");
  console.log("=======================================================\n");

  const { auth, firestore } = initFirebase();
  console.log(`Connected to Firebase project: ${auth.app.options.projectId || "default"}\n`);

  const results = [];
  for (const user of TEST_USERS) {
    const result = await seedUser(auth, firestore, user);
    results.push(result);
  }

  console.log(`\n🎉 Successfully provisioned ${results.length} test accounts with full Ultra tier access!`);
  console.log("   • 10 Students: learner1@lurexa.org -> learner10@lurexa.org");
  console.log("   • 2 Teachers:  teacher1@lurexa.org -> teacher2@lurexa.org");
  console.log("   • Organization: org_lurexa_alpha | Tier: ultra | Unlocked: [ALL]\n");
}

run().catch((err) => {
  console.error("\n❌ Fatal error seeding test users:", err);
  process.exit(1);
});

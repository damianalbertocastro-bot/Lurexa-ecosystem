import fs from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE = "FIREBASE_SERVICE_ACCOUNT_JSON";

interface FirebaseServiceAccount {
  project_id?: string;
  client_email?: string;
  private_key?: string;
}

interface ValidFirebaseServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
  filePath?: string;
}

function stripQuotes(str?: string | null): string {
  if (!str) return "";
  const trimmed = str.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export function getRawServiceAccountJson(): string | null {
  const serializedServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  return serializedServiceAccount || null;
}

function parseServiceAccountContent(content: string, filePath?: string): ValidFirebaseServiceAccount | null {
  try {
    const parsed = JSON.parse(content) as FirebaseServiceAccount;
    if (parsed.project_id && parsed.client_email && parsed.private_key) {
      return {
        project_id: parsed.project_id,
        client_email: parsed.client_email,
        private_key: parsed.private_key,
        ...(filePath ? { filePath } : {}),
      };
    }
  } catch {
    // safe fallback
  }
  return null;
}

function readServiceAccount(): ValidFirebaseServiceAccount | null {
  // 1. Check direct inline JSON environment variable
  const serializedServiceAccount = getRawServiceAccountJson();
  if (serializedServiceAccount) {
    const parsed = parseServiceAccountContent(serializedServiceAccount);
    if (parsed) return parsed;
    console.warn(`Warning: ${SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE} is not valid JSON; checking file candidates.`);
  }

  // 2. Check GOOGLE_APPLICATION_CREDENTIALS file path (strip quotes if present)
  const googleCredentialsPath = stripQuotes(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (googleCredentialsPath && fs.existsSync(googleCredentialsPath)) {
    try {
      const fileContent = fs.readFileSync(googleCredentialsPath, "utf-8");
      const parsed = parseServiceAccountContent(fileContent, googleCredentialsPath);
      if (parsed) return parsed;
    } catch {
      // safe fallback
    }
  }

  // 3. Check FIREBASE_SERVICE_ACCOUNT_PATH if provided
  const customPath = stripQuotes(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  if (customPath && fs.existsSync(customPath)) {
    try {
      const fileContent = fs.readFileSync(customPath, "utf-8");
      const parsed = parseServiceAccountContent(fileContent, customPath);
      if (parsed) return parsed;
    } catch {
      // safe fallback
    }
  }

  // 4. Check common and dynamic file locations ascending from cwd and repo root
  const fileNames = [
    "service-account.json.json",
    "service-account.json",
    "serviceAccountKey.json",
    "firebase-service-account.json",
  ];

  const searchDirs = new Set<string>();
  let currentDir = process.cwd();
  for (let i = 0; i < 6; i++) {
    searchDirs.add(currentDir);
    const parent = path.dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }
  // Explicit workspace root candidates
  searchDirs.add("C:\\Users\\damia\\lurexa");
  searchDirs.add("c:/Users/damia/lurexa");

  for (const dir of searchDirs) {
    for (const fileName of fileNames) {
      const candidate = path.resolve(dir, fileName);
      if (fs.existsSync(candidate)) {
        try {
          const fileContent = fs.readFileSync(candidate, "utf-8");
          const parsed = parseServiceAccountContent(fileContent, candidate);
          if (parsed) return parsed;
        } catch {
          // safe fallback
        }
      }
    }

    // Also check for .env.local in parent folders (e.g. monorepo root)
    const envLocalCandidate = path.resolve(dir, ".env.local");
    if (fs.existsSync(envLocalCandidate)) {
      try {
        const envContent = fs.readFileSync(envLocalCandidate, "utf-8");
        const match = envContent.match(/FIREBASE_SERVICE_ACCOUNT_JSON\s*=\s*(['"])([\s\S]*?)\1/);
        if (match && match[2]) {
          const parsed = parseServiceAccountContent(match[2]);
          if (parsed) return parsed;
        }
      } catch {
        // safe fallback
      }
    }
  }

  // 5. Check discrete individual environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    return {
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey,
    };
  }

  return null;
}

function getProjectId(serviceAccount: ValidFirebaseServiceAccount | null): string {
  return serviceAccount?.project_id
    ?? process.env.FIREBASE_PROJECT_ID
    ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ?? process.env.GCLOUD_PROJECT
    ?? "lurexa-app";
}

/**
 * Returns the Firebase Admin app used exclusively by trusted server-side Core
 * operations. Do not import this module from browser code or the root backend
 * barrel export.
 */
export function getFirebaseAdminApp(): App {
  const existingApp = getApps()[0];
  if (existingApp) return existingApp;

  const serviceAccount = readServiceAccount();
  const projectId = getProjectId(serviceAccount);
  const isFirestoreEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);

  if (serviceAccount) {
    // Keep environment aligned so Google Cloud SDKs and google-auth-library
    // can authenticate without ADC ("Could not load the default credentials") errors.
    if (serviceAccount.filePath && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccount.filePath;
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = stripQuotes(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    }
    if (!process.env.GCLOUD_PROJECT) {
      process.env.GCLOUD_PROJECT = serviceAccount.project_id;
    }
    if (!process.env.FIREBASE_PROJECT_ID) {
      process.env.FIREBASE_PROJECT_ID = serviceAccount.project_id;
    }

    return initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
      }),
      projectId: serviceAccount.project_id,
    });
  }

  if (isFirestoreEmulator || process.env.NODE_ENV !== "production" || projectId) {
    return initializeApp({ projectId });
  }

  throw new Error(
    `${SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE} must be configured for trusted Firebase Admin operations outside the Firestore Emulator.`,
  );
}

export function getServerFirestore(): Firestore {
  return getFirestore(getFirebaseAdminApp());
}

export function getServerFirebaseAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}

export function getServerStorageBucket() {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucketName) {
    throw new Error("FIREBASE_STORAGE_BUCKET must be configured for trusted spoken-evidence storage.");
  }
  return getStorage(getFirebaseAdminApp()).bucket(bucketName);
}

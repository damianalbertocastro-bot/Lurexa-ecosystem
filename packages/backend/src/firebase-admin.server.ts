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
}

export function getRawServiceAccountJson(): string | null {
  const serializedServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  return serializedServiceAccount || null;
}

function readServiceAccount(): ValidFirebaseServiceAccount | null {
  const serializedServiceAccount = getRawServiceAccountJson();

  if (!serializedServiceAccount) return null;

  let parsedServiceAccount: unknown;
  try {
    parsedServiceAccount = JSON.parse(serializedServiceAccount);
  } catch {
    throw new Error(`${SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE} must contain valid JSON.`);
  }

  if (
    typeof parsedServiceAccount !== "object"
    || parsedServiceAccount === null
    || Array.isArray(parsedServiceAccount)
  ) {
    throw new Error(`${SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE} must contain a service-account object.`);
  }

  const serviceAccount = parsedServiceAccount as FirebaseServiceAccount;
  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error(
      `${SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE} must include project_id, client_email, and private_key.`,
    );
  }

  return {
    project_id: serviceAccount.project_id,
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  };
}

function getProjectId(serviceAccount: ValidFirebaseServiceAccount | null): string | undefined {
  return serviceAccount?.project_id
    ?? process.env.FIREBASE_PROJECT_ID
    ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
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
    return initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
      }),
      projectId: serviceAccount.project_id,
    });
  }

  if (isFirestoreEmulator && projectId) {
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

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, Auth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:demo",
};

// Initialize Firebase Client App (Singleton)
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

const useFirebaseEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";

if (useFirebaseEmulator && typeof window !== "undefined") {
  const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || "127.0.0.1";
  const authEmulatorPort = Number(process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT || "9099");
  const firestoreEmulatorPort = Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || "8080");

  connectAuthEmulator(auth, `http://${emulatorHost}:${authEmulatorPort}`, {
    disableWarnings: true,
  });
  connectFirestoreEmulator(db, emulatorHost, firestoreEmulatorPort);
}

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

export interface CustomUserClaims {
  orgId?: string;
  role?: "student" | "teacher" | "admin" | "super_admin";
}

export const AuthService = {
  async login(email: string, pass: string): Promise<FirebaseUser> {
    const credential = await signInWithEmailAndPassword(auth, email, pass);
    return credential.user;
  },

  async register(email: string, pass: string): Promise<FirebaseUser> {
    const credential = await createUserWithEmailAndPassword(auth, email, pass);
    return credential.user;
  },

  async logout(): Promise<void> {
    await firebaseSignOut(auth);
  },

  onUserChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async getUserClaims(user: FirebaseUser): Promise<CustomUserClaims> {
    const tokenResult = await user.getIdTokenResult(true);
    return {
      orgId: tokenResult.claims.orgId as string | undefined,
      role: tokenResult.claims.role as CustomUserClaims["role"],
    };
  },
};
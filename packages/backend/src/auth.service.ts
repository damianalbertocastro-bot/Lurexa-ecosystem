import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  deleteUser,
  User as FirebaseUser,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

export type AuthenticatedUser = FirebaseUser;

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

  async loginGuest(): Promise<FirebaseUser | { uid: string; isAnonymous: boolean; email: null }> {
    try {
      const credential = await signInAnonymously(auth);
      return credential.user;
    } catch {
      // Fallback for mock/local environments without Firebase Anonymous auth enabled
      const guestSession = {
        uid: `guest-temporal-${Date.now()}`,
        isAnonymous: true,
        email: null,
      };
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("lurexa.coach.guest-session", JSON.stringify({
          isGuest: true,
          uid: guestSession.uid,
          lessonsCompleted: 0,
          createdAt: new Date().toISOString(),
        }));
      }
      return guestSession;
    }
  },

  isGuestUser(user?: FirebaseUser | { isAnonymous?: boolean } | null): boolean {
    if (user?.isAnonymous) return true;
    if (typeof window !== "undefined") {
      try {
        const guestData = window.sessionStorage.getItem("lurexa.coach.guest-session");
        if (guestData) {
          const parsed = JSON.parse(guestData) as { isGuest?: boolean };
          return Boolean(parsed.isGuest);
        }
      } catch {
        return false;
      }
    }
    return false;
  },

  async deleteCurrentUser(): Promise<void> {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("lurexa.coach.guest-session");
    }
    if (auth.currentUser && auth.currentUser.isAnonymous) {
      try {
        await deleteUser(auth.currentUser);
      } catch {
        await firebaseSignOut(auth);
      }
    } else {
      await firebaseSignOut(auth);
    }
  },

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("lurexa.coach.guest-session");
    }
    await firebaseSignOut(auth);
  },

  onUserChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  async getUserClaims(user: FirebaseUser): Promise<CustomUserClaims> {
    const tokenResult = await user.getIdTokenResult(true);
    return {
      orgId: tokenResult.claims.orgId as string | undefined,
      role: tokenResult.claims.role as CustomUserClaims["role"],
    };
  },
};
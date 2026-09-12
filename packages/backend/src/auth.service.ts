import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithCustomToken,
  signOut as firebaseSignOut,
  deleteUser,
  User as FirebaseUser,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  getAdditionalUserInfo,
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

  async loginWithGoogle(): Promise<{ user: FirebaseUser; isNewUser: boolean }> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const credential = await signInWithPopup(auth, provider);
    const user = credential.user;
    const additionalInfo = getAdditionalUserInfo(credential);
    const isNewUser = Boolean(additionalInfo?.isNewUser);

    if (user) {
      try {
        const { UserService } = await import("./user.service");
        const existingProfile = await UserService.getUserProfile(user.uid);
        if (!existingProfile) {
          const names = (user.displayName || "").trim().split(" ");
          const firstName = names[0] || undefined;
          const lastName = names.slice(1).join(" ") || undefined;
          await UserService.updateUserProfile(user.uid, {
            id: user.uid,
            email: user.email || "",
            displayName: user.displayName || "Learner",
            firstName,
            lastName,
            avatarUrl: user.photoURL || undefined,
            role: "student",
          });
        }
      } catch (profileError) {
        console.warn("Non-fatal: failed to seed profile for Google user", profileError);
      }
    }

    return { user, isNewUser };
  },

  async linkGoogleToCurrentUser(): Promise<FirebaseUser> {
    if (!auth.currentUser) {
      throw new Error("No active user session to link Google credential to.");
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const credential = await linkWithPopup(auth.currentUser, provider);
    return credential.user;
  },

  isPopupDismissedError(error: unknown): boolean {
    if (typeof error === "object" && error !== null && "code" in error) {
      const code = String((error as { code?: unknown }).code);
      return code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request";
    }
    return false;
  },

  async loginGuest(): Promise<FirebaseUser | { uid: string; isAnonymous: boolean; email: null }> {
    try {
      if (typeof window !== "undefined") {
        const response = await fetch("/api/coach/guest", { method: "POST" });
        if (response.ok) {
          const { customToken, guestSession } = await response.json();
          if (customToken) {
            const credential = await signInWithCustomToken(auth, customToken);
            window.sessionStorage.setItem("lurexa.coach.guest-session", JSON.stringify(guestSession));
            return credential.user;
          }
          if (guestSession) {
            window.sessionStorage.setItem("lurexa.coach.guest-session", JSON.stringify(guestSession));
            return { uid: guestSession.uid, isAnonymous: true, email: null };
          }
        }
      }
    } catch {
      // Continue to client Firebase Anonymous sign-in attempt
    }

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
          maxAllowedLessons: 1,
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
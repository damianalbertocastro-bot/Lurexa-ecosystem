import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "./firebase";
import type { UserProfileDetails } from "@lurexa/types";

const getStorageKey = (userId: string) => `lurexa_user_profile_${userId}`;

export const UserService = {
  /**
   * Retrieves user profile details from Firestore with localStorage fallback caching.
   */
  async getUserProfile(userId: string): Promise<UserProfileDetails | null> {
    if (!userId) return null;

    // 1. Try fetching from Firestore
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const profile: UserProfileDetails = {
          id: userId,
          email: data.email || auth.currentUser?.email || "",
          displayName: data.displayName || auth.currentUser?.displayName || "Learner",
          firstName: data.firstName || undefined,
          lastName: data.lastName || undefined,
          phone: data.phone || undefined,
          avatarUrl: data.avatarUrl || auth.currentUser?.photoURL || undefined,
          targetCefrLevel: data.targetCefrLevel || undefined,
          primaryGoal: data.primaryGoal || undefined,
          preferredAccent: data.preferredAccent || undefined,
          interests: Array.isArray(data.interests) ? data.interests : undefined,
          nativeLanguage: data.nativeLanguage || undefined,
          dailyTargetMinutes: typeof data.dailyTargetMinutes === "number" ? data.dailyTargetMinutes : undefined,
          role: data.role || undefined,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        };

        // Cache locally for offline resilience
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(getStorageKey(userId), JSON.stringify(profile));
          } catch {
            // safe ignore storage quota errors
          }
        }

        return profile;
      }
    } catch {
      // safe fallback to cache
    }

    // 2. Fallback to localStorage cache
    if (typeof window !== "undefined") {
      try {
        const cached = window.localStorage.getItem(getStorageKey(userId));
        if (cached) {
          return JSON.parse(cached) as UserProfileDetails;
        }

        // Generic fallback cache from onboarding/signup
        const generalSignupProfile = window.localStorage.getItem("lurexa_user_profile");
        if (generalSignupProfile) {
          const parsed = JSON.parse(generalSignupProfile) as { firstName?: string; lastName?: string; phone?: string };
          const fallbackProfile: UserProfileDetails = {
            id: userId,
            email: auth.currentUser?.email || "",
            displayName: [parsed.firstName, parsed.lastName].filter(Boolean).join(" ") || auth.currentUser?.displayName || "Learner",
            firstName: parsed.firstName,
            lastName: parsed.lastName,
            phone: parsed.phone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return fallbackProfile;
        }
      } catch {
        // safe ignore
      }
    }

    // 3. Fallback from current auth user
    if (auth.currentUser && auth.currentUser.uid === userId) {
      return {
        id: userId,
        email: auth.currentUser.email || "",
        displayName: auth.currentUser.displayName || "Learner",
        avatarUrl: auth.currentUser.photoURL || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return null;
  },

  /**
   * Updates user profile in Firestore, syncs Firebase Auth displayName, and updates localStorage cache.
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfileDetails>): Promise<UserProfileDetails> {
    if (!userId) throw new Error("User ID is required to update profile.");

    const existing = await this.getUserProfile(userId);
    const now = new Date().toISOString();

    const merged: UserProfileDetails = {
      id: userId,
      email: updates.email || existing?.email || auth.currentUser?.email || "",
      displayName: updates.displayName || existing?.displayName || [updates.firstName, updates.lastName].filter(Boolean).join(" ") || "Learner",
      firstName: updates.firstName !== undefined ? updates.firstName : existing?.firstName,
      lastName: updates.lastName !== undefined ? updates.lastName : existing?.lastName,
      phone: updates.phone !== undefined ? updates.phone : existing?.phone,
      avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : existing?.avatarUrl,
      targetCefrLevel: updates.targetCefrLevel !== undefined ? updates.targetCefrLevel : existing?.targetCefrLevel,
      primaryGoal: updates.primaryGoal !== undefined ? updates.primaryGoal : existing?.primaryGoal,
      preferredAccent: updates.preferredAccent !== undefined ? updates.preferredAccent : existing?.preferredAccent,
      interests: updates.interests !== undefined ? updates.interests : existing?.interests,
      nativeLanguage: updates.nativeLanguage !== undefined ? updates.nativeLanguage : existing?.nativeLanguage,
      dailyTargetMinutes: updates.dailyTargetMinutes !== undefined ? updates.dailyTargetMinutes : existing?.dailyTargetMinutes,
      role: updates.role !== undefined ? updates.role : existing?.role,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    // 1. Sync with Firebase Auth if currentUser displayName changed
    if (auth.currentUser && updates.displayName && auth.currentUser.displayName !== updates.displayName) {
      try {
        await updateProfile(auth.currentUser, { displayName: updates.displayName });
      } catch {
        // non-blocking
      }
    }

    // 2. Persist to Firestore
    try {
      await setDoc(doc(db, "users", userId), merged, { merge: true });
    } catch {
      // offline fallback
    }

    // 3. Cache locally
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(getStorageKey(userId), JSON.stringify(merged));
      } catch {
        // safe ignore
      }
    }

    return merged;
  },
};

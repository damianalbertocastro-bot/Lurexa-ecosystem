"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthService, TeachService } from "@lurexa/backend";
import type { AuthenticatedUser } from "@lurexa/backend";
import type { EducatorProfile } from "@lurexa/types";

type TeachAuthContextValue = {
  user: AuthenticatedUser | null;
  profile: EducatorProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
};

const TeachAuthContext = createContext<TeachAuthContextValue | null>(null);

export function TeachAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [profile, setProfile] = useState<EducatorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (activeUser: AuthenticatedUser) => {
    let nextProfile = await TeachService.getEducatorProfile(activeUser.uid);
    if (!nextProfile) {
      const timestamp = new Date().toISOString();
      nextProfile = {
        userId: activeUser.uid,
        displayName: activeUser.displayName || activeUser.email?.split("@")[0] || "Educator",
        interests: [],
        goals: [],
        competencies: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      await TeachService.upsertEducatorProfile(nextProfile);
    }
    setProfile(nextProfile);
  }, []);

  useEffect(() => AuthService.onUserChanged(async (nextUser) => {
    setUser(nextUser);
    setProfile(null);
    try {
      if (nextUser) await loadProfile(nextUser);
    } finally {
      setLoading(false);
    }
  }), [loadProfile]);

  const value = useMemo<TeachAuthContextValue>(() => ({
    user,
    profile,
    loading,
    refreshProfile: async () => { if (user) await loadProfile(user); },
    logout: async () => { await AuthService.logout(); },
  }), [user, profile, loading, loadProfile]);

  return <TeachAuthContext.Provider value={value}>{children}</TeachAuthContext.Provider>;
}

export function useTeachAuth() {
  const context = useContext(TeachAuthContext);
  if (!context) throw new Error("useTeachAuth must be used within TeachAuthProvider");
  return context;
}

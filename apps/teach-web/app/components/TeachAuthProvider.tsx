"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthService } from "@lurexa/backend";
import type { AuthenticatedUser } from "@lurexa/backend";
import type { EducatorProfile } from "@lurexa/types";

type TeachAuthContextValue = {
  user: AuthenticatedUser | null;
  profile: EducatorProfile | null;
  canAccessTeach: boolean;
  isPendingApproval: boolean;
  isRejected: boolean;
  isApprover: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  requestAccess: () => Promise<void>;
  logout: () => Promise<void>;
};

const TeachAuthContext = createContext<TeachAuthContextValue | null>(null);

export function TeachAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [profile, setProfile] = useState<EducatorProfile | null>(null);
  const [canAccessTeach, setCanAccessTeach] = useState(false);
  const [isApprover, setIsApprover] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (activeUser: AuthenticatedUser) => {
    try {
      const token = await activeUser.getIdToken();
      const response = await fetch("/api/teach/approval", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (response.ok) {
        const data = (await response.json()) as {
          profile: EducatorProfile;
          canAccessTeach: boolean;
          isApprover: boolean;
        };
        setProfile(data.profile);
        setCanAccessTeach(data.canAccessTeach);
        setIsApprover(data.isApprover);
      } else {
        setCanAccessTeach(false);
      }
    } catch {
      setCanAccessTeach(false);
    }
  }, []);

  const requestAccess = useCallback(async () => {
    if (!user) return;
    const token = await user.getIdToken();
    const response = await fetch("/api/teach/approval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "requestAccess" }),
    });
    if (response.ok) {
      await loadProfile(user);
    }
  }, [user, loadProfile]);

  useEffect(() => AuthService.onUserChanged(async (nextUser) => {
    setUser(nextUser);
    setProfile(null);
    setCanAccessTeach(false);
    setIsApprover(false);
    try {
      if (nextUser) await loadProfile(nextUser);
    } finally {
      setLoading(false);
    }
  }), [loadProfile]);

  const value = useMemo<TeachAuthContextValue>(() => ({
    user,
    profile,
    canAccessTeach,
    isPendingApproval: profile?.status === "pending_approval",
    isRejected: profile?.status === "rejected",
    isApprover,
    loading,
    refreshProfile: async () => { if (user) await loadProfile(user); },
    requestAccess,
    logout: async () => { await AuthService.logout(); },
  }), [user, profile, canAccessTeach, isApprover, loading, loadProfile, requestAccess]);

  return <TeachAuthContext.Provider value={value}>{children}</TeachAuthContext.Provider>;
}

export function useTeachAuth() {
  const context = useContext(TeachAuthContext);
  if (!context) throw new Error("useTeachAuth must be used within TeachAuthProvider");
  return context;
}


"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService, UserService, type AuthenticatedUser } from "@lurexa/backend";
import { ProductShell } from "../components/ProductShell";
import {
  StandardProfileView,
  type StandardProfileData,
} from "@lurexa/ui/StandardProfileView";
import { getEcosystemUrl } from "@lurexa/config/domains";

export default function LearnProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<StandardProfileData | null>(null);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await UserService.getUserProfile(user.uid);
          if (profile) {
            setProfileData({
              id: profile.id,
              email: profile.email,
              displayName: profile.displayName,
              firstName: profile.firstName,
              lastName: profile.lastName,
              phone: profile.phone,
              avatarUrl: profile.avatarUrl,
              targetCefrLevel: profile.targetCefrLevel || "B1",
              primaryGoal: profile.primaryGoal || "daily_conversation",
              preferredAccent: profile.preferredAccent || "dominican",
              interests: profile.interests,
              role: profile.role || "student",
              accountTypeLabel: "LEARNER ACCOUNT",
            });
          } else {
            setProfileData({
              id: user.uid,
              email: user.email || "",
              displayName: user.displayName || "Learner",
              targetCefrLevel: "B1",
              primaryGoal: "daily_conversation",
              preferredAccent: "dominican",
              role: "student",
              accountTypeLabel: "LEARNER ACCOUNT",
            });
          }
        } catch {
          setProfileData({
            id: user.uid,
            email: user.email || "",
            displayName: user.displayName || "Learner",
            role: "student",
            accountTypeLabel: "LEARNER ACCOUNT",
          });
        }
      } else {
        router.replace("/login?continue=/profile");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSaveProfile = async (updated: Partial<StandardProfileData>) => {
    if (!currentUser) return;
    const result = await UserService.updateUserProfile(currentUser.uid, {
      displayName: updated.displayName,
      firstName: updated.firstName,
      lastName: updated.lastName,
      phone: updated.phone,
      targetCefrLevel: updated.targetCefrLevel,
      primaryGoal: updated.primaryGoal,
      preferredAccent: updated.preferredAccent,
      interests: updated.interests,
    });
    setProfileData((prev) => (prev ? { ...prev, ...result } : null));
  };

  const handleSignOut = async () => {
    await AuthService.logout();
    router.replace("/login");
  };

  if (loading) {
    return (
      <ProductShell area="Learner space" homeHref="/dashboard" product="learn">
        <main className="mx-auto max-w-6xl px-4 py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="mt-4 text-sm font-semibold text-[var(--lx-muted)]">Loading learner profile...</p>
        </main>
      </ProductShell>
    );
  }

  if (!profileData) {
    return null;
  }

  const coachUrl = getEcosystemUrl("coach");
  const teachUrl = getEcosystemUrl("teach");

  return (
    <ProductShell area="Learner space" homeHref="/dashboard" product="learn">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <StandardProfileView
          profile={profileData}
          userType="student"
          onSaveProfile={handleSaveProfile}
          onSignOut={handleSignOut}
          ecosystemLinks={[
            {
              label: "Practice Spoken English on Lurexa Coach",
              href: `${coachUrl}/dashboard`,
              icon: "🎙️",
            },
            {
              label: "Explore Educator Opportunities on Lurexa Teach",
              href: `${teachUrl}/dashboard`,
              icon: "🎓",
            },
          ]}
          stats={[
            {
              label: "Target Level",
              value: profileData.targetCefrLevel || "B1",
              description: "Target CEFR proficiency",
            },
            {
              label: "Daily Practice",
              value: "20 min",
              description: "Recommended daily study commitment",
            },
            {
              label: "Accent Focus",
              value:
                profileData.preferredAccent === "dominican"
                  ? "Dominican Transfer"
                  : profileData.preferredAccent === "general_american"
                    ? "General American"
                    : profileData.preferredAccent === "british"
                      ? "British English"
                      : "Neutral International",
              description: "L1 transfer acoustic modeling",
            },
          ]}
        />
      </main>
    </ProductShell>
  );
}

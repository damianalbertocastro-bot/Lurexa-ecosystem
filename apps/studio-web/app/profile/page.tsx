"use client";

import React, { useEffect, useState } from "react";
import { AuthService, UserService, type AuthenticatedUser } from "@lurexa/backend";
import { StudioShell } from "../components/StudioShell";
import {
  StandardProfileView,
  type StandardProfileData,
} from "@lurexa/ui/StandardProfileView";
import { getEcosystemUrl } from "@lurexa/config/domains";

export default function StudioProfilePage() {
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
              headline: "Curriculum Architect · Lurexa Studio",
              targetCefrLevel: profile.targetCefrLevel || "C1",
              currentCefrLevel: "C2",
              primaryGoal: profile.primaryGoal || "curriculum_design",
              interests: profile.interests || ["CEFR Alignment", "Task Design", "Phonetics"],
              role: profile.role || "author",
              accountTypeLabel: "STUDIO AUTHOR WORKSPACE",
            });
          } else {
            setProfileData({
              id: user.uid,
              email: user.email || "",
              displayName: user.displayName || "Content Author",
              headline: "Curriculum Architect · Lurexa Studio",
              targetCefrLevel: "C1",
              currentCefrLevel: "C2",
              primaryGoal: "curriculum_design",
              interests: ["CEFR Alignment", "Task Design", "Phonetics"],
              role: "author",
              accountTypeLabel: "STUDIO AUTHOR WORKSPACE",
            });
          }
        } catch {
          setProfileData({
            id: user.uid,
            email: user.email || "",
            displayName: user.displayName || "Content Author",
            headline: "Curriculum Architect · Lurexa Studio",
            targetCefrLevel: "C1",
            currentCefrLevel: "C2",
            role: "author",
            accountTypeLabel: "STUDIO AUTHOR WORKSPACE",
          });
        }
      } else {
        // Fallback for unauthenticated/demo Studio author
        setProfileData({
          id: "author-demo",
          email: "author@lurexa.internal",
          displayName: "Curriculum Designer",
          headline: "Author & Pedagogical Content Architect",
          targetCefrLevel: "C2",
          currentCefrLevel: "C2",
          primaryGoal: "pedagogy_authoring",
          interests: ["A1-C2 Progression", "Dominican Spanish Transfer", "Spoken Interaction"],
          role: "author",
          accountTypeLabel: "STUDIO AUTHOR WORKSPACE",
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async (updated: Partial<StandardProfileData>) => {
    if (currentUser) {
      const result = await UserService.updateUserProfile(currentUser.uid, {
        displayName: updated.displayName,
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
        targetCefrLevel: updated.targetCefrLevel,
        primaryGoal: updated.primaryGoal,
        interests: updated.interests,
      });
      setProfileData((prev) => (prev ? { ...prev, ...result } : null));
    } else {
      setProfileData((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const handleSignOut = async () => {
    try {
      await AuthService.logout();
    } catch {
      // safe ignore
    }
  };

  if (loading) {
    return (
      <StudioShell active="Profile">
        <main className="mx-auto max-w-6xl px-4 py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="mt-4 text-sm font-semibold text-[var(--lx-muted)]">Loading author profile...</p>
        </main>
      </StudioShell>
    );
  }

  if (!profileData) return null;

  const teachUrl = getEcosystemUrl("teach");
  const learnUrl = getEcosystemUrl("learn");

  return (
    <StudioShell active="Profile">
      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 space-y-8">
        <StandardProfileView
          profile={profileData}
          userType="educator"
          onSaveProfile={handleSaveProfile}
          onSignOut={handleSignOut}
          ecosystemLinks={[
            {
              label: "Author New Knowledge Asset in Studio",
              href: "/author",
              icon: "✍️",
            },
            {
              label: "Inspect Governed Catalog & Schema",
              href: "/catalog",
              icon: "🗄️",
            },
            {
              label: "Run CEFR Alignment Linter",
              href: "/linter",
              icon: "📐",
            },
            {
              label: "Lurexa Teach Educator Hub",
              href: `${teachUrl}/dashboard`,
              icon: "🎓",
            },
            {
              label: "Lurexa Learn Interactive System",
              href: `${learnUrl}/dashboard`,
              icon: "📚",
            },
          ]}
          stats={[
            {
              label: "Role",
              value: "Curriculum Architect",
              description: "Governed asset authoring & design",
            },
            {
              label: "CEFR Target",
              value: profileData.targetCefrLevel || "C1",
              description: "Target pedagogical depth",
            },
            {
              label: "Pipeline",
              value: "Core Governed v1",
              description: "Immutable content validation",
            },
          ]}
        />
      </main>
    </StudioShell>
  );
}

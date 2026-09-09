"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService, OrganizationService, UserService, type AuthenticatedUser } from "@lurexa/backend";
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
  const [isEducator, setIsEducator] = useState(false);
  const [profileData, setProfileData] = useState<StandardProfileData | null>(null);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const [profile, memberships] = await Promise.all([
            UserService.getUserProfile(user.uid),
            OrganizationService.getMembershipsForUser(user.uid),
          ]);
          const educatorRole =
            memberships.some((m) => ["owner", "admin", "teacher"].includes(m.role)) ||
            profile?.role === "teacher" ||
            profile?.role === "admin";

          setIsEducator(educatorRole);

          if (educatorRole) {
            const rawProfile = profile as Record<string, unknown> | null;
            setProfileData({
              id: profile?.id ?? user.uid,
              email: profile?.email ?? user.email ?? "",
              displayName: profile?.displayName ?? user.displayName ?? "Educator",
              firstName: profile?.firstName,
              lastName: profile?.lastName,
              phone: profile?.phone,
              avatarUrl: profile?.avatarUrl,
              headline: (rawProfile?.headline as string) || "English Educator · Speaking & Pronunciation Instruction",
              currentCefrLevel: (rawProfile?.currentCefrLevel as string) || "C1",
              targetCefrLevel: profile?.targetCefrLevel || "C2",
              teachingExperienceYears: typeof rawProfile?.teachingExperienceYears === "number" ? rawProfile.teachingExperienceYears : 3,
              interests: profile?.interests && profile.interests.length > 0 ? profile.interests : ["Speaking Pedagogy", "Contrastive Phonetics", "AI Scaffolding"],
              goals: (rawProfile?.goals as string[]) || ["Attain C1 Certification", "Lurexa Teach Credential"],
              role: "teacher",
              accountTypeLabel: "EDUCATOR PROFILE (LUREXA TEACH)",
            });
          } else if (profile) {
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
      ...(isEducator
        ? {
            headline: updated.headline,
            currentCefrLevel: updated.currentCefrLevel,
            teachingExperienceYears: updated.teachingExperienceYears,
            goals: updated.goals,
          }
        : {}),
    } as Parameters<typeof UserService.updateUserProfile>[1]);
    setProfileData((prev) => (prev ? { ...prev, ...result, ...updated } : null));
  };

  const handleSignOut = async () => {
    await AuthService.logout();
    router.replace("/login");
  };

  if (loading) {
    return (
      <ProductShell area={isEducator ? "Educator space" : "Learner space"} homeHref={isEducator ? "/teacher/dashboard" : "/dashboard"} product="learn">
        <main className="mx-auto max-w-6xl px-4 py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="mt-4 text-sm font-semibold text-[var(--lx-muted)]">
            {isEducator ? "Loading educator profile..." : "Loading learner profile..."}
          </p>
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
    <ProductShell area={isEducator ? "Educator space" : "Learner space"} homeHref={isEducator ? "/teacher/dashboard" : "/dashboard"} product="learn">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <StandardProfileView
          profile={profileData}
          userType={isEducator ? "educator" : "student"}
          onSaveProfile={handleSaveProfile}
          onSignOut={handleSignOut}
          ecosystemLinks={
            isEducator
              ? [
                  {
                    label: "Explore Educator Growth & Certifications on Lurexa Teach",
                    href: `${teachUrl}/dashboard`,
                    icon: "🎓",
                  },
                  {
                    label: "Manage Class Roster & Courses in Educator Workspace",
                    href: "/teacher/dashboard",
                    icon: "🏫",
                  },
                  {
                    label: "Practice Spoken English on Lurexa Coach",
                    href: `${coachUrl}/dashboard`,
                    icon: "🎙️",
                  },
                ]
              : [
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
                ]
          }
          stats={
            isEducator
              ? [
                  {
                    label: "Target Proficiency",
                    value: profileData.currentCefrLevel || "C1",
                    description: "Verified Language Proficiency",
                  },
                  {
                    label: "Teaching Experience",
                    value: `${profileData.teachingExperienceYears ?? 3} yrs`,
                    description: "Classroom & Online Instruction",
                  },
                  {
                    label: "Professional Track",
                    value: "Teach Master",
                    description: "Active Lurexa Teach Growth Pathway",
                  },
                ]
              : [
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
                ]
          }
        />
      </main>
    </ProductShell>
  );
}

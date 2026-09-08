"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CoachShell } from "../components/CoachShell";
import { Card } from "@lurexa/ui/Card";
import { ProgressBar } from "@lurexa/ui/ProgressBar";
import { Badge } from "@lurexa/ui/Badge";
import { AuthService, UserService, type AuthenticatedUser } from "@lurexa/backend";
import {
  StandardProfileView,
  type StandardProfileData,
} from "@lurexa/ui/StandardProfileView";
import { resolveLurexaPublicUrls } from "@lurexa/config/product-urls";

export default function CoachProfilePage() {
  const router = useRouter();
  const urls = resolveLurexaPublicUrls();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [profileData, setProfileData] = useState<StandardProfileData | null>(null);
  const [turnsCount, setTurnsCount] = useState(14);
  const [intelligibility] = useState(78);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = AuthService.onUserChanged(async (currentUser) => {
      setUser(currentUser);
      const guest = AuthService.isGuestUser(currentUser);
      setIsGuest(guest);

      if (currentUser) {
        try {
          const profile = await UserService.getUserProfile(currentUser.uid);
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
              role: profile.role || (guest ? "guest" : "student"),
              accountTypeLabel: guest ? "GUEST COACH SESSION" : "SPEAKING & PRONUNCIATION PROFILE",
            });
          } else {
            setProfileData({
              id: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || (guest ? "Guest Learner" : "Learner"),
              targetCefrLevel: "B1",
              primaryGoal: "daily_conversation",
              preferredAccent: "dominican",
              role: guest ? "guest" : "student",
              accountTypeLabel: guest ? "GUEST COACH SESSION" : "SPEAKING & PRONUNCIATION PROFILE",
            });
          }
        } catch {
          setProfileData({
            id: currentUser.uid,
            email: currentUser.email || "",
            displayName: currentUser.displayName || (guest ? "Guest Learner" : "Learner"),
            role: guest ? "guest" : "student",
            accountTypeLabel: guest ? "GUEST COACH SESSION" : "SPEAKING & PRONUNCIATION PROFILE",
          });
        }
      } else {
        router.replace("/login?continue=/profile");
      }
      setLoading(false);
    });

    // Try reading stored turns or preferences
    if (typeof window !== "undefined") {
      try {
        const guestData = window.sessionStorage.getItem("lurexa.coach.guest-session");
        if (guestData) {
          const parsed = JSON.parse(guestData) as { lessonsCompleted?: number };
          if (parsed.lessonsCompleted) {
            setTurnsCount(parsed.lessonsCompleted * 8);
          }
        }
      } catch {
        // safe
      }
    }

    return () => unsub();
  }, [router]);

  const handleSaveProfile = async (updated: Partial<StandardProfileData>) => {
    if (!user) return;
    const result = await UserService.updateUserProfile(user.uid, {
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
    router.push("/login");
  };

  if (loading) {
    return (
      <CoachShell active="Profile">
        <main className="mx-auto max-w-6xl px-4 py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="mt-4 text-sm font-semibold text-[var(--lx-muted)]">Loading speaking profile...</p>
        </main>
      </CoachShell>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <CoachShell active="Profile">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <StandardProfileView
          profile={profileData}
          userType="student"
          onSaveProfile={handleSaveProfile}
          onSignOut={handleSignOut}
          ecosystemLinks={[
            {
              label: "Practice English in Speaking Studio",
              href: "/practice",
              icon: "🎙️",
            },
            {
              label: "Pronunciation Phoneme Calibration",
              href: "/pronunciation",
              icon: "🗣️",
            },
            {
              label: "Lurexa Learn Interactive Dashboard",
              href: `${urls.learn}/dashboard`,
              icon: "📚",
            },
          ]}
          stats={[
            {
              label: "Intelligibility",
              value: `${intelligibility}%`,
              description: "Dominican L1 acoustic clarity",
            },
            {
              label: "Speech Turns",
              value: turnsCount,
              description: "Total spoken utterances logged",
            },
            {
              label: "Target Level",
              value: profileData.targetCefrLevel || "B1",
              description: "Spoken CEFR target",
            },
          ]}
        >
          {/* Coach Acoustic Metrics Section */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 pt-2">
            <Card
              title="Acoustic Intelligibility"
              subtitle="Dominican Spanish L1 Speech Model"
              className="flex flex-col justify-between border-[var(--lx-border)] bg-[var(--lx-surface)]"
            >
              <div className="space-y-3 pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-black dark:text-white">
                    {intelligibility}%
                  </span>
                  <span className="text-xs font-bold text-emerald-600">Communicative Ease</span>
                </div>
                <ProgressBar value={intelligibility} />
                <p className="text-[11px] leading-relaxed text-black dark:text-slate-200 font-medium">
                  High clarity on vowel centers. Focus on terminal consonant releases (/t/, /d/) and onset s-clusters.
                </p>
              </div>
            </Card>

            <Card
              title="Speech Turns & History"
              subtitle="Spoken Practice Volume"
              className="flex flex-col justify-between border-[var(--lx-border)] bg-[var(--lx-surface)]"
            >
              <div className="space-y-3 pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-black dark:text-white">
                    {turnsCount}
                  </span>
                  <span className="text-xs font-bold text-[var(--lx-primary)]">Turns Logged</span>
                </div>
                <p className="text-[11px] leading-relaxed text-black dark:text-slate-200 font-medium">
                  Consistent daily spoken retrieval reinforces neural articulation patterns.
                </p>
                <Link
                  href="/history"
                  className="mt-2 inline-flex items-center text-xs font-bold text-[var(--lx-primary)] hover:underline"
                >
                  View Speaking History →
                </Link>
              </div>
            </Card>
          </div>
        </StandardProfileView>
      </main>
    </CoachShell>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { Badge } from "@lurexa/ui/Badge";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { Button } from "@lurexa/ui/button";
import { AuthService, UserService, type AuthenticatedUser } from "@lurexa/backend";
import {
  StandardProfileView,
  type StandardProfileData,
} from "@lurexa/ui/StandardProfileView";
import { getEcosystemUrl } from "@lurexa/config/domains";

export default function AdminProfilePage() {
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
              displayName: profile.displayName || "Superadministrator",
              firstName: profile.firstName,
              lastName: profile.lastName,
              phone: profile.phone,
              avatarUrl: profile.avatarUrl,
              headline: "Ecosystem Master Administrator · Lurexa Core",
              role: "superadmin",
              accountTypeLabel: "ECOSYSTEM SUPERADMINISTRATOR",
            });
          } else {
            setProfileData({
              id: user.uid,
              email: user.email || "admin@lurexa.internal",
              displayName: user.displayName || "Superadministrator",
              headline: "Ecosystem Master Administrator · Lurexa Core",
              role: "superadmin",
              accountTypeLabel: "ECOSYSTEM SUPERADMINISTRATOR",
            });
          }
        } catch {
          setProfileData({
            id: user.uid,
            email: user.email || "admin@lurexa.internal",
            displayName: user.displayName || "Superadministrator",
            headline: "Ecosystem Master Administrator · Lurexa Core",
            role: "superadmin",
            accountTypeLabel: "ECOSYSTEM SUPERADMINISTRATOR",
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
    });
    setProfileData((prev) => (prev ? { ...prev, ...result } : null));
  };

  const handleSignOut = async () => {
    await AuthService.logout();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="grid min-h-screen place-items-center bg-[var(--lx-canvas)] px-5 text-center text-sm font-bold text-[var(--lx-muted)]"
      >
        Loading administrator profile…
      </div>
    );
  }

  if (!profileData) return null;

  const teachUrl = getEcosystemUrl("teach");
  const learnUrl = getEcosystemUrl("learn");

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)]">
      {/* Header */}
      <section className="border-b border-white/10 bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--color-brand-navy-light)] to-[var(--lx-secondary)] text-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <Link href="/" className="rounded-xl" aria-label="Lurexa Admin landing page">
              <ProductMark product="admin" inverse />
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">Superadmin</Badge>
              <Link
                href="/dashboard"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Overview
              </Link>
              <Link
                href="/users"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Users &amp; Profiles
              </Link>
              <Link
                href="/tools"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Ecosystem Tools
              </Link>
              <Link
                href="/data-management"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-rose-200 transition hover:bg-rose-500/20 hover:text-white"
              >
                Master Deletion 🗑️
              </Link>
              <Link
                href="/billing"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Billing &amp; Licenses
              </Link>
              <Link
                href="/profile"
                className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-black text-white"
              >
                Profile
              </Link>
              <ThemeToggle />
              <EcosystemDropdown currentApp="admin" inverse />
              <Button
                type="button"
                onClick={() => void handleSignOut()}
                className="min-h-10 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-white hover:text-[var(--color-brand-navy)]"
              >
                Sign out
              </Button>
            </div>
          </header>
        </div>
      </section>

      {/* Main Profile View */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 space-y-8">
        <StandardProfileView
          profile={profileData}
          userType="admin"
          onSaveProfile={handleSaveProfile}
          onSignOut={handleSignOut}
          ecosystemLinks={[
            {
              label: "Enter Operational Admin Console",
              href: "/dashboard",
              icon: "🎛️",
            },
            {
              label: "Inspect Master Deletion & Privacy Queue",
              href: "/data-management",
              icon: "🗑️",
            },
            {
              label: "Lurexa Teach Ecosystem Management",
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
              label: "Security Level",
              value: "Master Superadmin",
              description: "Full cryptographic provenance",
            },
            {
              label: "System SLA",
              value: "99.98%",
              description: "Active multi-zone availability",
            },
            {
              label: "Governance",
              value: "Strict Zero-LLM",
              description: "PII isolation enforced",
            },
          ]}
        />
      </div>
    </main>
  );
}

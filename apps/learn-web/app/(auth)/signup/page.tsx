"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { LurexaLearnLogo } from "../../components/LurexaLearnLogo";
import { getEcosystemUrl } from "@lurexa/config/domains";
import { StandardSignupCard, StandardSignupPayload } from "@lurexa/ui/StandardSignupCard";

const ecosystemUrl = getEcosystemUrl("root");

export default function SignupPage() {
  const router = useRouter();

  const handleRegister = async (data: StandardSignupPayload) => {
    // 1. Register User in Firebase Auth
    const user = await AuthService.register(data.email, data.password || "");

    // Store basic profile details if provided
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "lurexa_user_profile",
        JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        })
      );
    }

    // 2. Process Organization Assignment
    if (data.mode === "teacher") {
      if (!data.orgName) throw new Error("Organization name is required.");
      const slug = data.orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      await OrganizationService.createOrganization(data.orgName, slug, user.uid);
    } else if (data.studentPath === "class") {
      if (!data.inviteCode) throw new Error("Invitation code is required.");
      await OrganizationService.joinViaCode(user.uid, user.email ?? data.email, data.inviteCode);
    }

    router.replace(
      data.mode === "teacher"
        ? "/teacher/dashboard"
        : data.studentPath === "self-paced"
          ? "/onboarding"
          : "/dashboard"
    );
  };

  const handleGoogleRegister = async () => {
    try {
      const { user, isNewUser } = await AuthService.loginWithGoogle();
      if (isNewUser) {
        router.replace("/onboarding");
      } else {
        const claims = await AuthService.getUserClaims(user);
        if (claims.role === "teacher" || claims.role === "admin") {
          router.replace("/teacher/dashboard");
        } else {
          router.replace("/dashboard");
        }
      }
    } catch (cause: unknown) {
      if (!AuthService.isPopupDismissedError(cause)) {
        throw cause;
      }
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--learn-canvas)] p-4 sm:p-8">
      <div className="mb-7">
        <LurexaLearnLogo href={ecosystemUrl} />
      </div>
      <StandardSignupCard
        title="Start your Lurexa path."
        subtitle="Join a class or create your educator space."
        defaultMode="student"
        showModeToggle={true}
        onRegister={handleRegister}
        onGoogleSignIn={handleGoogleRegister}
        loginUrl="/login"
      />
    </div>
  );
}


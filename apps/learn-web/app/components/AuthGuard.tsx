"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService, OrganizationService } from "@lurexa/backend";

type AccessLevel = "authenticated" | "teacher";

interface AuthGuardProps {
  children: ReactNode;
  access?: AccessLevel;
}

export function AuthGuard({ children, access = "authenticated" }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isActive = true;
    let hasResolvedAuthState = false;

    const redirectToLogin = () => {
      if (!isActive || hasResolvedAuthState) return;
      hasResolvedAuthState = true;
      router.replace("/login");
    };

    const authTimeout = window.setTimeout(redirectToLogin, 5000);

    const unsubscribe = AuthService.onUserChanged((user) => {
      void (async () => {
        if (hasResolvedAuthState) return;
        hasResolvedAuthState = true;
        window.clearTimeout(authTimeout);

        if (!user) {
          router.replace("/login");
          return;
        }

        if (access === "teacher") {
          try {
            const memberships = await OrganizationService.getMembershipsForUser(user.uid);
            const hasTeacherAccess = memberships.some((membership) =>
              ["owner", "admin", "teacher"].includes(membership.role),
            );

            if (!hasTeacherAccess) {
              router.replace("/dashboard");
              return;
            }
          } catch {
            router.replace("/login");
            return;
          }
        }

        if (isActive) setIsAuthorized(true);
      })();
    });

    return () => {
      isActive = false;
      window.clearTimeout(authTimeout);
      unsubscribe();
    };
  }, [access, router]);

  if (!isAuthorized) {
    return <div className="min-h-screen bg-slate-50 p-8 text-slate-500">Checking access...</div>;
  }

  return <>{children}</>;
}

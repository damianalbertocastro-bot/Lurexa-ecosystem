"use client";

import { ReactNode, Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AuthService, OrganizationService } from "@lurexa/backend";

type AccessLevel = "authenticated" | "teacher";

const legacyLessonRoutes: Record<string, string> = {
  "/learn/a1-preview": "/learn/english-a1-foundations/a1-introduce-yourself",
  "/learn/english-a1/introduce-yourself": "/learn/english-a1-foundations/a1-introduce-yourself",
};

interface AuthGuardProps {
  children: ReactNode;
  access?: AccessLevel;
}

function AuthGuardContent({ children, access = "authenticated" }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const protectedPath = legacyLessonRoutes[pathname] ?? pathname;
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isActive = true;
    let hasResolvedAuthState = false;

    const redirectToLogin = () => {
      if (!isActive || hasResolvedAuthState) return;
      hasResolvedAuthState = true;
      const query = searchParams.toString();
      const continueTo = `${protectedPath}${query ? `?${query}` : ""}`;
      router.replace(`/login?continue=${encodeURIComponent(continueTo)}`);
    };

    const authTimeout = window.setTimeout(redirectToLogin, 5000);

    const unsubscribe = AuthService.onUserChanged((user) => {
      void (async () => {
        if (hasResolvedAuthState) return;
        hasResolvedAuthState = true;
        window.clearTimeout(authTimeout);

        if (!user) {
          const query = searchParams.toString();
          const continueTo = `${protectedPath}${query ? `?${query}` : ""}`;
          router.replace(`/login?continue=${encodeURIComponent(continueTo)}`);
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
            const query = searchParams.toString();
            const continueTo = `${protectedPath}${query ? `?${query}` : ""}`;
            router.replace(`/login?continue=${encodeURIComponent(continueTo)}`);
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
  }, [access, protectedPath, router, searchParams]);

  if (!isAuthorized) {
    return <div className="min-h-screen bg-slate-50 p-8 text-slate-500">Checking access...</div>;
  }

  return <>{children}</>;
}

export function AuthGuard({ children, access = "authenticated" }: AuthGuardProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8 text-slate-500">Checking access...</div>}>
      <AuthGuardContent access={access}>{children}</AuthGuardContent>
    </Suspense>
  );
}

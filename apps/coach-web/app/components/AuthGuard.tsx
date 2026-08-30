"use client";

import { ReactNode, Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@lurexa/backend";

function Guard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    const unsubscribe = AuthService.onUserChanged((user) => {
      if (!active) return;
      if (!user) {
        const query = searchParams.toString();
        const continueTo = `${pathname}${query ? `?${query}` : ""}`;
        router.replace(`/login?continue=${encodeURIComponent(continueTo)}`);
        return;
      }
      setAuthorized(true);
    });
    return () => { active = false; unsubscribe(); };
  }, [pathname, router, searchParams]);

  if (!authorized) return <div className="min-h-screen bg-[var(--lx-surface)] p-8 text-[var(--lx-muted)]">Checking your Lurexa identity…</div>;
  return <>{children}</>;
}

export function AuthGuard({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-[var(--lx-surface)] p-8 text-[var(--lx-muted)]">Checking your Lurexa identity…</div>}><Guard>{children}</Guard></Suspense>;
}

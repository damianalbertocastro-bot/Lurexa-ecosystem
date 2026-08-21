"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTeachAuth } from "./TeachAuthProvider";

export function TeachPrivate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useTeachAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="grid min-h-[55vh] place-items-center px-5 text-sm font-bold text-[#6273a3]" role="status" aria-live="polite">Loading your educator workspace…</div>;
  }

  return <>{children}</>;
}

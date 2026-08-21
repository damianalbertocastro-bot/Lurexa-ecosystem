"use client";

import { usePathname } from "next/navigation";
import { AdminRelatedExperiences } from "./AdminRelatedExperiences";

export function AdminRelatedExperiencesGate() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname.startsWith("/api/")) return null;
  return <AdminRelatedExperiences />;
}

import { ReactNode } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { CoachShell } from "../components/CoachShell";

export default function EducatorLayout({ children }: { children: ReactNode }) {
  return <AuthGuard><CoachShell active="Educators">{children}</CoachShell></AuthGuard>;
}

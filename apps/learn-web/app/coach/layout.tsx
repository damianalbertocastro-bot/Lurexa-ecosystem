import { ReactNode } from "react";
import { AuthGuard } from "../components/AuthGuard";

export default function CoachLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

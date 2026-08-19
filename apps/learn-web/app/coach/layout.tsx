import { ReactNode } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { ProductShell } from "../components/ProductShell";

export default function CoachLayout({ children }: { children: ReactNode }) {
  return <AuthGuard><ProductShell area="Practice space" homeHref="/coach">{children}</ProductShell></AuthGuard>;
}

import { ReactNode } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { ProductShell } from "../components/ProductShell";

export default function LearningLayout({ children }: { children: ReactNode }) {
  return <AuthGuard><ProductShell area="Learner space" product="learn" homeHref="/dashboard">{children}</ProductShell></AuthGuard>;
}

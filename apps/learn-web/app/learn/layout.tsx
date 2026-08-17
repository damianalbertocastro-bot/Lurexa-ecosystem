import { ReactNode } from "react";
import { AuthGuard } from "../components/AuthGuard";

export default function LearningLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

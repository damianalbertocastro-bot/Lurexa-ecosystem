import { ReactNode } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { ProductShell } from "../components/ProductShell";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return <AuthGuard access="teacher"><ProductShell area="Educator space" product="teach" homeHref="/teacher/dashboard">{children}</ProductShell></AuthGuard>;
}

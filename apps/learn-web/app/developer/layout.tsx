import { ReactNode } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { ProductShell } from "../components/ProductShell";

export default function DeveloperLayout({ children }: { children: ReactNode }) {
  return <AuthGuard><ProductShell area="Creator space" homeHref="/developer/api">{children}</ProductShell></AuthGuard>;
}

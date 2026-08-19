import { ReactNode } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { ProductShell } from "../components/ProductShell";

export default function MarketplaceLayout({ children }: { children: ReactNode }) {
  return <AuthGuard><ProductShell area="Creator space" product="studio" homeHref="/marketplace">{children}</ProductShell></AuthGuard>;
}

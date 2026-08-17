import { ReactNode } from "react";
import { AuthGuard } from "../../components/AuthGuard";

export default function MarketplacePublishLayout({ children }: { children: ReactNode }) {
  return <AuthGuard access="teacher">{children}</AuthGuard>;
}

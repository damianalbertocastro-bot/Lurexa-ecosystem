import type { ReactNode } from "react";
import { AuthGuard } from "../components/AuthGuard";

export default function HistoryLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

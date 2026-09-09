import type { ReactNode } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { LearnerMobileBottomBar } from "@lurexa/ui/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="pb-20 md:pb-0">
        {children}
      </div>
      <LearnerMobileBottomBar />
    </AuthGuard>
  );
}

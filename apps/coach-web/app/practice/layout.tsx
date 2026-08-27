import { ReactNode, Suspense } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { CoachShell } from "../components/CoachShell";
import { CoachBridgeArrival } from "./CoachBridgeArrival";

export default function PracticeLayout({ children }: { children: ReactNode }) {
  return <AuthGuard><CoachShell active="Practice"><main className="mx-auto max-w-[1260px] px-5 py-8 sm:px-8"><Suspense fallback={null}><CoachBridgeArrival /></Suspense>{children}</main></CoachShell></AuthGuard>;
}

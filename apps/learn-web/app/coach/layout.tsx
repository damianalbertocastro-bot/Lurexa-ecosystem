import { ReactNode, Suspense } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { ProductShell } from "../components/ProductShell";
import { CoachBridgeArrival } from "./CoachBridgeArrival";

export default function CoachLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <ProductShell area="Practice space" product="coach" homeHref="/coach">
        <Suspense fallback={null}>
          <CoachBridgeArrival />
        </Suspense>
        {children}
      </ProductShell>
    </AuthGuard>
  );
}

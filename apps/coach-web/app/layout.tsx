import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lurexa Coach",
  description: "Adaptive English speaking, pronunciation and fluency practice connected to Lurexa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

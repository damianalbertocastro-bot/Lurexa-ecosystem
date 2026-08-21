import type { Metadata } from "next";
import localFont from "next/font/local";
import { AdminRelatedExperiencesGate } from "./components/AdminRelatedExperiencesGate";
import "./globals.css";

const inter = localFont({ src: "./fonts/InterVariable.woff2", display: "swap", weight: "100 900" });

export const metadata: Metadata = {
  title: { default: "Lurexa Admin | Institutional operations", template: "%s | Lurexa Admin" },
  description: "Institutional administration, access, governance, programs, billing, policy, and operational oversight across Lurexa.",
  applicationName: "Lurexa Admin",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.className} h-full antialiased`}><body className="min-h-full flex flex-col">{children}<AdminRelatedExperiencesGate /></body></html>;
}

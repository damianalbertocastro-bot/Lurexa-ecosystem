import type { Metadata } from "next";
import { SkipToContent } from "@lurexa/ui/SkipToContent";
import { EcosystemSupportWidget } from "@lurexa/ui/EcosystemSupportWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lurexa Learning Technologies",
    template: "%s | Lurexa",
  },
  description: "The Lurexa intelligent learning ecosystem: connected products for learners, educators, institutions, learning intelligence, and content creation.",
  applicationName: "Lurexa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SkipToContent targetId="main-content" />
        {children}
        <EcosystemSupportWidget />
      </body>
    </html>
  );
}

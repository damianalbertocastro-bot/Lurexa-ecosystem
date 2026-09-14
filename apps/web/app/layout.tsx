import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { SkipToContent } from "@lurexa/ui/SkipToContent";
import { EcosystemSupportWidget } from "@lurexa/ui/EcosystemSupportWidget";
import { I18nProvider } from "@lurexa/i18n";
import { resolveServerLocale } from "@lurexa/i18n/server";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a1c55",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Lurexa Learning Technologies",
    template: "%s | Lurexa",
  },
  description: "The Lurexa intelligent learning ecosystem: connected products for learners, educators, institutions, learning intelligence, and content creation.",
  applicationName: "Lurexa",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lurexa",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = resolveServerLocale(cookieStore);

  return (
    <html lang={locale}>
      <body>
        <I18nProvider initialLocale={locale}>
          <SkipToContent targetId="main-content" />
          {children}
          <EcosystemSupportWidget />
        </I18nProvider>
      </body>
    </html>
  );
}

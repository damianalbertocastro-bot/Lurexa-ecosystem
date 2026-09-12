import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { ToastProvider } from "@lurexa/ui/Toast";
import { SkipToContent } from "@lurexa/ui/SkipToContent";
import { EcosystemSupportWidget } from "@lurexa/ui/EcosystemSupportWidget";
import { InsightRelatedExperiences } from "./components/InsightRelatedExperiences";
import { I18nProvider } from "@lurexa/i18n";
import { resolveServerLocale } from "@lurexa/i18n/server";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a192f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Lurexa Insight — Institutional Learning Analytics & Phonemic Intelligence",
    template: "%s | Lurexa Insight",
  },
  description:
    "Enterprise cohort diagnostics, phonemic error heatmaps, and instructional intervention routing.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lurexa Insight",
  },
};

export default async function InsightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = resolveServerLocale(cookieStore);

  return (
    <html lang={locale} data-scroll-behavior="smooth" className="antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("lurexa-theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)]">
        <I18nProvider initialLocale={locale}>
          <SkipToContent targetId="main-content" />
          <ToastProvider>
            {children}
            <InsightRelatedExperiences />
            <EcosystemSupportWidget />
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

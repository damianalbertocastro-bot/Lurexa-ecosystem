import type { Metadata, Viewport } from "next";
import React from "react";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { TeacherGuidanceBanner } from "./components/TeacherGuidanceBanner";
import { OfflineIndicator } from "@lurexa/ui/OfflineIndicator";
import { ToastProvider } from "@lurexa/ui/Toast";
import { SkipToContent } from "@lurexa/ui/SkipToContent";
import { EcosystemSupportWidget } from "@lurexa/ui/EcosystemSupportWidget";
import { I18nProvider } from "@lurexa/i18n";
import { resolveServerLocale } from "@lurexa/i18n/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: { default: "Lurexa Learn | Connected learning", template: "%s | Lurexa Learn" },
  description: "Structured, adaptive learning experiences that connect learner progress, trustworthy evidence, and personalized support across Lurexa.",
  applicationName: "Lurexa Learn",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lurexa Learn",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = resolveServerLocale(cookieStore);

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("lurexa-theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900">
        <I18nProvider initialLocale={locale}>
          <SkipToContent targetId="main-content" />
          <ToastProvider>
            {children}
            <TeacherGuidanceBanner />
            <OfflineIndicator />
            <EcosystemSupportWidget />
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

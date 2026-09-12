import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import { AdminRelatedExperiences } from "./components/AdminRelatedExperiences";
import { ToastProvider } from "@lurexa/ui/Toast";
import { SkipToContent } from "@lurexa/ui/SkipToContent";
import { EcosystemSupportWidget } from "@lurexa/ui/EcosystemSupportWidget";
import { I18nProvider } from "@lurexa/i18n";
import { resolveServerLocale } from "@lurexa/i18n/server";
import "./globals.css";

const inter = localFont({ src: "./fonts/InterVariable.woff2", display: "swap", weight: "100 900" });

export const viewport: Viewport = {
  themeColor: "#070c1d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: { default: "Lurexa Admin | Institutional operations", template: "%s | Lurexa Admin" },
  description: "Institutional administration, access, governance, programs, billing, policy, and operational oversight across Lurexa.",
  applicationName: "Lurexa Admin",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lurexa Admin",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const locale = resolveServerLocale(cookieStore);

  return (
    <html lang={locale} className={`${inter.className} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("lurexa-theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <I18nProvider initialLocale={locale}>
          <SkipToContent targetId="main-content" />
          <ToastProvider>
            {children}
            <AdminRelatedExperiences />
            <EcosystemSupportWidget />
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

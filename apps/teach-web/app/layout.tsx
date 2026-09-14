import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { TeachAuthProvider } from "./components/TeachAuthProvider";
import { ToastProvider } from "@lurexa/ui/Toast";
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
  title: { default: "Lurexa Teach | Grow as an educator", template: "%s | Lurexa Teach" },
  description: "Professional learning, English growth, classroom practice, credentials, and community for teachers.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lurexa Teach",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
      <body>
        <I18nProvider initialLocale={locale}>
          <SkipToContent targetId="main-content" />
          <ToastProvider>
            <TeachAuthProvider>
              {children}
              <EcosystemSupportWidget />
            </TeachAuthProvider>
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import { DocsRelatedExperiences } from "./components/DocsRelatedExperiences";
import { SkipToContent } from "@lurexa/ui/SkipToContent";
import { EcosystemSupportWidget } from "@lurexa/ui/EcosystemSupportWidget";
import { I18nProvider } from "@lurexa/i18n";
import { resolveServerLocale } from "@lurexa/i18n/server";
import "./globals.css";

const geistSans = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-geist-sans" });
const geistMono = localFont({ src: "./fonts/GeistMonoVF.woff", variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Lurexa Docs",
  description: "Guidance for building connected learning experiences with Lurexa.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const locale = resolveServerLocale(cookieStore);

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <I18nProvider initialLocale={locale}>
          <SkipToContent targetId="main-content" />
          {children}
          <DocsRelatedExperiences />
          <EcosystemSupportWidget />
        </I18nProvider>
      </body>
    </html>
  );
}

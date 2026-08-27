import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { LearnRelatedExperiences } from "./components/LearnRelatedExperiences";
import { TeacherGuidanceBanner } from "./components/TeacherGuidanceBanner";
import { OfflineIndicator } from "@lurexa/ui/OfflineIndicator";
import { ToastProvider } from "@lurexa/ui/Toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: { default: "Lurexa Learn | Connected learning", template: "%s | Lurexa Learn" },
  description: "Structured, adaptive learning experiences that connect learner progress, trustworthy evidence, and personalized support across Lurexa.",
  applicationName: "Lurexa Learn",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("lurexa-theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900">
        <ToastProvider>
          {children}
          <TeacherGuidanceBanner />
          <LearnRelatedExperiences />
          <OfflineIndicator />
        </ToastProvider>
      </body>
    </html>
  );
}

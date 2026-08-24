import type { Metadata } from "next";
import React from "react";
import { LearnRelatedExperiences } from "./components/LearnRelatedExperiences";
import { TeacherGuidanceBanner } from "./components/TeacherGuidanceBanner";
import { OfflineIndicator } from "@lurexa/ui/OfflineIndicator";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Lurexa Learn | Connected learning", template: "%s | Lurexa Learn" },
  description: "Structured, adaptive learning experiences that connect learner progress, trustworthy evidence, and personalized support across Lurexa.",
  applicationName: "Lurexa Learn",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
        <TeacherGuidanceBanner />
        <LearnRelatedExperiences />
        <OfflineIndicator />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ToastProvider } from "@lurexa/ui/Toast";
import { SkipToContent } from "@lurexa/ui/SkipToContent";
import { InsightRelatedExperiences } from "./components/InsightRelatedExperiences";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lurexa Insight — Institutional Learning Analytics & Phonemic Intelligence",
    template: "%s | Lurexa Insight",
  },
  description:
    "Enterprise cohort diagnostics, phonemic error heatmaps, and instructional intervention routing.",
};

export default function InsightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("lurexa-theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)]">
        <SkipToContent targetId="main-content" />
        <ToastProvider>
          {children}
          <InsightRelatedExperiences />
        </ToastProvider>
      </body>
    </html>
  );
}

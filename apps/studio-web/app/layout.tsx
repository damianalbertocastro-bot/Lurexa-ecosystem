import type { Metadata } from "next";
import { ToastProvider } from "@lurexa/ui/Toast";
import { SkipToContent } from "@lurexa/ui/SkipToContent";
import { StudioRelatedExperiences } from "./components/StudioRelatedExperiences";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lurexa Studio — Learning Object Authoring & CEFR Governance",
    template: "%s | Lurexa Studio",
  },
  description:
    "Author, lint, and publish immutable CEFR-aligned learning objects and articulatory remediation activities across the Lurexa ecosystem.",
};

export default function RootLayout({
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
          <StudioRelatedExperiences />
        </ToastProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ToastProvider } from "@lurexa/ui/Toast";
import { SkipToContent } from "@lurexa/ui/SkipToContent";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lurexa Coach | AI English Speaking & Pronunciation Studio",
    template: "%s | Lurexa Coach",
  },
  description:
    "Focused, context-aware English speaking, pronunciation, and fluency practice optimizing for intelligibility and communicative control.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("lurexa-theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <SkipToContent targetId="main-content" />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

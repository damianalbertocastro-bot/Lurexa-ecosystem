import type { Metadata } from "next";
import localFont from "next/font/local";
import { AdminRelatedExperiences } from "./components/AdminRelatedExperiences";
import { ToastProvider } from "@lurexa/ui/Toast";
import "./globals.css";

const inter = localFont({ src: "./fonts/InterVariable.woff2", display: "swap", weight: "100 900" });

export const metadata: Metadata = {
  title: { default: "Lurexa Admin | Institutional operations", template: "%s | Lurexa Admin" },
  description: "Institutional administration, access, governance, programs, billing, policy, and operational oversight across Lurexa.",
  applicationName: "Lurexa Admin",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("lurexa-theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          {children}
          <AdminRelatedExperiences />
        </ToastProvider>
      </body>
    </html>
  );
}

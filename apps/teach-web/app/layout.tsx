import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TeachAuthProvider } from "./components/TeachAuthProvider";
import { TeachRelatedExperiences } from "./components/TeachRelatedExperiences";
import { ToastProvider } from "@lurexa/ui/Toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Lurexa Teach | Grow as an educator", template: "%s | Lurexa Teach" },
  description: "Professional learning, English growth, classroom practice, credentials, and community for teachers.",
};

export default function RootLayout({ children }: Readonly<{ children: any }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("lurexa-theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ToastProvider>
          <TeachAuthProvider>
            {children}
            <TeachRelatedExperiences />
          </TeachAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

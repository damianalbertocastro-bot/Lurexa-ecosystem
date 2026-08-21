import type { Metadata } from "next";
import localFont from "next/font/local";
import { DocsRelatedExperiences } from "./components/DocsRelatedExperiences";
import "./globals.css";

const geistSans = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-geist-sans" });
const geistMono = localFont({ src: "./fonts/GeistMonoVF.woff", variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Lurexa Docs",
  description: "Guidance for building connected learning experiences with Lurexa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}<DocsRelatedExperiences /></body></html>;
}

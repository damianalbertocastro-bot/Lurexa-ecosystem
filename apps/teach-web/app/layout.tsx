import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TeachAuthProvider } from "./components/TeachAuthProvider";
import { TeachRelatedExperiences } from "./components/TeachRelatedExperiences";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Lurexa Teach | Grow as an educator", template: "%s | Lurexa Teach" },
  description: "Professional learning, English growth, classroom practice, credentials, and community for teachers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}><body><TeachAuthProvider>{children}<TeachRelatedExperiences /></TeachAuthProvider></body></html>;
}

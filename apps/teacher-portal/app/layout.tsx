import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TeacherRelatedExperiences } from "./components/TeacherRelatedExperiences";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lurexa Learn | Teacher Dashboard",
  description: "Teacher workspace for managing classes, assignments, learner progress, and learning support inside Lurexa Learn.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="min-h-full flex flex-col">{children}<TeacherRelatedExperiences /></body></html>;
}

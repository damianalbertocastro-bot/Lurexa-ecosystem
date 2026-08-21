import localFont from "next/font/local";
import { AdminRelatedExperiences } from "./components/AdminRelatedExperiences";
import "./globals.css";

const inter = localFont({ src: "./fonts/InterVariable.woff2", display: "swap", weight: "100 900" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.className} h-full antialiased`}><body className="min-h-full flex flex-col">{children}<AdminRelatedExperiences /></body></html>;
}

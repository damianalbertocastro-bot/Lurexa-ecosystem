import React from "react";
import "./globals.css";

export const metadata = {
  title: "Lurexa — Intelligent Learning Ecosystem",
  description: "AI-powered adaptive learning platform for students and educators.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}

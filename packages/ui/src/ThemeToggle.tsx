"use client";

import React, { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("lurexa-theme") as "light" | "dark" | null;
    const initial =
      saved ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("lurexa-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!mounted) {
    return (
      <div className={`h-9 w-9 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] text-sm shadow-sm transition hover:bg-[var(--lx-canvas)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring)] ${className}`}
    >
      <span aria-hidden="true">{theme === "light" ? "🌙" : "☀️"}</span>
    </button>
  );
}

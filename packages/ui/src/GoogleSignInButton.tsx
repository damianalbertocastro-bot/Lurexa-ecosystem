"use client";

import React from "react";
import { useTranslation } from "@lurexa/i18n";

export interface GoogleSignInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "default" | "inverse";
  isLoading?: boolean;
}

/**
 * Standard SVG Google "G" logo complying with official brand guidelines.
 */
function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function GoogleSignInButton({
  text,
  variant = "default",
  isLoading = false,
  disabled,
  className = "",
  type = "button",
  ...props
}: GoogleSignInButtonProps) {
  const { t } = useTranslation();
  const label = text ?? t("actions.continueWithGoogle", "Continue with Google");

  const baseStyles =
    "inline-flex w-full min-h-11 items-center justify-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold tracking-[-0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]";

  const variantStyles =
    variant === "inverse"
      ? "border border-slate-700 bg-slate-900 text-white shadow-sm hover:border-slate-500 hover:bg-slate-800 hover:shadow"
      : "border border-[var(--lx-border)] bg-white text-[var(--lx-ink)] shadow-xs hover:border-slate-400 hover:bg-slate-50/80 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-slate-500 dark:hover:bg-slate-800";

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--lx-primary)] border-t-transparent motion-reduce:animate-none"
        />
      ) : (
        <GoogleIcon />
      )}
      <span>{label}</span>
    </button>
  );
}

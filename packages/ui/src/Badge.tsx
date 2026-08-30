import React from "react";

export interface BadgeProps { children: React.ReactNode; variant?: "default" | "success" | "warning" | "info"; className?: string; }

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const styles = {
    default: "bg-[var(--lx-canvas)] text-[var(--lx-secondary)] border border-[var(--lx-border)]",
    success: "bg-[var(--lx-success-surface)] text-[var(--lx-success)] border border-[var(--lx-success)]/20",
    warning: "bg-[var(--lx-warning-surface)] text-[var(--lx-warning)] border border-[var(--lx-warning)]/20",
    info: "bg-[var(--lx-info-surface)] text-[var(--lx-info)] border border-[var(--lx-info)]/20",
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold tracking-[-.01em] ${styles[variant]} ${className}`}>{children}</span>;
};
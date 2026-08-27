import React from "react";

export interface BadgeProps { children: React.ReactNode; variant?: "default" | "success" | "warning" | "info"; className?: string; }

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const styles = {
    default: "bg-[#eef3ff] text-[var(--lx-secondary)]",
    success: "bg-[#e4f8f2] text-[#137867]",
    warning: "bg-[#fff3dc] text-[#a66013]",
    info: "bg-[#eee9ff] text-[var(--lx-primary)]",
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold tracking-[-.01em] ${styles[variant]} ${className}`}>{children}</span>;
};
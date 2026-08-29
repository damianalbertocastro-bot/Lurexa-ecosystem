import React from "react";

export interface CardProps { children: React.ReactNode; title?: string; subtitle?: string; action?: React.ReactNode; className?: string; }

export const Card: React.FC<CardProps> = ({ children, title, subtitle, action, className = "" }) => (
  <div className={`animate-fade-slide-up rounded-[22px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-[var(--lx-card-shadow)] transition-all duration-200 hover:border-[var(--lx-secondary)]/30 hover:shadow-[var(--lx-card-hover-shadow)] ${className}`}>
    {(title || subtitle || action) && <div className="mb-5 flex items-start justify-between gap-4"><div>{title && <h3 className="text-lg font-bold tracking-[-.03em] text-[var(--lx-ink)]">{title}</h3>}{subtitle && <p className="mt-1 text-sm leading-5 text-[var(--lx-muted)]">{subtitle}</p>}</div>{action && <div className="shrink-0">{action}</div>}</div>}
    {children}
  </div>
);
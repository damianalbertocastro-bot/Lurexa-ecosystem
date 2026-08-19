import React from "react";

export interface CardProps { children: React.ReactNode; title?: string; subtitle?: string; action?: React.ReactNode; className?: string; }

export const Card: React.FC<CardProps> = ({ children, title, subtitle, action, className = "" }) => (
  <div className={`rounded-[22px] border border-[#dfe7fb] bg-white p-6 shadow-[0_12px_30px_rgba(32,52,128,.07)] transition duration-200 hover:shadow-[0_18px_38px_rgba(32,52,128,.11)] ${className}`}>
    {(title || subtitle || action) && <div className="mb-5 flex items-start justify-between gap-4"><div>{title && <h3 className="text-lg font-bold tracking-[-.03em] text-[#071d67]">{title}</h3>}{subtitle && <p className="mt-1 text-sm leading-5 text-slate-500">{subtitle}</p>}</div>{action && <div className="shrink-0">{action}</div>}</div>}
    {children}
  </div>
);